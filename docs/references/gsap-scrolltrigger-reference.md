# GSAP ScrollTrigger & Observer — Comprehensive API Reference

> Compiled from official GSAP documentation (gsap.com/docs/v3/Plugins/ScrollTrigger/)
> Sources: https://gsap.com/docs/v3/Plugins/ScrollTrigger/ | https://gsap.com/docs/v3/Plugins/Observer/ | https://gsap.com/scroll/

---

## Table of Contents

1. [Installation & Registration](#installation--registration)
2. [Configuration Properties](#configuration-properties)
3. [Callbacks](#callbacks)
4. [Instance Methods](#instance-methods)
5. [Instance Properties](#instance-properties)
6. [Static Methods](#static-methods)
7. [Static Properties](#static-properties)
8. [Snap Configuration](#snap-configuration)
9. [Pin Configuration](#pin-configuration)
10. [Observer Plugin](#observer-plugin)
11. [Code Examples](#code-examples)
12. [Performance Tips & Best Practices](#performance-tips--best-practices)

---

## Installation & Registration

```js
// npm
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// CDN
// <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
```

---

## Configuration Properties

### Core Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `trigger` | `String \| Element` | `undefined` | The element (or selector string) whose position in the normal document flow is used to calculate where the ScrollTrigger starts. |
| `start` | `String \| Number \| Function` | `"top bottom"` | Determines the starting position. Format: `"triggerPosition scrollerPosition"`. Values: `top`, `center`, `bottom`, pixel values, percentages, or `+=`/`-=` relative values. E.g., `"top 80%"`, `"top top"`, `"center center"`. Can be a function that returns a string. |
| `end` | `String \| Number \| Function` | `"bottom top"` | Determines the ending position. Same format as `start`. E.g., `"bottom 30%"`, `"+=500"`, `"bottom bottom"`. Can be a function returning a string. |
| `endTrigger` | `String \| Element` | `undefined` | A different element whose position is used to calculate the ScrollTrigger end position (instead of the `trigger` element). |
| `scroller` | `String \| Element` | `viewport` | By default, the scroller is the viewport itself. Use this to specify a scrollable `<div>` or other element as the scroller. |
| `horizontal` | `Boolean` | `false` | Set `true` if scrolling is horizontal instead of vertical. |
| `id` | `String` | `undefined` | An arbitrary unique identifier for the ScrollTrigger instance, retrievable via `ScrollTrigger.getById()`. |
| `animation` | `Tween \| Timeline` | `undefined` | A GSAP Tween or Timeline to be controlled by this ScrollTrigger. Usually you add `scrollTrigger` directly to a tween/timeline instead. |
| `containerAnimation` | `Tween \| Timeline` | `undefined` | A GSAP animation with horizontal movement (typically `x` translateX) that should be used as the "scroller" for calculating positions. Useful for triggering animations within a horizontal scroll container. |
| `invalidateOnRefresh` | `Boolean` | `false` | If `true`, the associated animation will be invalidated on refresh (re-record starting values). |
| `refreshPriority` | `Number` | `0` | Influences the order in which ScrollTriggers get refreshed. Higher priority refreshes first. Useful when pinning adds spacing that affects subsequent triggers. |
| `once` | `Boolean` | `false` | If `true`, the ScrollTrigger will `kill()` itself as soon as the end position is reached. The animation will complete but never reverse. |
| `preventOverlaps` | `String \| Boolean` | `false` | If a string, any other ScrollTrigger with the same string value will have its animation reverted when this one fires. If `true`, uses a globally unique group. |
| `fastScrollEnd` | `Boolean \| Number` | `false` | If `true`, forces the animation to completion if you leave the trigger area faster than 2500px/s. Set a number to customize the velocity threshold. |

### Scrub

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `scrub` | `Boolean \| Number` | `false` | Links the animation directly to the scrollbar. `true` = immediate link. A number (e.g., `0.5`) = time (seconds) for the playhead to "catch up", creating a smoothing/lag effect. `scrub: 1` takes 1 second to catch up. |

### Toggle Actions & Classes

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `toggleActions` | `String` | `"play none none none"` | Controls how the animation is controlled at 4 toggle places: `onEnter`, `onLeave`, `onEnterBack`, `onLeaveBack`. Values: `play`, `pause`, `resume`, `reverse`, `restart`, `reset`, `complete`, `none`. E.g., `"play pause resume reverse"`. |
| `toggleClass` | `String \| Object` | `undefined` | Adds/removes a CSS class when the ScrollTrigger toggles. String: class name applied to trigger element. Object: `{ targets: ".selector", className: "active" }`. |

### Markers (Debug)

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `markers` | `Boolean \| Object` | `false` | If `true`, shows colored markers for `start` and `end` positions. Object: `{ startColor: "green", endColor: "red", fontSize: "12px", indent: 20 }`. |

---

## Callbacks

All callbacks receive the ScrollTrigger instance (`self`) as the only parameter, giving access to `self.progress`, `self.direction`, `self.isActive`, `self.getVelocity()`, etc.

| Callback | Description |
|----------|-------------|
| `onEnter` | Called when scrolling **forward** past the `start` position (entering the trigger area). |
| `onLeave` | Called when scrolling **forward** past the `end` position (leaving the trigger area). |
| `onEnterBack` | Called when scrolling **backward** past the `end` position (re-entering the trigger area). |
| `onLeaveBack` | Called when scrolling **backward** past the `start` position (leaving the trigger area going back). |
| `onUpdate` | Called every time the ScrollTrigger's progress changes (on every scroll event while active). Receives `self` with `self.progress` (0-1), `self.direction` (1=forward, -1=backward), `self.getVelocity()`. |
| `onToggle` | Called when the ScrollTrigger toggles active/inactive (crosses `start` or `end` in either direction). Use `self.isActive` to check state. Can replace onEnter/onLeave/onEnterBack/onLeaveBack for simpler logic. |
| `onScrubComplete` | Called when a scrubbed animation finishes catching up to the scroll position. Only relevant when `scrub` is a number (not `true`). |
| `onRefresh` | Called when the ScrollTrigger recalculates its positions (on resize, font load, etc.). Receives `self`. |
| `onRefreshInit` | Called at the very beginning of a refresh (before positions are recalculated). |
| `onSnapComplete` | Called when a snap animation completes. Receives `self`. |

### Callback Example

```js
ScrollTrigger.create({
  trigger: ".panel",
  start: "top top",
  end: "bottom top",
  onEnter: (self) => console.log("entered!", self.progress),
  onLeave: (self) => console.log("left!", self.progress),
  onEnterBack: (self) => console.log("entered back!", self.progress),
  onLeaveBack: (self) => console.log("left going back!", self.progress),
  onUpdate: (self) => {
    console.log(
      "progress:", self.progress.toFixed(3),
      "direction:", self.direction,
      "velocity:", self.getVelocity()
    );
  },
  onToggle: (self) => console.log("toggled, isActive:", self.isActive),
});
```

---

## Instance Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `kill()` | `kill(revert?: Boolean)` | Kills the ScrollTrigger instance, removing all listeners. If `revert` is `true`, it also reverts any inline styles set by pin. |
| `refresh()` | `refresh()` | Forces the ScrollTrigger to recalculate its start/end positions. |
| `enable()` | `enable(reset?: Boolean, refresh?: Boolean)` | Re-enables a previously disabled ScrollTrigger. If `reset` is `true`, the animation resets. If `refresh` is `true`, triggers a refresh. |
| `disable()` | `disable(revert?: Boolean)` | Disables the ScrollTrigger without killing it. If `revert` is `true`, the associated animation reverts. |
| `scroll()` | `scroll(position?: Number)` | Gets or sets the scroller's scroll position. Without argument, returns current position. With argument, scrolls to that position. |
| `getTween()` | `getTween()` | Returns the snapping tween (if snapping is active), or `null`. |
| `getVelocity()` | `getVelocity()` | Returns the current scroll velocity (px/s). |
| `labelToScroll()` | `labelToScroll(label: String)` | Returns the scroll position corresponding to a label in the associated timeline. Useful for scrolling to specific points. |
| `update()` | `update()` | Forces the ScrollTrigger to update. |

---

## Instance Properties

| Property | Type | Description |
|----------|------|-------------|
| `progress` | `Number` | Current progress (0 to 1) based on scroll position between start and end. |
| `direction` | `Number` | `1` = scrolling forward, `-1` = scrolling backward. |
| `isActive` | `Boolean` | `true` if the current scroll position is between start and end. |
| `start` | `Number` | The calculated scroll position (in pixels) where the trigger starts. |
| `end` | `Number` | The calculated scroll position (in pixels) where the trigger ends. |
| `pin` | `Element` | Reference to the pinned element (if applicable). |
| `trigger` | `Element` | Reference to the trigger element. |
| `scroller` | `Element` | Reference to the scroller element. |
| `animation` | `Tween \| Timeline` | Reference to the associated animation (if applicable). |
| `vars` | `Object` | The configuration object originally passed to create the ScrollTrigger. |

---

## Static Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `ScrollTrigger.create()` | `create(vars: Object)` | Creates a standalone ScrollTrigger (not associated with a tween/timeline). Returns the ScrollTrigger instance. Accepts the same config properties as the `scrollTrigger` object on a tween. |
| `ScrollTrigger.refresh()` | `refresh(safe?: Boolean)` | Forces ALL ScrollTriggers to recalculate positions. If `safe` is `true`, it waits for a `requestAnimationFrame` tick to avoid layout thrashing. Call after DOM changes that affect layout. |
| `ScrollTrigger.update()` | `update()` | Forces all ScrollTriggers to update (check current scroll position). |
| `ScrollTrigger.getAll()` | `getAll()` | Returns an Array of all ScrollTrigger instances. |
| `ScrollTrigger.getById()` | `getById(id: String)` | Returns the ScrollTrigger instance with the matching `id`. |
| `ScrollTrigger.kill()` | `kill()` | Kills ALL ScrollTrigger instances. |
| `ScrollTrigger.enable()` | `enable()` | Re-enables ScrollTrigger after it was disabled. |
| `ScrollTrigger.disable()` | `disable()` | Disables ScrollTrigger globally. |
| `ScrollTrigger.addEventListener()` | `addEventListener(type: String, callback: Function)` | Listens for events: `"scrollStart"`, `"scrollEnd"`, `"refreshInit"`, `"refresh"`, `"matchMedia"`. |
| `ScrollTrigger.removeEventListener()` | `removeEventListener(type: String, callback: Function)` | Removes an event listener. |
| `ScrollTrigger.batch()` | `batch(targets, vars: Object)` | Creates coordinated ScrollTriggers for multiple elements. Callbacks receive an Array of elements that enter/leave within a time interval. Great for staggered reveal animations. |
| `ScrollTrigger.sort()` | `sort(func?: Function)` | Sorts all ScrollTrigger instances by their start position (or a custom comparison function). |
| `ScrollTrigger.config()` | `config(vars: Object)` | Configure global settings: `{ limitCallbacks: Boolean, syncInterval: Number, autoRefreshEvents: String, ignoreMobileResize: Boolean }`. |
| `ScrollTrigger.defaults()` | `defaults(vars: Object)` | Set default property values for all future ScrollTrigger instances. |
| `ScrollTrigger.scrollerProxy()` | `scrollerProxy(scroller, vars: Object)` | Define custom getters/setters for a scroller's scroll position and dimensions. Useful for virtual scroll libraries like Locomotive Scroll. `vars: { scrollTop, scrollLeft, getBoundingClientRect, pinType, fixedMarkers }`. |
| `ScrollTrigger.matchMedia()` | `matchMedia(vars: Object)` | Create responsive ScrollTriggers that get killed/reverted at certain breakpoints. Keys are media query strings, values are setup functions. |
| `ScrollTrigger.saveStyles()` | `saveStyles(targets)` | Saves the current inline styles of target elements so they can be reverted by `matchMedia()`. Call before creating ScrollTriggers. |
| `ScrollTrigger.normalizeScroll()` | `normalizeScroll(config?: Boolean \| Object)` | Intercepts native scroll and handles it via JS. Prevents mobile address bar show/hide jitter. Config: `{ allowNestedScroll, lockAxis, momentum, type }`. |
| `ScrollTrigger.clearScrollMemory()` | `clearScrollMemory(type?: String)` | Clears the recorded scroll positions that browsers try to restore on refresh. |
| `ScrollTrigger.isScrolling()` | `isScrolling()` | Returns `true` if the user is currently scrolling. |
| `ScrollTrigger.positionInViewport()` | `positionInViewport(element, referencePoint?)` | Returns a normalized value (0-1) representing where the element is in the viewport. |
| `ScrollTrigger.maxScroll()` | `maxScroll(scroller, horizontal?)` | Returns the maximum scroll value for the given scroller. |
| `ScrollTrigger.isInViewport()` | `isInViewport(element, ratio?, horizontal?)` | Returns `true` if the element is in the viewport. `ratio` (0-1) sets how much must be visible. |

### Static Events

| Event | Description |
|-------|-------------|
| `"scrollStart"` | Fired when scrolling begins. |
| `"scrollEnd"` | Fired when scrolling stops. |
| `"refreshInit"` | Fired at the start of a refresh cycle. |
| `"refresh"` | Fired after all ScrollTriggers have been refreshed. |
| `"matchMedia"` | Fired when a matchMedia breakpoint changes. |

---

## Snap Configuration

The `snap` property can be a simple number/array or a detailed config object:

```js
// Simple: snap to nearest 0.25 increment (0, 0.25, 0.5, 0.75, 1)
snap: 0.25

// Array: snap to specific progress values
snap: [0, 0.25, 0.5, 0.75, 1]

// "labels": snap to nearest label in associated timeline
snap: "labels"

// "labelsDirectional": snap to next/previous label based on scroll direction
snap: "labelsDirectional"

// Full config object:
snap: {
  snapTo: 0.25,              // Number | Array | "labels" | "labelsDirectional" | Function
  duration: { min: 0.2, max: 3 }, // or a single Number; snap animation duration adapts to velocity
  delay: 0.2,                // seconds to wait after last scroll event before snapping
  ease: "power1.inOut",      // easing for snap animation
  directional: true,         // if true, snaps in the direction of scroll (default: true)
  inertia: true,             // if false, ignores velocity/inertia for snap calculation
  onStart: (self) => {},     // called when snap animation starts
  onInterrupt: (self) => {}, // called if snap is interrupted by user scroll
  onComplete: (self) => {},  // called when snap animation completes
}

// Function-based snap:
snap: {
  snapTo: (value, self, direction) => {
    // value = natural resting progress (0-1), direction = 1 or -1
    // return the progress value (0-1) to snap to
    return Math.round(value * 5) / 5;
  }
}
```

---

## Pin Configuration

```js
gsap.to(".panel", {
  scrollTrigger: {
    trigger: ".panel",
    start: "top top",
    end: "+=500",            // pin for 500px of scrolling
    pin: true,               // pin the trigger element
    // OR pin a different element:
    // pin: ".other-element",
    pinSpacing: true,         // (default: true) adds padding so subsequent content pushes down
                              // Set false for flex containers or overlapping pins
    pinType: "fixed",         // "fixed" or "transform". Default: "fixed" if scroller is viewport,
                              // "transform" otherwise. Use "transform" for nested scrollers.
    pinReparent: false,       // (default: false) If true, reparents pinned element to <body>.
                              // Avoid if possible; use only if CSS inheritance issues arise.
    anticipatePin: 1,         // (0-1+) Anticipates the pin to avoid flicker on scroll.
                              // 1 is typical. Higher = earlier pin application.
  }
});
```

### Pin Notes
- `pinSpacing: false` is automatically set if the container is `display: flex`
- `pinSpacing: "margin"` uses margin instead of padding
- Padding pushes subsequent content down so it "catches up" when the pin releases
- `anticipatePin` monitors scroll velocity to apply pin slightly early, reducing flash of unpinned content

---

## Observer Plugin

The Observer plugin watches for user interactions (scroll, touch, pointer, key) and fires callbacks based on direction, without requiring any specific scrolling context.

### Installation

```js
import { Observer } from "gsap/Observer";
gsap.registerPlugin(Observer);
```

### Configuration Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `target` | `Element \| String` | `window` | The element to observe for interactions. |
| `type` | `String` | `"wheel,touch,pointer"` | Comma-delimited list of event types: `"wheel"`, `"touch"`, `"scroll"`, `"pointer"`. |
| `tolerance` | `Number` | `10` | Minimum distance (px) before callbacks fire. E.g., if `10`, user must move 11+px. Resets after firing. |
| `debounce` | `Boolean` | `true` | If `true`, callbacks are debounced for performance. Set `false` for immediate firing. |
| `lockAxis` | `Boolean` | `false` | If `true`, locks to the first axis of movement (`"x"` or `"y"`). The `axis` property is then set. |
| `capture` | `Boolean` | `false` | If `true`, uses capture phase for touch/pointer listeners. |
| `preventDefault` | `Boolean` | `false` | If `true`, calls `preventDefault()` on relevant events. |
| `axis` | `String` | `undefined` | Force axis: `"x"` or `"y"`. Only callbacks for that axis will fire. |
| `scrollSpeed` | `Number` | `1` | Multiplier for scroll-based delta values. |
| `wheelSpeed` | `Number` | `1` | Multiplier for wheel event delta values. |
| `dragMinimum` | `Number` | `3` | Minimum px to move before a drag is recognized. |
| `id` | `String` | `undefined` | Unique identifier, retrievable via `Observer.getById()`. |
| `ignore` | `Element \| String \| Array` | `undefined` | Element(s) to ignore (won't trigger callbacks). |
| `inputType` | `String` | `undefined` | Limit to specific input: `"touch"`, `"pen"`, `"mouse"`. |
| `onStopDelay` | `Number` | `0.25` | Seconds of inactivity before `onStop` is called. |
| `onChange` | `Function` | `undefined` | Called on any directional movement (x or y). |
| `onClick` | `Function` | `undefined` | Called on click/tap. |

### Observer Callbacks

All callbacks receive the Observer instance (`self`) with properties: `self.velocityX`, `self.velocityY`, `self.deltaX`, `self.deltaY`, `self.x`, `self.y`, `self.axis`, `self.event`, `self.isDragging`, `self.isPressed`.

| Callback | Description |
|----------|-------------|
| `onUp` | Fires when user moves/scrolls **upward** (deltaY < 0). |
| `onDown` | Fires when user moves/scrolls **downward** (deltaY > 0). |
| `onLeft` | Fires when user moves/scrolls **left** (deltaX < 0). |
| `onRight` | Fires when user moves/scrolls **right** (deltaX > 0). |
| `onChangeX` | Fires on any horizontal movement. |
| `onChangeY` | Fires on any vertical movement. |
| `onChange` | Fires on any movement (x or y). |
| `onToggleX` | Fires when horizontal direction changes. |
| `onToggleY` | Fires when vertical direction changes. |
| `onDrag` | Fires while dragging (press + move). |
| `onDragStart` | Fires when drag begins. |
| `onDragEnd` | Fires when drag ends. |
| `onPress` | Fires on pointer/touch press down. |
| `onRelease` | Fires on pointer/touch release. |
| `onHover` | Fires when pointer enters the target. |
| `onHoverEnd` | Fires when pointer leaves the target. |
| `onMove` | Fires on pointer move over target (not just drag). |
| `onWheel` | Fires on wheel events. |
| `onStop` | Fires after user stops interacting (after `onStopDelay`). |
| `onLockAxis` | Fires when `lockAxis: true` and the axis gets locked. |
| `onClick` | Fires on click. |

### Observer Methods

| Method | Description |
|--------|-------------|
| `kill()` | Removes the Observer and all listeners. |
| `enable()` | Re-enables a disabled Observer. |
| `disable()` | Disables the Observer without removing it. |
| `Observer.getAll()` | Returns an Array of all Observer instances. |
| `Observer.getById(id)` | Returns the Observer with the matching id. |

---

## Code Examples

### 1. Basic Scroll-Triggered Animation

```js
gsap.to(".box", {
  x: 500,
  rotation: 360,
  scrollTrigger: {
    trigger: ".box",
    start: "top 80%",
    end: "top 20%",
    toggleActions: "play none none reverse",
    markers: true,
  }
});
```

### 2. Scrub Animation (Linked to Scrollbar)

```js
gsap.to(".progress-bar", {
  scaleX: 1,
  ease: "none",
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 0.3,  // 0.3s smoothing
  }
});
```

### 3. Pin + Scrub (Full Section Animation)

```js
let tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".section",
    start: "top top",
    end: "+=3000",   // 3000px of scroll distance
    pin: true,
    scrub: 1,
    snap: {
      snapTo: "labels",
      duration: { min: 0.2, max: 1.5 },
      delay: 0.2,
      ease: "power1.inOut",
    },
  }
});

tl.addLabel("start")
  .from(".step-1", { opacity: 0, y: 50 })
  .addLabel("step1")
  .from(".step-2", { opacity: 0, y: 50 })
  .addLabel("step2")
  .from(".step-3", { opacity: 0, y: 50 })
  .addLabel("end");
```

### 4. Horizontal Scroll

```js
let sections = gsap.utils.toArray(".panel");

gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".container",
    pin: true,
    scrub: 1,
    snap: 1 / (sections.length - 1),
    end: () => "+=" + document.querySelector(".container").offsetWidth,
  }
});
```

### 5. Parallax Effect

```js
gsap.to(".bg-image", {
  yPercent: -30,
  ease: "none",
  scrollTrigger: {
    trigger: ".section",
    start: "top bottom",
    end: "bottom top",
    scrub: true,
  }
});
```

### 6. Batch Reveal (Staggered Entrance)

```js
ScrollTrigger.batch(".card", {
  interval: 0.1,    // time window (in seconds) for batching
  batchMax: 3,      // maximum batch size
  onEnter: (batch) => gsap.to(batch, {
    opacity: 1,
    y: 0,
    stagger: 0.15,
    overwrite: true,
  }),
  onLeave: (batch) => gsap.set(batch, { opacity: 0, y: -100, overwrite: true }),
  onEnterBack: (batch) => gsap.to(batch, {
    opacity: 1,
    y: 0,
    stagger: 0.15,
    overwrite: true,
  }),
  onLeaveBack: (batch) => gsap.set(batch, { opacity: 0, y: 100, overwrite: true }),
  start: "top 85%",
  end: "top 15%",
});
```

### 7. ScrollTrigger.create() (Standalone, No Animation)

```js
ScrollTrigger.create({
  trigger: ".section",
  start: "top center",
  end: "bottom center",
  markers: true,
  toggleClass: "active",
  onEnter: () => console.log("entered"),
  onLeave: () => console.log("left"),
});
```

### 8. Responsive with matchMedia

```js
ScrollTrigger.matchMedia({
  // Desktop
  "(min-width: 800px)": function() {
    gsap.to(".box", {
      x: 500,
      scrollTrigger: {
        trigger: ".box",
        start: "top center",
        end: "bottom center",
        scrub: true,
      }
    });
  },
  // Mobile
  "(max-width: 799px)": function() {
    gsap.to(".box", {
      y: 100,
      scrollTrigger: {
        trigger: ".box",
        start: "top bottom",
        end: "top center",
        scrub: true,
      }
    });
  },
  // All
  "all": function() {
    // runs for all breakpoints
  }
});
```

### 9. ScrollerProxy (Custom Scroll Libraries)

```js
ScrollTrigger.scrollerProxy(".smooth-scroll", {
  scrollTop(value) {
    if (arguments.length) {
      locoScroll.scrollTo(value);
    }
    return locoScroll.scroll.instance.scroll.y;
  },
  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
  pinType: document.querySelector(".smooth-scroll").style.transform
    ? "transform"
    : "fixed",
});
```

### 10. Observer Plugin — Full-Page Vertical Slider

```js
let sections = document.querySelectorAll("section");
let currentIndex = 0;
let animating = false;

Observer.create({
  target: window,
  type: "wheel,touch,pointer",
  onDown: () => !animating && gotoSection(currentIndex - 1, -1),
  onUp: () => !animating && gotoSection(currentIndex + 1, 1),
  tolerance: 10,
  preventDefault: true,
  wheelSpeed: -1,
});

function gotoSection(index, direction) {
  if (index < 0 || index >= sections.length) return;
  animating = true;
  currentIndex = index;

  gsap.to(sections[currentIndex], {
    yPercent: 0,
    duration: 1.2,
    ease: "power2.inOut",
    onComplete: () => (animating = false),
  });
}
```

### 11. Toggle Class for Active Nav

```js
document.querySelectorAll("section").forEach((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: "top center",
    end: "bottom center",
    toggleClass: {
      targets: `nav a[href="#${section.id}"]`,
      className: "active",
    },
  });
});
```

### 12. containerAnimation (Nested Horizontal Triggers)

```js
let scrollTween = gsap.to(".horizontal-panels", {
  xPercent: -100 * (panels.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".horizontal-wrapper",
    pin: true,
    scrub: 1,
    end: () => "+=" + document.querySelector(".horizontal-wrapper").scrollWidth,
  }
});

// Trigger animations WITHIN the horizontal scroll
gsap.from(".panel-content", {
  opacity: 0,
  y: 50,
  scrollTrigger: {
    trigger: ".panel-content",
    containerAnimation: scrollTween,
    start: "left center",
    end: "center center",
    toggleActions: "play none none reverse",
  }
});
```

---

## Performance Tips & Best Practices

### General Performance

1. **Minimize ScrollTrigger instances** — Combine animations into timelines rather than creating individual ScrollTriggers per element.
2. **Use `batch()`** for reveal animations on many similar elements instead of individual ScrollTriggers.
3. **Use `will-change: transform`** sparingly on pinned elements to promote GPU compositing.
4. **Avoid expensive `onUpdate` callbacks** — keep them lightweight; avoid DOM reads/writes inside them.
5. **Use `scrub: Number`** (not `true`) for smoother performance; it reduces the frame rate of updates with a catch-up delay.

### Mobile Optimization

6. **`ScrollTrigger.normalizeScroll(true)`** — Intercepts native scrolling to prevent address bar jitter on mobile.
7. **`ScrollTrigger.config({ ignoreMobileResize: true })`** — Prevents recalculation when mobile browser chrome shows/hides (address bar).
8. **`anticipatePin: 1`** — Reduces pin jitter on mobile by applying pin slightly before the exact position.

### Responsive Design

9. **Use `ScrollTrigger.matchMedia()`** to create/destroy ScrollTriggers at different breakpoints instead of using CSS media queries.
10. **Use `ScrollTrigger.saveStyles()`** before `matchMedia()` to save and restore inline styles when breakpoints change.

### Cleanup (SPA / React / Next.js)

11. **Always kill ScrollTriggers** when components unmount:
    ```js
    useEffect(() => {
      const ctx = gsap.context(() => {
        // create ScrollTriggers here
      }, containerRef);

      return () => ctx.revert(); // cleanup on unmount
    }, []);
    ```
12. **`gsap.context()`** — Wraps all GSAP animations and ScrollTriggers for easy bulk cleanup. Essential for React/Next.js.
13. **`ScrollTrigger.refresh()`** — Call after dynamic content loads (images, async data) to recalculate positions.

### Common Gotchas

14. **Images loading** — Unloaded images change layout; use `ScrollTrigger.refresh()` after images load, or set explicit dimensions.
15. **Fonts loading** — Font changes affect layout; refresh after fonts load.
16. **Nested scrollers** — Use `scroller` property and possibly `scrollerProxy()`.
17. **`start`/`end` functions** — Return a string; they are re-evaluated on every refresh. Use for dynamic values.
18. **`pinSpacing`** in flex containers — Automatically set to `false`. Be aware this may cause overlapping content.
19. **`invalidateOnRefresh: true`** — Set on scrub-based animations where starting values may change on resize.

---

## ScrollTrigger.config() Options

```js
ScrollTrigger.config({
  limitCallbacks: true,        // Only fire callbacks when ScrollTrigger is in viewport
  syncInterval: 40,            // Interval (ms) for syncing scroll position (default: 40)
  autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",  // Events that trigger refresh
  ignoreMobileResize: true,    // Ignore resize events caused by mobile browser chrome
});
```

## ScrollTrigger.isTouch

```js
// Static property: 0 = no touch, 1 = touch-only, 2 = touch + pointer (e.g., laptop with touchscreen)
if (ScrollTrigger.isTouch) {
  // touch device adjustments
}
```

---

## Quick Reference: toggleActions Values

Format: `"onEnter onLeave onEnterBack onLeaveBack"`

| Value | Description |
|-------|-------------|
| `play` | Play the animation forward |
| `pause` | Pause the animation |
| `resume` | Resume the animation from current position |
| `reverse` | Reverse the animation |
| `restart` | Restart the animation from the beginning |
| `reset` | Reset to beginning without animating |
| `complete` | Jump to end of animation |
| `none` | Do nothing |

Common patterns:
- `"play none none none"` — Play once on enter (default)
- `"play pause resume reverse"` — Full control, reverses on scroll back
- `"play complete none reset"` — Plays forward on enter, resets on leave back
- `"restart none none reverse"` — Restarts every time you scroll down to it

---

*This reference covers the GSAP ScrollTrigger v3.x and Observer plugin APIs comprehensively.*
