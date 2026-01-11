import React, { useRef, useEffect, useCallback, useState } from "react";
import { gsap } from "gsap";
import "./MagicBento.css";

export interface BentoCardProps {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  image?: string;
  textAutoHide?: boolean;
  disableAnimations?: boolean;
}

export interface BentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 2; // Reduced from 4
const DEFAULT_SPOTLIGHT_RADIUS = 250;
const DEFAULT_GLOW_COLOR = "0, 100, 102";
const MOBILE_BREAKPOINT = 768;
const THROTTLE_MS = 16; // ~60fps

const cardData: BentoCardProps[] = [
  {
    color: "#001414",
    title: "Dark Transfers",
    description: "Untraceable p2p transactions",
    label: "Privacy",
    image: "/logo/btc.webp",
  },
  {
    color: "#001414",
    title: "Shielded Vaults",
    description: "Earn yield with hidden position sizes",
    label: "Yield",
    image: "/logo/eth.webp",
  },
  {
    color: "#001414",
    title: "Private Swaps",
    description: "MEV-resistant confidential trading",
    label: "DeFi",
    image: "/logo/mantle.webp",
  },
  {
    color: "#001414",
    title: "Confidential RWA",
    description: "Trade Real-World Assets privately",
    label: "Assets",
    image: "/logo/usdc.webp",
  },
];

