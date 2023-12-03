import { actions, eventHandlers } from "./dom.js";
import storage from "./storage.js";
import cardManager from "./cardManager.js";

//storage.clear; - used to clear localstorage
//Note: color icon css and card JS exists, but is 'display: none'd in cardManager

const firstLoad = (() => {
  storage.localArrays.notePool = storage.localStorage || [];

  storage.localArrays.trashPool = storage.trash || [];

  eventHandlers().formHandler();
  eventHandlers().dialogHandler();
  eventHandlers().popupHandler();

  actions().linksHandler();
  //appends navbar link actions

  cardManager().renderCards("formDiv");
})();