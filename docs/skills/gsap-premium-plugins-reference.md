# GSAP Premium Plugins - Comprehensive Reference

> Compiled reference for GSAP Club/Business plugins. Source: gsap.com/docs/v3
> GSAP 3.x (latest stable). All premium plugins require a GSAP Club or Business license.
> As of GSAP 3.12+, all plugins are free for use on sites that don't generate revenue behind a paywall.

---

## Table of Contents

1. [SplitText](#1-splittext)
2. [ScrollSmoother](#2-scrollsmoother)
3. [MorphSVGPlugin](#3-morphsvgplugin)
4. [DrawSVGPlugin](#4-drawsvgplugin)
5. [Flip](#5-flip)
6. [MotionPathPlugin](#6-motionpathplugin)
7. [TextPlugin](#7-textplugin)
8. [ScrambleTextPlugin](#8-scrambletextplugin)

---

## 1. SplitText

### Purpose
Splits HTML text into characters, words, and/or lines so each can be animated independently. It handles nested elements, preserves HTML, and calculates line breaks based on the current layout.

### Use Cases
- Character-by-character reveal animations
- Word-by-word stagger effects
- Line-by-line scroll-triggered reveals
- Typewriter effects
- Kinetic typography

### Installation & Registration
```js
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);
```

CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/SplitText.min.js"></script>
```

### Constructor
```js
const split = new SplitText(target, vars);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `target` | `String \| Element \| Array` | The text element(s) to split |
| `vars` | `Object` | Configuration object |

### Configuration Options (vars)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | `String` | `"chars,words,lines"` | Comma-delimited list of split types. Any combination of `"chars"`, `"words"`, `"lines"` |
| `charsClass` | `String` | `undefined` | CSS class applied to each character `<div>`. Use `++` for incrementing index, e.g. `"char++"` produces `"char0"`, `"char1"`, etc. |
| `wordsClass` | `String` | `undefined` | CSS class applied to each word `<div>`. Supports `++` incrementor |
| `linesClass` | `String` | `undefined` | CSS class applied to each line `<div>`. Supports `++` incrementor |
| `position` | `String` | `undefined` | CSS position for split elements. Typically `"relative"` or `"absolute"` |
| `tag` | `String` | `"div"` | HTML tag for wrapper elements (e.g., `"span"`) |
| `lineThreshold` | `Number` | `0.2` | Proportion of font-size used to determine line breaks (0-1). Higher = more tolerance |
| `reduceWhiteSpace` | `Boolean` | `true` | Collapses white space in the original text |
| `specialChars` | `Array \| Function` | `undefined` | Array of multi-character strings to treat as single characters (e.g. ligatures), or a function for custom parsing |
| `aria` | `Boolean` | `true` | When true, adds `aria-label` on the parent with original text and `aria-hidden="true"` on split elements for accessibility |
| `propIndex` | `Number` | `0` | Starting index for `++` incrementor in class names |
| `wordDelimiter` | `String` | `" "` | Character(s) used to determine word boundaries. Can use any delimiter |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `chars` | `Array` | Array of character `<div>` elements |
| `words` | `Array` | Array of word `<div>` elements |
| `lines` | `Array` | Array of line `<div>` elements |
| `isSplit` | `Boolean` | Whether the text is currently split |

### Methods

#### `split(vars)`
Re-splits the text with new (or the same) configuration. Useful after a resize.
```js
split.split({ type: "words" });
```

#### `revert()`
Reverts the element to its original (pre-split) HTML content. Always call this when done or before re-splitting to prevent nesting issues.
```js
split.revert();
```

### Code Examples

**Basic character stagger:**
```js
const split = new SplitText("#my-text", { type: "chars" });
gsap.from(split.chars, {
  opacity: 0,
  y: 50,
  stagger: 0.03,
  duration: 0.5,
  ease: "back.out"
});
```

**Line-by-line scroll reveal:**
```js
const split = new SplitText(".hero-text", { type: "lines", linesClass: "line++" });
gsap.from(split.lines, {
  scrollTrigger: {
    trigger: ".hero-text",
    start: "top 80%"
  },
  y: 100,
  opacity: 0,
  stagger: 0.1,
  duration: 0.8
});
```

**Responsive revert/re-split:**
```js
let split;
function doSplit() {
  if (split) split.revert();
  split = new SplitText("#text", { type: "chars,words,lines" });
  gsap.from(split.chars, { opacity: 0, y: 20, stagger: 0.02 });
}
doSplit();
window.addEventListener("resize", () => {
  gsap.killTweensOf(split.chars);
  doSplit();
});
```

**With special characters (emojis, ligatures):**
```js
const split = new SplitText("#text", {
  type: "chars",
  specialChars: ["&amp;", "&#169;"] // treat as single chars
});
```

### Performance Considerations
- Always call `.revert()` when done to restore original DOM
- On resize, revert before re-splitting to avoid nested wrappers
- Splitting large amounts of text creates many DOM nodes; split only what you animate
- Use `type: "words"` or `type: "lines"` if you don't need character-level control (fewer DOM elements)
- SplitText is a utility, not a plugin that animates; it just restructures DOM for GSAP to animate

### Gotchas
- SplitText measures the rendered layout to detect lines; if the font hasn't loaded yet, line splits may be incorrect. Use `document.fonts.ready` or a font-loader
- Setting `position: "absolute"` on chars can cause layout shifts; test thoroughly
- Nested HTML elements inside the target are preserved but may affect splitting behavior

---

## 2. ScrollSmoother

### Purpose
A wrapper/companion for ScrollTrigger that adds smooth scrolling (momentum-based) and parallax effects using native scroll (no fake scrollbar). It normalizes scrolling across browsers and devices.

### Use Cases
- Smooth page scrolling with momentum
- Parallax scrolling effects
- Speed-based section transitions
- Scroll-linked animations with buttery smooth interpolation

### Installation & Registration
```js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
```

### Required HTML Structure
```html
<div id="smooth-wrapper">
  <div id="smooth-content">
    <!-- all your page content here -->
  </div>
</div>
```

### Constructor
```js
const smoother = ScrollSmoother.create(vars);
```

### Configuration Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `smooth` | `Number` | `1` | Time (seconds) for smoothing. `0` disables smooth scrolling. Higher = more lag behind native scroll |
| `effects` | `Boolean \| String` | `false` | `true` enables data-attribute-based effects globally, or a selector string to limit which elements get effects |
| `smoothTouch` | `Boolean \| Number` | `false` | Enables smooth scrolling on touch devices. `true` or a number (seconds). Generally not recommended for mobile UX |
| `normalizeScroll` | `Boolean \| Object` | `false` | Prevents mobile address bar show/hide and overscroll behavior. Uses ScrollTrigger.normalizeScroll() |
| `ignoreMobileResize` | `Boolean` | `false` | Prevents recalculation on mobile resize (address bar show/hide) |
| `speed` | `Number` | `1` | Default scroll speed. `0.5` = half speed, `2` = double speed |
| `wrapper` | `String \| Element` | `"#smooth-wrapper"` | The outer wrapper element |
| `content` | `String \| Element` | `"#smooth-content"` | The inner content element |
| `onUpdate` | `Function` | `undefined` | Callback on each smooth-scroll update. Receives the `ScrollSmoother` instance |
| `onStop` | `Function` | `undefined` | Callback when smooth scrolling comes to rest |
| `onFocusIn` | `Function` | `undefined` | Called when an element receives focus. Return `false` to prevent auto-scroll to that element |
| `ease` | `String` | `"expo"` | Ease used for the smooth interpolation |

### Data Attributes for Effects

| Attribute | Description |
|-----------|-------------|
| `data-speed` | Parallax speed multiplier. `0.5` = half scroll speed (lags behind), `2` = double speed (moves ahead). `"clamp(0.5)"` prevents going past its natural position |
| `data-lag` | Time (seconds) for this element to "catch up" to its scroll position. Creates staggered parallax |

### Static Methods

#### `ScrollSmoother.create(vars)`
Creates a new instance. Only one can exist at a time.

#### `ScrollSmoother.get()`
Returns the current ScrollSmoother instance.

### Instance Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `scrollTo` | `scrollTo(target, smooth, position)` | Scrolls to an element, selector, or numeric position. `smooth` (Boolean) controls if it animates. `position` is like ScrollTrigger's `"center center"` |
| `scrollTrigger` | (property) | Reference to the internal ScrollTrigger instance |
| `smooth` | `smooth(value)` | Gets/sets smooth duration |
| `effects` | `effects(targets, config)` | Applies speed/lag effects programmatically. Returns array of created effects |
| `paused` | `paused(value)` | Gets/sets paused state. When paused, native scroll still works but smoothing stops |
| `kill` | `kill()` | Destroys the instance and reverts DOM changes |
| `offset` | `offset(target, position)` | Returns the numeric scroll position for a given target/position |
| `content` | `content(element)` | Gets/sets the content element |
| `wrapper` | `wrapper(element)` | Gets/sets the wrapper element |
| `progress` | (property) | 0-1 scroll progress value |

### Code Examples

**Basic smooth scrolling:**
```js
ScrollSmoother.create({
  smooth: 1.5,
  effects: true,
  smoothTouch: 0.1
});
```

**Parallax elements via HTML:**
```html
<img data-speed="0.5" src="bg.jpg" />
<h1 data-speed="1.2">Fast heading</h1>
<p data-lag="0.5">Lagging paragraph</p>
```

**Programmatic scroll-to:**
```js
const smoother = ScrollSmoother.get();
smoother.scrollTo("#section3", true, "top top");
```

**Programmatic effects:**
```js
smoother.effects(".parallax-img", { speed: 0.5 });
smoother.effects(".lag-text", { lag: 0.3 });
```

**With ScrollTrigger:**
```js
ScrollSmoother.create({ smooth: 1, effects: true });

gsap.to(".box", {
  scrollTrigger: {
    trigger: ".box",
    start: "top center",
    end: "bottom center",
    scrub: true,
  },
  x: 500,
});
```

### Performance Considerations
- Uses `transform: translateY()` on the content container for smooth scrolling (GPU-accelerated)
- `normalizeScroll: true` adds overhead but fixes many mobile issues
- Minimize the number of `data-speed` / `data-lag` elements to reduce per-frame calculations
- Works with ScrollTrigger's `pinning` but order matters: create ScrollSmoother first
- `smoothTouch` can feel unnatural on mobile; test extensively

### Gotchas
- Must have the wrapper/content HTML structure
- Only one ScrollSmoother instance can exist at a time
- Pin-spacing and ScrollTrigger measurements adjust automatically but complex layouts may need `ScrollTrigger.refresh()`
- Next.js/SPA frameworks: create in `useEffect`/`useLayoutEffect` and `kill()` on cleanup
- Fixed-position elements should be OUTSIDE the `#smooth-wrapper`

---

## 3. MorphSVGPlugin

### Purpose
Animates morphing between SVG `<path>` shapes (or any SVG shape elements like `<circle>`, `<rect>`, `<polygon>`, etc.). It intelligently maps points between shapes for smooth, natural-looking transitions.

### Use Cases
- Shape morphing transitions (logo animations, icon transformations)
- Organic blob animations
- Interactive shape-shifting UI elements
- Data visualization transitions

### Installation & Registration
```js
import { gsap } from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
gsap.registerPlugin(MorphSVGPlugin);
```

### Usage
```js
gsap.to("#shape1", { morphSVG: "#shape2", duration: 1 });
```

The `morphSVG` property accepts:
- A selector string (`"#targetPath"`)
- An Element reference
- A raw path data string (`"M0,0 C50,0..."`)
- A configuration object

### Configuration Object Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `shape` | `String \| Element` | required | Target shape to morph to. Selector, element, or path data string |
| `type` | `String` | `"rotational"` | Point-matching algorithm: `"rotational"` (best quality), `"linear"`, or `"logarithmic"` |
| `origin` | `String` | `"50% 50%"` | The transformation origin for rotational mapping, e.g. `"20% 60%"`. Can also use `"self"` to use each shape's own center |
| `shapeIndex` | `Number` | auto | Controls which point on the start shape maps to the beginning of the end shape. Auto-calculated but can be overridden. Use `findShapeIndex()` helper to find optimal value |
| `map` | `String` | `"complexity"` | How points are mapped: `"complexity"`, `"position"`, `"size"` |
| `precompile` | `String` | `undefined` | `"log"` to log pre-compiled morph data for performance |
| `render` | `Function` | `undefined` | Custom render function called on each update with the path data string |
| `updateTarget` | `Boolean` | `true` | If `false`, the original path's `d` attribute won't be updated (use `render` instead) |

### Static Methods

#### `MorphSVGPlugin.convertToPath(shape)`
Converts any SVG shape element (`<circle>`, `<rect>`, `<ellipse>`, `<polygon>`, `<polyline>`, `<line>`) into a `<path>`. Returns the new path element(s).
```js
MorphSVGPlugin.convertToPath("circle"); // converts ALL circles
MorphSVGPlugin.convertToPath("#myRect"); // converts specific element
```

#### `MorphSVGPlugin.stringToRawPath(pathString)`
Converts a path data string to a RawPath array (array of cubic bezier segment arrays).

#### `MorphSVGPlugin.rawPathToString(rawPath)`
Converts a RawPath array back to a path data string.

#### `MorphSVGPlugin.pathFilter(targetElement, vars)`
Manually pre-processes a morph for optimization.

### Helper: findShapeIndex()
Available as a separate utility. Opens a visual UI in the browser to interactively find the best `shapeIndex` value.
```js
// Include the helper tool:
// <script src="https://assets.codepen.io/16327/findShapeIndex.js"></script>
findShapeIndex("#start", "#end");
```

### Code Examples

**Simple morph:**
```js
gsap.to("#circle", {
  morphSVG: "#star",
  duration: 2,
  ease: "power2.inOut"
});
```

**With configuration object:**
```js
gsap.to("#shape1", {
  morphSVG: {
    shape: "#shape2",
    type: "rotational",
    origin: "50% 50%",
    shapeIndex: 5
  },
  duration: 1.5
});
```

**Morphing non-path elements (auto-conversion):**
```js
MorphSVGPlugin.convertToPath("circle, rect, polygon");
gsap.to("#circle-as-path", { morphSVG: "#star", duration: 1 });
```

**Morph to raw path data string:**
```js
gsap.to("#path", {
  morphSVG: "M10,10 C20,20 30,20 40,10",
  duration: 2
});
```

**Timeline with multiple morphs:**
```js
const tl = gsap.timeline({ repeat: -1, yoyo: true });
tl.to("#shape", { morphSVG: "#shape2", duration: 1 })
  .to("#shape", { morphSVG: "#shape3", duration: 1 })
  .to("#shape", { morphSVG: "#shape4", duration: 1 });
```

### Performance Considerations
- The `"rotational"` type gives best quality but is slightly more CPU-intensive than `"linear"`
- Pre-compile morph data for complex shapes used in repeated animations
- Fewer anchor points in the SVG paths = smoother & faster morphing
- Complex paths with many sub-paths will be heavier
- Use `will-change: transform` on the SVG element for GPU compositing

### Gotchas
- Both shapes should be `<path>` elements (use `convertToPath()` for others)
- Shapes with vastly different numbers of points will still work but may look better if you add points to the simpler shape
- Sub-paths (compound shapes like the letter "O") are matched by size/position
- `fill-rule` differences between shapes can cause visual artifacts

---

## 4. DrawSVGPlugin

### Purpose
Animates the `stroke` of an SVG element, making it appear as if it is being drawn or erased. Works by manipulating `stroke-dashoffset` and `stroke-dasharray`.

### Use Cases
- Line drawing / writing animations
- Logo reveal effects
- Progress indicators
- Animated icons
- Path tracing effects

### Installation & Registration
```js
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
gsap.registerPlugin(DrawSVGPlugin);
```

### Usage
```js
gsap.from(".line", { drawSVG: 0, duration: 1 });
```

### Property Values

The `drawSVG` property accepts:

| Value | Description |
|-------|-------------|
| `0` or `"0"` | Completely hidden (no stroke visible) |
| `"0%"` | Same as 0 |
| `true` or `"100%"` | Full stroke visible |
| `"20%"` | Draw from 0% to 20% of the path |
| `"20% 80%"` | Draw from 20% to 80% — a segment in the middle |
| `"50% 50%"` | A zero-length segment at the midpoint (collapses to center) |
| `"0 100"` | Pixel-based: draw from 0px to 100px |
| `"0 50%"` | Mix of pixel and percentage |

### Code Examples

**Draw from nothing:**
```js
gsap.from("path", { drawSVG: 0, duration: 2 });
```

**Draw from start to finish (animated progress):**
```js
gsap.fromTo("path",
  { drawSVG: 0 },
  { drawSVG: "100%", duration: 2 }
);
```

**Animated segment that travels along the path:**
```js
gsap.fromTo("path",
  { drawSVG: "0% 10%" },
  { drawSVG: "90% 100%", duration: 2, ease: "none" }
);
```

**Draw from center outward:**
```js
gsap.from("path", { drawSVG: "50% 50%", duration: 1 });
```

**Multiple paths staggered:**
```js
gsap.from(".draw-me", {
  drawSVG: 0,
  duration: 1.5,
  stagger: 0.2,
  ease: "power2.inOut"
});
```

**Scroll-triggered draw:**
```js
gsap.from(".line-art path", {
  scrollTrigger: {
    trigger: ".line-art",
    start: "top center",
    end: "bottom center",
    scrub: true
  },
  drawSVG: 0
});
```

**Continuous loop (traveling segment):**
```js
gsap.fromTo("path",
  { drawSVG: "0% 0%" },
  { drawSVG: "100% 100%", duration: 2, ease: "none", repeat: -1 }
);
```

### Performance Considerations
- Very lightweight; only animates two CSS properties (`stroke-dashoffset`, `stroke-dasharray`)
- Works on any SVG element with a stroke: `<path>`, `<line>`, `<circle>`, `<rect>`, `<polyline>`, `<polygon>`, `<ellipse>`
- No DOM restructuring, so it's fast even with many elements
- Combine with `stagger` for efficient batch animations

### Gotchas
- The element MUST have a `stroke` defined (won't work with `fill`-only SVGs)
- Set `fill: none` if you only want the stroke animation visible
- `vector-effect: non-scaling-stroke` can cause measurement issues in some browsers
- Total path length is calculated once; if the path changes dynamically, you may need to re-tween

---

## 5. Flip

### Purpose
Animates between two states/layouts by capturing the initial state (position, size, rotation, etc.), making the change, then animating FROM the old state to the new state. Implements the FLIP technique (First, Last, Invert, Play).

### Use Cases
- Layout transitions (grid to list, reordering items)
- Shared element transitions
- Expand/collapse animations
- Tab/filter content changes
- Re-parenting elements between containers
- Adding/removing items from lists

### Installation & Registration
```js
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
gsap.registerPlugin(Flip);
```

### Core Workflow
```js
// 1. Get the initial state
const state = Flip.getState(targets);

// 2. Make your DOM changes
container.appendChild(element); // reparent, reorder, toggle class, etc.

// 3. Animate from old state to new state
Flip.from(state, { duration: 1, ease: "power2.inOut" });
```

### Static Methods

#### `Flip.getState(targets, vars)`
Captures the current state of elements.

| Parameter | Type | Description |
|-----------|------|-------------|
| `targets` | `String \| Element \| Array` | Elements to capture |
| `vars` | `Object` | Options |

**vars properties:**
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `props` | `String` | `"transform,opacity"` | Comma-delimited CSS properties to record beyond transforms |
| `simple` | `Boolean` | `false` | Skip rotation/skew recording for faster captures |
| `getVars` | `Boolean` | `false` | If true, returns an object of vars for each element instead of a state object |

#### `Flip.from(state, vars)`
Animates from the captured state to the current state. Returns a Timeline.

**vars properties (in addition to all standard GSAP tween vars):**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `duration` | `Number` | `0.5` | Animation duration |
| `ease` | `String` | `"power1.inOut"` | Easing |
| `absolute` | `Boolean` | `false` | Temporarily makes elements `position: absolute` during animation to prevent layout shifts |
| `scale` | `Boolean` | `false` | Animate scale changes instead of width/height for better performance |
| `simple` | `Boolean` | `false` | Skip rotation/skew for simpler/faster animations |
| `targets` | `String \| Element \| Array` | `undefined` | Limit animation to specific targets from the state |
| `nested` | `Boolean` | `false` | Allows nested Flip animations |
| `prune` | `Boolean` | `false` | Removes entering/leaving elements from the animation |
| `fade` | `Boolean` | `false` | Cross-fades entering/leaving elements |
| `spin` | `Boolean \| Number` | `false` | Adds a rotation. `true` = 1 full rotation, or specify number of rotations |
| `onEnter` | `Function \| Object` | `undefined` | Animation for new elements (that weren't in the original state). Function receives elements array, or object of tween vars |
| `onLeave` | `Function \| Object` | `undefined` | Animation for removed elements. Function receives elements array, or object of tween vars |
| `toggleClass` | `String` | `undefined` | Adds a class during the animation |
| `zIndex` | `Number` | `undefined` | Sets z-index during animation |
| `props` | `String` | `undefined` | Additional CSS properties to animate |

#### `Flip.to(state, vars)`
Animates from the current state TO the captured state (reverse of `from`).

#### `Flip.fit(element, targetElement, vars)`
Immediately positions/sizes one element to match another. No animation.

| Property | Type | Description |
|----------|------|-------------|
| `scale` | `Boolean` | Use scale instead of width/height |
| `fitChild` | `Element` | A child element that should be the one that's fitted |
| `absolute` | `Boolean` | Use position absolute |
| `getVars` | `Boolean` | Return the vars instead of applying them |
| `props` | `String` | Additional CSS properties to match |
| `duration` | `Number` | If provided, animates the fit |

#### `Flip.makeAbsolute(elements)`
Converts elements to `position: absolute` while keeping them in the same visual position. Returns the elements.

#### `Flip.isFlipping(target)`
Returns `true` if the element is currently in a Flip animation.

#### `Flip.getByTarget(target)`
Returns the Flip animation (Timeline) associated with a target.

#### `Flip.killFlipsOf(targets)`
Kills any active Flip animations on the given targets.

### Code Examples

**Basic layout animation:**
```js
const state = Flip.getState(".box");
// Toggle a layout class
container.classList.toggle("grid-layout");
Flip.from(state, {
  duration: 0.7,
  ease: "power2.inOut",
  stagger: 0.05,
  absolute: true,
  scale: true
});
```

**Reparenting elements:**
```js
const item = document.querySelector(".item");
const state = Flip.getState(item);
newContainer.appendChild(item);
Flip.from(state, { duration: 0.5, ease: "power1.inOut" });
```

**With enter/leave animations:**
```js
const state = Flip.getState(".card");
// Filter cards - some hidden, some shown
applyFilter();
Flip.from(state, {
  duration: 0.7,
  scale: true,
  absolute: true,
  onEnter: elements => gsap.fromTo(elements, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.5 }),
  onLeave: elements => gsap.to(elements, { opacity: 0, scale: 0, duration: 0.3 })
});
```

**Fit one element to another:**
```js
Flip.fit("#small-thumb", "#large-preview", { scale: true });
```

### Performance Considerations
- Use `scale: true` instead of animating width/height (triggers GPU compositing instead of layout reflow)
- Use `absolute: true` to remove elements from document flow during animation (prevents layout thrashing)
- `simple: true` skips rotation calculations for faster state capture
- Batch your DOM changes between `getState()` and `from()` to minimize reflows
- Use `prune: true` if you don't need enter/leave animations

### Gotchas
- The DOM changes must happen BETWEEN `getState()` and `from()` (synchronously)
- Elements must still exist in the DOM when `from()` is called
- Nested transforms can cause issues; use `nested: true` if applicable
- `absolute: true` may cause z-index stacking issues; use `zIndex` to control

---

## 6. MotionPathPlugin

### Purpose
Animates any element along a motion path (SVG `<path>`, an array of coordinates, or a cubic bezier path). The element can auto-rotate to follow the path direction.

### Use Cases
- Animate elements along curved paths
- SVG path following
- Animated illustrations with complex motion
- Game-like movement patterns
- Orbital/circular motion

### Installation & Registration
```js
import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(MotionPathPlugin);
```

### Usage
```js
gsap.to(".element", {
  motionPath: {
    path: "#myPath",
    align: "#myPath",
    alignOrigin: [0.5, 0.5],
    autoRotate: true
  },
  duration: 3
});
```

### Configuration Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `path` | `String \| Element \| Array \| Object` | required | SVG path selector/element, array of point objects `[{x,y}, ...]`, or a raw path data string |
| `align` | `String \| Element` | `undefined` | Aligns the element to the path so it starts at the path's beginning. Usually the same as `path` |
| `alignOrigin` | `Array` | `[0, 0]` | `[x, y]` normalized (0-1) origin for alignment. `[0.5, 0.5]` = center of element on the path |
| `autoRotate` | `Boolean \| Number` | `false` | `true` rotates element to match path direction. A number offsets the rotation (e.g., `90` adds 90deg) |
| `start` | `Number` | `0` | Starting progress (0-1) along the path |
| `end` | `Number` | `1` | Ending progress (0-1) along the path |
| `offsetX` | `Number` | `0` | Pixel offset on X axis |
| `offsetY` | `Number` | `0` | Pixel offset on Y axis |
| `relative` | `Boolean` | `false` | Treats path values as relative to the element's current position |
| `fromCurrent` | `Boolean` | `undefined` | If `true`, the path starts from the element's current position |
| `type` | `String` | `"thru"` | For array-based paths: `"thru"` (smooth through points), `"cubic"` (use as control points), `"quadratic"` |
| `curviness` | `Number` | `1` | Controls how curvy the path is when using point arrays. `0` = straight lines, `2` = very curvy |
| `resolution` | `Number` | `12` | Number of segments per curve for path measurement precision |
| `useRadians` | `Boolean` | `false` | If true, rotation is in radians instead of degrees |

### Static Methods

#### `MotionPathPlugin.convertToPath(shape, swap)`
Converts SVG shapes (`<circle>`, `<rect>`, etc.) to `<path>`. If `swap` is true, replaces the original in the DOM.

#### `MotionPathPlugin.getRelativePosition(fromElement, toElement, fromOrigin, toOrigin)`
Returns `{x, y}` offset from one element to another.

#### `MotionPathPlugin.arrayToRawPath(points, vars)`
Converts array of points to a RawPath.

#### `MotionPathPlugin.rawPathToString(rawPath)`
Converts RawPath to an SVG path data string.

#### `MotionPathPlugin.stringToRawPath(pathString)`
Parses SVG path data string to RawPath.

#### `MotionPathPlugin.getGlobalMatrix(element)`
Returns the global transformation matrix for an element.

#### `MotionPathPlugin.sliceRawPath(rawPath, start, end)`
Returns a segment of a RawPath between the given progress values (0-1).

#### `MotionPathPlugin.pointsToSegment(points, curviness)`
Converts flat array of x/y point values to a cubic bezier segment.

### Code Examples

**Follow an SVG path:**
```js
gsap.to("#rocket", {
  motionPath: {
    path: "#flightPath",
    align: "#flightPath",
    alignOrigin: [0.5, 0.5],
    autoRotate: true
  },
  duration: 5,
  ease: "power1.inOut"
});
```

**Array of points (smooth curve):**
```js
gsap.to(".ball", {
  motionPath: {
    path: [
      { x: 100, y: 0 },
      { x: 200, y: -100 },
      { x: 300, y: 50 },
      { x: 400, y: 0 }
    ],
    curviness: 1.5,
    autoRotate: true
  },
  duration: 3
});
```

**Partial path animation:**
```js
gsap.to(".dot", {
  motionPath: {
    path: "#myPath",
    align: "#myPath",
    start: 0.2,
    end: 0.8
  },
  duration: 2
});
```

**Relative motion (from current position):**
```js
gsap.to(".icon", {
  motionPath: {
    path: [{ x: 100, y: -50 }, { x: 200, y: 0 }],
    relative: true,
    type: "thru",
    curviness: 1
  },
  duration: 2
});
```

**Circular/orbital motion:**
```js
gsap.to(".planet", {
  motionPath: {
    path: "M200,0 A200,200,0,1,1,-0.1,0",
    align: "self"
  },
  duration: 10,
  repeat: -1,
  ease: "none"
});
```

### Performance Considerations
- Path measurements are cached after first calculation
- Higher `resolution` = more accurate but more computation at setup
- `autoRotate` is cheap at runtime (just a rotation transform)
- Use simpler paths (fewer control points) for mobile
- For many elements on the same path, the path is only measured once

### Gotchas
- `align` is needed to visually place the element on the SVG path (otherwise it animates offset from its CSS position)
- `alignOrigin: [0.5, 0.5]` centers the element on the path; without it, the top-left corner follows the path
- When using point arrays, `type: "thru"` creates a smooth curve THROUGH each point
- SVG viewBox scaling affects path coordinates; ensure proper alignment

---

## 7. TextPlugin

### Purpose
Replaces the text content of a DOM element, one character at a time, simulating a typing effect. Can also replace with HTML.

### Use Cases
- Typewriter text effects
- Text replacement animations
- Dynamic content updates
- Chat/messaging simulations

### Installation & Registration
```js
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
gsap.registerPlugin(TextPlugin);
```

### Usage
```js
gsap.to("#element", { text: "New text here", duration: 2 });
```

### Configuration Properties

The `text` property accepts a string or configuration object:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `String` | required | The text/HTML to animate to |
| `delimiter` | `String` | `""` | Character(s) to split text by. `""` = character by character, `" "` = word by word |
| `newClass` | `String` | `undefined` | CSS class applied to the new (incoming) text |
| `oldClass` | `String` | `undefined` | CSS class applied to the old (outgoing) text that hasn't been replaced yet |
| `padSpace` | `Boolean` | `false` | If `true`, pads shorter text with non-breaking spaces to prevent layout shifts |
| `preserveSpaces` | `Boolean` | `false` | Prevents collapsing of multiple spaces |
| `rtl` | `Boolean` | `false` | Right-to-left mode — replaces from end to start |
| `type` | `String` | `"diff"` | `"diff"` only replaces characters that differ. `"original"` replaces all characters |
| `speed` | `Number` | `undefined` | Characters per second (alternative to `duration`) |

### Code Examples

**Simple typewriter:**
```js
gsap.to("#text", {
  text: "Hello World!",
  duration: 2,
  ease: "none"
});
```

**Word-by-word replacement:**
```js
gsap.to("#text", {
  text: {
    value: "This is the new text content",
    delimiter: " "
  },
  duration: 3
});
```

**With styling classes:**
```js
gsap.to("#output", {
  text: {
    value: "Updated content here",
    newClass: "text-green",
    oldClass: "text-gray"
  },
  duration: 2,
  ease: "none"
});
```

**Right-to-left text:**
```js
gsap.to("#rtl-text", {
  text: {
    value: "New RTL content",
    rtl: true
  },
  duration: 2
});
```

**Cursor effect (combine with CSS):**
```js
gsap.to("#typewriter", {
  text: "Typing this out...",
  duration: 3,
  ease: "none"
});
// CSS: #typewriter { border-right: 2px solid; } with blinking animation
```

**Sequential text changes:**
```js
const tl = gsap.timeline();
tl.to("#el", { text: "First message", duration: 1 })
  .to("#el", { text: "Second message", duration: 1 }, "+=1")
  .to("#el", { text: "Final message!", duration: 1 }, "+=1");
```

### Performance Considerations
- Very lightweight — only modifies `textContent` or `innerHTML`
- No DOM restructuring (unlike SplitText)
- Use `ease: "none"` for consistent typing speed
- Minimal overhead even with long strings

### Gotchas
- Uses `innerHTML` when the value contains HTML tags; otherwise uses `textContent`
- The `"diff"` type only animates characters that differ, which looks strange for completely different strings — use `type: "original"` in that case
- Does not split or animate individual characters with transforms; for that, use SplitText + stagger
- `speed` overrides `duration` — use one or the other

---

## 8. ScrambleTextPlugin

### Purpose
Animates text by scrambling/randomizing characters, gradually revealing the destination text. Creates a "decryption" or "hacker terminal" effect.

### Use Cases
- Hacker/Matrix-style text reveals
- Decryption effects
- Dramatic text transitions
- Digital/tech-themed UIs
- Loading state text animations

### Installation & Registration
```js
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
gsap.registerPlugin(ScrambleTextPlugin);
```

### Usage
```js
gsap.to("#element", { scrambleText: "Final text", duration: 2 });
```

### Configuration Properties

The `scrambleText` property accepts a string or configuration object:

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `text` | `String` | required | The destination text to reveal |
| `chars` | `String` | `"upperCase"` | Characters to use for scrambling. Presets: `"upperCase"`, `"lowerCase"`, `"upperAndLowerCase"`, `"number"`, or a custom string like `"!@#$%^&*()"` |
| `tweenLength` | `Boolean` | `true` | Animates the length of the string from original to final length. `false` = immediately shows final length |
| `revealDelay` | `Number` | `0` | Time (seconds) before characters start being revealed (locked in). During this time, ALL characters scramble |
| `speed` | `Number` | `1` | Speed multiplier for the scramble refresh rate. Higher = faster character cycling |
| `delimiter` | `String` | `""` | Split delimiter. `""` = character, `" "` = word |
| `rightToLeft` | `Boolean` | `false` | Reveals characters from right to left |
| `newClass` | `String` | `undefined` | CSS class applied to revealed (final) characters |
| `oldClass` | `String` | `undefined` | CSS class applied to scrambled characters |

### Code Examples

**Basic scramble reveal:**
```js
gsap.to("#heading", {
  scrambleText: "MISSION COMPLETE",
  duration: 2
});
```

**Custom scramble characters:**
```js
gsap.to("#code", {
  scrambleText: {
    text: "ACCESS GRANTED",
    chars: "01",  // binary style
    speed: 0.5
  },
  duration: 3
});
```

**With reveal delay (all chars scramble first):**
```js
gsap.to("#decrypt", {
  scrambleText: {
    text: "DECRYPTED MESSAGE",
    chars: "!@#$%^&*()_+",
    revealDelay: 0.5,
    speed: 0.8
  },
  duration: 2.5
});
```

**Styled reveal (new text gets a class):**
```js
gsap.to("#status", {
  scrambleText: {
    text: "ONLINE",
    newClass: "text-green-500",
    oldClass: "text-gray-500",
    chars: "XYZABC123"
  },
  duration: 1.5
});
```

**Right-to-left reveal:**
```js
gsap.to("#rtl", {
  scrambleText: {
    text: "DECODED",
    rightToLeft: true,
    chars: "lowerCase"
  },
  duration: 2
});
```

**Sequential scrambles in a timeline:**
```js
const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
tl.to("#display", { scrambleText: "INITIALIZING...", duration: 1 })
  .to("#display", { scrambleText: "CONNECTING...", duration: 1 }, "+=0.5")
  .to("#display", { scrambleText: "SYSTEM READY", duration: 1 }, "+=0.5");
```

**Fixed-length scramble (no length animation):**
```js
gsap.to("#counter", {
  scrambleText: {
    text: "COMPLETE",
    tweenLength: false,
    chars: "number"
  },
  duration: 2
});
```

### Performance Considerations
- Lightweight; only updates `innerHTML` on each tick
- The `speed` property controls how often characters reshuffle; lower values = fewer DOM updates
- Minimal overhead for single elements
- For many simultaneous scrambles, lower `speed` to reduce repaints

### Gotchas
- Only works with text content (no complex HTML within the target during scramble)
- `newClass` and `oldClass` wrap characters in `<span>` elements, which adds some DOM weight
- The scramble effect is purely visual; screen readers will see intermediate states. Consider `aria-label` for accessibility
- `tweenLength: false` can cause layout shifts if old and new text are different lengths

---

## Integration Patterns (All Plugins)

### Next.js / React Integration

```jsx
"use client";
import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { Flip } from "gsap/Flip";

// Register once at module level
if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrollSmoother, Flip);
}

function AnimatedComponent() {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // All GSAP code here — scoped to containerRef
      const split = new SplitText("h1", { type: "chars" });
      gsap.from(split.chars, { opacity: 0, y: 30, stagger: 0.03 });
    }, containerRef);

    return () => ctx.revert(); // Cleanup on unmount
  }, []);

  return <div ref={containerRef}>...</div>;
}
```

### GSAP Context for Cleanup
Always use `gsap.context()` in component-based frameworks:
```js
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    // animations
  }, scopeRef);
  return () => ctx.revert();
}, []);
```

### Combining Plugins
```js
// SplitText + ScrollTrigger + DrawSVG in a timeline
const tl = gsap.timeline({
  scrollTrigger: { trigger: ".section", start: "top center", end: "bottom center", scrub: true }
});
const split = new SplitText(".title", { type: "chars" });
tl.from(split.chars, { opacity: 0, y: 50, stagger: 0.02 })
  .from(".svg-line", { drawSVG: 0 }, "<")
  .to(".shape", { morphSVG: "#targetShape" }, "<0.5");
```

### Package Installation (npm)
```bash
# GSAP premium plugins are available via private npm registry
npm install gsap@npm:@gsap/shockingly
# or for Business license:
npm install gsap@npm:@gsap/business
```

Then import directly:
```js
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Flip } from "gsap/Flip";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
```

### SSR / Server-Side Rendering
All GSAP plugins are client-only. Guard registration:
```js
if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrollSmoother, /* etc */);
}
```

---

## License Notes
- SplitText, ScrollSmoother, MorphSVGPlugin, DrawSVGPlugin are **Club/Business** plugins
- Flip, MotionPathPlugin, TextPlugin, ScrambleTextPlugin are **free** plugins (included in the public GSAP package)
- As of GSAP 3.12+, all plugins (including premium) are free for non-commercial use and sites without a paywall
- Premium plugins are available via the `@gsap/shockingly` or `@gsap/business` npm packages
- Trial versions available on CodePen without a license
