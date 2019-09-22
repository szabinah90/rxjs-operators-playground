import { replaceConsoleLog } from './browser/console.log';
import { of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {BasicConcatenation} from "./src/flattening/concatenation/concat";
import {BasicMerge} from "./src/flattening/merging/merge";

replaceConsoleLog();
console.log('Observable of ------------------------------------------------------------------------------------');

// "operators" in Observables
/*
map:
- takes an observable and returns a new one
- subscribes to the source
- passes along the transformed value
- the map operator is all about mapping the values of the input observable
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


// console.log('switchMap ------------------------------------------------------------------------------------');
// BasicSwitchMapWithNumberSequence();
// BasicSimulatedHttp();
// MultipleSimulatedHttp();
// BasicFirebaseExample();
// MappedFirebaseStreams();
// SelectorExample0();
// SwitchMapWithSelector();

/*console.log('concatenation');
BasicConcatenation();*/

console.log('merging');
BasicMerge();
