

var db = window.openDatabase("Database", "1.0", "Cadastro", 2000);
db.transaction(createDB, errorDB, successDB);
document.addEventListener("deviceready", onDeviceReady, false);


function onDeviceReady() {
	db.transaction(createDB, errorDB, successDB);
}


// Trata erro de criação do Banco de Dados
function errorDB(err) {
	alert("Erro: " + err);
}


// Executa se criou o Banco de Dados com sucesso
function successDB() { }


//Cria a tabela se a mesma não existir    
function createDB(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS Cadastro (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nome VARCHAR(50), qtd INTEGER, preco FLOAT )');
    tx.executeSql('CREATE TABLE IF NOT EXISTS compra (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, id_cad INTEGER, qtd_compra INTEGER, valor_total REAL NOT NULL, FOREIGN KEY(id_cad) REFERENCES Cadastro(id))');
}

//Exlusao

function Cadastro_delete(Cadastro_id){

    $("#Cadastro_id_delete").val(Cadastro_id);
    db.transaction(Cadastro_delete_db, errorDB, successDB)

}

function Cadastro_delete_db(tx){

    var Cadastro_id_delete= $("#Cadastro_id_delete").val();
    tx.executeSql("Delete from Cadastro WHERE id= " + Cadastro_id_delete);
    Cadastro_view();

}

// Fim exclusao

// Prepara para incluir registro na tabela Cadastro
function Cadastro_insert() {
	db.transaction(Cadastro_insert_db, errorDB, successDB);
}


// Inclui registro na tabela Cadastro
function Cadastro_insert_db(tx) {
   
    
	var nome = $("#Cadastro_nome").val();
    var qtd = $("#Cadastro_qtd").val();
    var preco = $("#Cadastro_preco").val();

    tx.executeSql('INSERT INTO Cadastro (nome, qtd, preco) VALUES ("' + nome + '", "' + qtd + '", "' + preco + '")');
    
    cadastrado();

	Cadastro_view();
}

function cadastrado(){

    alert("CADASTRADO COM SUCESSO!");

    $("#Cadastro_nome").val("");
    $("#Cadastro_qtd").val("");
    $("#Cadastro_preco").val("");
}


//MONTA A MATRIZ COM OS REGISTRO DA TABELA AGENDA
function Cadastro_view(){
    db.transaction(Cadastro_view_db, errorDB, successDB); 
}

//monta a matriz com os registros da tabela agenda
function Cadastro_view_db(tx){
    tx.executeSql('SELECT * FROM CADASTRO',[], Cadastro_view_data, errorDB);
}


function Cadastro_view_data(tx, results){

  
    // Listando contatos

    $("#Cadastro_listagem").empty();
    
    var len = results.rows.length;


    for (var i = 0; i < len; i++){

        $("#Cadastro_listagem").append("<tr class='Cadastro_item_lista'>"+

        "<td><h5>"+ results.rows.item(i).id + "</h5></td>"+
        "<td><h5>"+ results.rows.item(i).nome +"</h5></td>"+ 
        "<td><h5>"+ results.rows.item(i).qtd + "</h5></td>"+
        "<td><h5> R$ "+ results.rows.item(i).preco + "</h5></td>"+
        "<td><button type='button' class='btn btn-danger' onclick='Cadastro_delete("+ results.rows.item(i).id+")'>Delete" +
        " <button type='button' class='btn btn-success'  onclick='tela_listar_mostrar_tela_compra("+ results.rows.item(i).id+")'>Buy <img src='img/car.png' style='width: 25px'></td>" +
        
        "</tr>");
    }

}


//Prepara para incluir registro na tabela compra
function compra_insert()
{
    
	db.transaction(compra_insert_db, errorDB, successDB);
}

//Inclui registro na tabela compra
function compra_insert_db(tx)
{

	var id_cad_compra = $("#id_cad_compra").val();
	var qtd_compra = $("#qtd_compra").val();
	var valor_unit_compra = $("#valor_unit_compra").val();

	var qtd_estoque = 0;

	var valor_total = (qtd_compra * valor_unit_compra);

	tx.executeSql('SELECT * FROM Cadastro WHERE id = '+ id_cad_compra + '', [], function(tx,results) 
	{
		for (var i = 0; i < results.rows.length; i++)
		{
			qtd_estoque = results.rows.item(i).qtd_estoque;
		}
		if (qtd_estoque < qtd_compra) 
		{

			//Emite uma mensagem caso a compra exceda o estoque disponível
			return alert('Estoque insuficiente!'); 
		}
		else
		{
			//Emite mensagem caso a compra seja sucedida
			alert("Produto adicionado ao carrinho!");
		}

		//Insert na tabela de compras e update na tabela de produto pra diminuir o valor do estoque
		tx.executeSql('INSERT INTO compra (id_cad, qtd_compra, valor_total) VALUES ("' + id_cad_compra + '", "' + qtd_compra+ '", "' + valor_total + '")');
		tx.executeSql('UPDATE Cadastro SET qtd = (qtd - "' + qtd_compra + '") WHERE id = "' + id_cad_compra + '"');

	});

	//Atualiza o carrinho
	compra_view();
	Cadastro_view();


	
}


