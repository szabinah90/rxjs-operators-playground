/**
 * ! any given stream can error out once
 * ! a stream can also complete:
 *  ? ended lifecycle without error
 *      * after completion, the stream will not emit any value
 *  ? ended lifecycle with error
 *      * after the error is thrown, will not emit any value
 * ! mutually exclusive: after completion cannot error, after error cannot complete!
 * * both are an option, but cannot happen at the same time
 * */
import {interval, of, throwError, timer} from "rxjs";
import {catchError, delayWhen, finalize, flatMap, map, retryWhen, shareReplay, take, tap} from "rxjs/operators";

export function SimpleRequest() {
    timer(0, 500).subscribe(
        res => console.log('Http Response', res),
        err => console.error('Http Error', err),
        () => console.log('Http Request completed.')
    )
}

/**
 * ? catchError
 *  * simply a function that takes an input observable and outputs an output observable
 *  * a function needed to pass with each call which is named an error handling function
 *  * catchError takes an observable as an input which MIGHT error out and start emitting its values in the
 *      * output observable
 *      * if no error occurs the output produced by catchError works exactly the same way as the input observable
 *
 *      * if an error occurs, the catchError is going to take the error and pass it to the handling function
 *      * this function is expected to return an observable === REPLACEMENT observable for the errored out stream
 *      * this replacement observable is subscribed to and its values are going to be used IN PLACE of the errored out observable
 * */
export function ErrorHandlingOne() {
    timer(0, 500).pipe(
        catchError(err => of([])) // * error handling function; in this case never called as no error occurs
    ).subscribe(                              // * [] is a fallback value
        res => console.log('Http Response', res),
        err => console.error('Http Error', err),
        () => console.log('Http Request completed.')
    )
}

export function ErrorHandlingThrowError() {
    timer(0, 500).pipe(
        flatMap(number => {
            number = number * 10;
            if (number % 4 !== 0) {
                return throwError('this is an error')
            }
            return of(number);
        }),
        catchError(err => {
            return throwError(err);
        })
    ).subscribe(
        res => console.log('HTTP response', res),
        err => console.log('HTTP Error', err),
        () => console.log('HTTP request completed.')
    );
}

export function ErrorHandlingMultipleThrow() {
    timer(0, 500).pipe(
        flatMap(number => {
            number = number * 10;
            if (number % 4 !== 0) {
                return throwError('this is an error')
            }
            return of(number);
        }),
        catchError(err => {
            return throwError(err);
        }),
        catchError(err => {
            console.log('second catch error block');
            return of([]);
        })
    ).subscribe(
        res => console.log('HTTP response', res),
        err => console.log('HTTP Error', err),
        () => console.log('HTTP request completed.')
    );
}

/**
 * ! code in the finalize block WILL ALWAYS run, whether error was thrown or not!
 * */
export function ErrorHandlingFinalize() {
    timer(0, 500).pipe(
        flatMap(number => {
            number = number * 10;
            if (number % 4 !== 0) {
                return throwError('this is an error')
            }
            return of(number);
        }),
        catchError(err => {
            return throwError(err);
        }),
        finalize(() => console.log('Finalize executed'))
    ).subscribe(
        res => console.log('HTTP response', res),
        err => console.log('HTTP Error', err),
        () => console.log('HTTP request completed.')
    );
}

/**
* ? retry strategy
* * if the stream does error out, we are then going to subscribe again to the input Observable,
 * *and create a brand new stream
 *
 * * a second auxiliary Observable is needed, which is called the Notifier Observable. It's the Notifier
 * * Observable that is going to determine when the retry attempt occurs.
 *  * used by the retryWhen operator
 *  * this notification observable is created in the function passed to the retry when operator
 *      * this function takes an Error Observable as an input argument that emits the errors of the errors of the
 *      * input observable as values
 * */
export function ErrorHandlingImmediateRetry() {
    timer(0, 500).pipe(
        tap(() => console.log('HTTP Request executed')),
        map(res => {
            if (res > 5) {
                throw res;
            }
            return res;
        }),
        shareReplay(),
        retryWhen(errors => {
            return errors.pipe(
                tap(() => console.log('Retrying...'))
            )
        })
    )
        .subscribe(
            res => console.log('HTTP response', res),
            err => console.log('HTTP Error', err),
            () => console.log('HTTP request completed.'));
}

export function ErrorHandlingDelayedRetry() {
    timer(0, 500).pipe(
        tap(() => console.log('HTTP Request executed')),
        map(res => {
            if (res > 5) {
                throw res;
            }
            return res;
        }),
        shareReplay(),
        retryWhen(errors => { // ! function passed to retryWhen is goning to be called once!
            return errors.pipe(
                delayWhen(() => timer(2000)), // ! sets the delay time
                tap(() => console.log('Retrying...'))
            )
        })
    )
        .subscribe(
            res => console.log('HTTP response', res),
            err => console.log('HTTP Error', err),
            () => console.log('HTTP request completed.'));
}
