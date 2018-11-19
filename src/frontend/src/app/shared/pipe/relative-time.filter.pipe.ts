import{PipeTransform,Pipe} from '@angular/core';

@Pipe({
  name:'relativeTime'
})

export class RelativeTimeFilterPipe implements PipeTransform{

  transform(inputDate:string):string{
    let current = new Date().valueOf();
    let input = new Date(inputDate).valueOf();
    let msPerMinute = 60 * 1000;
    let msPerHour = msPerMinute * 60;
    let msPerDay = msPerHour * 24;
    let msPerMonth = msPerDay * 30;
    let msPerYear = msPerDay * 365;

    let elapsed = current - input;

    if (elapsed < msPerMinute) {
      return Math.floor(elapsed / 1000) + 's';
    }

    else if (elapsed < msPerHour) {
      return Math.floor(elapsed / msPerMinute) + 'm';
    }

    else if (elapsed < msPerDay) {
      return Math.floor(elapsed / msPerHour) + 'h';
    }

    else if (elapsed < msPerYear) {
      return Math.floor(elapsed / msPerDay) + 'd';
    }
    else {
      return Math.floor(elapsed / msPerYear) + 'y';
    }

  }
}
