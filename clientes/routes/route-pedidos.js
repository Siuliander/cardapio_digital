const express = require('express')
const router = express.Router();

let data = [];
let codeStatus = 200;
let err = null;

router.get('/', (req, res) => {
    try {
        
        const pedidos = [
            {
                id: 1,
                mesa: 's/n',
                subtotal: '0,00',
                total: '0,00',
                pago: false,
            },
        ];
        
        data = [ pedidos ];
        codeStatus = 200;

    } catch (error) {
        codeStatus = 500;
        err = error;
        console.log(err)
    } finally {
        res.status(codeStatus).render('template', { page: 'pedidos', data , err })
    }
})


// exportando as Rotas
module.exports = router;