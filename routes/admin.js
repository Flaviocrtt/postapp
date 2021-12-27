const express = require('express')
const { read } = require('fs')
const router = express.Router()

const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categoria")


router.get("/", (req, res) => {
    res.send("pagina admin")
})

router.get("/posts", (req, res) => {
    res.send("pagina admin de posts")
})

router.get("/categorias", (req, res) => {

    Categoria.find().sort({ create_date_time: 'desc' }).then((categorias) => {
        const cat = categorias.map((e) => { return { nome: e.nome, slug: e.slug, _id: e._id } })
        res.render("admin/categorias", { itens: cat })
    }).catch((error) => {
        req.flash("error_msg", "Ocorreu um erro ao listar categorias")
    })
})

router.get("/categorias/add", (req, res) => {
    res.render("admin/categoria")
})

function copy(mainObj) {
    let objCopy = {}; // objCopy will store a copy of the mainObj
    let key;

    for (key in mainObj) {
        objCopy[key] = mainObj[key]; // copies each property to the objCopy object
    }
    return objCopy;
}

router.get("/categorias/editar/:id", (req, res) => {
    Categoria.findById(req.params.id).then((categoria) => {
        res.render("admin/categoria_editar", { categoria: copy(categoria) })
    }).catch((error) => {
        req.flash("error_msg", "Ocorreu um erro ao carregar categoria: " + error)
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/salvar", (req, res) => {
    let erros = []
    if (req.body.nome == undefined || req.body.nome == "") {
        erros.push({ texto: "Nome inválido" })
    }
    if (req.body.nome.length < 2) {
        erros.push({ texto: "Nome muito pequeno" })
    }
    if (req.body.slug == undefined || req.body.slug == "") {
        erros.push({ texto: "Slug inválido" })
    }
    if (erros.length > 0) {
        res.render("admin/categoria", { erros: erros })
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug,
        }
        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria salva com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((error) => {
            req.flash("error_msg", "Ocorreu um erro ao cadastrar categoria")
            res.redirect("/admin/categorias")
        });
    }
})

router.post("/categorias/editar", (req, res) => {

    Categoria.findById(req.body.id).then((categoria) => {
        categoria.nome = req.body.nome;
        categoria.slug = req.body.slug;

        categoria.save().then(() => {
            req.flash("success_msg", "Categoria editada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((error) => {
            req.flash("error_msg", "Ocorreu um erro ao editar categoria")
            res.redirect("/admin/categorias")
        })

    }).catch((error) => {
        req.flash("error_msg", "Ocorreu um erro ao recuperar categoria")
    });

})

router.post("/categorias/excluir", (req, res) => {
    Categoria.deleteOne({ _id: req.body.id}).then(() => {
        req.flash("success_msg", "Categoria excluída com sucesso")
        res.redirect("/admin/categorias")
    }).catch((error) => {
        req.flash("error_msg", "Ocorreu um erro ao editar categoria")
        res.redirect("/admin/categorias")
    })
})
module.exports = router;