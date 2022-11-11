var nome;
var cognome;
var addBtn;
var elencoHTML;
var errore;
var erroreElenco;
var elenco = [];
var modificaId;
var toggle = true;

window.addEventListener("DOMContentLoaded", init);

function init() {
	nome = document.getElementById("nome");
	cognome = document.getElementById("cognome");
	addBtn = document.getElementById("scrivi");
	elencoHTML = document.getElementById("elenco");
	errore = document.getElementById("errore");
	erroreElenco = document.getElementById("erroreElenco");
	printData();
	eventHandler();
}

function eventHandler() {
	addBtn.addEventListener("click", function () {
		if (toggle) {
			controlla();
		} else {
			modifica(modificaId);
		}
	});
}

function printData() {
	fetch('http://localhost:3000/elenco')
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			elenco = data;
			if (elenco.length > 0) {
				errore.innerHTML = "";
				elencoHTML.innerHTML = "";
				elenco.map(function (element) {
					elencoHTML.innerHTML += `
					<li class="list-group-item">

					<button type="button" class="edit btn btn-primary fs-5" onClick="openEdit(${element.id}, '${element.nome}', '${element.cognome}')"><i class="bi bi-pencil-square"></i></button>

					<button type="button" class="delete btn btn-danger me-4 fs-6" onClick="elimina(${element.id})"><i class="bi bi-x-lg"></i></button>

					<span class="fs-4 pb-1 d-inline-block">${element.nome} ${element.cognome}</span></li>
					`;
				});
			} else {
				erroreElenco.innerHTML = "Nessun elemento presente in elenco";
			}
		})
		.then(() => {
			// li a colori alternati
			const odds = document.querySelectorAll("li:nth-of-type(odd)");
			odds.forEach((riga) => {
				riga.classList.add("list-group-item-info");
			});
			const evens = document.querySelectorAll("li:nth-of-type(even)");
			evens.forEach((riga) => {
				riga.classList.add("list-group-item-primary");
			});
		});
}

function controlla() {
	if (nome.value != '' && cognome.value != '') {
		var data = {
			nome: nome.value,
			cognome: cognome.value,
		};
		addData(data);

	} else {

		// Avviso
		errore.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> Attenzione! Compilare correttamente i campi! <i class="bi bi-exclamation-triangle-fill"></i>`;;

		// Bordo rosso input
		document.getElementById("nome").classList.remove("border-primary", "border-opacity-25");
		document.getElementById("nome").classList.add("border-danger", "border-opacity-75");
		document.getElementById("cognome").classList.remove("border-primary", "border-opacity-25");
		document.getElementById("cognome").classList.add("border-danger", "border-opacity-75");

		return;
	}
}

async function addData(data) {
	let response = await fetch('http://localhost:3000/elenco', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify(data),
	});
	clearForm();
}

function clearForm() {
	nome.value = "";
	cognome.value = "";
}



// DELETE
async function elimina(data) {

	if (!window.confirm("Sei sicur*?")) {
		return;
	};

	let response = await fetch('http://localhost:3000/elenco/' + data, {
		method: 'DELETE'
	});

	clearForm();
}

// PUT
async function modifica(data) {

	if (nome.value == '' || cognome.value == '') {

		// Avviso
		errore.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> Attenzione! Compilare correttamente i campi! <i class="bi bi-exclamation-triangle-fill"></i>`;;

		// Bordo rosso input
		document.getElementById("nome").classList.remove("border-primary", "border-opacity-25");
		document.getElementById("nome").classList.add("border-danger", "border-opacity-75");
		document.getElementById("cognome").classList.remove("border-primary", "border-opacity-25");
		document.getElementById("cognome").classList.add("border-danger", "border-opacity-75");

		return;
	};

	if (!window.confirm("Modificare l'utente?")) {
		return;
	};



	let response = await fetch('http://localhost:3000/elenco/' + data, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({ nome: `${nome.value}`, cognome: `${cognome.value}` })
	});

	clearForm();

	toggle = true;
}

function openEdit(dataId, dataName, dataSurname) {
	toggle = false;
	modificaId = dataId;

	cleanSelect();

	// Metti i values dentro gli input
	nome.value = dataName;
	cognome.value = dataSurname;

	// Metti questo button nel sotto-div di modifica

	if (toggle == false) {

		// Cambia il colore del button
		addBtn.classList.remove("btn-primary");
		addBtn.classList.add("btn-info");
		addBtn.innerHTML = "MODIFICA";

		// Cambia il colore del bordo del fieldset
		document.querySelector("fieldset").classList.add("border-info");

		// Fai comparire il testo di spiegazione
		document.getElementById("editText").innerHTML = "Inserisci il nome ed il cognome che andranno a sostituire quello corrente:<br><hr>";


		// Evidenzia ciò che si sta modificando

		document.querySelector(`li:nth-of-type(${dataId})`).style.opacity = "0.5";
		document.querySelector(`li:nth-of-type(${dataId})`).style.fontStyle = "italic";
		document.querySelector(`li:nth-of-type(${dataId})`).style.border = "2px dashed #0D6EFD";
	}
}

function cleanSelect() {
	// Ripristina gli style dei li
	const lis = document.querySelectorAll("li");
	lis.forEach((riga) => {
		riga.style.opacity = null;
		riga.style.fontStyle = null;
		riga.style.border = null;
	});
};

// CRONOLOGIA

function addCrono() {
	var crono = document.getElementById("cronologia");

	crono.innerHTML = `<li class="list-group-item list-group-item-light">${nome.value} ${cognome.value}</li>`;
}