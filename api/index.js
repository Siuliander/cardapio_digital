const express = require('express');
const bodyParser = require("body-parser");
const xss = require('xss-clean');
const path = require('path')
const {networkInterfaces} = require('os')

const cors = require('cors')
const headersPermitidos = require('./cors.config')



const app = express();

app.use( (req, res, next)=>{
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Headers",'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, content-type, Date, X-Api-Version, Authorization')
    res.header("Access-Control-Allow-Methods","GET,OPTIONS,PATCH,DELETE,POST,PUT")
    res.header("Access-Control-Allow-Credentials","true")
 
    app.use( cors() )
    next()
})

// app.use( cors ( headersPermitidos ) )
// app.use( express.urlencoded( { extended : true , limit : 10000 , parameterLimit : 2 }))
app.use( bodyParser.json() );
app.use( bodyParser.raw() )
app.use( bodyParser.urlencoded( { extended : false }) )

app.use( xss() )


/**
 * IMPORTANDO AS ROTAS
 */
const rotaCategoria = require('./routers/route-categoria');
const rotaCliente = require('./routers/route-cliente');
const rotaCardapio = require('./routers/route-cardapio');
const rotaProduto = require('./routers/route-produto');
const rotaUpload = require('./routers/route-upload');

/**
 * USANDO OU CRIANDO AS ROTAS
 */
app.use('/',rotaCardapio);
app.use('/categoria/',rotaCategoria);
app.use('/cliente/',rotaCliente);
app.use('/produto/',rotaProduto);
app.use('/upload/',rotaUpload);



/**
 * INICIALIZANDO AS CONFIGURAÇÕES DO SERVIDOR
 */


const PORT = process.env.API_PORT || 3000;
const HOST = process.env.API_HOST || '127.0.0.1';
app.listen( PORT , console.log( `Servidor rodando: { Host: ${HOST} , Port: ${PORT} }`) )
