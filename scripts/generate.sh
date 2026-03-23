#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
INPUT_SPEC="${ROOT_DIR}/openapi/public.swagger.json"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TMP_DIR}"' EXIT

require_command() {
	local command="$1"
	if ! command -v "${command}" >/dev/null 2>&1; then
		echo "${command} is required" >&2
		exit 1
	fi
}

if [[ $# -gt 1 ]]; then
	echo "usage: $0 [path-to-public-swagger.json]" >&2
	exit 1
fi

if [[ $# -eq 1 ]]; then
	"${SCRIPT_DIR}/prepare-spec.sh" "$1"
fi

require_command java
require_command npx
require_command jq
require_command perl
require_command rsync

if [[ ! -f "${INPUT_SPEC}" ]]; then
	echo "sanitized SDK spec not found at ${INPUT_SPEC}" >&2
	echo "run scripts/prepare-spec.sh first or pass a swagger.json path to this script" >&2
	exit 1
fi

npx -y @openapitools/openapi-generator-cli generate \
	-g typescript \
	-i "${INPUT_SPEC}" \
	-o "${TMP_DIR}" \
	--global-property apiTests=false,modelTests=false \
	--additional-properties "npmName=@rixl/api-sdk,npmVersion=2.0.0,supportsES6=true,useSingleRequestParameter=true,stringEnums=true,withInterfaces=true,modelPropertyNaming=original,enumPropertyNaming=original,disallowAdditionalPropertiesIfNotPresent=false"

tmp_package_json="$(mktemp)"
jq '
	.name = "@rixl/api-sdk"
	| .description = "RIXL public JavaScript SDK generated from the public OpenAPI spec."
	| .author = "Rixl Inc."
	| .homepage = "https://rixl.com"
	| .license = "SEE LICENSE IN LICENSE.md"
	| .repository = {
		"type": "git",
		"url": "https://github.com/qeeqez/rixl-sdk-js.git"
	}
	| .files = ["dist"]
	| .publishConfig = {"access": "public"}
	| .keywords = ["rixl", "sdk", "api", "openapi", "typescript", "javascript"]
' "${TMP_DIR}/package.json" > "${tmp_package_json}"
mv "${tmp_package_json}" "${TMP_DIR}/package.json"

perl -0pi -e 's{localhost API}{RIXL public API}g; s{\*http://localhost\*}{*https://api.rixl.com*}g' "${TMP_DIR}/README.md"

rm -rf "${TMP_DIR}/.openapi-generator"
rm -f "${TMP_DIR}/git_push.sh"

rsync -a --delete \
	--exclude '.git' \
	--exclude 'scripts' \
	--exclude 'openapi' \
	--exclude 'openapitools.json' \
	"${TMP_DIR}/" "${ROOT_DIR}/"

echo "Generated JavaScript SDK at ${ROOT_DIR}"
