// http status codes
const httpStatusCodes = {
  200: 'OK',
  201: 'Created',
  204: 'No Content',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',
  423: 'Locked',
  424: 'Failed Dependency',
  425: 'Too Early',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  451: 'Unavailable For Legal Reasons',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',
  507: 'Insufficient Storage',
  508: 'Loop Detected',
  510: 'Not Extended',
  511: 'Network Authentication Required',
}

const status = (statusCode, body = {}) => {
  return {
    statusCode,
    headers: {
      // CORS
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    },
    body: typeof body == 'string' ? body : JSON.stringify(body),
  }
}

const json = (body) => {
  return status(200, body)
}

const sendStatus = (statusCode) => {
  return status(statusCode, httpStatusCodes[statusCode])
}

const sendError = (message, error = null, code = 400) => {
  const errorResponse = {
    status: 'error',
    message: message,
    errors: [],
  }

  if (error) {
    if (error.name && error.name == 'ValidationError') {
      for (const [key, value] of Object.entries(error.errors)) {
        if (value.kind == 'user defined' || value.kind == 'required') {
          errorResponse.errors.push(value.message)
        } else {
          const errorCode = value.kind == 'unique' ? 'Exists' : 'Invalid'
          errorResponse.errors.push(`${key}${errorCode}`)
        }
      }
    }
    if (error.name && error.name == 'Error') {
      errorResponse.errors.push(error.message)
    }
    return status(code, errorResponse)
  }

  // otherwise it must be server error
  return sendStatus(500)
}

module.exports = {
  status,
  sendStatus,
  sendError,
  json,
}
