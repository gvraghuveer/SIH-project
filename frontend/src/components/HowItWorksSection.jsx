import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, FileText, GitBranch, Landmark, MousePointer2, Rows3, Search, ShieldCheck } from "lucide-react";
import { readPref, writePref } from "../lib/storage.js";

export const STEPS = [
  {
    icon: Search,
    tag: "Ingestion",
    title: "A reported address enters the system",
    body:
      "A complaint arrives from the NCRP or Sahyog stream carrying the suspect wallet, the chain it sits on, and the acknowledgement reference. Chakravyuh resolves the chain automatically and opens a case against the FIR number.",
    out: "Case opened · FIR linked",
  },
  {
    icon: GitBranch,
    tag: "Traversal",
    title: "The funds are followed hop by hop",
    body:
      "Direct on-chain RPC calls walk every outbound transfer from the reported wallet. Peel chains, mixer pass-throughs, bridge crossings and mule fan-outs are each classified as the traversal goes, so the path stays readable rather than collapsing into a cloud of addresses.",
    out: "Hop graph · classified",
  },
  {
    icon: Landmark,
    tag: "Attribution",
    title: "The receiving exchange is identified",
    body:
      "When the trail reaches a deposit address belonging to a virtual asset service provider, that endpoint is matched against known VASP clusters. The result is the exchange holding the funds and the specific deposit endpoint the money landed in.",
    out: "VASP · deposit endpoint",
  },
  {
    icon: FileText,
    tag: "Statutory output",
    title: "Court-ready paperwork comes out the other end",
    body:
      "Every hop is hashed and written to the evidence ledger for Section 65B certification under the Indian Evidence Act. From there the case generates a Section 91 CrPC preservation notice or a BNSS Section 94 freeze directive addressed to the identified VASP.",
    out: "Sec 91 / BNSS 94 notice",
  },
];

const LAST = STEPS.length - 1;
const panel = "glass-panel admin-panel rounded-2xl";

