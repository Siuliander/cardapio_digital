const express = require('express')
const router = express.Router()

const controllerCardapio = require('../controllers/controller-cardapio')

router.get('/', async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerCardapio.getCardapioAll(req)
    } catch (err) {
    } finally {
        res.status(statusCode).json( result )
    }
})

module.exports = router