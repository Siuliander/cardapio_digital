const mysql = require('../database/mysql');

const pessoa = require('./controller-pessoa');

const error = ( error = [] , mensagem = null ) => {
	const erro = { 
					/* error: error, */
					error: { msg: mensagem }
				};
	 
	//console.log( error  ); 
	// Adicionar o Erro no Cache ou Log de Erros
	return erro;
}

const response = (data = []) => {
	const json = {
		quantidade: data.length,
		usuarios: data.map( usuario => {
			return {
				id: usuario.id_usuario,
				nome: usuario.nome_pessoa,
				identidade: usuario.identidade_pessoa,
				tipo: usuario.tipo_pessoa,
				request: {
					method: 'GET',
					descricao: 'Retorna Detalhe Específico',
					url: process.env.API_HOST  + "/usuarios/" + usuario.id_usuario
				}
			}
		})
	}
	
	return json
}

const buscar = async(dados = []) => {
	
	const id = dados.id || null; 
	const identidade = dados.identidade ||  null; 
	const nome = dados.nome ||  null; 
	const tipo = dados.tipo ||  null; 
	const idtipo = dados.idtipo ||  0; 
		
	let query = `
						SELECT * FROM tb_usuario AS u 
						JOIN tb_pessoa AS p 
							ON p.id_pessoa = u.id_pessoa
						JOIN tb_tipo_pessoa AS tp 
							ON tp.id_tipo_pessoa = p.id_tipo_pessoa
					`;
		
		let where = " WHERE 1=1 ";
		let limit = "";
		let params = [];
		
		if ( id ){
			where += " AND id_usuario = ? ";
			params.push(id);
		}
		if ( identidade ){
			where += " AND identidade_pessoa = ? ";
			params.push(identidade);
		}
		if ( id || identidade ){ limit = " LIMIT 1 "; }
		else{
			
		}
		
		query = query + where + limit ;
		
		const result = await mysql.execute(query,params);
		
		return result;
}

exports.getUsuarios = async (req, res, next) => {
	try{
		
		const id = req.params.id || req.query.id /* || req.body.id */ ||  null; 
		const identidade = req.params.identidade || req.query.identidade /* || req.body.identidade */ ||  null; 
		const nome = req.params.nome || req.query.nome /* || req.body.nome */ ||  null; 
		const tipo = req.params.tipo || req.query.tipo /* || req.body.tipo */ ||  null; 
		const idtipo = req.params.idtipo || req.query.idtipo /* || req.body.idtipo */ ||  0; 
		
		const dado = {
			id,
			identidade,
			nome,
			tipo,
			idtipo
		}
		
		const result = await buscar(dado);
		
		res.status(200).send( response(result) );
	}
	catch(err){
		res.status(500).send( error(err) );
	}	
}

exports.createUsuario = async( req, res, next) => {
	try{ 
		//const identidade = req.params.identidade || req.query.identidade /* || req.body.identidade */ ||  null; 
		//const nome = req.params.nome || req.query.nome /* || req.body.nome */ ||  null; 
		//const tipo = req.params.tipo || req.query.tipo /* || req.body.tipo */ ||  0;  
		
		const identidade = "attb"  
		const nome = "attk"  
		const tipo =  2;  
		
		const data = {identidade, nome,tipo:tipo};
		
		const idPessoa = await pessoa.add(data);
		
		let query = "INSERT INTO tb_usuario(id_usuario, id_pessoa)";
		let valeus = " VALUES(DEFAULT,?);";
		let params = [idPessoa];
					
		query = query + valeus;
		
		let id = 0;
		
		const inserted = await mysql.execute(query,params);
		if(inserted){ id = inserted.insertId }
		
		const dado = {
			id
		}
		const result = await buscar(dado);
		
		res.status(200).send( response(result) );
	}
	catch(err){
		res.status(500).send( error(err) );
	}
}