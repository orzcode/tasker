import { actions, eventHandlers } from "./dom.js";
import storage from "./storage.js";
import cardManager from "./cardManager.js";

//storage.clear;

const firstLoad = (() => {
  storage.localArrays.notePool = storage.localStorage || [];

  storage.localArrays.trashPool = storage.trash || [];

  eventHandlers();

  actions().linksHandler();
  //appends navbar link actions

  cardManager().renderCards(storage.localArrays.notePool);
})();
