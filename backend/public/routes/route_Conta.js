const router        = require("express").Router()
const mongoose      = require("mongoose")
const Conta = require("../models/model_Conta")

router.post("/conta", async (req, res) => {
    const verify = await Conta.findOne({ email: req.body.email })
    if (verify == null){
        const response = await Conta.create(req.body)
        res.json(response)
    } else {
        res.json({ msg: "Este e-mail já esta em uso!" })
    }
})

router.get("/conta/:email/:senha", async (req, res) => {
    const response = await Conta.findOne({ email: req.params.email, senha: req.params.senha })
    if (response == null){
        res.json({ msg: "Informações inválidas!" })
    } else {
        res.json(response)
    }
})

module.exports = router