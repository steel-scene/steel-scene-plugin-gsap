import { use, types } from 'blue-unicorn';
declare const TweenMax: any;
declare const TimelineLite: any;
declare const EaseLookup: any;

const gsapAnimationEngine: types.IAnimationEngine = {
  set(toState: types.ITarget[]): void {
    for (let i = 0, len = toState.length; i < len; i++) {
      const state = toState[i];
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
  setPlayState(state: 'paused' | 'running'): void {
    if (state === 'paused') {
      TweenMax.pauseAll();
    }
    if (state === 'running') {
      TweenMax.resumeAll();
    }
  },
  transition(transitions: types.ITransition[], onStateChange: (stateName: string) => void): void {
    const t1 = new TimelineLite();

    let position = 0;
    for (let x = 0, xlen = transitions.length; x < xlen; x++) {
      const {curve, state2} = transitions[x];
      const duration = curve!.duration!;
      const easing = EaseLookup.find(curve!.easing);

      for (let i = 0, len = state2.length; i < len; i++) {
        const state = state2[i];
        const target = state.ref;
        const props = {
          onComplete: () => onStateChange(curve!.state2)
        };

        if (easing) {
          props['ease'] = easing;
        }

        for (let prop in state) {
          if (prop !== 'ref' && prop !== 'easing') {
            props[prop] = state[prop];
          }
        }

        // todo: figure out how to approximate distance between from and to
        t1.from(target, duration * 0.001, props, position);
      }

      position += duration;
    }

    t1.play();
  },
  setup(unicorn: types.IBlueUnicorn): void {
    // nothing to do
  },
  teardown(unicorn: types.IBlueUnicorn): void {
    // nothing to do
  }
};

use(gsapAnimationEngine);
