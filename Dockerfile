FROM node:lts

EXPOSE 3000

# set workdir & copy all files
WORKDIR /usr/src/app
COPY . .

# install npm packages
RUN npm cache verify && npm install

# backup node_modules & package-lock.json
RUN mkdir -p /opt/npm && cp -R node_modules package-lock.json /opt/npm/.

# get checksum
RUN md5sum package-lock.json > /opt/npm/package-lock.json.md5sum

# run application
CMD ["./docker.init.sh", "npm", "run", "start:dev"]
