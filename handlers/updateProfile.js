if (!global._babelPolyfill) {
  require('babel-polyfill')
}
import {cors} from 'middy/middlewares'
import {User} from '../models/user' // eslint-disable-line
import middy from 'middy' // eslint-disable-line

const handler = (request, context, callback) => {
  let updateBody = JSON.parse(request.body)
  console.log(`request ${JSON.stringify(request)}`)
  let IsAdvisor = request.requestContext.authorizer.claims['IsAdvisor']
  updateBody.CognitoId = request.requestContext.authorizer.claims.sub
  updateBody.IsAdvisor = IsAdvisor ? 'true' : 'false'
  updateBody.UserGoals = updateBody.UserGoals.join(',')
  updateBody.Dob = Date.parse(updateBody.Dob)
  console.log(`request ${JSON.stringify(request['body-json'])}`)
  User.update(updateBody, (err, dynamoResponse) => {
    if (err) {
      console.log(`error : ${JSON.stringify(err)}, request ${JSON.stringify(request)}`)
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
