//console.log("index.JS is working");
import { format } from "date-fns";
import DOMPurify from "isomorphic-dompurify";
import domMgr from "./dom.js";

// console.log(format(new Date, 'yyyy-MM-dd'));
// document.querySelector(".noteDate").innerHTML = format(new Date, 'yyyy-MM-dd');

//localStorage.clear();


const Manager = (() => {
  let notePool = [];
  //////////////////////////////////////////////
  const formSubmit = (event) => {
    event.preventDefault();
    console.log("formSubmit executed");

    notePool.push({ ...domMgr.formInputsObject });
    //'converts' or spreads it to an actual object, then pushes to library

    storage.localStorage = notePool;
    console.log(storage.localStorage)

    clearBoard()
    renderCards(notePool)
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
      localStorage.setItem("notePool", JSON.stringify(to_be_stringified_notePool));
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
    domMgr.tags.mainDiv.innerHTML = '';
  }
  ///////////////////////////////////////////////
  const createCard = (object) => {
    //dompurifies the html itself afterwards//
    const card = document.createElement("div");
    card.classList.add("note");

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
				<div class="noteDate">Due date: ${object.dueDate}</div>
				<p class="material-symbols-sharp notePriorityIcon">priority_high</p>
			  </div>
		  
			  <div class="noteGroup">Group: ${object.group}</div>
			`);

    // Set the date and any other dynamic content here...

    return card;
  };

  ///////////////////////////////////////////////
  const eventHandlers = (() => {
    const formBox = domMgr.tags.formBox;

    const formHandler = (() => {
      formBox.addEventListener("submit", formSubmit);
    })();

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
    })();
  })();

///////////////////////////////////////////////
    const firstLoad = (() =>{
      notePool = storage.localStorage || [];
      
      renderCards(notePool);
    })()
///////////////////////////////////////////////

})();
