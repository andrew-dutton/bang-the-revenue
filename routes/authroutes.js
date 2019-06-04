const passport = require('passport')

module.exports = (app) => {
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  )

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/dashboard')
    }
  )

  app.get('/api/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  app.get('/dahsboard', (req, res, next) => {
    if (!req.user) {
      return req.status(401).send({ msg: 'You must login' })
    }
  })

  app.get('/api/current_user', (req, res) => {
    res.send(req.user)
  })
}
