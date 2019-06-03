if (process.env.NODE_ENV === 'production') {
  console.log('prod triggered')
  module.exports = require('./prod')
} else {
  console.log('dev triggered')
  module.exports = require('./dev')
}

