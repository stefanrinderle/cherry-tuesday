/* ==========================================================
   KONZERTE – hier pflegen.
   Datum im Format JJJJ-MM-TT. Vergangene Termine wandern
   automatisch in "Vergangene Konzerte".
   Beispiel:
   { date: "2026-11-17", venue: "Hemingway Lounge", city: "Karlsruhe", link: "https://..." },
   ========================================================== */
const GIGS = [
];

const MONTHS = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

function gigItem(gig, withLink) {
  const d = new Date(gig.date + "T12:00:00");
  const li = document.createElement("li");
  li.className = "gig";

  const date = document.createElement("time");
  date.className = "gig-date";
  date.dateTime = gig.date;
  date.innerHTML = `<span class="day">${d.getDate()}.</span><span class="month">${MONTHS[d.getMonth()]} ${d.getFullYear()}</span>`;

  const where = document.createElement("div");
  where.className = "gig-where";
  const venue = document.createElement("strong");
  venue.textContent = gig.venue;
  const city = document.createElement("span");
  city.textContent = gig.city;
  where.append(venue, city);

  li.append(date, where);

  if (withLink && gig.link) {
    const a = document.createElement("a");
    a.className = "gig-link";
    a.href = gig.link;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = "Tickets & Infos";
    li.append(a);
  }
  return li;
}

function renderGigs() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = GIGS.filter(g => new Date(g.date + "T23:59:59") >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  const past = GIGS.filter(g => new Date(g.date + "T23:59:59") < today)
    .sort((a, b) => b.date.localeCompare(a.date));

  const list = document.getElementById("gig-list");
  if (upcoming.length) {
    upcoming.forEach(g => list.append(gigItem(g, true)));
  } else {
    list.innerHTML = '<li class="gig-empty">Gerade stehen keine Termine fest. Wer uns buchen möchte: <a href="#kontakt">schreibt uns</a>.</li>';
  }

  if (past.length) {
    const pastList = document.getElementById("past-list");
    past.forEach(g => pastList.append(gigItem(g, false)));
    document.getElementById("past-wrap").hidden = false;
  }
}

/* ---------- Mobile Navigation ---------- */
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("nav");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  nav.addEventListener("click", e => {
    if (e.target.matches("a")) {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* ---------- Lightbox für die Live-Galerie ---------- */
function initLightbox() {
  const links = [...document.querySelectorAll("#gallery a")];
  const box = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  let index = 0;

  function show(i) {
    index = (i + links.length) % links.length;
    const thumb = links[index].querySelector("img");
    img.src = links[index].href;
    img.alt = thumb.alt;
  }

  links.forEach((link, i) => {
    link.addEventListener("click", e => {
      e.preventDefault();
      show(i);
      box.showModal();
    });
  });

  box.addEventListener("click", e => {
    if (e.target.dataset.dir) show(index + Number(e.target.dataset.dir));
    else if (e.target.matches(".lb-close") || e.target === box) box.close();
  });

  document.addEventListener("keydown", e => {
    if (!box.open) return;
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
}

document.getElementById("year").textContent = new Date().getFullYear();
renderGigs();
initNav();
initLightbox();
