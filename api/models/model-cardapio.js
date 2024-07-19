const mysql = require('../database/mysql')

const row = (affectedRows = 0, data = []) => {
    return {
        affectedRows,
        rows: data
    }
}

const select = async (all = null, produto = null, preco = null, categoria = null, limitRows = null) => {

    let limit = (limitRows == null) ? '' : (!isNaN(limitRows) ? `LIMIT ${limitRows}` : '')
    let where = 'WHERE 1 = 1 AND produto.id_estado = 2 AND preco_produto.id_estado = 2 '
    let orderby = 'ORDER BY 2 ASC'
    let params = []

    if (all != null) {
        where += ' AND ( produto.produto LIKE ? OR produto.descricao_produto LIKE ? OR categoria.categoria LIKE ? OR preco.preco LIKE ?)'
        params.push(`%${all}%`)
        params.push(`%${all}%`)
        params.push(`%${all}%`)
        params.push(`%${all}%`)
    } else {

        if (produto != null) {
            where += ' AND produto.produto LIKE ?'
            params.push(`%${produto}%`)
        }

        if (categoria != null) {
            where += ' AND categoria.categoria LIKE ?'
            params.push(`%${categoria}%`)
        }

        if (preco != null) {
            where += ' AND preco.preco LIKE ?'
            params.push(`%${preco}%`)
        }
    }

    const query = `
        SELECT 
                produto.id_produto As id, 
                produto.produto, 
                produto.descricao_produto AS descricao, 
                produto.id_categoria AS categoria, 
                preco.preco, 
                produto.imagem_produto AS img
        FROM tb_produto AS produto
        JOIN tb_preco_produto AS preco_produto
            ON preco_produto.id_produto = produto.id_produto
        JOIN tb_preco AS preco
            ON preco.id_preco = preco_produto.id_preco
        JOIN tb_categoria AS categoria
            ON categoria.id_categoria = produto.id_categoria

        ${where} ${orderby} ${limit}`
    const result = await mysql.execute(query, params)

    return result
}

module.exports = {
    row,
    select
}