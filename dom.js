const domStuff = (() =>{
console.log("dom.JS is working");

let noteTitle = document.querySelector("#noteTitle").value;
let noteSpan = document.querySelector("#noteSpan").value;
let noteDate = document.querySelector("#noteDate").value;
	let notePriority = document.querySelector("input[name='notePriority']:checked");
//^?
let noteGroup = document.querySelector("#noteGroupButton p").value;
let noteColor = null;

const formValues = {
	title: noteTitle,
	spanText: noteSpan,
	dueDate: noteDate,
	priority: notePriority,
	group: noteGroup,
	color: noteColor
};

return formValues

})()

export default domStuff