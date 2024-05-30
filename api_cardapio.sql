create database if not exists db_cardapio;

use db_cardapio;

create table if not exists tb_estado
(
    id_estado int auto_increment not null primary key,
    estado varchar(255) not null unique,
    estado_code tinyint(1) not null unique default 0
);

insert into tb_estado values (1,'apagado',0),(2,'activo',1),(3,'inactivo',2);

create table if not exists tb_mesa
(
    id_mesa int auto_increment not null primary key,
    mesa varchar(255) not null unique,
    id_estado int not null default 2,
    foreign key(id_estado) references tb_estado(id_estado)
);

insert into tb_mesa values (1,'s/nº',default),(2,'levar/tekway',default);

create table if not exists tb_categoria
(
    id_categoria int auto_increment not null primary key,
    categoria varchar(255) not null unique,
    id_estado int not null default 2,
    foreign key(id_estado) references tb_estado(id_estado)
);

create table if not exists tb_produto
(
    id_produto int auto_increment not null primary key,
    id_categoria int not null, 
    foreign key(id_categoria) references tb_categoria(id_categoria),
    produto varchar(255) not null unique,
    descricao_produto text null,
    id_estado int not null default 2,
    foreign key(id_estado) references tb_estado(id_estado)
);

create table if not exists tb_preco
(
    id_preco int auto_increment not null primary key,
    preco decimal(8,2) not null unique
);

insert into tb_preco values (default,'0.0');

create table if not exists tb_preco_produto
(
    id_preco_produto int auto_increment not null primary key,
    id_produto int not null,
    foreign key(id_produto) references tb_produto(id_produto),
    id_preco int not null,
    foreign key(id_preco) references tb_preco(id_preco),
    id_estado int not null default 2,
    foreign key(id_estado) references tb_estado(id_estado)
);

create table if not exists tb_sexo
(
    id_sexo int auto_increment not null primary key,
    sexo enum('masculino','femenino') unique
);

insert into tb_sexo values (1,'masculina'), (2,'femenino');

create table if not exists tb_entidade
(
    id_entidade int auto_increment not null primary key,
    nome varchar(255) not null,
    identidade varchar(14) not null unique,
    id_sexo int null
);

insert into tb_entidade values (1,'admin','admin',null), (2,'consumidor final','0',null);

create table if not exists tb_cliente 
(
    id_cliente int auto_increment not null primary key,
    id_entidade int not null unique default 2,
    foreign key(id_entidade) references tb_entidade(id_entidade),
    data_cliente datetime not null default now(),
    id_estado int not null default 2,
    foreign key(id_estado) references tb_estado(id_estado)
);

insert into tb_cliente values (1,2,default,default);

create table if not exists tb_nivel
(
    id_nivel int auto_increment not null primary key,
    nivel varchar(255) not null unique,
    id_estado int not null default 2,
    foreign key(id_estado) references tb_estado(id_estado)
);

insert into tb_nivel values (1,'admin', default);

create table if not exists tb_funcionario
(
    id_funcionario int auto_increment not null primary key,
    id_entidade int not null unique,
    foreign key(id_entidade) references tb_entidade(id_entidade),
    data_funcionario datetime not null default now(),
    id_estado int not null default 2,
    foreign key(id_estado) references tb_estado(id_estado)

);

insert into tb_funcionario values (default,1,default,default);

create table if not exists tb_senha
(
    id_senha int auto_increment not null primary key,
    senha varchar(255) not null unique
);

create table if not exists tb_senha_funcionario
(
    id_senha_funcionario int auto_increment not null primary key,
    id_funcionario int not null,
    foreign key(id_funcionario) references tb_funcionario(id_funcionario),
    id_senha int not null,
    foreign key(id_senha) references tb_senha(id_senha),
    id_estado int not null default 2,
    foreign key(id_estado) references tb_estado(id_estado)
);

create table if not exists tb_pedido
(
    id_pedido int auto_increment not null primary key,
    data_pedido datetime not null default now(),
    descricao_pedido text null,
    id_cliente int not null default 1,
    foreign key(id_cliente) references tb_cliente(id_cliente),
    id_mesa int not null default 1,
    foreign key(id_mesa) references tb_mesa(id_mesa),
    id_funcionario  int null,
    foreign key(id_funcionario) references tb_funcionario(id_funcionario),
    id_estado int not null default 2,
    foreign key(id_estado) references tb_estado(id_estado)
);

create table if not exists tb_itens
(
    id_item int auto_increment not null primary key,
    id_pedido int not null,
    foreign key(id_pedido) references tb_pedido(id_pedido),
    id_preco_produto int not null,
    foreign key(id_preco_produto) references tb_preco_produto(id_preco_produto),
    id_estado int not null default 2,
    foreign key(id_estado) references tb_estado(id_estado)
);

/*
create table if not exists tb_pagamento
();



create table if not exists tb_
();
*/