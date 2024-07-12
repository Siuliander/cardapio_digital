const modelCliente = require("../models/model-cliente")

const response = (data = [], error = []) => {
    if ( error ) { 
        return { error } 
    }

	const json = {
        affected: data.affectedRows,
		quantidade: data.rows.length,
		data: data.rows.map( item => {
			return {
				id: item.id,
                identidade:item.identidade,
				nome: item.nome,
                sexo: item.sexo,
                id_sexo: item.id_sexo,
				estado: item.estado,
				id_estado: item.id_estado,
				request: {
					method: 'GET',
					descricao: 'Retorna Detalhe Específico',
					url: `${process.env.API_HOST}:${process.env.API_PORT}/cliente/${item.id}`
				}
			}
		}),
        message: data.message,
	}
	
	return json
}


exports.getAll = async (req) => {
    let result = [];
    let error = null
    try {
        const id = req.params.id || req.query.id || req.body.id ||  null;
        const identidade = req.params.identidade || req.query.identidade || req.body.identidade ||  null;
        const nome = req.params.nome || req.query.nome || req.body.nome ||  null;
        const sexo = req.params.sexo || req.query.sexo || req.body.sexo ||  null;
        const estado = req.params.estado || req.query.estado || req.body.estado ||  2;
        const limit = req.params.limit || req.query.limit || req.body.limit || null;
        const precisao = req.params.precisao || req.query.precisao || req.body.precisao || false;

        result = await modelCliente.select(id,identidade,nome,sexo,estado,limit,precisao)
        
    } catch (err) {
        error = err
        console.log(err)
    } finally {

        return response(modelCliente.row(0,result),error)
    }
}

exports.getID = async (req) => {
    let result = [];
    let error = null
    try {
        const id = req.params.id ||  null;
        result = await modelCliente.selectID(id)
    } catch (err) {
        console.log(err)
    } finally {
        return response(modelCliente.row(0,result),error)
    }
}

exports.post = async (req) => {
    let result = [];
    let error = null
    try {
        const identidade = req.params.identidade || req.query.identidade || req.body.identidade ||  null;
        const nome = req.params.nome || req.query.nome || req.body.nome ||  null;
        const sexo = req.params.sexo || req.query.sexo || req.body.sexo ||  null;
        const precisao = req.params.precisao || req.query.precisao || req.body.precisao || false;
        result = await modelCliente.insert(identidade,nome,sexo)
        
    } catch (err) {
        error = err
        console.log(err)
    } finally {
        return response(result,error)
    }
}

exports.put = async (req) => {
    let result = [];
    let error = null
    try {
        const id = req.params.id || req.query.id || req.body.id ||  null;
        const identidade = req.params.identidade || req.query.identidade || req.body.identidade ||  null;
        const nome = req.params.nome || req.query.nome || req.body.nome ||  null;
        const sexo = req.params.sexo || req.query.sexo || req.body.sexo ||  null;
        
        result = await modelCliente.update(id,identidade,nome,sexo)
        
    } catch (err) {
        // error = err
        console.log(err)
    } finally {
        return response(result,error)
    }
}

exports.delete = async (req) => {
    let result = [];
    let error = null
    try {
        const id = req.params.id || req.query.id || req.body.id ||  null;
        result = await modelCliente.deleted(id)
    } catch (err) {
        //error = err
        console.log(err)
    } finally {
        return response(result,error)
    }
}

