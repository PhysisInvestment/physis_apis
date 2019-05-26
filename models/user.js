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
  s3KeyForPhoto: String,
  cellPhone: String,
  riskTolerance: {
    type: String,
    enum: ['low', 'mdeium', 'high']
  },
  userGoals: {
    type: [Number]
  },
  helpPyhsisSaveMoneyFlag: Boolean,
  investingFor: String,
  dob: Date,
  userMakesMoney: String,
  userPortfolio: {
    type: [String]
  },
  userThemes: {
    type: [String]
  },
  investmentPerYear: String
})

export const User = dynamoose.model(process.env.USER_TABLE, userSchema)
