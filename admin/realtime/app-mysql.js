// app.js

const express = require('express');
const ejs = require('ejs');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql2');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configurando o EJS como view engine
app.set('view engine', 'ejs');

// Configuração do banco de dados MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'seu_usuario',
  password: 'sua_senha',
  database: 'seu_banco_de_dados'
});

// Conectar ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL');
});

// Rota para renderizar a página inicial
app.get('/', (req, res) => {
  // Consulta para obter os itens do banco de dados
  connection.query('SELECT * FROM items', (err, results) => {
    if (err) {
      console.error('Erro ao obter itens do banco de dados:', err);
      res.status(500).send('Erro interno do servidor');
      return;
    }
    res.render('index', { items: results });
  });
});

// WebSocket para atualizar os dados em tempo real
io.on('connection', (socket) => {
  console.log('Novo cliente conectado');

  // Solicitação inicial para obter itens
  socket.on('getItems', () => {
    connection.query('SELECT * FROM items', (err, results) => {
      if (err) {
        console.error('Erro ao obter itens do banco de dados:', err);
        return;
      }
      socket.emit('items', results);
    });
  });
});

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});