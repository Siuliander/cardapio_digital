const express = require('express')
const path = require('path')
// const xss = require('xss-clean')

const app = express();

app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static( path.join(__dirname, 'public')))

console.log( "Diretorio: " + __dirname)

/**
 * IMPORTANDO AS ROTAS
 */
const rotaCardapio = require('./routes/route-cardapio');
const rotaCarrinho = require('./routes/route-carrinho');
const rotaPedidos = require('./routes/route-pedidos');
const rotaPagamento = require('./routes/route-pagamento');
const rota404 = require('./routes/route-404');

/**
 * USANDO OU CRIANDO AS ROTAS
 */
app.use('/',rotaCardapio);
app.use('/carrinho/',rotaCarrinho);
app.use('/pedidos/',rotaPedidos);
app.use('/pagamento/',rotaPagamento);


app.use('/:404',rota404);

/**
 * INICIALIZANDO O SERVIDOR 
 */
const server_port = process.env.PORT ;

app.listen( server_port , console.log(`Servidor Rodando na Porta ${server_port}`) );
