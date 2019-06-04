const passport = require('passport')

module.exports = app => {
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

  app.get('/dashboard', (req, res) => {
    console.log(req.user)
    if (!req.user) {
      return res.status(401).send('You must be signed in')
    }
  })

  app.get('/api/current_user', (req, res) => {
    res.send(req.user)
  })
}
