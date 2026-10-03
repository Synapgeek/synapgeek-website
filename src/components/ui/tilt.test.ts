import { describe, expect, it } from "vitest";
import { approach, tiltTarget } from "./tilt";

const VIEWPORT = { width: 1000, height: 800 };
const RECT = { left: 400, top: 300, width: 200, height: 200 }; // centre (500, 400)

describe("tiltTarget", () => {
  it("is flat when the pointer sits on the element centre", () => {
    expect(tiltTarget({ x: 500, y: 400 }, RECT, VIEWPORT, 5)).toEqual({
      rotateX: 0,
      rotateY: 0,
    });
  });

  it("turns the surface toward a pointer on the right: positive rotateY", () => {
    const { rotateX, rotateY } = tiltTarget(
      { x: 1000, y: 400 },
      RECT,
      VIEWPORT,
      5,
    );
    expect(rotateY).toBeCloseTo(5 * (500 / 500));
    expect(rotateX).toBeCloseTo(0);
  });

  it("turns toward a pointer below: negative rotateX (bottom edge recedes)", () => {
    const { rotateX } = tiltTarget({ x: 500, y: 800 }, RECT, VIEWPORT, 5);
    expect(rotateX).toBeLessThan(0);
  });

  it("never exceeds the maximum, however far the pointer is", () => {
    const far = tiltTarget({ x: 99999, y: -99999 }, RECT, VIEWPORT, 5);
    expect(Math.abs(far.rotateX)).toBe(5);
    expect(Math.abs(far.rotateY)).toBe(5);
  });

  it("damps by distance: halfway to the viewport edge gives about half the angle", () => {
    const near = tiltTarget({ x: 750, y: 400 }, RECT, VIEWPORT, 5);
    expect(near.rotateY).toBeCloseTo(2.5);
  });
});

describe("approach", () => {
  it("moves toward the target without overshooting", () => {
    const next = approach(0, 5, 16);
    expect(next).toBeGreaterThan(0);
    expect(next).toBeLessThan(5);
  });

  it("is frame-rate independent: two 8 ms steps equal one 16 ms step", () => {
    const twice = approach(approach(0, 5, 8), 5, 8);
    expect(twice).toBeCloseTo(approach(0, 5, 16), 6);
  });

  it("stays put when already on target", () => {
    expect(approach(3, 3, 16)).toBe(3);
  });
});
