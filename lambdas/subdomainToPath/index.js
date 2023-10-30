exports.handler = async (event) => {
  // Get request from CloudFront event
  const request = event.Records[0].cf.request

  // Extract the subdomain from the host header
  const domainName = request.headers.host[0].value
  const subdomain = domainName.split('.')[0]

  // Rewrite URL to match desired structure
  request.uri = `/apps/${subdomain}${request.uri}`

  // Return modified request
  return request
}
