const domMgr = (() => {
	console.log("dom.JS is working");
  
	const tags = {
	noteTitle: document.querySelector("#noteTitle"),
	noteSpan: document.querySelector("#noteSpan"),
	noteDate: document.querySelector("#noteDate"),
	notePriority: document.querySelector("input[name='notePriority']:checked"),
	//I think 'value' might be intrinsic to radio buttons - check and change if needed
	noteGroup: document.querySelector("#noteGroupButton p"),
	noteColor: null,
	//update this later once color btn implemented

	//formBox: document.querySelector('#form')
	}
	

  	const formInputsObject = {
		get title() {
			return tags.noteTitle.value;
		},
		get spanText() {
			return tags.noteSpan.value;
		},
		get dueDate() {
			return tags.noteDate.value;
		},
		get priority() {
			return tags.notePriority;
		},
		get group() {
			return tags.noteGroup.value;
		},
		get color() {
			return tags.noteColor;
		}
	};

	return { formInputsObject };
  })();

export default domMgr