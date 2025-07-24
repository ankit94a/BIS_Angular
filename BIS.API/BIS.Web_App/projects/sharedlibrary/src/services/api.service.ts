import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { catchError, EMPTY, map, Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  private modelUrl = environment.modelUrl
  constructor(private http: HttpClient,private toastr:ToastrService) { }

  getWithHeaders(url: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${url}`).pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
      }),
      catchError((error) => {
        this.showError(error);
        return of(null);
      })
    );
  }


  postWithHeader(url: string, Data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}` + url, Data).pipe(map(
      (res: any) => {
        if (res) {
          return res;
        }
      }), catchError(
        (error: any) => {
          return this.showError(error);
        }
      ))
  }
    modelApiCall(url: string, Data: any): Observable<any> {
    return this.http.post(`${this.modelUrl}` + url, Data).pipe(map(
      (res: any) => {
        if (res) {
          return res;
        }
      }), catchError(
        (error: any) => {
          return this.showError(error);
        }
      ))
  }
  putWithHeader(url: string, Data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}` + url, Data).pipe(map(
      (res: any) => {
        if (res) {
          return res;
        }
      }), catchError(
        (error: any) => {

          return this.showError(error);
        }
      ))
  }

  deleteWithHeaders(url: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}` + url).pipe(map(
      (res: any) => {
        if (res) {
          return res;
        }
      }), catchError(
        (error: any) => {
          return this.showError(error);
        }
      ))
  }

  public showError(error: any): Observable<any> {
    if (error.status === 401 || error.status === 0) {

    }
    else if (error.status === 500) {
      this.toastr.error( "error");
    }
    else if (error.status === 400 || error.status === 404 || error.status === 403) {
      if (error.error != null && (typeof error.error === 'string' || error.error instanceof String)) {
        this.toastr.error(error.error.toString(), "error");
      }
      else if (error.error != null && (typeof error.error === 'object' || error.constructor == Object)) {
        this.toastr.error(error.error.title.toString(), "error");
      }

    }

    return EMPTY;
  }
}
