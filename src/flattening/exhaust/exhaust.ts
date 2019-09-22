/**
 * * situations where what we want to do is to ignore new values in the source Observable
 * * until the previous value is completely processed
 * * for example: avoid multiple saving in case of smashing the Save button
 * * --> want also to be able to ignore a click, but only if a save is already ongoing
 */
import {fromEvent, interval} from "rxjs";
import { exhaust, map, take} from "rxjs/operators";


/**
 * * click starts a counter to 6
 * * until counter reaches 6, clicking does not have an effect (calue cahanges induced by click events are discarded)
 * * because there is an uncompleted observable
 * * after the counter reached 6, the counter restarts on a click
*/
export function BasicExhaust() {
    const clicks = fromEvent(document, 'click');
    const higherOrder = clicks.pipe(map(event => interval(1000).pipe(take(7))));

    higherOrder.pipe(exhaust()).subscribe(x => console.log(x));
}

/**
 * ? exhaustMap
 * * practical example ("smashing save button")
 * ! fromEvent(this.saveButton.nativeElement, 'click')
 *! .pipe(
 *! exhaustMap(() => this.saveCourse(this.form.value))
 *! )
 *! .subscribe();
 * * new save request will be sent only after the ongoing request is finished!
 */
