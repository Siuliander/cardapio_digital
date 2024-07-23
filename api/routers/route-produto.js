const express = require('express')
const router = express.Router()

const upload = require('./../models/upload')

router.get('/', async (req, res) => {
    let result = []
    
    res.status(200).json( result )
  
})

router.get('/:id', async (req, res) => {
    let result = []
    res.status(200).json( result )
})

router.post('/',  upload.single('file'), async (req, res) => {
    res.status(200).json( req.file )
})

router.put('/', async (req, res) => {
    let result = []
    res.status(200).json( result )
})

router.put('/:id', async (req, res) => {
    let result = []
    res.status(200).json( result )
})

router.delete('/', async (req, res) => {
    let result = []
    res.status(200).json( result )
})

router.delete('/:id', async (req, res) => {
    let result = []
    res.status(200).json( result )
})

module.exports = router