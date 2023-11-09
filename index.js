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


console.log(domMgr().formInputsObject.color);


const Manager = (() => {
	let notePool = [];

	const testObj = {title: "Sex", text: "not Sex", dueDate: 11, priority: 3, group: undefined, color: null}
	notePool.push(testObj)

	const eventHandlers = (() => {

		const windowHandlers = (() => {
			window.onclick = function (event) {
				var myBox = document.querySelector('#form');
			
				if (event.target == dialog) {
					dialog.close();
				  }
				//closes modal when clicking outside of it
			
				if (event.target.contains(myBox) && event.target !== myBox) {
				   console.log('You clicked outside the box!');
				   document.querySelector("#form").style.gridTemplateRows = "0 auto 0 0"
				} else {
					console.log('You clicked inside the box!');
					document.querySelector("#form").style.gridTemplateRows = "5rem auto 5rem 5rem"

					console.log(domMgr().formInputsObject.title);
				}
			}
		})()
	})();


})()



//   window.onclick = function (event) {
// 	var myBox = document.querySelector('#form');

// 	if (event.target == dialog) {
// 		dialog.close();
// 	  }
// 	//closes modal when clicking outside of it

// 	if (event.target.contains(myBox) && event.target !== myBox) {
// 	   console.log('You clicked outside the box!');
// 	   document.querySelector("#form").style.gridTemplateRows = "0 auto 0 0"
// 	} else {
// 		console.log('You clicked inside the box!');
// 		document.querySelector("#form").style.gridTemplateRows = "5rem auto 5rem 5rem"
// 	}
// }

