// dom.js
import storage from "./storage.js";
import cardManager from "./cardManager.js";

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
      groupsDivRadios: document.querySelectorAll(".groupBtns"),

      formDiv: document.querySelector("#formBoxDiv"),

      noteGroupBtn: document.querySelector("#noteGroupButton"),
      noteGroupP: document.querySelector("#noteGroupP"),
      groupPopup: document.querySelector("#groupPopup"),
      groupBtns: document.querySelectorAll(".group-btns"),

      ddmmyy: document.querySelector('input[type="date"]'),

      headerContainer: document.querySelector("#headerContainer"),

      cardEditModal: document.querySelector("#cardModal"),
      modalSaveClose: document.querySelector("#cardModal .modalCloseButton"),

      exclamationLabels: document.querySelectorAll("#radiosDiv label"),
      exclamationIcons: document.querySelectorAll(
        "#radiosDiv .notePriorityIcon"
      ),
      //Labels are essentially radio buttons
      //Icons are the visual representation
      modalLabels: document.querySelectorAll("#modalRadiosDiv label"),
      modalIcons: document.querySelectorAll(
        "#modalRadiosDiv .notePriorityIcon"
      ),
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
  const formBox = domMgr().getTags().formBox;

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
    const tags = domMgr().getTags();

    // if (!groupPopup) {
    //   return; //Only runs if it's the Form page
    // } else

    document.addEventListener("mousedown", (event) => {
      tags.groupPopup.style.display = "none";
    }); //closes popup when clicking outside it

    tags.noteGroupBtn.addEventListener("click", (event) => {
      groupPopup.style.display = "flex";
    }); //displays (flex) popup when clicking notegroup button

    tags.ddmmyy.addEventListener("click", (event) => {
      tags.ddmmyy.showPicker();
    }); //makes date picker click area extend to date itself, not just the icon

    const selectGroup = (group) => {
      tags.noteGroupP.innerHTML = group;
    }; //updates Group on form - which is used during submission

    tags.groupBtns.forEach(function (button) {
      button.addEventListener("mousedown", function () {
        let buttonText = button.textContent.trim();
        selectGroup(buttonText);
      }); //adds click to each button to update with the respective text
    });

    return { selectGroup };
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
  ////////////////////////////////////////////////////////////
  const groupsHandler = () => {
    domMgr()
      .getTags()
      .groupsDivRadios.forEach((input) => {
        input.addEventListener("change", () => {
          const groupName = input.id.replace("Btn", ""); // Extract the group name from id
          renderCardsByGroup(groupName);
        });
      });
    //add event to call a fn to render cards based on radio input on Group page
  };
  function renderCardsByGroup(selectedGroup) {
    cardManager().clearBoard();
    if (selectedGroup === "All") {
      cardManager().renderCards("groupsDiv");
    } //renders 'All' cards

    //or
    else
      storage.localArrays.notePool.forEach((note) => {
        if (note.group === selectedGroup) {
          cardManager().renderCards(note);
        } //renders the selected group only
      });
  }
  ////////////////////////////////////////////////////////////
  const priorityHandler = () => {
    const tags = domMgr().getTags();

    // Event handler for priority icons
    const formOrModalClickEvent = (formOrModal, objPriority) => {
      switch (formOrModal) {
        case "form":
          tags.exclamationLabels.forEach((label) => {
            label.addEventListener("click", function (event) {
              //event.preventDefault(); // Prevent the default behavior of the label
              const priority = this.getAttribute("data-priority");

              document.getElementById(`notePriority${priority}`).checked = true;
              //check/set the appropriate radio button

              setPriorityIcon(priority, tags.exclamationIcons);
            });
          });
          break;
        //////////////
        case "modal": //3 things here differ from above (labels, radio, icons)//
          tags.modalLabels.forEach((label) => {
            label.addEventListener("click", function (event) {
              //event.preventDefault(); // Prevent the default behavior of the label
              const priority = this.getAttribute("data-priority");

              document.getElementById(
                `modalPriority${priority}`
              ).checked = true;
              //check/set the appropriate radio button

              setPriorityIcon(priority, tags.modalIcons);
            });
          });
          break;
      }
      //for the radio labels (excl. icons) - which are linked to the (hidden) radio inputs,
      //this adds click event to:
      //(1) check/set the appropriate radio
      //(2) reflect the appropriate icon highlight
    };

    //needs to be fed either form or modal queryselector
    function setPriorityIcon(priority, location) {
      location.forEach((icon, index) => {
        if (index < getPriorityIndex(priority)) {
          icon.classList.add("active");
        } else {
          icon.classList.remove("active");
        }
      });
    }
    function getPriorityIndex(priority) {
      switch (priority) {
        case "Low":
          return 1;
        case "Med":
          return 2;
        case "High":
          return 3;
      }
    }
    return { getPriorityIndex, setPriorityIcon, formOrModalClickEvent };
  };
  ////////////////////////////////////////////////////////////
  return {
    trashHandler,
    formHandler,
    popupHandler,
    dialogHandler,
    groupsHandler,
    priorityHandler,
  };
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
  ////////////////////////////////////////////////////////////
  const tutorialCard = () => {
    if(!storage.localStorage || storage.localStorage.length === 0){
      storage.localArrays.notePool.push(cardManager().tutorialCard)
    }
  };
  ////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////
  const formSubmit = (event) => {
    event.preventDefault();

    storage.localArrays.notePool.push({ ...domMgr().formInputsObject });
    //'converts' or spreads it to an actual object, then pushes to library

    storage.localStorage = storage.localArrays.notePool;
    replaceHeader("formDiv");
    cardManager().clearBoard();
    cardManager().renderCards("formDiv");
    //clears and re-does the whole array, solving minor bug with delete button
    //not working when this was called with just a single object.
    //previously:
    //cardManager().renderCards({ ...domMgr().formInputsObject });
  };
  ///////////////////////////////////////////////////////////

  const linksHandler = () => {
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
    }, 500);
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
        eventHandlers().popupHandler();
        eventHandlers().priorityHandler().formOrModalClickEvent("form");
        break;
      case "groupsDiv":
        domMgr().getTags().headerContainer.innerHTML = headerVariants.groupsDiv;
        eventHandlers().groupsHandler();
        break;
    }
  }

  ////////////////////////////////////////////////////////////
  function fadeCards(targetOpacity) {
    domMgr().getTags().mainDiv.style.opacity = targetOpacity;
    //fades #main area (all the cards)

    domMgr().getTags().headerContainer.style.opacity = targetOpacity;
    //fades header container
  }

  const headerVariants = {
    formDiv: `<div id="formBoxDiv">
    <form id="form" tabindex="0">
      <input type="text" id="noteTitle" name="noteTitle" placeholder="Title" maxlength="40" autocomplete="off">
      <div class="grow-wrap">
        <textarea required name="noteSpan" id="noteSpan" placeholder="Enter note..." onInput="this.parentNode.dataset.replicatedValue = this.value"></textarea>
      </div>
    
      <section id="noteDateAndPriority">
      <div><label for="noteDate">Due date: <input type="date" id="noteDate" name="noteDate"></label></div>
            
      <div id="notePriorityDiv">
        <legend>Priority</legend>
          <div id="radiosDiv">
            <input type="radio" id="notePriorityLow" data-priority="Low" class="disabledRadio" name="notePriority" value="Low" checked>
            <input type="radio" id="notePriorityMed" data-priority="Med" class="disabledRadio" name="notePriority" value="Med">
            <input type="radio" id="notePriorityHigh" data-priority="High" class="disabledRadio" name="notePriority" value="High">

                <!-- Labels representing icons -->
<label for="notePriorityLow" data-priority="Low">
<p class="material-symbols-sharp notePriorityIcon active">priority_high</p>
</label>
<label for="notePriorityMed" data-priority="Med">
<p class="material-symbols-sharp notePriorityIcon">priority_high</p>
</label>
<label for="notePriorityHigh" data-priority="High">
<p class="material-symbols-sharp notePriorityIcon">priority_high</p>
</label>
          </div>
      </div>
      </section>
      <section id="noteButtons">

        <button type="button" form="form" id="noteGroupButton">Group: <p id="noteGroupP">All</p></button>
        <button type="submit" form="form" id="noteSubmit">Task it!</button>
      </section>

      <div id="groupPopup">
        <button class="group-btns">All</button>
        <button class="group-btns">Work</button>
        <button class="group-btns">Personal</button>
      </div>

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
    <h3>Group</h3>
    <div id="groupBtnsDiv">
    <input type="radio" name="group" id="AllBtn" class="groupBtns" checked>
    <label for="AllBtn" class="btnShadow groupLabels">All</label>
  
    <input type="radio" name="group" id="PersonalBtn" class="groupBtns">
    <label for="PersonalBtn" class="btnShadow groupLabels">Personal</label>
  
    <input type="radio" name="group" id="WorkBtn" class="groupBtns">
    <label for="WorkBtn" class="btnShadow groupLabels">Work</label>
    </div>
  </div>`,
  };

  return { formSubmit, linksHandler, tutorialCard };
};

export { domMgr, eventHandlers, actions };
