
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class AppThemeSwitcherService {
  previousClass = '';
  initialClass = 'custom-material-dark-theme';
  colorClass$: BehaviorSubject<string> = new BehaviorSubject(this.initialClass);
  constructor(private overlayContainer: OverlayContainer) {
    const storageClass = localStorage.getItem('theme-switcher');
    //console.log("storageClass: ", storageClass);

    const classList = this.overlayContainer.getContainerElement().classList;


   // console.log(" this.previousClass: ", this.previousClass);
   // console.log("classList: ", classList);

    if (storageClass) {
      classList.add(storageClass);
      this.colorClass$.next(storageClass);
    } else {
      classList.add(this.initialClass);
      this.colorClass$.next(this.initialClass);
      localStorage.setItem('theme-switcher', this.initialClass);
    }
  }
  getColorClass() {
    //console.log("getColorClass()");
    return this.colorClass$;
  }
  setColorClass(className: string) {
    //console.log("setColorClass(): ", className);
    // TODO: mouse cursor issue
    // this.overlayContainer.getContainerElement().classList.forEach(css => {
    //   console.log("classList: ", css);
    //   this.overlayContainer.getContainerElement().classList.remove(css);
    // });
    // this.overlayContainer.getContainerElement().classList.add(className);


    const classList = this.overlayContainer.getContainerElement().classList;
    //console.log("classList: ", classList);
    //console.log(" this.previousClass: ", this.previousClass);
    if (classList.contains(this.previousClass)) {
      classList.replace(this.previousClass, className);
    } else {
      classList.add(className);
    }
    this.previousClass = className;


    this.colorClass$.next(className);
    localStorage.setItem('theme-switcher', className);
  }
}
