-- Criar banco de dados
CREATE DATABASE db_cardapio;

-- Selecionar o banco de dados (não é necessário no PostgreSQL, mas pode ser feito em uma conexão)
-- \c db_cardapio;

-- Criar tabelas
CREATE TABLE IF NOT EXISTS tb_estado (
    id_estado SERIAL PRIMARY KEY,
    estado VARCHAR(255) NOT NULL UNIQUE,
    estado_code SMALLINT NOT NULL DEFAULT 0 UNIQUE
);

INSERT INTO tb_estado (id_estado, estado, estado_code) VALUES 
(1, 'apagado', 0), 
(2, 'activo', 1), 
(3, 'inactivo', 2);

CREATE TABLE IF NOT EXISTS tb_mesa (
    id_mesa SERIAL PRIMARY KEY,
    mesa VARCHAR(255) NOT NULL UNIQUE,
    id_estado INT NOT NULL DEFAULT 2,
    FOREIGN KEY (id_estado) REFERENCES tb_estado (id_estado)
);

INSERT INTO tb_mesa (id_mesa, mesa, id_estado) VALUES 
(1, 's/nº', DEFAULT), 
(2, 'levar/tekway', DEFAULT);

CREATE TABLE IF NOT EXISTS tb_categoria (
    id_categoria SERIAL PRIMARY KEY,
    categoria VARCHAR(255) NOT NULL UNIQUE,
    id_estado INT NOT NULL DEFAULT 2,
    FOREIGN KEY (id_estado) REFERENCES tb_estado (id_estado)
);

CREATE TABLE IF NOT EXISTS tb_produto (
    id_produto SERIAL PRIMARY KEY,
    id_categoria INT NOT NULL, 
    FOREIGN KEY (id_categoria) REFERENCES tb_categoria (id_categoria),
    produto VARCHAR(255) NOT NULL UNIQUE,
    descricao_produto TEXT,
    imagem_produto VARCHAR(255),
    id_estado INT NOT NULL DEFAULT 2,
    FOREIGN KEY (id_estado) REFERENCES tb_estado (id_estado)
);

CREATE TABLE IF NOT EXISTS tb_preco (
    id_preco SERIAL PRIMARY KEY,
    preco DECIMAL(8, 2) NOT NULL UNIQUE
);

INSERT INTO tb_preco (id_preco, preco) VALUES (DEFAULT, '0.0');

CREATE TABLE IF NOT EXISTS tb_preco_produto (
    id_preco_produto SERIAL PRIMARY KEY,
    id_produto INT NOT NULL,
    FOREIGN KEY (id_produto) REFERENCES tb_produto (id_produto),
    id_preco INT NOT NULL,
    FOREIGN KEY (id_preco) REFERENCES tb_preco (id_preco),
    id_estado INT NOT NULL DEFAULT 2,
    FOREIGN KEY (id_estado) REFERENCES tb_estado (id_estado)
);

CREATE TABLE IF NOT EXISTS tb_sexo (
    id_sexo SERIAL PRIMARY KEY,
    sexo VARCHAR(10) CHECK (sexo IN ('masculino', 'femenino')) UNIQUE
);

INSERT INTO tb_sexo (id_sexo, sexo) VALUES 
(1, 'masculino'), 
(2, 'femenino');

CREATE TABLE IF NOT EXISTS tb_entidade (
    id_entidade SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    identidade VARCHAR(14) NOT NULL UNIQUE,
    id_sexo INT,
    FOREIGN KEY (id_sexo) REFERENCES tb_sexo (id_sexo)
);

INSERT INTO tb_entidade (id_entidade, nome, identidade, id_sexo) VALUES 
(1, 'admin', 'admin', NULL), 
(2, 'consumidor final', '0', NULL);

CREATE TABLE IF NOT EXISTS tb_cliente (
    id_cliente SERIAL PRIMARY KEY,
    id_entidade INT NOT NULL UNIQUE DEFAULT 2,
    FOREIGN KEY (id_entidade) REFERENCES tb_entidade (id_entidade),
    data_cliente TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_estado INT NOT NULL DEFAULT 2,
    FOREIGN KEY (id_estado) REFERENCES tb_estado (id_estado)
);

INSERT INTO tb_cliente (id_cliente, id_entidade, data_cliente, id_estado) VALUES 
(1, 2, DEFAULT, DEFAULT);

CREATE TABLE IF NOT EXISTS tb_nivel (
    id_nivel SERIAL PRIMARY KEY,
    nivel VARCHAR(255) NOT NULL UNIQUE,
    id_estado INT NOT NULL DEFAULT 2,
    FOREIGN KEY (id_estado) REFERENCES tb_estado (id_estado)
);

INSERT INTO tb_nivel (id_nivel, nivel, id_estado) VALUES 
(1, 'admin', DEFAULT);

CREATE TABLE IF NOT EXISTS tb_funcionario (
    id_funcionario SERIAL PRIMARY KEY,
    id_entidade INT NOT NULL UNIQUE,
    FOREIGN KEY (id_entidade) REFERENCES tb_entidade (id_entidade),
    data_funcionario TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_estado INT NOT NULL DEFAULT 2,
    FOREIGN KEY (id_estado) REFERENCES tb_estado (id_estado)
);

INSERT INTO tb_funcionario (id_funcionario, id_entidade, data_funcionario, id_estado) VALUES 
(DEFAULT, 1, DEFAULT, DEFAULT);

CREATE TABLE IF NOT EXISTS tb_senha (
    id_senha SERIAL PRIMARY KEY,
    senha VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS tb_senha_funcionario (
    id_senha_funcionario SERIAL PRIMARY KEY,
    id_funcionario INT NOT NULL,
    FOREIGN KEY (id_funcionario) REFERENCES tb_funcionario (id_funcionario),
    id_senha INT NOT NULL,
    FOREIGN KEY (id_senha) REFERENCES tb_senha (id_senha),
    id_estado INT NOT NULL DEFAULT 2,
    FOREIGN KEY (id_estado) REFERENCES tb_estado (id_estado)
);

CREATE TABLE IF NOT EXISTS tb_pedido (
    id_pedido SERIAL PRIMARY KEY,
    data_pedido TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    descricao_pedido TEXT,
    id_cliente INT NOT NULL DEFAULT 1,
    FOREIGN KEY (id_cliente) REFERENCES tb_cliente (id_cliente),
    id_mesa INT NOT NULL DEFAULT 1,
    FOREIGN KEY (id_mesa) REFERENCES tb_mesa (id_mesa),
    id_funcionario INT,
    FOREIGN KEY (id_funcionario) REFERENCES tb_funcionario (id_funcionario),
    id_estado INT NOT NULL DEFAULT 2,
    FOREIGN KEY (id_estado) REFERENCES tb_estado (id_estado)
);

CREATE TABLE IF NOT EXISTS tb_itens (
    id_item SERIAL PRIMARY KEY,
    id_pedido INT NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES tb_pedido (id_pedido),
    id_preco_produto INT NOT NULL,
    FOREIGN KEY (id_preco_produto) REFERENCES tb_preco_produto (id_preco_produto),
    id_estado INT NOT NULL DEFAULT 2,
    FOREIGN KEY (id_estado) REFERENCES tb_estado (id_estado)
);
