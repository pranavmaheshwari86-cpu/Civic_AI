"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from "react";
import { m as motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// ─── Context ────────────────────────────────────────────────────────────────
interface CardContextValue {
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  isHovered: boolean;
}

const CardContext = createContext<CardContextValue | null>(null);

const useCard = () => {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error("useCard must be used within <CardContainer>");
  return ctx;
};

// ─── CardContainer ──────────────────────────────────────────────────────────
interface CardContainerProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  style?: CSSProperties;
}

export function CardContainer({
  children,
  className,
  containerClassName,
  style,
}: CardContainerProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }, [mouseX, mouseY]);

  return (
    <CardContext.Provider value={{ mouseX, mouseY, isHovered }}>
      <div
        ref={ref}
        className={containerClassName}
        style={{ perspective: "1200px", ...style }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div className={className} style={{ transformStyle: "preserve-3d" }}>
          {children}
        </motion.div>
      </div>
    </CardContext.Provider>
  );
}

// ─── CardBody ───────────────────────────────────────────────────────────────
interface CardBodyProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function CardBody({ children, className, style }: CardBodyProps) {
  const { mouseX, mouseY } = useCard();

  const springConfig = { stiffness: 280, damping: 28, mass: 0.6 };
  const rotX = useSpring(useTransform(mouseY, [-200, 200], [10, -10]), springConfig);
  const rotY = useSpring(useTransform(mouseX, [-200, 200], [-10, 10]), springConfig);

  return (
    <motion.div
      className={className}
      style={{
        rotateX: rotX,
        rotateY: rotY,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── CardItem ────────────────────────────────────────────────────────────────
interface CardItemProps {
  children: ReactNode;
  as?: React.ElementType;
  className?: string;
  translateZ?: number;
  style?: CSSProperties;
}

export function CardItem({
  children,
  className,
  translateZ = 0,
  style,
}: CardItemProps) {
  return (
    <motion.div
      className={className}
      style={{
        transform: `translateZ(${translateZ}px)`,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── CardGlare ───────────────────────────────────────────────────────────────
/** Optional glare overlay — import and place as the last child of CardBody */
export function CardGlare() {
  const { mouseX, mouseY, isHovered } = useCard();

  const glareX = useTransform(mouseX, [-200, 200], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [-200, 200], ["0%", "100%"]);
  const opacity = useSpring(isHovered ? 1 : 0, { stiffness: 300, damping: 30 });

  return (
    <motion.div
      className="absolute inset-0 rounded-[inherit] pointer-events-none z-10 overflow-hidden"
      style={{ opacity }}
    >
      <motion.div
        className="absolute w-[80%] h-[80%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
          left: glareX,
          top: glareY,
          transform: "translate(-50%, -50%)",
        }}
      />
    </motion.div>
  );
}
