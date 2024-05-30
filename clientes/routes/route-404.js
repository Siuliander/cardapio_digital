const express = require('express')
const router = express.Router();


router.get('/', (req, res) => {
    let data = [];
    let codeStatus = 200;
    let err = null;

    try {

        codeStatus = 404;

    } catch (error) {

        codeStatus = 500;
        err = error;
        console.log(err)

    } finally {

        res.status(codeStatus).render('template', { page: '404', data , err })
        
    }
})


// exportando as Rotas
module.exports = router;