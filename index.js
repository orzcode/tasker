import { actions, eventHandlers } from "./dom.js";
import storage from "./storage.js";
import cardManager from "./cardManager.js";

//storage.clear;


const firstLoad = (() => {
  storage.localArrays.notePool = storage.localStorage || [];

  storage.localArrays.trashPool = storage.trash || [];

  eventHandlers().formHandler();
  eventHandlers().dialogHandler();

  actions().linksHandler();
  //appends navbar link actions

  cardManager().renderCards("formDiv");
})();

// Get the modal
var modal = document.querySelector("#groupPopup");

// Get the button that opens the modal
var btn = document.querySelector("#noteGroupButton");

// Get the <span> element that closes the modal
//var span = document.getElementsByClassName("close")[0];
console.log(document.querySelector("#noteSubmit"))
// When the user clicks on the button, open the modal
//btn.addEventListener("click", () => fuck());
 
function fuck() {
  document.querySelector("#groupPopup").style.display = "block";
}
window.fuck = fuck

// When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//   modal.style.display = "none";
// }

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}