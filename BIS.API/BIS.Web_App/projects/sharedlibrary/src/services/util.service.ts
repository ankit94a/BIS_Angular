import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { Address } from './model/address';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class UtilService {


  stringEnumToKeyValue(stringEnum) {

    const keyValue = [];
    const keys = Object.keys(stringEnum);


    for (const k of keys) {
      keyValue.push({ key: k, value: stringEnum[k] });
    }

    return keyValue;
  }

  chunk(arr, chunkSize) {

    var R = [];
    for (var i = 0, len = arr.length; i < len; i += chunkSize)
      R.push(arr.slice(i, i + chunkSize));
    return R;
  }
  distinct(items, mapper) {
    if (!mapper) mapper = (item) => item;
    return items.map(mapper).reduce((acc, item) => {
      if (acc.indexOf(item) === -1) acc.push(item);
      return acc;
    }, []);
  }



  removeByIndex(myArray, index) {
    return myArray.splice(index, 1);
  }
  removeByValue(myArray, value) {
    const index: number = myArray.indexOf(value);
    return myArray.splice(index, 1);
  }
  removeByObject(myArray, obj) {
    return myArray.filter(item => item !== obj);
  }
  removebyId(myArray, id) {
    return myArray.filter(item => item.id !== id);
  }
  // resetAddress(dataObject) {
    
  //   if (dataObject.billingAddress == undefined) {
  //     dataObject.billingAddress = new Address();
  //   }
  //   if (dataObject.shippingAddress == undefined) {
  //     dataObject.shippingAddress = new Address();
  //   }
  //   if (dataObject.registeredAddress == undefined) {
  //     dataObject.registeredAddress = new Address();
  //   }
  //   if (dataObject.address == undefined) {
  //     dataObject.address = new Address();
  //   }
  //   if (dataObject.credentialsObj == undefined) {
  //     dataObject.credentialsObj = {};
  //   }
  //   if (dataObject.credentials == undefined) {
  //     dataObject.credentials = {};
  //   }
  // }
  
  public static groupBy(array, f) {
    let groups = {};
    array.forEach(function (o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
 return Object.keys(groups).map(function (group) {
   return groups[group];
 })
}
}