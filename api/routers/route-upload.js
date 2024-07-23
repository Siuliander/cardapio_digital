const express = require('express')
const router = express.Router()

const upload = require('../models/upload')

router.post('/',  upload.single('file'), async (req, res) => {
    res.status(200).json( req.file )
})

module.exports = router