// Throttle utility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const throttle = <T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    const now = performance.now();
    const timeSinceLastCall = now - lastCall;

    if (timeSinceLastCall >= delay) {
      lastCall = now;
      fn(...args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = performance.now();
        timeoutId = null;
        fn(...args);
      }, delay - timeSinceLastCall);
    }
  };
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number
) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty("--glow-x", `${relativeX}%`);
  card.style.setProperty("--glow-y", `${relativeY}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
};

// Optimized ParticleCard with reusable tweens and reduced particles
const ParticleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}> = ({
  children,
  className = "",
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const isHoveredRef = useRef(false);
  const tweensRef = useRef<gsap.core.Tween[]>([]);
  const tiltTweenRef = useRef<gsap.core.Tween | null>(null);
  const magnetTweenRef = useRef<gsap.core.Tween | null>(null);

  // Helper function to create a particle element (only called on client-side)
  const createParticleElement = useCallback(() => {
    const el = document.createElement("div");
    el.className = "particle";
    el.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: rgba(${glowColor}, 1);
      box-shadow: 0 0 6px rgba(${glowColor}, 0.6);
      pointer-events: none;
      z-index: 100;
      opacity: 0;
      transform: scale(0);
    `;
    return el;
  }, [glowColor]);

  const clearAllParticles = useCallback(() => {
    // Kill all tweens
    tweensRef.current.forEach((tween) => tween.kill());
    tweensRef.current = [];

    // Remove particles with quick fade
    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.2,
        onComplete: () => particle.remove(),
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();

    // Create particles on-demand (client-side only)
    for (let i = 0; i < particleCount; i++) {
      if (!isHoveredRef.current || !cardRef.current) return;

      const particle = createParticleElement();
      particle.style.left = `${Math.random() * width}px`;
      particle.style.top = `${Math.random() * height}px`;

      cardRef.current.appendChild(particle);
      particlesRef.current.push(particle);

      // Combined animation using timeline for better performance
      const tl = gsap.timeline();
      tl.to(particle, {
        scale: 1,
        opacity: 0.8,
        duration: 0.3,
        delay: i * 0.1,
      }).to(particle, {
        x: (Math.random() - 0.5) * 80,
        y: (Math.random() - 0.5) * 80,
        opacity: 0.3,
        duration: 2,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });

      tweensRef.current.push(tl as unknown as gsap.core.Tween);
    }
  }, [particleCount, createParticleElement]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      // Reset transforms
      tiltTweenRef.current?.kill();
      magnetTweenRef.current?.kill();

      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMouseMove = throttle((e: any) => {
      const mouseEvent = e as MouseEvent;
      if (!cardRef.current || (!enableTilt && !enableMagnetism)) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = mouseEvent.clientX - rect.left;
      const y = mouseEvent.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        // Reuse tween instead of creating new one
        if (tiltTweenRef.current) {
          tiltTweenRef.current.kill();
        }
        tiltTweenRef.current = gsap.to(cardRef.current, {
          rotateX,
          rotateY,
          duration: 0.15,
          ease: "power2.out",
          transformPerspective: 1000,
          overwrite: true,
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.03;
        const magnetY = (y - centerY) * 0.03;

        if (magnetTweenRef.current) {
          magnetTweenRef.current.kill();
        }
        magnetTweenRef.current = gsap.to(cardRef.current, {
          x: magnetX,
          y: magnetY,
          duration: 0.2,
          ease: "power2.out",
          overwrite: true,
        });
      }
    }, THROTTLE_MS);

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxDistance = Math.max(rect.width, rect.height);

      const ripple = document.createElement("div");
      ripple.className = "ripple-effect";
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.3) 0%, transparent 60%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
        transform: scale(0);
        opacity: 1;
      `;

      element.appendChild(ripple);

      gsap.to(ripple, {
        scale: 1,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => ripple.remove(),
      });
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("click", handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("click", handleClick);
      clearAllParticles();
      tiltTweenRef.current?.kill();
      magnetTweenRef.current?.kill();
    };
  }, [
    animateParticles,
    clearAllParticles,
    disableAnimations,
    enableTilt,
    enableMagnetism,
    clickEffect,
    glowColor,
  ]);

  return (
    <div
      ref={cardRef}
      className={`${className} particle-container`}
      style={{ ...style, position: "relative", overflow: "hidden" }}
    >
      {children}
    </div>
  );
};

// Optimized GlobalSpotlight with throttling and cached calculations
const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}> = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const spotlightTweenRef = useRef<gsap.core.Tween | null>(null);
  const opacityTweenRef = useRef<gsap.core.Tween | null>(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    // Create spotlight element
    const spotlight = document.createElement("div");
    spotlight.className = "global-spotlight";
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        transparent 60%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
      will-change: left, top, opacity;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    // Intersection observer to pause when off-screen
    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0].isIntersecting;
        if (!isVisibleRef.current && spotlightRef.current) {
          spotlightRef.current.style.opacity = "0";
        }
      },
      { threshold: 0.1 }
    );

    const section = gridRef.current.closest(".bento-section");
    if (section) {
      observer.observe(section);
    }

    const { proximity, fadeDistance } =
      calculateSpotlightValues(spotlightRadius);

    // Throttled mouse move handler
    const handleMouseMove = throttle((e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current || !isVisibleRef.current)
        return;

      const section = gridRef.current.closest(".bento-section");
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!mouseInside) {
        opacityTweenRef.current?.kill();
        opacityTweenRef.current = gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        });

        gridRef.current
          .querySelectorAll(".magic-bento-card")
          .forEach((card) => {
            (card as HTMLElement).style.setProperty("--glow-intensity", "0");
          });
        return;
      }

      // Update spotlight position
      spotlightTweenRef.current?.kill();
      spotlightTweenRef.current = gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });

      // Calculate card distances (optimized)
      const cards = gridRef.current.querySelectorAll(".magic-bento-card");
      let minDistance = Infinity;

      cards.forEach((card) => {
        const cardElement = card as HTMLElement;
        const cardRect = cardElement.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        const distance =
          Math.sqrt(dx * dx + dy * dy) -
          Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity =
            (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(
          cardElement,
          e.clientX,
          e.clientY,
          glowIntensity,
          spotlightRadius
        );
      });

      // Update spotlight opacity
      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
          ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
          : 0;

      opacityTweenRef.current?.kill();
      opacityTweenRef.current = gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.15 : 0.4,
        ease: "power2.out",
      });
    }, THROTTLE_MS);

    const handleMouseLeave = () => {
      gridRef.current?.querySelectorAll(".magic-bento-card").forEach((card) => {
        (card as HTMLElement).style.setProperty("--glow-intensity", "0");
      });

      if (spotlightRef.current) {
        opacityTweenRef.current?.kill();
        opacityTweenRef.current = gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    };

    document.addEventListener("mousemove", handleMouseMove as EventListener);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener(
        "mousemove",
        handleMouseMove as EventListener
      );
      document.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
      spotlightTweenRef.current?.kill();
      opacityTweenRef.current?.kill();
      spotlightRef.current?.remove();
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const BentoCardGrid: React.FC<{
  children: React.ReactNode;
  gridRef?: React.RefObject<HTMLDivElement | null>;
}> = ({ children, gridRef }) => (
  <div className="card-grid bento-section" ref={gridRef}>
    {children}
  </div>
);

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();

    // Debounced resize handler
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return isMobile;
};

// Optimized BentoCard without ParticleCard (for enableStars = false)
const SimpleBentoCard: React.FC<{
  card: BentoCardProps;
  cardProps: {
    className: string;
    style: React.CSSProperties;
  };
  shouldDisableAnimations: boolean;
  enableTilt: boolean;
  enableMagnetism: boolean;
  clickEffect: boolean;
  glowColor: string;
}> = ({
  card,
  cardProps,
  shouldDisableAnimations,
  enableTilt,
  enableMagnetism,
  clickEffect,
  glowColor,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltTweenRef = useRef<gsap.core.Tween | null>(null);
  const magnetTweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (shouldDisableAnimations || !cardRef.current) return;

    const el = cardRef.current;

    const handleMouseMove = throttle((e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        tiltTweenRef.current?.kill();
        tiltTweenRef.current = gsap.to(el, {
          rotateX,
          rotateY,
          duration: 0.15,
          ease: "power2.out",
          transformPerspective: 1000,
          overwrite: true,
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.03;
        const magnetY = (y - centerY) * 0.03;

        magnetTweenRef.current?.kill();
        magnetTweenRef.current = gsap.to(el, {
          x: magnetX,
          y: magnetY,
          duration: 0.2,
          ease: "power2.out",
          overwrite: true,
        });
      }
    }, THROTTLE_MS);

    const handleMouseLeave = () => {
      tiltTweenRef.current?.kill();
      magnetTweenRef.current?.kill();

      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxDistance = Math.max(rect.width, rect.height);

      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.3) 0%, transparent 60%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
        transform: scale(0);
        opacity: 1;
      `;

      el.appendChild(ripple);

      gsap.to(ripple, {
        scale: 1,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => ripple.remove(),
      });
    };

    el.addEventListener("mousemove", handleMouseMove as EventListener);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("click", handleClick);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove as EventListener);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("click", handleClick);
      tiltTweenRef.current?.kill();
      magnetTweenRef.current?.kill();
    };
  }, [
    shouldDisableAnimations,
    enableTilt,
    enableMagnetism,
    clickEffect,
    glowColor,
  ]);

  return (
    <div
      ref={cardRef}
      {...cardProps}
      style={{ ...cardProps.style, position: "relative", overflow: "hidden" }}
    >
      <div className="magic-bento-card__header">
        <div className="magic-bento-card__label">{card.label}</div>
      </div>
      <div className="magic-bento-card__content">
        <h2 className="magic-bento-card__title">{card.title}</h2>
        <p className="magic-bento-card__description">{card.description}</p>
      </div>
    </div>
  );
};

