# GSAP v3 — Comprehensive Animation Reference

> Source: gsap.com/docs/v3 — compiled for skill creation
> Covers: Core API, Timeline, Plugins, React/Next.js Integration, Installation

---

## Table of Contents

1. [Installation & Setup](#1-installation--setup)
2. [Core Concepts](#2-core-concepts)
3. [Core Tween Methods](#3-core-tween-methods)
4. [Special Properties](#4-special-properties)
5. [Easing](#5-easing)
6. [Timeline API](#6-timeline-api)
7. [Utility Methods](#7-utility-methods)
8. [Plugins](#8-plugins)
9. [ScrollTrigger](#9-scrolltrigger)
10. [React / Next.js Integration](#10-react--nextjs-integration)
11. [Best Practices & Gotchas](#11-best-practices--gotchas)

---

## 1. Installation & Setup

### NPM / Yarn / PNPM

```bash
npm install gsap
# or
yarn add gsap
# or
pnpm add gsap
```

### Package structure

```
gsap/
  gsap            → core (gsap.to, gsap.from, etc.)
  gsap/all        → core + ALL plugins (except members-only)
  gsap/ScrollTrigger
  gsap/ScrollToPlugin
  gsap/Draggable
  gsap/MotionPathPlugin
  gsap/EaselPlugin
  gsap/PixiPlugin
  gsap/TextPlugin
  gsap/Flip
  gsap/Observer
  gsap/ScrollSmoother   (Club GSAP)
  gsap/SplitText         (Club GSAP)
  gsap/MorphSVGPlugin    (Club GSAP)
  gsap/DrawSVGPlugin     (Club GSAP)
  gsap/Physics2DPlugin   (Club GSAP)
  gsap/PhysicsPropsPlugin (Club GSAP)
  gsap/ScrambleTextPlugin (Club GSAP)
  gsap/CustomBounce       (Club GSAP)
  gsap/CustomWiggle       (Club GSAP)
  gsap/InertiaPlugin      (Club GSAP)
```

### ES Module Imports

```js
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { Flip } from "gsap/Flip";
import { Observer } from "gsap/Observer";
import { Draggable } from "gsap/Draggable";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, Flip, Observer, Draggable, MotionPathPlugin, ScrollToPlugin);
```

### Next.js / SSR Import Pattern

```js
// For Next.js (avoids SSR issues):
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register on client side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
```

### gsap.registerPlugin()

```js
gsap.registerPlugin(Plugin1, Plugin2, ...);
```

- Must be called before using any plugin features
- Safe to call multiple times (idempotent)
- Registers the plugin globally so GSAP can use it
- Helps with tree-shaking — only registered plugins are bundled

---

## 2. Core Concepts

### What is a Tween?

A tween is the fundamental animation unit. It changes a property of an object over time.

```js
// Animate .box from current position to x: 200 over 1 second
gsap.to(".box", { x: 200, duration: 1 });
```

### Targets

Targets can be:
- **CSS selector string**: `".class"`, `"#id"`, `"div"`
- **DOM element reference**: `document.querySelector(".box")`
- **Array of elements**: `[elem1, elem2, elem3]`
- **React ref**: `myRef.current`
- **Plain object**: `{ value: 0 }` (for animating non-DOM data)

### Properties that GSAP can animate

GSAP can animate ANY numeric property of ANY JavaScript object. For DOM elements, it auto-handles:

| GSAP Shorthand | CSS Equivalent | Unit Default |
|---|---|---|
| `x` | `transform: translateX()` | px |
| `y` | `transform: translateY()` | px |
| `xPercent` | `transform: translateX(%)` | % |
| `yPercent` | `transform: translateY(%)` | % |
| `rotation` | `transform: rotate()` | deg |
| `rotationX` | `transform: rotateX()` | deg |
| `rotationY` | `transform: rotateY()` | deg |
| `scale` | `transform: scale()` | - |
| `scaleX` | `transform: scaleX()` | - |
| `scaleY` | `transform: scaleY()` | - |
| `skewX` | `transform: skewX()` | deg |
| `skewY` | `transform: skewY()` | deg |
| `opacity` | `opacity` | 0-1 |
| `width` | `width` | px |
| `height` | `height` | px |
| `top`, `left`, `right`, `bottom` | position props | px |
| `borderRadius` | `border-radius` | px |
| `color` | `color` | - |
| `backgroundColor` | `background-color` | - |
| `autoAlpha` | `opacity` + `visibility` | 0-1 |

**`autoAlpha`**: Like `opacity` but also toggles `visibility: hidden` when value reaches 0 (better for accessibility and performance).

### Transform Origin

```js
gsap.to(".box", { rotation: 360, transformOrigin: "50% 50%" }); // center (default)
gsap.to(".box", { rotation: 360, transformOrigin: "top left" });
gsap.to(".box", { rotation: 360, transformOrigin: "0% 100%" }); // bottom-left
```

---

## 3. Core Tween Methods

### gsap.to(targets, vars)

Animates FROM the targets' current state TO the values defined in `vars`.

```js
gsap.to(".box", {
  x: 200,
  y: 100,
  rotation: 360,
  opacity: 0.5,
  duration: 2,
  ease: "power2.inOut",
  delay: 0.5,
});
```

**Parameters:**
- `targets` — Element(s) to animate (selector, ref, object, array)
- `vars` — Object with properties to animate + special properties

**Returns:** A `Tween` instance

### gsap.from(targets, vars)

Animates FROM the given values TO the targets' current state. Useful for intro animations.

```js
gsap.from(".box", {
  x: -200,
  opacity: 0,
  duration: 1,
  ease: "power3.out",
});
```

**Gotcha**: `immediateRender` defaults to `true` for `.from()` — the element immediately jumps to the "from" state. Set `immediateRender: false` to override.

### gsap.fromTo(targets, fromVars, toVars)

Animates FROM defined values TO defined values. Full control over start and end.

```js
gsap.fromTo(".box",
  { x: -200, opacity: 0 },       // FROM
  { x: 200, opacity: 1, duration: 2 }  // TO (also holds special properties)
);
```

**Parameters:**
- `targets` — Element(s)
- `fromVars` — Starting property values
- `toVars` — Ending property values + special properties (duration, ease, etc.)

### gsap.set(targets, vars)

Immediately sets properties (zero-duration tween). No animation.

```js
gsap.set(".box", { x: 100, opacity: 0.5, transformOrigin: "center" });
```

Equivalent to `gsap.to(".box", { duration: 0, ... })`.

### gsap.killTweensOf(targets, properties)

Kills all tweens of the given target(s).

```js
gsap.killTweensOf(".box");           // kill all tweens on .box
gsap.killTweensOf(".box", "x,y");    // only kill x and y tweens
```

### gsap.getTweensOf(targets)

Returns an array of all active tweens for the given target(s).

```js
const tweens = gsap.getTweensOf(".box");
```

---

## 4. Special Properties

These go in the `vars` object but are NOT animated — they configure the tween behavior.

| Property | Type | Default | Description |
|---|---|---|---|
| `duration` | Number | `0.5` | Duration in seconds |
| `delay` | Number | `0` | Delay before animation starts (seconds) |
| `ease` | String/Function | `"power1.out"` | Easing function |
| `repeat` | Number | `0` | Number of extra repeats (-1 = infinite) |
| `repeatDelay` | Number | `0` | Delay between repeats (seconds) |
| `yoyo` | Boolean | `false` | Reverse direction on alternate repeats |
| `stagger` | Number/Object | `0` | Time between start of each target's animation |
| `overwrite` | String/Boolean | `false` | How to handle conflicting tweens |
| `paused` | Boolean | `false` | Start in paused state |
| `immediateRender` | Boolean | varies | Render immediately (true for from(), false for to()) |
| `lazy` | Boolean | varies | Defer rendering until next tick |
| `id` | String | - | ID for referencing the tween |
| `inherit` | Boolean | `true` | Inherit `defaults` from parent timeline |
| `reversed` | Boolean | `false` | Start in reversed state |
| `keyframes` | Array | - | Array of keyframe objects |
| `data` | any | - | Arbitrary data to attach to the tween |

### Callbacks

| Callback | Description |
|---|---|
| `onStart` | Called when tween begins (after any delay) |
| `onUpdate` | Called every frame while tween is active |
| `onComplete` | Called when tween finishes |
| `onRepeat` | Called each time tween repeats |
| `onReverseComplete` | Called when tween reaches beginning when reversed |
| `onStartParams` | Array of params passed to onStart |
| `onUpdateParams` | Array of params passed to onUpdate |
| `onCompleteParams` | Array of params passed to onComplete |
| `onRepeatParams` | Array of params passed to onRepeat |
| `onReverseCompleteParams` | Array of params passed to onReverseComplete |

```js
gsap.to(".box", {
  x: 200,
  duration: 1,
  onStart: () => console.log("Started!"),
  onUpdate: function() { console.log("Progress:", this.progress()); },
  onComplete: () => console.log("Done!"),
});
```

### Stagger

Stagger offsets the start time for each target in a multi-element tween.

```js
// Simple: 0.2s gap between each element
gsap.to(".box", { x: 200, stagger: 0.2 });

// Advanced stagger object:
gsap.to(".box", {
  x: 200,
  stagger: {
    each: 0.2,           // time between each start
    // OR amount: 1,     // total time distributed across all targets
    from: "center",       // "start", "end", "center", "edges", "random", or index number
    grid: "auto",         // [rows, cols] or "auto" for grid-based staggering
    axis: "x",            // "x" or "y" for grid direction
    ease: "power2.in",   // easing across the stagger distribution
    repeat: -1,           // repeat for each individual target
    yoyo: true,
  }
});
```

**`from` values:**
- `"start"` (default) — first element first
- `"end"` — last element first
- `"center"` — center elements first, edges last
- `"edges"` — edges first, center last
- `"random"` — random order
- `number` — specific index to start from

### Overwrite Modes

```js
gsap.to(".box", { x: 200, overwrite: true });    // immediately kills ALL other tweens on same target
gsap.to(".box", { x: 200, overwrite: "auto" });  // only kills conflicting properties on other tweens
gsap.to(".box", { x: 200, overwrite: false });    // default — no overwriting
```

Global default:
```js
gsap.defaults({ overwrite: "auto" });
```

### Keyframes

```js
gsap.to(".box", {
  keyframes: [
    { x: 100, duration: 1 },
    { y: 200, duration: 0.5 },
    { rotation: 360, duration: 1 }
  ]
});

// Percentage-based keyframes:
gsap.to(".box", {
  keyframes: {
    "0%":   { x: 0, y: 0 },
    "25%":  { x: 100, y: 0 },
    "50%":  { x: 100, y: 100 },
    "75%":  { x: 0, y: 100 },
    "100%": { x: 0, y: 0 }
  },
  duration: 4,
  ease: "none"
});
```

### Relative Values

```js
gsap.to(".box", { x: "+=200" });  // add 200 to current x
gsap.to(".box", { x: "-=100" });  // subtract 100 from current x
gsap.to(".box", { x: "*=2" });    // multiply current x by 2
```

### Function-Based Values

```js
gsap.to(".box", {
  x: (index, target, targets) => {
    return index * 100; // each element gets a different value
  },
  duration: 1,
});
```

### Random Values

```js
gsap.to(".box", {
  x: "random(-200, 200)",         // random between -200 and 200
  y: "random(-200, 200, 50)",     // random in increments of 50
  rotation: "random(0, 360)",
});
```

---

## 5. Easing

### Syntax: `"name.type"`

**Names:** `none`, `power1`, `power2`, `power3`, `power4`, `back`, `elastic`, `bounce`, `rough`, `slow`, `steps`, `circ`, `expo`, `sine`

**Types:** `.in`, `.out` (default), `.inOut`

### Built-in Eases

| Ease | Description |
|---|---|
| `"none"` | Linear, no easing (same as `"linear"`) |
| `"power1"` / `"power1.out"` | Subtle deceleration (same as `Quad`) |
| `"power1.in"` | Subtle acceleration |
| `"power1.inOut"` | Subtle acceleration then deceleration |
| `"power2"` | Moderate deceleration (same as `Cubic`) |
| `"power3"` | Strong deceleration (same as `Quart`) |
| `"power4"` | Extra strong deceleration (same as `Quint`/`Strong`) |
| `"back"` | Overshoots then returns |
| `"back.in"` | Pulls back then forwards |
| `"back.inOut"` | Both pull back and overshoot |
| `"elastic"` | Springy overshoot oscillation |
| `"elastic.in"` | Elastic start |
| `"elastic.inOut"` | Elastic both |
| `"bounce"` | Bouncing ball effect at end |
| `"bounce.in"` | Bounce at start |
| `"bounce.inOut"` | Bounce both |
| `"circ"` | Circular curve |
| `"expo"` | Exponential curve |
| `"sine"` | Sinusoidal curve |
| `"steps(n)"` | n discrete steps |

### Configurable Eases

```js
// back — configure overshoot amount (default: 1.7)
ease: "back(2.5)"
ease: "back.in(3)"

// elastic — configure amplitude and period
ease: "elastic(1, 0.5)"       // amplitude: 1, period: 0.5
ease: "elastic.in(2, 0.3)"

// rough — configure complexity
ease: "rough({ strength: 2, points: 50, template: 'power2', taper: 'both', randomize: true })"

// slow — configure linearRatio, power, yoyoMode
ease: "slow(0.7, 0.7, false)"

// steps — discrete steps
ease: "steps(12)"
```

### Custom Ease Function

```js
gsap.to(".box", {
  x: 200,
  ease: (progress) => {
    // progress is 0-1, return 0-1
    return progress * progress; // custom quadratic ease-in
  }
});
```

---

## 6. Timeline API

### Creating a Timeline

```js
const tl = gsap.timeline({
  // Timeline-level special properties:
  defaults: { duration: 1, ease: "power2.out" },  // inherited by children
  paused: false,
  repeat: 0,           // -1 for infinite
  repeatDelay: 0,
  yoyo: false,
  delay: 0,
  smoothChildTiming: true,
  autoRemoveChildren: false,
  id: "myTimeline",
  onStart: () => {},
  onUpdate: () => {},
  onComplete: () => {},
  onRepeat: () => {},
  onReverseComplete: () => {},
  onStartParams: [],
  onUpdateParams: [],
  onCompleteParams: [],
});
```

### Adding Tweens to a Timeline

```js
const tl = gsap.timeline({ defaults: { duration: 1, ease: "power3.out" } });

tl.to(".box1", { x: 200 })          // starts at time 0
  .to(".box2", { y: 100 })          // starts when previous ends
  .to(".box3", { opacity: 0 })      // starts when previous ends
  .from(".box4", { scale: 0 });     // starts when previous ends
```

### Position Parameter (CRITICAL)

The position parameter controls WHERE in the timeline a tween is placed. It's the 3rd argument to `.to()`, `.from()`, `.fromTo()`.

```js
tl.to(".box", { x: 200 }, positionParameter);
```

| Value | Description | Example |
|---|---|---|
| (none) | Sequence after previous | `tl.to(el, {x:200})` |
| `number` | Absolute time (seconds) | `tl.to(el, {x:200}, 1)` |
| `"+=n"` | Relative to END of timeline | `tl.to(el, {x:200}, "+=0.5")` |
| `"-=n"` | Overlap with previous by n sec | `tl.to(el, {x:200}, "-=0.5")` |
| `"<"` | Start of PREVIOUS tween | `tl.to(el, {x:200}, "<")` |
| `">"` | End of PREVIOUS tween | `tl.to(el, {x:200}, ">")` (same as omitting) |
| `"<+=n"` | n seconds after start of previous | `tl.to(el, {x:200}, "<+=0.3")` |
| `">-=n"` | n seconds before end of previous | `tl.to(el, {x:200}, ">-=0.2")` |
| `"labelName"` | At a label's position | `tl.to(el, {x:200}, "myLabel")` |
| `"labelName+=n"` | n seconds after label | `tl.to(el, {x:200}, "myLabel+=0.5")` |

```js
// Examples:
const tl = gsap.timeline();

tl.to(".a", { x: 100, duration: 1 })
  .to(".b", { y: 200, duration: 1 }, "<")        // simultaneous with .a
  .to(".c", { rotation: 360 }, "<+=0.2")          // 0.2s after .a starts
  .to(".d", { scale: 2 }, "-=0.5")                // overlaps .c by 0.5s
  .to(".e", { opacity: 0 }, 3)                    // at exactly 3 seconds
  .addLabel("spin", "+=0.5")                       // label 0.5s after .e ends
  .to(".f", { rotation: 720 }, "spin")             // at label "spin"
  .to(".g", { x: 400 }, "spin+=0.3");             // 0.3s after label "spin"
```

### Timeline Methods

#### Adding content

| Method | Description |
|---|---|
| `.to(targets, vars, position)` | Add a to() tween |
| `.from(targets, vars, position)` | Add a from() tween |
| `.fromTo(targets, fromVars, toVars, position)` | Add a fromTo() tween |
| `.set(targets, vars, position)` | Add an immediate set |
| `.add(child, position)` | Add a tween, timeline, label, callback, or array |
| `.addLabel(label, position)` | Add a label at position |
| `.removeLabel(label)` | Remove a label |
| `.addPause(position, callback)` | Add a pause point |
| `.call(callback, params, position)` | Add a function call at position |

#### Playback control

| Method | Description |
|---|---|
| `.play(from)` | Play from current position or specified time |
| `.pause(atTime)` | Pause at current position or specified time |
| `.resume()` | Resume from paused state |
| `.reverse(from)` | Reverse playback |
| `.restart(includeDelay, suppressEvents)` | Restart from beginning |
| `.seek(time, suppressEvents)` | Jump to time or label |
| `.timeScale(value)` | Get/set speed multiplier (2 = double speed) |
| `.progress(value)` | Get/set progress (0-1) |
| `.totalProgress(value)` | Get/set total progress including repeats (0-1) |
| `.time(value)` | Get/set playhead time (seconds) |
| `.totalTime(value)` | Get/set total time including repeats |
| `.duration(value)` | Get/set duration |
| `.totalDuration()` | Get total duration including repeats |
| `.isActive()` | Returns true if currently animating |
| `.paused(value)` | Get/set paused state |
| `.reversed(value)` | Get/set reversed state |

#### Management

| Method | Description |
|---|---|
| `.kill()` | Kill the timeline and all children |
| `.clear(labels)` | Remove all children (optionally keep labels) |
| `.invalidate()` | Flush cached start/end values |
| `.then(callback)` | Returns Promise that resolves on completion |
| `.revert()` | Revert all inline styles to pre-animation state |
| `.getChildren(nested, tweens, timelines, ignoreBeforeTime)` | Get child tweens/timelines |
| `.getTweensOf(targets)` | Get tweens of specific targets in this timeline |
| `.recent()` | Returns the most recently added child |
| `.nextLabel(time)` | Get next label after time |
| `.previousLabel(time)` | Get previous label before time |
| `.currentLabel(value)` | Get/set current label |
| `.shiftChildren(amount, adjustLabels, ignoreBeforeTime)` | Shift all children in time |

### Nesting Timelines

```js
function introAnimation() {
  const tl = gsap.timeline();
  tl.from(".header", { y: -100, opacity: 0 })
    .from(".nav-item", { opacity: 0, stagger: 0.1 });
  return tl;
}

function contentAnimation() {
  const tl = gsap.timeline();
  tl.from(".content", { y: 50, opacity: 0 })
    .from(".sidebar", { x: 100, opacity: 0 }, "<");
  return tl;
}

// Master timeline
const master = gsap.timeline();
master
  .add(introAnimation())
  .add(contentAnimation(), "-=0.5")  // overlap by 0.5s
  .add(() => console.log("All done!"));
```

### Timeline defaults

```js
const tl = gsap.timeline({
  defaults: {
    duration: 0.8,
    ease: "power2.out",
    opacity: 0,      // yes, you can even put animated props here
  }
});

// Children inherit defaults — override individually as needed:
tl.from(".box1", { x: -100 })           // duration: 0.8, ease: power2.out, opacity: 0
  .from(".box2", { y: 50, duration: 1.2 })  // overrides duration to 1.2
  .from(".box3", { scale: 0, ease: "back" }); // overrides ease
```

---

## 7. Utility Methods

### gsap.defaults(vars)

Set global defaults for all tweens:

```js
gsap.defaults({
  duration: 1,
  ease: "power2.out",
  overwrite: "auto",
});
```

### gsap.config(vars)

Configure global GSAP settings:

```js
gsap.config({
  autoSleep: 60,        // seconds of inactivity before stopping ticker
  force3D: "auto",      // "auto", true, false — use 3D transforms
  nullTargetWarn: true,  // warn about null targets
  units: { x: "vw", y: "vh", rotation: "rad" }, // default units
});
```

### gsap.getProperty(target, property, unit)

```js
gsap.getProperty(".box", "x");          // numeric value
gsap.getProperty(".box", "x", "px");    // "200px"
gsap.getProperty(".box", "backgroundColor"); // computed color
```

### gsap.setProperty(target, property, value)

```js
gsap.setProperty(".box", "x", 200);
gsap.setProperty(".box", "backgroundColor", "#ff0000");
```

### gsap.quickTo(target, property, vars)

Creates a reusable function for ultra-fast animations (great for mousemove):

```js
const xTo = gsap.quickTo(".cursor", "x", { duration: 0.4, ease: "power3" });
const yTo = gsap.quickTo(".cursor", "y", { duration: 0.4, ease: "power3" });

window.addEventListener("mousemove", (e) => {
  xTo(e.clientX);
  yTo(e.clientY);
});
```

### gsap.quickSetter(target, property, unit)

Even faster than quickTo — immediate set, no tween:

```js
const setX = gsap.quickSetter(".cursor", "x", "px");
const setY = gsap.quickSetter(".cursor", "y", "px");

window.addEventListener("mousemove", (e) => {
  setX(e.clientX);
  setY(e.clientY);
});
```

### gsap.ticker

The heartbeat of GSAP. Fires on every requestAnimationFrame.

```js
gsap.ticker.add((time, deltaTime, frame) => {
  // runs every frame
});

gsap.ticker.remove(myCallback);

gsap.ticker.fps(30); // cap at 30fps
gsap.ticker.lagSmoothing(500, 33); // threshold (ms), adjustedLag (ms)
```

### gsap.utils

```js
// Clamping
gsap.utils.clamp(0, 100, value);        // clamp value between 0-100

// Wrapping (looping)
gsap.utils.wrap(0, 100, 105);           // → 5
gsap.utils.wrap([a, b, c], 4);          // → b (index wraps)

// Mapping ranges
gsap.utils.mapRange(0, 100, 0, 1, 50);  // → 0.5
gsap.utils.normalize(0, 100, 50);       // → 0.5
gsap.utils.interpolate(0, 100, 0.5);    // → 50

// Snap
gsap.utils.snap(10, 23);                // → 20 (nearest increment of 10)
gsap.utils.snap([0, 25, 50, 100], 30);  // → 25 (nearest in array)
gsap.utils.snap({ values: [0, 50, 100], radius: 15 }, 42); // → 50 if within radius

// Distribute
gsap.utils.distribute({
  base: 0,
  amount: 100,
  from: "center",
  grid: "auto",
  axis: "x",
  ease: "power2",
});

// Array conversion
gsap.utils.toArray(".box");              // NodeList/string → Array
gsap.utils.toArray(nodeList);

// Shuffle
gsap.utils.shuffle([1, 2, 3, 4, 5]);   // random order

// Selector
gsap.utils.selector(myRef);             // scoped selector (React-friendly)

// Random
gsap.utils.random(0, 100);              // random between 0-100
gsap.utils.random(0, 100, 5);           // random in increments of 5
gsap.utils.random([a, b, c]);           // random from array
gsap.utils.random(0, 100, 5, true);     // returns reusable function

// Pipe (compose functions)
const clampedMapper = gsap.utils.pipe(
  gsap.utils.normalize(0, 100),
  gsap.utils.clamp(0, 1)
);
clampedMapper(50); // → 0.5

// String-based color interpolation
gsap.utils.interpolate("red", "blue", 0.5); // midpoint color
gsap.utils.interpolate({ x: 0, y: 0 }, { x: 100, y: 200 }, 0.5); // { x: 50, y: 100 }
```

### gsap.context()

Scope-based cleanup (critical for React/frameworks):

```js
const ctx = gsap.context(() => {
  // ALL gsap.to(), gsap.from(), ScrollTrigger, etc. created inside
  // are automatically collected for cleanup
  gsap.to(".box", { x: 200 });
  gsap.from(".title", { opacity: 0 });
  ScrollTrigger.create({ ... });
}, containerRef); // optional scope — selectors are scoped to this element

// Later, clean up everything:
ctx.revert(); // kills all animations + reverts inline styles
```

### gsap.matchMedia()

Responsive, media-query-based animations:

```js
const mm = gsap.matchMedia();

mm.add("(min-width: 800px)", () => {
  // Desktop animations
  gsap.to(".box", { x: 200 });
  return () => {
    // Cleanup when media query no longer matches (optional)
  };
});

mm.add("(max-width: 799px)", () => {
  // Mobile animations
  gsap.to(".box", { y: 100 });
});

// Multiple conditions:
mm.add({
  isDesktop: "(min-width: 800px)",
  isMobile: "(max-width: 799px)",
  reduceMotion: "(prefers-reduced-motion: reduce)",
}, (context) => {
  const { isDesktop, isMobile, reduceMotion } = context.conditions;

  if (reduceMotion) {
    gsap.set(".box", { opacity: 1 }); // no animation
    return;
  }

  if (isDesktop) {
    gsap.to(".box", { x: 200 });
  }
});

// Cleanup:
mm.revert();
```

---

## 8. Plugins

### ScrollTrigger

```js
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
```

#### Basic usage with tween

```js
gsap.to(".box", {
  x: 500,
  scrollTrigger: {
    trigger: ".box",        // element that triggers
    start: "top center",    // "trigger viewport" — trigger top hits viewport center
    end: "bottom top",      // "trigger viewport" — trigger bottom hits viewport top
    toggleActions: "play pause resume reverse",
    // onEnter onLeave onEnterBack onLeaveBack
    // options: play, pause, resume, reverse, restart, reset, complete, none
    markers: true,          // debug markers (remove in production!)
    scrub: true,            // link animation progress to scroll position
    // scrub: 0.5,          // smooth scrub with 0.5s lag
    pin: true,              // pin the trigger element during animation
    pinSpacing: true,       // add spacing for pinned element
    anticipatePin: 1,       // reduce pin jitter
    snap: 0.25,             // snap to 25% increments
    // snap: { snapTo: "labels", duration: 0.3, ease: "power1.inOut" },
    id: "my-trigger",
    invalidateOnRefresh: true, // recalculate values on resize
    fastScrollEnd: true,
    preventOverlaps: true,
    once: false,             // only trigger once
  }
});
```

#### Standalone ScrollTrigger

```js
ScrollTrigger.create({
  trigger: ".section",
  start: "top center",
  end: "bottom center",
  onEnter: () => console.log("entered"),
  onLeave: () => console.log("left"),
  onEnterBack: () => console.log("entered back"),
  onLeaveBack: () => console.log("left back"),
  onUpdate: (self) => {
    console.log("progress:", self.progress);
    console.log("direction:", self.direction); // 1 = down, -1 = up
    console.log("velocity:", self.getVelocity());
  },
  toggleClass: "active",        // toggle CSS class
  // toggleClass: { targets: ".box", className: "active" },
});
```

#### Start/End position syntax

Format: `"triggerPosition viewportPosition"`

**Trigger positions:** `top`, `center`, `bottom`, pixel value, percentage
**Viewport positions:** `top`, `center`, `bottom`, pixel value, percentage

```js
start: "top center"       // trigger's top hits viewport center
start: "top 80%"          // trigger's top hits 80% down viewport
start: "top top"          // trigger's top hits viewport top
start: "center center"    // trigger's center hits viewport center
start: "top bottom-=100"  // trigger's top hits 100px above viewport bottom
end: "+=500"              // 500px after start
end: "bottom top"         // trigger's bottom hits viewport top
```

#### ScrollTrigger static methods

```js
ScrollTrigger.refresh();              // recalculate all positions
ScrollTrigger.update();               // force update
ScrollTrigger.getAll();               // array of all ScrollTriggers
ScrollTrigger.getById("my-trigger");  // find by id
ScrollTrigger.kill();                 // kill all
ScrollTrigger.enable();
ScrollTrigger.disable();
ScrollTrigger.clearScrollMemory();
ScrollTrigger.maxScroll(element);
ScrollTrigger.scrollerProxy(el, vars); // custom scroller (Locomotive, Lenis, etc.)
ScrollTrigger.batch(".box", {          // batch animations
  onEnter: (elements) => gsap.to(elements, { opacity: 1, stagger: 0.1 }),
  start: "top 80%",
});
ScrollTrigger.sort(); // sort by start position
ScrollTrigger.normalizeScroll(true); // normalize across devices
ScrollTrigger.observe({               // Observer-like within ScrollTrigger
  target: window,
  type: "wheel,touch,pointer",
  onUp: () => {},
  onDown: () => {},
});
```

### Flip Plugin

State-transition animations (FLIP = First, Last, Invert, Play):

```js
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);

// 1. Capture current state
const state = Flip.getState(".box, .container");

// 2. Make DOM changes
container2.appendChild(box);
// or toggle classes, change layout, etc.

// 3. Animate from old state to new state
Flip.from(state, {
  duration: 1,
  ease: "power2.inOut",
  stagger: 0.1,
  absolute: true,      // use absolute positioning during flip
  scale: true,          // animate scale changes
  nested: true,         // handle nested flip elements
  onEnter: (elements) => gsap.fromTo(elements, { opacity: 0 }, { opacity: 1 }),
  onLeave: (elements) => gsap.to(elements, { opacity: 0 }),
  spin: 1,              // add rotation
  prune: true,          // remove elements that didn't change
});

// Flip.to() — like from() but you define the end state
// Flip.fit() — fit one element to another's position/size
Flip.fit(".box", ".target", { scale: true, duration: 1 });
// Flip.getState() — capture state
// Flip.isFlipping() — check if flip is active
```

### TextPlugin

```js
import { TextPlugin } from "gsap/TextPlugin";
gsap.registerPlugin(TextPlugin);

gsap.to(".text", {
  text: {
    value: "New text content here",
    delimiter: "",         // character-by-character (default)
    // delimiter: " ",     // word-by-word
    speed: 1,              // relative speed (higher = faster)
    newClass: "new-char",
    oldClass: "old-char",
    padSpace: false,
    preserveSpaces: true,
    rtl: false,
    type: "diff",          // "diff" (default) or "replace"
  },
  duration: 2,
  ease: "none",
});
```

### Observer Plugin

Detect user interactions (wheel, touch, pointer) for custom scroll-driven effects:

```js
import { Observer } from "gsap/Observer";
gsap.registerPlugin(Observer);

Observer.create({
  target: window,
  type: "wheel,touch,pointer,scroll",
  onUp: () => goToPreviousSection(),
  onDown: () => goToNextSection(),
  tolerance: 10,         // minimum pixels of movement
  preventDefault: true,
  wheelSpeed: -1,        // normalize direction
  onStopDelay: 0.25,
  onChange: (self) => {
    console.log(self.deltaX, self.deltaY, self.velocityX, self.velocityY);
  },
  onPress: () => {},
  onRelease: () => {},
  onHover: () => {},
  onHoverEnd: () => {},
  lockAxis: false,
  ignore: "input, textarea",
  debounce: true,
});
```

### Draggable

```js
import { Draggable } from "gsap/Draggable";
gsap.registerPlugin(Draggable);

Draggable.create(".box", {
  type: "x,y",           // "x", "y", "x,y", "rotation", "scroll", "scrollTop", "scrollLeft"
  bounds: "#container",   // constrain to element
  // bounds: { minX: 0, maxX: 500, minY: 0, maxY: 300 },
  inertia: true,          // requires InertiaPlugin for throw physics
  edgeResistance: 0.5,   // 0-1, resistance at edges
  snap: {
    x: (value) => Math.round(value / 50) * 50,
    y: (value) => Math.round(value / 50) * 50,
  },
  liveSnap: true,
  cursor: "grab",
  activeCursor: "grabbing",
  dragResistance: 0,
  lockAxis: false,
  allowEventDefault: false,
  zIndexBoost: true,
  onClick: () => {},
  onPress: () => {},
  onRelease: () => {},
  onDrag: function() { console.log(this.x, this.y); },
  onDragStart: () => {},
  onDragEnd: () => {},
  onThrowUpdate: () => {},
  onThrowComplete: () => {},
  trigger: ".handle",     // only drag when clicking this child element
  dragClickables: false,  // don't initiate drag on <a>, <button>, etc.
  allowNativeTouchScrolling: true,
  minimumMovement: 2,     // pixels
});

// Static methods
Draggable.hitTest(elem1, elem2, threshold); // collision detection
```

### MotionPathPlugin

Animate along an SVG path or custom path:

```js
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(MotionPathPlugin);

gsap.to(".box", {
  motionPath: {
    path: "#myPath",       // SVG path element
    // path: [{ x: 0, y: 0 }, { x: 100, y: 200 }, { x: 300, y: 50 }],
    align: "#myPath",      // align to path
    autoRotate: true,      // rotate element to follow path direction
    // autoRotate: 90,     // offset angle
    alignOrigin: [0.5, 0.5], // alignment origin
    start: 0,              // start position (0-1)
    end: 1,                // end position (0-1)
    curviness: 1.25,       // how curvy (0 = straight lines)
    type: "cubic",         // "cubic", "thru", "quadratic", "soft"
  },
  duration: 5,
  ease: "power1.inOut",
});

// Convert coordinates to path
MotionPathPlugin.convertToPath("#myRect");  // convert SVG shape to path
MotionPathPlugin.arrayToRawPath(pointsArray);
MotionPathPlugin.rawPathToString(rawPath);
MotionPathPlugin.getRelativePosition(fromElem, toElem, fromOrigin, toOrigin);
```

### ScrollToPlugin

```js
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
gsap.registerPlugin(ScrollToPlugin);

// Scroll window to y position
gsap.to(window, { scrollTo: 500, duration: 1 });

// Scroll to element
gsap.to(window, { scrollTo: "#section3", duration: 1 });

// Scroll with offset
gsap.to(window, {
  scrollTo: { y: "#section3", offsetY: 70 }, // 70px offset from top
  duration: 1,
});

// Scroll both axes
gsap.to(window, {
  scrollTo: { x: 500, y: 1000 },
  duration: 1,
});

// Auto-kill on user scroll
gsap.to(window, {
  scrollTo: { y: "#section3", autoKill: true },
  duration: 2,
});
```

### EaselPlugin (for CreateJS/EaselJS)

### PixiPlugin (for PixiJS)

### Club GSAP Plugins

**SplitText** — Split text into chars/words/lines for animation:
```js
const split = new SplitText(".text", { type: "chars,words,lines" });
gsap.from(split.chars, { opacity: 0, y: 50, stagger: 0.02 });
// split.revert() to restore original HTML
```

**MorphSVGPlugin** — Morph between SVG shapes:
```js
gsap.to("#circle", { morphSVG: "#star", duration: 1 });
```

**DrawSVGPlugin** — Animate SVG stroke:
```js
gsap.from(".line", { drawSVG: "0%", duration: 1 });
gsap.to(".line", { drawSVG: "20% 80%", duration: 1 });
```

**ScrollSmoother** — Smooth scrolling wrapper for ScrollTrigger:
```js
ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 1,           // seconds
  effects: true,       // enable data-speed and data-lag attributes
  smoothTouch: 0.1,
  normalizeScroll: true,
});
```

**ScrambleTextPlugin** — Scramble text effect:
```js
gsap.to(".text", { scrambleText: { text: "DECODED", chars: "XO", speed: 0.3 } });
```

**InertiaPlugin** — Physics-based momentum (used with Draggable):
```js
// Automatically handles throw velocity in Draggable when inertia: true
```

---

## 9. ScrollTrigger Advanced Patterns

### Pinning

```js
gsap.to(".panel", {
  xPercent: -100,
  scrollTrigger: {
    trigger: ".container",
    start: "top top",
    end: () => "+=" + document.querySelector(".container").offsetWidth,
    scrub: 1,
    pin: true,
    anticipatePin: 1,
    pinSpacing: true,
  }
});
```

### Horizontal Scroll

```js
const sections = gsap.utils.toArray(".panel");

gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".panels-container",
    pin: true,
    scrub: 1,
    snap: 1 / (sections.length - 1),
    end: () => "+=" + document.querySelector(".panels-container").offsetWidth,
  }
});
```

### Parallax

```js
gsap.to(".parallax-bg", {
  yPercent: -50,
  ease: "none",
  scrollTrigger: {
    trigger: ".parallax-section",
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  }
});
```

### Batch reveal

```js
ScrollTrigger.batch(".card", {
  onEnter: (batch) => gsap.to(batch, {
    opacity: 1,
    y: 0,
    stagger: 0.1,
    overwrite: true,
  }),
  onLeave: (batch) => gsap.set(batch, { opacity: 0, y: 50, overwrite: true }),
  onEnterBack: (batch) => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.1, overwrite: true }),
  onLeaveBack: (batch) => gsap.set(batch, { opacity: 0, y: 50, overwrite: true }),
  start: "top 85%",
  end: "bottom 15%",
});
```

### Integration with Lenis / Locomotive Scroll

```js
// With Lenis smooth scroll:
import Lenis from "@studio-freight/lenis";

const lenis = new Lenis();

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
```

---

## 10. React / Next.js Integration

### Install

```bash
npm install gsap @gsap/react
```

### useGSAP Hook

The official hook for using GSAP in React. Replaces manual useEffect + cleanup pattern.

```jsx
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

function MyComponent() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // All GSAP animations here are auto-scoped to containerRef
    // and auto-cleaned-up on unmount

    gsap.to(".box", { x: 200, duration: 1 });
    gsap.from(".title", { opacity: 0, y: -50 });

    // Timelines work too
    const tl = gsap.timeline();
    tl.to(".a", { x: 100 })
      .to(".b", { y: 100 }, "<");

  }, { scope: containerRef }); // scope = selectors resolve within this ref

  return (
    <div ref={containerRef}>
      <h1 className="title">Hello</h1>
      <div className="box">Box</div>
      <div className="a">A</div>
      <div className="b">B</div>
    </div>
  );
}
```

### useGSAP API

```js
useGSAP(callback, config);
```

**Config options:**

| Property | Type | Description |
|---|---|---|
| `scope` | Ref | Scopes all selector-based targets to this element |
| `dependencies` | Array | Like useEffect deps — re-runs when changed |
| `revertOnUpdate` | Boolean | Revert previous animations before re-running (default: true when deps provided) |

```jsx
// With dependencies (re-runs when count changes)
useGSAP(() => {
  gsap.to(".box", { x: count * 100 });
}, { scope: containerRef, dependencies: [count] });

// No dependencies = runs once on mount, cleans up on unmount
useGSAP(() => {
  gsap.to(".box", { x: 200 });
}, { scope: containerRef });
```

### Returning context for external control

```jsx
function MyComponent() {
  const containerRef = useRef(null);

  const { context, contextSafe } = useGSAP({ scope: containerRef });

  // contextSafe wraps event handlers so their animations are cleaned up
  const handleClick = contextSafe(() => {
    gsap.to(".box", { rotation: "+=360" });
  });

  return (
    <div ref={containerRef}>
      <div className="box" onClick={handleClick}>Click me</div>
    </div>
  );
}
```

### contextSafe — Event Handlers

Any GSAP animation created OUTSIDE of the useGSAP callback (e.g., in event handlers) must be wrapped with `contextSafe` to ensure proper cleanup:

```jsx
const { contextSafe } = useGSAP({ scope: containerRef });

// CORRECT — animation is tracked for cleanup
const onMouseEnter = contextSafe(() => {
  gsap.to(".box", { scale: 1.2 });
});

// WRONG — animation leaks, not cleaned up on unmount
const onMouseEnter = () => {
  gsap.to(".box", { scale: 1.2 }); // memory leak!
};
```

### ScrollTrigger in React

```jsx
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

function ScrollSection() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.from(".card", {
      y: 100,
      opacity: 0,
      stagger: 0.2,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      }
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef}>
      <div className="card">Card 1</div>
      <div className="card">Card 2</div>
      <div className="card">Card 3</div>
    </section>
  );
}
```

### Next.js App Router (Server Components)

GSAP only works on the client. Mark components with `"use client"`:

```jsx
"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedSection() {
  const ref = useRef(null);

  useGSAP(() => {
    gsap.from(".fade-in", {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.15,
      scrollTrigger: {
        trigger: ref.current,
        start: "top 85%",
      }
    });
  }, { scope: ref });

  return (
    <section ref={ref}>
      <h2 className="fade-in">Title</h2>
      <p className="fade-in">Content</p>
    </section>
  );
}
```

### gsap.matchMedia() in React

```jsx
useGSAP(() => {
  const mm = gsap.matchMedia();

  mm.add("(min-width: 768px)", () => {
    gsap.to(".box", { x: 200 });
  });

  mm.add("(max-width: 767px)", () => {
    gsap.to(".box", { y: 100 });
  });

  mm.add("(prefers-reduced-motion: reduce)", () => {
    // Respect user preference
    gsap.set(".box", { clearProps: "all" });
  });

  // mm.revert() is handled automatically by useGSAP cleanup
}, { scope: containerRef });
```

### Animating Component Mount/Unmount

```jsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function Modal({ isOpen, onClose }) {
  const overlayRef = useRef(null);

  useGSAP(() => {
    if (isOpen) {
      gsap.fromTo(overlayRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, { dependencies: [isOpen] });

  const handleClose = () => {
    gsap.to(overlayRef.current, {
      opacity: 0,
      scale: 0.9,
      duration: 0.2,
      onComplete: onClose,
    });
  };

  if (!isOpen) return null;

  return (
    <div ref={overlayRef} className="modal-overlay">
      <div className="modal-content">
        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
}
```

---

## 11. Best Practices & Gotchas

### Performance

1. **Use transforms** (`x`, `y`, `scale`, `rotation`) instead of layout properties (`top`, `left`, `width`, `height`) — transforms are GPU-accelerated and don't trigger layout recalculation.

2. **`will-change` is handled automatically** by GSAP when using transforms. Don't add it manually.

3. **`force3D: "auto"`** (default) — GSAP auto-adds `translateZ(0)` during animation for GPU acceleration, removes it when done.

4. **Use `gsap.quickTo()`** for high-frequency updates (mousemove, scroll) instead of creating new tweens.

5. **Avoid animating `filter`** (blur, brightness, etc.) on large elements — very expensive.

6. **Use `autoAlpha` instead of `opacity`** — it also sets `visibility: hidden` at 0, removing the element from accessibility tree and allowing click-through.

### Memory & Cleanup

7. **Always clean up in React** — use `useGSAP` hook or `gsap.context()` with `.revert()`.

8. **Kill ScrollTriggers** when components unmount. `useGSAP` handles this automatically.

9. **Don't create tweens in render functions** — only in useGSAP/useEffect or event handlers wrapped with `contextSafe`.

### Common Gotchas

10. **`.from()` immediateRender** — defaults to `true`. If sequencing `.from()` tweens in a timeline, this can cause visual jumps. Use `immediateRender: false` when needed:
    ```js
    tl.from(".box", { x: -100, immediateRender: false });
    ```

11. **Conflicting tweens** — if two tweens target the same property, use `overwrite: "auto"` or `overwrite: true`:
    ```js
    gsap.defaults({ overwrite: "auto" });
    ```

12. **React Strict Mode** — React 18 double-invokes effects in development. `useGSAP` handles this correctly (unlike raw useEffect).

13. **SSR/Hydration** — GSAP modifies inline styles, which can cause hydration mismatches. Always use `"use client"` for animated components in Next.js App Router.

14. **Selectors in React** — Use the `scope` option in `useGSAP` to scope CSS selectors to the component's container. Without scope, `".box"` will select ALL `.box` elements globally.

15. **ScrollTrigger.refresh()** — Call after dynamic content loads (images, data) that changes page height:
    ```js
    ScrollTrigger.refresh();
    ```

16. **Next.js dynamic import** for heavy plugins:
    ```jsx
    import dynamic from "next/dynamic";
    const HeavyAnimation = dynamic(() => import("./HeavyAnimation"), { ssr: false });
    ```

17. **Revert before re-animating** — When re-running animations (state changes), call `.revert()` first or use `revertOnUpdate: true` in useGSAP.

18. **Timeline `.reversed()`** — To toggle a timeline:
    ```js
    const tl = gsap.timeline({ paused: true });
    // ... build timeline
    // Toggle:
    tl.reversed(!tl.reversed());
    ```

19. **Units** — GSAP defaults to `px` for positional values. Use strings for other units:
    ```js
    gsap.to(".box", { width: "50vw", height: "100%" });
    ```

20. **CSS variables**:
    ```js
    gsap.to(":root", { "--my-color": "#ff0000", duration: 1 });
    gsap.to(".box", { "--radius": "50%", duration: 1 });
    ```

---

## Quick Reference Cheat Sheet

```js
// === CORE ===
gsap.to(target, { ...props, duration, ease, delay, stagger, repeat, yoyo, onComplete })
gsap.from(target, { ...props })
gsap.fromTo(target, { ...fromProps }, { ...toProps })
gsap.set(target, { ...props })
gsap.killTweensOf(target)

// === TIMELINE ===
const tl = gsap.timeline({ defaults: { duration: 1 } })
tl.to(el, { x: 100 })
  .to(el, { y: 100 }, "<")        // same time as previous
  .to(el, { rotation: 360 }, "-=0.5")  // overlap 0.5s
  .addLabel("mid")
  .to(el, { scale: 2 }, "mid+=0.3")
tl.play() / .pause() / .reverse() / .restart() / .seek(time) / .progress(0.5)

// === SCROLLTRIGGER ===
gsap.to(el, { x: 100, scrollTrigger: { trigger, start, end, scrub, pin, markers } })
ScrollTrigger.create({ trigger, start, end, onEnter, onLeave, toggleClass })
ScrollTrigger.batch(els, { onEnter, start })
ScrollTrigger.refresh()

// === REACT ===
import { useGSAP } from "@gsap/react"
const { contextSafe } = useGSAP(() => { /* animations */ }, { scope: ref })
const handler = contextSafe(() => { gsap.to(...) })

// === UTILITIES ===
gsap.utils.toArray(selector)
gsap.utils.clamp(min, max, value)
gsap.utils.mapRange(inMin, inMax, outMin, outMax, value)
gsap.utils.snap(increment, value)
gsap.utils.random(min, max, snap)
gsap.quickTo(target, prop, { duration, ease })
gsap.context(() => { /* scoped animations */ }, scopeRef)
gsap.matchMedia().add(query, () => { /* responsive */ })
```
