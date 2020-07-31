import { Injectable } from '@angular/core';
import { timer, Subject, Observable } from 'rxjs';
import { takeWhile, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountdownService {

  private isWorking = false;
  private countDown = new Subject<number>();

  public getCountDown$(): Observable<number> {
    return this.countDown.asObservable();
  }

  startCountDown(countTime: number): void {
    if (!this.isWorking) {
      this.isWorking = true;
      timer(0, 1000).pipe(
        takeWhile(t => t <= countTime),
        map(t => countTime - t)
      ).subscribe(
        t => this.countDown.next(t),
        null,
        () => {
          this.countDown.complete();
          this.isWorking = false;
          this.countDown = new Subject<number>();
        }
      );
    }
  }
}
