/*
 * This function is used to modify the origin request URI as a Lambda@Edge function.
 * It is triggered on Cloudfront's Origin Request event.
 */
exports.handler = async (event) => {
  const request = event.Records[0].cf.request
  const domainName = request.headers.host[0].value
  const subdomain = domainName.split('.')[0]

  if (request.uri.endsWith('/')) {
    request.uri = `/apps/${subdomain}/${request.uri}index.html`
  } else {
    request.uri = `/apps/${subdomain}${request.uri}`
  }

  request.headers['host'] = [
    {
      key: 'host',
      value: process.env.S3_HOSTNAME, // <bucket>.s3.<region>.amazonaws.com
    },
  ]

  return request
}
