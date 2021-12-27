const express = require("express")
var bodyParser = require('body-parser')
const {engine} = require('express-handlebars')
const admin = require("./routes/admin")
const path = require("path")
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")

const port = 8081;

const app = new express();

app.use(session({
    secret: 'postappsession',
    resave:true,
    saveUninitialized: true,
}))

app.use(flash())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/admin', admin)
app.use(express.static(path.join(__dirname, "public")))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

mongoose.connect("mongodb://localhost:27017/postapp")

app.get('/', (req, res) => {
    res.render('home');
});

app.listen(port);