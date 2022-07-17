import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import {
  HttpHeaders,
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { Subscribable } from 'rxjs';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';

const baseUrl = 'https://api.github.com';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  private token;

  constructor(protected http: HttpClient) {}

  getHeaders() {
    this.headers = new HttpHeaders();
    //add personal access token for auth if needed
    this.token = '';
    if (this.token && this.token.length) {
      this.headers = this.headers.append(
        'Authorization',
        `Bearer ${this.token}`
      );
    }
    return this.headers;
  }

  errorHandler(res: HttpErrorResponse) {
    const errorMessage =
      res && res.error && res.error.message
        ? res.error.message
        : 'SOMETHING HAS GONE WRONG !';
    console.log('Error', errorMessage);
    if (res.status === 401) {
      return Promise.reject(res.message);
    } else if (res.error && res.status !== 200) {
      return Promise.reject(res.error.message);
    } else if (res.status !== 200) {
      return Promise.reject(res.message);
    }
    return Promise.reject(res.message);
  }

  get(url, params = new HttpParams(), additionalHeaders?: any): Promise<any> {
    const headers = this.getHeaders();
    return this.http
      .get(`${baseUrl}/${url}`, { headers, params })
      .toPromise()
      .catch(this.errorHandler.bind(this));
  }

  getUsers(): Promise<any> {
    return this.http
      .get(`${baseUrl}/gists/public`, { headers: this.getHeaders() })
      .toPromise()
      .catch(this.errorHandler.bind(this));
  }

  getUserList(username) {
    return this.http
      .get(`${baseUrl}/users/${username}/gists?per_page=100`, { headers: this.getHeaders() })
      .toPromise()
      .catch(this.errorHandler.bind(this));
  }

  getForKList(id) {
    return this.http
    .get(`${baseUrl}/gists/${id}/forks`, { headers: this.getHeaders() })
    .toPromise()
    .catch(this.errorHandler.bind(this));
  }
}
