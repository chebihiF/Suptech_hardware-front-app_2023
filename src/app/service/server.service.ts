import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomResponse } from '../interface/custom-response';
import { Observable, Subscriber, catchError, tap, throwError } from 'rxjs';
import { Server } from '../interface/server';
import { Status } from '../enum/status.enum';

@Injectable({
  providedIn: 'root'
})
export class ServerService {


  private readonly myApiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  servers$ = <Observable<CustomResponse>>
  this.http.get<CustomResponse>(`${this.myApiUrl}/server/list`)
  .pipe(
  tap(console.log),
  catchError(this.handleError)
  )

  server$ = (server: Server) => <Observable<CustomResponse>>
  this.http.post<CustomResponse>(`${this.myApiUrl}/server/save`, server)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  )

  ping$ = (ipAddress: string) => <Observable<CustomResponse>>
  this.http.get<CustomResponse>(`${this.myApiUrl}/server/ping/${ipAddress}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  )

  delete$ = (serverId: number) => <Observable<CustomResponse>>
  this.http.delete<CustomResponse>(`${this.myApiUrl}/server/delete/${serverId}`)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  )

  filter$ = (status: Status, response: CustomResponse) => <Observable<CustomResponse>>
  new Observable<CustomResponse>(
    subscriber => {
      console.log(response)
      subscriber.next(
        status === Status.ALL ? {...response, message: `Servers filtred by ${status} status`} :
        {
          ...response,
          message: response.data.servers!.filter(server => server.status === status).length > 0 ? `Servers filtred by
          ${status === Status.SERVER_UP ? ' SERVER UP' : 'SERVER DOWN'} status` : `No servers of ${status} found`,
          data: {
            servers : response.data.servers?.filter(server => server.status === status)
          }
        }
      )
    }
  )

  handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error)
    throw throwError(`An error occurred - Error code : ${error.status}`);
  }
}
