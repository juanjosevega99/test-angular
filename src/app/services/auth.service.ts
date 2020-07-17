import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { map, retry, catchError } from 'rxjs/operators'
import { BehaviorSubject, Observable, throwError } from 'rxjs'
import { Users } from '../models/Users'


@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject: BehaviorSubject<Users>
  public currentUser: Observable<Users>

  private apiUrl = `${environment.UrlBase}users`

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<Users>(JSON.parse(localStorage.getItem('tifi_user')))
    this.currentUser = this.currentUserSubject.asObservable()
  }

  public get currentUserValue(): Users {
    return this.currentUserSubject.value
}

  login(email, password) {
    const url = `${this.apiUrl}/login`
    
    const body = {
      email,
      password
    }

		return this.http.post(url, body).pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem('tifi_user', JSON.stringify(user))
      this.currentUserSubject.next(user)
      return user
    }))
  }
  
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('tifi_user')
    this.currentUserSubject.next(null)
  }

  private handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.error.message)
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong,
			console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`)
		}
		// return an observable with a user-facing error message
		return throwError('Something bad happened please try again later.')
	}

}
