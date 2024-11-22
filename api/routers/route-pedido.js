const express = require('express')
const router = express.Router()

const controllerPedido = require('../controllers/controller-pedido')


router.get('/', async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerPedido.getPedidoAll(req)
    } catch (err) {
        statusCode = 500
    } finally {
        res.status(statusCode).json( result )
    }
})

router.get('/:id', async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerPedido.getPedidoID(req)
    } catch (err) {
        statusCode = 500
    } finally {
        res.status(statusCode).json( result )
    }
})

// router.post('/',  upload.single('file'), async (req, res) => {
router.post('/',  async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerPedido.postPedido(req)
    } catch (err) {
        statusCode = 500
    } finally {
        res.status(statusCode).json( result )
    }
})

router.put('/', async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerPedido.putPedido(req)
    } catch (err) {
        statusCode = 500
    } finally {
        res.status(statusCode).json( result )
    }
})

router.put('/:id', async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerPedido.putPedido(req)
    } catch (err) {
        statusCode = 500
    } finally {
        res.status(statusCode).json( result )
    }
})

router.delete('/', async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerPedido.deletePedido(req)
    } catch (err) {
        statusCode = 500
    } finally {
        res.status(statusCode).json( result )
    }
})

router.delete('/:id', async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerPedido.deletePedido(req)
    } catch (err) {
        console.log( err)
        statusCode = 500
    } finally {
        res.status(statusCode).json( result )
    }
})

router.delete('/item/', async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerPedido.deleteItemPedido(req)
    } catch (err) {
        statusCode = 500
    } finally {
        res.status(statusCode).json( result )
    }
})

router.delete('/:id/item', async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerPedido.deleteItemPedido(req)
    } catch (err) {
        console.log( err)
        statusCode = 500
    } finally {
        res.status(statusCode).json( result )
    }
})

module.exports = router