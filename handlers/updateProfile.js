if (!global._babelPolyfill) {
    require('babel-polyfill')
}
import {verifyTokenMiddleware} from "../utils/jwt";
import {User} from '../models/user' // eslint-disable-line
import middy from 'middy' // eslint-disable-line
import {cors} from 'middy/middlewares'
import isNil from "lodash/isNil"; // eslint-disable-line
const unAuthorisedResponse = {
    statusCode: 401,
    body: JSON.stringify({ message: 'Unauthrised' })
}
const handler = (request, context, callback) => {
    const [err, decodedToken] = verifyTokenMiddleware(request.headers.Authorization)
    if (err) {
        callback(null, unAuthorisedResponse)
    } else if (isNil(decodedToken.email)) {
        callback(null, unAuthorisedResponse)
    } else {
        console.log(request.body);
        const updateObject = JSON.parse(request.body);

        User.update(updateObject, (err, dynamoResponse) => {
            if (err) {
                console.log(err);
                callback(null, {
                    statusCode: 500,
                    body: JSON.stringify('error on saving on dynamo check data schema')
                })
            } else {
                console.log(dynamoResponse);
                const response = {
                    statusCode: 200,
                    body: JSON.stringify({userCreated: true})
                };
                callback(null, response)
            }
        })

    }
}

export const updateProfile = middy(handler)
    .use(cors());
