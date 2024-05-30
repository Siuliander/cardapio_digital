const modelCategoria = require("./../models/model-categoria")

const response = (data = [], error = []) => {
    if ( error ) { return {error} }

	const json = {
		quantidade: data.length,
		data: data.map( item => {
			return {
				id: item.id,
				nome: item.categoria,
				estado: item.estado,
				request: {
					method: 'GET',
					descricao: 'Retorna Detalhe Específico',
					url: `${process.env.API_HOST}:${process.env.API_PORT}/categoria/${item.id}`
				}
			}
		})
	}
	
	return json
}




exports.getCategoriaAll = async (req) => {
    let result = [];
    let error = null
    try {
        const id = req.params.id || req.query.id || req.body.id ||  null;
        const categoria = req.params.categoria || req.query.categoria || req.body.categoria ||  null;
        const estado = req.params.estado || req.query.estado || req.body.estado ||  2;
        const limit = req.params.limit || req.query.limit || req.body.limit || null;

        result = await modelCategoria.select(id,categoria,estado,limit)
        
    } catch (err) {
        // error = err
        console.log(err)
    } finally {
        return response(result,error)
    }
}

exports.getCategoriaID = async (req) => {
    let result = [];
    let error = null
    try {
        const id = req.params.id ||  null;
        result = await modelCategoria.selectID(id)
    } catch (err) {
        console.log(err)
    } finally {
        return response(result,error)
    }
}

exports.postCategoria = async (req) => {
    let result = [];
    let error = null
    try {
        const categoria = req.params.categoria || req.query.categoria || req.body.categoria ||  null;
        result = await modelCategoria.insert(categoria)
        
    } catch (err) {
        // error = err
        console.log(err)
    } finally {
        return response(result,error)
    }
}