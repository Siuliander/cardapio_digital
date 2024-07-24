const modelProduto = require("../models/model-produto")
const modelPreco = require("../models/model-preco")
const modelPrecoProduto = require("../models/model-preco-produto")

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
		}),
        message: data.message,
	}
	
	return json
}


exports.getProdutoAll = async (req) => {
    let result = [];
    let error = null
    try {
        const all = req.params.q || req.query.q || req.body.q ||  null;
        const produto = req.params.produto || req.query.produto || req.body.produto ||  null;
        const categoria = req.params.categoria || req.query.categoria || req.body.categoria ||  null;
        const preco = req.params.preco || req.query.preco || req.body.preco ||  null;

        const limit = req.params.limit || req.query.limit || req.body.limit || null;

        result = await modelProduto.select(null, all,produto,preco,categoria,limit)
        
    } catch (err) {
        // error = err
        console.log(err)
    } finally {
        return response(modelProduto.row(0,result),error)
    }
}

exports.getProdutoID = async (req) => {
    let result = [];
    let error = null
    try {
        const id = req.params.id ||  null;
        result = await modelProduto.selectID(id)
    } catch (err) {
        console.log(err)
    } finally {
        return response(modelProduto.row(0,result),error)
    }
}

exports.postProduto = async (req) => {
    let result = [];
    let error = null
    try {
        const produto = req.params.produto || req.query.produto || req.body.produto ||  null;
        const categoria = req.params.categoria || req.query.categoria || req.body.categoria ||  null;
        const preco = req.params.preco || req.query.preco || req.body.preco ||  null;
        result = await modelProduto.insert(produto,preco,categoria)
        
    } catch (err) {
        // error = err
        console.log(err)
    } finally {
        return response(result,error)
    }
}

exports.putProduto = async (req) => {
    let result = [];
    let error = null
    try {
        const id = req.params.id || req.query.id || req.body.id ||  null;
        const categoria = req.params.categoria || req.query.categoria || req.body.categoria ||  null;
        result = await modelProduto.update(id,categoria,null,null)
        
    } catch (err) {
        // error = err
        console.log(err)
    } finally {
        return response(result,error)
    }
}

exports.deleteProduto = async (req) => {
    let result = [];
    let error = null
    try {
        const id = req.params.id || req.query.id || req.body.id ||  null;
        result = await modelProduto.deleted(id)
        
    } catch (err) {
        // error = err
        console.log(err)
    } finally {
        return response(result,error)
    }
}

