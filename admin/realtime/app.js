// app.js

const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const socketIo = require('socket.io');

const app = express();
const server = require('http').createServer(app);
const io = socketIo(server);

// Configurando o EJS como view engine
app.set('view engine', 'ejs');

// Conectando ao banco de dados MongoDB
mongoose.connect('mongodb://localhost:27017/seu_banco_de_dados', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado ao banco de dados'))
.catch(err => console.error('Erro ao conectar ao banco de dados:', err));

// Definindo o modelo de dados
const ItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number
});

const Item = mongoose.model('Item', ItemSchema);

// Rota para renderizar a página inicial
app.get('/', async (req, res) => {
  try {
    // Obtendo dados do banco de dados
    const items = await Item.find();
    // Renderizando a página e passando os dados para o template
    res.render('index', { items });
  } catch (err) {
    console.error('Erro ao obter itens do banco de dados:', err);
    res.status(500).send('Erro interno do servidor');
  }
});

// WebSocket para atualizar os dados em tempo real
io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  // Envia os itens para o cliente quando ele se conectar
  socket.on('getItems', async () => {
    try {
      const items = await Item.find();
      socket.emit('items', items);
    } catch (err) {
      console.error('Erro ao obter itens do banco de dados:', err);
    }
  });
});

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});