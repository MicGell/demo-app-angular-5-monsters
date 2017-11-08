import {
  trigger,
  transition,
  group,
  query,
  style,
  animate,
  stagger,
  keyframes
} from '@angular/animations';

export const enterLeaveTrigger = trigger('listState', [
  transition('* => *', [
    group([
      query(':enter', [
        style({
          opacity: 0,
          transform: 'translateX(-100%)'
        }),
        stagger(200, [
          animate('500ms ease-out', keyframes([
            style({
              opacity: 1,
              transform: 'translateX(1%)',
              offset: 0.6
            }),
            style({
              opacity: 1,
              transform: 'translateX(0)',
              offset: 1
            })
          ]))
        ])
      ], {optional: true}),
      query(':leave', [
        animate(400, style({
          opacity: 0,
          transform: 'translateX(100%)'
        }))
      ], {optional: true}),
      query(':enter .active-progress', [
        style({
          width: 0,
          opacity: 0.3
        }),
        animate(3000)
      ], {optional: true})
    ])
  ])
]);
