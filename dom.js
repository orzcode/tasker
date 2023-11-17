// dom.js
import storage from "./storage";
import cardManager from "./cardManager.js";

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

  const linksHandler = (() => {
    trashLink.addEventListener("click", () =>
      links(storage.localArrays.trashPool)
    );
    noteLink.addEventListener("click", () =>
      links(storage.localArrays.notePool)
    );
  })();
};

const actions = () => {
  const formSubmit = (event) => {
    console.log("dom.js - formSubmit called");

    event.preventDefault();
    console.log("formSubmit executed");

    storage.localArrays.notePool.push({ ...domMgr().formInputsObject });
    //'converts' or spreads it to an actual object, then pushes to library

    storage.localStorage = storage.localArrays.notePool;

    cardManager().clearBoard;
    cardManager().renderCards(storage.localArrays.notePool);
    //should actually append only one card, not all of them
  };
  return { formSubmit };
};

export { domMgr, eventHandlers };
