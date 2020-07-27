import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { map, retry, catchError } from "rxjs/operators";
import { throwError } from 'rxjs'

@Injectable({
  providedIn: "root"
})
export class RolesService {
  constructor(private httpclient: HttpClient) { }

  getAll() {
    const url = `${environment.UrlBase}roles`
    return this.httpclient.get(url).pipe(retry(3), catchError(this.handleError))
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
 