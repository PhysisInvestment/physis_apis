if (!global._babelPolyfill) {
    require('babel-polyfill')
}
import {User} from '../models/user' // eslint-disable-line
import middy from 'middy' // eslint-disable-line
import {cors} from 'middy/middlewares' // eslint-disable-line
import isNil from 'lodash/isNil' // eslint-disable-line

const handler = ({email}, context, callback) => {
    console.log('the request is request', email);

    // { queryStringParameters: { email } }
    User.queryOne({Email: {eq: email}}, (err, item) => {
        if (err) {
            callback(null, handleErr(err))
        } else {
            console.log('valu get from dynamoDB', item);
            const response = {
                statusCode: 200,
                body: JSON.stringify({
                    emailExists: (!isNil(item) && !isNil(item.Email))
                })
            };
            callback(null, response)
        }
    })
};

const handleErr = (error, statusCode = 500) => {
    console.error(' => ERROR:', error.stack);

    return {
        statusCode,
        body: JSON.stringify({error})
    }
};

export const checkEmailExists = middy(handler)
    .use(cors());
