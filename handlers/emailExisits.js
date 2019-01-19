if (!global._babelPolyfill) {
  require('babel-polyfill')
}
import { User } from '../models/user' // eslint-disable-line
import pe from 'parse-error' // eslint-disable-line
import middy from 'middy' // eslint-disable-line
import { cors } from 'middy/middlewares' // eslint-disable-line
import isNil from 'lodash/isNil' // eslint-disable-line

const handler = async ({ queryStringParameters: { email } }, context, callback) => {
  const [err, item] = await to(User.get({ email }))

  if (err) {
    callback(null, handleErr(err))
  } else {
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        emailExists: (!isNil(item) && !isNil(item.email))
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

const handleErr = (error, statusCode = 500) => {
  console.error(' => ERROR:', error.stack)

  return {
    statusCode,
    body: JSON.stringify({ error })
  }
}

export const checkEmailExists = middy(handler)
  .use(cors())
