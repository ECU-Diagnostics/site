(function () {
  const header = document.getElementById("header");
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  const year = document.getElementById("year");

  if (year) year.textContent = String(new Date().getFullYear());

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }
})();

(function () {
  const form = document.getElementById("lead");
  if (!form) return;
  const status = form.querySelector(".leadform__status");
  const btn = form.querySelector("button[type=submit]");
  const started = Date.now();
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const contact = String(f.get("contact") || "").trim();
    const okContact = contact.replace(/\D/g, "").length >= 7 || /^@?[A-Za-z][A-Za-z0-9_]{4,31}$/.test(contact);
    if (!String(f.get("name") || "").trim() || !okContact || !f.get("consent")) {
      status.textContent = status.dataset.bad;
      return;
    }
    btn.disabled = true;
    status.textContent = "…";
    try {
      const r = await fetch("https://api.ecu-diagnostics-kg.com/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.get("name"), contact, need: f.get("need"), car: f.get("car"), msg: f.get("msg"),
          website: f.get("website"), consent: true, t: Date.now() - started, lang: form.dataset.lang,
        }),
      });
      if (r.ok) { form.reset(); status.textContent = status.dataset.ok; }
      else status.textContent = r.status === 429 ? status.dataset.wait : status.dataset.err;
    } catch (_) {
      status.textContent = status.dataset.err;
    } finally {
      btn.disabled = false;
    }
  });
})();
