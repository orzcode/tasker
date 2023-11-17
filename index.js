//import { format } from "date-fns";
//import DOMPurify from "isomorphic-dompurify";
import { domMgr, eventHandlers } from "./dom.js";
import storage from "./storage.js";
import cardManager from "./cardManager.js";

//storage.clear;



const firstLoad = (() => {
  storage.localArrays.notePool = storage.localStorage || [];

  storage.localArrays.trashPool = storage.trash || [];

  eventHandlers()

  cardManager().renderCards(storage.localArrays.notePool);

  // console.log(storage.localArrays.notePool);
  // console.log(storage.localArrays.trashPool);
  // console.log(storage.localStorage);
  // console.log(storage.trash);
})();

const Manager = () => {
  //////////////////////////////////////////////
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

  //SCOPE / COMPILATION ISSUE WITH DOM-MGR TAGS
  function fadeCards(targetOpacity) {
    const notes = domMgr.getTags().notes;
    notes.forEach((note) => {
      note.style.opacity = targetOpacity;
    });
    console.log("fade cards executed");
  }

};