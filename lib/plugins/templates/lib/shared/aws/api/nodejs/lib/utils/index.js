'use strict';

import * as _ from 'lodash';

const mergeByProperty = (arr1, arr2, prop) => {
  _.each(arr2, (arr2obj) => {
    const arr1obj = _.find(arr1, (arr1obj) => {
      return arr1obj[prop] === arr2obj[prop];
    });

    arr1obj ? _.extend(arr1obj, arr2obj) : arr1.push(arr2obj);
  });
};

export { mergeByProperty };
