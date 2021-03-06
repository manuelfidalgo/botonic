#!/bin/zsh
set -e
# Useful to clone the contents flow from a space when the target locales are different.
# It clones the specifying exported json file with the requested changes
# See LocaleMigrator class

FROM_FILE=$1
FROM_FILE="$( cd "$( dirname "$FROM_FILE" )" && pwd )/$(basename $FROM_FILE)"

TO_FILE=$2
TO_FILE="$( cd "$( dirname "$TO_FILE" )" && pwd )/$(basename $TO_FILE)"

FROM_LOCALE=$3
TO_LOCALE=$4
REMOVE_LOCALES=$5


BIN_DIR=${0:a:h}
cd "$BIN_DIR"/../.. || exit

if [[ $# -lt 4 ]]; then
	../../node_modules/.bin/ts-node --files	src/tools/l10n/locale-migrate.ts --help
	exit 1
fi


../../node_modules/.bin/ts-node --files	src/tools/l10n/locale-migrate.ts \
	"$FROM_FILE" "$TO_FILE" "$FROM_LOCALE" "$TO_LOCALE" "$REMOVE_LOCALES"
echo "Change Element.image so that it does not have 1 version per locale"
