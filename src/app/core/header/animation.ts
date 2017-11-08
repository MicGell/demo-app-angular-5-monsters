import {
  trigger,
  transition,
  group,
  query,
  style,
  animate
} from '@angular/animations';

export const toggleMenuTrigger = trigger('menuState', [
  transition('inactive => active', [
    group([
      query(':self', [
        style({
          height: 60
        }),
        animate(500)
      ]),
      query('.menu-item', [
        style({
          height: 10,
          transform: 'translateX(-100%)'
        }),
        animate(500)
      ]),
    ])
  ]),
  transition('active => inactive', [
    group([
      query('.menu-item', [
        animate(350, style({
          height: 0,
          transform: 'translateX(-100%)'
        }))
      ])
    ])
  ])
]);
