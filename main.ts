import { replaceConsoleLog } from './browser/console.log';
import { of } from 'rxjs';
import { filter, map, switchMap, delay } from 'rxjs/operators';
import {
  BasicFirebaseExample,
  BasicSimulatedHttp,
  BasicSwitchMapWithNumberSequence, MappedFirebaseStreams,
  MultipleSimulatedHttp
} from "./src/switchMap/switchMap";

replaceConsoleLog();
console.log('Observable of ------------------------------------------------------------------------------------');

// "operators" in Observables
/*
map:
- takes an observable and returns a new one
- subscribes to the source
- passes along the transformed value
filter
scan:
- applies a reducer function over the source observable
- to create reducer pattern*/
const src = of(1, 2, 3, 4, 5, 6, 7);
src
  .pipe(
    filter((x) => x % 2 === 0),
    map((x) => x + x)
  )
  .subscribe((x) => console.log(x));

console.log('switchMap ------------------------------------------------------------------------------------');
// BasicSwitchMapWithNumberSequence();
// BasicSimulatedHttp();
// MultipleSimulatedHttp();
// BasicFirebaseExample();
// MappedFirebaseStreams();
