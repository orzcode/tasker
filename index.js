import { format } from "date-fns";
import DOMPurify from "isomorphic-dompurify";
import domMgr from "./dom.js";

//localStorage.clear();

const Manager = (() => {
  let notePool = [];
  let trashPool = [];
  //////////////////////////////////////////////
  const formSubmit = (event) => {
    event.preventDefault();
    console.log("formSubmit executed");

    notePool.push({ ...domMgr.formInputsObject });
    //'converts' or spreads it to an actual object, then pushes to library

    storage.localStorage = notePool;
    console.log(storage.localStorage);

    clearBoard();
    renderCards(notePool);
    //should actually append only one card, not all of them
  };
  //////////////////////////////////////////////
  const storage = {
    get localStorage() {
      if (localStorage.getItem("notePool") !== null) {
        let data = localStorage.getItem("notePool");
        //get localStorage item "localContent" (which is a string)

        return JSON.parse(data);
        //parses (de-strings) library and returns
      } else return null;
    },

    set localStorage(to_be_stringified_notePool) {
      localStorage.setItem(
        "notePool",
        JSON.stringify(to_be_stringified_notePool)
      );
    },

    get trash() {
      if (localStorage.getItem("trash") !== null) {
        let data = localStorage.getItem("trash");
        //get localStorage item "trash" (which is a string)

        return JSON.parse(data);
        //parses (de-strings) array and returns
      } else return null;
    },

    set trash(to_be_stringified_trashPool) {
      localStorage.setItem(
        "trash",
        JSON.stringify(to_be_stringified_trashPool)
      );
    },
  };
  ///////////////////////////////////////////////
  const renderCards = (library) => {
    if (library) {
      library.forEach((object) => {
        const card = createCard(object);
        //make a 'card' so it can be displayed on page

        domMgr.tags.mainDiv.appendChild(card);
      });
    } else return;
    //possibly add a 'card' paramater to this function for single cards?
  };
  ///////////////////////////////////////////////
  const clearBoard = () => {
    console.log("Board cleared");
    domMgr.tags.mainDiv.innerHTML = "";
  };
  ///////////////////////////////////////////////
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

    return card;
  };
  ///////////////////////////////////////////////
  ///////////////////////////////////////////////
  const deleteCard = (card, object) => {
    // Find the index of the object in the notePool array
    const index = notePool.indexOf(object);
  
    if (index !== -1) {
      // Remove the object from notePool
      notePool.splice(index, 1);
  
      // Move the object to the trash array
      trashPool.push(object);

      storage.trash = trashPool;
      storage.localStorage = notePool;
      //Update localStorage trash and notepool

      console.log("Moved to trash!")
      console.log(trashPool);

      // Remove the card from the DOM via native method
      card.remove();
    }
  };
  ///////////////////////////////////////////////
  ///////////////////////////////////////////////
  const eventHandlers = (() => {
    const formBox = domMgr.tags.formBox;
    const trashLink = domMgr.tags.trashLink;
    const noteLink = domMgr.tags.noteLink;
    const notes = domMgr.tags.notes;

    const formHandler = (() => {
      formBox.addEventListener("submit", formSubmit);
    })();
    //for Form Submission

    const windowHandlers = (() => {
      window.onclick = function (event) {
        if (event.target == dialog) {
          dialog.close();
        }
    //closes modal when clicking outside of it

        if (!formBox.contains(event.target)) {
          console.log("You clicked outside the form box!");
          formBox.style.gridTemplateRows = "0 auto 0 0";
        } else {
          console.log("You clicked inside the form box!");
          formBox.style.gridTemplateRows = "5rem auto 5rem 5rem";
        }
    //Expand/shrink form when clicking inside/outside of it
      };

    const linksHandler = (() => {
      trashLink.addEventListener("click", () => links(trashPool));
      noteLink.addEventListener("click", () => links(notePool));
    })()
    
    function links(array) {
      // Fade out the existing cards
      fadeCards(0);
    
      // Wait for the fade-out effect to complete before rendering new cards
      setTimeout(() => {
        clearBoard();
        renderCards(array);
    
        // Fade in the new cards
        fadeCards(1);
      }, 500); // Adjust the duration to match your CSS transition duration
    }

    })();

    
  })();

  //SCOPE / COMPILATION ISSUE WITH DOM-MGR TAGS
  function fadeCards(targetOpacity) {
    console.log(domMgr.tags.notes);
    const notes = domMgr.tags.notes;
    notes.forEach(note => {
      note.style.opacity = targetOpacity;
    });
    console.log("fade cards executed")
  }
  //SCOPE / COMPILATION ISSUE WITH DOM-MGR TAGS

  ///////////////////////////////////////////////
  const firstLoad = (() => {
    notePool = storage.localStorage || [];

    trashPool = storage.trash || [];

    renderCards(notePool);
  })();
  ///////////////////////////////////////////////
})();
