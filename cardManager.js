import { domMgr } from "./dom.js";
import storage from "./storage";

import { format } from "./node_modules/date-fns/esm/index.js";
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
				  <p class="material-symbols-sharp notePaletteIcon" style="display: none;">palette</p>
          <p class="material-symbols-sharp noteDeleteIcon" style="display: inline-block;">delete_sweep</p>
          <p class="material-symbols-sharp noteRestoreIcon" style="display: none;">restore_from_trash</p>
				</div>
			  </div>
		  
			  <span class="noteSpan">${object.spanText}</span>
		  
			  <div class="noteDateAndPriority">
				<div class="noteDate">Due date: ${formattedDate}</div>
				<p class="material-symbols-sharp notePriorityIcon">priority_high</p>
			  </div>
		  
			  <div class="noteGroup">Group: ${object.group}</div>
			`);

      const deleteIcon = card.querySelector(".noteDeleteIcon");
      const restoreIcon = card.querySelector(".noteRestoreIcon");
    
      // Conditionally show delete or restore icon
      if (storage.localArrays.trashPool.includes(object)) {
        deleteIcon.style.display = "none";
        restoreIcon.style.display = "inline-block";
      } else {
        deleteIcon.style.display = "inline-block";
        restoreIcon.style.display = "none";
      }
    
      // Add delete or restore event listener
      const deleteOrRestoreIcon = storage.localArrays.trashPool.includes(object) ? restoreIcon : deleteIcon;
    
      deleteOrRestoreIcon.addEventListener("click", () => {
        event.stopPropagation();
        if (storage.localArrays.trashPool.includes(object)) manageCard(card, object, "restore");
        else manageCard(card, object, "delete");
      });

    ////////////////////////////////////////////////////////////
    card.addEventListener("click", () => {
      if (!storage.localArrays.trashPool.includes(object)) {
        cardEditModal(object, card);
      }
    });
    ////////////////////////////////////////////////////////////
    return card;
  };

  const cardEditModal = (object, card) => {
    let cardModal = document.querySelector("#cardModal");
    
    if (!cardModal) {
      // If the modal is null, create a new one
      cardModal = document.createElement("dialog");
      cardModal.id = "cardModal";
      document.body.appendChild(cardModal);
    }

    cardModal.showModal();


    const formattedDate = object.dueDate
      ? format(new Date(object.dueDate), "do MMM")
      : "N/A";
    //Uses DATE-DNS to format to "Nov 23rd"

    cardModal.innerHTML = DOMPurify.sanitize(`
    <div class="noteTitleAndIcons">
    <input type="text" maxlength="40" class="noteTitle" value="${object.title}"></input>
    <div class="noteTopIcons">
      <p class="material-symbols-sharp notePaletteIcon" style="display: none;">palette</p>
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

    //////adds the close functionality////////////
    document
      .querySelector("#cardModal .modalCloseButton")
      .addEventListener("click", function (event) {
        object.title = document.querySelector("#cardModal .noteTitle").value;
        object.spanText = document.querySelector("#cardModal .noteSpan").value;
        //updates object before sending

        const indexInNotePool = storage.localArrays.notePool.indexOf(object);

        if (indexInNotePool !== -1) {
          // Update the object in notePool
          storage.localArrays.notePool[indexInNotePool] = object;

          // Update localStorage notePool
          storage.localStorage = storage.localArrays.notePool;
        }

        clearBoard();
        renderCards("formDiv");
        cardModal.close();
      });
    ////////////////////////////////////////////////
    // Add event listener for delete icon using delegation
    cardModal.addEventListener("click", function (event) {
      const deleteIcon = event.target.closest(".noteDeleteIcon");

      if (deleteIcon) {
        // Delete button inside the modal was clicked
        manageCard(card, object, "delete");
        cardModal.close();
      }
    });
    ////////////////////////////////////////////
  };

  const manageCard = (card, object, action) => {
    const indexInNotePool = storage.localArrays.notePool.indexOf(object);
    const indexInTrash = storage.localArrays.trashPool.indexOf(object);
  
    if (action === "delete" && indexInNotePool !== -1) {
      // If the action is to delete and the card is in the notePool
      storage.localArrays.notePool.splice(indexInNotePool, 1);
      storage.localArrays.trashPool.push(object);
      console.log("Moved to trash!");
    } else if (action === "restore" && indexInTrash !== -1) {
      // If the action is to restore and the card is in the trash
      storage.localArrays.trashPool.splice(indexInTrash, 1);
      storage.localArrays.notePool.push(object);
      console.log("Restored from trash!");
    }
  
    storage.trash = storage.localArrays.trashPool;
    storage.localStorage = storage.localArrays.notePool;
  
    // Remove the card from the DOM via native method
    card.remove();
  };

  const renderCards = (pageLink_or_object) => {
    switch (pageLink_or_object) {
      case "trashDiv":
        storage.localArrays.trashPool.forEach((object) => {
          const card = createCard(object);
          domMgr().getTags().mainDiv.appendChild(card);
        });
        break;
      case "formDiv":
        storage.localArrays.notePool.forEach((object) => {
          const card = createCard(object);
          domMgr().getTags().mainDiv.appendChild(card);
          //put it here
          //I -THINK- it isn't applying the cardEditModal properly during render.
        });
        break;
      case "groupsDiv":
        storage.localArrays.notePool.forEach((object) => {
          const card = createCard(object);
          domMgr().getTags().mainDiv.appendChild(card);
        });
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
