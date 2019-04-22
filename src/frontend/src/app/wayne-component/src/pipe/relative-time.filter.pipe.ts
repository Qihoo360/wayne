import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime'
})

export class RelativeTimeFilterPipe implements PipeTransform {

  transform(inputDate: string): string {
    const current = new Date().valueOf();
    const input = new Date(inputDate).valueOf();
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = current - input;

    if (elapsed < msPerMinute) {
      return Math.floor(elapsed / 1000) + 's';
    } else if (elapsed < msPerHour) {
      return Math.floor(elapsed / msPerMinute) + 'm';
    } else if (elapsed < msPerDay) {
      return Math.floor(elapsed / msPerHour) + 'h';
    } else if (elapsed < msPerYear) {
      return Math.floor(elapsed / msPerDay) + 'd';
    } else {
      return Math.floor(elapsed / msPerYear) + 'y';
    }

  }
}
