const mysql = require('./../database/mysql')
const { SET } = require('mysql/lib/protocol/constants/types')

const model = (data = []) => {
    const {id} = data || null
    const {categoria} = data || null
    const {estado} = data || 2

	return { id , categoria , estado }
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
    const result = await mysql.execute(query, params);

    return result;
}

const selectID = async (id = 0) => {

    const params = [id]

    const query = `
        SELECT categoria.id_categoria AS id, categoria.categoria, categoria.id_estado, estado.estado
            FROM tb_categoria As categoria
        JOIN tb_estado AS estado
            ON estado.id_estado = categoria.id_estado 
        WHERE 1 = 1 AND id_categoria = ? LIMIT 1`
    const result = await mysql.execute(query, params);

    return result;
}

const update = async (id=null, Newcategoria=null, Newestado=null, estado=null) => {
    if( id == null || isNaN(id) ) return []
    if( 
        /* ( estado == -1 ) ||*/ 
        (
            ( Newcategoria == null || !isNaN(Newcategoria) ) &&  ( Newestado == null || isNaN(Newestado) )
        )
    ) return []

    let set = ''
    let where = 'WHERE 1 = 1'
    let limit = 'LIMIT 1'
    let params = []

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
    
    if( Newcategoria != null && isNaN(Newcategoria) ) { 
        set +=  (set=='') ? 'SET categoria = ?' : ', categoria = ?'
        params.push( Newcategoria )
    }
    
    if( Newestado != null && !isNaN(Newestado) ) { 
        set +=  (set=='') ? 'SET id_estado = ?' : ', id_estado = ?'
        params.push( Newestado )
    }
    console.log( set )
    const verificar = await select(id,Newcategoria,estado,null,true)

    if(verificar.length >= 1) {
        const query = `UPDATE tb_categoria ${set} ${where} ${limit}`
        const editar = await mysql.execute(query, params);

        console.log(editar)

        if(editar.affectedRows >= 1){
            return await select(id,categoria,null,null,true)
        }
        
    }
    
    return []
}

const insert = async (categoria=null) => {
    if( !isNaN(categoria) || categoria == null) return []

    const verificar = await select(null,categoria,-1,1,true)

    if(verificar.length >= 1) {
        if(verificar[0].id_estado != 2) return await update(verificar[0].id,categoria,2,-1)
    } else {
        const inserir = await mysql.execute('INSERT INTO tb_categoria(categoria) VALUES(?)', [categoria]);
        if(inserir.affectedRows >= 1){
            return await selectID(inserir.insertId)
        }
    }
    
    return []
}

const delete = async (id=null) => {
    if( id == null ) return []
    
    return await update(id,null,1,2)
}


module.exports = {
    model,
    select,
    selectID,
    insert,
    update,
    delete
}