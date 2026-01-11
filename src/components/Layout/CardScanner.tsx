"use client";

import { useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    setScannerScanning?: (active: boolean) => void;
  }
}

// Pre-generated code content to avoid runtime generation
const PRE_GENERATED_CODES = [
  `// Gelap: secure dark transfers in web3
const GELAP_PRIVACY = 'revolutionary';
function darkTransfer(amount) {
  return gelapPrivacy.transfer(amount);
}
class GelapPool {
  constructor(assets) {
    this.assets = assets;
    this.privacy = 'absolute';
  }
  transfer() {
    this.pool = gelapPrivacy.darkTransfer();
  }
}
const protection = {
  platform: 'Gelap',
  impact: 'untraceable',
  capability: 'dark transfers',
};
function ensurePrivacy(tx) {
  return tx + ' is now hidden';
}
// Gelap protects your assets`,
  `/* private blockchain payments */
const PRIVACY = 'absolute';
const ANONYMITY = Infinity;
function createPool(assets) {
  return gelapPrivacy.pool(assets);
}
const privateTransaction = () => {
  console.log('Gelap: untraceable');
};
class GelapVault {
  constructor(privacy) {
    this.privacy = privacy;
    this.anonymity = 'complete';
  }
  encrypt() {
    return gelapPrivacy.anonymize();
  }
}
const gelapPower = {
  speed: 'instant',
  privacy: 'exceptional'
};`,
  `const SECURITY = 'immense';
function anonymize(data) {
  return gelapPrivacy.encrypt(data);
}
class DarkPool {
  constructor(anonymity) {
    this.anonymity = anonymity;
    this.pool = null;
  }
  transfer() {
    this.pool = gelapPrivacy.dark();
  }
}
const impact = {
  privacy: 'absolute',
  anonymity: 'guaranteed',
  security: 'unbreakable'
};
function transferWithGelap() {
  const privacy = gelapPrivacy.dark();
  return privacy;
}`,
  `// where anonymity meets web3
const pool = new GelapPool('crypto');
const private = true; // forever
gelapPrivacy.on('transfer', () => {
  console.log('Dark transfer done');
});
class PrivacyLayer {
  constructor() {
    this.level = 'maximum';
    this.status = 'active';
  }
  protect(tx) {
    return this.encrypt(tx);
  }
}
const vault = {
  assets: 'protected',
  visibility: 'hidden'
};
// Gelap: the future of privacy`,
];

// CardStreamController - Optimized
class CardStreamController {
  container: HTMLElement;
  cardLine: HTMLElement;
  position: number;
  velocity: number;
  direction: number;
  isAnimating: boolean;
  isDragging: boolean;
  lastMouseX: number;
  mouseVelocity: number;
  friction: number;
  minVelocity: number;
  containerWidth: number;
  cardLineWidth: number;
  boundStartDrag: (e: MouseEvent) => void;
  boundOnDrag: (e: MouseEvent) => void;
  boundEndDrag: () => void;
  boundTouchStart: (e: TouchEvent) => void;
  boundTouchMove: (e: TouchEvent) => void;
  boundWheel: (e: WheelEvent) => void;
  boundResize: () => void;

  constructor(container: HTMLElement, cardLine: HTMLElement) {
    this.container = container;
    this.cardLine = cardLine;
    this.position = 0;
    this.velocity = 120;
    this.direction = -1;
    this.isAnimating = true;
    this.isDragging = false;
    this.lastMouseX = 0;
    this.mouseVelocity = 0;
    this.friction = 0.95;
    this.minVelocity = 30;
    this.containerWidth = 0;
    this.cardLineWidth = 0;

    // Bind methods for proper cleanup
    this.boundStartDrag = (e) => this.startDrag(e);
    this.boundOnDrag = (e) => this.onDrag(e);
    this.boundEndDrag = () => this.endDrag();
    this.boundTouchStart = (e) =>
      this.startDrag(e.touches[0] as unknown as MouseEvent);
    this.boundTouchMove = (e) =>
      this.onDrag(e.touches[0] as unknown as MouseEvent);
    this.boundWheel = (e) => this.onWheel(e);
    this.boundResize = () => this.calculateDimensions();

    this.init();
  }

  init() {
    this.populateCardLine();
    this.calculateDimensions();
    this.setupEventListeners();
    this.updateCardPosition();
  }

