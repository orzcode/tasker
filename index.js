//console.log("index.JS is working");
import { format } from 'date-fns'
import domMgr from './dom.js'

// console.log(format(new Date, 'yyyy-MM-dd'));
// document.querySelector(".noteDate").innerHTML = format(new Date, 'yyyy-MM-dd');

//const noteFactory = (title, text, dueDate, priority, group, color) => {
	// 	return {
	// 		title,
	// 		text,
	// 		dueDate,
	// 		priority,
	// 		group,
	// 		color
	// 	};
	// }


//console.log(domMgr.formInputsObject.color);

const Manager = (() => {
	let notePool = [];	

////////////////
	const testObj = {title: "Sex", text: "not Sex", dueDate: 11, priority: 2, group: undefined, color: null}
	notePool.push(testObj)
////////////////
	
	const formSubmit = (event) => {
		event.preventDefault();

		notePool.push({ ...domMgr.formInputsObject });
		//'converts' or spreads it to an actual object, then pushes

		console.log("formSubmit executed");

		console.log(notePool)
		//console.log(document.querySelector("input[name='notePriority']:checked").value)
		
	}

	const eventHandlers = (() => {

		const formBox = document.querySelector('#form');

		const formHandler = (() => {
			formBox.addEventListener('submit', formSubmit);
		})()

		const windowHandlers = (() => {
			window.onclick = function (event) {				
			
				if (event.target == dialog) {
					dialog.close();
				  }
				//closes modal when clicking outside of it
			
				if (!formBox.contains(event.target)) {
					console.log('You clicked outside the box!');
					formBox.style.gridTemplateRows = "0 auto 0 0";
				} else {
					console.log('You clicked inside the box!');
					formBox.style.gridTemplateRows = "5rem auto 5rem 5rem";
				}
				//Expand/shrink form when clicking inside/outside of it
			}
		})()

	})();
	
})()