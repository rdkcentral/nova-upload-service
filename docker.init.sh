#/bin/sh

command="$@"

# check if node_modules exists
if [ ! -d /usr/src/app/node_modules ]; then

    echo "node_modules directory does not exist, copying from the container";
    cp -R /opt/npm/node_modules /usr/src/app/node_modules;

    # this is required to make the folder writable for the host
    chmod -R 777 /usr/src/app/node_modules;

fi;

# check if package-lock exists
if [ ! -f /usr/src/app/package-lock.json ]; then

    echo "package-lock.json does not exists, copying from the container";
    cp /opt/npm/package-lock.json /usr/src/app/package-lock.json;
    chmod 777 /usr/src/app/package-lock.json;

fi;

# check if package-lock.json is different
md5sum -c /opt/npm/package-lock.json.md5sum;
if [ $? -ne 0 ]; then

    echo "package-lock.json has changed, deleting it and running npm install again";

    rm package-lock.json && npm install;
    cp -R node_modules package-lock.json /opt/npm/.;
    md5sum package-lock.json > /opt/npm/package-lock.json.md5sum;

    echo "package-lock.json checksum has been updated";

fi;

echo "Running the command '$command' ...";
exec $command
