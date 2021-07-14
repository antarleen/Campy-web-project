const User = require('../models/user')

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.userRegister = async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', 'You have successfully registered !')
            res.redirect('/campgrounds')
        })
    }
    catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }

}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.userLogin = (req, res) => {
    const { username } = req.body
    const redirectUrl = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    req.flash('success', `Welcome, ${username} !`)
    res.redirect(redirectUrl)
}

module.exports.userLogout =(req, res) => {
    req.logout()
    req.flash('success', 'You have successfully logged out !')
    res.redirect('/campgrounds')
}