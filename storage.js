// storage.js
const storage = {
  localArrays: (() => {
    let notePool = [];
    let trashPool = [];
    return { notePool, trashPool };
  })(),

  get localStorage() {
    if (localStorage.getItem("notePool") !== null) {
      let data = localStorage.getItem("notePool");
      //get localStorage item "localContent" (which is a string)

      return JSON.parse(data);
      //parses (de-strings) library and returns
    } else return null;
  },

  set localStorage(to_be_stringified_notePool) {
    localStorage.setItem(
      "notePool",
      JSON.stringify(to_be_stringified_notePool)
    );
  },

  get trash() {
    if (localStorage.getItem("trash") !== null) {
      let data = localStorage.getItem("trash");
      //get localStorage item "trash" (which is a string)

      return JSON.parse(data);
      //parses (de-strings) array and returns
    } else return null;
  },

  set trash(to_be_stringified_trashPool) {
    localStorage.setItem("trash", JSON.stringify(to_be_stringified_trashPool));
  },

  clear: () => {
    return localStorage.clear();
  },
};

export default storage;
