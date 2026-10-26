// MuregiScore Technologies - Enhanced Interactive Script
// Includes: Ambient Canvas, Metric Counters, Architecture Simulator, Unified Division Search, Scroll Progress, Copy Tooltips

document.addEventListener("DOMContentLoaded", () => {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Mobile Menu Toggle
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 2. Dynamic Year
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 3. Dynamic Card Spotlight Glow (tracks mouse position)
  const spotlightCards = document.querySelectorAll(
    ".solution-card, .matrix-card, .portfolio-item, .cta-panel, .metric-card, .simulator-card"
  );
  if (!prefersReducedMotion) {
    spotlightCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      });
    });
  }

  // 4. Interactive Hero Crest 3D Perspective Tilt
  const heroArt = document.querySelector(".hero-art");
  const heroImg = document.querySelector(".hero-art img");
  if (heroArt && heroImg && !prefersReducedMotion) {
    heroArt.addEventListener("mousemove", (e) => {
      const rect = heroArt.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroImg.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateY(-4px) scale(1.02)`;
    });
    heroArt.addEventListener("mouseleave", () => {
      heroImg.style.transform = "";
    });
  }

  // 5. Unified Interactive Division Filter & Live Keyword Search
  const filterButtons = document.querySelectorAll(".division-filter-btn");
  const cards = document.querySelectorAll(".solution-card");
  const searchInput = document.getElementById("division-search");
  const searchClear = document.getElementById("search-clear-btn");
  let activeFilter = "all";
  let searchQuery = "";

  function applyDivisionFilter() {
    cards.forEach((card) => {
      const category = card.getAttribute("data-category") || "";
      const textContent = (card.textContent + " " + (card.getAttribute("data-keywords") || "")).toLowerCase();
      
      const matchesCategory = activeFilter === "all" || category === activeFilter;
      const matchesSearch = searchQuery === "" || textContent.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.classList.remove("dimmed");
        card.classList.add("highlighted");
        card.style.display = "";
      } else {
        card.classList.add("dimmed");
        card.classList.remove("highlighted");
        if (searchQuery !== "" && !matchesSearch) {
          card.style.display = "none";
        } else {
          card.style.display = "";
        }
      }
    });
  }

  if (filterButtons.length > 0 && cards.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = btn.getAttribute("data-filter") || "all";
        applyDivisionFilter();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (searchClear) {
        searchClear.style.display = searchQuery.length > 0 ? "block" : "none";
      }
      applyDivisionFilter();
    });
  }

  if (searchClear && searchInput) {
    searchClear.addEventListener("click", () => {
      searchInput.value = "";
      searchQuery = "";
      searchClear.style.display = "none";
      applyDivisionFilter();
      searchInput.focus();
    });
  }

  // 6. Scroll Reveal Observer
  const revealElements = document.querySelectorAll(".reveal-up");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-revealed"));
  }

  // 7. Site Header Glassmorphism & Scroll Progress Ring
  const header = document.querySelector(".site-header");
  const progressBar = document.getElementById("scroll-progress-bar");
  const backToTop = document.getElementById("back-to-top");
  const progressCircle = document.getElementById("progress-circle");
  const circleRadius = 18;
  const circumference = 2 * Math.PI * circleRadius; // ~113.1

  if (progressCircle) {
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = `${circumference}`;
  }

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollY / docHeight : 0;

    // Header styling
    if (header) {
      if (scrollY > 40) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    // Scroll progress bar
    if (progressBar) {
      progressBar.style.width = `${progress * 100}%`;
    }

    // Back to top button visibility and progress ring
    if (backToTop && progressCircle) {
      if (scrollY > 300) {
        backToTop.classList.add("visible");
        const offset = circumference - progress * circumference;
        progressCircle.style.strokeDashoffset = `${offset}`;
      } else {
        backToTop.classList.remove("visible");
      }
    }
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 8. Dynamic Animated Metric Counters (IntersectionObserver + smooth easing)
  const metricNumbers = document.querySelectorAll(".metric-number");
  if (metricNumbers.length > 0 && "IntersectionObserver" in window) {
    const metricObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute("data-target") || "0");
          const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
          const duration = 1600; // ms
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = target * easeProgress;

            el.textContent = decimals > 0 ? currentVal.toFixed(decimals) : Math.floor(currentVal).toString();

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              el.textContent = decimals > 0 ? target.toFixed(decimals) : target.toString();
            }
          }

          requestAnimationFrame(updateCounter);
          metricObserver.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    metricNumbers.forEach((m) => metricObserver.observe(m));
  }

  // 9. Interactive Ambient Neural / Constellation Mesh Canvas
  const canvas = document.getElementById("ambient-canvas");
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: null, y: null, maxDist: 140 };

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Particle count scaled to viewport width
    const particleCount = Math.min(Math.floor(window.innerWidth / 24), 55);
    const particles = [];

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.6 + 0.8;
        this.baseAlpha = Math.random() * 0.35 + 0.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Gentle reaction to cursor
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.maxDist) {
            const force = (1 - dist / mouse.maxDist) * 0.03;
            this.x -= dx * force;
            this.y -= dy * force;
          }
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(217, 181, 109, ${this.baseAlpha})`;
        ctx.fill();
      }
    }

    function initParticles() {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }
    initParticles();

    let animationFrameId;
    let isCanvasActive = true;

    // Pause canvas animation when scrolled far down to preserve battery and 60fps
    window.addEventListener("scroll", () => {
      isCanvasActive = window.scrollY < 2400;
    }, { passive: true });

    function renderCanvas() {
      if (isCanvasActive) {
        ctx.clearRect(0, 0, width, height);

        // Connect nearby particles
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.hypot(dx, dy);

            if (dist < 105) {
              const alpha = (1 - dist / 105) * 0.16;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(217, 181, 109, ${alpha})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }

        particles.forEach((p) => {
          p.update();
          p.draw();
        });
      }
      animationFrameId = requestAnimationFrame(renderCanvas);
    }
    renderCanvas();
  }

  // 10. Interactive Architecture Simulator & Live Sandbox
  const simTabs = document.querySelectorAll(".sim-tab-btn");
  const simPanels = document.querySelectorAll(".sim-panel");

  if (simTabs.length > 0 && simPanels.length > 0) {
    simTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const targetSim = tab.getAttribute("data-sim");
        simTabs.forEach((t) => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        tab.classList.add("active");
        tab.setAttribute("aria-selected", "true");

        simPanels.forEach((panel) => {
          if (panel.id === `sim-${targetSim}`) {
            panel.classList.add("active");
            panel.style.display = "block";
          } else {
            panel.classList.remove("active");
            panel.style.display = "none";
          }
        });
      });
    });
  }

  // Helper function to append timestamped terminal lines
  function appendTerminalLine(container, text, cssClass = "") {
    const line = document.createElement("div");
    line.className = `t-line ${cssClass}`;
    line.textContent = text;
    container.appendChild(line);
    container.scrollTop = container.scrollHeight;
  }

  // Simulator Module 1: Safaricom Daraja STK Push
  const mpesaForm = document.getElementById("mpesa-sim-form");
  const mpesaTerminal = document.getElementById("mpesa-terminal");
  const mpesaStatus = document.getElementById("mpesa-sim-status");
  const mpesaBtn = document.getElementById("btn-trigger-mpesa");

  if (mpesaForm && mpesaTerminal && mpesaStatus) {
    mpesaForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const phone = document.getElementById("mpesa-phone").value.trim() || "254783541086";
      const amount = document.getElementById("mpesa-amount").value.trim() || "3500";
      const ref = document.getElementById("mpesa-ref").value.trim() || "EDU-FEES-DEMO";

      if (mpesaBtn) mpesaBtn.disabled = true;
      mpesaStatus.textContent = "TRANSMITTING...";
      mpesaStatus.style.color = "#ffbd2e";

      appendTerminalLine(mpesaTerminal, `\n--- [NEW TRANSACTION: ${new Date().toLocaleTimeString()}] ---`, "t-dim");
      appendTerminalLine(mpesaTerminal, `[000ms] Initiating Lipa Na M-Pesa STK Push -> MSISDN: ${phone}, Amount: KES ${amount}, Ref: ${ref}`);

      setTimeout(() => {
        appendTerminalLine(mpesaTerminal, `[185ms] OAuth 2.0 Bearer Token verified against Safaricom Gateway`);
      }, 180);

      setTimeout(() => {
        appendTerminalLine(mpesaTerminal, `[340ms] STK USSD prompt delivered to handset. ResponseCode: 0, CheckoutRequestID: ws_CO_261026_09`);
      }, 340);

      setTimeout(() => {
        appendTerminalLine(mpesaTerminal, `[690ms] Webhook Callback received: ResultCode: 0 (Success) TransactionID: QKD${Math.floor(100000 + Math.random() * 900000)}MP`, "t-success");
        appendTerminalLine(mpesaTerminal, `[740ms] Automated Ledger Updated: Account ${ref} credited with KES ${amount}.00`, "t-gold");
        appendTerminalLine(mpesaTerminal, `[810ms] BullMQ Job #NOTIF-827 dispatched: WhatsApp receipt delivered to ${phone}`, "t-info");

        mpesaStatus.textContent = "SUCCESS &bull; 690ms";
        mpesaStatus.style.color = "#38e17b";
        if (mpesaBtn) mpesaBtn.disabled = false;
      }, 720);
    });
  }

  // Simulator Module 2: EduCore Ratiba Solver
  const ratibaBtn = document.getElementById("btn-trigger-ratiba");
  const ratibaTerminal = document.getElementById("ratiba-terminal");
  const ratibaStatus = document.getElementById("ratiba-sim-status");

  if (ratibaBtn && ratibaTerminal && ratibaStatus) {
    ratibaBtn.addEventListener("click", () => {
      ratibaBtn.disabled = true;
      ratibaStatus.textContent = "SOLVING CONSTRAINTS...";
      ratibaStatus.style.color = "#ffbd2e";

      appendTerminalLine(ratibaTerminal, `\n--- [SOLVER EXECUTION: ${new Date().toLocaleTimeString()}] ---`, "t-dim");
      appendTerminalLine(ratibaTerminal, `[000ms] Initializing genetic timetable matrix across 4 grade streams and 40 weekly slots`);

      setTimeout(() => {
        appendTerminalLine(ratibaTerminal, `[120ms] Constraint Rule 1: Verifying teacher availability (12 teachers, max 24 periods/wk)`);
      }, 120);

      setTimeout(() => {
        appendTerminalLine(ratibaTerminal, `[250ms] Constraint Rule 2: Resolving practical lab collisions (Science Lab A/B allocated)`);
      }, 250);

      setTimeout(() => {
        appendTerminalLine(ratibaTerminal, `[390ms] Optimization: Morning STEM alignment achieved (CBC requirements fulfilled 100%)`);
      }, 390);

      setTimeout(() => {
        appendTerminalLine(ratibaTerminal, `[480ms] CONVERGENCE REACHED: 0 room clashes, 0 teacher overlaps across 160 period assignments!`, "t-success");
        appendTerminalLine(ratibaTerminal, `[510ms] Timetable PDF & digital teacher schedules compiled ready for download`, "t-gold");

        ratibaStatus.textContent = "100% CLASH-FREE";
        ratibaStatus.style.color = "#38e17b";
        ratibaBtn.disabled = false;
      }, 490);
    });
  }

  // Simulator Module 3: Core CRM Pipeline
  const crmBtn = document.getElementById("btn-trigger-crm");
  const crmTerminal = document.getElementById("crm-terminal");
  const crmStatus = document.getElementById("crm-sim-status");
  let currentStageIndex = 0;
  const stages = [
    { name: "Inbound Lead", stepId: "pipe-1" },
    { name: "Scoping Audit", stepId: "pipe-2" },
    { name: "SLA Contract", stepId: "pipe-3" },
    { name: "Active Tenant", stepId: "pipe-4" }
  ];

  if (crmBtn && crmTerminal && crmStatus) {
    crmBtn.addEventListener("click", () => {
      currentStageIndex = (currentStageIndex + 1) % stages.length;
      const stage = stages[currentStageIndex];

      stages.forEach((s, idx) => {
        const stepEl = document.getElementById(s.stepId);
        if (stepEl) {
          if (idx < currentStageIndex) {
            stepEl.className = "pipe-step done";
          } else if (idx === currentStageIndex) {
            stepEl.className = "pipe-step active";
          } else {
            stepEl.className = "pipe-step";
          }
        }
      });

      appendTerminalLine(crmTerminal, `\n[PIPELINE-MOVE] Deal moved to stage "${stage.name}" (Tenant: nbo_sme_${Math.floor(100 + Math.random() * 900)})`, "t-gold");
      appendTerminalLine(crmTerminal, `[BULLMQ-QUEUE] Job dispatched: queue.add("deal_state_transition", { stage: "${stage.name}" })`);
      appendTerminalLine(crmTerminal, `[WORKER-02] Processed in 14ms: Invoices, SLA draft and audit log updated.`, "t-success");

      crmStatus.textContent = `STAGE: ${stage.name.toUpperCase()}`;
    });
  }

  // Simulator Module 4: Livestock Yield Recompute
  const yieldBtn = document.getElementById("btn-trigger-yield");
  const yieldBars = document.querySelectorAll(".yield-visual-bars .bar-fill");
  const yieldSummary = document.getElementById("yield-average-summary");
  const yieldTerminal = document.getElementById("livestock-terminal");

  if (yieldBtn && yieldBars.length > 0 && yieldSummary) {
    yieldBtn.addEventListener("click", () => {
      // Generate new simulated yield for Sunday
      const newSundayYield = (29 + Math.random() * 6).toFixed(1);
      const heights = [75, 82, 80, 91, 86, 94, Math.min(Math.round((newSundayYield / 36) * 100), 98)];

      yieldBars.forEach((bar, index) => {
        bar.style.height = `${heights[index]}%`;
      });

      const avg = (29.5 + Math.random() * 1.5).toFixed(1);
      yieldSummary.textContent = `[ANALYTICS] Today's Yield: ${newSundayYield}L \u2022 7-Day Rolling Average: ${avg} Litres/day \u2022 Health Status: Optimal`;

      appendTerminalLine(yieldTerminal, `[NEW RECORD] Daily Milk Log: Cow #KE-089 recorded ${newSundayYield} Litres today. Pedigree index updated.`, "t-success");
    });
  }

  // 11. One-Click Copy Buttons & Global Toast
  const copyButtons = document.querySelectorAll(".copy-action-btn");
  const copyToast = document.getElementById("copy-toast");
  let toastTimer = null;

  function showToast(message) {
    if (!copyToast) return;
    copyToast.textContent = message;
    copyToast.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      copyToast.classList.remove("show");
    }, 2200);
  }

  copyButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const textToCopy = btn.getAttribute("data-copy");
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = btn.querySelector(".copy-text");
        if (originalText) originalText.textContent = "\u2713 Copied";
        showToast(`Copied "${textToCopy}" to clipboard!`);
        setTimeout(() => {
          if (originalText) originalText.textContent = "Copy";
        }, 2000);
      } catch (err) {
        // Fallback
        showToast(`Selected: ${textToCopy}`);
      }
    });
  });

  // 12. Accordion Mutual Exclusivity (Optional Smooth UX)
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        // Optionally keep other items open or single-accordion if desired
      }
    });
  });
});
