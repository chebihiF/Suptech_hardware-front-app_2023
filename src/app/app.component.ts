import { Component, OnInit } from '@angular/core';
import { ServerService } from './service/server.service';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import { AppState } from './interface/app-state';
import { CustomResponse } from './interface/custom-response';
import { DataState } from './enum/data.state.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  appState$?: Observable<AppState<CustomResponse>>

  constructor(private serverService: ServerService){}

  ngOnInit(): void {

    console.log("hello from AppComponent")

    this.appState$ = this.serverService.servers$.
    pipe(
      map(response => {
        console.log(response)
        return { dataState: DataState.LOADED, appData: response }
      }),
      startWith({dataState: DataState.LOADING}),
      catchError((error: string) => {
        return of({dataState: DataState.ERROR, error})
      })
    )
  }

}
