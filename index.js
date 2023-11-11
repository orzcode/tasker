//console.log("index.JS is working");
import { format } from "date-fns";
import DOMPurify from "isomorphic-dompurify";
import domMgr from "./dom.js";

//const clean = DOMPurify.sanitize('<b>hello there</b>');
//console.log(clean);

// console.log(format(new Date, 'yyyy-MM-dd'));
// document.querySelector(".noteDate").innerHTML = format(new Date, 'yyyy-MM-dd');

const Manager = (() => {
  let notePool = [];

  ////////////////
  const testObj = {
    title: "Sex",
    text: "not Sex",
    dueDate: 11,
    priority: 2,
    group: undefined,
    color: null,
  };
  notePool.push(testObj);
  ////////////////

  const formSubmit = (event) => {
    event.preventDefault();
    console.log("formSubmit executed");

    notePool.push({ ...domMgr.formInputsObject });
    //'converts' or spreads it to an actual object, then pushes to library

    ////
    let test = JSON.stringify(notePool);
    notePool.push(JSON.parse(test));
    console.log(notePool);
    ////
  };

  //////////////////////////////////////////////
  const storage = {
    get localStorage() {
      if (localStorage.getItem("notePool") !== null) {
        let data = localStorage.getItem("notePool");
        //get localStorage item "localContent" (which is a string)
        data = JSON.parse(data);
        //parses (de-strings) library
        notePool.push(data);
      } else return;
    },

    set localStorage(stringified_notePool) {
      localStorage.setItem("notePool", JSON.stringify(stringified_notePool));
    },
  };

  // const localStorage = () => {
  // 	localStorage.setItem("notePool", JSON.stringify(notePool));
  // 	//set a localStorage item called "notePool", set it as a stringified library[]
  //   }
  //   function getLibrary() {
  // 	if (localStorage.getItem("notePool") !== null) {
  // 	  let data = localStorage.getItem("notePool");
  // 	  //get localStorage item "localContent" (which is a string)
  // 	  data = JSON.parse(data);
  // 	  //parses (de-strings) library
  // 	  //IMPORTANTLY, still needs to be MAPPED to a proper array of objects using 'reSeries':
  // 	  data = reSeries(data);
  // 	  //NOTE: called "data", but it's effectively the library[]
  // 	  data.forEach((ObjFromArray) => {
  // 		notePool.push(ObjFromArray);
  // 	  });
  // 	  //runs through each obj in the pulled data and pushes to library[] (cant just push whole thing)
  // 	} else return;
  //   }
  ///////////////////////////////////////////////

  const renderCards = (library) => {
    if (library) {
      library.forEach((object) => {
        const card = createCard(object);
        //make a 'card' so it can be displayed on page

        domMgr.tags.mainDiv.appendChild(card);
      });
    } else return;
  };

  ///////////////////////////////////////////////
  const createCard = (object) => {
    //dompurify the html itself afterwards//
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
				<div class="noteDate"><!-- dueDate via datefns --></div>
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
})();
