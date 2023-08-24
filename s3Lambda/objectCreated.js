exports.handler = async function (event, context) {
  const bucket = event.Records[0].s3.bucket.name
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, ' ')
  )
  /*
  Sample event record:

  {
    "Records": [
      {
        "eventVersion": "2.0",
        "eventSource": "minio:s3",
        "awsRegion": "",
        "eventTime": "2023-08-24T08:36:23.013Z",
        "eventName": "s3:ObjectCreated:Put",
        "userIdentity": {
          "principalId": "myAccessKey"
        },
        "requestParameters": {
          "principalId": "myAccessKey",
          "region": "",
          "sourceIPAddress": "172.18.0.5"
        },
        "responseElements": {
          "content-length": "0",
          "x-amz-request-id": "177E44D30262FC78",
          "x-minio-deployment-id": "2ca44632-7037-4164-bfe5-ff4a8f1d0865",
          "x-minio-origin-endpoint": "http://172.18.0.5:9000"
        },
        "s3": {
          "s3SchemaVersion": "1.0",
          "configurationId": "Config",
          "bucket": {
            "name": "ugap",
            "ownerIdentity": {
              "principalId": "myAccessKey"
            },
            "arn": "arn:aws:s3:::ugap"
          },
          "object": {
            "key": "deneme/Screenshot 2023-07-04 at 03.23.45.png",
            "size": 257858,
            "eTag": "bfc2a8650585bedaffa3fc617c9e22f2",
            "contentType": "image/png",
            "userMetadata": {
              "content-type": "image/png"
            },
            "sequencer": "177E44D302CE33BC"
          }
        },
        "source": {
          "host": "172.18.0.5",
          "port": "",
          "userAgent": "MinIO (linux; amd64) minio-go/v7.0.34"
        }
      }
    ]
  }
*/

  return 'Hello World'
}
