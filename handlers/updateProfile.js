if (!global._babelPolyfill) {
  require('babel-polyfill')
}
import {cors} from 'middy/middlewares'
import {User} from '../models/user' // eslint-disable-line
import middy from 'middy' // eslint-disable-line

const handler = (request, context, callback) => {
  console.log(request.body)
  const updateObject = JSON.parse(request.body)

  User.update(updateObject, (err, dynamoResponse) => {
    if (err) {
      console.log(err)
      callback(null, {
        statusCode: 500,
        body: JSON.stringify('error on saving on dynamo check data schema')
      })
    } else {
      console.log(dynamoResponse)
      const response = {
        statusCode: 200,
        body: JSON.stringify({userCreated: true})
      }
      callback(null, response)
    }
  })
}

export const updateProfile = middy(handler)
  .use(cors())
