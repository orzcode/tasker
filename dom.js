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
      groupsLink: document.querySelector('[data-link="groupsLink"]'),
      notes: document.querySelectorAll("div.note"),

      trashDiv: document.querySelector("#trashBtnsMainDiv"),
      emptyTrash: document.querySelector("#emptyTrash"),
      emptyTrashYes: document.querySelector("#emptyTrashYes"),
      emptyTrashNo: document.querySelector("#emptyTrashNo"),

      groupsDiv: document.querySelector("#groupsMainDiv"),

      formDiv: document.querySelector("#formBoxDiv"),

      headerContainer: document.querySelector("#headerContainer"),
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

  const trashHandler = (() => {
    emptyTrash.addEventListener("click", () => trashButtons().showHide("show"));
    emptyTrashNo.addEventListener("click", () =>
      trashButtons().showHide("hide")
    );
    emptyTrashYes.addEventListener("click", () => trashButtons().emptyTrash());
  })();

  const windowHandlers = (() => {
    window.addEventListener("click", function (event) {
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
    });
  })();
};

const trashButtons = () => {
  const showHide = (showHide) => {
    switch (showHide) {
      case "show":
        trashBtnsConfirmDiv.style.visibility = "visible";
        break;
      case "hide":
        trashBtnsConfirmDiv.style.visibility = "hidden";
        break;
    }
  };

  const emptyTrash = () => {
    storage.localArrays.trashPool = [];
    storage.trash = null;
    cardManager().clearBoard();
  };

  return { showHide, emptyTrash };
};

const actions = () => {
  const formSubmit = (event) => {
    console.log("dom.js - formSubmit called");

    event.preventDefault();

    storage.localArrays.notePool.push({ ...domMgr().formInputsObject });
    //'converts' or spreads it to an actual object, then pushes to library

    storage.localStorage = storage.localArrays.notePool;

    cardManager().clearBoard();
    cardManager().renderCards(storage.localArrays.notePool);
    //clears and re-does the whole array, solving minor bug with delete button
    //not working when this was called with just a single object.
    //previously:
    //cardManager().renderCards({ ...domMgr().formInputsObject });
  };

  const linksHandler = () => {
    console.log("linkshandler calld");

    domMgr()
      .getTags()
      .trashLink.addEventListener("click", () =>
        // links(storage.localArrays.trashPool)
        links("trashDiv")
      );
    domMgr()
      .getTags()
      .noteLink.addEventListener("click", () =>
        // links(storage.localArrays.notePool)
        links("formDiv")
      );
    domMgr()
      .getTags()
      .groupsLink.addEventListener("click", () =>
        // links(storage.localArrays.notePool)
        links("groupsDiv")
      );
  };




  function links(link) {
    // Fade out the existing cards
    fadeCards(0);    

    //formDiv
    //trashDiv
    //groupsDiv
    
    setTimeout(() => {
    // Waits for  fade-out to complete before actioning

      cardManager().clearBoard();
      //clears cards
      domMgr().getTags()[link].style.display = "none"
      //wrong - should isable current page
      //can i disable the first div child?

      cardManager().renderCards(array);

      
      fadeCards(1);
    }, 500); // Adjust the duration to match your CSS transition duration
  }

  function fadeCards(targetOpacity) {
    const notes = domMgr().getTags().notes;
    notes.forEach((note) => {
      note.style.opacity = targetOpacity;
    });
    //fades cards

    domMgr().getTags().headerContainer.style.opacity = targetOpacity;
    //fades header container

    //  THIS WORKS BOTH WAYS FOR HEADER!
    // PROBLEM IS THEREFORE AS SUSPECTED: THE NOTES

    console.log("fade cards executed");
  }

  return { formSubmit, linksHandler };
};

export { domMgr, eventHandlers, actions };
