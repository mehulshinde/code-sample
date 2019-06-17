import { Injectable, NgModule } from '@angular/core';
import { Menu } from '../interfaces/menu';

import * as $ from 'jquery';

@Injectable({
  providedIn: 'root'
})

export class PopulateMenuService {

  public menus: Menu[] = [];
  public menuItems: string[] = [];
  public menuJSON: JSON;
  constructor() {}
  /**
   * Receives menu JSON from server and initializes the menuJSON object
   */
  getJSON(menuJSON) {
    this.menuJSON = menuJSON;
    this.menuJSON = $.extend({}, this.menuJSON);
   }

  /**
   * !!! This method is not being used, kept in case of future need
   * Generates 'Menus' from json and populates their list of contents
   */
  setMenuItems() {
    var menuObj =Object.create({id:'', level:'', items: []});
    //Populate top level menu items i.e. Unit 1, Unit 2...
    menuObj.id = 'home';
    menuObj.level = '1';
    var newObj = Object.create(this.menuJSON);
    for(var k in this.menuJSON) {
      menuObj.items.push(k);
    }
    this.menus.push(menuObj);
    //Populating level 2 menu items i.e. Disection Guide etc.
    var i=-1;
    for(let k in this.menuJSON) {
      menuObj =Object.create({id:'', level:'', items: []});
      i++;
      menuObj.id = k;
      menuObj.level = '2';
      for(var j in Object.values(this.menuJSON)[i]) {
          menuObj.items.push(j);
      }
      this.menus.push(menuObj);
    }
    //Populating level 3 menu items i.e. pdfs and ppts
    i=-1;
    for(let k in this.menuJSON) {
      i++;
      var i1=-1;
      for(var j in Object.values(this.menuJSON)[i]) {
        menuObj =Object.create({id:'', level:'', items: []});
        i1++;
          menuObj.id = j;
          menuObj.level = '3';
          for(let k1 in Object.values(this.menuJSON)[i][j]) {
            menuObj.items.push(k1);
          } 
          this.menus.push(menuObj);
      }
    }
  }

  /**
   * Returns menu items under a given 'item'. Returns 'null' if a given item has URL to a doc, video etc.
   * @param item the item to find menu items for
   * @param navStack a stack for navigation
   */
  getMenuItems(item, navStack) {
    var obj = this.getObjectOfMenuItem(item, navStack);
    console.log("OBJ:",obj);
    console.log("ITEM:",item);
    if(item === 'home' || item === 'interactive')     { return Object.getOwnPropertyNames(obj); }
    var items = Object.getOwnPropertyNames(obj[item]);
    if (this.itemContainsURL(items)) { return null;}
    return this.refineItemsArray(items);
  }


  /**
   * Returns an object of the desired menu item for further use
   * @param item the item who's object is wanted
   * @param navStack a stack for navigation
   */
  getObjectOfMenuItem(item, navStack) {
  var obj = (this.menuJSON);
  console.log(this.menuJSON);
  for (let i = 0 ; i < navStack.length ; i++) {
    obj = obj[navStack[i]];
  }
  return obj;
  }


  /**
   * Returns wheather or not a menu item contains or is a url 
   * @param items sub-items under an item
   */
  itemContainsURL(items) {
    for(var i =0; i < items.length ; i++) { 
      if (items[i] === 'url') {return true;}
    }
    return false;
  }


  /**
   * Returns the url of the given item
   * @param item the item who's url is wanted
   * @param navStack a stack for navigation
   */
  getURL(item, navStack) {
    var obj = this.getObjectOfMenuItem(item, navStack);
    return ("https://anatomy-dev.cvm.iastate.edu"+obj[item]['url']);
  }


  /**
   * Removes elements such as 'type', 'length', 'name' from the array of items
   * @param items 
   */
  refineItemsArray(items) {
    var index = items.indexOf('name', 0);
    if (index > -1) { items.splice(index, 1); }
    index = items.indexOf('type', 0);
    if (index > -1) { items.splice(index, 1); }
    index = items.indexOf('length', 0);
    if (index > -1) { items.splice(index, 1); }

    if(items=={}) {
      var empty_items = [];
      empty_items.push(' ');
    }
    else {
      return items;
    }

  }
}