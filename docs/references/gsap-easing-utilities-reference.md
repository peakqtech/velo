# GSAP Easing, Utilities & API Reference

> Compiled from GSAP v3.x documentation (gsap.com/docs/v3).
> Covers: Eases, gsap.utils, gsap.matchMedia(), gsap.context(), core tween/timeline API, and common patterns.

---

## 1. EASING FUNCTIONS

### 1.1 Ease Syntax

```js
gsap.to(".box", { duration: 1, x: 100, ease: "power2.out" });
```

Every ease has three variants:
- `.in` — starts slow, accelerates
- `.out` — starts fast, decelerates (default for most)
- `.inOut` — slow at both ends, fast in the middle

### 1.2 Built-in Eases (Free)

| Ease Name | Aliases | Behavior |
|-----------|---------|----------|
| `"none"` | `"linear"`, `"power0"` | Constant speed, no acceleration |
| `"power1"` | `"quad"` | Subtle acceleration (exponent 2) |
| `"power2"` | `"cubic"` | Moderate acceleration (exponent 3) |
| `"power3"` | `"quart"` | Strong acceleration (exponent 4) |
| `"power4"` | `"quint"`, `"strong"` | Very strong acceleration (exponent 5) |
| `"back"` | — | Overshoots then settles. Config: `"back(1.7)"` where param = overshoot amount |
| `"bounce"` | — | Bounces like a ball hitting the floor |
| `"circ"` | — | Circular motion curve (quarter-circle) |
| `"elastic"` | — | Spring-like oscillation. Config: `"elastic(1, 0.3)"` = (amplitude, period) |
| `"expo"` | — | Exponential, very dramatic acceleration |
| `"sine"` | — | Gentle sinusoidal curve, subtler than power1 |
| `"steps(n)"` | `"stepped"` | Jumps in `n` discrete steps. `"steps(12)"` |

#### Ease Configuration Syntax

```js
// Back with custom overshoot (default 1.7)
ease: "back.out(2.5)"

// Elastic with amplitude and period
ease: "elastic.out(1, 0.5)"   // amplitude=1, period=0.5
ease: "elastic.inOut(1, 0.2)"

// Steps
ease: "steps(5)"  // 5 discrete steps
```

### 1.3 Club/Bonus Eases (GSAP Club)

| Ease | Description | Config |
|------|-------------|--------|
| `CustomEase` | Draw any curve via SVG path or control points | `CustomEase.create("myEase", "M0,0 C0.5,0 0.5,1 1,1")` |
| `CustomBounce` | Fine-tuned bounce curves | `CustomBounce.create("myBounce", { strength: 0.7, squash: 3 })` |
| `CustomWiggle` | Oscillating wiggle patterns | `CustomWiggle.create("myWiggle", { wiggles: 6, type: "easeOut" })` |
| `RoughEase` | Randomized rough/shaky motion | `"rough({ strength: 1.5, points: 20, taper: 'out' })"` |
| `SlowMo` | Slow-motion middle section | `"slow(0.7, 0.7, false)"` = (linearRatio, power, yoyoMode) |
| `ExpoScaleEase` | Exponential scaling between two values | `ExpoScaleEase.create(1, 10)` |

### 1.4 CustomEase Deep Dive

```js
// Register the plugin
gsap.registerPlugin(CustomEase);

// Create from SVG path data
CustomEase.create("myEase", "M0,0 C0.126,0.382 0.282,0.674 0.44,0.822 0.632,1.002 0.818,1.001 1,1");

// Use it
gsap.to(".box", { duration: 2, x: 500, ease: "myEase" });

// Get an ease from existing ease and modify
CustomEase.create("modifiedBounce", CustomEase.getSVGData("bounce.out"));

// Convert any ease to SVG path for visualization
let svgPath = CustomEase.getSVGData("power2.inOut", { width: 500, height: 400 });
```

### 1.5 Ease Visual Behavior Guide

| Use Case | Recommended Ease |
|----------|-----------------|
| UI element enter/appear | `"power2.out"` or `"back.out(1.7)"` |
| UI element exit/disappear | `"power2.in"` |
| Hover/micro-interaction | `"power1.out"` or `"sine.out"` |
| Bounce landing | `"bounce.out"` |
| Elastic spring | `"elastic.out(1, 0.3)"` |
| Dramatic reveal | `"expo.out"` |
| Natural motion | `"sine.inOut"` |
| Modal open | `"back.out(1.4)"` |
| Smooth scroll | `"power2.inOut"` |
| Loading spinner | `"none"` (linear) |
| Page transitions | `"power3.inOut"` or `"expo.inOut"` |

---