export default function HowItWorksSection({ withIntro = true }) {
  const isCompact = () =>
    typeof window !== "undefined" &&
    (window.matchMedia("(max-width: 860px)").matches || window.matchMedia("(pointer: coarse)").matches);

  const [compact, setCompact] = useState(isCompact);
  const [storedMode, setMode] = useState(() =>
    readPref("chakravyuh_hiw_mode") === "carousel" ? "carousel" : "scroll",
  );
  const mode = compact ? "carousel" : storedMode;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 860px), (pointer: coarse)");
    const sync = () => setCompact(isCompact());
    mq.addEventListener?.("change", sync);
    window.addEventListener("resize", sync, { passive: true });
    return () => {
      mq.removeEventListener?.("change", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  const [slide, setSlide] = useState(0);

  const pickMode = (next) => {
    setMode(next);
    setSlide(0);
    try {
      writePref("chakravyuh_hiw_mode", next);
    } catch {
      /* private mode */
    }
  };

  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const target = useRef(0);
  const current = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (mode !== "scroll") return undefined;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return undefined;

    let raf = 0;
    let visible = true;
    let lastIndex = -1;
    let prev = performance.now();

    const readTarget = () => {
      const rect = track.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) {
        target.current = 0;
        return;
      }
      target.current = Math.min(1, Math.max(0, -rect.top / travel)) * LAST;
    };

    const tick = (now) => {
      const dt = Math.min(64, now - prev) || 16.7;
      prev = now;
      const diff = target.current - current.current;
      current.current += diff * (1 - Math.exp(-dt / 62));
      if (Math.abs(diff) < 0.0008) current.current = target.current;

      stage.style.setProperty("--pos", current.current.toFixed(4));
      const index = Math.round(current.current);
      if (index !== lastIndex) {
        lastIndex = index;
        setActive(index);
      }
      raf = visible ? window.requestAnimationFrame(tick) : 0;
    };

    const onScroll = () => {
      readTarget();
      if (visible && !raf) raf = window.requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) {
          prev = performance.now();
          raf = window.requestAnimationFrame(tick);
        }
      },
      { rootMargin: "120px" },
    );
    io.observe(track);

    readTarget();
    current.current = target.current;
    raf = window.requestAnimationFrame(tick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [mode]);

  useEffect(() => {
    if (mode !== "carousel" || !stageRef.current) return undefined;
    const stage = stageRef.current;
    let raf = 0;
    let prev = performance.now();
    target.current = slide;

    const tick = (now) => {
      const dt = Math.min(64, now - prev) || 16.7;
      prev = now;
      const diff = target.current - current.current;
      current.current += diff * (1 - Math.exp(-dt / 70));
      if (Math.abs(diff) < 0.0008) {
        current.current = target.current;
      } else {
        raf = window.requestAnimationFrame(tick);
      }
      stage.style.setProperty("--pos", current.current.toFixed(4));
    };

    raf = window.requestAnimationFrame(tick);
    setActive(slide);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [mode, slide]);

  const step = (delta) => {
    const next = Math.min(LAST, Math.max(0, slide + delta));
    setSlide(next);
  };

  const jumpTo = (i) => {
    if (mode === "carousel") {
      setSlide(i);
    } else {
      const el = trackRef.current;
      if (!el) return;
      const docTop = el.getBoundingClientRect().top + window.scrollY;
      const travel = el.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      window.scrollTo({ top: docTop + travel * (i / LAST), behavior: "smooth" });
    }
  };

  const rail = (
    <div className="hiw-rail">
      <div className="hiw-rail__line">
        <span className="hiw-rail__fill" />
      </div>
      
      {/* ── Synchronized Scout Drone Character ── */}
      <button
        type="button"
        className="hiw-bot"
        aria-label={`Open step ${active + 1}: ${STEPS[active]?.tag ?? ""}`}
        onClick={(e) => {
          e.stopPropagation();
          jumpTo(active);
        }}
        title={`Click to focus Step ${active + 1}: ${STEPS[active]?.tag ?? ""}`}
      >
        <div className="hiw-bot__core">
          <svg viewBox="0 0 36 36" width="32" height="32" className="hiw-bot-svg">
            <defs>
              <linearGradient id="droneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE28A" />
                <stop offset="100%" stopColor="#E5B83B" />
              </linearGradient>
              <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
            <circle cx="18" cy="18" r="16" fill="rgba(229, 184, 59, 0.12)" stroke="rgba(229, 184, 59, 0.35)" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="18" y1="3" x2="18" y2="8" stroke="#FFE28A" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="18" cy="3" r="2.2" fill="#FFE28A" className="hiw-bot__antenna" />
            <rect x="6" y="8" width="24" height="20" rx="9" fill="#0A251D" stroke="url(#droneGrad)" strokeWidth="1.8" />
            <rect x="9.5" y="13" width="17" height="9" rx="4.5" fill="url(#visorGrad)" stroke="#34D399" strokeWidth="0.8" />
            <circle cx="18" cy="17.5" r="2.2" fill="#FFFFFF" className="hiw-bot__eye" />
            <circle cx="13" cy="17.5" r="1" fill="#A7F3D0" />
            <circle cx="23" cy="17.5" r="1" fill="#A7F3D0" />
            <rect x="3" y="15" width="3.5" height="6" rx="1.5" fill="#FFE28A" />
            <rect x="29.5" y="15" width="3.5" height="6" rx="1.5" fill="#FFE28A" />
            <line x1="13" y1="28" x2="13" y2="32" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
            <line x1="23" y1="28" x2="23" y2="32" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </button>

      {STEPS.map(({ tag }, i) => (
        <button
          key={tag}
          type="button"
          className={`hiw-rail__stop ${i === active ? "is-active" : ""} ${i < active ? "is-done" : ""}`}
          onClick={() => jumpTo(i)}
        >
          <span className="hiw-rail__dot" />
          <span className="hiw-rail__label">{`0${i + 1} · ${tag}`}</span>
        </button>
      ))}
    </div>
  );

  const deck = (
    <div className="hiw-stage">
      <div className="hiw-deck">
        {STEPS.map(({ icon: Icon, tag, title, body, out }, i) => (
          <article
            key={tag}
            className={`${panel} hiw-slide ${i === active ? "is-active" : ""}`}
            style={{ "--i": i, zIndex: 10 - Math.abs(i - active) }}
            aria-hidden={i !== active}
          >
            <span className="hiw-slide__glow" aria-hidden="true" />
            <span className="hiw-slide__index" aria-hidden="true">{`0${i + 1}`}</span>
            
            {/* Top Left Header with Parallax */}
            <div className="hiw-slide__head hiw-layer" style={{ "--depth": 1 }}>
              <span className="hiw-slide__icon">
                <Icon size={16} strokeWidth={2.2} />
              </span>
              <span className="hiw-slide__tag">
                {`STEP 0${i + 1} · ${tag}`}
              </span>
            </div>

            {/* Title & Body with Parallax */}
            <h3 className="hiw-slide__title hiw-layer" style={{ "--depth": 2.4 }}>
              {title}
            </h3>
            <p className="hiw-slide__body hiw-layer" style={{ "--depth": 3.6 }}>
              {body}
            </p>

            {/* Bottom Status Pill with Parallax */}
            <div className="hiw-slide__out hiw-layer" style={{ "--depth": 5 }}>
              <span className="hiw-step-out-dot" />
              <span>{out}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {withIntro && (
        <div className="mx-auto w-full max-w-[1060px] px-4 pt-24 sm:px-6">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider admin-accent">
            <ShieldCheck size={14} /> How the tracing works
          </div>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl" style={{ textWrap: "pretty" }}>
            Four steps from a victim's complaint to a freeze directive
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed admin-muted">
            Chakravyuh runs the same sequence on every case. Nothing is inferred from off-chain intelligence — each step
            reads the chain directly, so the output can be put in front of a court.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            {!compact && (
              <div className="hiw-modes" role="group" aria-label="How you read the steps">
                <button type="button" aria-pressed={mode === "scroll"} onClick={() => pickMode("scroll")}>
                  <MousePointer2 size={13} /> Scroll
                </button>
                <button type="button" aria-pressed={mode === "carousel"} onClick={() => pickMode("carousel")}>
                  <Rows3 size={13} /> Carousel
                </button>
              </div>
            )}
            {mode === "scroll" && (
              <span className="hiw-scrollcue">
                <ChevronDown size={14} /> Scroll to run the sequence
              </span>
            )}
          </div>
        </div>
      )}

      {mode === "scroll" ? (
        <div className="hiw-track" ref={trackRef}>
          <div className="hiw-sticky">
            <div className="hiw-sticky__inner" ref={stageRef}>
              {rail}
              {deck}
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-[1060px] px-4 pb-6 sm:px-6">
          <div className="hiw-carousel" ref={stageRef}>
            {rail}
            {deck}
            <div className="hiw-stepper">
              <button type="button" className="hiw-stepper__nav" onClick={() => step(-1)} disabled={slide === 0} aria-label="Previous step">
                <ChevronLeft size={16} />
              </button>
              <div className="hiw-stepper__dots">
                {STEPS.map(({ tag }, i) => (
                  <button
                    key={tag}
                    type="button"
                    className="hiw-stepper__dot"
                    aria-current={i === slide}
                    aria-label={`Step ${i + 1}: ${tag}`}
                    onClick={() => jumpTo(i)}
                  />
                ))}
              </div>
              <span className="hiw-stepper__count">{`0${slide + 1} / 0${STEPS.length}`}</span>
              <button type="button" className="hiw-stepper__nav" onClick={() => step(1)} disabled={slide === LAST} aria-label="Next step">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