  calculateDimensions() {
    this.containerWidth = this.container.offsetWidth;
    const cardWidth = 300;
    const cardGap = 60;
    const cardCount = this.cardLine.children.length;
    this.cardLineWidth = (cardWidth + cardGap) * (cardCount / 2);
  }

  setupEventListeners() {
    this.cardLine.addEventListener("mousedown", this.boundStartDrag);
    document.addEventListener("mousemove", this.boundOnDrag);
    document.addEventListener("mouseup", this.boundEndDrag);
    this.cardLine.addEventListener("touchstart", this.boundTouchStart, {
      passive: false,
    });
    document.addEventListener(
      "touchmove",
      this.boundTouchMove as unknown as EventListener,
      { passive: false }
    );
    document.addEventListener("touchend", this.boundEndDrag);
    this.cardLine.addEventListener("wheel", this.boundWheel);
    this.cardLine.addEventListener("selectstart", (e) => e.preventDefault());
    this.cardLine.addEventListener("dragstart", (e) => e.preventDefault());
    window.addEventListener("resize", this.boundResize);
  }

  startDrag(e: MouseEvent | Touch) {
    if (e instanceof MouseEvent) {
      e.preventDefault();
    }
    this.isDragging = true;
    this.isAnimating = false;
    this.lastMouseX = e.clientX;
    this.mouseVelocity = 0;

    const transform = window.getComputedStyle(this.cardLine).transform;
    if (transform !== "none") {
      const matrix = new DOMMatrix(transform);
      this.position = matrix.m41;
    }

    this.cardLine.style.animation = "none";
    this.cardLine.classList.add("dragging");
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
  }

  onDrag(e: MouseEvent | Touch) {
    if (!this.isDragging) return;

    if (e instanceof MouseEvent) {
      e.preventDefault();
    }

    const deltaX = e.clientX - this.lastMouseX;
    this.position += deltaX;
    this.mouseVelocity = deltaX * 60;
    this.lastMouseX = e.clientX;

    this.cardLine.style.transform = `translateX(${this.position}px)`;
  }

  endDrag() {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.cardLine.classList.remove("dragging");

    if (Math.abs(this.mouseVelocity) > this.minVelocity) {
      this.velocity = Math.abs(this.mouseVelocity);
      this.direction = this.mouseVelocity > 0 ? 1 : -1;
    } else {
      this.velocity = 120;
    }

    this.isAnimating = true;
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  }

  update(deltaTime: number) {
    if (this.isAnimating && !this.isDragging) {
      if (this.velocity > this.minVelocity) {
        this.velocity *= this.friction;
      } else {
        this.velocity = Math.max(this.minVelocity, this.velocity);
      }

      this.position += this.velocity * this.direction * deltaTime;
      this.updateCardPosition();
    }
  }

  updateCardPosition() {
    const cardLineWidth = this.cardLineWidth;

    if (this.position < -cardLineWidth) {
      this.position += cardLineWidth;
    } else if (this.position > 0) {
      this.position -= cardLineWidth;
    }

    this.cardLine.style.transform = `translateX(${this.position}px)`;
  }

  updateCardClipping() {
    const scannerX = window.innerWidth / 2;
    const scannerWidth = 8;
    const scannerLeft = scannerX - scannerWidth / 2;
    const scannerRight = scannerX + scannerWidth / 2;
    let anyScanningActive = false;

    const wrappers = this.cardLine.querySelectorAll(".card-wrapper");
    for (let i = 0; i < wrappers.length; i++) {
      const wrapper = wrappers[i];
      const rect = wrapper.getBoundingClientRect();
      const cardLeft = rect.left;
      const cardRight = rect.right;
      const cardWidth = rect.width;

      const normalCard = wrapper.querySelector(".card-normal") as HTMLElement;
      const asciiCard = wrapper.querySelector(".card-ascii") as HTMLElement;

      if (cardLeft < scannerRight && cardRight > scannerLeft) {
        anyScanningActive = true;
        const scannerIntersectLeft = Math.max(scannerLeft - cardLeft, 0);
        const scannerIntersectRight = Math.min(
          scannerRight - cardLeft,
          cardWidth
        );

        const normalClipLeft = (scannerIntersectRight / cardWidth) * 100;
        const asciiClipRight = (scannerIntersectLeft / cardWidth) * 100;

        normalCard.style.setProperty("--clip-left", `${normalClipLeft}%`);
        asciiCard.style.setProperty("--clip-right", `${asciiClipRight}%`);
      } else {
        if (cardRight < scannerLeft) {
          normalCard.style.setProperty("--clip-left", "100%");
          asciiCard.style.setProperty("--clip-right", "100%");
        } else if (cardLeft > scannerRight) {
          normalCard.style.setProperty("--clip-left", "0%");
          asciiCard.style.setProperty("--clip-right", "0%");
        }
      }
    }

    if (window.setScannerScanning) {
      window.setScannerScanning(anyScanningActive);
    }
  }