## 2. GSAP UTILITY METHODS (`gsap.utils.*`)

### 2.1 `gsap.utils.checkPrefix(property)`

Returns the browser-prefixed version of a CSS property, or the original if no prefix needed.

```js
gsap.utils.checkPrefix("transform");    // "transform" or "webkitTransform"
gsap.utils.checkPrefix("filter");       // "filter" or "webkitFilter"
```

### 2.2 `gsap.utils.clamp(min, max, value)`

Clamps a value within a range. Can be called with 2 args to get a reusable function.

```js
gsap.utils.clamp(0, 100, 150);    // 100
gsap.utils.clamp(0, 100, -20);    // 0
gsap.utils.clamp(0, 100, 50);     // 50

// Reusable function form
const clampProgress = gsap.utils.clamp(0, 1);
clampProgress(1.5);   // 1
clampProgress(-0.2);  // 0
```

### 2.3 `gsap.utils.distribute(config)`

Distributes a value among an array of elements based on position. Useful for staggers.

```js
gsap.to(".box", {
  y: gsap.utils.distribute({
    base: 0,
    amount: 200,       // total amount to distribute
    from: "center",    // "start", "center", "end", "edges", "random", or index number
    grid: "auto",      // "auto" or [cols, rows]
    axis: "y",         // "x", "y", or null for both
    ease: "power2.in"  // distribution ease
  })
});
```

### 2.4 `gsap.utils.getUnit(value)`

Extracts the unit from a value string.

```js
gsap.utils.getUnit("50px");    // "px"
gsap.utils.getUnit("30%");     // "%"
gsap.utils.getUnit("10vw");    // "vw"
gsap.utils.getUnit("5");       // ""
gsap.utils.getUnit(5);         // ""
```

### 2.5 `gsap.utils.interpolate(start, end, progress)`

Interpolates between two values (numbers, colors, strings with numbers, objects, arrays).

```js
// Numbers
gsap.utils.interpolate(0, 100, 0.5);      // 50

// Colors
gsap.utils.interpolate("red", "blue", 0.5);  // "rgba(128,0,128,1)"

// Strings with numbers
gsap.utils.interpolate("20px", "100px", 0.5);  // "60px"

// Objects
gsap.utils.interpolate(
  { x: 0, y: 0 },
  { x: 100, y: 200 },
  0.5
);  // { x: 50, y: 100 }

// Arrays (cycles through values)
gsap.utils.interpolate([0, 50, 100], 0.5);  // 50

// Reusable function form
const interp = gsap.utils.interpolate(0, 500);
interp(0.25);  // 125
interp(0.75);  // 375
```

### 2.6 `gsap.utils.mapRange(inMin, inMax, outMin, outMax, value)`

Maps a value from one range to another.

```js
gsap.utils.mapRange(0, 100, 0, 1, 50);      // 0.5
gsap.utils.mapRange(-10, 10, 0, 100, 0);     // 50
gsap.utils.mapRange(0, 1, -100, 100, 0.75);  // 50

// Reusable function form (omit last arg)
const pixelToPercent = gsap.utils.mapRange(0, 1920, 0, 100);
pixelToPercent(960);  // 50
```

### 2.7 `gsap.utils.normalize(min, max, value)`

Normalizes a value to 0-1 range.

```js
gsap.utils.normalize(100, 200, 150);  // 0.5
gsap.utils.normalize(0, 500, 250);    // 0.5

// Reusable function form
const norm = gsap.utils.normalize(0, 255);
norm(127.5);  // 0.5
```

### 2.8 `gsap.utils.pipe(...functions)`

Pipes a value through a series of functions (functional composition, left-to-right).

```js
const transformer = gsap.utils.pipe(
  gsap.utils.clamp(0, 100),       // clamp between 0-100
  gsap.utils.snap(5),             // snap to nearest 5
  gsap.utils.interpolate(0, 1),   // not valid like this, but conceptually
  (val) => Math.round(val)        // custom function
);

// More practical example:
const processScroll = gsap.utils.pipe(
  gsap.utils.clamp(0, 1),
  gsap.utils.mapRange(0, 1, 0, 100),
  gsap.utils.snap(10)
);
processScroll(0.55);  // 60
```

### 2.9 `gsap.utils.random(min, max, snapIncrement?, returnFunction?)`

Generates random numbers, optionally snapped.

```js
gsap.utils.random(0, 100);        // random float between 0-100
gsap.utils.random(0, 100, 5);     // random number snapped to nearest 5
gsap.utils.random(0, 100, 1);     // random integer

// Array form — picks random element
gsap.utils.random(["red", "blue", "green"]);  // random array element

// Reusable function form (pass true as last arg)
const randomX = gsap.utils.random(-200, 200, 1, true);
randomX();  // different random integer each call

// Use in animations
gsap.to(".star", {
  x: "random(-200, 200, 5)",   // string-based shorthand
  y: "random(-100, 100)",
  duration: 1,
  stagger: 0.1
});
```

