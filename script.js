// ---------- Config ----------
const WEDDING_DATE = new Date("2030-01-01T14:00:00");
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Envelope opening ----------
const envelope = document.getElementById("envelope");
const envelopeScreen = document.getElementById("envelopeScreen");
const invitation = document.getElementById("invitation");

function openEnvelope() {
  if (envelope.classList.contains("open")) return;
  envelope.classList.add("open");
  envelopeScreen.classList.add("opened");
  invitation.hidden = false;
  burstConfetti();
  startPetals();
}

envelope.addEventListener("click", openEnvelope);
envelope.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    openEnvelope();
  }
});

// ---------- Countdown ----------
const cd = {
  days: document.getElementById("cdDays"),
  hours: document.getElementById("cdHours"),
  mins: document.getElementById("cdMins"),
  secs: document.getElementById("cdSecs"),
};
const countdownGrid = document.getElementById("countdownGrid");
const countdownToday = document.getElementById("countdownToday");

function updateCountdown() {
  const diff = WEDDING_DATE - Date.now();
  if (diff <= 0) {
    countdownGrid.hidden = true;
    countdownToday.hidden = false;
    clearInterval(countdownTimer);
    return;
  }
  const s = Math.floor(diff / 1000);
  cd.days.textContent = Math.floor(s / 86400);
  cd.hours.textContent = String(Math.floor((s % 86400) / 3600)).padStart(2, "0");
  cd.mins.textContent = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  cd.secs.textContent = String(s % 60).padStart(2, "0");
}

const countdownTimer = setInterval(updateCountdown, 1000);
updateCountdown();

// ---------- Confetti & petals ----------
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
let particles = [];
let animating = false;

function sizeCanvas() {
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
sizeCanvas();
window.addEventListener("resize", sizeCanvas);

const COLORS = ["#6d1a2e", "#e89ab0", "#c9a86a"]; // burgundy, pink, gold

function makeParticle(kind) {
  const w = window.innerWidth;
  return {
    kind, // "confetti" bursts up from bottom; "petal" drifts down from top
    x: Math.random() * w,
    y: kind === "confetti" ? window.innerHeight + 10 : -20,
    vx: (Math.random() - 0.5) * (kind === "confetti" ? 6 : 1),
    vy: kind === "confetti" ? -(6 + Math.random() * 9) : 0.6 + Math.random() * 0.8,
    size: 5 + Math.random() * 6,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.2,
    life: 1,
  };
}

function burstConfetti() {
  if (REDUCED_MOTION) return;
  for (let i = 0; i < 160; i++) particles.push(makeParticle("confetti"));
  if (!animating) tick();
  // second and third waves for a fuller celebration
  setTimeout(() => {
    for (let i = 0; i < 90; i++) particles.push(makeParticle("confetti"));
    if (!animating) tick();
  }, 350);
  setTimeout(() => {
    for (let i = 0; i < 60; i++) particles.push(makeParticle("confetti"));
    if (!animating) tick();
  }, 700);
}

let petalsOn = false;
function startPetals() {
  if (REDUCED_MOTION || petalsOn) return;
  petalsOn = true;
  setInterval(() => {
    if (particles.length < 60 && !document.hidden) {
      particles.push(makeParticle("petal"));
      if (!animating) tick();
    }
  }, 700);
}

function tick() {
  animating = true;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles = particles.filter((p) => p.life > 0 && p.y < window.innerHeight + 30);
  for (const p of particles) {
    p.x += p.vx + (p.kind === "petal" ? Math.sin(p.y / 40) * 0.8 : 0);
    p.y += p.vy;
    if (p.kind === "confetti") {
      p.vy += 0.25; // gravity
      p.life -= 0.008;
    }
    p.rot += p.vr;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = Math.max(p.life, 0);
    ctx.fillStyle = p.color;
    if (p.kind === "petal") {
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.7, p.size * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    }
    ctx.restore();
  }
  if (particles.length > 0) {
    requestAnimationFrame(tick);
  } else {
    animating = false;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

// ---------- Fade-up reveal on scroll ----------
if (!REDUCED_MOTION) {
  const fadeEls = document.querySelectorAll(".hero > *, section > *, .footer > *");
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15 }
  );
  fadeEls.forEach((el, i) => {
    el.classList.add("fade-up");
    // gentle stagger for the hero lines revealed together on envelope open
    if (el.parentElement.classList.contains("hero")) {
      el.style.transitionDelay = `${i * 0.12}s`;
    }
    observer.observe(el);
  });
}

// ---------- Gallery placeholders ----------
// The template ships with no photos, so every gallery <img> would render as a
// broken-image icon on a fresh clone. Any image that fails to load falls back
// to this inline SVG instead. Drop your files into photos/ and it goes away on
// its own — no markup changes needed.
const PHOTO_PLACEHOLDER =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
      <rect width="400" height="500" fill="#f6efe6"/>
      <rect x="12" y="12" width="376" height="476" fill="none" stroke="#d9c3a9" stroke-width="2" stroke-dasharray="10 8"/>
      <path d="M200 285c-55-38-80-66-80-98a40 40 0 0 1 80-16 40 40 0 0 1 80 16c0 32-25 60-80 98z" fill="#e3cdd6"/>
      <text x="200" y="345" text-anchor="middle" font-family="Jost, Helvetica, sans-serif" font-size="20" fill="#a08e7d">Add your photo</text>
    </svg>`
  );

function usePlaceholder(img) {
  if (img.dataset.placeholder) return; // don't loop if the fallback itself fails
  img.dataset.placeholder = "true";
  img.src = PHOTO_PLACEHOLDER;
}

for (const img of document.querySelectorAll(".gallery img")) {
  img.addEventListener("error", () => usePlaceholder(img));
  // an image may have already failed before this script ran
  if (img.complete && img.naturalWidth === 0) usePlaceholder(img);
}

// ---------- RSVP form (Google Apps Script via fetch) ----------
// Paste your own Apps Script web-app URL (ends in /exec) between the quotes below.
// See README.md for how to create one and connect it to a Google Sheet.
const RSVP_ENDPOINT = "";

const form = document.getElementById("rsvpForm");
const formStatus = document.getElementById("formStatus");
const submitBtn = document.getElementById("rsvpSubmit");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!RSVP_ENDPOINT) {
    formStatus.textContent = "RSVP endpoint not configured yet — set RSVP_ENDPOINT in script.js.";
    formStatus.classList.add("error");
    return;
  }
  submitBtn.disabled = true;
  formStatus.textContent = "Sending…";
  formStatus.classList.remove("error");
  try {
    // Apps Script web apps don't send CORS headers, so we post with no-cors.
    // The response is opaque (unreadable) — we can't confirm success, so we
    // optimistically thank the guest. URLSearchParams sends form-encoded data,
    // which Apps Script reads from e.parameter with no preflight request.
    await fetch(RSVP_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      body: new URLSearchParams(new FormData(form)),
    });
    form.reset();
    formStatus.textContent = "Thank you! Your RSVP has been received. 💛";
    burstConfetti();
  } catch (err) {
    formStatus.textContent = "Something went wrong. Please contact the numbers provided in the invitation.";
    formStatus.classList.add("error");
  } finally {
    submitBtn.disabled = false;
  }
});