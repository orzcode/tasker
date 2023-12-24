# tasker
## Todo / Notes project

* Project Description

A very simple notes app / task app, taking inspiration style-wise from Google Keep (specifically the form and the way it grows).

This started with some lofty ideas in mind and additional features such as color picking/color theming for notes, as well as customizable group names, and a few other things, but ultimately these weren't vital to the project and as it was taking quite some time and mental energy to get through the final weeds, I dropped these in favor of simple MVP status.

One aim during this project was to improve and practise better modularization and abstractability of the code, which I achieved to a fair degree with JS components for various overhead functions (storage, card management, etc). It's far from perfect though and strictness did lapse towards the end. However, I do love the notion of these approaches and wish to incorporate them more.

This was also the first time using Vite and other dependancies (including a purification library to make sure bad actors can't insert nasty code via the form).

~~~

Notes: Setting `grid-template-rows: 0 0 0 0` in prep for a transition to grow, is great, so long as you set `overflow: hidden` on the dang children

100vw on `body` is important to prevent vertical scrollbar jarring.

~~~
