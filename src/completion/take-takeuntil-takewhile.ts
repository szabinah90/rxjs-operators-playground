import {fromEvent, interval, of, timer} from "rxjs";
import {first, take, takeUntil, takeWhile} from "rxjs/operators";

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

/*
? first
* emits only the first value or the first value that meets the given condition emittd by the source observable
    * or a default value
* */
export function FirstExample() {
    //* outputs default value ad the predicate is never met.
   of(1,2,3,4,5).pipe(first(value => value > 5, 'Default value'))
       .subscribe(x => console.log(x));

    // * takes the first emitted value of the source observable
    of(1,2,3,4,5).pipe(first()).subscribe(x => console.log(x));

    // * takes the first value that meets the predicate
    of(1,2,3,4,5). pipe(first(val => val === 4)).subscribe(x => console.log(x));


}
