const express = require('express')
const router = express.Router();


router.get('/', (req, res) => {

    try {
        const request = req.query || req.body || req.params

        console.log( request )

        const empresa = [
            {
                name: "Siuleander Lende", nif: '006422972LA047', address: 'Angola, Luanda, Viana, Zango 2, S/N', 
                contact: '+244 930 015 277', email: 'info@examplo.exemplo'
            }
        ];

        var conversas = [
            {  id: 0, cliente: 'cliente', perfil: 'src/foto', ultima_mensagem: 'última mensagem', data: '2024-04-07 09:37:20' },
            {  id: 2, cliente: 'sql', perfil: 'src/foto', ultima_mensagem: 'última mensagem 3', data: '2024/04/07 09:37:20' },
            {  id: 1, cliente: 'XSS', perfil: 'src/foto', ultima_mensagem: '<script>alert(0)</script>', data: '2024/04/07 10:17:08' },
        ];
        
        res.render('template', { request, empresa, page: 'conversas', conversas })

    } catch (error) {
        console.log(error)
    }
})

router.get('/:id', (req, res) => {

    try {
        const request = req.query || req.body || req.params

        console.log( request )

        const empresa = [
            {
                name: "Siuleander Lende", nif: '006422972LA047', address: 'Angola, Luanda, Viana, Zango 2, S/N', 
                contact: '+244 930 015 277', email: 'info@examplo.exemplo'
            }
        ];

        var mensagens = [
            { id: 0, emissor: false, autor: 'autor', mensagem: 'mensagem', data: '2024/04/07 10:17:08' },
            { id: 1, emissor: true, autor: 'autor', mensagem: 'mensagem', data: '2024/04/07 10:38:08' },
            { id: 2, emissor: true, autor: 'autor', mensagem: 'mensagem', data: '2024/04/07 12:17:08' },
        ];

        var conversas = [
            {  id: 0, cliente: 'cliente', perfil: 'src/foto', ultima_mensagem: 'última mensagem', data: '2024-04-07 09:37:20' },
            {  id: 2, cliente: 'sql', perfil: 'src/foto', ultima_mensagem: 'última mensagem 3', data: '2024/04/07 09:37:20' },
            {  id: 1, cliente: 'XSS', perfil: 'src/foto', ultima_mensagem: '<script>alert(0)</script>', data: '2024/04/07 10:17:08' },
        ];
        
        res.render('template', { request, empresa, page: 'mensagens', mensagens, conversas })

    } catch (error) {
        console.log(error)
    }
})


// exportando as Rotas
module.exports = router;