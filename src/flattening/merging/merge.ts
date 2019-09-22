import { interval, merge } from "rxjs";
import {map, take} from "rxjs/operators";

/**
 * * run things in parallel, without waiting for the previous inner Observable to complete
 * * will not wait for an Observable to complete before subscribing to the next observable
 * * subscribes to every merged observables at the same time
 * * outputs the values of each source observable to the combined result observable as multiple values arrive over time
 * * if one of the merged Observables completes, merge will continue to emit the values of the other Observables as they arrive
 * * the result Observable will not be completed until all the merged Observables are completed
 * */

export function BasicMerge() {
    const series1$ = interval(1000).pipe(map(val => val * 10), take(3));
    const series2$ = interval(1000).pipe(map(val => val * 100), take(5));

    const result$ = merge(series1$, series2$);

    result$.subscribe(console.log);
}

/**
* ? mergeMap
 * ! each of the source Observables will be mapped into an inner observable (~ concatMap)
 * * inner observable is subscribed to by mergeMap
 * * as an inner observables emit new values, they are immediately reflected in the output observable
 * * does not wait for the previous inner observable to complete before triggering the next one
 * ! we can have multiple inner observables overlapping over time, emitting values in parallel
 */
