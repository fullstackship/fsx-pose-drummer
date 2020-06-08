import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, Subject } from 'rxjs'
import { Router } from '@angular/router'
import { environment } from '@environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.baseUrl
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }
  private isAuthenticated = false
  private token: string
  private tokenTimer: any
  private userId: string
  private authStatusListener = new Subject<boolean>()

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token
  }

  getIsAuth() {
    return this.isAuthenticated
  }

  getUserId() {
    return this.userId
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable()
  }

  signUp(formData) {
    return this.http
      .post(this.baseUrl + '/auth/local/local-user-signup', formData)
      .subscribe(
        () => {
          this.router.navigate(['/'])
        },
        (error) => {
          this.authStatusListener.next(false)
        }
      )
  }

  signIn(formData) {

    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(this.baseUrl + '/auth/local/local-user-signin', formData)
      .subscribe(
        (response) => {
          const token = response.token
          this.token = token
          if (token) {
            const expiresInDuration = response.expiresIn
            this.setAuthTimer(expiresInDuration)
            this.isAuthenticated = true
            this.userId = response.userId
            this.authStatusListener.next(true)
            const now = new Date()
            // TODO: fix expiresInDuration
            const expirationDate = new Date(now.getTime() + 3600 * 1000)
            this.saveAuthData(token, expirationDate, this.userId)
            this.router.navigate(['/'])
          }
        },
        (error) => {
          this.authStatusListener.next(false)
        }
      )
    console.groupEnd()
  }

  socialLogined(token: string, expiresIn: string, userId: string) {
    this.token = token
    const expiresInDuration = expiresIn
    this.setAuthTimer(+expiresInDuration) // instead of parseInt
    this.isAuthenticated = true
    this.userId = userId
    this.authStatusListener.next(true)
    const now = new Date()
    // TODO: fix expiresInDuration
    const expirationDate = new Date(now.getTime() + 3600 * 1000)
    this.saveAuthData(token, expirationDate, this.userId)
    this.router.navigate(['/'])
  }

  // TODO : cachedRequests, collectFailedRequest, retryFailedRequests

  autoAuthUser() {
    const authInformation = this.getAuthData()
    if (!authInformation) {
      return
    }
    const now = new Date()
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime()

    if (expiresIn > 0) {
      this.token = authInformation.token
      this.isAuthenticated = true
      this.userId = authInformation.userId
      this.setAuthTimer(expiresIn / 1000)
      this.authStatusListener.next(true)
    }

  }

  logout() {
    this.token = null
    this.isAuthenticated = false
    this.authStatusListener.next(false)
    this.userId = null
    clearTimeout(this.tokenTimer)
    this.clearAuthData()
    this.router.navigate(['/'])
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      //this.logout()
    }, duration * 1000)
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {


    localStorage.setItem('token', token)
    localStorage.setItem('expiration', expirationDate.toISOString())
    localStorage.setItem('userId', userId)
  }

  private clearAuthData() {


    localStorage.removeItem('token')
    localStorage.removeItem('expiration')
    localStorage.removeItem('userId')
  }

  private getAuthData() {


    const token = localStorage.getItem('token')
    const expirationDate = localStorage.getItem('expiration')
    const userId = localStorage.getItem('userId')
    if (!token || !expirationDate) {
      return
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
