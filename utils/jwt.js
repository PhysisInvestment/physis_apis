import jwt from 'jsonwebtoken'
import pe from 'parse-error' // eslint-disable-line

const jwtSecret = process.env.secret || 'pyhsisUserInvest'
const jwtExpires = process.env.jwtExpires || '15m'

export const verifyTokenMiddleware = token => {
  try {
    const decodedToken = jwt.verify(token, jwtSecret)
    return [null, decodedToken]
  } catch (e) {
    console.log('JWT Token exception::: ', e)
    return [pe(e)]
  }
}

export const signAnAccessToken = ({
  email,
  scopes = ['user:all'], // for now every user have generic scope
  data = {}
}) => (
  jwt.sign(
    {
      scopes,
      email,
      data
    },
    jwtSecret,
    { expiresIn: jwtExpires }
  )
)
