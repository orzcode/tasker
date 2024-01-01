import { actions, eventHandlers } from "./dom.js";
import storage from "./storage.js";
import cardManager from "./cardManager.js";

//storage.clear;
// - used to clear localstorage

//Note: color icon css and card JS exists, but is 'display: none'd in cardManager

const firstLoad = (() => {
  storage.localArrays.notePool = storage.localStorage || [];

  storage.localArrays.trashPool = storage.trash || [];

  eventHandlers().formHandler();
  eventHandlers().dialogHandler();
  eventHandlers().popupHandler();
  eventHandlers().priorityHandler().formOrModalClickEvent("form");

  actions().linksHandler();
  //appends navbar link actions

  //actions().tutorialCard();
  //Tutorial card paused while bugfixing
  //issue is with tutorial function's calling of localstorage
  //may be able to fix by adding if check to the get/set localstorage functions
  //e.g if tutorialkey, do this. If notepool, do that.

  cardManager().renderCards("formDiv");
})();