  onWheel(e: WheelEvent) {
    e.preventDefault();
    const scrollSpeed = 20;
    const delta = e.deltaY > 0 ? scrollSpeed : -scrollSpeed;
    this.position += delta;
    this.updateCardPosition();
  }

  createCardWrapper(index: number): HTMLDivElement {
    const wrapper = document.createElement("div");
    wrapper.className = "card-wrapper";

    const normalCard = document.createElement("div");
    normalCard.className = "card card-normal";

    const cardImages = [
      "/logo/btc.webp",
      "/logo/eth.webp",
      "/logo/mantle.webp",
      "/logo/usdc.webp",
    ];

    const cardImage = document.createElement("img");
    cardImage.className = "card-image";
    cardImage.src = cardImages[index % cardImages.length];
    cardImage.alt = "Gelap Token";
    cardImage.loading = "lazy";

    cardImage.onerror = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const gradient = ctx.createLinearGradient(0, 0, 300, 300);
      gradient.addColorStop(0, "#667eea");
      gradient.addColorStop(1, "#764ba2");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 300, 300);
      cardImage.src = canvas.toDataURL();
    };

    normalCard.appendChild(cardImage);

    const asciiCard = document.createElement("div");
    asciiCard.className = "card card-ascii";

    const asciiContent = document.createElement("div");
    asciiContent.className = "ascii-content";
    asciiContent.textContent =
      PRE_GENERATED_CODES[index % PRE_GENERATED_CODES.length];

    asciiCard.appendChild(asciiContent);
    wrapper.appendChild(normalCard);
    wrapper.appendChild(asciiCard);

    return wrapper;
  }

  populateCardLine() {
    this.cardLine.innerHTML = "";
    const cardsCount = 4;
    for (let i = 0; i < cardsCount * 2; i++) {
      const cardWrapper = this.createCardWrapper(i % cardsCount);
      this.cardLine.appendChild(cardWrapper);
    }
  }

  destroy() {
    this.cardLine.removeEventListener("mousedown", this.boundStartDrag);
    document.removeEventListener("mousemove", this.boundOnDrag);
    document.removeEventListener("mouseup", this.boundEndDrag);
    this.cardLine.removeEventListener("touchstart", this.boundTouchStart);
    document.removeEventListener(
      "touchmove",
      this.boundTouchMove as unknown as EventListener
    );
    document.removeEventListener("touchend", this.boundEndDrag);
    this.cardLine.removeEventListener("wheel", this.boundWheel);
    window.removeEventListener("resize", this.boundResize);
  }
}

// Particle interface for both systems
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  originalAlpha: number;
  life: number;
  decay: number;
  time: number;
  twinkleSpeed: number;
  twinkleAmount: number;
}

// Unified Canvas Particle System (replaces THREE.js)
class UnifiedParticleSystem {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  w: number;
  h: number;
  backgroundParticles: Particle[];
  scannerParticles: Particle[];
  maxBackgroundParticles: number;
  maxScannerParticles: number;
  scanningActive: boolean;
  lightBarX: number;
  lightBarWidth: number;
  fadeZone: number;
  currentGlowIntensity: number;
  gradientCanvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d", { alpha: true })!;
    this.w = window.innerWidth;
    this.h = 300;

    // Reduced particle counts for better performance
    this.backgroundParticles = [];
    this.scannerParticles = [];
    this.maxBackgroundParticles = 50; // Was 150
    this.maxScannerParticles = 100; // Was 300

    this.scanningActive = false;
    this.lightBarX = this.w / 2;
    this.lightBarWidth = 3;
    this.fadeZone = 60;
    this.currentGlowIntensity = 1;

    this.gradientCanvas = document.createElement("canvas");
    this.setupCanvas();
    this.createGradientCache();
    this.initParticles();

