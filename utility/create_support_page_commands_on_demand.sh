#!/bin/bash

DIR="$(cd "$(dirname "$0")" && pwd)"
CMD_DIR="../commands/prefix/FGO"

echo "Deleting pre-existing EN and JP Edit Support Commands";
find $DIR/$CMD_DIR/ -name 'jp-profile-edit-support-*.js' -delete
find $DIR/$CMD_DIR/ -name 'en-profile-edit-support-*.js' -delete
echo "Done deleting"

if (("$1" > "0"))
then
    echo "Creating $1 EN and JP Edit Support Commands";
    for ((i = 1; i <= $1; i++))
    do
        cp $DIR/jp-profile-edit-support.js $DIR/$CMD_DIR/jp-profile-edit-support-$i.js
        cp $DIR/en-profile-edit-support.js $DIR/$CMD_DIR/en-profile-edit-support-$i.js
        if (("$i" < "$1"))
        then
            p=$((i+1))
            perl $DIR/str_replace.pl "const page = $i;" "const page = $p;" $DIR/jp-profile-edit-support.js
            perl $DIR/str_replace.pl "const page = $i;" "const page = $p;" $DIR/en-profile-edit-support.js
        fi
    done
    perl $DIR/str_replace.pl "const page = $1;" "const page = 1;" $DIR/jp-profile-edit-support.js
    perl $DIR/str_replace.pl "const page = $1;" "const page = 1;" $DIR/en-profile-edit-support.js
    echo "Done creating support pages";
fi