### 2.10 `gsap.utils.selector(scope)`

Returns a scoped selector function. Useful in React/frameworks.

```js
const q = gsap.utils.selector(myRef);  // or a DOM element

// Now q() searches only within myRef
gsap.to(q(".box"), { x: 100 });
gsap.to(q(".title"), { opacity: 1 });

// React example
function MyComponent() {
  const el = useRef();
  const q = gsap.utils.selector(el);

  useEffect(() => {
    gsap.to(q(".inner"), { x: 100 });
  }, []);

  return <div ref={el}><div className="inner">Hello</div></div>;
}
```

### 2.11 `gsap.utils.shuffle(array)`

Shuffles an array in place (Fisher-Yates algorithm). Returns the same array.

```js
const arr = [1, 2, 3, 4, 5];
gsap.utils.shuffle(arr);  // [3, 1, 5, 2, 4] (random order)
```

### 2.12 `gsap.utils.snap(snapValue, value)`

Snaps a value to the nearest increment, or to the nearest value in an array.

```js
// Snap to increment
gsap.utils.snap(5, 13);     // 15
gsap.utils.snap(10, 23);    // 20
gsap.utils.snap(100, 340);  // 300

// Snap to nearest array value
gsap.utils.snap([0, 50, 100, 200], 65);  // 50
gsap.utils.snap([0, 50, 100, 200], 80);  // 100

// Object form with radius
gsap.utils.snap({ values: [0, 100, 200], radius: 20 }, 85);  // 85 (not snapped, outside radius)
gsap.utils.snap({ values: [0, 100, 200], radius: 20 }, 95);  // 100 (within radius)

// 2D point snapping
gsap.utils.snap({ values: [{x:0,y:0}, {x:100,y:100}], radius: 50 }, {x:45, y:45});

// Reusable function form
const snap5 = gsap.utils.snap(5);
snap5(13);  // 15
snap5(11);  // 10
```

### 2.13 `gsap.utils.splitColor(color, returnHSL?)`

Splits a color into its RGB (or HSL) components.

```js
gsap.utils.splitColor("red");              // [255, 0, 0]
gsap.utils.splitColor("#ff0000");          // [255, 0, 0]
gsap.utils.splitColor("rgb(255,0,0)");     // [255, 0, 0]
gsap.utils.splitColor("rgba(255,0,0,0.5)"); // [255, 0, 0, 0.5]
gsap.utils.splitColor("hsl(120,50%,50%)", true);  // [120, 50, 50]
gsap.utils.splitColor("red", true);        // [0, 100, 50] (HSL)
```

### 2.14 `gsap.utils.toArray(targets)`

Converts various target types to a flat Array.

```js
gsap.utils.toArray(".box");              // [element, element, ...]
gsap.utils.toArray(nodeList);            // [element, element, ...]
gsap.utils.toArray(jQueryObject);        // [element, element, ...]
gsap.utils.toArray("[data-animate]");    // all matching elements
gsap.utils.toArray(".box, .circle");     // combined selector

// With scope (2nd param)
gsap.utils.toArray(".item", myContainer);  // only .items inside myContainer
```

### 2.15 `gsap.utils.unitize(function, unit?)`

Wraps a function so its return value gets a specific unit appended.

```js
const clampPx = gsap.utils.unitize(gsap.utils.clamp(0, 100), "px");
clampPx(130);  // "100px"

const mapPx = gsap.utils.unitize(gsap.utils.mapRange(0, 1, 0, 500), "px");
mapPx(0.5);    // "250px"

// Auto-detects unit from first value if no unit specified
const clampAuto = gsap.utils.unitize(gsap.utils.clamp(0, 100));
```

### 2.16 `gsap.utils.wrap(min, max, value)` / `gsap.utils.wrap(array, index)`

Wraps a value within a range (like modulo) or cycles through an array.

```js
// Range wrapping
gsap.utils.wrap(0, 100, 120);   // 20
gsap.utils.wrap(0, 100, -30);   // 70
gsap.utils.wrap(0, 100, 200);   // 0
gsap.utils.wrap(5, 10, 12);     // 7

// Array wrapping (cycles)
gsap.utils.wrap(["red", "green", "blue"], 0);  // "red"
gsap.utils.wrap(["red", "green", "blue"], 3);  // "red"
gsap.utils.wrap(["red", "green", "blue"], 4);  // "green"

// Reusable function form
const wrapColor = gsap.utils.wrap(["red", "green", "blue"]);
wrapColor(0);  // "red"
wrapColor(5);  // "blue" (5 % 3 = 2)

// Great for stagger colors
gsap.to(".box", {
  backgroundColor: gsap.utils.wrap(["red", "green", "blue"]),
  stagger: 0.1
});
```

