const mysql = require('../database/mysql')

const select = async (idProduto=null, idPreco=null) => {

    if( !isNaN(idProduto) || idProduto == null) return []
    if( !isNaN(idPreco) || idPreco == null) return []
   
    const query = `
        SELECT id_preco_produto AS id, preco_produto.id_produto AS idProduto, preco_produto.id_preco AS idPreco, preco_produto.id_estado AS estado 
            FROM tb_preco_produto As preco_produto
        WHERE id_produto = ? AND id_preco = ? LIMIT 1` 
    const result = await mysql.execute( query , [idProduto,idPreco] )

    return result
}

const update = async (idProduto=null, idPreco=null) => {

    if( !isNaN(idProduto) || idProduto == null) return 0
    if( !isNaN(idPreco) || idPreco == null) return 0
    
    const verificar = await select( idProduto , idPreco )

    if(verificar.length >= 1) {
        if( verificar[0].estado != '2' )
        {
            const query = `UPDATE tb_preco_produto set id_estado = 2 WHERE id_produto = ? AND id_preco = ? LIMIT 1`
            const editar = await mysql.execute(query, [idProduto,idPreco]);

            if(editar.affectedRows >= 1){
                return verificar[0].id 
            }
        } else {
            return verificar[0].id 
        }
    } 
    return 0
}

const insert = async (idProduto=null, idPreco=null) => {
    if( !isNaN(idProduto) || idProduto == null) return 0
    if( !isNaN(idPreco) || idPreco == null) return 0
   
    const verificar = await select( idProduto , idPreco )

    if(verificar.length >= 1) {
        if( verificar[0].estado != '2' )
        {
            return await update(idProduto,idPreco)
        } 
        return verificar[0].id 
    } else {
        const inserir = await mysql.execute('INSERT INTO tb_preco_produto(id_produto,id_preco) VALUES(?,?)', [idProduto,idPreco]);

        if(inserir.affectedRows >= 1){
            return inserir.insertId
        }
    }
    
    return 0
}

module.exports = {
    select,
    insert,
    update
}