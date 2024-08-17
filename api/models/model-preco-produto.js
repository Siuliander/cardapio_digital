const mysql = require('../database/mysql')

const select = async (idProduto=null, idPreco=null) => {

    if( isNaN(idProduto) || idProduto == null) return []
    if( isNaN(idPreco) || idPreco == null) return []
   
    const query = `
        SELECT id_preco_produto AS id, preco_produto.id_produto AS idproduto, preco_produto.id_preco AS idpreco, preco_produto.id_estado AS estado 
            FROM tb_preco_produto As preco_produto
        WHERE id_produto = ? AND id_preco = ? LIMIT 1` 
    const result = await mysql.execute( query , [idProduto,idPreco] )
    return result
}

const deleted = async (idProduto = null, idPreco = null) => {
    if( isNaN(idProduto) || idProduto == null) return 0

    let where = 'WHERE 1 = 1 AND id_produto = ? '
    let params = [idProduto]

    if( idPreco != null && !isNaN(idPreco) ) { 
        where +=  'AND id_preco = ? LIMIT 1'
        params.push( idPreco )
    }

    const a = await mysql.execute(`UPDATE tb_preco_produto set id_estado = 1 ${where}`, params)

    return 0
}

const update = async (idProduto=null, idPreco=null) => {

    if( isNaN(idProduto) || idProduto == null) return 0
    if( isNaN(idPreco) || idPreco == null) return 0
    
    const verificar = await select( idProduto , idPreco )

    if(verificar.length >= 1) {
        if( verificar[0].estado != '2' )
        {
            /*
            const a = await mysql.execute(`UPDATE tb_preco_produto set id_estado = 1 WHERE id_produto = ? AND id_preco = ?`, [idProduto,idPreco])
            console.log( a )
            */
           await deleted(idProduto)

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
    if( isNaN(idProduto) || idProduto == null) return 0
    // if( isNaN(idPreco) || idPreco == null) return 0
   
    const verificar = await select( idProduto , idPreco )

    if(verificar.length >= 1) {
        if( verificar[0].estado != '2' )
        {
            console.log( 'Actualizar Preco Produto')
            return await update(idProduto,idPreco)
        } 
        return verificar[0].id 
    } else {
        const d = await deleted(idProduto)
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