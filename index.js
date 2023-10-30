console.log("index.JS from Vite is working");
import { format } from 'date-fns'

console.log(format(new Date, 'yyyy-MM-dd'));
document.querySelector(".noteDate").innerHTML = format(new Date, 'yyyy-MM-dd');


const noteFactory = (title, text, dueDate, priority, group, color) => {
	return {
		title,
		text,
		dueDate,
		priority,
		group,
		color
	};
}

let fucky = noteFactory("newnote", "fuck your mother", "tomorrow", 1, "bzlbub");
console.log(fucky)

//Amazing!
window.onclick = function(event) {
	if (event.target == dialog) {
	  dialog.close();
	}
  }
//closes modal when clicking outside of it
//dumb that this isn't html native



document.querySelector("#noteSpan").addEventListener("click", function() {
	document.querySelector("#form").style.gridTemplateRows = "4rem auto 4rem 4rem"
  });