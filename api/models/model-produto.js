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

const select = async (id=null, all = null, produto = null, preco = null, categoria = null, limitRows = null, estado = true) => {

    let limit = (limitRows==null) ? '' : (!isNaN(limitRows) ? `LIMIT ${limitRows}` : '')
    let where = 'WHERE 1 = 1 AND categoria.id_estado = 2 '
    let orderby = 'ORDER BY 2 ASC'
    let params = []
    
    if ( !!estado ) {
        // where += ' AND preco_produto.id_estado = 2 AND produto.id_estado = 2 '
        where += ' AND produto.id_estado = 2 '
    }

    if (all != null) {
        where += ' AND ( produto.produto LIKE ? OR produto.descricao_produto LIKE ? OR categoria.categoria LIKE ? OR preco.preco LIKE ?)'
        params.push(`%${all}%`)
        params.push(`%${all}%`)
        params.push(`%${all}%`)
        params.push(`%${all}%`)
    } else {
        
        if( id != null ) { 
            where += ' AND id_produto = ?'
            limit = 'LIMIT 1'
            params.push(id)
        }

        if (produto != null) {
            where += ' AND produto = ?'
            params.push( produto )
        }

        if (categoria != null) {
            where += isNaN(categoria) ? ' AND categoria.categoria LIKE ?' : ' AND categoria.id_categoria = ?'
            params.push( isNaN(categoria) ? `%${categoria}%` : categoria )
        }

        if (preco != null) {
            where += isNaN(categoria) ? ' AND preco.preco LIKE ?' : ' AND preco.id_preco = ?'
            params.push( isNaN(categoria) ? `%${preco}%` : preco )
        }
    }

    const query = `
        SELECT 
                produto.id_produto As id, 
                produto.produto, 
                produto.descricao_produto AS descricao, 
                produto.id_categoria AS idCategoria, 
                categoria.categoria AS categoria, 
                preco.id_preco AS idPreco, 
                preco.preco, 
                produto.imagem_produto AS img,
                produto.id_estado AS estado
        FROM tb_produto AS produto
        LEFT JOIN tb_preco_produto AS preco_produto
            ON preco_produto.id_produto = produto.id_produto
        LEFT JOIN tb_preco AS preco
            ON preco.id_preco = preco_produto.id_preco
        JOIN tb_categoria AS categoria
            ON categoria.id_categoria = produto.id_categoria

        ${where} ${orderby} ${limit}`
    const result = await mysql.execute(query, params)
    
    return result
}

const selectID = async (id = 0,estado = null) => {

    const params = [id]

    let where = 'WHERE 1 = 1  AND categoria.id_estado = 2 AND produto.id_produto = ?'
    
    if( estado != -1 ) { 
        where += ' AND produto.id_estado = ?'
        params.push( (estado == null) ? 2 : estado )
    }

    const query = `
        SELECT 
                produto.id_produto As id, 
                produto.produto, 
                produto.descricao_produto AS descricao, 
                produto.id_categoria AS idCategoria, 
                categoria.categoria AS categoria, 
                preco.id_preco AS idPreco, 
                preco.preco, 
                produto.imagem_produto AS img,
                produto.id_estado AS estado
        FROM tb_produto AS produto
        LEFT JOIN tb_preco_produto AS preco_produto
            ON preco_produto.id_produto = produto.id_produto
        LEFT JOIN tb_preco AS preco
            ON preco.id_preco = preco_produto.id_preco
        JOIN tb_categoria AS categoria
            ON categoria.id_categoria = produto.id_categoria
        ${where} LIMIT 1`
    const result = await mysql.execute(query, params);

    return result
}

const update = async (id=null, Newcategoria=null, Newestado=null, estado=null) => {

    if( id == null || isNaN(id) ) return row(0,[])
    if( 
        /* ( estado == -1 ) ||*/ 
        (
            ( Newcategoria == null || !isNaN(Newcategoria) ) &&  ( Newestado == null || isNaN(Newestado) )
        )
    ) return row(0,[])

    let set = ''
    let where = 'WHERE 1 = 1'
    let limit = 'LIMIT 1'
    let params = []

    if( Newcategoria != null && isNaN(Newcategoria) ) { 
        set +=  (set=='') ? 'SET categoria = ?' : ', categoria = ?'
        params.push( Newcategoria )
    }
    
    if( Newestado != null && !isNaN(Newestado) ) { 
        set +=  (set=='') ? 'SET id_estado = ?' : ', id_estado = ?'
        params.push( Newestado )
    }

    if( id != null ) { 
        where += ' AND id_categoria = ?'
        limit = 'LIMIT 1'
        params.push(id)
    }

    if( estado != null && estado != -1 && !isNaN(estado) ) { 
        where += ' AND id_estado = ?'
        params.push( estado )
    }

    if( estado == null || isNaN(estado) ) { 
        where += ' AND id_estado = 2'
        params.push( estado )
    }
    
    const verificarID = await selectID(id,-1)
    const verificarCategoria = await select(null,Newcategoria,null,null,true)

    if(verificarID.length >= 1) {
        
        if(verificarID[0].id_estado != 2) return row(0,[])

        if(verificarCategoria.length >= 1) {
            if(verificarID[0].id == verificarCategoria[0].id) return row(0,verificarID)
            if(verificarCategoria[0].estado == 1) return row(0,[])
        }

        const query = `UPDATE tb_categoria ${set} ${where} ${limit}`
        const editar = await mysql.execute(query, params);

        if(editar.affectedRows >= 1){
            return row(editar.affectedRows,await select(id,Newcategoria,null,null,true))
        }
    }
    
    return row(0,[])
}

const recover = async (id=null) => {

    if( id == null || isNaN(id) ) return row(0,[])
    
    let where = 'WHERE 1 = 1'
    let limit = 'LIMIT 1'
    let params = []

    if( id != null ) { 
        where += ' AND id_produto = ?'
        limit = 'LIMIT 1'
        params.push(id)
    }
    
    const recuperar = await mysql.execute(`UPDATE tb_produto SET id_estado = 2 ${where} ${limit}`, params);
    console.log( recuperar )
    if(recuperar.affectedRows >= 1){
        return row(recuperar.affectedRows,await selectID(id,null))
    }
    
    return row(0,[])
}

const insert = async (produto=null,descricao=null, preco=null,categoria=null) => {
    if( !isNaN(produto) || produto == null) return row(0,[])
    // if( !isNaN(preco) || preco == null) return row(0,[])
    if( isNaN(categoria) || categoria == null) return row(0,[])
    
    const verificar = await select(null, null, produto, null, null, null, false)

    if(verificar.length >= 1) {
        if(verificar[0].estado && verificar[0].estado != 2) return await recover(verificar[0].id) 
    } else {
        const inserir = await mysql.execute('INSERT INTO tb_produto (id_categoria, produto, descricao_produto) VALUES(?,?,?)', [categoria, produto, descricao]);
        
        if(inserir.affectedRows >= 1){
            const newPreco = await modelPreco.insert(preco)
            const addPrecoProduto = await modelPrecoProduto.insert(inserir.insertId,newPreco)
            return row( inserir.affectedRows ,await selectID(inserir.insertId,null) )
        }
    }

    return row(0,[])
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