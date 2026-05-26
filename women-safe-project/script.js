const splitHeadline = () => {
  const title = document.querySelector("[data-split]");
  if (!title) return;

  const lines = Array.from(title.querySelectorAll(".headline-line"));
  if (lines.length) {
    title.innerHTML = "";
    let index = 0;

    lines.forEach((line) => {
      const lineWrap = document.createElement("span");
      lineWrap.className = "headline-line";

      line.textContent.split(/(\s+)/).forEach((part) => {
        if (!part.trim()) {
          lineWrap.appendChild(document.createTextNode(part));
          return;
        }

        const span = document.createElement("span");
        span.className = "word";
        span.style.setProperty("--i", index);
        span.textContent = part;
        lineWrap.appendChild(span);
        index += 1;
      });

      title.appendChild(lineWrap);
    });
    return;
  }

  const nodes = Array.from(title.childNodes);
  let index = 0;
  title.innerHTML = "";

  nodes.forEach((node) => {
    if (node.nodeName === "BR") {
      title.appendChild(document.createElement("br"));
      return;
    }

    const words = node.textContent.split(/(\s+)/);
    words.forEach((part) => {
      if (!part.trim()) {
        title.appendChild(document.createTextNode(part));
        return;
      }

      const span = document.createElement("span");
      span.className = "word";
      span.style.setProperty("--i", index);
      span.textContent = part;
      title.appendChild(span);
      index += 1;
    });
  });
};

const revealOnScroll = () => {
  const revealItems = document.querySelectorAll("[data-reveal]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 120, 520)}ms`;
    observer.observe(item);
  });
};

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const addPointerDepth = () => {
  const visual = document.querySelector(".hero-visual");
  const phone = document.querySelector("[data-phone]");
  if (!visual || !phone || prefersReducedMotion()) return;

  visual.addEventListener("pointermove", (event) => {
    const rect = visual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    phone.style.setProperty("--tilt-x", `${y * -5}deg`);
    phone.style.setProperty("--tilt-y", `${x * 7}deg`);
    phone.style.transform = `translate3d(${x * 8}px, ${y * 8}px, 0) rotateX(calc(3deg + var(--tilt-x))) rotateY(calc(-6deg + var(--tilt-y)))`;
  });

  visual.addEventListener("pointerleave", () => {
    phone.style.removeProperty("transform");
  });
};

const addCardTilt = () => {
  const cards = document.querySelectorAll("[data-tilt]");
  if (prefersReducedMotion()) return;

  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-5px) rotateX(${y * -3}deg) rotateY(${x * 4}deg)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("transform");
    });
  });
};

const animateCount = (element) => {
  const target = Number(element.dataset.count || "0");
  const suffix = element.dataset.countSuffix || "";
  const duration = 1200;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    element.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const addCountAnimations = () => {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  if (prefersReducedMotion()) {
    counters.forEach((counter) => {
      counter.textContent = `${counter.dataset.count}${counter.dataset.countSuffix || ""}`;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.45 }
  );

  counters.forEach((counter) => observer.observe(counter));
};

const addHeroParallax = () => {
  const intro = document.querySelector(".verify-intro");
  const success = document.querySelector(".scan-success-card");
  const hero = document.querySelector(".verify-hero");
  if (!intro || !success || !hero || prefersReducedMotion()) return;

  let ticking = false;

  const update = () => {
    const rect = hero.getBoundingClientRect();
    const progress = Math.max(-1, Math.min(1, rect.top / window.innerHeight));
    intro.style.translate = `0 ${progress * -14}px`;
    success.style.translate = `0 ${progress * 18}px`;
    ticking = false;
  };

  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
};

const addPageTransitions = () => {
  if (prefersReducedMotion()) return;

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || link.target || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const url = new URL(link.href, window.location.href);
    const isSamePageHash = url.pathname === window.location.pathname && url.hash;
    if (url.origin !== window.location.origin || isSamePageHash) return;

    event.preventDefault();
    document.body.classList.add("is-leaving");
    window.setTimeout(() => {
      window.location.href = url.href;
    }, 260);
  });
};

const addScanDemo = () => {
  const button = document.querySelector("[data-run-demo]");
  const status = document.querySelector("[data-demo-status]");
  const score = document.querySelector("[data-demo-score]");
  const title = document.querySelector("[data-demo-title]");
  if (!button || !status || !score || !title) return;

  const states = [
    { status: "Reading QR code", score: "42", title: "Scanning batch" },
    { status: "Matching lab report", score: "76", title: "Report matched" },
    { status: "Verification complete", score: "98", title: "Safety Verified" },
  ];

  let isRunning = false;

  button.addEventListener("click", () => {
    if (isRunning) return;
    isRunning = true;
    button.textContent = "Scanning...";
    button.classList.add("is-running");

    states.forEach((state, index) => {
      window.setTimeout(() => {
        status.textContent = state.status;
        score.textContent = state.score;
        title.textContent = state.title;

        if (index === states.length - 1) {
          button.textContent = "Scan Again";
          button.classList.remove("is-running");
          isRunning = false;
        }
      }, index * 720);
    });
  });
};

const addVerificationPageMotion = () => {
  const loader = document.querySelector("[data-rating-loader]");
  const ratingCard = document.querySelector(".rating-card");
  if (!loader || !ratingCard) return;

  ratingCard.classList.add("is-loading");

  window.setTimeout(() => {
    loader.querySelector("em").textContent = "Trace data matched";
    ratingCard.classList.remove("is-loading");
    ratingCard.classList.add("is-complete");
  }, 1300);
};

window.addEventListener("DOMContentLoaded", () => {
  splitHeadline();
  revealOnScroll();
  addPointerDepth();
  addCardTilt();
  addScanDemo();
  addVerificationPageMotion();
  addCountAnimations();
  addHeroParallax();
  addPageTransitions();
});