    window.addEventListener("resize", () => this.onResize());
  }

  setupCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = this.w * dpr;
    this.canvas.height = this.h * dpr;
    this.canvas.style.width = this.w + "px";
    this.canvas.style.height = this.h + "px";
    this.ctx.scale(dpr, dpr);
  }

  onResize() {
    this.w = window.innerWidth;
    this.lightBarX = this.w / 2;
    this.setupCanvas();
    this.createGradientCache();
  }

  createGradientCache() {
    this.gradientCanvas.width = 32;
    this.gradientCanvas.height = 32;
    const ctx = this.gradientCanvas.getContext("2d")!;
    const half = 16;

    const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.3, "rgba(173, 216, 230, 0.8)");
    gradient.addColorStop(0.7, "rgba(135, 206, 250, 0.4)");
    gradient.addColorStop(1, "transparent");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(half, half, half, 0, Math.PI * 2);
    ctx.fill();
  }

  randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  createBackgroundParticle(): Particle {
    return {
      x: this.randomFloat(-this.w / 2, this.w * 1.5),
      y: this.randomFloat(0, this.h),
      vx: this.randomFloat(30, 60),
      vy: 0,
      radius: this.randomFloat(1, 3),
      alpha: this.randomFloat(0.2, 0.5),
      originalAlpha: 0,
      life: 1,
      decay: 0,
      time: Math.random() * 100,
      twinkleSpeed: this.randomFloat(0.02, 0.05),
      twinkleAmount: this.randomFloat(0.1, 0.2),
    };
  }

  createScannerParticle(): Particle {
    return {
      x:
        this.lightBarX +
        this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2),
      y: this.randomFloat(0, this.h),
      vx: this.randomFloat(0.2, 1.0),
      vy: this.randomFloat(-0.15, 0.15),
      radius: this.randomFloat(0.4, 1),
      alpha: this.randomFloat(0.6, 1),
      originalAlpha: this.randomFloat(0.6, 1),
      life: 1.0,
      decay: this.randomFloat(0.005, 0.025),
      time: 0,
      twinkleSpeed: this.randomFloat(0.02, 0.08),
      twinkleAmount: this.randomFloat(0.1, 0.25),
    };
  }

  initParticles() {
    for (let i = 0; i < this.maxBackgroundParticles; i++) {
      const p = this.createBackgroundParticle();
      p.originalAlpha = p.alpha;
      this.backgroundParticles.push(p);
    }

    for (let i = 0; i < this.maxScannerParticles; i++) {
      this.scannerParticles.push(this.createScannerParticle());
    }
  }

  updateBackgroundParticle(p: Particle, deltaTime: number) {
    p.x += p.vx * deltaTime;
    p.time += deltaTime;

    // Subtle vertical wave
    p.y += Math.sin(p.time * 2) * 0.3;

    // Twinkle effect
    p.alpha =
      p.originalAlpha +
      Math.sin(p.time * p.twinkleSpeed * 60) * p.twinkleAmount;

    // Reset when out of screen
    if (p.x > this.w + 100) {
      p.x = -100;
      p.y = this.randomFloat(0, this.h);
    }
  }

  updateScannerParticle(p: Particle) {
    p.x += p.vx;
    p.y += p.vy;
    p.time++;

    p.alpha =
      p.originalAlpha * p.life +
      Math.sin(p.time * p.twinkleSpeed) * p.twinkleAmount;
    p.life -= p.decay;

    if (p.x > this.w + 10 || p.life <= 0) {
      this.resetScannerParticle(p);
    }
  }

  resetScannerParticle(p: Particle) {
    p.x =
      this.lightBarX +
      this.randomFloat(-this.lightBarWidth / 2, this.lightBarWidth / 2);
    p.y = this.randomFloat(0, this.h);
    p.vx = this.randomFloat(0.2, 1.0);
    p.vy = this.randomFloat(-0.15, 0.15);
    p.alpha = this.randomFloat(0.6, 1);
    p.originalAlpha = p.alpha;
    p.life = 1.0;
    p.time = 0;
  }

  drawParticle(p: Particle, isScannerParticle: boolean = false) {
    if (p.life <= 0 && isScannerParticle) return;

    let fadeAlpha = 1;
    if (isScannerParticle) {
      if (p.y < this.fadeZone) {
        fadeAlpha = p.y / this.fadeZone;
      } else if (p.y > this.h - this.fadeZone) {
        fadeAlpha = (this.h - p.y) / this.fadeZone;
      }
    }

    this.ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha * fadeAlpha));
    const size = p.radius * 2;
    this.ctx.drawImage(
      this.gradientCanvas,
      p.x - p.radius,
      p.y - p.radius,
      size,
      size
    );
  }

  drawLightBar() {
    const cardHeight = 300;
    const currentHeight = cardHeight;
    const drawY = (this.h - currentHeight) / 2;
    const fadeZone = this.scanningActive ? 5 : this.fadeZone;

    const targetGlowIntensity = this.scanningActive ? 3.5 : 1;
    this.currentGlowIntensity +=
      (targetGlowIntensity - this.currentGlowIntensity) * 0.05;

    const glowIntensity = this.currentGlowIntensity;
    const lineWidth = this.lightBarWidth;

    this.ctx.globalCompositeOperation = "lighter";

    // Core glow
    const coreGradient = this.ctx.createLinearGradient(
      this.lightBarX - lineWidth / 2,
      0,
      this.lightBarX + lineWidth / 2,
      0
    );
    coreGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    coreGradient.addColorStop(
      0.3,
      `rgba(255, 255, 255, ${0.9 * glowIntensity})`
    );
    coreGradient.addColorStop(0.5, `rgba(255, 255, 255, ${1 * glowIntensity})`);
    coreGradient.addColorStop(
      0.7,
      `rgba(255, 255, 255, ${0.9 * glowIntensity})`
    );
    coreGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = coreGradient;
    this.ctx.fillRect(
      this.lightBarX - lineWidth / 2,
      drawY,
      lineWidth,
      currentHeight
    );

    // Outer glow 1
    const glow1Gradient = this.ctx.createLinearGradient(
      this.lightBarX - lineWidth * 2,
      0,
      this.lightBarX + lineWidth * 2,
      0
    );
    glow1Gradient.addColorStop(0, "rgba(135, 206, 250, 0)");
    glow1Gradient.addColorStop(
      0.5,
      `rgba(173, 216, 230, ${0.8 * glowIntensity})`
    );
    glow1Gradient.addColorStop(1, "rgba(135, 206, 250, 0)");

    this.ctx.globalAlpha = this.scanningActive ? 1.0 : 0.8;
    this.ctx.fillStyle = glow1Gradient;
    this.ctx.fillRect(
      this.lightBarX - lineWidth * 2,
      drawY,
      lineWidth * 4,
      currentHeight
    );

    // Outer glow 2
    const glow2Gradient = this.ctx.createLinearGradient(
      this.lightBarX - lineWidth * 4,
      0,
      this.lightBarX + lineWidth * 4,
      0
    );
    glow2Gradient.addColorStop(0, "rgba(135, 206, 250, 0)");
    glow2Gradient.addColorStop(
      0.5,
      `rgba(135, 206, 250, ${0.4 * glowIntensity})`
    );
    glow2Gradient.addColorStop(1, "rgba(135, 206, 250, 0)");

    this.ctx.globalAlpha = this.scanningActive ? 0.8 : 0.6;
    this.ctx.fillStyle = glow2Gradient;
    this.ctx.fillRect(
      this.lightBarX - lineWidth * 4,
      drawY,
      lineWidth * 8,
      currentHeight
    );

    // Vertical fade mask
    const verticalGradient = this.ctx.createLinearGradient(
      0,
      drawY,
      0,
      drawY + currentHeight
    );
    verticalGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
    verticalGradient.addColorStop(
      Math.min(0.5, fadeZone / currentHeight),
      "rgba(255, 255, 255, 1)"
    );
    verticalGradient.addColorStop(
      Math.max(0.5, 1 - fadeZone / currentHeight),
      "rgba(255, 255, 255, 1)"
    );
    verticalGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    this.ctx.globalCompositeOperation = "destination-in";
    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = verticalGradient;
    this.ctx.fillRect(0, drawY, this.w, currentHeight);
  }

  render(deltaTime: number) {
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.clearRect(0, 0, this.w, this.h);

    // Draw light bar
    this.drawLightBar();

    // Draw particles
    this.ctx.globalCompositeOperation = "lighter";

    // Background particles
    for (const p of this.backgroundParticles) {
      this.updateBackgroundParticle(p, deltaTime);
      this.drawParticle(p, false);
    }

    // Scanner particles
    for (const p of this.scannerParticles) {
      this.updateScannerParticle(p);
      this.drawParticle(p, true);
    }
  }

  setScanningActive(active: boolean) {
    this.scanningActive = active;
  }

  destroy() {
    window.removeEventListener("resize", () => this.onResize());
  }
}