const MagicBento: React.FC<BentoProps> = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  return (
    <>
      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <BentoCardGrid gridRef={gridRef}>
        {cardData.map((card, index) => {
          const baseClassName = `magic-bento-card ${
            textAutoHide ? "magic-bento-card--text-autohide" : ""
          } ${enableBorderGlow ? "magic-bento-card--border-glow" : ""}`;

          const cardProps = {
            className: baseClassName,
            style: {
              backgroundColor: card.color,
              "--glow-color": glowColor,
              backgroundImage: card.image
                ? `linear-gradient(rgba(0, 20, 20, 0.85), rgba(0, 20, 20, 0.95)), url(${card.image})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            } as React.CSSProperties,
          };

          if (enableStars) {
            return (
              <ParticleCard
                key={index}
                {...cardProps}
                disableAnimations={shouldDisableAnimations}
                particleCount={particleCount}
                glowColor={glowColor}
                enableTilt={enableTilt}
                clickEffect={clickEffect}
                enableMagnetism={enableMagnetism}
              >
                <div className="magic-bento-card__header">
                  <div className="magic-bento-card__label">{card.label}</div>
                </div>
                <div className="magic-bento-card__content">
                  <h2 className="magic-bento-card__title">{card.title}</h2>
                  <p className="magic-bento-card__description">
                    {card.description}
                  </p>
                </div>
              </ParticleCard>
            );
          }

          return (
            <SimpleBentoCard
              key={index}
              card={card}
              cardProps={cardProps}
              shouldDisableAnimations={shouldDisableAnimations}
              enableTilt={enableTilt}
              enableMagnetism={enableMagnetism}
              clickEffect={clickEffect}
              glowColor={glowColor}
            />
          );
        })}
      </BentoCardGrid>
    </>
  );
};

export default MagicBento;
