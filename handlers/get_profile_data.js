if (!global._babelPolyfill) {
  require('babel-polyfill')
}
import {User} from '../models/user' // eslint-disable-line
import pe from 'parse-error' // eslint-disable-line
import middy from 'middy' // eslint-disable-line
import {cors} from 'middy/middlewares' // eslint-disable-line

const handler = async (request, context, callback) => {
  console.log('the info  from request ', request)
  const [getUserError, profileData] = await to(User.get(request.email))
  console.log(`error : ${JSON.stringify(getUserError)} data: ${JSON.stringify(profileData)}`)
  getUserError
    ? callback(null, handleErr(getUserError, 500))
    : callback(null, generateProfileData(profileData))
}

// *** Error handling support in promises
const to = promise =>
  promise
    .then(data => [null, data])
    .catch(err => [pe(err)])

const generateProfileData = (data) => (
  {
    statusCode: 200,
    body: JSON.stringify({
      userProfile: data
    })
  }
)

const handleErr = (error, statusCode = 401) => {
  console.error(' => ERROR:', error.stack)

  return {
    statusCode,
    body: JSON.stringify({error})
  }
}

export const getUserData = middy(handler)
  .use(cors())
