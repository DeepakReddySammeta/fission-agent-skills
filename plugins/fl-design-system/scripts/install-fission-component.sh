#!/usr/bin/env bash
# Installs or updates a Fission-owned shadcn component from the Fission registry.
# Never calls bare `npx shadcn add <name>` for a Fission-owned name — that pulls
# the unbranded shadcn default and silently drops Fission's theming.
#
# Usage:
#   install-fission-component.sh button
#   install-fission-component.sh button --overwrite

set -euo pipefail

REGISTRY_BASE="https://FissionHQ.github.io/ui-design-system/r"
FISSION_OWNED=(button input card dialog table form badge select tabs toast)

name="${1:-}"
flag="${2:-}"

if [[ -z "$name" ]]; then
  echo "Usage: $0 <component-name> [--overwrite]" >&2
  exit 1
fi

is_owned=false
for owned in "${FISSION_OWNED[@]}"; do
  if [[ "$owned" == "$name" ]]; then
    is_owned=true
    break
  fi
done

if [[ "$is_owned" == false ]]; then
  echo "'$name' is not one of Fission's owned components (${FISSION_OWNED[*]})." >&2
  echo "Install it as a plain shadcn primitive instead: npx shadcn add $name" >&2
  exit 1
fi

cmd=(npx shadcn add "${REGISTRY_BASE}/${name}.json")
if [[ "$flag" == "--overwrite" ]]; then
  cmd+=(--overwrite)
fi

echo "Running: ${cmd[*]}"
"${cmd[@]}"
