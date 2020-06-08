import { Injectable } from '@angular/core'
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http'
import { Observable } from 'rxjs'
import { AuthService } from '@core/services/rest/auth.service';

/**
 * TokenInterceptor
 * @implements {HttpInterceptor}
 * - Using interceptors is all about changing outgoing requests and incoming responses,
 *   but we can’t tamper with the original request–it needs to be immutable.
 *   To make changes we need to clone the original request.
 * - The interceptor needs to be added to the HTTP_INTERCEPTORS in the providers array
 *
 * {@link https://angular.io/guide/http#intercepting-requests-and-responses }
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(private authService: AuthService) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.group('AuthInterceptor#intercept')
		const headersConfig = {
			// 'Content-Type': 'application/json',
			// accept: 'application/json'
		}
    const token = this.authService.getToken()
		if (token) {
			headersConfig['Authorization'] = `bearer ${token}`
		}
    const request = req.clone({ setHeaders: headersConfig })
    // Calling next.handle means that we are passing control
    // to the next interceptor in the chain, if there is one.
		return next.handle(request)
	}
}
