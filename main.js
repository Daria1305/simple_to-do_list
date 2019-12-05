let input = document.getElementById("input");
let submit = document.getElementById("submit");
let list = document.getElementById("list");
let div = document.getElementById("ToDoList");

let pencil = String.fromCharCode("9999");
let deleteMark = String.fromCharCode("10006");
let checkMark = String.fromCharCode("10003"); // ✓

div.addEventListener("click", onSubmit);
input.addEventListener("keypress", onSubmit);
list.addEventListener("click", transform);
list.addEventListener("keypress", transform);

if (typeof window.localStorage === 'undefined')
	alert("Sorry, but you browser does not support Local Storage, we can`t save your ToDoList");
else if (localStorage.getItem("list") !== null) {
	let StorageList = JSON.parse(localStorage.getItem("list"));

	for (var i = 0; i < StorageList.length; i++) {
		addLi(StorageList[i]);
	}
}

function onSubmit(elem) {
	if (elem.key === "Enter" || elem.target.id === "submit") {
		if (StringEmpty(input.value))
			alert("Please, write anything");
		else {
			addLi();
			updateLocalStorage();
		}
	}
}

function addLi(inputValue) {
	let inputString = input.value;
	if (inputValue === undefined) {
		inputValue = {str: inputString, checked: false};
	}

	let li = document.createElement("li");
	let checker = document.createElement("input");
	let p = document.createElement("p");
	let correct = document.createElement("input");
	let del = document.createElement("input");

	p.className = "liP";
	p.innerHTML = inputValue.str;

	checker.className = "checker";
	checker.type = "checkbox"
	checker.checked = inputValue.checked;

	correct.type = "button"
	correct.className = "correct";
	correct.value = pencil;

	del.type = "button"
	del.className = "delete";
	del.value = deleteMark;

	li.appendChild(checker);
	li.appendChild(p);
	li.appendChild(correct);
	li.appendChild(del);

	input.value = "";
	list.appendChild(li);
}

function transform(elem) {
	if (elem.target.className === "correct") {
		correct(elem);
		updateLocalStorage();
	} else if (elem.target.className === "append" || elem.key === "Enter") {
		append(elem);
		updateLocalStorage();
	} else if (elem.target.className === "checker") {
		highlight(elem);
		updateLocalStorage();
	} else if (elem.target.className === "delete") {
		list.removeChild(elem.target.parentElement);
		updateLocalStorage();
	}
}

function correct(elem) {
	let parent = elem.target.parentElement;
	let input = document.createElement("input");

	input.type = "text";
	input.className = "correctInput";
	input.value = parent.querySelector("p").innerHTML;

	elem.target.className = "append";
	elem.target.value = checkMark;

	parent.querySelector("p").innerHTML = "";
	parent.querySelector("p").appendChild(input);
	input.focus();
}

function append(elem) {
	let parent = elem.key === "Enter" ?
	elem.target.parentElement.parentElement :
	elem.target.parentElement;

	parent.querySelector("p").innerHTML = parent.querySelector("p").firstChild.value;

	parent.querySelector(".append").value = pencil;
	parent.querySelector(".append").className = "correct";
}

function highlight(elem) {
	let parent = elem.target.parentElement;

	if (elem.target.checked === true)
		parent.querySelector("p").style = "text-decoration: line-through";
	else
		parent.querySelector("p").style = "text-decoration: none";
}

function updateLocalStorage() {
	if (typeof window.localStorage === 'undefined')
		return;

	let chList = list.children;
	let output = [];

	for (let i = 0; i < chList.length; i++) {
		output.push({str: chList[i].querySelector(".liP").innerHTML,
					checked: chList[i].querySelector(".checker").checked});
	}

	localStorage.setItem("list", JSON.stringify(output))
}

function StringEmpty(string) {
	if (string !== null && typeof string !== "undefined")
		string = string.trim();

	if (!string)
		return true;
	else
		return false
}
