const mysql = require('./../database/mysql')

const row = (affectedRows=0, data=[], message=null) => {
    return {
        affectedRows,
        rows: data,
        message:message
    }
}

const select = async (id=null, categoria=null, estado=null , limitRows = null, precisao=false) => {

    let limit = (limitRows==null) ? '' : (!isNaN(limitRows) ? `LIMIT ${limitRows}` : '')
    let where = 'WHERE 1 = 1'
    let orderby = 'ORDER BY 2 ASC'
    let params = []
    
    if( id != null ) { 
        where += ' AND id_categoria = ?'
        limit = 'LIMIT 1'
        params.push(id)
    }
    
    if( estado != -1 ) { 
        where += ' AND categoria.id_estado = ?'
        params.push( (estado == null) ? 2 : estado )
    }
    
    if( categoria != null ) { 
        where += precisao ? ' AND categoria = ?' : ' AND categoria LIKE ?'
        params.push( precisao ? categoria : `%${categoria}%` )
    }

    const query = `
        SELECT categoria.id_categoria AS id, categoria.categoria, categoria.id_estado, estado.estado
            FROM tb_categoria As categoria
        JOIN tb_estado AS estado
            ON estado.id_estado = categoria.id_estado
        ${where} ${orderby} ${limit}` 
    const result = await mysql.execute(query, params)

    return result
}

const selectID = async (id = 0,estado = null) => {

    const params = [id]

    let where = 'WHERE 1 = 1 AND id_categoria = ?'
    
    if( estado != -1 ) { 
        where += ' AND categoria.id_estado = ?'
        params.push( (estado == null) ? 2 : estado )
    }

    const query = `
        SELECT categoria.id_categoria AS id, categoria.categoria, categoria.id_estado, estado.estado
            FROM tb_categoria As categoria
        JOIN tb_estado AS estado
            ON estado.id_estado = categoria.id_estado 
        ${where} LIMIT 1`
    const result = await mysql.execute(query, params);

    return result
}

const update = async (id=null, Newcategoria=null, Newestado=null, estado=null) => {

    if( id == null || isNaN(id) ) return row(0,[], null )
    if( 
        /* ( estado == -1 ) ||*/ 
        (
            ( Newcategoria == null || !isNaN(Newcategoria) ) &&  ( Newestado == null || isNaN(Newestado) )
        )
    ) return row(0,[], null )

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
        
        if(verificarID[0].id_estado != 2) return row(0,[], null )

        if(verificarCategoria.length >= 1) {
            if(verificarID[0].id == verificarCategoria[0].id) return row(0,verificarID,null)
            if(verificarCategoria[0].estado == 1) return row(0,[], null )
        }

        const query = `UPDATE tb_categoria ${set} ${where} ${limit}`
        const editar = await mysql.execute(query, params);

        if(editar.affectedRows >= 1){
            return row(editar.affectedRows,await select(id,Newcategoria,null,null,true),null)
        }
    }
    
    return row(0,[], null )
}

const recover = async (id=null) => {

    if( id == null || isNaN(id) ) return row(0,[], null )
    
    let where = 'WHERE 1 = 1'
    let limit = 'LIMIT 1'
    let params = []

    if( id != null ) { 
        where += ' AND id_categoria = ?'
        limit = 'LIMIT 1'
        params.push(id)
    }

    const recuperar = await mysql.execute(`UPDATE tb_categoria SET id_estado = 2 ${where} ${limit}`, params);
    
    // console.log({recuperar})
    
    if(recuperar.affectedRows >= 1){
        return row(recuperar.affectedRows,await selectID(id,null),null)
    }
    
    return row(0,[], null )
}

const insert = async (categoria=null) => {
    if( !isNaN(categoria) || categoria == null) return row(0,[], null )

    const verificar = await select(null,categoria,-1,1,true)

    if(verificar.length >= 1) {
        if(verificar[0].id_estado != 2) return await recover(verificar[0].id) 
    } else {
        const inserir = await mysql.execute('INSERT INTO tb_categoria(categoria) VALUES(?)', [categoria]);
        // console.log( inserir)
        if(inserir.affectedRows >= 1){
            return row( inserir.affectedRows ,await selectID(inserir.insertId,null), null )
        }
    }
    
    return row(0,[], null )
}

const deleted = async (id=null) => {
    if( id == null || isNaN(id) ) return row(0,[], null )
    
    const verificarID = await selectID(id,-1)

    if(verificarID.length >= 1) {
        
        if(verificarID[0].id_estado != 2) return row(0,[], null )

        let where = 'WHERE 1 = 1'
        let limit = 'LIMIT 1'
        let params = []

        if( id != null ) { 
            where += ' AND id_categoria = ?'
            limit = 'LIMIT 1'
            params.push(id)
        }

        const query = `UPDATE tb_categoria SET id_estado = 1 ${where} ${limit}`
        const editar = await mysql.execute(query, params);

        if(editar.affectedRows >= 1){
            return row(editar.affectedRows,[], null )
        }
    }
    row(0,[], null )
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