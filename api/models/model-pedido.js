const mysql = require('../database/mysql')

const modelCategoria = require("./model-categoria")
const modelPreco = require("./model-preco")
const modelPrecoProduto = require("./model-preco-produto")

const row = (affectedRows=0, data=[], message=null) => {
    return {
        affectedRows,
        rows: data,
        message:message
    }
}

const select = async (id=null, idCliente = null, cliente = null, limitRows = null, estado = true) => {

    let limit = (limitRows==null) ? '' : (!isNaN(limitRows) ? `LIMIT ${limitRows}` : '')
    let where = 'WHERE 1 = 1 AND pedido.id_estado = 2 '
    let orderby = 'ORDER BY 1 DESC'
    let params = []
    
    if ( !!estado ) {
        where += ' AND pedido.id_estado = 2 '
    }

    if (idCliente != null) {
        where += ' AND cliente.id_cliente = ? '
        params.push(`%${idCliente}%`)
    } 

    if (cliente != null) {
        where += ' AND cliente.id_cliente = ? '
        params.push(`%${idCliente}%`)
    } 
    
    if( id != null ) { 
        where += ' AND id_produto = ?'
        limit = 'LIMIT 1'
        params.push(id)
    }

     

    const query = `
        SELECT 
            pedido.id_pedido as id,
            pessoaVendedor.identidade as identidadeVendedor,
            pessoaVendedor.nome as nomeVendedor,
            pessoaCliente.identidade as identidadeCliente,
            pessoaCliente.nome as nomeCliente,
            SUM(preco.preco) as total,
            pedido.id_estado AS estado
        FROM tb_pedido AS pedido

        LEFT JOIN tb_funcionario as vendedor
            ON vendedor.id_funcionario = pedido.id_funcionario
            LEFT JOIN tb_entidade as pessoaVendedor
                on pessoaVendedor.id_entidade = vendedor.id_entidade

        LEFT JOIN tb_cliente as cliente
            ON cliente.id_cliente = pedido.id_cliente
            LEFT JOIN tb_entidade as pessoaCliente
                on pessoaCliente.id_entidade = cliente.id_entidade

        JOIN tb_itens as itens
            ON itens.id_pedido = pedido.id_pedido
            JOIN tb_preco_produto as preco_produto
                ON preco_produto.id_preco_produto = itens.id_preco_produto
                JOIN tb_preco as preco
                    ON preco.id_preco = preco_produto.id_preco

        WHERE
            pedido.id_estado = 2 
            AND itens.id_estado = 2

        GROUP BY id

        ${where} ${orderby} ${limit}`
    const result = await mysql.execute(query, params)
    
    return result
}

const selectID = async (id = 0,estado = null) => {

    const params = [id]

    let where = 'WHERE 1 = 1 AND pedido.id_pedido = ? '
    
    if( estado != -1 ) { 
        where += ' AND pedido.id_estado = ?'
        params.push( (estado == null) ? 2 : estado )
    }

    const query = `
        SELECT 
            pedido.id_pedido as id,
            pessoaVendedor.identidade as identidadeVendedor,
            pessoaVendedor.nome as nomeVendedor,
            pessoaCliente.identidade as identidadeCliente,
            pessoaCliente.nome as nomeCliente,
            SUM(preco.preco) as total,
            pedido.id_estado AS estado
        FROM tb_pedido AS pedido

        LEFT JOIN tb_funcionario as vendedor
            ON vendedor.id_funcionario = pedido.id_funcionario
            LEFT JOIN tb_entidade as pessoaVendedor
                on pessoaVendedor.id_entidade = vendedor.id_entidade

        LEFT JOIN tb_cliente as cliente
            ON cliente.id_cliente = pedido.id_cliente
            LEFT JOIN tb_entidade as pessoaCliente
                on pessoaCliente.id_entidade = cliente.id_entidade

        JOIN tb_itens as itens
            ON itens.id_pedido = pedido.id_pedido
            JOIN tb_preco_produto as preco_produto
                ON preco_produto.id_preco_produto = itens.id_preco_produto
                JOIN tb_preco as preco
                    ON preco.id_preco = preco_produto.id_preco

        WHERE
            AND itens.id_estado = 2

        GROUP BY id
        ${where} LIMIT 1`
    const result = await mysql.execute(query, params);

    return result
}
const addItens = async ( pedido=null, itens = [] ) => {
    if( produto === null || isNaN(produto) ) return 0
    if( itens === null || !isNaN(itens) ) return 0
    if( itens.length < 1 ) return 0
    
    const itensAdded = await modelItens.insert(pedido, itens)
    
    return itensAdded
}

