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

      noteGroupBtn: document.querySelector("#noteGroupButton"),
      noteGroupP: document.querySelector("#noteGroupP"),
      groupPopup: document.querySelector("#groupPopup"),
      groupBtns: document.querySelectorAll(".group-btns"),

      ddmmyy: document.querySelector('input[type="date"]'),

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
      return document.querySelector("#noteGroupP").innerHTML;
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

  ////////////////////////////////////////////////////////////
  // Actual form submission is called at bottom of this.
  // Most of this horseshit is to handle box shrinkage/growth
  ////////////////////////////////////////////////////////////
  const formHandler = () => {
    let mouseClickedInside = false;

    // Mouse enters the form box
    formBox.addEventListener("mouseenter", function () {
      formBox.style.gridTemplateRows = "5rem auto 5rem 5rem";
    });

    // Mouse leaves the form box
    // AND it has no content
    // AND it wasn't clicked:
    formBox.addEventListener("mouseleave", function () {
      if (!formHasContent() && !mouseClickedInside) {
        formBox.style.gridTemplateRows = "0 auto 0 0";
        mouseClickedInside = false;
      }
    });

    formBox.addEventListener("mousedown", function () {
      mouseClickedInside = true;
    });

    // Click anywhere on the document
    document.addEventListener("mousedown", function (event) {
      // Check if the form has content
      if (!formBox.contains(event.target)) {
        mouseClickedInside = false;
        if (!formHasContent()) {
          formBox.style.gridTemplateRows = "0 auto 0 0";
        }
      }
    });

    // Function to check if the form has content
    function formHasContent() {
      // Check input fields of type text
      const textInputs = formBox.querySelectorAll('input[type="text"]');
      for (const input of textInputs) {
        if (input.value.trim() !== "") {
          return true;
        }
      }
      // Check textarea
      const textarea = formBox.querySelector("textarea");
      return textarea && textarea.value.trim() !== "";
    }

    formBox.addEventListener("submit", actions().formSubmit);
    //for Form Submission
  };
  ////////////////////////////////////////////////////////////
  const popupHandler = () => {
    document.addEventListener("mousedown", function (event) {
      groupPopup.style.display = "none";
    });
    //closes popup when clicking outside it

    // window.onclick = function(event) {
    //   if (event.target == modal) {
    //     modal.style.display = "none";
    //   }

    domMgr()
      .getTags()
      .noteGroupBtn.addEventListener("click", function (event) {
        groupPopup.style.display = "flex";
      });
    //displays (flex) popup when clicking notegroup button

    domMgr()
      .getTags()
      .ddmmyy.addEventListener("click", function (event) {
        domMgr().getTags().ddmmyy.showPicker();
      });
    //makes date picker click area extend to date itself, not just the icon

    const selectGroup = (group) => {
      domMgr().getTags().noteGroupP.innerHTML = group
    }
    //updates Group on form - which is used during submission

    domMgr().getTags().groupBtns.forEach(function(button) {
      button.addEventListener('mousedown', function() {
        let buttonText = button.textContent.trim();
        selectGroup(buttonText);
      });
    });
    //adds click to each button to update with the respective text

    return {selectGroup}
  };
  ////////////////////////////////////////////////////////////

  const trashHandler = () => {
    emptyTrash.addEventListener("click", () => trashButtons().showHide("show"));
    emptyTrashNo.addEventListener("click", () =>
      trashButtons().showHide("hide")
    );
    emptyTrashYes.addEventListener("click", () => trashButtons().emptyTrash());
  };

  const dialogHandler = () => {
    window.addEventListener("click", (event) => {
      if (event.target == document.querySelector("dialog")) {
        document.querySelector("dialog").close();
        console.log("dialog close() fired");
      }
      //closes modal when clicking outside of it? I'm Ron Burgundy???
    });
  };

  return { trashHandler, formHandler, dialogHandler, popupHandler };
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
    event.preventDefault();

    storage.localArrays.notePool.push({ ...domMgr().formInputsObject });
    //'converts' or spreads it to an actual object, then pushes to library

    storage.localStorage = storage.localArrays.notePool;

    cardManager().clearBoard();
    cardManager().renderCards("formDiv");
    //clears and re-does the whole array, solving minor bug with delete button
    //not working when this was called with just a single object.
    //previously:
    //cardManager().renderCards({ ...domMgr().formInputsObject });
  };

  const linksHandler = () => {
    console.log("linkshandler called");
    domMgr()
      .getTags()
      .trashLink.addEventListener("click", () => links("trashDiv"));
    domMgr()
      .getTags()
      .noteLink.addEventListener("click", () => links("formDiv"));
    domMgr()
      .getTags()
      .groupsLink.addEventListener("click", () => links("groupsDiv"));
  };

  function links(link) {
    // Fade out the existing cards
    fadeCards(0);

    setTimeout(() => {
      // Waits for  fade-out to complete before actioning

      cardManager().clearBoard();
      //clears cards

      replaceHeader(link);

      cardManager().renderCards(link);

      fadeCards(1);
    }, 500); // Adjust the duration to match your CSS transition duration
  }

  function replaceHeader(link) {
    switch (link) {
      case "trashDiv":
        domMgr().getTags().headerContainer.innerHTML = headerVariants.trashDiv;
        eventHandlers().trashHandler();
        break;
      case "formDiv":
        domMgr().getTags().headerContainer.innerHTML = headerVariants.formDiv;
        eventHandlers().formHandler();
        break;
      case "groupsDiv":
        domMgr().getTags().headerContainer.innerHTML = headerVariants.groupsDiv;
        break;
    }
  }

  function fadeCards(targetOpacity) {
    // const notes = domMgr().getTags().notes;
    // notes.forEach((note) => {
    //   note.style.opacity = targetOpacity;
    // });
    //fades cards

    //Problem is that 'new' cards don't get faded in
    //Solution: fade the container instead

    domMgr().getTags().mainDiv.style.opacity = targetOpacity;
    //fades #main area (all the cards)

    domMgr().getTags().headerContainer.style.opacity = targetOpacity;
    //fades header container
  }

  const headerVariants = {
    formDiv: `<div id="formBoxDiv">
        <form id="form" tabindex="0">
          <input type="text" id="noteTitle" name="noteTitle" placeholder="Title" maxlength="25" autocomplete="off">
          <div class="grow-wrap">
            <textarea required name="noteSpan" id="noteSpan" placeholder="Enter note..." onInput="this.parentNode.dataset.replicatedValue = this.value"></textarea>
          </div>
        
          <section id="noteDateAndPriority">
        
            <div><label for="noteDate">Due date: <input type="date" id="noteDate" name="noteDate"></label></div>
        
            <div id="notePriorityDiv">
              <legend>Priority</legend>
                <div id="radiosDiv">
                  <input type="radio" id="notePriorityLow" name="notePriority" value="low" checked>
                  <input type="radio" id="notePriorityMed" name="notePriority" value="medium">
                  <input type="radio" id="notePriorityHigh" name="notePriority" value="high">
                </div>
            </div>
          </section>
          <section id="noteButtons">
            <button type="button" form="form" id="noteGroupButton" onclick="dialog.showModal()">Group: <p>(none)</p></button>
            <button type="submit" form="form" id="noteSubmit">Task it!</button>
          </section>
        </form>
      </div>`,

    trashDiv: `<div id="trashBtnsMainDiv">
        <button type="button" id="emptyTrash" class="btnShadow trashBtns">Empty Trash?</button>
        <div id="trashBtnsConfirmDiv">
          <button type="button" id="emptyTrashYes" class="btnShadow trashBtns">Y</button>
          <button type="button" id="emptyTrashNo" class="btnShadow trashBtns">N</button>
        </div>
      </div>`,

    groupsDiv: `<div id="groupsMainDiv">
        <p>Fuck</p>
      </div>`,
  };

  return { formSubmit, linksHandler };
};

export { domMgr, eventHandlers, actions };
