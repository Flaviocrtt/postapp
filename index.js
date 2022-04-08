const express = require("express")
var bodyParser = require('body-parser')
const { engine } = require('express-handlebars')
const adminRoute = require("./routes/admin")
const usuarioRoute = require("./routes/usuario")
const path = require("path")
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
require("./config/auth")(passport)


const port = 8081;

const app = new express();

app.use(session({
    secret: 'postappsession',
    resave: true,
    saveUninitialized: true,
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    next()
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/admin', adminRoute)
app.use('/usuario', usuarioRoute)
app.use(express.static(path.join(__dirname, "public")))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

mongoose.connect("mongodb://localhost:27017/postapp")

require("./models/Postagem")
const PostagemModel = mongoose.model("postagem")

require("./models/Categoria")
const CategoriaModel = mongoose.model("categoria")

app.get('/', (req, res) => {
    PostagemModel.find().populate("categoria").then((postagens) => {

        res.render('home', { postagens: JSON.parse(JSON.stringify(postagens)) });
    }).catch((error) => {
        req.flash("error_msg", "Ocorreu um erro ao carregar postagens" + error)
    })
});

app.get('/postagem/:slug', (req, res) => {
    PostagemModel.findOne({ slug: req.params.slug }).populate("categoria").then((postagem) => {
        if (postagem) {
            res.render('postagem/index', { postagem: JSON.parse(JSON.stringify(postagem)) });
        } else {
            req.flash("error_msg", "Postagem não existe")
            res.redirect("/")
        }
    }).catch((error) => {
        req.flash("error_msg", "Ocorreu um erro ao carregar postagem" + error)
        res.redirect("/")
    })
});

app.get('/categorias', (req, res) => {
    CategoriaModel.find().then((categorias) => {
        res.render("categorias/index", { categorias: JSON.parse(JSON.stringify(categorias)) })
    }).catch((error) => {
        req.flash("error_msg", "Ocorreu um erro ao carregar categorias" + error)
        res.redirect("/")
    })
});

app.get('/categoria/:slug', (req, res) => {
    CategoriaModel.findOne({ slug: req.params.slug }).then((categoria) => {
        if (categoria) {
            PostagemModel.find({ categoria: categoria._id }).then((postagens) => {
                res.render('categorias/postagens', { postagens: JSON.parse(JSON.stringify(postagens)), categoria: JSON.parse(JSON.stringify(categoria))});
            }).catch((error) => {
                req.flash("error_msg", "Ocorreu um erro ao carregar categorias" + error)
                res.redirect("/")
            })
        } else {
            req.flash("error_msg", "Essa categoria não existe")
            res.redirect("/")
        }
    }).catch((error) => {
        req.flash("error_msg", "Ocorreu um erro ao carregar categoria" + error)
        res.redirect("/")
    })
});

app.listen(port);