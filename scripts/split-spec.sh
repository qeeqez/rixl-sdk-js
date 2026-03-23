#!/usr/bin/env bash

set -euo pipefail

if [[ $# -ne 3 ]]; then
	echo "usage: $0 <input-spec> <service> <output-spec>" >&2
	exit 1
fi

INPUT_SPEC="$1"
SERVICE="$2"
OUTPUT_SPEC="$3"

if ! command -v jq >/dev/null 2>&1; then
	echo "jq is required to split the public SDK spec" >&2
	exit 1
fi

if [[ ! -f "${INPUT_SPEC}" ]]; then
	echo "input spec not found at ${INPUT_SPEC}" >&2
	exit 1
fi

case "${SERVICE}" in
	feeds)
		TAG="Feeds"
		;;
	videos)
		TAG="Videos"
		;;
	images)
		TAG="Images"
		;;
	*)
		echo "unsupported service: ${SERVICE}" >&2
		echo "supported services: feeds, videos, images" >&2
		exit 1
		;;
esac

mkdir -p "$(dirname -- "${OUTPUT_SPEC}")"

jq --arg tag "${TAG}" '
	.tags = [(.tags // [])[] | select(.name == $tag)]
	| .paths |= with_entries(
		.value |= with_entries(select((.value.tags // []) | index($tag)))
		| select((.value | length) > 0)
	)
' "${INPUT_SPEC}" > "${OUTPUT_SPEC}"

echo "Prepared ${SERVICE} SDK spec at ${OUTPUT_SPEC}"
