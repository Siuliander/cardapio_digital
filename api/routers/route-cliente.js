const express = require('express')
const router = express.Router()

const controllerCliente = require('../controllers/controller-cliente')

router.get('/', async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerCliente.getAll(req)
    } catch (err) {
    } finally {
        res.status(statusCode).json( result )
    }
})

router.get('/:id', async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerCliente.getID(req)
        
    } catch (err) {
    } finally {
        res.status(statusCode).json( result )
    }
})

router.post('/', async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerCliente.post(req)
    } catch (err) {
    } finally {
        res.status(statusCode).json( result )
    }
})

router.put('/', async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerCliente.put(req)
    } catch (err) {
    } finally {
        res.status(statusCode).json( result )
    }
})

router.put('/:id', async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerCliente.put(req)
    } catch (err) {
    } finally {
        res.status(statusCode).json( result )
    }
})

router.delete('/', async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerCliente.delete(req)
    } catch (err) {
    } finally {
        res.status(statusCode).json( result )
    }
})

router.delete('/:id', async (req, res) => {
    let result = []
    let statusCode = 200
    try {
        result = await controllerCliente.delete(req)
    } catch (err) {
    } finally {
        res.status(statusCode).json( result )
    }
})

module.exports = router