const update = async (id=null, NewProduto=null, NewDescricao=null, NewPreco=null, Newcategoria=null, Newestado=null, estado=null) => {

    if( id == null || isNaN(id) ) return row(0,[], "PRODUTO NÃO ENCONTRADO - DADOS INSUFICIENTES OU NO FORMATO INCORRECTO")

    let set = ''
    let where = 'WHERE 1 = 1'
    let limit = 'LIMIT 1'
    let params = []

    if( NewProduto != null && isNaN(NewProduto) ) { 
        set +=  (set=='') ? 'SET produto = ?' : ', produto = ?'
        params.push( NewProduto )
    }

    if( NewDescricao != null && isNaN(NewDescricao) ) { 
        set +=  (set=='') ? 'SET descricao_produto = ?' : ', descricao_produto = ?'
        params.push( NewDescricao )
    }

    if( Newcategoria != null && !isNaN(Newcategoria) ) { 
        if ( (await modelCategoria.selectID(Newcategoria)).length != 1 ) return row(0,[], "CATEGORIA NÃO ENCONTRADA") 

        set +=  (set=='') ? 'SET id_categoria = ?' : ', id_categoria = ?'
        params.push( Newcategoria )
    }
    
    if( Newestado != null && !isNaN(Newestado) ) { 
        set +=  (set=='') ? 'SET id_estado = ?' : ', id_estado = ?'
        params.push( Newestado )
    }

    if( id != null ) { 
        where += ' AND id_produto = ?'
        limit = 'LIMIT 1'
        params.push(id)
    }

    if( estado != null && estado != -1 && !isNaN(estado) ) { 
        where += ' AND id_estado = ?'
        params.push( estado )
    } else { 
        where += ' AND id_estado = 2'
        params.push( estado )
    }
    
    const verificarID = await selectID(id,-1)
    const verificarProduto = await select(null, null, NewProduto, null, null, null, true)

    if(verificarID.length >= 1) {
        
        if(verificarID[0].estado != 2) return row(0,[], "PRODUTO NÃO ENCONTRADO")

        if(verificarProduto.length >= 1) {
            if(verificarID[0].id == verificarProduto[0].id) {
                if( NewPreco != null && !isNaN(NewPreco) ) await addPreco( id , NewPreco )
                return row(0,await selectID(id))
            } else {
                return row(0,[], "NOME DE PRODUTO NÃO PODE SER DUPLICADO")
            }

            if(verificarProduto[0].estado == 1) return row(0,[], "PRODUTO NÃO ENCONTRADO")
        }

        const query = `UPDATE tb_produto ${set} ${where} ${limit}`
        const editar = await mysql.execute(query, params);

        if(editar.affectedRows >= 1){
            if( NewPreco != null && !isNaN(NewPreco) ) await addPreco( id , NewPreco )
            return row(editar.affectedRows,await selectID(id))
        }
    }
    
    return row(0,[], "PRODUTO NÃO ENCONTRADO")
}

const recover = async (id=null) => {

    if( id == null || isNaN(id) ) return row(0,[], "PRODUTO NÃO ENCONTRADO - DADOS INSUFICIENTES")
    
    let where = 'WHERE 1 = 1'
    let limit = 'LIMIT 1'
    let params = []

    if( id != null ) { 
        where += ' AND id_produto = ?'
        limit = 'LIMIT 1'
        params.push(id)
    }
    
    const recuperar = await mysql.execute(`UPDATE tb_produto SET id_estado = 2 ${where} ${limit}`, params);
    
    if(recuperar.affectedRows >= 1){
        return row(recuperar.affectedRows,await selectID(id,null))
    }
    
    return row(0,[],"PRODUTO NÃO ENCONTRADO")
}

const insert = async (produto=null,descricao=null, preco=null,categoria=null) => {
    if( !isNaN(produto) || produto == null) return row(0,[], "NOME DE PRODUTO NÃO INFORMADO")
    if( !isNaN(preco) || preco == null) preco = 0
    if( isNaN(categoria) || categoria == null || ( (await modelCategoria.selectID(categoria)).length != 1 )) return row(0,[], "CATEGORIA NÃO ENCONTRADA") 
       
    
    const verificar = await select(null, null, produto, null, null, null, false)

    if(verificar.length >= 1) {
        if(verificar[0].estado && verificar[0].estado != 2) return await recover(verificar[0].id) 
    } else {
        const inserir = await mysql.execute('INSERT INTO tb_produto (id_categoria, produto, descricao_produto) VALUES(?,?,?)', [categoria, produto, descricao]);
        
        if(inserir.affectedRows >= 1){
            /*
            const newPreco = await modelPreco.insert(preco)
            const addPrecoProduto = await modelPrecoProduto.insert(inserir.insertId,newPreco)
            */
            await addPreco( inserir.insertId , preco )
            return row( inserir.affectedRows ,await selectID(inserir.insertId,null) )
        }
    }

    return row(0,[], "FALHA AO ADICIONAR PRODUTO")
}

const deleted = async (id=null) => {
    if( id == null || isNaN(id) ) return row(0,[])

    const verificarID = await selectID(id,-1)

    if(verificarID.length >= 1) {
        if( verificarID[0].estado && verificarID[0].estado != 2) return row(0,[],"PRODUTO NÃO ENCONTRADO")

        const query = `UPDATE tb_produto SET id_estado = 1 WHERE 1 = 1 AND id_produto = ? LIMIT 1`
        const editar = await mysql.execute(query, [id]);

        if(editar.affectedRows >= 1){
            return row(editar.affectedRows,[], "PRODUTO ELIMINADO COM SUCESSO")
        }
    }

    return row(0,[],"PRODUTO NÃO ENCONTRADO")
}


module.exports = {
    row,
    select,
    selectID,
    insert,
    update,
    deleted,
    recover
}