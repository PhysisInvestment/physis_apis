if (!global._babelPolyfill) {
  require('babel-polyfill')
}

import { User } from '../models/user' // eslint-disable-line
import pe from 'parse-error' // eslint-disable-line
import { signAnAccessToken } from '../utils/jwt' // eslint-disable-line
import middy from 'middy' // eslint-disable-line
import { cors } from 'middy/middlewares' // eslint-disable-line
import isNil from 'lodash/isNil' // eslint-disable-line

const handler = async ({ body }, context, callback) => {
  console.log('check body ', body)
  const { email, password } = JSON.parse(body)
  const [err, item] = await to(User.get({ email }))

  if (err) {
    callback(null, handleErr(err))
  } else {
    console.log(` => got item `, item)
    const unAuthorisedResponse = {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthrised' })
    }

    if (
      isNil(item) ||
      isNil(item.password) ||
      password !== item.password
    ) callback(null, unAuthorisedResponse)

    const accessToken = signAnAccessToken({ email })
    const successResponse = {
      statusCode: 200,
      body: JSON.stringify({ accessToken })
    }
    callback(null, successResponse)
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

export const loginUser = middy(handler)
  .use(cors())
