if (!global._babelPolyfill) {
  require('babel-polyfill')
}
import { User } from '../models/user' // eslint-disable-line
import pe from 'parse-error' // eslint-disable-line
import isNil from 'lodash/isNil' // eslint-disable-line
import middy from 'middy' // eslint-disable-line
import { cors } from 'middy/middlewares' // eslint-disable-line
import { verifyTokenMiddleware } from '../utils/jwt' // eslint-disable-line

const unAuthorisedResponse = {
  statusCode: 401,
  body: JSON.stringify({ message: 'Unauthrised' })
}

const handler = async (request, context, callback) => {
  const [err] = verifyTokenMiddleware(request.headers.Authorization)
  if (err) {
    callback(null, unAuthorisedResponse)
  } else {
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Authorized'
      })
    }
    callback(null, response)
  }
}

// *** Error handling support in promises
const to = promise =>
  promise
    .then(data => [null, data])
    .catch(err => [pe(err)])

const handleErr = (error, statusCode = 401) => {
  console.error(' => ERROR:', error.stack)

  return {
    statusCode,
    body: JSON.stringify({ error })
  }
}

export const loggedInUser = middy(handler)
  .use(cors())
