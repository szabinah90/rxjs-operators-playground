import {concat, of} from "rxjs";

export function BasicConcatenation() {
    const series1$ = of('a', 'b', 'c');
    const series2$ = of('i', 'j', 'k');
/**
*! concat will subscribe to ONLY the first observable
 * * series1$ will emit a value which gets immediately reflected in the output result$
 * ! series2$ DOES not emit yet because it has not been subscribed to
 * * after series1$ completed, concat subscribes to series2$ --> emitted values are reflected in the output until completed
*/
    const result$ = concat(series1$, series2$);

    result$.subscribe(console.log);
}

/**
* ? concatMap
 * * commonly used in HTTP Requests
 * * "makes sure everything happens in order"
 * * for example for form draft saving --> concatenating post requests ensures that a HTTP save is not made before
 * * the previous ongoing save request finishes first
 * ! this.form.valueChanges
    *! .pipe(
    *!  concatMap(formValue => this.http.put(`/api/course/${courseId}`,
    *!  formValue))
    *! )
 *! .subscribe(
 *! saveResult =>  ... handle successful save ...,
 *! err => ... handle save error ...
 *! );
 * * we no longer have nested subscriptions
 * * by using concat map, requests are sent sequentially to the backend
 * ! formValue --> save HTTP Observable (inner obs) --> output to the result observable
 * * if the second form value comes faster than the first request completes, the new form value vill not be mapped
 * * into a HTTP request (concatMap will "wait" for the first one completion THEN maps and subscribes to the second one)
*/
