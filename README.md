To use of set of rxjs operators we should use pipe method which is provided by observable. Pipe can receive n operators. Inside pipe we can have chaining of operators. 
‘Tap’ operator can handle 3 cases. First case if we want to console the data. The first case is used for logging purpose. 

ofObservable: Observable<any> = of(1, 2, 3, 4);
constructor() {
let isEven = false;
this.ofObservable.pipe(tap((value: any) => {
console.log("Logging", value);
isEven = value %2 ===0;
})).subscribe((result: any) => {
console.log("Result", result);
console.log("isEven", isEven);
})
}


‘isEven = value %2 ===0’ this line of code will return true for subscription where value is multiple of 2. If multiple of 2 isEven return true.Used to catch a set of values (here isEven) , the value to catch isEven when vlaue multiple of 2.

Second case of tap which can be handled is asynchronous calls.In the code below for each subscription need to get value from api call.

ofObservable: Observable<any> = of(1, 2, 3, 4);
http: HttpClient = inject(HttpClient);
constructor() {
this.ofObservable.pipe(tap((value: any) => {
this.http.get(`https://jsonplaceholder.typicode.com/todos/${value}`).subscribe((data:any)=>{
console.log("Data", data);
}); 
})).subscribe((result: any) => {
console.log("result", result);
})
}



Output:-


Data {userId: 1, id: 1, title: 'delectus aut autem', completed: false}
Data {userId: 1, id: 2, title: 'quis ut nam facilis et officia qui', completed: false}
Data {userId: 1, id: 3, title: 'fugiat veniam minus', completed: false}
Data {userId: 1, id: 4, title: 'et porro tempora', completed: true}



Tap operator cannot return any value and the value obtained in the subscription inside tap will not be captured to the next operators.

Second subscription (shown below: extracted from above code)  does not get the value of asynchronous call made in tap operator

.subscribe((result: any) => {
console.log("result", result);
})


‘Filter’ operator is used for decision making. Filter operator is expected to always return true or false. If ‘filter’ operator returns true it will continue for the next operator and to the subscription. If ‘filter’ operator returns false, it will stop executing.


ofObservable: Observable<any> = of(1, 2, 3, 4);
http: HttpClient = inject(HttpClient);
constructor() {
this.ofObservable.pipe(tap((value: any) => {
this.http.get(`https://jsonplaceholder.typicode.com/todos/${value}`).subscribe((data:any)=>{
console.log("Data", data);
}); 
}),
filter((data:number)=>{
console.log("Filter operator value", data);
return true;
})
).subscribe((result: any) => {
console.log("Result", result);
})
}
}


Output

Filter operator value 1
 Result 1
 Filter operator value 2
 Result 2
Filter operator value 3
 Result 3
Filter operator value 4
 Result 4

Tap would not return api response values to filter instead the filter is printing the ‘ofObservable’ variable value. Filter operator is consoling the ‘ofObservable’ variable value because filter is returning true and the second subscrition console values are also printed along with filter console
Tap is working on asynchronous data (i.e independent data) and the data in tap should not be  dependent on other operators in the pipe.Tap is called when you want to call api call independent of the main subscription. Tap is unpreferred on asynchronous data. Tap is mainly used for caching and consoling. Tap is used for 3 purposes they are to store the values in some other variables, secondly used for consoling purpose, thirdly for asynchronous data.
ofObservable: Observable<any> = of(1, 2, 3, 4);
constructor() {
let isEven = false;
this.ofObservable.pipe(tap((value: any) => {
isEven = value %2 === 0;
}),
filter((data:number)=>{
console.log("Filter operator value", data);
return isEven;
})
).subscribe((result: any) => {
console.log("Result", result);
})
}


In the above code ‘isEven’ is true only its a divisible by 2 , so the main subscribe (i.e. second subscribe) will be executed only if filter returns true (i.e if isEven is true when the ofObservable is having numbers divisible by 2). So the ouput will be as follows.


Output

Filter operator value 1
Filter operator value 2
 Result 2
 Filter operator value 3
Filter operator value 4
 Result 4




In the code below we have added 3 operators in pipe.  Map operator will receive the values   from filter operator where ‘isEven’ is true (values from ofObservable which is divisible by 2)  . Map operator multiplies values (obtained from filteroperator that is from  ofObservable which is divisible by 2) by 5
From ofObservable (ofObservable: Observable<any> = of(1, 2, 3, 4)  ) takes value 2 and 4 and multiplies with 5 and skips value 1 and 3.


ofObservable: Observable<any> = of(1, 2, 3, 4);
constructor() {
let isEven = false;
this.ofObservable.pipe(tap((value: any) => {
isEven = value %2 === 0;
}),
filter((data:number)=>{
console.log("Filter operator value", data);
return isEven;
}),
map((filterVal
:number)=>{
return filterVal
 * 5;
})
).subscribe((result: any) => {
console.log("Result", result);
})
}
}



So, the ouput will be as follows


Filter operator value 1
Filter operator value 2
Result 10
Filter operator value 3
Filter operator value 4
 Result 20



This is the main advantage of Observable, before subscribe we can perform various data operation. The benefit of performing operation on data before subscribing in Observable is only the required data will be available in the subscribe. While, in promise data operation can be performed only after ‘then’. 



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




In the below extracted code from above code:-


const index = list.findIndex((obj: any) => obj.id === 2);
return index !== -1;

 There is a index with id = 2 and we are checking if index with id = 2 doesnt exist in the api call value but id with 2 exist in the api call it returns true. (  return index !== -1;  ). Since it is true because there are 200 records hence subscribe works


In the below code we extract this 

const index = list.findIndex((obj: any) => obj.id === -1);
return index !== -1;
})


we are checking for record data where id doesnt exist. Since for every object value id exist and returns false for this (  return index !== -1  ) main subscribe doesnt work and the console in the main subscribe will not give console.


constructor() {
this.http.get(`https://jsonplaceholder.typicode.com/todos`).pipe(
filter((list: any) => {
const index = list.findIndex((obj: any) => obj.id === -1);
return index !== -1;
})
).subscribe((result: any) => {
console.log("Result", result);
})
}


Filter are used when you want to check a condition and with the condition you want to proceed furtherand execute the logic then we use filter.