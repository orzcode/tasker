const domMgr = () => {
	console.log("dom.JS is working");
  
	const tags = {
	noteTitle: document.querySelector("#noteTitle").value,
	noteSpan: document.querySelector("#noteSpan").value,
	noteDate: document.querySelector("#noteDate").value,
	notePriority: document.querySelector("input[name='notePriority']:checked"),
	noteGroup: document.querySelector("#noteGroupButton p").value,
	noteColor: null
	}
	//const myBox = document.querySelector('#form');

  	const formInputsObject = {
		get title() {
			return tags.noteTitle;
		},
		get spanText() {
			return tags.noteSpan;
		},
		get dueDate() {
			return tags.noteDate;
		},
		get priority() {
			return tags.notePriority;
		},
		get group() {
			return tags.noteGroup;
		},
		get color() {
			return tags.noteColor;
		}
	};

	return { formInputsObject };
  };

export default domMgr