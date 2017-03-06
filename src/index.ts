import { use, types } from 'steel-scene';
import { toCamelCase } from './strings';

declare const TimelineLite: any;
declare const EaseLookup: any;

const ignoredProperties = ['ref', 'default', 'easing'];

use({
  set(toState: types.ISetOperation[]): void {
    toState.forEach(state => TweenLite.set(state.targets, state.set));
  },
  transition(operations: types.ITweenOperation[][], onStateChange: (stateName: string) => void): void {
    const t1 = new TimelineLite();
    let position = 0;

    operations.forEach(operationGroup => {
      const { duration, easing } = operationGroup[0];

      // convert to seconds from milliseconds
      const durationInSeconds = Number(duration) * 0.001;

      // find gsap easing function
      const easingFn = EaseLookup.find(easing);

      operationGroup.forEach(operation => {
        const {keyframes, targets} = operation;
        const toState = keyframes[keyframes.length - 1];

        const props = {
          onComplete: () => onStateChange(operation.name)
        };

        if (easing) {
          props['ease'] = easingFn;
        }

        for (let prop in toState) {
          if (ignoredProperties.indexOf(prop) === -1) {
            props[toCamelCase(prop)] = toState[prop];
          }
        }

        // todo: figure out how to approximate distance between from and to
        t1.to(targets, durationInSeconds, props, position);
      });

      position += durationInSeconds;
    });

    t1.play();
  }
});
