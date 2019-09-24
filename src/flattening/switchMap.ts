import {interval, of} from "rxjs";
import {delay, map, switchMap} from "rxjs/operators";
/*
switchMap
- maps a value to a new observable
- subscribes to that observable
- unsubscribes from the previous observable
- is subscribed to one observable at a time
- cancels in-flight network requests! -> "switch to a new observable"
- Commonly used for HTTP GET
- switching between two streams
*/

/**
* ? "switch":
 * * result observable switching from the "old" inner observable to the new inner observable
 * * (created after the source observable emitted a new value)

* ? "map":
* * the emitted source value is being mapped to an observable (using the mapping function passed to switchMap)
*/

/**
 * * short-lived, cold stream
 * ! of --> create an "emit once and complete" stream
 * * delay --> "make it asynchronous like an HTTP request
*/
const simulateHttp = (val: any, delayValue: number) => {
    return of(val).pipe(delay(delayValue));
};

export function BasicSwitchMapWithNumberSequence () {
    const switched = of(1, 2, 3, 4).pipe(/*delay(3000),*/ switchMap((x) => {
        console.log('EXAMPLE 0');
        return of(x, x ** 2, x ** 3)
    }));
    switched.subscribe((x) => console.log(x));
}

export function BasicSimulatedHttp() {
// * cold, won't emit value until subscribed
    const http1$ = simulateHttp("1", 1000);
    const http2$ = simulateHttp("2", 2000);
    http1$.subscribe(
        console.log, /* === val => console.log(val)*/
        console.error, /*=== err => console.error(err)*/
        () => {
            console.log('EXAMPLE 1');
            console.log('http1$ complete!');
        });
    http2$.subscribe(console.log,
        console.error,
        () => console.log('http2$ complete!'));
}

export function MultipleSimulatedHttp() {
    // ! SOURCE observable
    // * once it emits, the source value emitted is passed to the function in the switch operator
    const saveUser$ = simulateHttp('EXAMPLE 2 user saved', 5000);

    // ! RESULT observable - if we dont subscribe to it, nothing will happen
    // * subscription of the result observable triggers a subscription to the source observable
    // * function in the switchMap needs to return an observable (that might be built using the source value or not)
    const httpResult$ = saveUser$.pipe(switchMap(sourceValue => {
        console.log(sourceValue);

        // ! returned observable === INNER observable
        // * subscribed to, its output is emitted also by the result observable
        return simulateHttp("data reloaded", 3000)
    }));

    // ! when the source observable completes, the result observable also completes
     httpResult$.subscribe(
        console.log,
        console.error,
        () => {
            console.log('completed httpResult$');
        }
    );
}

/**
 * ! long-lived (AngularFire-like stream === never complete,
 * ! KEEPS EMITTING VALUE (if a new value is available) until unsubscribed
 */
const simulateFirebase = (val: any, delayVal: number) => {
    return interval(delayVal).pipe(map(index => `${val} ${index}`));
};

export function BasicFirebaseExample() {
    const firebase1$ = simulateFirebase('FB-1', 5000);
    const firebase2$ = simulateFirebase('FB-2', 1000);

    firebase1$.subscribe(
        console.log,
        console.error,
        () => console.log('firebase1$ completed')
    );

    firebase2$.subscribe(
        console.log,
        console.error,
        () => console.log('firebase2$ completed')
    );
}

export function MappedFirebaseStreams() {
    const firebase1$ = simulateFirebase('FB-1', 5000);

    const firebaseResult$ = firebase1$.pipe(switchMap(sourceValue => {
        console.log(`source value ${sourceValue}`);
        return simulateFirebase(/*'inner observable'*/`SV ${sourceValue} passed to inner observable`, 1000);
    }));

    /**
    * * Nothing will happen until the result observable is subscribed to
    * * the source observable will then emit the first value (FB-1 0)
    * ! the source value will be mapped into an inner observable (which is the output of the mapping function
     * ! passed to switchMap)
    * ! then the inner observable will be subscribed to
     * * the result observable will emit the values also emitted by the inner observable
     */
    firebaseResult$.subscribe(
        console.log,
        console.error,
        () => console.log('completed firebaseResult$')
    );

    /**
    * ! when the source observable emits a new value, the "old" inner observable is unsubscribed from,
     * ! the mapping function is called again and creates a new inner observable (old values are not being used)
     * ! ==> the result observable has SWITCHED from emitting the values of the first inner observable,
     * ! to emitting the values of the newly created inner observable
     * * the new inner observable is subscribed to
     * * the result observable is emitting the values emitted by the new inner observable
    */


}
// ? SELECTOR functions
/**
** a selector function can also be passed to the switchMap operator
 * * as a second argument (after the mapping function)
 * ! allow us to combine the multiple values of the inner and the source observable.
*/
/*export function SelectorExample0() {
    const course$ = simulateHttp({id: 1, description: 'switch practice'}, 2000);

    const httpResult$ = course$.pipe(
        switch(sourceValue => simulateHttp('[...returns a lessons array...]', 1000)));
    /!**
    *! return ONLY the lessons array returned from the request (emitted as the value of the result observable)
    *!/
    httpResult$.subscribe(
        console.log,
        console.error,
        () => console.log('completed httpResult')
    );
}*/

export function SwitchMapWithSelector() {
    const course$ = simulateHttp({id: 1, description: 'switch practice'}, 2000);
    const lessons = [
        {title: 'lesson 1'},
        {title: 'lesson 2'},
        {title: 'lesson 3'},
    ];

    const httpResult$ = course$.pipe(switchMap(
        /**
        *! selector function takes 4 arguments:
         * ! 1. value of the source observable (course object returned by the initial HTTP request
         * ! 2. value of the inner observable (array with a list of lessons)
         * ! 3. source observable index
         * ! 4. inner index
        */
        courses => simulateHttp(lessons, 3000),
        (courses, lessons, outerIndex, innerIndex) => [courses, lessons]
    ));

    httpResult$.subscribe(
        console.log,
        console.error,
        () => console.log('completed httpResults$')
    );
}

