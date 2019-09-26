import {fromEvent, interval, timer} from "rxjs";
import {take, takeUntil, takeWhile} from "rxjs/operators";

/**
 * ? take
 * * takes the first specified amount of values emitted by the source observable
 * */
export function TakeExample() {
    timer(0, 500).pipe(take(10)).subscribe(x => console.log(x)); // * takes 10 values
}

/**
 * ? takeUntil
 * * using a notifier observable to tell the source observable to complete.
 * * declarative subscription management
 * */
export function TakeUntilExample() {
    const click$ = fromEvent(document.body, 'click');
    // * counter runs until a mouse click
    timer(0, 500).pipe(takeUntil(click$)).subscribe(x => console.log(x));
}

/**
 * ? takeWhile
 * * emits values emitted by the source observable so long as each value satisfies the given predicate
 *      * and then completes as soon as this predicate is not met (ie. the condition returns false)
 * */
export function TakeWhileExample() {
    // * counter runs while the emitted value is less than 10
    timer(0,500).pipe(takeWhile(x => x < 10)).subscribe(y => console.log(y));
}
