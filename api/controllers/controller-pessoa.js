const mysql = require('../database/mysql');

const buscar = async (data) => {
	try{
		const identidade = data.identidade || 0;
		let pessoa = 0;
		
		if((identidade.trim()) && identidade != 0){
			const query = "SELECT * FROM tb_pessoa WHERE identidade_pessoa = ? LIMIT 1";
			let params = [identidade];
			
			const selected = await mysql.execute(query,params);
			
			if(selected.length > 0){ pessoa = selected[0].id_pessoa}
		}
		
		return pessoa;
	}
	catch(error){
		return 0;
	}
} 

exports.add = async (data) => {
	try{
		const nome = data.nome || null; 
		const identidade = data.identidade || null;
		const tipo = data.tipo || 0;
		
		
		/**************************************/
		// Campos Vazios
		/**************************************/
		if (!(nome.trim()) ){
			// Nome Obrigatório 
		}
		if (!(identidade.trim() )){
			// Identidade Obrigatório 
		}
		if (!(tipo) ){
			// Tipo de Pessoa Obrigatório 
		}
		
		/**************************************/
		// Formatos Inválidos ou Indisponíveis
		/**************************************/
		if( !isNaN(nome) || !isNaN(nome[0]) ){ 
			// Formato de Nome Inválido 
		}
		if (tipo <= 0 || isNaN(tipo)){ 
			// Tipo de Pessoa Inválida/Indisponível
		}
		
		let pessoa = 0;
		
		/**************************************/
		// Verificar Existência
		/**************************************/
		
		console.log(await buscar(data))
		/**************************************/
		// Adicionar ou Criar Novo(a)
		/**************************************/ 
		
		const insert = "INSERT INTO tb_pessoa (id_pessoa, nome_pessoa, identidade_pessoa, id_tipo_pessoa)";
		const valeus = " VALUES(DEFAULT,?,?,?);";
		const params = [nome,identidade,tipo];
		
		
		query = insert + valeus ;
		
		const inserted = await mysql.execute(query,params);
		
		if(inserted){ pessoa = inserted.insertId}
		
		return pessoa;
	}
	catch(error){
		return 0;
	}	
}