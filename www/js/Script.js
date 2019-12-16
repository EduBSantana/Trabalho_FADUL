

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
    tx.executeSql('CREATE TABLE IF NOT EXISTS Cadastro (id INTEGER PRIMARY KEY, nome VARCHAR(50), qtd INTEGER, preco FLOAT )');
    tx.executeSql('CREATE TABLE IF NOT EXISTS Compras (id INTEGER PRIMARY KEY, nome_cadastro VARCHAR(50), qtd_compra INTEGER, total FLOAT )');
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

// Prepara para incluir registro na tabela Agenda
function Cadastro_insert() {
	db.transaction(Cadastro_insert_db, errorDB, successDB);
}

function Compras_insert() {
	db.transaction(Compras_insert_db, errorDB, successDB);
}

//Fazer as compras

// Inclui registro na tabela Agenda
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

/*function regNumber() {

    $("#headertemp").append("<h4>Número de registros </h4>" + cad);

}*/

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
        " <button type='button' class='btn btn-success'  onclick='comprarMoto("+ results.rows.item(i).id+")'>Buy <img src='img/car.png' style='width: 25px'></td>" +
        
        "</tr>");
    }

}

function dadosMoto_view(){

    db.transaction(dadosMoto_view_db, errorDB, successDB); 

}

//monta a matriz com os registros da tabela agenda
function dadosMoto_view_db(tx){

    tx.executeSql('SELECT nome,preco FROM Cadastro',[], dadosMoto_view_data, errorDB);
}

function dadosMoto_view_data(dm, results) {

    alert("a");
    $("#dados").append("<h1>Modelo: " + results.rows.item(i).nome + "</h1>");

}


function realizaCompra(cadastro_id) {



}

function esconde() {

    $("#TelaCompra").hide();
    $("#TelaCadastro").hide();
    $("#TelaListagem").hide();
    $("#TelaCompra").hide();

}

function voltar() {

    $("#TelaCadastro").hide(800);
    $("#TelaListagem").hide(800);
    $("#TelaCompra").hide(800);
    $("#TelaPadrao").show(800);

}

//
function cadastrarMoto() {
    
    $("#TelaCompra").hide();
    $("#TelaPadrao").hide();
    $("#TelaListagem").hide();
    $("#TelaCadastro").show(800);

}

function comprarMoto() {

    $("#TelaPadrao").hide();
    $("#TelaListagem").hide();
    $("#TelaCadastro").hide();
    $("#TelaCompra").show(800);

    dadosMoto_view()

}


//
function listarMoto() {

    $("#TelaPadrao").hide();
    $("#TelaCadastro").hide();
    $("#TelaListagem").show(800);

}


/*function Cadastro_update_abrir_tela(agenda_id) {

    $("#tela_padrao").hide(); //Esconde Tela inicial
    $("#tela_edicao").show(800); //Mostra tela de Edição

    var agenda_nome_update = $("#agenda_item_" + agenda_id + " .agenda_info h3").html();
    var agenda_telefone_update = $("#agenda_item_" + agenda_id + " .agenda_info h5").html();

    $("#agenda_id_update").val(agenda_id);
    $("agenda_nome_update").val(agenda_nome_update);
    $("#agenda_telefone_update").val(agenda_telefone_update);

}

function agenda_update_fechar_tela() {

    $("#tela_edicao").hide(800); //Esconde tela de edição
    $("#tela_padrao").show(); //Mostra tela inical

}

function agenda_update() {

    db.transaction(agenda_update_db, errorDB, successDB);

}

function agenda_update_db(tx) {

    var agenda_id_novo = $("#agenda_id_update").val();
    var agenda_nome_novo= $("#agenda_nome_update").val();
    var agenda_telefone_novo = $("#agenda_telefone_update").val();

    tx.executeSql('UPDATE agenda SET nome = "' + agenda_nome_novo + '", tel ="' + agenda_telefone_novo + '" WHERE id= "' + agenda_id_novo + '" ')

    agenda_update_fechar_tela();
    agenda_view();

}*/
