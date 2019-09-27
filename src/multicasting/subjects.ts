/**
 * ? SUBJECTS
 * * every subject is an OBSERVER and an OBSERVABLE
 * * allows multicasting to many observers
 * * does not need starting value
 * */
import { AsyncSubject, BehaviorSubject, ReplaySubject, Subject, timer } from 'rxjs';
import { takeWhile, tap } from "rxjs/operators";

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

/**
 * ? BEHAVIOR SUBJECTS
 * * stores the latest value emitted to its subscribers
 * * new subscribers immediately receive the last value (=== current value)
 * * needs starting value
 * */
export function BehaviorSubjectExample() {
    const behaviorSubject = new BehaviorSubject<number>(0);

    behaviorSubject.subscribe({next: value => console.log(`Observer A: ${value}`)});
    behaviorSubject.subscribe({next: value => console.log(`Observer B: ${value}`)});

    behaviorSubject.next(1);
    behaviorSubject.next(2);
    behaviorSubject.next(3);
    behaviorSubject.next(4);

    behaviorSubject.subscribe({next: value => console.log(`Observer C: ${value}`)});
    behaviorSubject.next(5)
}

/**
 * ? REPLAY SUBJECT
 * * it can send old values to new subscribers
 * * can also record a part of the observable execution and replay them to new observers
 * */
export function ReplaySubjectExample() {
    const replaySubject = new ReplaySubject<number>(2);
    replaySubject.subscribe({next: v => console.log(`Observer A: ${v}`)});
    replaySubject.next(1);
    replaySubject.next(2);
    replaySubject.next(3);
    replaySubject.next(4);

    replaySubject.subscribe({next: v => console.log(`Observer B: ${v}`)});
}

/**
* ? ASYNC SUBJECT
 * * will emit the last value to the observers when the sequence is completed
*/
export function AsyncSubjectExample() {
    const asyncSubject = new AsyncSubject<number>();

    asyncSubject.subscribe({next: value => console.log(value)});
    asyncSubject.next(1);
    asyncSubject.next(2);
    asyncSubject.next(3);
    asyncSubject.complete();
}
