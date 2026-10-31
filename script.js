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
  const mpesaPhoneCard = document.getElementById("mpesa-phone-card");
  const phoneConfirmBtn = document.getElementById("btn-phone-confirm");
  const phoneValAmount = document.getElementById("phone-val-amount");
  const phoneValRef = document.getElementById("phone-val-ref");
  const phoneClock = document.getElementById("phone-clock");
  let mpesaTimer = null;

  function resetMpesaFlowNodes() {
    for (let i = 1; i <= 5; i++) {
      const node = document.getElementById(`flow-mpesa-${i}`);
      if (node) {
        node.className = i === 1 ? "flow-node active" : "flow-node";
      }
    }
  }

  function setMpesaFlowNode(step) {
    for (let i = 1; i <= 5; i++) {
      const node = document.getElementById(`flow-mpesa-${i}`);
      if (node) {
        if (i < step) {
          node.className = "flow-node done";
        } else if (i === step) {
          node.className = "flow-node active";
        } else {
          node.className = "flow-node";
        }
      }
    }
  }

  function executeMpesaCallback(phone, amount, ref) {
    if (mpesaTimer) clearTimeout(mpesaTimer);
    if (mpesaPhoneCard) mpesaPhoneCard.classList.remove("active");
    setMpesaFlowNode(4);

    const receiptNum = `QKD${Math.floor(100000 + Math.random() * 900000)}MP`;

    appendTerminalLine(mpesaTerminal, `[480ms] Inbound Webhook Callback received from Safaricom IP: 196.201.214.200`, "t-info");
    appendTerminalLine(mpesaTerminal, `[520ms] HMAC SHA-256 Webhook signature verified with Daraja Passkey`, "t-gold");
    appendTerminalLine(mpesaTerminal, `[560ms] Webhook Payload:\n` + JSON.stringify({
      Body: {
        stkCallback: {
          MerchantRequestID: "29115-34620561-1",
          CheckoutRequestID: `ws_CO_${Date.now()}`,
          ResultCode: 0,
          ResultDesc: "The service request is processed successfully.",
          CallbackMetadata: {
            Item: [
              { Name: "Amount", Value: parseFloat(amount) },
              { Name: "MpesaReceiptNumber", Value: receiptNum },
              { Name: "TransactionDate", Value: parseInt(new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)) },
              { Name: "PhoneNumber", Value: parseInt(phone) }
            ]
          }
        }
      }
    }, null, 2), "t-dim");

    setTimeout(() => {
      setMpesaFlowNode(5);
      appendTerminalLine(mpesaTerminal, `[740ms] [ACID TRANSACTION] Ledger reconciled: Account "${ref}" credited with KES ${amount}.00`, "t-success");
      appendTerminalLine(mpesaTerminal, `[810ms] BullMQ Job #SMS-${Math.floor(1000 + Math.random() * 9000)} dispatched: Automated receipt sent to ${phone}`, "t-gold");

      if (mpesaStatus) {
        mpesaStatus.textContent = "SUCCESS \u2022 690ms";
        mpesaStatus.style.color = "#38e17b";
      }
      if (mpesaBtn) mpesaBtn.disabled = false;
    }, 280);
  }

  if (mpesaForm && mpesaTerminal && mpesaStatus) {
    mpesaForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const phone = document.getElementById("mpesa-phone").value.trim() || "254783541086";
      const amount = document.getElementById("mpesa-amount").value.trim() || "3500";
      const ref = document.getElementById("mpesa-ref").value.trim() || "EDU-TERM3-FEES";

      if (mpesaBtn) mpesaBtn.disabled = true;
      mpesaStatus.textContent = "TRANSMITTING...";
      mpesaStatus.style.color = "#ffbd2e";
      resetMpesaFlowNodes();

      if (phoneValAmount) phoneValAmount.textContent = Number(amount).toLocaleString('en-KE', { minimumFractionDigits: 2 });
      if (phoneValRef) phoneValRef.textContent = ref;
      if (phoneClock) phoneClock.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      appendTerminalLine(mpesaTerminal, `\n--- [NEW DARAJA TRANSACTION: ${new Date().toLocaleTimeString()}] ---`, "t-dim");
      appendTerminalLine(mpesaTerminal, `[000ms] Initiating Lipa Na M-Pesa STK Push -> MSISDN: ${phone}, Amount: KES ${amount}, Ref: ${ref}`);

      setTimeout(() => {
        setMpesaFlowNode(2);
        appendTerminalLine(mpesaTerminal, `[185ms] OAuth 2.0 Bearer Token verified against Safaricom Gateway`);
      }, 180);

      setTimeout(() => {
        setMpesaFlowNode(3);
        appendTerminalLine(mpesaTerminal, `[340ms] STK USSD prompt delivered to handset. ResponseCode: 0, CheckoutRequestID: ws_CO_${Date.now()}`);
        if (mpesaPhoneCard) mpesaPhoneCard.classList.add("active");

        // Auto-authorize if user doesn't click within 2.8s
        mpesaTimer = setTimeout(() => {
          executeMpesaCallback(phone, amount, ref);
        }, 2800);
      }, 340);
    });

    if (phoneConfirmBtn) {
      phoneConfirmBtn.addEventListener("click", () => {
        const phone = document.getElementById("mpesa-phone").value.trim() || "254783541086";
        const amount = document.getElementById("mpesa-amount").value.trim() || "3500";
        const ref = document.getElementById("mpesa-ref").value.trim() || "EDU-TERM3-FEES";
        executeMpesaCallback(phone, amount, ref);
      });
    }
  }

  // Simulator Module 2: EduCore & EduCore Ratiba Solver
  const btnSubRatiba = document.getElementById("btn-sub-ratiba");
  const btnSubCbc = document.getElementById("btn-sub-cbc");
  const subviewRatiba = document.getElementById("subview-ratiba");
  const subviewCbc = document.getElementById("subview-cbc");
  const ratibaGrid = document.getElementById("ratiba-matrix-grid");

  if (btnSubRatiba && btnSubCbc && subviewRatiba && subviewCbc) {
    btnSubRatiba.addEventListener("click", () => {
      btnSubRatiba.classList.add("active");
      btnSubCbc.classList.remove("active");
      subviewRatiba.style.display = "block";
      subviewCbc.style.display = "none";
      if (ratibaGrid) ratibaGrid.style.display = "grid";
    });

    btnSubCbc.addEventListener("click", () => {
      btnSubCbc.classList.add("active");
      btnSubRatiba.classList.remove("active");
      subviewRatiba.style.display = "none";
      subviewCbc.style.display = "block";
      if (ratibaGrid) ratibaGrid.style.display = "none";
    });
  }

  // Ratiba Timetable Solver Execution
  const ratibaBtn = document.getElementById("btn-trigger-ratiba");
  const clashBtn = document.getElementById("btn-inject-clash");
  const ratibaTerminal = document.getElementById("ratiba-terminal");
  const ratibaStatus = document.getElementById("ratiba-sim-status");
  const matrixHealth = document.getElementById("ratiba-matrix-status");
  const clashCell1 = document.getElementById("tt-clash-1");
  const clashCell2 = document.getElementById("tt-clash-2");
  const wedSlot3 = document.getElementById("tt-slot-wed-3");
  const thuSlot4 = document.getElementById("tt-slot-thu-4");

  if (ratibaBtn && ratibaTerminal && ratibaStatus) {
    ratibaBtn.addEventListener("click", () => {
      ratibaBtn.disabled = true;
      ratibaStatus.textContent = "SOLVING CONSTRAINTS...";
      ratibaStatus.style.color = "#ffbd2e";

      appendTerminalLine(ratibaTerminal, `\n--- [SOLVER EXECUTION: ${new Date().toLocaleTimeString()}] ---`, "t-dim");
      appendTerminalLine(ratibaTerminal, `[000ms] Initializing FET combinatorial solver across 4 grade streams and 40 weekly slots`);

      setTimeout(() => {
        appendTerminalLine(ratibaTerminal, `[080ms] Hard Constraint 1: Scanning faculty schedules. Detected collision on Mon P3 (Tr. Kamau double-booked).`);
      }, 90);

      setTimeout(() => {
        appendTerminalLine(ratibaTerminal, `[190ms] Hard Constraint 2: Scanning laboratory capacities. Detected collision on Tue P4 (Lab A over-subscribed).`);
      }, 190);

      setTimeout(() => {
        appendTerminalLine(ratibaTerminal, `[310ms] Backtracking search tree: Permuting 14 teacher slots and 2 laboratory access windows.`);
      }, 310);

      setTimeout(() => {
        // Resolve Matrix Cells visually
        if (clashCell1) {
          clashCell1.className = "tt-cell resolved";
          clashCell1.innerHTML = `<span class="tt-sub">\u2713 Math (Gr. 7)</span><span class="tt-tag">Tr. Kamau [Solved]</span>`;
        }
        if (clashCell2) {
          clashCell2.className = "tt-cell resolved";
          clashCell2.innerHTML = `<span class="tt-sub">\u2713 Biology Lab</span><span class="tt-tag">Lab A [Solo Session]</span>`;
        }
        if (wedSlot3) {
          wedSlot3.innerHTML = `<span class="tt-sub">Math (Gr. 8)</span><span class="tt-tag">Tr. Kamau [Reassigned]</span>`;
        }
        if (thuSlot4) {
          thuSlot4.innerHTML = `<span class="tt-sub">Chemistry Lab</span><span class="tt-tag">Lab A [Scheduled]</span>`;
        }

        if (matrixHealth) {
          matrixHealth.className = "status-pill status-ok";
          matrixHealth.textContent = "\u2713 0 Clashes Active";
        }

        appendTerminalLine(ratibaTerminal, `[460ms] CONVERGENCE REACHED: 0 room clashes, 0 teacher overlaps across 160 period assignments!`, "t-success");
        appendTerminalLine(ratibaTerminal, `[510ms] Timetable PDF & digital teacher schedules compiled ready for school deployment.`, "t-gold");

        ratibaStatus.textContent = "100% CLASH-FREE";
        ratibaStatus.style.color = "#38e17b";
        ratibaBtn.disabled = false;
      }, 480);
    });

    if (clashBtn) {
      clashBtn.addEventListener("click", () => {
        if (clashCell1) {
          clashCell1.className = "tt-cell clash";
          clashCell1.innerHTML = `<span class="tt-sub">\u26A0\uFE0F Tr. Kamau Clash</span><span class="tt-tag">Gr. 7 &amp; Gr. 8 Clashing</span>`;
        }
        if (clashCell2) {
          clashCell2.className = "tt-cell clash";
          clashCell2.innerHTML = `<span class="tt-sub">\u26A0\uFE0F Lab A Overlap</span><span class="tt-tag">Bio &amp; Chem Booked</span>`;
        }
        if (wedSlot3) {
          wedSlot3.innerHTML = `<span class="tt-sub">Kiswahili</span><span class="tt-tag">Tr. Hassan</span>`;
        }
        if (thuSlot4) {
          thuSlot4.innerHTML = `<span class="tt-sub">Free Study</span><span class="tt-tag">Hall B</span>`;
        }
        if (matrixHealth) {
          matrixHealth.className = "status-pill status-warn";
          matrixHealth.textContent = "\u26A0\uFE0F 2 Clashes Active";
        }
        appendTerminalLine(ratibaTerminal, `[INJECT] Sample teacher double-booking & laboratory collision injected into matrix.`, "t-gold");
      });
    }
  }

  // CBC Rubrics Assessment Engine Sliders
  const rangeStem = document.getElementById("range-stem");
  const rangeLang = document.getElementById("range-lang");
  const rangeArts = document.getElementById("range-arts");
  const valStem = document.getElementById("val-stem");
  const valLang = document.getElementById("val-lang");
  const valArts = document.getElementById("val-arts");
  const cbcOverallPill = document.getElementById("cbc-overall-pill");
  const cbcAutoRemark = document.getElementById("cbc-auto-remark");

  function getCbcRubric(score) {
    if (score >= 80) return { code: "EE", label: "Exceeding Expectations", cssClass: "status-ok" };
    if (score >= 65) return { code: "ME", label: "Meeting Expectations", cssClass: "status-ok" };
    if (score >= 50) return { code: "AE", label: "Approaching Expectations", cssClass: "status-warn" };
    return { code: "BE", label: "Below Expectations", cssClass: "status-warn" };
  }

  function updateCbcAssessment() {
    if (!rangeStem || !rangeLang || !rangeArts) return;
    const stem = parseInt(rangeStem.value, 10);
    const lang = parseInt(rangeLang.value, 10);
    const arts = parseInt(rangeArts.value, 10);

    const stemRub = getCbcRubric(stem);
    const langRub = getCbcRubric(lang);
    const artsRub = getCbcRubric(arts);

    if (valStem) valStem.textContent = `${stem}% \u2022 ${stemRub.code}`;
    if (valLang) valLang.textContent = `${lang}% \u2022 ${langRub.code}`;
    if (valArts) valArts.textContent = `${arts}% \u2022 ${artsRub.code}`;

    const avg = Math.round((stem + lang + arts) / 3);
    const overall = getCbcRubric(avg);

    if (cbcOverallPill) {
      cbcOverallPill.className = `status-pill ${overall.cssClass}`;
      cbcOverallPill.textContent = `${overall.code} (${overall.label})`;
    }

    if (cbcAutoRemark) {
      if (avg >= 80) {
        cbcAutoRemark.textContent = `"Demonstrates exceptional analytical mastery across core strands. Consistently exhibits strong initiative, self-direction, and teamwork in practical assignments."`;
      } else if (avg >= 65) {
        cbcAutoRemark.textContent = `"Consistently meets core competency standards across all subject strands with steady conceptual grasp and collaborative classroom participation."`;
      } else if (avg >= 50) {
        cbcAutoRemark.textContent = `"Demonstrates developing understanding in fundamental strands. Recommended for targeted inquiry-based exercises to strengthen practical application."`;
      } else {
        cbcAutoRemark.textContent = `"Requires dedicated remedial intervention and closer teacher scaffolding to achieve foundational competency levels."`;
      }
    }
  }

  if (rangeStem && rangeLang && rangeArts) {
    rangeStem.addEventListener("input", updateCbcAssessment);
    rangeLang.addEventListener("input", updateCbcAssessment);
    rangeArts.addEventListener("input", updateCbcAssessment);
  }

  // Simulator Module 3: Core CRM Pipeline & Multi-Tenant BullMQ Queue
  const crmBtn = document.getElementById("btn-trigger-crm");
  const crmTerminal = document.getElementById("crm-terminal");
  const crmStatus = document.getElementById("crm-sim-status");
  const crmTenantSelect = document.getElementById("crm-tenant-select");
  const crmEventSelect = document.getElementById("crm-event-select");
  const qWaiting = document.getElementById("q-waiting");
  const qActive = document.getElementById("q-active");
  const qCompleted = document.getElementById("q-completed");
  const qLatency = document.getElementById("q-latency");
  let currentStageIndex = 0;
  let completedJobCount = 5280;

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
      const tenantId = crmTenantSelect ? crmTenantSelect.value : "tenant_nbo_01";
      const eventType = crmEventSelect ? crmEventSelect.value : "invoice_pdf";
      const latency = Math.floor(11 + Math.random() * 8);

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

      completedJobCount++;
      if (qCompleted) qCompleted.textContent = completedJobCount.toLocaleString();
      if (qLatency) qLatency.textContent = `${latency}ms`;

      appendTerminalLine(crmTerminal, `\n[SCHEMA-ROUTE] SET search_path TO ${tenantId}; (Tenant isolation confirmed)`, "t-gold");
      appendTerminalLine(crmTerminal, `[BULLMQ-ENQUEUE] Job "job_${Math.random().toString(36).substring(2, 8)}" added to queue "crm-workers" (Event: ${eventType})`, "t-info");
      appendTerminalLine(crmTerminal, `[WORKER-03] Processed in ${latency}ms -> Status: SUCCESS:\n` + JSON.stringify({
        jobId: `job_${Math.random().toString(36).substring(2, 8)}`,
        tenant: tenantId,
        task: eventType,
        pipelineStage: stage.name,
        durationMs: latency,
        status: "COMPLETED"
      }, null, 2), "t-success");

      crmStatus.textContent = `TENANT: ${tenantId.toUpperCase()} \u2022 ${stage.name.toUpperCase()}`;
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
