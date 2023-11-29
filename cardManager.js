import { domMgr } from "./dom.js";
import storage from "./storage";

import { format } from "date-fns";
import DOMPurify from "isomorphic-dompurify";

const cardManager = () => {
  const createCard = (object) => {
    const card = document.createElement("div");
    card.classList.add("note");

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
    //May be the cause of deleteIcon bug when only rendering one object
    //Though, fixed that by rendering full array each time.

    ////////////////////////////////////////////////////////////
    card.addEventListener("click", () => cardEditModal(card.innerHTML, object, card));

    const cardEditModal = (cardHTML, object, card) => {
      const cardModal = document.querySelector("#cardModal");
      
      cardModal.innerHTML = DOMPurify.sanitize(`
      <div class="noteTitleAndIcons">
      <input type="text" maxlength="40" class="noteTitle" value="${object.title}"></input>
      <div class="noteTopIcons">
        <p class="material-symbols-sharp notePaletteIcon">palette</p>
        <p class="material-symbols-sharp noteDeleteIcon">delete_sweep</p>
      </div>
      </div>
    
      <div class="grow-wrap">
      <textarea class="noteSpan" onInput="this.parentNode.dataset.replicatedValue = this.value">${object.spanText}</textarea>
      </div>
      
      <div class="noteDateAndPriority">
      <div class="noteDate">Due date: ${formattedDate}</div>
      <p class="material-symbols-sharp notePriorityIcon">priority_high</p>
      </div>
    
      <div class="modalBottomRow">
      <div class="noteGroup">Group: ${object.group}</div>
      <button class="modalCloseButton">Save & Close</button>
      </div>
    `);


      cardModal.showModal()

    }

    ////////////////////////////////////////////////////////////
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

      console.log("Moved to trash!");
      //console.log(storage.localArrays.trashPool);

      // Remove the card from the DOM via native method
      card.remove();
    }
  };

  const renderCards = (pageLink_or_object) => {

    switch (pageLink_or_object) {
      case "trashDiv":
        storage.localArrays.trashPool.forEach((object) => {
          const card = createCard(object);
          domMgr().getTags().mainDiv.appendChild(card);          
        })
        break;
      case "formDiv":
        storage.localArrays.notePool.forEach((object) => {
          const card = createCard(object);
          domMgr().getTags().mainDiv.appendChild(card);          
        })
        break;
      case "groupsDiv":
          storage.localArrays.notePool.forEach((object) => {
            const card = createCard(object);
            domMgr().getTags().mainDiv.appendChild(card);          
          })
          break;
    }

    // if (Array.isArray(pageLink_or_object)) {

    //   pageLink_or_object.forEach((object) => {
    //     const card = createCard(object);
    //     domMgr().getTags().mainDiv.appendChild(card);
        
    //   });

    //   //this part probably wont be used, but keeping here anyway
    // } else 
    
    if (typeof pageLink_or_object === "object") {
      const card = createCard(pageLink_or_object);
      domMgr().getTags().mainDiv.appendChild(card);
    }
      //this part probably wont be used, but keeping here anyway
  };

  const clearBoard = () => {
    console.log("Board cleared");
    domMgr().getTags().mainDiv.innerHTML = "";
  };

  return { renderCards, clearBoard };
};

export default cardManager;
