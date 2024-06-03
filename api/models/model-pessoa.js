const mysql = require('../database/mysql')

const row = (affectedRows=0, data=[]) => {
    return {
        affectedRows,
        rows: data
    }
}

const select = async (id=null, identidade=null, nome=null , id_sexo=null, sexo=null, limitRows = null, precisao=false) => {

    let limit = (limitRows==null) ? '' : (!isNaN(limitRows) ? `LIMIT ${limitRows}` : '')
    let where = 'WHERE 1 = 1'
    let orderby = 'ORDER BY nome ASC'
    let params = []
    
    if( id != null ) { 
        where += ' AND id_pessoa = ?'
        limit = 'LIMIT 1'
        params.push(id)
    }
    
    if( identidade != null ) { 
        where += precisao ? ' AND identidade = ?' : ' AND identidade LIKE ?'
        params.push( precisao ? identidade : `%${identidade}%` )
    }
    
    if( nome != null ) { 
        where += ' AND nome_pessoa LIKE ?'
        params.push( `%${nome}%` )
    }

    if( id_sexo != null ) { 
        where += ' AND pessoa.id_sexo LIKE ?'
        params.push( `%${id_sexo}%` )
    }

    if( sexo != null ) { 
        where += ' AND sexo LIKE ?'
        params.push( `%${sexo}%` )
    }

    const query = `
        SELECT id_entidade AS id, identidade, nome, pessoa.id_sexo, sexo 
            FROM tb_entidade As pessoa 
        LEFT JOIN tb_sexo as sexo 
            ON pessoa.id_sexo = sexo.id_sexo
        ${where} ${orderby} ${limit}` 
    const result = await mysql.execute(query, params)

    return result
}

const selectID = async (id = 0,identidade = null) => {
    if(id == null && identidade == null) return []
    
    let where = 'WHERE 1 = 1'
    let params = []
    
    if( id != null ) { 
        where += ' AND id_pessoa = ?'
        params.push(id)
    }
    
    if( identidade != null ) { 
        where += ' AND identidade = ?'
        params.push(identidade)
    }
    
    const query = `
        SELECT id_entidade AS id, identidade, nome, pessoa.id_sexo, sexo 
            FROM tb_entidade As pessoa 
        LEFT JOIN tb_sexo as sexo 
            ON pessoa.id_sexo = sexo.id_sexo
        ${where} LIMIT 1`
    const result = await mysql.execute(query, params);

    return result
}

const update = async (id=null, NewIdentidade=null, NewNome=null, NewSexo=null) => {

    if( id == null || isNaN(id) ) return "ENTIDADE NÃO ESPECIFICADA"
    
    const verificarID = await selectID(id,null)
    const verificarIDENTUDADE = await selectID(null,identidade)

    if(verificarID.length >= 1) {
        
        if(verificarIDENTIDADE.length >= 1) {
            if(verificarID.id != verificarIDENTIDADE.id) return "IDENTIDADE NÃO DISPONÍVEL"
        }
        
        let set = ''
        let where = 'WHERE 1 = 1'
        let limit = 'LIMIT 1'
        let params = []
    
        if( NewIdentidade != null ) { 
            set +=  (set=='') ? 'SET identidade = ?' : ', identidade = ?'
            params.push( NewIdentidade )
        }
        
        if( NewNome != null && isNaN(NewNome) ) { 
            set +=  (set=='') ? 'SET nome = ?' : ', nome = ?'
            params.push( NewNome )
        }
        
        if( NewSexo != null && !isNaN(NewSexo) ) { 
            set +=  (set=='') ? 'SET id_sexo = ?' : ', id_sexo = ?'
            params.push( NewSexo )
        }
    
        if( id != null ) { 
            where += ' AND id_entidade = ?'
            limit = 'LIMIT 1'
            params.push(id)
        }
        const query = `UPDATE tb_entidade ${set} ${where} ${limit}`
        const editar = await mysql.execute(query, params);

        if(editar.affectedRows >= 1){
            return row(editar.affectedRows,await selectID(id,identidade))
        }
    }
    
    return "ENTIDADE NÃO ENCONTRADA" // return row(0,[])
}

const insert = async (identidade=null, nome=null, sexo=null) => {
    if( identidade == null || (nome == null || !isNaN(nome)) ) return "DADOS INSUFICIENTES PARA ENTIDADE" // return row(0,[])

    const verificar = await selectID(null,identidade)

    if(verificar.length >= 1) {
        return "IDENTIDADE NÃO DISPONÍVEL" // return row(0,verificar)
    } else {
        
        let colums = ''
        let values = ''
        let params = []
    
        if( identidade != null ) { 
            colums +=  (colums=='') ? 'identidade' : ',identidade'
            values +=  (values=='') ? '?' : ',?'
            params.push( identidade )
        }
        
        if( nome != null && isNaN(nome) ) { 
            colums +=  (colums=='') ? 'nome' : ',nome'
            values +=  (values=='') ? '?' : ',?'
            params.push( nome )
        }
        
        if( sexo != null && !isNaN(sexo) ) { 
            colums +=  (colums=='') ? 'id_sexo' : ',id_sexo'
            values +=  (values=='') ? '?' : ',?'
            params.push( sexo )
        }
        const inserir = await mysql.execute(`INSERT INTO tb_entidade (${colums}) VALUES(${values})`, params);
        
        if(inserir.affectedRows >= 1){
            return row( inserir.affectedRows ,await selectID(inserir.insertId,null) )
        }
    }
    
    return "ENTIDADE NÃO FOI CRIADA" // return row(0,[])
}


module.exports = {
    row,
    select,
    selectID,
    insert,
    update,
}