### 2.17 `gsap.utils.wrapYoyo(min, max, value)` / `gsap.utils.wrapYoyo(array, index)`

Like wrap but goes back and forth (yoyo) instead of jumping.

```js
gsap.utils.wrapYoyo(0, 100, 120);  // 80 (bounces back)
gsap.utils.wrapYoyo(0, 100, 250);  // 50

// Array yoyo
gsap.utils.wrapYoyo(["a","b","c","d"], 0);  // "a"
gsap.utils.wrapYoyo(["a","b","c","d"], 3);  // "d"
gsap.utils.wrapYoyo(["a","b","c","d"], 4);  // "c" (bouncing back)
gsap.utils.wrapYoyo(["a","b","c","d"], 5);  // "b"
gsap.utils.wrapYoyo(["a","b","c","d"], 6);  // "a"

// Reusable function form
const yoyoColor = gsap.utils.wrapYoyo(["#000", "#333", "#666", "#999", "#fff"]);
```

---

## 3. `gsap.matchMedia()` — Responsive Animations

### 3.1 Overview

`gsap.matchMedia()` creates responsive animations that automatically **revert and recreate** when breakpoints change. Based on the standard `window.matchMedia()` API.

### 3.2 Basic Syntax

```js
let mm = gsap.matchMedia();

mm.add("(min-width: 800px)", () => {
  // This code only runs when viewport >= 800px
  // Animations created here auto-revert when condition becomes false
  gsap.to(".box", { x: 200 });

  return () => {
    // optional cleanup function (runs when condition becomes false)
  };
});

mm.add("(max-width: 799px)", () => {
  // Mobile animations
  gsap.to(".box", { x: 50 });
});
```

### 3.3 Multiple Conditions (Object Syntax)

```js
let mm = gsap.matchMedia();

mm.add({
  // Define conditions
  isDesktop: "(min-width: 1024px)",
  isMobile: "(max-width: 767px)",
  isTablet: "(min-width: 768px) and (max-width: 1023px)",
  reduceMotion: "(prefers-reduced-motion: reduce)"
}, (context) => {
  // Destructure the conditions
  let { isDesktop, isMobile, isTablet, reduceMotion } = context.conditions;

  if (isDesktop) {
    gsap.to(".hero", { x: 200, duration: reduceMotion ? 0 : 1 });
  }

  if (isMobile) {
    gsap.to(".hero", { x: 50, duration: 0.5 });
  }

  if (isTablet) {
    gsap.to(".hero", { x: 100, duration: 0.75 });
  }

  return () => {
    // cleanup
  };
});
```

### 3.4 With ScrollTrigger

```js
let mm = gsap.matchMedia();

mm.add("(min-width: 800px)", () => {
  gsap.to(".panel", {
    scrollTrigger: {
      trigger: ".panel",
      start: "top center",
      end: "bottom center",
      scrub: 1,
      pin: true
    },
    x: 500
  });
  // ScrollTrigger is auto-reverted when breakpoint no longer matches
});

mm.add("(max-width: 799px)", () => {
  gsap.to(".panel", {
    scrollTrigger: {
      trigger: ".panel",
      start: "top bottom",
      end: "top center",
      scrub: true
    },
    opacity: 1,
    y: 0
  });
});
```

### 3.5 React Integration

```jsx
import { useEffect, useRef } from "react";
import gsap from "gsap";

function ResponsiveComponent() {
  const containerRef = useRef();

  useEffect(() => {
    const mm = gsap.matchMedia(containerRef);  // scope to container

    mm.add("(min-width: 768px)", () => {
      gsap.from(".card", {
        y: 100,
        opacity: 0,
        stagger: 0.2,
        scrollTrigger: { trigger: ".cards-container", start: "top 80%" }
      });
    });

    mm.add("(max-width: 767px)", () => {
      gsap.from(".card", { y: 50, opacity: 0, stagger: 0.1 });
    });

    return () => mm.revert();  // cleanup on unmount
  }, []);

  return <div ref={containerRef}>{/* ... */}</div>;
}
```

### 3.6 `prefers-reduced-motion` Support

