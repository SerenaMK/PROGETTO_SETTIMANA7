var nome;
var cognome;
var addBtn;
var svuotaBtn;
var elencoHTML;
var errore;
var erroreElenco;
var elenco = [];
var cronologia = [];
var crono;
var modificaId;
var toggle = true;
var righe;

window.addEventListener("DOMContentLoaded", init);

function init() {
	nome = document.getElementById("nome");
	cognome = document.getElementById("cognome");
	addBtn = document.getElementById("scrivi");
	svuotaBtn = document.getElementById("svuota");
	elencoHTML = document.getElementById("elenco");
	errore = document.getElementById("errore");
	erroreElenco = document.getElementById("erroreElenco");
	crono = document.getElementById("cronoList");
	printData();
	printCrono();
	eventHandler();
}

function eventHandler() {
	addBtn.addEventListener("click", function () {
		if (toggle) {
			aggiunta();
		} else {
			modifica(modificaId);
		}
	});
}

// STAMPA lista users
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

// AGGIUNGI a lista user + cronologia
function aggiunta() {
	if (nome.value != '' && cognome.value != '') {
		var data = {
			nome: nome.value,
			cognome: cognome.value,
		};
		addData(data);
		addCrono(data);

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

// AGGIUNGI user
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

// Pulisci il form
function clearForm() {
	nome.value = "";
	cognome.value = "";
}

// DELETE user
async function elimina(data) {

	// Conferma
	if (!window.confirm("Sei sicur* di volerlo eliminare?")) {
		return;
	};

	// Elimina
	let response = await fetch('http://localhost:3000/elenco/' + data, {
		method: 'DELETE'
	});

	clearForm();
}

// PUT DI MODIFICA user
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

	// Conferma
	if (!window.confirm("Modificare l'utente?")) {
		return;
	};

	// Modifica
	let response = await fetch('http://localhost:3000/elenco/' + data, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify({ nome: `${nome.value}`, cognome: `${cognome.value}` })
	});

	clearForm();
}

// Inizia il processo di modifica cambiando ci?? che fa il button
function openEdit(dataId, dataName, dataSurname) {
	toggle = false;
	modificaId = dataId;

	cleanSelect();

	// Metti i values dentro gli input
	nome.value = dataName;
	cognome.value = dataSurname;

	if (toggle == false) {
		// Cambia il colore del button
		addBtn.classList.remove("btn-primary");
		addBtn.classList.add("btn-info");
		addBtn.innerHTML = "MODIFICA";

		// Cambia il colore del bordo del fieldset
		document.querySelector("fieldset").classList.add("border-info");

		// Fai comparire il testo di spiegazione
		document.getElementById("editText").innerHTML = "Inserisci il nome ed il cognome che andranno a sostituire quello corrente:<br><hr>";

		// Evidenzia ci?? che si sta modificando
		document.querySelector(`li:nth-of-type(${dataId})`).style.opacity = "0.5";
		document.querySelector(`li:nth-of-type(${dataId})`).style.fontStyle = "italic";
		document.querySelector(`li:nth-of-type(${dataId})`).style.border = "2px dashed #0D6EFD";
	}
}

// RIPRISTINA GLI STYLE DEI LI
function cleanSelect() {	
	const lis = document.querySelectorAll("li");
	lis.forEach((riga) => {
		riga.style.opacity = null;
		riga.style.fontStyle = null;
		riga.style.border = null;
	});
};



/////////// CRONOLOGIA

// STAMPA CRONOLOGIA
function printCrono() {
	fetch('http://localhost:4000/cronologia')
		.then((response) => {
			return response.json();
		})
		.then((chronology) => {
			cronologia = chronology;

			if (cronologia.length > 0) {
				errore.innerHTML = "";
				crono.innerHTML = "";
				cronologia.map(function (element) {
					crono.innerHTML += `
					<li class="cronoLi list-group-item list-group-item-light">
					${element.nome} ${element.cognome}
					</li>
					`;
				});
			}
		}).then(() => {
			righe = document.querySelectorAll(".cronoLi");

			console.log(righe.length);
		});
}

// AGGIUNGI A CRONOLOGIA
async function addCrono(data) {
	let response = await fetch('http://localhost:4000/cronologia', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
		},
		body: JSON.stringify(data)
	});

	clearForm();
}

// SVUOTA CRONOLOGIA
async function svuota() {
	if (!window.confirm("Sei sicur* di voler svuotare la cronologia?")) {
		return;
	} else {
		for (let i = 1; i < righe.length+1; i++) {
			let response = await fetch('http://localhost:4000/cronologia/' + i, {
				method: 'DELETE'
			});
		}
	};
}