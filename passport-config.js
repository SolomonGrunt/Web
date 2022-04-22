const LocalStrategy = require('passport-local').Strategy
const bcrypt =require('bcrypt')
function initialize(passport, getUserbyEmail , getUserbyId){
    const authenticateUser =async (email, password, done) => {
        const user = getUserbyEmail(email)
        if (user == null) {
            return done(null, false, {message: 'no user with that email'})
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)

            } else {
                return done(null, false, {message: 'Incorrect password try again'})
            }
        } catch (e) {
            return done(e)
        }
    }
passport.use(new LocalStrategy({usernameField : 'email'}, authenticateUser))
    passport.serializeUser((user,done) => { done(null, user.id) })
    passport.deserializeUser((id,done) => { done(null, getUserbyId(id))})
}
module.exports = initialize