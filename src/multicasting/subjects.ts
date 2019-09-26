/**
 * ? SUBJECTS
 * * every subject is an OBSERVER and an OBSERVABLE
 * * allows multicasting to many observers
 * */
import { Subject, timer} from "rxjs";
import {take, takeWhile, tap} from "rxjs/operators";

export function SubjectAsObservableExample() {
    const subject = new Subject<number>();

    // * multicasting
    subject.subscribe(v => console.log(`Observer A: ${v}`));
    subject.subscribe(v => console.log(`Observer B: ${v}`));

    timer(0,1000).pipe(
        takeWhile(value => value < 10),
        tap(val => subject.next(val))).subscribe();
}

export function SubjectAsObservableExample2() {
    const subject = new Subject<number>();

    subject.subscribe(v => console.log(`Observer A: ${v}`));
    subject.subscribe(v => console.log(`Observer B: ${v}`));

    subject.next(1);
    subject.next(2);
    subject.next(3);

// * A Subject sends data to subscribed observers. Any previously emitted data is not sent to new observers.
    subject.subscribe(v => console.log(`Observer C: ${v}`));
    subject.next(4);
}

export function SubjectAsObserver() {
    const subject = new Subject<number>();

    subject.subscribe({next: value => console.log(`Observer A: ${value}`)});
    subject.subscribe({next: value => console.log(`Observer B: ${value}`)});

    // * Since a Subject is an Observer, it can be provided as the argument to the subscribe of any Observable
    const observer = timer(0, 1000);
    observer.pipe(takeWhile(value => value < 15)).subscribe(subject);
}
