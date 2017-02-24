import { use, types } from 'blue-unicorn';
import { toCamelCase } from './strings'
declare const TweenMax: any;
declare const TimelineLite: any;
declare const EaseLookup: any;

const gsapAnimationEngine: types.IAnimationEngine = {
  set(toState: types.IState): void {
    const targets = toState.targets;
    for (let i = 0, len = targets.length; i < len; i++) {
      const state = targets[i];
      const target = state.ref;
      const props = {};
      for (let prop in state) {
        if (prop === 'ref' || prop === 'easing') {
          continue;
        }
        props[prop] = state[prop];
      }
      TweenMax.set(target, props);
    }
  },
  transition(transitions: types.IEngineTransition[], onStateChange: (stateName: string) => void): void {
    const t1 = new TimelineLite();

    let position = 0;
    for (let x = 0, xlen = transitions.length; x < xlen; x++) {
      const {duration, easing, toState} = transitions[x];

      // convert to seconds from milliseconds
      const durationInSeconds = duration * 0.001;

      // find gsap easing function
      const easingFn = EaseLookup.find(easing);

      for (let i = 0, len = toState.targets.length; i < len; i++) {
        const state = toState.targets[i];
        const target = state.ref;
        const props = {
          onComplete: () => onStateChange(toState.name)
        };

        if (easing) {
          props['ease'] = easingFn;
        }

        for (let prop in state) {
          if (prop !== 'ref' && prop !== 'easing') {
            props[toCamelCase(prop)] = state[prop];
          }
        }

        // todo: figure out how to approximate distance between from and to
        t1.to(target, durationInSeconds, props, position);
      }

      position += durationInSeconds;
    }

    t1.play();
  }
};

use(gsapAnimationEngine);
