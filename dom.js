// dom.js
import storage from "./storage";
import cardManager from "./cardManager.js";
//import Manager from "./index.js";

const domMgr = () => {
  const getTags = () => {
    return {
      formBox: document.querySelector("#form"),
      mainDiv: document.querySelector("#main"),
      trashLink: document.querySelector('[data-link="trashpool"]'),
      noteLink: document.querySelector('[data-link="notepool"]'),
      notes: document.querySelectorAll("div.note"),
    };
  };

  const formInputsObject = {
    get title() {
      return document.querySelector("#noteTitle").value;
    },
    get spanText() {
      return document.querySelector("#noteSpan").value;
    },
    get dueDate() {
      return document.querySelector("#noteDate").value;
    },
    get priority() {
      return document.querySelector("input[name='notePriority']:checked").value;
    },
    get group() {
      return document.querySelector("#noteGroupButton p").value;
    },
    get color() {
      return null;
    },
  };

  return { formInputsObject, getTags };
};

const eventHandlers = () => {
  console.log("dom.js - eventHandlers called");

  const formBox = domMgr().getTags().formBox;
  const trashLink = domMgr().getTags().trashLink;
  const noteLink = domMgr().getTags().noteLink;
  const notes = domMgr().getTags().notes;

  const formHandler = (() => {
    formBox.addEventListener("submit", actions().formSubmit);
  })();
  //for Form Submission

  const windowHandlers = (() => {
    window.onclick = function (event) {
      if (event.target == dialog) {
        dialog.close();
      }
      //closes modal when clicking outside of it

      if (!formBox.contains(event.target)) {
        //console.log("You clicked outside the form box!");
        formBox.style.gridTemplateRows = "0 auto 0 0";
      } else {
        //console.log("You clicked inside the form box!");
        formBox.style.gridTemplateRows = "5rem auto 5rem 5rem";
      }
      //Expand/shrink form when clicking inside/outside of it
    };
  })();
};

const actions = () => {
  const formSubmit = (event) => {
    console.log("dom.js - formSubmit called");

    event.preventDefault();

    storage.localArrays.notePool.push({ ...domMgr().formInputsObject });
    //'converts' or spreads it to an actual object, then pushes to library

    storage.localStorage = storage.localArrays.notePool;

    //cardManager().clearBoard;
    cardManager().renderCards({ ...domMgr().formInputsObject });
    //should actually append only one card, not all of them
  };

  const linksHandler = () => {
	console.log("linkshandler calld")

    domMgr().getTags().trashLink.addEventListener("click", () =>
      links(storage.localArrays.trashPool)
    );
    domMgr().getTags().noteLink.addEventListener("click", () =>
      links(storage.localArrays.notePool)
    );
  };

  function links(array) {
    // Fade out the existing cards
    fadeCards(0);

    // { Need to fade top section too }
      // Below:
    //  { need to Clear top section }
    // { need to render top section 
  //  {might as well make these separate?}

    // Wait for the fade-out effect to complete before rendering new cards
    setTimeout(() => {
      cardManager().clearBoard;
      cardManager().renderCards(array);

      // Fade in the new cards
      fadeCards(1);
    }, 500); // Adjust the duration to match your CSS transition duration
  }

  function fadeCards(targetOpacity) {
    const notes = domMgr().getTags().notes;
    notes.forEach((note) => {
      note.style.opacity = targetOpacity;
    });
    console.log("fade cards executed");
  }

  return { formSubmit, linksHandler };
};

export { domMgr, eventHandlers, actions };
