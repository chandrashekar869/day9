import { Component ,ViewChild,ElementRef, AfterViewInit} from '@angular/core';
import {Observable,of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {FormControl} from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
  @ViewChild('datain') data:ElementRef;
  title = 'app';
  a=5;
  b=6;
  inputData:string;
  time:any;
  form:FormControl;
  ngAfterViewInit(){
    const backspace=8;
    const subscription=this.listenToInput(this.data.nativeElement,'keydown')
    .subscribe((e:KeyboardEvent)=>{
      if(e.keyCode==backspace){
        this.inputData="";
      }
    });
  }
  constructor(public http:HttpClient){
    this.form=new FormControl('');
    this.form.valueChanges.forEach(
      (value:string)=>{console.log(value);}
    )
  this.time=new Observable(observer=>{
      setInterval(()=>{
        observer.next(new Date().toString());
      },1000);
  })
 /*   const observable=of(1,2,4,6,7,8,9);
    observable.subscribe(
      x=>{console.log(x);},
      err=>{console.log(err);},
      ()=>{console.log("completed");}
    );
  let customObservable=new Observable(this.observerableParam);
  customObservable.subscribe(
    x=>{console.log(x);},
    err=>{console.log(err);},
    ()=>{console.log("completed custom observable")}
  );*/
  let multiSubscriberObservable=new Observable(this.multiSubscriber);
  multiSubscriberObservable.subscribe({next(val){
    console.log("1st subscriber",val);
  },
  complete(){
    console.log("Subscriber 1 completed");
  }
  });
  setTimeout(()=>{
    multiSubscriberObservable.subscribe({next(val){
      console.log("2nd subscriber",val);
    },
    complete(){
      console.log("Subscriber 2 completed");
    }
    });
  },2000);
  
  }

  observerableParam(observer){
    observer.next(1);
    observer.next(2);
    observer.next(3);
    observer.next(4);
    observer.next(5);
    observer.next(6);
    observer.complete();
    return {unsubscribe(){}};
  }


  listenToInput(target,eventName){
    return new Observable((observer)=>{
      const handler=(e)=>observer.next(e);
      target.addEventListener(eventName,handler);
      return()=>{
        target.removeEventListener(eventName,handler);
      }
    });
  }

  multiSubscriber(observer){
    const arrOfNum=[1,2,3,4,5];
    let timeoutRef;
    function printEachInSequence(arr,index){
      timeoutRef=setTimeout(()=>{
        observer.next(arr[index]);
        if(index==arrOfNum.length-1){
          observer.complete();
        }
        else
        printEachInSequence(arr,++index);
      },1000);
    }
    printEachInSequence(arrOfNum,0);
    return{
      unsubscribe(){
        clearTimeout(timeoutRef);
      }
    };
   
  }
}

