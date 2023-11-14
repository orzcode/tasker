const domMgr = (() => {
	console.log("dom.JS is working");
	//let tags;

	const tags = {
		formBox: document.querySelector('#form'),
		mainDiv: document.querySelector('#main'),
		trashLink: document.querySelector('[data-link="trashpool"]'),
		noteLink: document.querySelector('[data-link="notepool"]'),
		notes: document.querySelectorAll('div.note'),
	}

	const tagSetup = () => ({
		formBox: document.querySelector('#form'),
		mainDiv: document.querySelector('#main'),
		trashLink: document.querySelector('[data-link="trashpool"]'),
		noteLink: document.querySelector('[data-link="notepool"]'),
		notes: document.querySelectorAll('div.note'),
	})

	// document.addEventListener('DOMContentLoaded', () => {
	// 	tags = () => ({
	// 	  formBox: document.querySelector('#form'),
	// 	  mainDiv: document.querySelector('#main'),
	// 	  trashLink: document.querySelector('[data-link="trashpool"]'),
	// 	  noteLink: document.querySelector('[data-link="notepool"]'),
	// 	  notes: document.querySelectorAll('div.note'),
	// 	})}
	// 	)

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

	return { formInputsObject, tags, tagSetup };
  })();

export default domMgr