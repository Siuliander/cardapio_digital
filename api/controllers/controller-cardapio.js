const modelCardapio = require("../models/model-cardapio")

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
				produto: item.produto,
				descricao: item.descricao,
				preco: item.preco,
				img: item.img,
				categoria: item.categoria,
				request: {
					method: 'GET',
					descricao: 'Retorna Detalhe Específico',
					url: `${process.env.API_HOST}:${process.env.API_PORT}/produto/${item.id}`
				}
			}
		})
	}
	
	return json
}


exports.getCardapioAll = async (req) => {
    let result = [];
    let error = null
    try {
        const all = req.params.q || req.query.q || req.body.q ||  null;
        const produto = req.params.produto || req.query.produto || req.body.produto ||  null;
        const categoria = req.params.categoria || req.query.categoria || req.body.categoria ||  null;
        const preco = req.params.preco || req.query.preco || req.body.preco ||  null;

        const limit = req.params.limit || req.query.limit || req.body.limit || null;

        result = await modelCardapio.select(all,produto,preco,categoria,limit)
        
    } catch (err) {
        // error = err
        console.log(err)
    } finally {
        return response(modelCardapio.row(0,result),error)
    }
}


