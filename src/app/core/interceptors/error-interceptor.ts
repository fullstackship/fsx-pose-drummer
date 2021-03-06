import { Injectable } from '@angular/core'
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http'
import { MatDialog } from '@angular/material'
import { throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { ErrorComponent } from '@shared/components/error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
	constructor(private dialog: MatDialog) {}

	intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('ErrorInterceptr#intercept')
		return next.handle(req).pipe(
			catchError((error: HttpErrorResponse) => {
				// console.log('---> HttpErrorResponse: ', error)
				let errorMessage = 'An unknown error occurred!'
				if (error.error.message) {
					errorMessage = error.error.message
				}
				this.dialog.open(ErrorComponent, { data: { message: errorMessage } })
				// this.errorService.throwError(errorMessage);
				return throwError(error)
			})
		)
	}
}
