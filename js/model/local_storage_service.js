/* Class LocalStorageService- a class for persistant CRUD in LocalStorage*/
export default class LocalStorageService {
  "use strict";
  constructor(data, key) {
    this.origModel = data;
    this.key = key;
    console.log("local storage constructor");
    //if data is NOT in local storage, init and sort using sortCol and sortDir from the model
    if (!this.retrieve()) {
      this.model = this.cloneObject(data); //get copy of data
      this.sort(this.sortCol, this.sortDir, true); //apply default sort
    }
  }
  //Getters
  get sortCol() {
    return this.model.app.sortCol;
  }
  set sortCol(col) {
    this.model.app.sortCol = col;
  }
  get sortDir() {
    return this.model.app.sortDir;
  }
  set sortDir(dir) {
    this.model.app.sortDir = dir;
  }
  get size() {
    //COMPLETE: should return the number of items in model.data
    return this.model.data.length;
  }
  get list() {
    //TODO: return the model.data array
    return this.model.data;
  }

  //CRUD FUNCTIONS
  create(obj) {
    //append new object to data store
    // persist in local storage by calling store()
    this.model.data.push(obj);

    this.store();
  }
  read(getId) {
    //returns the item in the array with id=getId, null if it is not found
    let index = this.getItemIndex(getId);
    if (index === -1) {
      return null;
    }
    return this.model.data[index];
  }
  update(obj) {
    //find index of object in array
    //update object with new contents
    // persist in local storage by calling store()
    let index = this.getItemIndex(obj.id);
    this.model.data[index] = obj;
    this.store();
  }

  delete(removeId) {
    //find index of object in array
    //remove object with specified id from model.data (splice?)
    // persist in local storage by calling store()
    this.model.data.splice(this.getItemIndex(removeId), 1);
    this.store();
  }

  //LocalStorage Functions
  reset() {
    //should clear local storage
    //should restore model from origModel
    //(use utility function 'cloneObject' at bottom of file)
    this.clear();
    this.model = this.cloneObject(this.origModel); //get copy of data
  }
  clear() {
    localStorage.clear();
  }
  store() {
    //store your model in localStorage
    localStorage.setItem(this.key, JSON.stringify(this.model));
  }
  retrieve() {
    let ret = localStorage.getItem(this.key);
    if (ret != null) {
      let obj = JSON.parse(ret);
      this.model = obj;
      return true;
    }

    return false;
  }

  //Sorting and Filtering Functions
  sort(col, direction, perm = false) {
    let sorted = this.cloneObject(this.model.data);
    sorted.sort((a, b) => {
      if (a[col] <= b[col]) {
        return direction === "asc" ? -1 : 1;
      } else {
        return direction === "asc" ? 1 : -1;
      }
    });
    if (perm) {
      this.model.data = sorted;
      this.model.app.sortCol = col;
      this.model.app.sortDir = direction;
      this.store();
    }
    return sorted;
  }

  filter(filterObj) {
    let result = this.model.data.filter((team) => {
      for (const key in filterObj) {
        if (!(team[key] === filterObj[key])) {
          return false;
        }
      }
      return true;
    });
    console.log(result);
    return result;
  }

  getItemIndex(id) {
    //return index of team with given id
    //see MDN array 'find' documentation
    //created separate function for this since multiple methods need to get the index of an item
    return this.model.data.findIndex((team) => team.id == id);
  }
  cloneObject(obj) {
    //util function for returning a copy of an object
    return JSON.parse(JSON.stringify(obj)); //giving you this one as of class on Feb 4
  }
}
