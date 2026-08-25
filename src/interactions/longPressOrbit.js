const DEFAULT_HOLD_MS = 600;
const DEFAULT_MOVE_TOLERANCE = 12;
const DEFAULT_DEAD_ZONE = 8;
const DEFAULT_SPEED_PER_PIXEL = 0.55;
const DEFAULT_MAX_SPEED = 120;

export function enableLongPressOrbit(map, options = {}) {
  const holdMs = options.holdMs ?? DEFAULT_HOLD_MS;
  const moveTolerance = options.moveTolerance ?? DEFAULT_MOVE_TOLERANCE;
  const deadZone = options.deadZone ?? DEFAULT_DEAD_ZONE;
  const speedPerPixel = options.speedPerPixel ?? DEFAULT_SPEED_PER_PIXEL;
  const maxSpeed = options.maxSpeed ?? DEFAULT_MAX_SPEED;
  const container = map.getCanvasContainer();

  let activePointerId = null;
  let startPoint = null;
  let pivot = null;
  let holdTimer = null;
  let animationFrame = null;
  let lastFrameTime = null;
  let rotationSpeed = 0;
  let orbiting = false;
  let handlersToRestore = [];

  const interactionHandlers = [
    map.dragPan,
    map.dragRotate,
    map.touchZoomRotate,
    map.scrollZoom,
    map.doubleClickZoom,
  ];

  function clearHoldTimer() {
    if (holdTimer !== null) {
      window.clearTimeout(holdTimer);
      holdTimer = null;
    }
  }

  function disableMapInteractions() {
    handlersToRestore = interactionHandlers.filter(
      (handler) => handler?.isEnabled?.(),
    );
    handlersToRestore.forEach((handler) => handler.disable());
  }

  function restoreMapInteractions() {
    handlersToRestore.forEach((handler) => handler.enable());
    handlersToRestore = [];
  }

  function rotate(time) {
    if (!orbiting) return;

    if (lastFrameTime !== null) {
      const elapsedSeconds = Math.min(time - lastFrameTime, 50) / 1000;
      if (rotationSpeed !== 0) {
        map.jumpTo({
          center: pivot,
          bearing: map.getBearing() + rotationSpeed * elapsedSeconds,
        });
      }
    }

    lastFrameTime = time;
    animationFrame = window.requestAnimationFrame(rotate);
  }

  function startOrbit() {
    holdTimer = null;
    orbiting = true;
    map.stop();
    disableMapInteractions();
    map.jumpTo({ center: pivot, pitch: Math.max(map.getPitch(), 60) });
    container.classList.add('is-orbiting');
    options.onStart?.(pivot);
    animationFrame = window.requestAnimationFrame(rotate);
  }

  function reset() {
    clearHoldTimer();

    if (animationFrame !== null) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    if (orbiting) {
      orbiting = false;
      restoreMapInteractions();
      container.classList.remove('is-orbiting');
      options.onStop?.();
    }

    activePointerId = null;
    startPoint = null;
    pivot = null;
    lastFrameTime = null;
    rotationSpeed = 0;
  }

  function onPointerDown(event) {
    if (activePointerId !== null || (event.pointerType === 'mouse' && event.button !== 0)) {
      reset();
      return;
    }

    activePointerId = event.pointerId;
    startPoint = { x: event.clientX, y: event.clientY };

    const rect = container.getBoundingClientRect();
    pivot = map.unproject([
      event.clientX - rect.left,
      event.clientY - rect.top,
    ]);

    holdTimer = window.setTimeout(startOrbit, holdMs);
  }

  function onPointerMove(event) {
    if (event.pointerId !== activePointerId || !startPoint) return;

    if (orbiting) {
      event.preventDefault();

      // Up is positive (clockwise), down is negative (counter-clockwise).
      const verticalDistance = startPoint.y - event.clientY;
      const effectiveDistance = Math.max(
        0,
        Math.abs(verticalDistance) - deadZone,
      );

      rotationSpeed =
        Math.sign(verticalDistance) *
        Math.min(maxSpeed, effectiveDistance * speedPerPixel);
      return;
    }

    const distance = Math.hypot(
      event.clientX - startPoint.x,
      event.clientY - startPoint.y,
    );

    if (distance > moveTolerance) reset();
  }

  function onPointerEnd(event) {
    if (event.pointerId === activePointerId) reset();
  }

  function preventContextMenu(event) {
    if (orbiting || holdTimer !== null) event.preventDefault();
  }

  container.addEventListener('pointerdown', onPointerDown);
  container.addEventListener('pointermove', onPointerMove, { passive: false });
  container.addEventListener('pointerup', onPointerEnd);
  container.addEventListener('pointercancel', onPointerEnd);
  container.addEventListener('contextmenu', preventContextMenu);

  return () => {
    reset();
    container.removeEventListener('pointerdown', onPointerDown);
    container.removeEventListener('pointermove', onPointerMove);
    container.removeEventListener('pointerup', onPointerEnd);
    container.removeEventListener('pointercancel', onPointerEnd);
    container.removeEventListener('contextmenu', preventContextMenu);
  };
}
