import { actions, eventHandlers } from "./dom.js";
import storage from "./storage.js";
import cardManager from "./cardManager.js";

//storage.clear;

document.addEventListener("DOMContentLoaded", (event) => {
  firstLoad();
});

const firstLoad = () => {
  storage.localArrays.notePool = storage.localStorage || [];

  storage.localArrays.trashPool = storage.trash || [];

  eventHandlers().formHandler();

  actions().linksHandler();
  //appends navbar link actions

  cardManager().renderCards("formDiv");
};
