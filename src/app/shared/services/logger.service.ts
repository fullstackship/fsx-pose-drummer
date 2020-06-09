import { ErrorHandler, Injectable } from '@angular/core';
import { environment } from '@environment';


@Injectable()
export class Logger {

  constructor(private errorHandler: ErrorHandler) { }

  log(value: any, ...rest: any[]) {
    if (!environment.production) {
      console.log(value, ...rest);
    }
  }

  trace(value: any, ...rest: any[]) {
    if (!environment.production) {
      console.trace(value, ...rest);
    }
  }

  error(error: Error) {
    this.errorHandler.handleError(error);
  }

  warn(value: any, ...rest: any[]) {
    console.warn(value, ...rest);
  }
}