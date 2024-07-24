const mysql = require('../database/mysql')

const select = async (id=null, preco=null) => {

    let limit = ''
    let where = 'WHERE 1 = 1'
    let orderby = 'ORDER BY 2 ASC'
    let params = []
    
    if( id != null ) { 
        where += ' AND id_preco = ?'
        limit = 'LIMIT 1'
        params.push(id)
    }

    if( preco != null ) { 
        where += ' AND preco = ?'
        params.push( preco )
    }

    const query = `
        SELECT preco.id_preco AS id, preco.preco
            FROM tb_preco As preco
        ${where} ${orderby} ${limit}` 
    const result = await mysql.execute(query, params)

    return result
}

const insert = async (preco=null) => {
    if( !isNaN(preco) || preco == null) return 0

    const verificar = await select(null,preco)

    if(verificar.length >= 1) {
        return verificar[0].id 
    } else {
        const inserir = await mysql.execute('INSERT INTO tb_preco(preco) VALUES(?)', [preco]);
        
        if(inserir.affectedRows >= 1){
            return inserir.insertId
        }
    }
    
    return 0
}

module.exports = {
    select,
    insert,
}