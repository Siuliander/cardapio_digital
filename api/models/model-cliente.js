const mysql = require('../database/mysql')
const modelPessoa = require('./model-pessoa')

const row = (affectedRows=0, data=[], message=null) => {
    return {
        affectedRows,
        rows: data,
        message:message
    }
}

const select = async (id=null, identidade=null, nome=null , sexo=null, estado=null, limitRows = null, precisao=false) => {

    let limit = (limitRows==null) ? '' : (!isNaN(limitRows) ? `LIMIT ${limitRows}` : '')
    let where = 'WHERE 1 = 1'
    let orderby = 'ORDER BY nome ASC'
    let params = []
    
    if( id != null ) { 
        where += ' AND id_cliente = ?'
        limit = 'LIMIT 1'
        params.push(id)
    }
    
    if( identidade != null ) { 
        where += precisao ? ' AND identidade = ?' : ' AND identidade LIKE ?'
        params.push( precisao ? identidade : `%${identidade}%` )
    }
    
    if( estado != -1 ) { 
        where += ' AND cliente.id_estado = ?'
        params.push( (estado == null) ? 2 : estado )
    }
    
    if( nome != null ) { 
        where += ' AND nome LIKE ?'
        params.push( `%${nome}%` )
    }

    if( sexo != null ) { 
        where += ' AND pessoa.id_sexo = ?'
        params.push( sexo )
    }

    const query = `
        SELECT id_cliente AS id, cliente.id_entidade AS idPessoa, identidade, nome, pessoa.id_sexo, sexo, data_cliente AS data, cliente.id_estado, estado 
            FROM tb_cliente AS cliente
        JOIN tb_entidade AS pessoa 
            ON pessoa.id_entidade = cliente.id_entidade
        LEFT JOIN tb_sexo AS sexo 
            ON pessoa.id_sexo = sexo.id_sexo
        JOIN tb_estado AS estado
            ON estado.id_estado = cliente.id_estado
        ${where} ${orderby} ${limit}` 
    const result = await mysql.execute(query, params)

    return result
}

const selectID = async (id = 0, pessoa = null, identidade = null) => {
    if(id == null && pessoa == null && identidade == null) return []
    
    let where = 'WHERE 1 = 1'
    let params = []
    
    if( id != null ) { 
        where += ' AND id_cliente = ?'
        params.push(id)
    }
    
    if( pessoa != null ) { 
        where += ' AND cliente.id_entidade = ?'
        params.push(pessoa)
    }
    
    if( identidade != null ) { 
        where += ' AND identidade = ?'
        params.push(identidade)
    }

    const query = `
        SELECT id_cliente AS id, cliente.id_entidade AS idPessoa, identidade, nome, pessoa.id_sexo, sexo, data_cliente AS data, cliente.id_estado, estado 
            FROM tb_cliente AS cliente
        JOIN tb_entidade AS pessoa 
            ON pessoa.id_entidade = cliente.id_entidade 
        LEFT JOIN tb_sexo as sexo 
            ON pessoa.id_sexo = sexo.id_sexo
        JOIN tb_estado AS estado
            ON estado.id_estado = cliente.id_estado
        ${where} LIMIT 1`
    const result = await mysql.execute(query, params);

    return result
}

const update = async (id=null, NewIdentidade=null, NewNome=null, NewSexo=null) => {
    if( id == null || isNaN(id) ) return row(0,[],"CLIENTE NÃO ESPECIFICADO")
    
    const verificarID = await selectID(id,null,null)

    if(verificarID.length >= 1) {
        
        const verificarIDENTIDADE = await selectID(null,NewIdentidade,null)

        if(verificarIDENTIDADE.length >= 1) {
            if(verificarID[0].id != verificarIDENTIDADE[0].id) return row(0,[],"IDENTIDADE NÃO DISPONÍVEL")
        }
        
        if( verificarID[0].id_estado == 2 ){
            const updatePessoa = await modelPessoa.update(verificarID[0].idPessoa,NewIdentidade,NewNome,NewSexo)

            const idPessoa = updatePessoa.rows[0].id
            let set = ''
            let where = 'WHERE 1 = 1 AND id_estado = 2'
            let limit = 'LIMIT 1'
            let params = []

            if( idPessoa != null && !isNaN(idPessoa) ) { 
                set +=  (set=='') ? 'SET id_entidade = ?' : ', id_entidade = ?'
                params.push( idPessoa )
            }

            if( id != null ) { 
                where += ' AND id_cliente = ?'
                limit = 'LIMIT 1'
                params.push(id)
            }

            const query = `UPDATE tb_cliente ${set} ${where} ${limit}`
            const editar = await mysql.execute(query, params);

            if(editar.affectedRows >= 1){
                return row(editar.affectedRows,await selectID(id,idPessoa,NewIdentidade),"DADOS DO CLIENTE FORAM ACTUALIZADOS")
            }
        }
    }
    
    return row(0,[],"CLIENTE NÃO ENCONTRADO")
}

const insert = async (identidade=null, nome=null, sexo=null) => {
    
    const addPessoa = await modelPessoa.insert(identidade,nome,sexo)

    if(addPessoa.affectedRows >= 1){
        const verificar = await selectID(null,addPessoa.rows[0].id,null)

        if(verificar.length >= 1) {
            return row(0,[],"IDENTIDADE NÃO DISPONÍVEL - CLIENTE JÁ EXISTENTE") // return row(0,verificar)
        } else {
            
            const id = addPessoa.rows[0].id
            let colums = ''
            let values = ''
            let params = []
        
            if( id != null ) { 
                colums +=  (colums=='') ? 'id_entidade' : ',id_entidade'
                values +=  (values=='') ? '?' : ',?'
                params.push( id )
            }
            
            const inserir = await mysql.execute(`INSERT INTO tb_cliente (${colums}) VALUES(${values})`, params);
            
            if(inserir.affectedRows >= 1){
                return row( inserir.affectedRows ,await selectID(inserir.insertId), "CLIENTE CRIADO COM SUCESSO" )
            }
        }
    }
    
    return row(0,[],"CLIENTE NÃO FOI CRIADA") // return row(0,[])
}

const recover = async (id=null) => {
    if( id == null || isNaN(id) ) return row(0,[],"CLIENTE NÃO ESPECIFICADO")
    
    const verificarID = await selectID(id,null,null)

    if(verificarID.length >= 1) {
        if( verificarID[0].estado != 2 ){
            const editar = await mysql.execute(`UPDATE tb_cliente SET id_estado = 12 WHERE id_cliente = ? LIMIT 1`, [id]);

            if(editar.affectedRows >= 1){
                return row(editar.affectedRows,await selectID(id,idPessoa,NewIdentidade),"CRLIENTE RECUPERADO COM SUCESSO")
            }
        }
    }
    
    return row(0,[],"CLIENTE NÃO ENCONTRADO NOS HISTÓRICOS")
}

const deleted = async (id=null) => {
    if( id == null || isNaN(id) ) return "CLIENTE NÃO ESPECIFICADO"
    
    const verificarID = await selectID(id,null,null)

    if(verificarID.length >= 1) {
        if( verificarID[0].id_estado == 2 ){
            const editar = await mysql.execute(`UPDATE tb_cliente SET id_estado = 1 WHERE id_cliente = ? LIMIT 1`, [id]);
            
            if(editar.affectedRows >= 1){
                return row(editar.affectedRows,[],"CLIENTE ELIMINADO COM SUCESSO")
            }
        }
    }
    
    return row(0,[],"CLIENTE NÃO ENCONTRADO")
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