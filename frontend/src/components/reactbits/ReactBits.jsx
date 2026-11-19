import React, { useState, useEffect, useRef } from 'react';

/**
 * ReactBits-inspired <BlurText />
 * Animates words or characters from blurred + offset to sharp with staggered delay.
 */
export function BlurText({
  text = '',
  animateBy = 'words', // 'words' | 'letters'
  delay = 70,
  className = '',
  as: Tag = 'h1'
}) {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const elements = animateBy === 'words' ? text.split(' ') : text.split('');

  return (
    <Tag ref={ref} className={`rb-blur-text ${className}`}>
      {elements.map((token, idx) => (
        <span
          key={idx}
          className={`rb-blur-token ${inView ? 'is-visible' : ''}`}
          style={{ transitionDelay: `${idx * delay}ms` }}
        >
          {token}
          {animateBy === 'words' && idx < elements.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </Tag>
  );
}

/**
 * ReactBits-inspired <ShinyText />
 * Sweeping metallic light reflection over text.
 */
export function ShinyText({ text, disabled = false, speed = 3.5, className = '' }) {
  return (
    <span
      className={`rb-shiny-text ${disabled ? '' : 'is-animating'} ${className}`}
      style={{ '--shiny-speed': `${speed}s` }}
    >
      {text}
    </span>
  );
}

/**
 * ReactBits-inspired <GradientText />
 * Animated multi-stop violet/white/fuchsia gradient text.
 */
export function GradientText({
  children,
  className = '',
  colors = ['#ffffff', '#c084fc', '#8b5cf6', '#e879f9', '#ffffff'],
  animationSpeed = 6,
  showBorder = false
}) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
    animationDuration: `${animationSpeed}s`
  };

  return (
    <span className={`rb-gradient-text-wrap ${showBorder ? 'with-border' : ''} ${className}`}>
      {showBorder && <span className="rb-gradient-border" style={gradientStyle} />}
      <span className="rb-gradient-text" style={gradientStyle}>
        {children}
      </span>
    </span>
  );
}

/**
 * ReactBits-inspired <DecryptedText />
 * Scrambles characters with tech glyphs before locking in the real characters.
 */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>[]{}';

export function DecryptedText({
  text = '',
  speed = 32,
  className = '',
  animateOnHover = true
}) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef(null);

  const triggerScramble = () => {
    clearInterval(intervalRef.current);
    let iteration = 0;
    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return text[index];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );
      iteration += 1 / 2;
      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
      }
    }, speed);
  };

  useEffect(() => {
    triggerScramble();
    return () => clearInterval(intervalRef.current);
  }, [text]);

  return (
    <span
      className={`rb-decrypted-text ${className}`}
      onMouseEnter={animateOnHover ? triggerScramble : undefined}
    >
      {displayText}
    </span>
  );
}

/**
 * ReactBits-inspired <CountUp />
 * Smoothly counts from 0 to target number when visible.
 */
export function CountUp({ to = 0, duration = 1100, prefix = '', suffix = '', className = '' }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const target = Number(to) || 0;
    let startTime = null;
    let frameId;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [to, duration]);

  return (
    <span className={className}>
      {prefix}
      {value.toLocaleString('es-AR')}
      {suffix}
    </span>
  );
}

/**
 * ReactBits-inspired <SpotlightCard /> + <TiltedCard />
 * Tracks mouse position for radial violet spotlight glow + subtle 3D perspective tilt.
 */
export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(139, 92, 246, 0.24)',
  tilt = false,
  onClick
}) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--mouse-x', `${x}px`);
    el.style.setProperty('--mouse-y', `${y}px`);
    el.style.setProperty('--spotlight-color', spotlightColor);

    if (tilt) {
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
      const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 5;
      setTransform(`perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`);
    }
  };

  const handleMouseLeave = () => {
    if (tilt) setTransform('');
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tilt && transform ? { transform } : undefined}
      className={`rb-spotlight-card ${className}`}
    >
      <div className="rb-spotlight-overlay" />
      <div className="rb-spotlight-content">{children}</div>
    </div>
  );
}

/**
 * ReactBits-inspired <AuroraBackground />
 * Animated violet/indigo/black aurora plasma waves + tech grid overlay.
 */
export function AuroraBackground({ children, className = '' }) {
  return (
    <div className={`rb-aurora-container ${className}`}>
      <div className="rb-aurora-blobs" aria-hidden="true">
        <div className="rb-blob rb-blob-1" />
        <div className="rb-blob rb-blob-2" />
        <div className="rb-blob rb-blob-3" />
        <div className="rb-cyber-grid" />
      </div>
      <div className="rb-aurora-inner">{children}</div>
    </div>
  );
}

/**
 * ReactBits-inspired <Magnet />
 * Gently attracts children toward the cursor on hover.
 */
export function Magnet({ children, strength = 0.22, className = '' }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setOffset({
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength
    });
  };

  const handleLeave = () => setOffset({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`rb-magnet ${className}`}
      style={{
        transform: `translate3d(${offset.x.toFixed(1)}px, ${offset.y.toFixed(1)}px, 0)`
      }}
    >
      {children}
    </div>
  );
}

