const mongoose = require("mongoose")
const { Schema } = mongoose

const Tarefas = new Schema({

    id_conta:   { type: String, require: true },
    titulo:     { type: String, require: true },
    descricao:  { type: String, require: true },
    data:       { type: Date, require: true },
    concluido:  { type: Boolean, require: true }

}, {timestamps: true})

module.exports = mongoose.model("Tarefas", Tarefas)