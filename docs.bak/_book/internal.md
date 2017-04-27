### Build Docker images

#### AWS Lambda - NodeJS

Get latest ubuntu docker image:

`docker run ubuntu`

Run image in detached mode:

`docker run -it -d ubuntu`

Get ubuntu's live container id:

`docker ps -a`

Get into the machine:

`docker exec -ti CONTAINER_ID bash`

Install requirements

```
apt-get -y update
apt-get -y install build-essential libssl-dev curl python rsync
curl https://raw.githubusercontent.com/creationix/nvm/v0.30.2/install.sh | bash
source ~/.profile
nvm install NODE_VERSION
nvm use NODE_VERSION
ln -s /root/.nvm/versions/node/`nvm current`/bin/node /usr/bin/node
ln -s /root/.nvm/versions/node/`nvm current`/bin/npm /usr/bin/npm
npm install aws-sdk -g
history -c
exit
```

Commit container

```
docker commit CONTAINER_ID squeezerio/aws-nodejs-NODE_VERSION
docker push squeezerio/aws-nodejs-NODE_VERSION
```

### Generate a development-ready template

In order to get a template skeleton on your local drive please run the next command inside of the 
Squeezer framework source directory:

```
$ npm run gentemplate -- --template=aws-api-rest-nodejs --key=70d10b4ddaa91ac1c3aed2ca61f581b966880fa6412b1956ab418ec0506f48f7049119e6fcbe9a5bdf
```
