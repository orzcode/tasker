const domMgr = (() => {
	console.log("dom.JS is working");
  
	// const tags = {
	// noteTitle: document.querySelector("#noteTitle"),
	// noteSpan: document.querySelector("#noteSpan"),
	// noteDate: document.querySelector("#noteDate"),
	// notePriority: document.querySelector("input[name='notePriority']:checked"),
	// noteGroup: document.querySelector("#noteGroupButton p"),
	// noteColor: null,
	// //update this later once color btn implemented
	// }	

  	const formInputsObject = {
		get title() {
			return document.querySelector("#noteTitle").value;
		},
		get spanText() {
			return document.querySelector("#noteSpan").value;
		},
		get dueDate() {
			return document.querySelector("#noteDate").value;
		},
		get priority() {
			return document.querySelector("input[name='notePriority']:checked").value;
		},
		get group() {
			return document.querySelector("#noteGroupButton p").value;
		},
		get color() {
			return null;
		}
	};

	return { formInputsObject};
  })();

export default domMgr