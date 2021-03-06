import { HttpClient, HttpContext, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})
export class WebService {
	header = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
			'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, Access-Control-Allow-Origin',
		}),
		withCredentials: true,
	};

	constructor(
		private http: HttpClient,
	) {
	}

	dataUrl = environment.apiUrl;

	initialPost(formdata: any, url: string, id?: string) {
		const header = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Access-Control-Allow-Origin': '*',
			}),
			withCredentials: true,
			observe: 'response' as 'response'
		};
		if (id) {
			return this.http.post(this.dataUrl + url + '/' + id, formdata, header)
				.pipe(
					catchError(error => this.handleError(error))
				);
		} else {
			return this.http.post(this.dataUrl + url, formdata)
				.pipe(
					catchError(error => this.handleError(error))
				);
		}
	}

	post(formdata: any, url: string, id?: string) {
		if (id) {
			return this.http.post(this.dataUrl + url + '/' + id, formdata, this.header)
				.pipe(
					catchError(error => this.handleError(error))
				);
		} else {
			return this.http.post(this.dataUrl + url, formdata)
				.pipe(
					catchError(error => this.handleError(error))
				);
		}
	}

	patch(formdata: any, id: string, url: string) {
		return this.http.patch(this.dataUrl + url + '/' + id, formdata, this.header)
			.pipe(
				catchError(error => this.handleError(error))
			);
	}

	get(url: string) {
		return this.http.get(this.dataUrl + url, this.header)
			.pipe(
				retry(3),
				catchError(error => this.handleError(error))
			);
	}

	delete(id: string, url: string, formData: any) {
		if (formData) {
			return this.http.delete(this.dataUrl + url, formData)
				.pipe(
					catchError(error => this.handleError(error))
				);
		} else {
			return this.http.delete(this.dataUrl + url + '/' + id)
				.pipe(
					catchError(error => this.handleError(error))
				);
		}
	}

	getBlobFromURL(url: string) {
		return this.http.get(url, { responseType: 'blob', observe: 'response' })
			.pipe(
				retry(3),
				catchError(error => this.handleError(error))
			);
	}

	private handleError(error: HttpErrorResponse) {
		return throwError(error?.error?.message);
	};
}
