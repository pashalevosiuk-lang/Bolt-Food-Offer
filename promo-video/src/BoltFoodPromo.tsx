import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
  AbsoluteFill,
  Sequence,
} from 'remotion';

// ─── Brand tokens ───────────────────────────────────────────────────────────
const C = {
  black:    '#080F0A',
  darkBg:   '#0B150E',
  card:     '#111D14',
  green:    '#3CC46B',
  neon:     '#77F8B0',
  darkGreen:'#0C2C1C',
  white:    '#FFFFFF',
  offWhite: '#E8F5ED',
  grey:     '#8A9E91',
  gold:     '#F5C842',
  red:      '#FF4D6A',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function clamp(frame: number, start: number, end: number) {
  return Math.max(0, Math.min(end - start, frame - start));
}

function spr(frame: number, start: number, cfg?: { damping?: number; stiffness?: number; mass?: number }) {
  const f = clamp(frame, start, start + 40);
  return spring({ fps: 30, frame: f, config: { damping: cfg?.damping ?? 14, stiffness: cfg?.stiffness ?? 200, mass: cfg?.mass ?? 0.8 } });
}

function lerp(frame: number, start: number, end: number, from: number = 0, to: number = 1, ease = Easing.out(Easing.cubic)) {
  return interpolate(frame, [start, end], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
}

function counterVal(frame: number, start: number, end: number, target: number) {
  const t = lerp(frame, start, end, 0, 1, Easing.out(Easing.quad));
  return Math.round(t * target);
}

// ─── Shared style components ──────────────────────────────────────────────
const FONT = `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`;

function useFont() {
  return {
    fontFamily: FONT,
    WebkitFontSmoothing: 'antialiased' as const,
  };
}

// ─── Scene Components ─────────────────────────────────────────────────────

// SCENE 1 — HOOK (frames 0–60, 2s)
function SceneHook({ frame }: { frame: number }) {
  const flashOpacity = lerp(frame, 0, 8, 0, 1, Easing.out(Easing.quad));
  const flashFade    = lerp(frame, 8, 30, 1, 0);
  const flash        = frame < 8 ? flashOpacity : (frame < 30 ? flashFade : 0);

  const logoScale = spr(frame, 5, { damping: 10, stiffness: 180 });
  const logoY     = interpolate(logoScale, [0, 1], [-200, 0]);
  const logoOp    = lerp(frame, 5, 25, 0, 1);

  const tagScale  = spr(frame, 20, { damping: 12 });
  const tagOp     = lerp(frame, 20, 38, 0, 1);

  const pulseScale = 1 + 0.03 * Math.sin(frame * 0.4);
  const scanLine   = (frame * 18) % 1920;

  return (
    <AbsoluteFill style={{ background: C.darkBg, overflow: 'hidden' }}>
      {/* scan line */}
      <div style={{
        position: 'absolute', left: 0, width: '100%', height: 3,
        top: scanLine, background: `linear-gradient(90deg, transparent, ${C.neon}80, transparent)`,
        opacity: 0.6,
      }} />

      {/* radial pulse */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${C.green}22 0%, transparent 70%)`,
        transform: `scale(${pulseScale})`,
      }} />

      {/* flash burst */}
      <div style={{ position: 'absolute', inset: 0, background: C.neon, opacity: flash * 0.8, mixBlendMode: 'screen' }} />

      {/* AUGUST word */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
        transform: `translateY(${logoY}px) scale(${0.4 + logoScale * 0.6})`,
        opacity: logoOp,
        ...useFont(),
      }}>
        <div style={{
          fontSize: 148, fontWeight: 900, letterSpacing: -6, color: C.white,
          textTransform: 'uppercase', lineHeight: 1,
          textShadow: `0 0 80px ${C.neon}99, 0 0 40px ${C.green}80`,
        }}>
          AUGUST
        </div>
        <div style={{
          fontSize: 32, fontWeight: 600, letterSpacing: 12, color: C.neon,
          marginTop: 12, opacity: tagOp, transform: `scale(${tagScale})`,
        }}>
          2026
        </div>
      </div>

      {/* bottom line */}
      <div style={{
        position: 'absolute', bottom: 160, left: 80, right: 80, height: 1,
        background: `linear-gradient(90deg, transparent, ${C.green}, transparent)`,
        opacity: lerp(frame, 30, 55, 0, 1),
      }} />
    </AbsoluteFill>
  );
}

// SCENE 2 — INTRO (frames 60–210, 5s)
function SceneIntro({ frame }: { frame: number }) {
  const f = frame;

  const logoScale = spr(f, 0, { damping: 13, stiffness: 220 });
  const logoOp    = lerp(f, 0, 20, 0, 1);

  const line1X = interpolate(spr(f, 15, { damping: 16 }), [0, 1], [-700, 0]);
  const line2X = interpolate(spr(f, 30, { damping: 16 }), [0, 1], [700, 0]);
  const line3O = lerp(f, 50, 70, 0, 1);

  const chip1 = spr(f, 70, { damping: 18 });
  const chip2 = spr(f, 82, { damping: 18 });
  const chip3 = spr(f, 94, { damping: 18 });
  const chip4 = spr(f, 106, { damping: 18 });

  const dividerW = lerp(f, 60, 100, 0, 920);

  const bgShift = lerp(f, 0, 150, 0, 1);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, ${C.darkGreen} 0%, ${C.darkBg} 60%, #020804 100%)`,
      overflow: 'hidden',
    }}>
      {/* grid lines */}
      {[0, 1, 2, 3, 4].map(i => (
        <div key={i} style={{
          position: 'absolute', left: 80 + i * 230, top: 0, width: 1, height: '100%',
          background: `${C.green}18`,
          transform: `scaleY(${lerp(f, i * 8, i * 8 + 40, 0, 1)})`,
          transformOrigin: 'top',
        }} />
      ))}

      {/* Bolt logo (text-rendered since no SVG file) */}
      <div style={{
        position: 'absolute', top: 180, left: 80,
        opacity: logoOp,
        transform: `scale(${0.6 + logoScale * 0.4})`,
        transformOrigin: 'left center',
        ...useFont(),
      }}>
        <span style={{
          fontSize: 56, fontWeight: 900, color: C.green,
          letterSpacing: -2,
        }}>Bolt </span>
        <span style={{
          fontSize: 56, fontWeight: 900, color: C.white,
          letterSpacing: -2,
        }}>Food</span>
      </div>

      {/* dot bullet */}
      <div style={{
        position: 'absolute', top: 265, left: 80, width: 12, height: 12,
        borderRadius: '50%', background: C.neon,
        opacity: logoOp,
      }} />

      {/* tag line */}
      <div style={{
        position: 'absolute', top: 277, left: 104,
        fontSize: 22, fontWeight: 500, color: C.neon,
        letterSpacing: 4, opacity: logoOp, ...useFont(),
      }}>
        UKRAINE SALES
      </div>

      {/* Divider */}
      <div style={{
        position: 'absolute', top: 340, left: 80,
        height: 2, width: dividerW,
        background: `linear-gradient(90deg, ${C.green}, ${C.neon}40)`,
      }} />

      {/* Line 1 */}
      <div style={{
        position: 'absolute', top: 390, left: 80,
        transform: `translateX(${line1X}px)`,
        ...useFont(),
      }}>
        <div style={{ fontSize: 92, fontWeight: 900, color: C.white, lineHeight: 1, letterSpacing: -4 }}>
          SALES
        </div>
        <div style={{ fontSize: 92, fontWeight: 900, color: C.white, lineHeight: 1, letterSpacing: -4 }}>
          MONTHLY
        </div>
      </div>

      {/* Line 2 */}
      <div style={{
        position: 'absolute', top: 580, left: 80,
        transform: `translateX(${line2X}px)`,
        ...useFont(),
      }}>
        <div style={{ fontSize: 92, fontWeight: 900, color: C.green, lineHeight: 1, letterSpacing: -4 }}>
          BUSINESS
        </div>
        <div style={{ fontSize: 92, fontWeight: 900, color: C.green, lineHeight: 1, letterSpacing: -4 }}>
          REVIEW
        </div>
      </div>

      {/* subtitle */}
      <div style={{
        position: 'absolute', top: 796, left: 80,
        fontSize: 28, fontWeight: 400, color: C.grey,
        letterSpacing: 2, opacity: line3O, ...useFont(),
      }}>
        07.09.2026
      </div>

      {/* Team chips */}
      <div style={{ position: 'absolute', bottom: 120, left: 40, right: 40 }}>
        <div style={{ fontSize: 18, color: C.grey, letterSpacing: 3, marginBottom: 20, paddingLeft: 40, ...useFont() }}>
          TEAM
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, paddingLeft: 40 }}>
          {[
            { name: 'Mykhailo Boiko', role: 'Country Sales Mgr', s: chip1 },
            { name: 'Pavlo Levosiuk', role: 'Sales Team Lead', s: chip2 },
            { name: 'Kateryna Suslova', role: 'Sr Sales Manager', s: chip3 },
            { name: 'Mark Voloshyn', role: 'Sr Sales Specialist', s: chip4 },
          ].map(({ name, role, s }, i) => (
            <div key={i} style={{
              background: `${C.card}ee`,
              border: `1px solid ${C.green}44`,
              borderRadius: 50,
              padding: '12px 24px',
              opacity: s,
              transform: `scale(${0.7 + s * 0.3}) translateY(${(1 - s) * 30}px)`,
              ...useFont(),
            }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: C.white }}>{name}</div>
              <div style={{ fontSize: 14, color: C.neon, marginTop: 2 }}>{role}</div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
}

// SCENE 3 — 295 DEALS (frames 210–360, 5s)
function SceneDeals({ frame }: { frame: number }) {
  const f = frame;

  const bgOp     = lerp(f, 0, 20, 0, 1);
  const labelOp  = lerp(f, 10, 35, 0, 1);
  const numScale = spr(f, 20, { damping: 8, stiffness: 250 });
  const count    = counterVal(f, 20, 100, 295);
  const subOp    = lerp(f, 60, 80, 0, 1);
  const barW     = lerp(f, 50, 130, 0, 920);

  const glowIntensity = 0.5 + 0.5 * Math.sin(f * 0.15);

  // Floating particles
  const particles = Array.from({ length: 12 }, (_, i) => ({
    x: 80 + (i % 4) * 240,
    y: 400 + Math.floor(i / 4) * 340,
    size: 4 + (i % 3) * 3,
    delay: i * 6,
    phase: i * 1.1,
  }));

  return (
    <AbsoluteFill style={{ background: C.darkBg, overflow: 'hidden' }}>
      {/* animated bg gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${C.darkGreen} 0%, ${C.darkBg} 60%)`,
        opacity: bgOp,
      }} />

      {/* floating particles */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: p.x + Math.sin(f * 0.04 + p.phase) * 20,
          top: p.y + Math.cos(f * 0.03 + p.phase) * 15,
          width: p.size, height: p.size,
          borderRadius: '50%',
          background: C.neon,
          opacity: lerp(f, p.delay, p.delay + 20, 0, 1) * (0.3 + 0.2 * Math.sin(f * 0.07 + p.phase)),
        }} />
      ))}

      {/* label */}
      <div style={{
        position: 'absolute', top: 300, left: 0, right: 0,
        textAlign: 'center', opacity: labelOp,
        ...useFont(),
      }}>
        <div style={{
          fontSize: 22, fontWeight: 600, letterSpacing: 8,
          color: C.neon, textTransform: 'uppercase',
        }}>
          WON THIS MONTH
        </div>
      </div>

      {/* giant number */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        ...useFont(),
      }}>
        <div style={{
          fontSize: 280, fontWeight: 900, color: C.white,
          lineHeight: 1, letterSpacing: -12,
          transform: `scale(${0.5 + numScale * 0.5})`,
          textShadow: `0 0 120px ${C.neon}${Math.round(glowIntensity * 255).toString(16).padStart(2, '0')}, 0 0 60px ${C.green}80`,
        }}>
          {count}
        </div>
      </div>

      {/* DEALS label under number */}
      <div style={{
        position: 'absolute', top: 1160, left: 0, right: 0,
        textAlign: 'center', ...useFont(),
        opacity: lerp(f, 35, 55, 0, 1),
      }}>
        <div style={{
          fontSize: 64, fontWeight: 900, letterSpacing: 8,
          color: C.green,
        }}>
          DEALS
        </div>
      </div>

      {/* progress bar */}
      <div style={{
        position: 'absolute', bottom: 280, left: 80, right: 80,
        height: 4, background: `${C.white}18`, borderRadius: 2,
        opacity: subOp,
      }}>
        <div style={{
          height: '100%', width: barW,
          background: `linear-gradient(90deg, ${C.green}, ${C.neon})`,
          borderRadius: 2,
          boxShadow: `0 0 20px ${C.neon}80`,
        }} />
      </div>

      {/* subtitle */}
      <div style={{
        position: 'absolute', bottom: 180, left: 0, right: 0,
        textAlign: 'center', opacity: subOp,
        ...useFont(),
      }}>
        <div style={{ fontSize: 36, fontWeight: 500, color: C.grey }}>
          across <span style={{ color: C.white, fontWeight: 700 }}>9 reps</span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// SCENE 4 — 33 CITIES (frames 360–480, 4s)