```js
mm.add("(prefers-reduced-motion: no-preference)", () => {
  // Full animations only for users who haven't requested reduced motion
  gsap.to(".hero-title", {
    y: 0,
    opacity: 1,
    duration: 1.2,
    ease: "power3.out"
  });
});

mm.add("(prefers-reduced-motion: reduce)", () => {
  // Instant or minimal animations
  gsap.set(".hero-title", { y: 0, opacity: 1 });
});
```

### 3.7 Key Methods

| Method | Description |
|--------|-------------|
| `mm.add(condition, callback)` | Register animations for a media query |
| `mm.add(conditionsObj, callback)` | Register with named conditions |
| `mm.revert()` | Kill all animations and revert to pre-animation state |
| `context.conditions` | Object with boolean values for each named condition |

---

## 4. `gsap.context()` — Scoped Animation Cleanup

### 4.1 Overview

`gsap.context()` collects all GSAP animations and ScrollTriggers created within it, making cleanup trivial. Essential for React, Vue, and other frameworks.

### 4.2 Basic Syntax

```js
let ctx = gsap.context(() => {
  // All animations created here are collected
  gsap.to(".box", { x: 100 });
  gsap.to(".circle", { rotation: 360 });

  ScrollTrigger.create({ trigger: ".section", ... });
});

// Later: revert ALL collected animations at once
ctx.revert();
```

### 4.3 Scope Parameter (Selector Scoping)

```js
// 2nd parameter scopes all selector strings to that element
let ctx = gsap.context(() => {
  // ".box" only matches elements INSIDE containerRef.current
  gsap.to(".box", { x: 100 });
  gsap.to(".title", { opacity: 1 });
}, containerRef);  // React ref or DOM element

ctx.revert();
```

### 4.4 React/Next.js Integration Pattern

```jsx
import { useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";

// Use useLayoutEffect for DOM-dependent animations to avoid flash
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function AnimatedComponent() {
  const container = useRef();

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // All selectors are scoped to container.current
      gsap.from(".heading", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      });

      gsap.from(".card", {
        y: 80,
        opacity: 0,
        stagger: 0.15,
        duration: 0.6,
        delay: 0.3,
        ease: "power2.out"
      });
    }, container);  // <-- scope

    return () => ctx.revert();  // <-- cleanup
  }, []);

  return (
    <div ref={container}>
      <h1 className="heading">Title</h1>
      <div className="card">Card 1</div>
      <div className="card">Card 2</div>
    </div>
  );
}
```

### 4.5 Adding to Existing Context (`.add()`)

```js
const ctx = gsap.context(() => {
  gsap.to(".box", { x: 100 });
}, container);

// Later, add more animations to the same context (e.g., event handlers)
ctx.add(() => {
  gsap.to(".box", { rotation: 360 });
});

// Event handler pattern
const handleClick = () => {
  ctx.add(() => {
    gsap.to(".modal", { opacity: 1, scale: 1, duration: 0.3 });
  });
};

// Cleanup still reverts everything
ctx.revert();
```

### 4.6 Named Functions with Context

```js
const ctx = gsap.context((self) => {
  // Define reusable methods via self.add()
  self.add("animateIn", () => {
    gsap.from(".box", { y: 100, opacity: 0 });
  });

  self.add("animateOut", () => {
    gsap.to(".box", { y: -100, opacity: 0 });
  });
}, container);

// Call named methods later
ctx.animateIn();
ctx.animateOut();

// Still cleans up everything
ctx.revert();
```

### 4.7 Context with matchMedia

```js
useIsomorphicLayoutEffect(() => {
  const ctx = gsap.context(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      gsap.to(".sidebar", { x: 0 });
    });

    mm.add("(max-width: 767px)", () => {
      gsap.to(".sidebar", { x: -300 });
    });
  }, container);

  return () => ctx.revert();
}, []);
```

### 4.8 Key Methods

| Method | Description |
|--------|-------------|
| `ctx.revert()` | Reverts all collected animations, kills ScrollTriggers |
| `ctx.add(fn)` | Add more animations to existing context |
| `ctx.add(name, fn)` | Add named function to context |
| `ctx.kill()` | Same as revert but doesn't revert inline styles |
| `ctx.clear()` | Removes references without killing animations |
| `ctx.ignore(fn)` | Run function without collecting its animations |

---

## 5. CORE TWEEN & TIMELINE API

### 5.1 Tween Methods

```js
// gsap.to() — animate FROM current values TO specified values
gsap.to(".box", { duration: 1, x: 200, opacity: 0.5, ease: "power2.out" });

// gsap.from() — animate FROM specified values TO current values
gsap.from(".box", { duration: 1, y: 100, opacity: 0, ease: "power2.out" });

// gsap.fromTo() — specify both start and end values
gsap.fromTo(".box",
  { x: 0, opacity: 0 },      // from
  { x: 200, opacity: 1, duration: 1, ease: "power2.out" }  // to
);

// gsap.set() — immediately set properties (duration: 0)
gsap.set(".box", { x: 100, opacity: 0.5, transformOrigin: "center center" });
```

