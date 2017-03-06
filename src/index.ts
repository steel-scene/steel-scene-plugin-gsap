import { use, types } from 'steel-scene';
import { toCamelCase } from './strings';

declare const TimelineLite: any;
declare const EaseLookup: any;

const ignoredProperties = ['ref', 'default', 'easing'];

const inProgress: { [key: number]: typeof TimelineLite } = {};

use({
  set(toState: types.ISetOperation[]): void {
    toState.forEach(state => TweenLite.set(state.targets, state.set));
  },
  transition(timeline: types.ITimelineTween, onStateChange: (stateName: string) => void): void {
    const id = timeline.id;

    // cancel any in progress timelines
    let t1 = inProgress[id];
    if (t1) {
      t1.clear();
    } else {
      t1 = new TimelineLite({
        onComplete(): void {
          // remove timeline from in progress
          inProgress[id] = undefined;
        }
      });
    }

    let position = 0;
    timeline.states.forEach(stateGroup => {
      const { duration, easing, stateName } = stateGroup;

      // convert to seconds from milliseconds
      const durationInSeconds = Number(duration) * 0.001;

      // find gsap easing function
      const easingFn = EaseLookup.find(easing);

      stateGroup.tweens.forEach(tween => {
        const {keyframes, targets} = tween;
        const toState = keyframes[keyframes.length - 1];

        const props = {
          onComplete: () => {
            onStateChange(stateName);
          }
        };

        if (easingFn) {
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

    // add to list of playing timelines
    inProgress[id] = t1;
    t1.play();
  }
});
