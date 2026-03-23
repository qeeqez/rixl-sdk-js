#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
INPUT_SPEC="${ROOT_DIR}/openapi/public.swagger.json"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TMP_DIR}"' EXIT

cd "${ROOT_DIR}"

ALL_SERVICES=(feeds videos images)

require_command() {
	local command="$1"
	if ! command -v "${command}" >/dev/null 2>&1; then
		echo "${command} is required" >&2
		exit 1
	fi
}

usage() {
	cat <<'EOF'
Usage:
  ./scripts/generate.sh [--service feeds|videos|images] [--spec /path/to/swagger.json]
EOF
}

validate_service() {
	local service="$1"
	case "${service}" in
		feeds|videos|images) ;;
		*)
			echo "unsupported service: ${service}" >&2
			echo "supported services: feeds, videos, images" >&2
			exit 1
			;;
	esac
}

service_arg=""
spec_arg=""

while [[ $# -gt 0 ]]; do
	case "$1" in
		--service)
			[[ $# -ge 2 ]] || { echo "--service requires a value" >&2; exit 1; }
			service_arg="$2"
			shift 2
			;;
		--spec)
			[[ $# -ge 2 ]] || { echo "--spec requires a value" >&2; exit 1; }
			spec_arg="$2"
			shift 2
			;;
		-h|--help|help)
			usage
			exit 0
			;;
		*)
			echo "unknown argument: $1" >&2
			usage
			exit 1
			;;
	esac
done

if [[ -n "${service_arg}" ]]; then
	validate_service "${service_arg}"
fi

if [[ -n "${spec_arg}" ]]; then
	"${SCRIPT_DIR}/prepare-spec.sh" "${spec_arg}"
fi

require_command java
require_command npx
require_command jq
require_command perl
require_command rsync

if [[ ! -f "${INPUT_SPEC}" ]]; then
	echo "sanitized SDK spec not found at ${INPUT_SPEC}" >&2
	echo "run scripts/prepare-spec.sh first or pass --spec /path/to/swagger.json" >&2
	exit 1
fi

services=("${ALL_SERVICES[@]}")
if [[ -n "${service_arg}" ]]; then
	services=("${service_arg}")
fi

mkdir -p "${ROOT_DIR}/sdk"

for service in "${services[@]}"; do
	service_spec="${TMP_DIR}/${service}.swagger.json"
	service_tmp="${TMP_DIR}/out-${service}"
	output_dir="${ROOT_DIR}/sdk/${service}"
	package_name="@rixl/sdk-js-${service}"

	"${SCRIPT_DIR}/split-spec.sh" "${INPUT_SPEC}" "${service}" "${service_spec}"

	npx -y @openapitools/openapi-generator-cli generate \
		-g javascript \
		-i "${service_spec}" \
		-o "${service_tmp}" \
		--global-property apiDocs=false,modelDocs=false,apiTests=false,modelTests=false \
		--additional-properties "projectName=rixl-sdk-js-${service},projectVersion=2.0.0,sourceFolder=src,apiPackage=services,modelPackage=models,usePromises=true,emitJSDoc=true,modelPropertyNaming=original,sortParamsByRequiredFlag=true,sortModelPropertiesByRequiredFlag=true,disallowAdditionalPropertiesIfNotPresent=false"

	tmp_package_json="$(mktemp)"
	jq --arg pkg "${package_name}" --arg service "${service}" '
		.name = $pkg
		| .description = ("RIXL public JavaScript SDK for " + $service + " generated from the public OpenAPI spec.")
		| .author = "Rixl Inc."
		| .homepage = "https://rixl.com"
		| .license = "SEE LICENSE IN LICENSE.md"
		| .repository = {
			"type": "git",
			"url": "https://github.com/qeeqez/rixl-sdk-js.git"
		}
		| .files = ["src"]
		| .publishConfig = {"access": "public"}
		| .keywords = ["rixl", "sdk", "api", "openapi", "javascript", $service]
	' "${service_tmp}/package.json" > "${tmp_package_json}"
	mv "${tmp_package_json}" "${service_tmp}/package.json"

	perl -0pi -e 's{localhost API}{RIXL public API}g; s{\*http://localhost\*}{*https://api.rixl.com*}g' "${service_tmp}/README.md"

	rm -rf "${service_tmp}/.openapi-generator"
	rm -f "${service_tmp}/git_push.sh"

	mkdir -p "${output_dir}"
	rsync -a --delete \
		--exclude '.git' \
		"${service_tmp}/" "${output_dir}/"
done

echo "Generated JavaScript SDK services under ${ROOT_DIR}/sdk"