export function CardScanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardStreamRef = useRef<HTMLDivElement>(null);
  const cardLineRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(true);
  const animationIdRef = useRef<number | null>(null);

  const animate = useCallback(
    (
      controller: CardStreamController,
      particleSystem: UnifiedParticleSystem,
      lastTimeRef: { current: number }
    ) => {
      if (!isVisibleRef.current) {
        animationIdRef.current = requestAnimationFrame(() =>
          animate(controller, particleSystem, lastTimeRef)
        );
        return;
      }

      const currentTime = performance.now();
      const deltaTime = Math.min(
        (currentTime - lastTimeRef.current) / 1000,
        0.1
      );
      lastTimeRef.current = currentTime;

      // Update card stream
      controller.update(deltaTime);
      controller.updateCardClipping();

      // Render particles
      particleSystem.render(deltaTime);

      animationIdRef.current = requestAnimationFrame(() =>
        animate(controller, particleSystem, lastTimeRef)
      );
    },
    []
  );

  useEffect(() => {
    if (!cardLineRef.current || !canvasRef.current || !cardStreamRef.current)
      return;

    // Initialize systems
    const controller = new CardStreamController(
      cardStreamRef.current,
      cardLineRef.current
    );
    const particleSystem = new UnifiedParticleSystem(canvasRef.current);

    window.setScannerScanning = (active: boolean) => {
      particleSystem.setScanningActive(active);
    };

    // Visibility observer for pausing when off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0].isIntersecting;
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Start unified animation loop
    const lastTimeRef = { current: performance.now() };
    animationIdRef.current = requestAnimationFrame(() =>
      animate(controller, particleSystem, lastTimeRef)
    );

    // Cleanup
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      controller.destroy();
      particleSystem.destroy();
      observer.disconnect();
      delete window.setScannerScanning;
    };
  }, [animate]);

  return (
    <>
      <style jsx global>{`
        .card-scanner-container {
          position: relative;
          width: 100%;
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .card-stream {
          position: absolute;
          width: 100vw;
          height: 180px;
          display: flex;
          align-items: center;
          overflow: visible;
        }

        .card-line {
          display: flex;
          align-items: center;
          gap: 60px;
          white-space: nowrap;
          cursor: grab;
          user-select: none;
          will-change: transform;
        }

        .card-line:active,
        .card-line.dragging {
          cursor: grabbing;
        }

        .card-wrapper {
          position: relative;
          width: 300px;
          height: 300px;
          flex-shrink: 0;
        }

        .card {
          position: absolute;
          top: 0;
          left: 0;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          overflow: hidden;
        }

        .card-normal {
          background: transparent;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 0;
          color: white;
          z-index: 2;
          position: relative;
          overflow: hidden;
          -webkit-mask-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0) var(--clip-left, 0%),
            rgba(0, 0, 0, 1) var(--clip-left, 0%),
            rgba(0, 0, 0, 1) 100%
          );
          mask-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0) var(--clip-left, 0%),
            rgba(0, 0, 0, 1) var(--clip-left, 0%),
            rgba(0, 0, 0, 1) 100%
          );
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
          filter: brightness(1.1) contrast(1.1);
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
        }

        .card-ascii {
          background: transparent;
          z-index: 1;
          position: absolute;
          top: 0;
          left: 0;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          overflow: hidden;
          -webkit-mask-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 1) var(--clip-right, 0%),
            rgba(0, 0, 0, 0) var(--clip-right, 0%),
            rgba(0, 0, 0, 0) 100%
          );
          mask-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 1) var(--clip-right, 0%),
            rgba(0, 0, 0, 0) var(--clip-right, 0%),
            rgba(0, 0, 0, 0) 100%
          );
        }

        .ascii-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          color: rgba(220, 210, 255, 0.6);
          font-family: "Courier New", monospace;
          font-size: 11px;
          line-height: 13px;
          overflow: hidden;
          white-space: pre;
          margin: 0;
          padding: 8px;
          text-align: left;
          vertical-align: top;
          box-sizing: border-box;
        }

        #unifiedCanvas {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 100vw;
          height: 300px;
          z-index: 15;
          pointer-events: none;
        }
      `}</style>

      <div className="card-scanner-container" ref={containerRef}>
        <canvas ref={canvasRef} id="unifiedCanvas" />

        <div className="card-stream" ref={cardStreamRef}>
          <div className="card-line" ref={cardLineRef}></div>
        </div>
      </div>
    </>
  );
}