### 5.2 Special Properties

| Property | Type | Description |
|----------|------|-------------|
| `duration` | Number | Duration in seconds (default: 0.5) |
| `delay` | Number | Delay before start in seconds |
| `ease` | String/Function | Easing function |
| `repeat` | Number | Number of repeats (-1 = infinite) |
| `repeatDelay` | Number | Delay between repeats |
| `yoyo` | Boolean | Reverse on alternate repeats |
| `stagger` | Number/Object | Stagger start times for multiple targets |
| `overwrite` | String/Boolean | `"auto"`, `true`, or `false` |
| `paused` | Boolean | Start paused |
| `immediateRender` | Boolean | Render immediately (default true for `from()`) |
| `lazy` | Boolean | Delay rendering until next tick |
| `id` | String | Identifier for `gsap.getById()` |
| `inherit` | Boolean | Inherit parent timeline defaults |
| `reversed` | Boolean | Start in reversed state |

### 5.3 Callback Properties

| Callback | Description |
|----------|-------------|
| `onComplete` | Fires when animation completes |
| `onCompleteParams` | Array of params for onComplete |
| `onStart` | Fires when animation starts |
| `onStartParams` | Array of params for onStart |
| `onUpdate` | Fires on every frame update |
| `onUpdateParams` | Array of params for onUpdate |
| `onRepeat` | Fires on each repeat |
| `onRepeatParams` | Array of params for onRepeat |
| `onReverseComplete` | Fires when reversed playback completes |
| `onReverseCompleteParams` | Array of params for onReverseComplete |

### 5.4 Animatable CSS Properties

```js
// Transform shorthand (GPU-accelerated)
{ x: 100 }             // translateX(100px)
{ y: 100 }             // translateY(100px)
{ z: 100 }             // translateZ(100px)
{ xPercent: -50 }      // translateX(-50%)
{ yPercent: -50 }      // translateY(-50%)
{ rotation: 360 }      // rotate(360deg)
{ rotationX: 45 }      // rotateX(45deg)
{ rotationY: 45 }      // rotateY(45deg)
{ scale: 2 }           // scale(2)
{ scaleX: 1.5 }        // scaleX(1.5)
{ scaleY: 0.5 }        // scaleY(0.5)
{ skewX: 20 }          // skewX(20deg)
{ skewY: 10 }          // skewY(10deg)
{ transformOrigin: "50% 50%" }
{ transformPerspective: 500 }

// Standard CSS
{ opacity: 0.5 }
{ width: "50%" }
{ height: 200 }
{ borderRadius: "50%" }
{ backgroundColor: "#ff0000" }
{ color: "blue" }
{ fontSize: 24 }
{ padding: 20 }
{ margin: "10px 20px" }
{ boxShadow: "0px 10px 30px rgba(0,0,0,0.3)" }
{ clipPath: "circle(50%)" }
{ filter: "blur(10px)" }

// SVG
{ attr: { cx: 100, cy: 200, r: 50 } }
{ drawSVG: "0% 100%" }  // DrawSVGPlugin
{ morphSVG: "#shape2" }  // MorphSVGPlugin
```

### 5.5 Stagger Configuration

```js
// Simple stagger (seconds between each)
gsap.to(".box", { x: 100, stagger: 0.1 });

// Advanced stagger object
gsap.to(".box", {
  x: 100,
  stagger: {
    each: 0.1,           // time between each (OR use 'amount' for total time)
    amount: 1,            // total stagger time spread across all elements
    from: "center",       // "start", "center", "end", "edges", "random", or index
    grid: "auto",         // [cols, rows] or "auto"
    axis: "x",            // "x", "y", or null
    ease: "power2.in",    // stagger distribution ease
    repeat: -1,           // repeat for each element
    yoyo: true            // yoyo for each element
  }
});
```

### 5.6 Tween Control Methods

```js
let tween = gsap.to(".box", { x: 100, paused: true });

tween.play();              // play from current position
tween.pause();             // pause
tween.resume();            // resume from paused position
tween.reverse();           // reverse playback
tween.restart();           // restart from beginning
tween.seek(0.5);           // seek to time (seconds)
tween.progress(0.5);       // seek to progress (0-1)
tween.timeScale(2);        // double speed
tween.timeScale(0.5);      // half speed
tween.kill();              // destroy the tween
tween.invalidate();        // clear recorded start/end values
tween.then(() => {});      // Promise-based completion

// Getters
tween.duration();          // get duration
tween.progress();          // get current progress (0-1)
tween.time();              // get current time
tween.isActive();          // is currently animating?
tween.reversed();          // is reversed?
```

