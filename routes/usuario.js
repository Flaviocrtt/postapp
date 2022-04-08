const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')
const passport = require("passport")

require("../models/Usuario")
const UsuarioModel = mongoose.model("usuario")

router.get("/registro", (req, res) => {
    res.render("usuario/registro")
})

router.post("/salvar", (req, res) => {
    let erros = [];
    if (req.body.senha != req.body.senha2) {
        erros.push({ texto: "As senhas não estão iguais" })
    }

    if (erros.length > 0) {
        res.render("usuario/registro", { erros: erros, body: req.body })
    } else {
        UsuarioModel.findOne({ email: req.body.email }).then((usuario) => {
            if (usuario) {
                req.flash("error_msg", "Usuário com esse email já existe.")
                res.redirect("/")
            } else {
                var novoUsuario = new UsuarioModel({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                });

                bcrypt.genSalt(10, function (err, salt) {
                    if (err) {
                        req.flash("error_msg", "Ocorreu um erro interno. " + err)
                        res.redirect("/")
                    } else {
                        bcrypt.hash(novoUsuario.senha, salt, function (err, hash) {
                            if (err) {
                                req.flash("error_msg", "Ocorreu um erro interno. " + err)
                                res.redirect("/")
                            } else {
                                novoUsuario.senha = hash;
                                novoUsuario.save().then(() => {
                                    req.flash("success_msg", "Usuário criado com sucesso")
                                    res.redirect("/")
                                }).catch((error) => {
                                    req.flash("error_msg", "Ocorreu um erro interno. " + error)
                                    res.redirect("/")
                                })
                            }
                        });
                    }
                });
            }
        }).catch((error) => {
            req.flash("error_msg", "Ocorreu um erro interno. " + error)
            res.redirect("/")
        })
    }
})

router.get("/login", (req, res, next) => {
    res.render("usuario/login")
})

router.post("/login", (req, res, next) => {
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/usuario/login', failureMessage: true })
})

module.exports = router