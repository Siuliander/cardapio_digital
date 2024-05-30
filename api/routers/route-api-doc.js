const express = require('express')
const router = express.Router()

const msg = null

router.get('/', (req, res) => {
    try {
        
    } catch (error) {
        
    } finally {
        res.status(200).json( msg )
    }
})

module.exports = router