
if (!global._babelPolyfill) {
  require('babel-polyfill')
}
import KMS from 'aws-sdk/clients/kms' // eslint-disable-line
import { User } from '../models/user' // eslint-disable-line
import middy from 'middy' // eslint-disable-line
import { cors } from 'middy/middlewares' // eslint-disable-line

let kmsClient = new KMS()

const handler = ({ body }, context, callback) => {
  console.log(body)
  const sigupObject = JSON.parse(body)
  const params = {
    KeyId: '490a2fd0-43d5-49e7-aa67-2f4bf6ee804b',
    Plaintext: sigupObject.password
  }
  const encryptionError = {
    statusCode: 500,
    body: JSON.stringify('error on encrypting password')
  }

  kmsClient.encrypt(params, (err, data) => {
    if (err) {
      console.log(err)
      callback(null, encryptionError)
    } else {
      sigupObject.password = data.CiphertextBlob.toString('base64')
      User.create(sigupObject, (err, dynamoResponse) => {
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
  }
  )
}

export const signUpUser = middy(handler)
  .use(cors())
