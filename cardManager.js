import { domMgr } from "./dom.js";
import storage from "./storage";

import { format } from "date-fns";
import DOMPurify from "isomorphic-dompurify";

const cardManager = () => {

const createCard = (object) => {
	const card = document.createElement("div");
	card.classList.add("note");

	console.log(object)

	const formattedDate = object.dueDate
  ? format(new Date(object.dueDate), "do MMM")
  : "N/A";
	//Uses DATE-DNS to format to "Nov 23rd"

	card.innerHTML = DOMPurify.sanitize(`
			  <div class="noteTitleAndIcons">
				<h3 class="noteTitle">${object.title}</h3>
				<div>
				  <p class="material-symbols-sharp notePaletteIcon">palette</p>
				  <p class="material-symbols-sharp noteDeleteIcon">delete_sweep</p>
				</div>
			  </div>
		  
			  <span class="noteSpan">${object.spanText}</span>
		  
			  <div class="noteDateAndPriority">
				<div class="noteDate">Due date: ${formattedDate}</div>
				<p class="material-symbols-sharp notePriorityIcon">priority_high</p>
			  </div>
		  
			  <div class="noteGroup">Group: ${object.group}</div>
			`);

	// Add delete event listener
	const deleteIcon = card.querySelector(".noteDeleteIcon");
	deleteIcon.addEventListener("click", () => deleteCard(card, object));

	return card;
  };


  const deleteCard = (card, object) => {
	// Find the index of the object in the notePool array
	const index = storage.localArrays.notePool.indexOf(object);
  
	if (index !== -1) {
	  // Remove the object from notePool
	  storage.localArrays.notePool.splice(index, 1);
  
	  // Move the object to the trash array
	  storage.localArrays.trashPool.push(object);

	  storage.trash = storage.localArrays.trashPool;
	  storage.localStorage = storage.localArrays.notePool;
	  //Update localStorage trash and notepool

	  console.log("Moved to trash!")
	  console.log(storage.localArrays.trashPool);

	  // Remove the card from the DOM via native method
	  card.remove();
	}
  };

  
  const renderCards = (library) => {
    if (library) {
      library.forEach((object) => {
        const card = createCard(object);
        //make a 'card' so it can be displayed on page

        domMgr().getTags().mainDiv.appendChild(card);
      });
    } else return;
    //possibly add a 'card' paramater to this function for single cards?
  };

  const clearBoard = () => {
    console.log("Board cleared");
    domMgr().getTags().mainDiv.innerHTML = "";
  };

  return { renderCards, clearBoard }
}

export default cardManager