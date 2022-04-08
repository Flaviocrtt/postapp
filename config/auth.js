const passport_local = require('passport-local')
const mongoose = require("mongoose")
const bcrypt = require('bcryptjs');

require("../models/Usuario")
const UsuarioModel = mongoose.model("usuario")

module.exports = function (passport) {
    passport.use(new passport_local.Strategy({usernameField: 'email', passwordField: 'senha'},
        function (username, password, done) {
            UsuarioModel.findOne({ email: username }, function (err, usuario) {
                console.log(usuario);
                if (err) { 
                    return done(err); 
                }
                if (!usuario) { 
                    return done(null, false, {message: "Email não encontrado"}); 
                }
               
                bcrypt.compare(password, usuario.senha, (erro, senhasBatem) => {
                    if(senhasBatem){
                        return done(null, usuario)
                    }
                    return done(null, false, {message: "Senha incorreta"})
                })
                return done(null, usuario);
            });
        }
    ));

    passport.serializeUser((usuario, done) =>{
        done(null, usuario.id)
    })

    passport.deserializeUser((usuario, done) =>{
        UsuarioModel.findOne({id: usuario.id}, (err, user) =>{
            done(null, usuario)
        })
    })
}