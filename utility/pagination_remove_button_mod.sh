#!/bin/sh

DIR="$(cd "$(dirname "$0")" && pwd)"
FILE="node_modules/@acegoal07/discordjs-pagination/lib/MessagePagination.js"
TEXT="return pagination.edit({ components: [await DisabledButtonCreator(paginationInfo.buttonList)] });"
REPLACEMENT="return pagination.edit({ components: [] });"

perl $DIR/str_replace.pl "$TEXT" "$REPLACEMENT" $FILE
