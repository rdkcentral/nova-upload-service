exports.handler = async (event) => {
  console.log(JSON.stringify(event, null, 2))
  // Get request from CloudFront event
  const request = event.Records[0].cf.request

  // Extract the subdomain from the host header
  const domainName = request.headers.host[0].value
  const subdomain = domainName.split('.')[0]

  // Check if the root path is requested
  if (request.uri === '/') {
    // Generate the redirect URL
    const redirectUrl = `https://${domainName}/latest/index.html`

    // Return a 302 Temporary Redirect response
    const response = {
      status: '302',
      statusDescription: 'Found',
      headers: {
        location: [
          {
            key: 'Location',
            value: redirectUrl,
          },
        ],
        // Optionally, you can add other headers here as needed
      },
    }

    return response
  } else {
    // Rewrite URL to match desired structure and append index.html if the request is for root
    if (request.uri.endsWith('/')) {
      request.uri = `/apps/${subdomain}${request.uri}index.html`
    } else {
      request.uri = `/apps/${subdomain}${request.uri}`
    }
    console.log(request.uri)
  }

  // Return modified request
  return request
}