//Prepara pra chamar a função de listar o carrinho
function compra_view()
{
	db.transaction(compra_view_db,errorDB,successDB);
}

//Select do carrinho que mostra o ID do produto comprado (o id da tabela produto), valor do produto, nome e valor total da compra
function compra_view_db(tx)
{
	tx.executeSql('SELECT t1.id_cad, t1.qtd_compra, t1.valor_total, t2.id, t2.nome FROM compra t1 INNER JOIN Cadastro t2 on (t1.id_cad = t2.id)',[],compra_view_data,errorDB);
}

//Lista o select na table
function compra_view_data(tx,results)
{
	$("#compra_listagem").empty();
	var len = results.rows.length;

	//Variavel pra armazenar o valor total da compra
	var valorCalculado = 0;

	for(var i = 0; i <len;i++)
	{
	$("#compra_listagem").append("<tr class='compra_item_lista'>"+
		"<td><h3>" + results.rows.item(i).id + "</h3></td>"+
		"<td><h3>" + results.rows.item(i).nome + "</h3></td>"+
		"<td><h3>" + results.rows.item(i).qtd_compra + "</h3></td>"+
		"<td class='valor-calculado'><h3>" + results.rows.item(i).valor_total + "</h3></td>"
		+ "</tr>");
	}

	//Função que atribui o valor da compra individual na compra total
    $( ".valor-calculado" ).each(function() {
      	valorCalculado += parseInt($( this ).text());
    });

	//Mostrando o valor total da compra no campo embaixo da listagem de carrinho
	var totalcampo = document.getElementById('total');
	totalcampo.value = valorCalculado;
}

function finalizar_compra()
{
	db.transaction(finalizar_compra_db,errorDB,successDB);
}

function finalizar_compra_db(tx)
{
    
	tx.executeSql('DELETE FROM compra');
	alert("Compra Finalizada!");
    compra_view();
	
}


function tela_listar_mostrar_tela_compra(_id)
{
	//Variáveis que guardam os dados do produto que a pessoa quer comprar
	var id_cad_compra = document.getElementById('id_cad_compra');
	var nome_compra = document.getElementById('nome_compra');
    var valor_unit_compra = document.getElementById('valor_unit_compra');
    var qtd_compra = document.getElementById('qtd_compra');
    
    id_cad_compra.value = _id;
    
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM Cadastro WHERE id=?', [_id], function (tx, resultado) {
            var rows = resultado.rows[0];

            //Atribui o valor das variáveis no campo pra que o usuário não se preocupe em digitar o ID do produto e o Valor individual do produto
            id_cad_compra.value = rows.id;
            nome_compra.value = rows.nome;
            valor_unit_compra.value = rows.preco;
            qtd_compra.value = '';
        });
    });

    $("#TelaPadrao").hide();
    $("#TelaListagem").hide();
    $("#TelaCadastro").hide();
    $("#tela_carrinho").hide();
    $("#tela_comprar").show(800);
	
}



function esconde() {

    $("#TelaCadastro").hide();
    $("#TelaListagem").hide();
    $("#tela_carrinho").hide();
    $("#tela_comprar").hide();

}

function voltar() {

    $("#TelaCadastro").hide(800);
    $("#TelaListagem").hide(800);
    $("#tela_carrinho").hide(800);
    $("#tela_comprar").hide(800);
    $("#TelaPadrao").show(800);

}

//
function cadastrarMoto() {
    
    $("#TelaCompra").hide();
    $("#TelaPadrao").hide();
    $("#TelaListagem").hide();
    $("#tela_carrinho").hide();
    $("#tela_comprar").hide();
    $("#TelaCadastro").show(800);

}

function comprarMoto() {

    $("#TelaPadrao").hide();
    $("#TelaListagem").hide();
    $("#TelaCadastro").hide();
    $("#tela_carrinho").show(800);
    $("#tela_comprar").hide();

}

//
function listarMoto() {

    $("#TelaPadrao").hide();
    $("#TelaCadastro").hide();
    $("#tela_carrinho").hide(800);
    $("#tela_comprar").hide(800);
    $("#TelaListagem").show(800);

}

