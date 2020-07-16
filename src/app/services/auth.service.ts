import { Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { map, retry, catchError } from 'rxjs/operators'
import { throwError } from 'rxjs'



@Injectable()
export class AuthService {
  private apiUrl = `${environment.UrlBase}users`

  constructor(private http: HttpClient) {}

  login(email, password) {
    const url = `${this.apiUrl}/login`
    
    const body = {
      email,
      password
    }

		return this.http.post(url, body).pipe(
			catchError(this.handleError)
		)
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
		return throwError('Something bad happened; please try again later.')
	}

}
