const modelPedido = require("../models/model-pedido")
const modelItemPedido = require("../models/model-ItensPedido")

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
				idVendedor: item.idVendedor,
                identidadeVendedor: item.identidadeVendedor,
				nomeVendedor: item.nomeVendedor,
                
				idCliente: item.idCliente,
                identidadeCliente: item.identidadeCliente,
				nomeCliente: item.nomeCliente,

				total: item.total || 0,
				qtdProduto: item.qtdProduto,

                notaPedido: item.notaPedido,

                items: Array.isArray(data.items) ? data.items.map( i => {
                    return {
                        id: i.id,
                        categoria: i.categoria,
                        produto: i.produto,
                        quantidade: i.qtd,
                        preco: i.preco,
                        estado: i.estado
                    }
                }) : false,
                
				request: !Array.isArray(data.items) ? {
					method: 'GET',
					descricao: 'Retorna Detalhe Específico',
					url: `${process.env.API_HOST}:${process.env.API_PORT}/pedido/${item.id}`
				} : []
			} 
		}),
        message: data.message,
	}

    data.rows.map( (item, index) => {
        if (!Array.isArray( json.data[index].items ) ) {
            delete json.data[index].items;  // Remove a chave items se ela não tiver um valor válido [Array]
        }
    } );
	
	return json
}

exports.getPedidoAll = async (req) => {
    let result = [];
    let error = null
    try {
        const all = req.params.q || req.query.q || req.body.q ||  null;
        const vendedor = req.params.vendedor || req.query.vendedor || req.body.vendedor ||  null;
        const cliente = req.params.cliente || req.query.cliente || req.body.cliente ||  null;
        const total = req.params.total || req.query.total || req.body.total ||  null;
        const qtdProduto = req.params.qtdProduto || req.query.qtdProduto || req.body.qtdProduto ||  null;

        const limit = req.params.limit || req.query.limit || req.body.limit || null;

        result = await modelPedido.select(null, all,vendedor,cliente,total, qtdProduto,limit)
        
    } catch (err) {
        // error = err
        console.log(err)
    } finally {
        return response(modelPedido.row(0,result),error)
    }
}

exports.getPedidoID = async (req) => {
    let resultPedido = [];
    let resultItems = [];
    let error = null
    try {
        const id = req.params.id ||  null;
        resultPedido = await modelPedido.selectID(id,null)
        resultItems = await modelItemPedido.selectItensPedido(null,id,null,null)
    } catch (err) {
        console.log(err)
    } finally {
        return response(modelPedido.row(0,resultPedido,null, resultItems),error)
    }
}

exports.postPedido = async (req) => {
    let result = [];
    let resultItems = [];
    let error = null
    try {
        const items = req.params.items || req.query.items || req.body.items ||  null;
        const nota = req.params.nota || req.query.nota || req.body.nota ||  null;
        const cliente = req.params.cliente || req.query.cliente || req.body.cliente ||  null;
        const vendedor = req.params.vendedor || req.query.vendedor || req.body.vendedor ||  null;

        result = await modelPedido.insert(items,nota,cliente,vendedor)

    } catch (err) {
        // error = err
        console.log(err)
    } finally {
        return response(result,error)
    }
}

exports.putPedido = async (req) => {
    let result = [];
    let error = null
    try {
        
        const id = req.params.id || req.query.id || req.body.id ||  null;
        const pedido = req.params.pedido || req.query.pedido || req.body.pedido ||  null;
        const descricao = req.params.descricao || req.query.descricao || req.body.descricao ||  null;
        const categoria = req.params.categoria || req.query.categoria || req.body.categoria ||  null;
        const preco = req.params.preco || req.query.preco || req.body.preco ||  null;

        result = await modelPedido.update(id,pedido,descricao,preco,categoria)
        
    } catch (err) {
        // error = err
        console.log(err)
    } finally {
        return response(result,error)
    }
}

exports.deletePedido = async (req) => {
    let result = [];
    let error = null
    try {
        const id = req.params.id || req.query.id || req.body.id ||  null;
        result = await modelPedido.deleted(id)
    } catch (err) {
        // error = err
        console.log(err)
    } finally {
        return response(result,error)
    }
}

exports.deleteItemPedido = async (req) => {
    let result = [];
    let error = null
    try {
        const id = req.params.id || req.query.id || req.body.id ||  null;
        const items = req.params.items || req.query.items || req.body.items ||  null;

        result = await modelPedido.deletedItemPedido(id,items)
    } catch (err) {
        // error = err
        console.log(err)
    } finally {
        return response(result,error)
    }
}

