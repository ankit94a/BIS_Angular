import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeDifference'
})
export class TimeDifferencePipe implements PipeTransform {
  transform(value: string | Date): string {
    const now = new Date(); // Current time in local timezone
    const targetDate = new Date(value); // Target date in local timezone

    // Calculate the difference in milliseconds
    const offsetMs = 5 * 60 * 60 * 1000; 
    const diffMs = now.getTime() - targetDate.getTime() - offsetMs;

    // Convert difference to various time units
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);

    // Generate human-readable time difference
    if (seconds < 60) {
      return `now`;
    } else if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (days < 31) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      const remainingDays = days % 30;
      return `${months} month${months > 1 ? 's' : ''} ${remainingDays} day${remainingDays !== 1 ? 's' : ''} ago`;
    }
  }
}
