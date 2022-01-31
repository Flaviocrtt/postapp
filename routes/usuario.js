const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")

require("../models/Usuario")
const UsuarioModel = mongoose.model("usuario")

router.get("/registro", (req, res) => {
    res.render("usuario/registro")
})

router.post("/salvar", (req, res) => {
    let erros = [];
    if(req.body.senha != req.body.senha2){
        erros.push({texto:"As senhas não estão iguais"})
    }

    if(erros.length>0){
        res.render("usuario/registro", {erros:erros, body: req.body})
    }else{

    }
    
})

module.exports = router
