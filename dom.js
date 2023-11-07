const domMgr = (() => {
	console.log("dom.JS is working");
  
	let noteTitle = document.querySelector("#noteTitle").value;
	let noteSpan = document.querySelector("#noteSpan").value;
	let noteDate = document.querySelector("#noteDate").value;
	let notePriority = document.querySelector("input[name='notePriority']:checked");
	let noteGroup = document.querySelector("#noteGroupButton p").value;
	let noteColor = null;

	//const myBox = document.querySelector('#form');

  
	const formInputsObject = {
		get title() {
			return noteTitle;
		},
		get spanText() {
			return noteSpan;
		},
		get dueDate() {
			return noteDate;
		},
		get priority() {
			return notePriority;
		},
		get group() {
			return noteGroup;
		},
		get color() {
			return noteColor;
		}
	};

	return { formInputsObject };
  })();

export default domMgr