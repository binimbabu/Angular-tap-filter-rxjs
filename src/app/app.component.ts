import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filter, tap, map } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  ofObservable: Observable<any> = of(1, 2, 3, 4);
  http: HttpClient = inject(HttpClient);
  // constructor() {
  //   let isEven = false;
  //   this.ofObservable.pipe(tap((value: any) => {
  //     console.log("Logging", value);
  //     isEven = value % 2 === 0;
  //   })).subscribe((result: any) => {
  //     console.log("Result", result);
  //     console.log("isEven", isEven);
  //   })
  // }

  // constructor() {
  //   let isEven = false;
  //   this.ofObservable.pipe(tap((value: any) => {
  //     isEven = value %2 === 0;
  //   }),
  // filter((data:number)=>{
  //   console.log("Filter operator value", data);
  //   return isEven;
  // }),
  // map((filterVal:number)=>{
  //   return filterVal * 5;
  // })
  // ).subscribe((result: any) => {
  //     console.log("Result", result);
  //   })
  // }



  constructor() {
    this.http.get(`https://jsonplaceholder.typicode.com/todos`).pipe(
      filter((list: any) => {
        const index = list.findIndex((obj: any) => obj.id === 2);
        return index !== -1;
      })
    ).subscribe((result: any) => {
      console.log("Result", result);
    })
  }

}
