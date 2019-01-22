import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

/**
 * Utility class to not hardcode sort directions
 */
export class SortOptions {
  /**
   * Static property to defined ASC and DESC values
   * to avoid hardcoding and repeating
   * replaces string enums
   */
  static direction: {
    ASC: string,
    DESC: string
  } = {
    ASC: 'ASC',
    DESC: 'DESC'
  };
}

/**
 * Pipe used to sort arrays by using lodash
 * Takes array and array of 2 strings(parameters), key and direction
 * direction must be either ASC or DESC
 */
@Pipe({
  name: 'arraySort'
})
export class ArraySortPipe implements PipeTransform {

  transform(array: Array<{}>, args: string[]): Array<string> | Array<{}> {

    array = array || [];

    if (typeof args === 'undefined' || args.length !== 2) {
      return array;
    }

    const [key, direction] = args;

    if (direction !== SortOptions.direction.ASC && direction !== SortOptions.direction.DESC) {
      return array;
    }

    // if there is no key we assume item is of string type
    return _.orderBy(array, (item: {} | string) => item.hasOwnProperty(key) ? item[key] : item, direction.toLowerCase());
  }
}

/**
 * Pipe used to filter array, takes input array and
 * array of 2 arguments, key of object and search term
 * if key does not exist, pipe assumes the item is string
 */
@Pipe({
  name: 'arrayFilter'
})
export class ArrayFilterPipe implements PipeTransform {

  transform(array: Array<{}>, args: string[]): Array<string> | Array<{}> {

    array = array || [];

    if (typeof args === 'undefined' || args.length !== 2) {
      return array;
    }

    const [key, searchTerm] = args;

    if (searchTerm.trim() === '') {
      return array;
    }

    return array.filter((item: {}) => item[key].toString().toLowerCase().search(searchTerm.toLowerCase().trim()) >= 0);
  }
}
