const routes = require('../routes')
const request = require('../lib/request')
const response = require('../lib/response')
const auth = require('../lib/auth')

const findRouteFor = (requestedRoute) => {
  // check if there is an exact match for the requested route
  if (routes[requestedRoute]) {
    return routes[requestedRoute]
  } else {
    // loop through all defined routes, replace :params with regex and check if the requested route matches
    for (const route in routes) {
      const regex = new RegExp(route.replace(/:[^/]+/g, '[^/]+'))
      if (regex.test(requestedRoute)) {
        return routes[route]
      }
    }
    return null
  }
}

// catch-all-handler for all routes
exports.handler = async (event) => {
  event.body = request.getBody(event)
  event.query = request.getQuery(event)
  event.params = request.getParams(event)
  event.path = event.path.replace(/\/$/, '')
  event.httpMethod = event.httpMethod.toLowerCase()

  const requestedRoute = `${event.path}.${event.httpMethod}`
  const route = findRouteFor(requestedRoute)

  console.log(`Found route for ${requestedRoute}: ${route.fnp}`)

  // check if there is a defined route for the path and method
  if (route) {
    if (route.auth) {
      try {
        event.user = auth.verifyToken(event.headers)
      } catch (e) {
        return response.sendStatus(401)
      }
    }

    // fixme: implement API key authentication

    // return the actual handler function
    return await route.fn(event)
  } else {
    return response.status(404, {
      status: 'error',
      message: 'not found',
    })
  }
}
