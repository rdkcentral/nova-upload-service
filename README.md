Nova Upload Service
=========

## Getting started
### Requirements

- [Node / npm](https://nodejs.org/en/)
- [Docker desktop](https://docs.docker.com/get-docker/)

> Please make sure that you are running the most recent versions of Docker Desktop  that your operating system supports.

> For windows installation Docker requires WSL 2 (Windows Subsystem for Linux) for proper operation.
(If your WSL is not updated, Docker shows the prompt to update WSL with a link when you try to run it.)

### Configuration

For non-production environments, copying `.env.example` as `.env` is enough for setting up the environment variables. You can find a list of all the environment variables below :

| Variable | Default | Description |
| --- | --- | --- |
| `NODE_PORT` | `3000` | the port number for API to listen to |
| `JWT_SECRET_KEY` | `secret` | the secret key for JWT |
| `MONGODB_HOST` | `mongo` | the host name for MongoDB |
| `MONGODB_PORT` | `27017` | the port number for MongoDB |
| `MONGODB_DB` | `novaUploadService` | the database name for MongoDB |
| `MAX_REQUEST_BODY_SIZE` | `1mb` | the maximum size of request body |
| `AWS_ACCESS_KEY_ID` | `myAccessKey` | the access key for AWS (or locally Minio) |
| `AWS_SECRET_ACCESS_KEY` | `mySecretKey` | the secret key for AWS (or locally Minio) |
| `AWS_REGION` | `us-east-1` | the region for AWS (or locally Minio) |
| `AWS_S3_BUCKET` | `nova` | the bucket name for AWS (or locally Minio) |
| `AWS_S3_ENDPOINT` | `http://localhost:9000` | the endpoint for AWS (can be `null` for production) |
| `JWT_VALID_FOR` | `10800` | the token expiry time in seconds |


### Running Dev Environment

The Nova Upload Service uses MongoDB as the database and Minio as the S3 storage. To run all required services at once, we use Docker Compose. To run the dev environment, run the following command in the root directory of the project :

```bash
# install dependencies
npm install

# build & run Docker containers
docker-compose up
```

> If you are using Windows, please note that sometimes the line endings of files are changed to CRLF. This can cause problems with Docker Compose and you may get some errors while running `docker-compose up` command. To fix this, at least, you must convert the line endings of `docker.init.sh` to LF.

#### Managing Database

To access the database, you can use MongoDB Compass or any other MongoDB GUI. The default connection string is `mongodb://localhost:27017/novaUploadService` while Docker Compose services are running.

You can also use the mongo-express service included in the Docker Compose file. To access mongo-express, go to `http://localhost:8081` in your browser. The default username is `root` and the password is `example`.

#### Managing S3 Storage
We use the Minio service to mimic the S3 storage in the dev environment. To access the Minio admin panel, you can go to `http://localhost:9001` in your browser. The default username is `myAccessKey` and the password is `mySecretKey`.

> Every time you run `docker-compose up` command, the current setup tries to make sure a Minio bucket named `nova` exists. If the bucket does not exist, it will be created. If the bucket exists, it will give an error. You can ignore this error. In both cases, the service used for creating the bucket will automatically stop and that is also normal.

## API Routes

[Routes List](./docs/apiRoutes.md)

## Creating Docker Production Image

The Nova Upload Service was planned to deploy as Lambda functions. The project supports running a standalone run Node.js framework too.
You should use Dockerfile.production to deploy as a container for the production and stages environments.

```bash
# Create image with "nova-upload-service-prod: tag
docker build -t nova-upload-service-prod -f Dockerfile.prod .

```
