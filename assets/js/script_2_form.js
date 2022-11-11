var nome;
var cognome;
var addBtn;
var elencoHTML;
var errore;
var erroreElenco;
var elenco = [];
var newNome;
var newCognome;

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
		controlla();
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

					<button type="button" class="edit btn btn-primary fs-5" onClick="openEdit(${element.id})"><i class="bi bi-pencil-square"></i></button>

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
		errore.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> Attenzione! Compilare correttamente i campi! <i class="bi bi-exclamation-triangle-fill"></i>`;
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

function elimina(data) {
	fetch('http://localhost:3000/elenco/' + data, {
		method: 'DELETE'
	});
	clearForm();
}

// PUT
function modifica(data) {
	newNome = document.getElementById('newNome');
	newCognome = document.getElementById('newCognome');

	if (newNome.value != '' && newCognome.value != '') {
		fetch('http://localhost:3000/elenco/' + data, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json;charset=utf-8',
			},
			body: JSON.stringify({ nome: `${newNome.value}`, cognome: `${newCognome.value}` })
		});

		clearForm();
	} else {
		// Bordo rosso input
		document.getElementById("newNome").classList.remove("border-primary", "border-opacity-25");
		document.getElementById("newNome").classList.add("border-danger", "border-opacity-75");
		document.getElementById("newCognome").classList.remove("border-primary", "border-opacity-25");
		document.getElementById("newCognome").classList.add("border-danger", "border-opacity-75");

		// Avviso
		document.getElementById("attenzione").innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i> Attenzione! Compilare correttamente i campi! <i class="bi bi-exclamation-triangle-fill"></i>`;
		return;
	}
}

function openEdit(data) {
	// Fai apparire il div di modifica
	// if (document.getElementById("divModifica").style.display == "block") {
	// 	document.getElementById("divModifica").style.display = "none";
	// } else {
	// 	document.getElementById("divModifica").style.display = "block";
	// }

	document.getElementById("divModifica").style.display = "block";

	// Metti questo button nel sotto-div di modifica

	if (!document.getElementById("modifica")) {
		document.getElementById("subModifica").innerHTML += `
		<button type="button" class="btn btn-outline-primary" id="modifica" onclick = "modifica(${data})">MODIFICA</button>
		`;

		// Evidenzia ciò che si sta modificando
		document.querySelector(`li:nth-of-type(${data})`).style.opacity = "0.5";
		document.querySelector(`li:nth-of-type(${data})`).style.fontStyle = "italic";
		document.querySelector(`li:nth-of-type(${data})`).style.border = "2px dashed #0D6EFD";
	}
}