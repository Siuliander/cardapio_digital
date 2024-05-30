const express = require('express')
const router = express.Router();

let data = [];
let codeStatus = 200;
let err = null;

router.get('/', (req, res) => {
    try {
        
        const pedido = [
            {
                id: 1,
                mesa: 's/n',
                subtotal: '0,00',
                total: '0,00',
                items: [
                    {
                        id: 1,
                        produto: 'Pizza Pequena',
                        preco: '0,00',
                        qtd: 1,
                        nota: '',
                    },
                ],
            },
        ];
        data = [ pedido ];
        codeStatus = 200;

    } catch (error) {
        codeStatus = 500;
        err = error;
        console.log(err)
    } finally {
        res.status(codeStatus).render('template', { page: 'pagamento', data , err })
    }
})


// exportando as Rotas
module.exports = router;