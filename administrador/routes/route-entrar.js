const express = require('express')
const router = express.Router();

router.get('/', (req, res) => {

    try {
        const empresa = [
            {
                name: "Siuleander Lende", 
                nif: '006422972LA047', 
                address: 'Angola, Luanda, Viana, Zango 2, S/N', 
                contact: '+244 930 015 277', 
                email: 'info@examplo.exemplo'
            }
        ];

        // res.render('pages/index', { posts })
        res.render('template', { empresa, page: 'entrar' })

    } catch (error) {
        console.log(error)
    }
})


// exportando as Rotas
module.exports = router;