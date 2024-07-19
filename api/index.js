const express = require('express');
const bodyParser = require("body-parser");
const xss = require('xss-clean');
const path = require('path')
const {networkInterfaces} = require('os')


const app = express();


app.use( bodyParser.json() );
app.use( bodyParser.raw() )

app.use( xss() )


/**
 * IMPORTANDO AS ROTAS
 */
const rotaCategoria = require('./routers/route-categoria');
const rotaCliente = require('./routers/route-cliente');
const rotaCardapio = require('./routers/route-cardapio');

/**
 * USANDO OU CRIANDO AS ROTAS
 */
app.use('/categoria/',rotaCategoria);
app.use('/cliente/',rotaCliente);
app.get('/',rotaCardapio)



/**
 * INICIALIZANDO AS CONFIGURAÇÕES DO SERVIDOR
 */


const PORT = process.env.API_PORT || 3000;
const HOST = process.env.API_HOST || '127.0.0.1';
app.listen( PORT , console.log( `Servidor rodando: { Host: ${HOST} , Port: ${PORT} }`) )
