import { describe, expect, it } from "vitest";
import {
  AUTOPLAY_MS,
  initialSliderState,
  isAutoplaying,
  formatSlideLabel,
  sliderReducer,
  type SliderState,
} from "./slider-state";

const at = (index: number, rest: Partial<SliderState> = {}): SliderState => ({
  ...initialSliderState(5),
  index,
  ...rest,
});

describe("sliderReducer", () => {
  it("starts on the first slide, playing, not held", () => {
    expect(initialSliderState(5)).toEqual({
      index: 0,
      count: 5,
      paused: false,
      held: false,
    });
  });

  it("goes to the next slide and wraps from the last to the first", () => {
    expect(sliderReducer(at(1), { type: "next" }).index).toBe(2);
    expect(sliderReducer(at(4), { type: "next" }).index).toBe(0);
  });

  it("goes to the previous slide and wraps from the first to the last", () => {
    expect(sliderReducer(at(3), { type: "previous" }).index).toBe(2);
    expect(sliderReducer(at(0), { type: "previous" }).index).toBe(4);
  });

  it("goes to a given slide", () => {
    expect(sliderReducer(at(0), { type: "goTo", index: 3 }).index).toBe(3);
  });

  it("ignores a slide index that does not exist", () => {
    const state = at(2);
    expect(sliderReducer(state, { type: "goTo", index: 5 })).toBe(state);
    expect(sliderReducer(state, { type: "goTo", index: -1 })).toBe(state);
    expect(sliderReducer(state, { type: "goTo", index: 1.5 })).toBe(state);
  });

  it("pauses and resumes on the user's request, keeping the slide", () => {
    const paused = sliderReducer(at(2), { type: "pause" });
    expect(paused).toMatchObject({ index: 2, paused: true });
    expect(sliderReducer(paused, { type: "resume" })).toMatchObject({
      index: 2,
      paused: false,
    });
  });

  it("holds on hover or focus and releases without touching the user's pause", () => {
    const held = sliderReducer(at(1), { type: "hold" });
    expect(held.held).toBe(true);
    expect(sliderReducer(held, { type: "release" }).held).toBe(false);

    const pausedThenHeld = sliderReducer(
      sliderReducer(at(1), { type: "pause" }),
      { type: "hold" },
    );
    expect(sliderReducer(pausedThenHeld, { type: "release" }).paused).toBe(
      true,
    );
  });

  it("returns the same state when an action changes nothing", () => {
    const paused = at(0, { paused: true });
    expect(sliderReducer(paused, { type: "pause" })).toBe(paused);
    const held = at(0, { held: true });
    expect(sliderReducer(held, { type: "hold" })).toBe(held);
  });

  it("never moves when there is a single slide", () => {
    const single = initialSliderState(1);
    expect(sliderReducer(single, { type: "next" }).index).toBe(0);
    expect(sliderReducer(single, { type: "previous" }).index).toBe(0);
  });
});

describe("isAutoplaying", () => {
  it("runs only when nothing stops it", () => {
    expect(isAutoplaying(at(0), false)).toBe(true);
    expect(isAutoplaying(at(0, { paused: true }), false)).toBe(false);
    expect(isAutoplaying(at(0, { held: true }), false)).toBe(false);
  });

  it("never runs under prefers-reduced-motion", () => {
    expect(isAutoplaying(at(0), true)).toBe(false);
  });

  it("never runs with a single slide", () => {
    expect(isAutoplaying(initialSliderState(1), false)).toBe(false);
  });

  it("rotates every 6 seconds", () => {
    expect(AUTOPLAY_MS).toBe(6000);
  });
});

describe("formatSlideLabel", () => {
  it("fills the localized template", () => {
    expect(formatSlideLabel("{current} of {total}", 2, 5)).toBe("2 of 5");
    expect(formatSlideLabel("{current} sur {total}", 1, 5)).toBe("1 sur 5");
  });
});
