// Bring in environment secrets through dotenv
require('dotenv/config')
const env = 'production'

//insert your API Key & Secret for each environment, keep this file local and never push it to a public repo for security purposes.
const config = {
    production:{
        APIKey: process.env.REACT_APP_API_KEY,
        APISecret: process.env.REACT_APP_API_SECRET
    }
};

module.exports = config[env]
