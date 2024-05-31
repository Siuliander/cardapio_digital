const express = require('express')
const router = express.Router()

const controllerCategoria = require('./../controllers/controller-categoria')

router.get('/', async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerCategoria.getCategoriaAll(req)
    } catch (err) {
    } finally {
        res.status(statusCode).json( result )
    }
})

router.get('/:id', async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerCategoria.getCategoriaID(req)
        
    } catch (err) {
    } finally {
        res.status(statusCode).json( result )
    }
})

router.post('/', async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerCategoria.postCategoria(req)
    } catch (err) {
    } finally {
        res.status(statusCode).json( result )
    }
})

router.put('/', async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerCategoria.putCategoria(req)
    } catch (err) {
    } finally {
        res.status(statusCode).json( result )
    }
})

router.put('/:id', async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerCategoria.putCategoria(req)
    } catch (err) {
    } finally {
        res.status(statusCode).json( result )
    }
})

router.delete('/', async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerCategoria.deleteCategoria(req)
    } catch (err) {
    } finally {
        res.status(statusCode).json( result )
    }
})

router.delete('/:id', async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerCategoria.deleteCategoria(req)
    } catch (err) {
    } finally {
        res.status(statusCode).json( result )
    }
})

module.exports = router