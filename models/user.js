if (!global._babelPolyfill) {
  require('babel-polyfill')
}

import dynamoose from 'dynamoose' // eslint-disable-line

const { Schema } = dynamoose
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    hashKey: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: String,
  lastName: String,
  address: String,
  country: String,
  riskTolerance: {
    type: String,
    enum: ['low', 'mdeium', 'high']
  },
  helpPyhsisSaveMoneyFlag: Boolean,
  investingFor: String,
  dob: Date,
  userMakesMoney: Number,
  userPortfolio: {
    type: [String]
  },
  userThemes: {
    type: [String]
  },
  investmentPerYear: Number
})

export const User = dynamoose.model(process.env.USER_TABLE, userSchema)
