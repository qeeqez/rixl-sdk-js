#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
DEFAULT_INPUT_SPEC="${ROOT_DIR}/../api/docs/public/swagger.json"
INPUT_SPEC="${1:-${DEFAULT_INPUT_SPEC}}"
OUTPUT_SPEC="${ROOT_DIR}/openapi/public.swagger.json"
PUBLIC_API_HOST="${RIXL_PUBLIC_API_HOST:-api.rixl.com}"
PUBLIC_API_SCHEME="${RIXL_PUBLIC_API_SCHEME:-https}"

if ! command -v jq >/dev/null 2>&1; then
	echo "jq is required to prepare the public SDK spec" >&2
	exit 1
fi

if [[ ! -f "${INPUT_SPEC}" ]]; then
	echo "public swagger spec not found at ${INPUT_SPEC}" >&2
	echo "pass the source swagger.json path explicitly if api repo is not checked out next to this repo" >&2
	exit 1
fi

mkdir -p "$(dirname -- "${OUTPUT_SPEC}")"

jq --arg host "${PUBLIC_API_HOST}" --arg scheme "${PUBLIC_API_SCHEME}" '
	def strip_parameter_examples:
		walk(
			if type == "object" and has("in") then
				del(.example)
			else
				.
			end
		);

	def sanitize_operation_id:
		gsub("[^A-Za-z0-9_]"; "_")
		| gsub("_+"; "_")
		| sub("^_"; "")
		| sub("_$"; "");

	def default_operation_id($method; $path):
		($method + "_" + ($path
			| gsub("\\{"; "")
			| gsub("\\}"; "")
			| gsub("/"; "_")
			| gsub("-"; "_")
			| sanitize_operation_id));

	def is_http_method($method):
		(["get", "post", "put", "patch", "delete", "options", "head"] | index($method)) != null;

	def ensure_operation_ids:
		.paths |= (
			to_entries
			| map(
				.key as $path
				| .value |= (
					to_entries
					| map(
						.key as $method
						| if is_http_method($method) then
							.value |= if ((.operationId // "") | length) == 0
								then . + {operationId: default_operation_id($method; $path)}
								else .
							end
						else
							.
						end
					)
					| from_entries
				)
			)
			| from_entries
		);

	def normalize_multipart_file_parameters:
		walk(
			if type == "object" and has("in") and .in == "formData" then
				if ((.type // "") == "file") then
					. + {type: "string", format: "binary"}
				elif ((.type // "") == "array") and (.items? != null) and ((.items.type // "") == "file") then
					.items = (.items + {type: "string", format: "binary"})
				else
					.
				end
			else
				.
			end
		);

	def strip_bearer_security:
		walk(
			if type == "object" and has("security") and (.security | type) == "array" then
				.security = [ .security[] | select(has("Bearer") | not) ]
				| if (.security | length) == 0 then del(.security) else . end
			else
				.
			end
		);

	strip_parameter_examples
	| ensure_operation_ids
	| normalize_multipart_file_parameters
	| strip_bearer_security
	| if has("securityDefinitions") then .securityDefinitions |= del(.Bearer) else . end
	| .host = $host
	| .schemes = [$scheme]
	| .basePath = "/"
' "${INPUT_SPEC}" > "${OUTPUT_SPEC}"

echo "Prepared SDK input spec at ${OUTPUT_SPEC}"