function SceneCities({ frame }: { frame: number }) {
  const f = frame;

  const titleY  = interpolate(spr(f, 0, { damping: 14 }), [0, 1], [-120, 0]);
  const titleOp = lerp(f, 0, 25, 0, 1);

  const bigNum   = spr(f, 20, { damping: 9, stiffness: 230 });
  const count301 = counterVal(f, 30, 100, 301);
  const count33  = counterVal(f, 20, 80, 33);

  const regionDelay = [40, 55, 70, 85];

  const regions = [
    { name: 'West',   count: 137, color: C.green },
    { name: 'Center', count: 107, color: '#5B8AF0' },
    { name: 'East',   count: 41,  color: C.red },
    { name: 'South',  count: 16,  color: C.gold },
  ];

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(180deg, #030C05 0%, ${C.darkBg} 100%)`,
      overflow: 'hidden',
    }}>
      {/* dot matrix background */}
      {Array.from({ length: 80 }, (_, i) => {
        const col = i % 10, row = Math.floor(i / 10);
        const delay = col * 5 + row * 8;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: 60 + col * 100,
            top: 900 + row * 100,
            width: 6, height: 6,
            borderRadius: '50%',
            background: C.green,
            opacity: lerp(f, delay, delay + 20, 0, 0.3 + (i % 3) * 0.1),
          }} />
        );
      })}

      {/* header */}
      <div style={{
        position: 'absolute', top: 180, left: 80,
        transform: `translateY(${titleY}px)`, opacity: titleOp,
        ...useFont(),
      }}>
        <div style={{ fontSize: 26, letterSpacing: 6, color: C.neon, fontWeight: 600 }}>
          CITY COVERAGE
        </div>
      </div>

      {/* Big 33 */}
      <div style={{
        position: 'absolute', top: 270, left: 80,
        ...useFont(),
        transform: `scale(${0.5 + bigNum * 0.5})`,
        transformOrigin: 'left center',
      }}>
        <span style={{
          fontSize: 200, fontWeight: 900, color: C.white,
          letterSpacing: -8, lineHeight: 1,
          textShadow: `0 0 80px ${C.green}60`,
        }}>
          {count33}
        </span>
        <div style={{
          fontSize: 48, fontWeight: 800, color: C.green,
          letterSpacing: 4, marginTop: -20, opacity: lerp(f, 50, 70, 0, 1),
        }}>
          CITIES
        </div>
      </div>

      {/* 301 partners */}
      <div style={{
        position: 'absolute', top: 600, left: 80,
        opacity: lerp(f, 60, 85, 0, 1),
        ...useFont(),
      }}>
        <div style={{ fontSize: 28, color: C.grey, letterSpacing: 4, marginBottom: 8 }}>NEW PARTNERS</div>
        <div style={{
          fontSize: 120, fontWeight: 900, color: C.neon,
          letterSpacing: -4, lineHeight: 1,
          textShadow: `0 0 60px ${C.neon}60`,
        }}>
          {count301}
        </div>
      </div>

      {/* Region cards */}
      <div style={{
        position: 'absolute', bottom: 80, left: 60, right: 60,
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        {regions.map((r, i) => {
          const s = spr(f, regionDelay[i], { damping: 16 });
          const barFill = lerp(f, regionDelay[i] + 10, regionDelay[i] + 50, 0, (r.count / 137) * 800);
          return (
            <div key={r.name} style={{
              display: 'flex', alignItems: 'center', gap: 20,
              opacity: s, transform: `translateX(${(1 - s) * -60}px)`,
            }}>
              <div style={{
                width: 80, textAlign: 'right',
                fontSize: 18, fontWeight: 700, color: r.color, ...useFont(),
              }}>{r.name}</div>
              <div style={{ flex: 1, height: 8, background: `${C.white}12`, borderRadius: 4 }}>
                <div style={{
                  height: '100%', width: barFill,
                  background: r.color,
                  borderRadius: 4,
                  boxShadow: `0 0 12px ${r.color}80`,
                }} />
              </div>
              <div style={{
                width: 60,
                fontSize: 22, fontWeight: 800, color: C.white, ...useFont(),
              }}>{r.count}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// SCENE 5 — TOP PERFORMER (frames 480–630, 5s)
function SceneTopPerformer({ frame }: { frame: number }) {
  const f = frame;

  const spotScale = lerp(f, 0, 40, 0.3, 1.2, Easing.out(Easing.cubic));
  const spotOp    = lerp(f, 0, 30, 0, 1);

  const badgeScale = spr(f, 15, { damping: 10, stiffness: 280 });
  const crownOp    = lerp(f, 15, 35, 0, 1);

  const labelOp  = lerp(f, 35, 55, 0, 1);
  const nameOp   = lerp(f, 55, 80, 0, 1);
  const nameY    = interpolate(spr(f, 55, { damping: 14 }), [0, 1], [60, 0]);

  const numScale = spr(f, 85, { damping: 8, stiffness: 300, mass: 0.6 });
  const numCount = counterVal(f, 85, 140, 83);
  const dealsOp  = lerp(f, 105, 125, 0, 1);

  const glowPulse = 0.6 + 0.4 * Math.sin(f * 0.2);

  // confetti burst
  const confetti = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const dist  = lerp(f, 90, 140, 0, 280 + (i % 3) * 80);
    return {
      x: 540 + Math.cos(angle) * dist,
      y: 760 + Math.sin(angle) * dist,
      s: lerp(f, 90, 140, 0, 1),
      color: [C.neon, C.green, C.gold, C.white][i % 4],
      size: 8 + (i % 3) * 4,
    };
  });

  return (
    <AbsoluteFill style={{ background: C.black, overflow: 'hidden' }}>
      {/* spotlight */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 55% 70% at 50% 40%, ${C.darkGreen}cc 0%, transparent 70%)`,
        transform: `scale(${spotScale})`,
        opacity: spotOp,
      }} />

      {/* horizontal scan lines */}
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} style={{
          position: 'absolute', left: 0, right: 0,
          top: 200 + i * 290, height: 1,
          background: `${C.green}22`,
          opacity: lerp(f, i * 8, i * 8 + 25, 0, 1),
        }} />
      ))}

      {/* crown emoji */}
      <div style={{
        position: 'absolute', top: 300, left: 0, right: 0,
        textAlign: 'center',
        fontSize: 120,
        transform: `scale(${0.3 + badgeScale * 0.7}) rotate(${(1 - badgeScale) * -30}deg)`,
        opacity: crownOp,
        filter: `drop-shadow(0 0 40px ${C.gold})`,
      }}>
        🏆
      </div>

      {/* TOP PERFORMER label */}
      <div style={{
        position: 'absolute', top: 530, left: 0, right: 0,
        textAlign: 'center', opacity: labelOp,
        ...useFont(),
      }}>
        <div style={{
          fontSize: 26, fontWeight: 700, letterSpacing: 10,
          color: C.neon, textTransform: 'uppercase',
        }}>
          TOP PERFORMER
        </div>
      </div>

      {/* name */}
      <div style={{
        position: 'absolute', top: 590, left: 40, right: 40,
        textAlign: 'center',
        opacity: nameOp,
        transform: `translateY(${nameY}px)`,
        ...useFont(),
      }}>
        <div style={{
          fontSize: 74, fontWeight: 900, color: C.white,
          lineHeight: 1.05, letterSpacing: -2,
        }}>
          YEVHEN
        </div>
        <div style={{
          fontSize: 74, fontWeight: 900, color: C.green,
          lineHeight: 1.05, letterSpacing: -2,
        }}>
          SHOVKOPLYAS
        </div>
      </div>

      {/* big 83 */}
      <div style={{
        position: 'absolute', top: 900, left: 0, right: 0,
        textAlign: 'center',
        ...useFont(),
      }}>
        <div style={{
          fontSize: 240, fontWeight: 900, color: C.white,
          letterSpacing: -8, lineHeight: 1,
          transform: `scale(${0.4 + numScale * 0.6})`,
          textShadow: `0 0 100px ${C.neon}${Math.round(glowPulse * 180).toString(16).padStart(2, '0')}, 0 0 50px ${C.green}80`,
        }}>
          {numCount}
        </div>
        <div style={{
          fontSize: 52, fontWeight: 800, letterSpacing: 8,
          color: C.green, marginTop: -20,
          opacity: dealsOp,
        }}>
          DEALS
        </div>
      </div>

      {/* confetti */}
      {confetti.map((c, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: c.x, top: c.y,
          width: c.size, height: c.size,
          borderRadius: i % 2 === 0 ? '50%' : '2px',
          background: c.color,
          opacity: c.s * (0.6 + 0.4 * Math.sin(f * 0.15 + i)),
          transform: `rotate(${f * 3 * (i % 2 === 0 ? 1 : -1)}deg)`,
        }} />
      ))}

      {/* bottom tag */}
      <div style={{
        position: 'absolute', bottom: 160, left: 0, right: 0,
        textAlign: 'center', opacity: dealsOp,
        ...useFont(),
      }}>
        <div style={{
          display: 'inline-block',
          background: `${C.green}22`, border: `1px solid ${C.green}60`,
          borderRadius: 50, padding: '10px 36px',
          fontSize: 20, fontWeight: 600, color: C.neon, letterSpacing: 4,
        }}>
          🔥 OUTBOUND KING
        </div>
      </div>
    </AbsoluteFill>
  );
}

// SCENE 6 — BIG WINS (frames 630–750, 4s)
function SceneBigWins({ frame }: { frame: number }) {
  const f = frame;

  const headerY = interpolate(spr(f, 0, { damping: 14 }), [0, 1], [-80, 0]);
  const headerO = lerp(f, 0, 25, 0, 1);

  const card1s = spr(f, 30, { damping: 15 });
  const card2s = spr(f, 55, { damping: 15 });

  const wins = [
    {
      emoji: '🥙', name: 'I Love Kebab',
      tag: 'ENT DEAL',
      stats: ['50 locations', '14 cities', '13K txns/mo'],
      color: C.green, s: card1s,
    },
    {
      emoji: '🌯', name: 'Kebabtsia',
      tag: 'ENT DEAL',
      stats: ['+14 locations', 'Exclusivity broken', 'Lviv #1'],
      color: '#5B8AF0', s: card2s,
    },
  ];

  const subOp = lerp(f, 80, 105, 0, 1);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, ${C.green} 0%, ${C.darkGreen} 40%, ${C.darkBg} 100%)`,
      overflow: 'hidden',
    }}>
      {/* animated diagonal stripe */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 40px,
          ${C.neon}06 40px,
          ${C.neon}06 80px
        )`,
      }} />

      {/* header */}
      <div style={{
        position: 'absolute', top: 200, left: 60, right: 60,
        transform: `translateY(${headerY}px)`, opacity: headerO,
        ...useFont(),
      }}>
        <div style={{ fontSize: 22, letterSpacing: 6, color: C.neon, fontWeight: 600, marginBottom: 12 }}>
          AUGUST
        </div>
        <div style={{
          fontSize: 72, fontWeight: 900, color: C.white,
          lineHeight: 1.05, letterSpacing: -2,
        }}>
          A MONTH OF
          <br />
          <span style={{ color: C.neon }}>BIG WINS</span>
        </div>
      </div>

      {/* Win cards */}
      <div style={{
        position: 'absolute', top: 550, left: 60, right: 60,
        display: 'flex', flexDirection: 'column', gap: 28,
      }}>
        {wins.map((w) => (
          <div key={w.name} style={{
            background: `rgba(0,0,0,0.45)`,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${w.color}60`,
            borderRadius: 28,
            padding: '32px 36px',
            opacity: w.s,
            transform: `scale(${0.88 + w.s * 0.12}) translateY(${(1 - w.s) * 40}px)`,
            ...useFont(),
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
              <div style={{ fontSize: 56 }}>{w.emoji}</div>
              <div>
                <div style={{ fontSize: 32, fontWeight: 800, color: C.white, letterSpacing: -1 }}>
                  {w.name}
                </div>
                <div style={{
                  display: 'inline-block', marginTop: 6,
                  background: `${w.color}30`, border: `1px solid ${w.color}`,
                  borderRadius: 20, padding: '3px 14px',
                  fontSize: 13, fontWeight: 700, color: w.color, letterSpacing: 3,
                }}>
                  {w.tag}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {w.stats.map((s) => (
                <div key={s} style={{
                  background: `${w.color}18`,
                  borderRadius: 12, padding: '8px 18px',
                  fontSize: 18, fontWeight: 600, color: C.white,
                }}>
                  {s}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Horeca event note */}
      <div style={{
        position: 'absolute', bottom: 130, left: 60, right: 60,
        opacity: subOp, ...useFont(),
        background: `rgba(0,0,0,0.4)`,
        borderRadius: 20, padding: '20px 30px',
        border: `1px solid ${C.neon}30`,
      }}>
        <div style={{ fontSize: 18, color: C.neon, letterSpacing: 3, marginBottom: 8 }}>EVENTS</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: C.white }}>
          🎪 Horeca Masters — Cherkasy
        </div>
        <div style={{ fontSize: 18, color: C.grey, marginTop: 6 }}>
          August 5 · grew our presence in the city
        </div>
      </div>
    </AbsoluteFill>
  );
}

// SCENE 7 — WINNER MENTALITY (frames 750–840, 3s)
function SceneWinner({ frame }: { frame: number }) {
  const f = frame;

  const bgScale   = lerp(f, 0, 30, 1.1, 1);
  const word1op   = lerp(f, 5, 25, 0, 1);
  const word2op   = lerp(f, 20, 40, 0, 1);
  const sub1op    = lerp(f, 40, 60, 0, 1);
  const sub2op    = lerp(f, 55, 75, 0, 1);
  const ctaop     = lerp(f, 70, 90, 0, 1);

  const word1y = interpolate(spr(f, 5, { damping: 13 }), [0, 1], [80, 0]);
  const word2y = interpolate(spr(f, 20, { damping: 13 }), [0, 1], [80, 0]);

  const glowPulse = 1 + 0.06 * Math.sin(f * 0.25);

  return (
    <AbsoluteFill style={{
      background: C.green,
      overflow: 'hidden',
    }}>
      {/* scale + bg texture */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 80% 80% at 50% 50%, ${C.neon}40 0%, transparent 60%)`,
        transform: `scale(${bgScale * glowPulse})`,
      }} />

      {/* diagonal texture lines */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `repeating-linear-gradient(-45deg, transparent, transparent 60px, rgba(0,0,0,0.04) 60px, rgba(0,0,0,0.04) 61px)`,
      }} />

      {/* WINNER */}
      <div style={{
        position: 'absolute', top: 400, left: 0, right: 0,
        textAlign: 'center',
        opacity: word1op, transform: `translateY(${word1y}px)`,
        ...useFont(),
      }}>
        <div style={{
          fontSize: 148, fontWeight: 900, color: C.white,
          letterSpacing: -6, lineHeight: 1,
          textShadow: `0 4px 0 rgba(0,0,0,0.25)`,
        }}>
          WINNER
        </div>
      </div>

      {/* MENTALITY */}
      <div style={{
        position: 'absolute', top: 540, left: 0, right: 0,
        textAlign: 'center',
        opacity: word2op, transform: `translateY(${word2y}px)`,
        ...useFont(),
      }}>
        <div style={{
          fontSize: 148, fontWeight: 900,
          color: 'transparent',
          WebkitTextStroke: `3px ${C.white}`,
          letterSpacing: -6, lineHeight: 1,
        }}>
          MENTALITY
        </div>
      </div>

      {/* divider */}
      <div style={{
        position: 'absolute', top: 750, left: '15%', right: '15%', height: 2,
        background: `rgba(255,255,255,0.4)`,
        opacity: sub1op,
      }} />

      {/* quote lines */}
      <div style={{
        position: 'absolute', top: 790, left: 80, right: 80,
        textAlign: 'center', opacity: sub1op,
        ...useFont(),
      }}>
        <div style={{ fontSize: 30, fontWeight: 400, color: 'rgba(255,255,255,0.9)', lineHeight: 1.5 }}>
          Keep mindset to stay strong
          <br />and ready for any challenge.
        </div>
      </div>

      <div style={{
        position: 'absolute', top: 950, left: 80, right: 80,
        textAlign: 'center', opacity: sub2op,
        ...useFont(),
      }}>
        <div style={{
          fontSize: 36, fontWeight: 800, color: C.white,
          textShadow: `0 0 30px rgba(0,0,0,0.3)`,
        }}>
          Keep going, team! 💪
        </div>
      </div>

      {/* Bolt Food tag */}
      <div style={{
        position: 'absolute', bottom: 140, left: 0, right: 0,
        textAlign: 'center', opacity: ctaop,
        ...useFont(),
      }}>
        <span style={{ fontSize: 42, fontWeight: 900, color: C.white }}>Bolt </span>
        <span style={{ fontSize: 42, fontWeight: 900, color: C.darkGreen }}>Food</span>
      </div>
    </AbsoluteFill>
  );
}

// SCENE 8 — REVENUE CHAMPION (frames 840–900, 2s)
function SceneRevenue({ frame }: { frame: number }) {
  const f = frame;

  const bgOp     = lerp(f, 0, 20, 0, 1);
  const crownS   = spr(f, 5, { damping: 9, stiffness: 260, mass: 0.7 });
  const titleOp  = lerp(f, 20, 40, 0, 1);
  const nameOp   = lerp(f, 35, 55, 0, 1);
  const numScale = spr(f, 50, { damping: 8, stiffness: 280 });
  const numCount = counterVal(f, 50, 82, 86532);
  const pctOp    = lerp(f, 80, 88, 0, 1);

  const glowPulse = 0.5 + 0.5 * Math.sin(f * 0.3);

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, #1A1000 0%, #0D0D0A 50%, ${C.darkBg} 100%)`,
      overflow: 'hidden',
    }}>
      {/* gold shimmer */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 70% 50% at 50% 35%, ${C.gold}18 0%, transparent 65%)`,
        opacity: bgOp,
      }} />

      {/* trophy */}
      <div style={{
        position: 'absolute', top: 200, left: 0, right: 0,
        textAlign: 'center', fontSize: 100,
        transform: `scale(${0.3 + crownS * 0.7})`,
        filter: `drop-shadow(0 0 50px ${C.gold}90)`,
      }}>
        👑
      </div>

      {/* title */}
      <div style={{
        position: 'absolute', top: 400, left: 0, right: 0,
        textAlign: 'center', opacity: titleOp,
        ...useFont(),
      }}>
        <div style={{ fontSize: 22, letterSpacing: 6, color: C.gold, fontWeight: 600 }}>
          REVENUE CHAMPION 2026
        </div>
      </div>

      {/* restaurant name */}
      <div style={{
        position: 'absolute', top: 460, left: 60, right: 60,
        textAlign: 'center', opacity: nameOp,
        ...useFont(),
      }}>
        <div style={{
          fontSize: 62, fontWeight: 900, color: C.white,
          lineHeight: 1.1, letterSpacing: -2,
        }}>
          Узбецький Плов
        </div>
        <div style={{ fontSize: 22, color: C.grey, marginTop: 10, letterSpacing: 2 }}>
          Still the absolute champion
        </div>
      </div>

      {/* big revenue number */}
      <div style={{
        position: 'absolute', top: 730, left: 0, right: 0,
        textAlign: 'center',
        transform: `scale(${0.5 + numScale * 0.5})`,
        ...useFont(),
      }}>
        <div style={{
          fontSize: 36, fontWeight: 600, color: C.gold, letterSpacing: 4,
          marginBottom: 8, opacity: lerp(f, 40, 55, 0, 1),
        }}>
          COMMISSION REVENUE
        </div>
        <div style={{
          fontSize: 110, fontWeight: 900, color: C.gold,
          letterSpacing: -4, lineHeight: 1,
          textShadow: `0 0 80px ${C.gold}${Math.round(glowPulse * 200).toString(16).padStart(2, '0')}`,
        }}>
          €{numCount.toLocaleString()}
        </div>
      </div>

      {/* +3% badge */}
      <div style={{
        position: 'absolute', bottom: 200, left: 0, right: 0,
        textAlign: 'center', opacity: pctOp,
        ...useFont(),
      }}>
        <div style={{
          display: 'inline-block',
          background: `${C.green}22`,
          border: `2px solid ${C.green}`,
          borderRadius: 50, padding: '14px 40px',
          fontSize: 30, fontWeight: 800, color: C.neon,
        }}>
          +3% vs last month 📈
        </div>
      </div>
    </AbsoluteFill>
  );
}

// SCENE 9 — CTA OUTRO (frames 900–990 = within last 90 frames of 1050 total)
function SceneCTA({ frame }: { frame: number }) {
  const f = frame;

  const bgOp   = lerp(f, 0, 30, 0, 1);
  const lineW  = lerp(f, 10, 50, 0, 920);

  const w1op = lerp(f, 15, 35, 0, 1);
  const w1y  = interpolate(spr(f, 15, { damping: 13 }), [0, 1], [60, 0]);

  const w2op = lerp(f, 30, 50, 0, 1);
  const w2y  = interpolate(spr(f, 30, { damping: 13 }), [0, 1], [60, 0]);

  const logoOp   = lerp(f, 30, 55, 0, 1);
  const logoScale = spr(f, 30, { damping: 12 });

  const glowPulse = 1 + 0.08 * Math.sin(f * 0.2);
  const scanY = (f * 12) % 1920;

  return (
    <AbsoluteFill style={{ background: C.darkBg, overflow: 'hidden' }}>
      {/* bg glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${C.darkGreen}cc 0%, transparent 70%)`,
        opacity: bgOp * glowPulse,
      }} />

      {/* scan line */}
      <div style={{
        position: 'absolute', left: 0, width: '100%', height: 2,
        top: scanY,
        background: `linear-gradient(90deg, transparent, ${C.neon}60, transparent)`,
      }} />

      {/* corner accents */}
      {[[40, 40], [1040, 40], [40, 1880], [1040, 1880]].map(([x, y], i) => (
        <div key={i} style={{
          position: 'absolute', left: x - 1, top: y - 1,
          width: 40, height: 40,
          borderTop: i < 2 ? `2px solid ${C.green}` : undefined,
          borderBottom: i >= 2 ? `2px solid ${C.green}` : undefined,
          borderLeft: i % 2 === 0 ? `2px solid ${C.green}` : undefined,
          borderRight: i % 2 === 1 ? `2px solid ${C.green}` : undefined,
          opacity: bgOp,
        }} />
      ))}

      {/* top line */}
      <div style={{
        position: 'absolute', top: 380, left: 80,
        height: 2, width: lineW,
        background: `linear-gradient(90deg, ${C.green}, ${C.neon}40)`,
      }} />

      {/* KEEP THE BAR HIGH */}
      <div style={{
        position: 'absolute', top: 420, left: 80, right: 80,
        opacity: w1op, transform: `translateY(${w1y}px)`,
        ...useFont(),
      }}>
        <div style={{
          fontSize: 100, fontWeight: 900, color: C.white,
          lineHeight: 1, letterSpacing: -4,
        }}>
          KEEP THE
        </div>
        <div style={{
          fontSize: 100, fontWeight: 900,
          color: C.green,
          lineHeight: 1, letterSpacing: -4,
          textShadow: `0 0 60px ${C.neon}60`,
        }}>
          BAR HIGH
        </div>
      </div>

      {/* bottom line */}
      <div style={{
        position: 'absolute', top: 750, left: 80,
        height: 2, width: lineW,
        background: `linear-gradient(90deg, ${C.green}, ${C.neon}40)`,
        opacity: w1op,
      }} />

      {/* EXECUTE THE PLAN */}
      <div style={{
        position: 'absolute', top: 790, left: 80, right: 80,
        opacity: w2op, transform: `translateY(${w2y}px)`,
        ...useFont(),
      }}>
        <div style={{
          fontSize: 78, fontWeight: 900,
          color: 'transparent',
          WebkitTextStroke: `2px ${C.neon}`,
          lineHeight: 1, letterSpacing: -3,
        }}>
          EXECUTE
        </div>
        <div style={{
          fontSize: 78, fontWeight: 900,
          color: 'transparent',
          WebkitTextStroke: `2px ${C.neon}`,
          lineHeight: 1, letterSpacing: -3,
        }}>
          THE PLAN
        </div>
      </div>

      {/* Bolt Food logo */}
      <div style={{
        position: 'absolute', bottom: 200, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: logoOp,
        transform: `scale(${0.7 + logoScale * 0.3})`,
        ...useFont(),
      }}>
        <span style={{ fontSize: 64, fontWeight: 900, color: C.green }}>Bolt </span>
        <span style={{ fontSize: 64, fontWeight: 900, color: C.white }}>Food</span>
      </div>

      {/* UKRAINE SALES TEAM */}
      <div style={{
        position: 'absolute', bottom: 130, left: 0, right: 0,
        textAlign: 'center', opacity: logoOp,
        fontSize: 20, letterSpacing: 6, color: C.grey,
        ...useFont(),
      }}>
        UKRAINE SALES TEAM · AUGUST 2026
      </div>

      {/* glow dot at Bolt "o" */}
      <div style={{
        position: 'absolute', bottom: 218, left: 0, right: 0,
        display: 'flex', justifyContent: 'center',
        opacity: logoOp * glowPulse,
      }}>
        <div style={{
          width: 12, height: 12, borderRadius: '50%',
          background: C.neon,
          boxShadow: `0 0 30px ${C.neon}, 0 0 60px ${C.green}`,
          marginLeft: 88, marginTop: 6,
        }} />
      </div>
    </AbsoluteFill>
  );
}

