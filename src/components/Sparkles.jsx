import { Fragment } from "preact";
import { useState, useEffect, useRef, useCallback } from "preact/hooks";

const range = (count) => new Array(count).fill(undefined);
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const QUERY = "(prefers-reduced-motion: no-preference)";
const isRenderingOnServer = typeof window === "undefined";
const getInitialState = () => {
  // For our initial server render, we won't know if the user
  // prefers reduced motion, but it doesn't matter. This value
  // will be overwritten on the client, before any animations
  // occur.
  return isRenderingOnServer ? true : !window.matchMedia(QUERY).matches;
};
function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] =
    useState(getInitialState);
  useEffect(() => {
    const mediaQueryList = window.matchMedia(QUERY);
    const listener = (event) => {
      setPrefersReducedMotion(!event.matches);
    };
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", listener);
    } else {
      mediaQueryList.addListener(listener);
    }
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener("change", listener);
      } else {
        mediaQueryList.removeListener(listener);
      }
    };
  }, []);
  return prefersReducedMotion;
}

const useRandomInterval = (callback, minDelay, maxDelay) => {
  const timeoutId = useRef(null);
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    let isEnabled =
      typeof minDelay === "number" && typeof maxDelay === "number";
    if (isEnabled) {
      const handleTick = () => {
        const nextTickAt = random(minDelay, maxDelay);
        timeoutId.current = window.setTimeout(() => {
          savedCallback.current();
          handleTick();
        }, nextTickAt);
      };
      handleTick();
    }
    return () => window.clearTimeout(timeoutId.current);
  }, [minDelay, maxDelay]);
  const cancel = useCallback(function () {
    window.clearTimeout(timeoutId.current);
  }, []);
  return cancel;
};

const DEFAULT_COLOR = "#FFC700";
const generateSparkle = (color) => {
  const sparkle = {
    id: String(random(10000, 99999)),
    createdAt: Date.now(),
    color,
    size: random(10, 20),
    style: {
      top: random(0, 90) + "%",
      left: random(0, 100) + "%",
    },
  };
  return sparkle;
};
const Sparkles = ({ color = DEFAULT_COLOR, children, ...delegated }) => {
  const [sparkles, setSparkles] = useState(() => {
    return range(3).map(() => generateSparkle(color));
  });
  const prefersReducedMotion = usePrefersReducedMotion();
  useRandomInterval(
    () => {
      const sparkle = generateSparkle(color);
      const now = Date.now();
      const nextSparkles = sparkles.filter((sp) => {
        const delta = now - sp.createdAt;
        return delta < 1000;
      });
      nextSparkles.push(sparkle);
      setSparkles(nextSparkles);
    },
    prefersReducedMotion ? null : 300,
    prefersReducedMotion ? null : 900
  );
  return (
    <Fragment>
      <style>
        {`
        @keyframes comein {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1);
          }
          100% {
            transform: scale(0);
          }
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(180deg);
          }
        }
        .wrapper {
          display: inline-block;
          position: relative;
        }
        .child-wrapper {
          position: relative;
          z-index: 1;
          font-weight: bold;
        }
        .sparkle-wrapper {
          position: absolute;
          display: block;
        }
        .sparkle {
          display: block;
        }
        @media (prefers-reduced-motion: no-preference) {
          .sparkle-wrapper {
            animation: comein 700ms forwards;
          }
          .sparkle {
            animation: spin 1000ms linear;
          }
        }
      `}
      </style>
      <span className="wrapper" {...delegated}>
        {sparkles.map((sparkle) => (
          <Sparkle
            key={sparkle.id}
            color={sparkle.color}
            size={sparkle.size}
            style={sparkle.style}
          />
        ))}
        <strong className="child-wrapper">{children}</strong>
      </span>
    </Fragment>
  );
};
const Sparkle = ({ size, color, style }) => {
  const path =
    "M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z";
  return (
    <span className="sparkle-wrapper" style={style}>
      <svg
        className="sparkle"
        width={size}
        height={size}
        viewBox="0 0 68 68"
        fill="none"
      >
        <path d={path} fill={color} />
      </svg>
    </span>
  );
};

export default Sparkles;