---

## 6. TIMELINE API

### 6.1 Creating Timelines

```js
const tl = gsap.timeline({
  defaults: { duration: 0.8, ease: "power2.out" },  // inherited by children
  paused: true,
  repeat: -1,
  yoyo: true,
  repeatDelay: 0.5,
  delay: 0.2,
  smoothChildTiming: true,
  onComplete: () => console.log("done"),
  onUpdate: () => console.log("update"),
});
```

### 6.2 Sequencing with Position Parameter

```js
const tl = gsap.timeline();

// Sequential (default) — each starts after previous ends
tl.to(".a", { x: 100, duration: 1 })
  .to(".b", { x: 100, duration: 1 })
  .to(".c", { x: 100, duration: 1 });

// Position parameter (3rd argument)
tl.to(".a", { x: 100 }, 0)           // absolute time: 0s
  .to(".b", { x: 100 }, 0.5)         // absolute time: 0.5s
  .to(".c", { x: 100 }, 1)           // absolute time: 1s

  .to(".d", { x: 100 }, "<")         // same start time as previous
  .to(".e", { x: 100 }, ">")         // after previous ends (default)

  .to(".f", { x: 100 }, "-=0.5")     // 0.5s before end of timeline
  .to(".g", { x: 100 }, "+=0.5")     // 0.5s after end of timeline

  .to(".h", { x: 100 }, "<0.2")      // 0.2s after start of previous
  .to(".i", { x: 100 }, ">-0.2")     // 0.2s before end of previous
;
```

### 6.3 Labels

```js
const tl = gsap.timeline();

tl.to(".a", { x: 100 })
  .addLabel("halfway")
  .to(".b", { x: 100 })
  .to(".c", { x: 100 }, "halfway")       // inserts at the label
  .to(".d", { x: 100 }, "halfway+=0.3")  // 0.3s after the label
;

tl.seek("halfway");
tl.tweenTo("halfway");
```

### 6.4 Timeline Methods

```js
tl.add(tween, position);         // add tween at position
tl.addLabel("name", position);   // add label
tl.addPause(position);           // auto-pause at position
tl.call(fn, params, position);   // call function at position
tl.set(target, vars, position);  // set values at position
tl.from(target, vars, pos);      // from at position
tl.fromTo(target, from, to, pos);// fromTo at position
tl.remove(tween);                // remove child tween
tl.removeLabel("name");          // remove label
tl.clear();                      // remove all children

// Nesting timelines
const masterTl = gsap.timeline();
const introTl = gsap.timeline();
const outroTl = gsap.timeline();

introTl.to(".logo", { opacity: 1 }).to(".tagline", { y: 0 });
outroTl.to(".logo", { opacity: 0 }).to(".tagline", { y: 50 });

masterTl
  .add(introTl)
  .addLabel("middle")
  .add(outroTl, "+=1");
```

---

## 7. COMMON ANIMATION PATTERNS & RECIPES

### 7.1 Scroll-triggered Reveal

```js
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".reveal").forEach((el) => {
  gsap.from(el, {
    y: 60,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: el,
      start: "top 85%",
      toggleActions: "play none none none"
    }
  });
});
```

### 7.2 Staggered Grid Entrance

```js
gsap.from(".grid-item", {
  y: 100,
  opacity: 0,
  duration: 0.6,
  ease: "power3.out",
  stagger: {
    amount: 0.8,
    from: "start",
    grid: "auto",
    axis: "y"
  },
  scrollTrigger: {
    trigger: ".grid",
    start: "top 80%"
  }
});
```

### 7.3 Parallax Scrolling

```js
gsap.to(".bg-layer", {
  yPercent: -30,
  ease: "none",
  scrollTrigger: {
    trigger: ".parallax-section",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});
```

### 7.4 Text Split Animation

```js
// Assuming SplitText plugin or manual splitting
const chars = document.querySelectorAll(".char");

gsap.from(chars, {
  y: 80,
  opacity: 0,
  rotationX: -90,
  stagger: 0.02,
  duration: 0.6,
  ease: "back.out(1.7)"
});
```

### 7.5 Horizontal Scroll

```js
const sections = gsap.utils.toArray(".panel");

gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".container",
    pin: true,
    scrub: 1,
    snap: 1 / (sections.length - 1),
    end: () => "+=" + document.querySelector(".container").offsetWidth
  }
});
```

### 7.6 Magnetic Hover Effect

