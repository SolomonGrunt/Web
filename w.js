if(process.env.NODEENV !=='production'){
require('dotenv').config()
}

const express = require('express')
const app = express()
const port = 3000
const users =[]
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser');
const passport = require('passport')
const flash = require('express-flash')
const session =require('express-session')
const initializepassport = require('./passport-config')
const {request} = require("express");
const fetch = require('node-fetch');
initializepassport(passport ,
        email => users.find( user => user.email === email) ,
    id => users.find( user => user.id === id)
)
let today = new Date();
app.set('view-engine', 'ejs')


app.use(express.urlencoded({extended: false}))
app.use(flash())
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.get('/', check , (req, res) => {
    res.render('index.ejs' , { name: req.user.name })
})
app.get('/login', (req, res) => {
    res.render('login.ejs')
})
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))
app.get('/register', (req, res) => {
    res.render('register.ejs')
})
app.post('/register' , async (req , res) => {
    try {
        const hashedpassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedpassword,
            let: time = new Date().getDate(),
            let: time2 = new Date().getMonth()+1,
            let: time3 = new Date().getMinutes(),
            let: time4 = new Date().getHours()
        })
        res.redirect('/login')
    } catch {
res.redirect('/register')
    }
console.log(users)
})

function check(req, res , next){
    if (req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}
function  anticheck(req,res,next){
    if (req.isAuthenticated()){
        res.redirect('/')
    }
    return next()
}

app.listen(3000)