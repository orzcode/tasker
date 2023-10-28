console.log("index.JS from webpack is working");
import { format } from 'date-fns'

console.log(format(new Date(2014, 1, 11), 'yyyy-MM-dd'));
document.querySelector(".noteDate").innerHTML = format(new Date(2014, 1, 11), 'yyyy-MM-dd');


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

document.querySelector("#form").addEventListener("click", function() {
	document.querySelector("#form").style.height = "auto";
	document.querySelectorAll("#form > *:not(#noteSpan)").forEach(element => {
		element.style.display = "block";
	  });
	  document.querySelector(".grow-wrap").style.display = "grid";
	//   document.querySelector(".grow-wrap > textarea").style.display = "flex";
	//   document.querySelector(".grow-wrap::after").style.display = "flex";

	document.querySelector("#noteDateAndPriority").style.display = "flex";
  });
