const mongoose = require("mongoose")
const Schema = mongoose.schema

const Postagem = new Schema({
    titulo: {
        type: "String",
        required: true
    },
    slug: {
        type: "String",
        required: true
    }, 
    descricao: {
        type: "String",
        required: true
    },
    conteudo: {
        type: "String",
        required: true
    },
    categoria: {
        type: schema.Types.ObjectId,
        ref: "categoria",
        required: true
    },
    create_date_time:{
        type:  Date,
        default: Date.now()
    }
})

mongoose.model("postagem", Postagem)