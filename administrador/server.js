const express = require('express')
var path = require('path')

const xss = require('xss-clean')

const server = express()
server.set('view engine', 'ejs')

server.use(express.json())
server.use(express.urlencoded({extended: false}))
// server.use(cookieParser())
server.use(express.static( path.join(__dirname, 'public')))

server.use( xss() )

/**
 * IMPORTANDO AS ROTAS
 */
const rota404 = require('./routes/route-404');
const rotaEntrar = require('./routes/route-entrar');
const rotaRecuperar = require('./routes/route-recuperar');
const rotaInicio = require('./routes/route-inicio');
const rotaMensagem = require('./routes/route-mensagem');

/**
 * USANDO OU CRIANDO AS ROTAS
 */
server.use('/entrar',rotaEntrar);
server.use('/recuperar',rotaRecuperar);
server.use('/',rotaInicio);
server.use('/mensagens',rotaMensagem);
// server.use('/mensagens/:id',rotaMensagem);


server.use('/:404',rota404);
/**
 * INICIALIZANDO O SERVIDOR 
 */
const server_port = process.env.PORT || 8080;

server.listen(server_port, () => {
    console.log(`Servidor do ADMIN rodando na porta: ${server_port}`)
})