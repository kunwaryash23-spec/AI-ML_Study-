"use client";

import gsap from "gsap";
import { type FC, type ReactNode, useEffect, useRef, useState } from "react";
import { type Vector2, vec2 } from "vecteur";

/**
 * The pinned magnetic-cursor reference, adapted for this surface.
 *
 * Two deliberate changes from the original:
 *
 * 1. The text-caret stretch is gone. On a page whose primary control is a text
 *    field, a cursor that morphs over every paragraph fights the content. Here
 *    the cursor only reacts to things you can actually press.
 * 2. `data-magnetic` is opt-in per element and the element pull is small, so
 *    transport buttons and timecode chips lean toward the pointer without ever
 *    drifting far enough to make them hard to hit.
 *
 * Disabled entirely on touch and under prefers-reduced-motion.
 */

interface MagneticCursorProps {
  children: ReactNode;
  magneticFactor?: number;
  lerpAmount?: number;
  hoverPadding?: number;
  cursorSize?: number;
  cursorColor?: string;
  blendMode?: "difference" | "exclusion" | "normal";
  speedMultiplier?: number;
  maxScaleX?: number;
  maxScaleY?: number;
  contrastBoost?: number;
  /** Ring colour used while the cursor is snapped to a control. */
  ringColor?: string;
}

interface CursorState {
  el: HTMLDivElement | null;
  pos: { current: Vector2; target: Vector2; previous: Vector2 };
  hover: { isHovered: boolean };
  isDetaching: boolean;
}

