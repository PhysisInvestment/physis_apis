if (!global._babelPolyfill) {
  require('babel-polyfill')
}

import dynamoose from 'dynamoose' // eslint-disable-line
/* dynamoose.AWS.config.update({
  region: 'us-east-1'
}) */
const { Schema } = dynamoose
const userSchema = new Schema({
  CognitoId: {
    type: String,
    trim: true,
    required: true,
    index: {
      global: true,
      name: 'CognitoId-index',
      project: true, // ProjectionType: ALL
      throughput: 5 // read and write are both 5
    }},
  Email: {
    type: String,
    required: true,
    hashKey: true
  },
  FirstName: String,
  LastName: String,
  Address: String,
  City: String,
  State: String,
  Address2: String,
  Zip: String,
  Country: String,
  S3KeyForPhoto: String,
  CellPhone: String,
  RiskTolerance: {
    type: String,
    enum: ['low', 'mdeium', 'high']
  },
  UserGoals: String,
  HelpPyhsisSaveMoney: Boolean,
  InvestingFor: String,
  Dob: Date,
  UserMakesMoney: String,
  UserPortfolio: {
    type: [String]
  },
  IsAdvisor: {
    type: Boolean,
    default: false
  },
  UserThemes: {
    type: [String]
  },
  InvestmentPerYear: String,
  InvestmentPerMonth: String
})
// nedd set env variable on lambda deploy
export const User = dynamoose.model(process.env.USER_TABLE, userSchema)