// ─── Main composition ────────────────────────────────────────────────────────
export const BoltFoodPromo: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene start frames
  const S = {
    hook:     0,
    intro:    60,
    deals:    210,
    cities:   360,
    topPerf:  480,
    bigWins:  630,
    winner:   750,
    revenue:  840,
    cta:      930,
  };

  function localFrame(sceneStart: number) {
    return Math.max(0, frame - sceneStart);
  }

  function visible(start: number, end: number) {
    return frame >= start && frame < end;
  }

  return (
    <AbsoluteFill style={{ background: C.darkBg }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {visible(S.hook,    S.intro)   && <SceneHook         frame={localFrame(S.hook)}     />}
      {visible(S.intro,   S.deals)   && <SceneIntro        frame={localFrame(S.intro)}    />}
      {visible(S.deals,   S.cities)  && <SceneDeals        frame={localFrame(S.deals)}    />}
      {visible(S.cities,  S.topPerf) && <SceneCities       frame={localFrame(S.cities)}   />}
      {visible(S.topPerf, S.bigWins) && <SceneTopPerformer frame={localFrame(S.topPerf)}  />}
      {visible(S.bigWins, S.winner)  && <SceneBigWins      frame={localFrame(S.bigWins)}  />}
      {visible(S.winner,  S.revenue) && <SceneWinner       frame={localFrame(S.winner)}   />}
      {visible(S.revenue, S.cta)     && <SceneRevenue      frame={localFrame(S.revenue)}  />}
      {frame >= S.cta                && <SceneCTA          frame={localFrame(S.cta)}      />}


      {/* global overlay: scene transition flash */}
      {[S.intro, S.deals, S.cities, S.topPerf, S.bigWins, S.winner, S.revenue, S.cta].map(ts => {
        const tf = frame - ts;
        if (tf < 0 || tf > 6) return null;
        const op = interpolate(tf, [0, 3, 6], [0.7, 0.3, 0]);
        return <div key={ts} style={{ position: 'absolute', inset: 0, background: C.neon, opacity: op }} />;
      })}
    </AbsoluteFill>
  );
};