export const MagneticCursor: FC<MagneticCursorProps> = ({
  children,
  magneticFactor = 0.22,
  lerpAmount = 0.16,
  hoverPadding = 8,
  cursorSize = 14,
  cursorColor = "#F2EFE9",
  blendMode = "exclusion",
  speedMultiplier = 0.018,
  maxScaleX = 0.7,
  maxScaleY = 0.25,
  contrastBoost = 1.35,
  ringColor = "rgba(255, 176, 32, 0.85)",
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<CursorState | null>(null);
  const [enabled, setEnabled] = useState(false);

  const configRef = useRef({ magneticFactor, speedMultiplier, maxScaleX, maxScaleY, cursorSize, lerpAmount, hoverPadding });
  useEffect(() => {
    configRef.current = { magneticFactor, speedMultiplier, maxScaleX, maxScaleY, cursorSize, lerpAmount, hoverPadding };
  }, [magneticFactor, speedMultiplier, maxScaleX, maxScaleY, cursorSize, lerpAmount, hoverPadding]);

  useEffect(() => {
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(!isTouch && finePointer && !reduced);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const cursorEl = cursorRef.current;
    if (!cursorEl) return;

    gsap.set(cursorEl, { xPercent: -50, yPercent: -50, opacity: 0 });

    stateRef.current ??= {
      el: cursorEl,
      pos: { current: vec2(-200, -200), target: vec2(-200, -200), previous: vec2(-200, -200) },
      hover: { isHovered: false },
      isDetaching: false,
    };

    const update = () => {
      const state = stateRef.current;
      if (!state || state.hover.isHovered) return;

      const cfg = configRef.current;
      state.pos.current.lerp(state.pos.target, cfg.lerpAmount);
      const delta = state.pos.current.clone().sub(state.pos.previous);
      state.pos.previous.copy(state.pos.current);

      if (state.isDetaching) {
        gsap.set(state.el, { x: state.pos.current.x, y: state.pos.current.y, scaleX: 1, scaleY: 1, rotate: 0, overwrite: "auto" });
        return;
      }

      const speed = Math.hypot(delta.x, delta.y) * cfg.speedMultiplier;
      gsap.set(state.el, {
        x: state.pos.current.x,
        y: state.pos.current.y,
        rotate: (Math.atan2(delta.y, delta.x) * 180) / Math.PI,
        scaleX: 1 + Math.min(speed, cfg.maxScaleX),
        scaleY: 1 - Math.min(speed, cfg.maxScaleY),
        overwrite: "auto",
      });
    };

    const initialise = (event: PointerEvent) => {
      const state = stateRef.current;
      if (!state) return;
      const { clientX: x, clientY: y } = event;
      state.pos.current.x = x;
      state.pos.current.y = y;
      state.pos.target.x = x;
      state.pos.target.y = y;
      state.pos.previous.x = x;
      state.pos.previous.y = y;
      gsap.set(cursorEl, { x, y, opacity: 1 });
    };

    const onMove = (event: PointerEvent) => {
      const state = stateRef.current;
      if (!state) return;
      state.pos.target.x = event.clientX;
      state.pos.target.y = event.clientY;
    };

    const onLeave = () => gsap.to(cursorEl, { opacity: 0, duration: 0.25 });
    const onEnter = () => gsap.to(cursorEl, { opacity: 1, duration: 0.25 });

    gsap.ticker.add(update);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointermove", initialise, { once: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    /* -- magnetic targets ------------------------------------------------
       Bound at the document level via event delegation so elements added
       after mount (result cards, timeline pins) are magnetic too, without
       re-running this effect on every render. */

    const quickTos = new WeakMap<HTMLElement, { x: (v: number) => void; y: (v: number) => void }>();

    const tweensFor = (el: HTMLElement) => {
      let entry = quickTos.get(el);
      if (!entry) {
        entry = {
          x: gsap.quickTo(el, "x", { duration: 0.9, ease: "elastic.out(1, 0.4)" }),
          y: gsap.quickTo(el, "y", { duration: 0.9, ease: "elastic.out(1, 0.4)" }),
        };
        quickTos.set(el, entry);
      }
      return entry;
    };

    const magneticTarget = (node: EventTarget | null) =>
      node instanceof Element ? (node.closest("[data-magnetic]") as HTMLElement | null) : null;

    let active: HTMLElement | null = null;

    const onOver = (event: PointerEvent) => {
      const el = magneticTarget(event.target);
      if (!el || el === active) return;
      active = el;

      const state = stateRef.current;
      if (!state) return;
      state.hover.isHovered = true;
      state.isDetaching = false;

      const bounds = el.getBoundingClientRect();
      const radius = window.getComputedStyle(el).borderRadius;
      const padding = configRef.current.hoverPadding;

      // While snapped to a control, the cursor becomes a ring in normal blend
      // rather than a filled exclusion blob. Exclusion over a saturated fill
      // inverts it -- an amber button turns blue and its label stops being
      // readable, which is a worse outcome than having no cursor effect at all.
      cursorEl.style.mixBlendMode = "normal";
      cursorEl.style.backgroundColor = "transparent";
      cursorEl.style.boxShadow = `inset 0 0 0 1.5px ${ringColor}`;
      cursorEl.style.setProperty("backdrop-filter", "none");
      cursorEl.style.setProperty("-webkit-backdrop-filter", "none");

      gsap.killTweensOf(cursorEl);
      gsap.to(cursorEl, {
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
        width: bounds.width + padding * 2,
        height: bounds.height + padding * 2,
        borderRadius: radius === "0px" ? "10px" : radius,
        scaleX: 1,
        scaleY: 1,
        rotate: 0,
        duration: 0.32,
        ease: "power3.out",
        overwrite: true,
      });
    };

    const onOut = (event: PointerEvent) => {
      if (!active) return;
      const next = magneticTarget(event.relatedTarget);
      if (next === active) return;

      const { x, y } = tweensFor(active);
      x(0);
      y(0);
      active = null;

      const state = stateRef.current;
      if (!state) return;

      const currentX = gsap.getProperty(cursorEl, "x") as number;
      const currentY = gsap.getProperty(cursorEl, "y") as number;
      state.pos.current.x = currentX;
      state.pos.current.y = currentY;
      state.pos.previous.x = currentX;
      state.pos.previous.y = currentY;
      state.hover.isHovered = false;
      state.isDetaching = true;

      cursorEl.style.mixBlendMode = blendMode;
      cursorEl.style.backgroundColor = cursorColor;
      cursorEl.style.boxShadow = "none";
      cursorEl.style.setProperty("backdrop-filter", `contrast(${contrastBoost})`);
      cursorEl.style.setProperty("-webkit-backdrop-filter", `contrast(${contrastBoost})`);

      gsap.killTweensOf(cursorEl);
      gsap.to(cursorEl, {
        width: configRef.current.cursorSize,
        height: configRef.current.cursorSize,
        borderRadius: "50%",
        scaleX: 1,
        scaleY: 1,
        duration: 0.34,
        ease: "power3.out",
        overwrite: true,
        onComplete: () => {
          state.isDetaching = false;
        },
      });
    };

    let rafId: number | null = null;
    const onPull = (event: PointerEvent) => {
      if (!active || rafId) return;
      const el = active;
      rafId = requestAnimationFrame(() => {
        const { left, top, width, height } = el.getBoundingClientRect();
        const { x, y } = tweensFor(el);
        const factor = configRef.current.magneticFactor;
        x((event.clientX - (left + width / 2)) * factor);
        y((event.clientY - (top + height / 2)) * factor);
        rafId = null;
      });
    };

    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("pointermove", onPull);

    return () => {
      gsap.ticker.remove(update);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointermove", onPull);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [enabled, blendMode, contrastBoost, cursorColor, ringColor]);

  if (!enabled) return <>{children}</>;

  return (
    <>
      <div
        ref={cursorRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          pointerEvents: "none",
          willChange: "transform, width, height, border-radius",
          width: cursorSize,
          height: cursorSize,
          borderRadius: "50%",
          backgroundColor: cursorColor,
          mixBlendMode: blendMode,
          backdropFilter: `contrast(${contrastBoost})`,
          WebkitBackdropFilter: `contrast(${contrastBoost})`,
        }}
      />
      {children}
    </>
  );
};
