const express = require('express')
const router = express.Router();

let data = [];
let codeStatus = 200;
let err = null;

router.get('/', (req, res) => {
    try {
        
        const items = [
            {
                id: 1,
                produto: 'Pizza Pequena',
                img: 'f1.png',
                categoria: 1,
                preco: '0,00',
                descricao: '',
            },
        ];
        data = [ items ];
        codeStatus = 200;

    } catch (error) {
        codeStatus = 500;
        err = error;
        console.log(err)
    } finally {
        res.status(codeStatus).render('template', { page: 'carrinho', data , err })
    }
})


// exportando as Rotas
module.exports = router;