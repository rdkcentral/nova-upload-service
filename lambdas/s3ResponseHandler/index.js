/*
 * This function is used to modify the origin response as a Lambda@Edge function.
 * It is triggered on Cloudfront's Origin Response event.
 */
exports.handler = async (event) => {
  const request = event.Records[0].cf.request
  const response = event.Records[0].cf.response
  const statusCode = response.status
  const subdomain = request.uri.split('/')[2]
  const domain = `${subdomain}.{process.env.CDN_DOMAIN}`
  const uriRegex = /^\/apps\/[a-z0-9]+(\/index\.html|\/)$/g

  // Check if the status code is 4xx and the request is for / or /index.html
  if (statusCode >= 400 && statusCode < 500 && uriRegex.test(request.uri)) {
    response.status = '302'
    response.statusDescription = 'Found'
    response.headers['location'] = [
      {
        key: 'Location',
        value: `https://${domain}/latest/index.html`,
      },
    ]
  }
  return response
}
