const mysql = require('../database/mysql')
const modelItemPedido = require("./model-ItensPedido")

const row = (affectedRows=0, data=[], message=null, items = false) => {
    return {
        affectedRows,
        rows: data,
        items: items ?? [],
        message:message
    } 
}

const select = async (id=null, q = null, idVendedor = null, idCliente = null,total = 0, qtdProduto = 0, limitRows = null, estado = true) => {

    let limit = (limitRows==null) ? '' : (!isNaN(limitRows) ? `LIMIT ${limitRows}` : '')
    let ANDWhere = 'AND pedido.id_estado = 2 '
    let orderby = 'ORDER BY 1 DESC'
    let params = []
    
    if ( !!estado ) {
        ANDWhere += ' AND pedido.id_estado = 2 '
    }

    if (idCliente != null) {
        ANDWhere += ' AND cliente.id_cliente = ? '
        params.push(`%${idCliente}%`)
    } 
    
    if( id != null ) { 
        ANDWhere += ' AND id_produto = ?'
        limit = 'LIMIT 1'
        params.push(id)
    }

    if (q != null) {
        ANDWhere += ' AND ( notaPedido = ? OR cliente.id_cliente = ?  ) '
        params.push(`%${q}%`)
        params.push(`%${q}%`)
    } 

     
    const query = `
        SELECT  
            pedido.id_pedido as id,
            pedido.id_funcionario as idVendedor,
            pessoaVendedor.identidade as identidadeVendedor,
            pessoaVendedor.nome as nomeVendedor,
            pedido.id_cliente as idCliente,
            pessoaCliente.identidade as identidadeCliente,
            pessoaCliente.nome as nomeCliente,
            SUM(preco.preco * itens.quantidade) as total,
            SUM(itens.quantidade) as qtdProduto,
            pedido.descricao_pedido as notaPedido,
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
            1 = 1 
            AND itens.id_estado = 2
            ${ANDWhere}
        GROUP BY 
            id    
        ${orderby}
        ${limit}`
    
    const result = await mysql.execute(query, params)
    
    return result
}

const selectID = async (id = 0,estado = null) => {

    const params = [id]

    let ANDWhere = ' AND pedido.id_pedido = ? '
    
    if( estado != -1 ) { 
        ANDWhere += ' AND pedido.id_estado = ?'
        params.push( (estado == null) ? 2 : estado )
    }

    const query = `
        SELECT 
            pedido.id_pedido as id,
            pedido.id_funcionario as idVendedor,
            pessoaVendedor.identidade as identidadeVendedor,
            pessoaVendedor.nome as nomeVendedor,
            pedido.id_cliente as idCliente,
            pessoaCliente.identidade as identidadeCliente,
            pessoaCliente.nome as nomeCliente,
            SUM(preco.preco * itens.quantidade) as total,
            SUM(itens.quantidade) as qtdProduto,
            pedido.descricao_pedido as notaPedido,
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
            1 = 1 
            AND itens.id_estado = 2 
            ${ANDWhere}
        GROUP BY 
            id 
        LIMIT 1`
    const result = await mysql.execute(query, params);

    return result
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

const insert = async (itens=[],nota=null, cliente=1,vendedor=null) => {

    if( Array.isArray(itens) && itens.length >= 1) {

        itens.push( {
			"produto"	: 0,
			"quantidade": 0
		 } )

        const inserir = await mysql.execute('INSERT INTO tb_pedido (id_funcionario, id_cliente, descricao_pedido) VALUES(?,?,?)', [vendedor, cliente, nota]);
        
        if(inserir.affectedRows >= 1){
            itens.forEach( async item => {
                const addItem =  await modelItemPedido.insert( inserir.insertId, item.produto, item.quantidade,null)
                // produto.push( addItem )  
            })
            return row( inserir.affectedRows ,await selectID(inserir.insertId,null),null, [] )
        }
    } 

    return row(0,[], "FALHA AO ADICIONAR OU PROCESSAR PEDIDO")
}

const deleted = async (id=null) => {
    if( id == null || isNaN(id) ) return row(0,[])

    const verificarID = await selectID(id,-1)

    if(verificarID.length >= 1) {
        if( verificarID[0].estado && verificarID[0].estado != 2) return row(0,[],"PEDIDO NÃO ENCONTRADO")

        const editar = await mysql.execute(`UPDATE tb_pedido SET id_estado = 1 WHERE id_pedido = ? LIMIT 1`, [id]);

        if(editar.affectedRows >= 1){
            await mysql.execute(`UPDATE tb_itens SET id_estado = 1 WHERE id_pedido = ?`, [id]);
            return row(editar.affectedRows,[], "PEDIDO ELIMINADO OU CANCELADO COM SUCESSO")
        }
    }

    return row(0,[],"PEDIDO NÃO ENCONTRADO")
}

const deletedItemPedido = async (idPedido=0,itens=[]) => {

    if( Array.isArray(itens) && itens.length >= 1) {

        let count = 0
        itens.forEach( async item => {
            await modelItemPedido.deleted( idPedido , item.id )
            count += 1
        })
            
        return row( count ,await selectID(idPedido,null),null, [] )
    } 

    return row(0,[], "FALHA AO ALTERAR PEDIDO")
}


module.exports = {
    row,
    select,
    selectID,
    insert,
    update,
    deleted,
    deletedItemPedido,
    recover
}