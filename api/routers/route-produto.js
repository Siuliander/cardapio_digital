const express = require('express')
const router = express.Router()

const controllerProduto = require('../controllers/controller-produto')
const upload = require('./../models/upload')


router.get('/', async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerProduto.getProdutoAll(req)
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
        result = await controllerProduto.getProdutoID(req)
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
        result = await controllerProduto.postProduto(req)
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
        result = await controllerProduto.putProduto(req)
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
        result = await controllerProduto.putProduto(req)
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
        result = await controllerProduto.deleteProduto(req)
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
        result = await controllerProduto.deleteProduto(req)
    } catch (err) {
        console.log( err)
        statusCode = 500
    } finally {
        res.status(statusCode).json( result )
    }
})

module.exports = router