const getBody = (event) => {
  if (event.body !== null && event.body !== undefined) {
    //log event body exactly as it comes in
    console.log('event.body', `>>>>\n${event.body}\n<<<<`)
    return JSON.parse(event.body)
  }
  return null
}

const getQuery = (event) => {
  if (event.queryStringParameters) {
    return event.queryStringParameters
  }
  return null
}

const getParams = (event) => {
  if (event.pathParameters) {
    return event.pathParameters
  }
  return null
}

module.exports = {
  getBody,
  getQuery,
  getParams,
}
