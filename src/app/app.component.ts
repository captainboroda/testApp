import {Component, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import { EventEmitter } from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {catchError, debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'testApp';

  public form: FormControl = new FormControl();
  public list: string[]  | any[] = [];
  @Output() public onSelect = new EventEmitter();

  constructor(private httpClient: HttpClient) {
    this.form.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(500),
        switchMap((search: string) => this.getList(search)),
        catchError(() => of([]))
      )
      .subscribe((list) => this.list =list)
  }

  public getList(query: string): Observable<string[]> {
    const params = new HttpParams();
    if (query) {
      params.append('q', query)
    }
    return this.httpClient.get<string[]>('https://example.com/api/items', { params });
  }
}
