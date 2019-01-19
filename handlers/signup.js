if (!global._babelPolyfill) {
  require('babel-polyfill')
}

import { User } from '../models/user' // eslint-disable-line
import pe from 'parse-error' // eslint-disable-line
import omit from 'lodash/omit' // eslint-disable-line
import middy from 'middy' // eslint-disable-line
import { cors } from 'middy/middlewares' // eslint-disable-line

const handler = async ({ body }, context, callback) => {
  console.log('check ::::::::  ', body)
  const [err, item] = await to(addItem(User, body))

  if (err) {
    callback(null, handleErr(err))
  } else {
    const response = {
      statusCode: 200,
      body: JSON.stringify({ userCreated: true })
    }

    console.log(` => Item stored [${item.id}]`)
    callback(null, response)
  }
}

// Creates and saves one item based in the Item model
const addItem = (collection, data) => {
  const parsed = JSON.parse(data)
  return collection.create(parsed)
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

export const signUpUser = middy(handler)
  .use(cors())