```js
document.querySelectorAll(".magnetic").forEach((el) => {
  el.addEventListener("mousemove", (e) => {
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) * 0.3;
    const y = (e.clientY - top - height / 2) * 0.3;

    gsap.to(el, { x, y, duration: 0.3, ease: "power2.out" });
  });

  el.addEventListener("mouseleave", () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
  });
});
```

### 7.7 Loading/Spinner Animation

```js
const tl = gsap.timeline({ repeat: -1 });

tl.to(".spinner", {
  rotation: 360,
  duration: 1,
  ease: "none"
});
```

### 7.8 Number Counter

```js
const counter = { value: 0 };

gsap.to(counter, {
  value: 1000,
  duration: 2,
  ease: "power1.out",
  snap: { value: 1 },
  onUpdate: () => {
    document.querySelector(".counter").textContent = Math.round(counter.value);
  }
});
```

### 7.9 Morphing/Clip-path Animation

```js
gsap.to(".shape", {
  clipPath: "circle(50% at 50% 50%)",
  duration: 1,
  ease: "power2.inOut"
});
```

### 7.10 Page Transition Pattern

```js
function leaveAnimation() {
  const tl = gsap.timeline();
  tl.to(".page-content", { opacity: 0, y: -30, duration: 0.4 })
    .to(".page-overlay", { scaleY: 1, transformOrigin: "bottom", duration: 0.5, ease: "power2.inOut" });
  return tl;
}

function enterAnimation() {
  const tl = gsap.timeline();
  tl.from(".page-overlay", { scaleY: 1, transformOrigin: "top", duration: 0.5, ease: "power2.inOut" })
    .from(".page-content", { opacity: 0, y: 30, duration: 0.4 });
  return tl;
}
```

### 7.11 Infinite Marquee / Ticker

```js
function createMarquee(selector, speed = 50) {
  const el = document.querySelector(selector);
  const clone = el.innerHTML;
  el.innerHTML += clone;  // duplicate content

  const width = el.scrollWidth / 2;

  gsap.to(el, {
    x: -width,
    duration: width / speed,
    ease: "none",
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize(gsap.utils.wrap(-width, 0))
    }
  });
}
```

### 7.12 React Hook Pattern (Complete)

```jsx
import { useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useGsap(callback, deps = []) {
  const containerRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      callback(containerRef.current);
    }, containerRef);

    return () => ctx.revert();
  }, deps);

  return containerRef;
}

// Usage:
function MyComponent() {
  const ref = useGsap((container) => {
    gsap.from(".box", { y: 100, opacity: 0, stagger: 0.1 });
  });

  return <div ref={ref}><div className="box">Hello</div></div>;
}
```

---

## 8. PERFORMANCE TIPS

1. **Prefer transforms** (`x`, `y`, `scale`, `rotation`, `opacity`) — they are GPU-accelerated and don't trigger layout recalculation.
2. **Use `will-change: transform`** sparingly in CSS for elements that will animate.
3. **Use `gsap.ticker`** instead of `requestAnimationFrame` for synced custom logic.
4. **Use `overwrite: "auto"`** to prevent conflicting tweens from stacking.
5. **Use `gsap.context()`** in React to prevent memory leaks.
6. **Avoid animating `width`/`height`** — use `scaleX`/`scaleY` or `clipPath` instead.
7. **Use `lazy: true`** for from() tweens to batch initial renders.
8. **Use `force3D: true`** to promote elements to GPU layer (default in GSAP).
9. **Kill unused ScrollTriggers** — they keep event listeners active.
10. **Use `fastScrollEnd: true`** on ScrollTrigger for better mobile performance.

---

## 9. GSAP + NEXT.JS APP ROUTER PATTERN

```jsx
"use client";

import { useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Register once at module level
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Section() {
  const sectionRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add({
        isDesktop: "(min-width: 1024px)",
        isMobile: "(max-width: 1023px)",
        noMotion: "(prefers-reduced-motion: reduce)"
      }, (context) => {
        const { isDesktop, isMobile, noMotion } = context.conditions;

        if (noMotion) {
          gsap.set(".animate", { clearProps: "all" });
          return;
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: isDesktop ? "top 60%" : "top 80%",
            toggleActions: "play none none none"
          }
        });

        tl.from(".heading", { y: 60, opacity: 0, duration: 0.8 })
          .from(".subtext", { y: 40, opacity: 0, duration: 0.6 }, "-=0.4")
          .from(".cta", { y: 30, opacity: 0, scale: 0.9, duration: 0.5 }, "-=0.3");
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef}>
      <h2 className="heading animate">Title</h2>
      <p className="subtext animate">Description</p>
      <button className="cta animate">Get Started</button>
    </section>
  );
}
```
