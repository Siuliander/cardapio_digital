const mysql = require('../database/mysql')

const modelPrecoProduto = require("./model-preco-produto")

const row = (affectedRows=0, data=[], message=null, items = false) => {
    return {
        affectedRows,
        rows: data,
        items: items ?? [],
        message:message
    } 
}

const select = async (id=null, q = null, idProduto = null, idPreco = null, quantidade = 0, limitRows = null, estado = true) => {

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
            itens.id_item as id,
            itens.id_pedido as idPedido,
            preco.preco as preco,
            itens.quantidade as quantidade,
            itens.id_estado AS estado
        FROM tb_itens as itens
        
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

const selectItensPedido = async (id=null, idPedido = 0,estadoPedido = null, estadoItem = null) => {

    let ANDWhere = ''
    let limit = ''
    let params = []

    if( id != null ) { 
        ANDWhere += (ANDWhere === '') ? ' id_item = ?' : ' AND id_item = ?'
        limit = 'LIMIT 1'
        params.push(id)
    }

    if( idPedido != null && !isNaN(idPedido) ) { 
        ANDWhere += (ANDWhere === '') ? ' item.id_pedido = ? ' : ' AND item.id_pedido = ? '
        params.push( idPedido )
    } 
    
    if( estadoItem != -1 ) { 
        ANDWhere += (ANDWhere === '') ? ' item.id_estado = ?' : ' AND item.id_estado = ?'
        params.push( (estadoItem == null) ? 2 : estadoItem )
    }

    const query = `
        SELECT 
            item.id_item as id, 
            categoria.categoria,
            produto.produto,
            item.quantidade as qtd,
            preco.preco,
            (item.quantidade * preco.preco) as sub,
            item.id_estado as estado
        FROM tb_itens as item

        INNER JOIN tb_preco_produto as precoProduto
            ON precoProduto.id_preco_produto = item.id_preco_produto

        INNER JOIN tb_produto as produto
            ON produto.id_produto = precoProduto.id_produto

        INNER JOIN tb_preco as preco 
            ON preco.id_preco = precoProduto.id_preco

        INNER JOIN tb_categoria as categoria
            ON categoria.id_categoria = produto.id_categoria

        WHERE
            ${ANDWhere}
        ${limit}
        `

    const result = await mysql.execute(query, params);

    return result
}

const update = async (id=null, NewQuantidade=null, NewEstado=null, estado=null) => {

    if( id == null || isNaN(id) ) return row(0,[], "ITEM DO PEDIDO NÃO ENCONTRADO - DADOS INSUFICIENTES OU NO FORMATO INCORRECTO")

    let set = ''
    let where = 'WHERE 1 = 1'
    let limit = 'LIMIT 1'
    let params = []

    if( NewQuantidade != null && isNaN(NewQuantidade) ) { 
        set +=  (set=='') ? 'SET quantidade = ?' : ', quantidade = ?'
        params.push( NewQuantidade )
    }
    
    if( NewEstado != null && !isNaN(NewEstado) ) { 
        set +=  (set=='') ? 'SET id_estado = ?' : ', id_estado = ?'
        params.push( NewEstado )
    }

    if( id != null ) { 
        where += ' AND id_item = ?'
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

const recover = async (id=null , idPedido=null) => {
    if( id == null || isNaN(id) ) return row(0,[], "ITEM NÃO ENCONTRADO - DADOS INSUFICIENTES")
    
    let where = 'WHERE 1 = 1'
    let limit = 'LIMIT 1'
    let params = []

    if( id != null ) { 
        where += ' AND id_item = ?'
        limit = 'LIMIT 1'
        params.push(id)
    }
    
    const recuperar = await mysql.execute(`UPDATE tb_itens SET id_estado = 2 ${where} ${limit}`, params);
    
    if(recuperar.affectedRows >= 1){
        return row(recuperar.affectedRows,await selectItensPedido(id, idPedido,null))
    }
    
    return row(0,[],"ITEM NÃO ENCONTRADO")
}

const insert = async (id_pedido, produto = 0, quantidade=1, nota=null) => {

    if( isNaN(quantidade) || quantidade == null) quantidade = 1
    if( isNaN(produto) || produto == null) return row(0,[], "PRODUTO NÃO DISPONÍVEL")

    try{
        return await mysql.execute('INSERT INTO tb_itens (id_pedido, id_preco_produto, quantidade) VALUES(?,?,?)', [ id_pedido , produto , quantidade ]);
    } catch(e) {
        return
    }
    
        
    return row(0,[], "FALHA AO ADICIONAR OU PROCESSAR ITEM")
}

const deleted = async (idPedido=0, id=null) => {
    if( idPedido == null || isNaN(idPedido) ) return row(0,[])
    if( id == null || isNaN(id) ) return row(0,[])

    const editar = await mysql.execute(`UPDATE tb_itens SET id_estado = 1 WHERE id_estado = 2 AND id_item = ? AND id_pedido = ? LIMIT 1`, [id,idPedido]);

    if(editar.affectedRows >= 1){
        return editar.affectedRows
    }
    
    return 0
}

module.exports = {
    row,
    select,
    selectItensPedido,
    insert,
    update,
    deleted,
    recover
}