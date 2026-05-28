/* =========================
   COREZEN MAIN SCRIPT
========================= */

const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".nav-links a");
const featureCards = document.querySelectorAll(".feature-card");
const heroButton = document.querySelector(".hero-btn");

/* =========================
   NAVBAR SCROLL EFFECT
========================= */

if (navbar) {
    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {
            navbar.style.background = "rgba(15, 23, 42, 0.98)";
            navbar.style.boxShadow = "0 5px 20px rgba(0,0,0,0.3)";
        }

        else {
            navbar.style.background = "rgba(15, 23, 42, 0.95)";
            navbar.style.boxShadow = "none";
        }

    });
}

/* =========================
   FEATURE CARD ANIMATION
========================= */

if (featureCards.length > 0) {

    const observer = new IntersectionObserver((entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add("show-card");
            }

        });

    }, {
        threshold: 0.15
    });

    featureCards.forEach((card) => {

        card.classList.add("hidden-card");
        observer.observe(card);

    });
}

/* =========================
   HERO BUTTON SMOOTH SCROLL
========================= */

if (heroButton) {

    heroButton.addEventListener("click", (event) => {

        const targetSection = document.querySelector("#features");

        if (!targetSection) {
            return;
        }

        event.preventDefault();

        targetSection.scrollIntoView({
            behavior: "smooth"
        });

    });
}

/* =========================
   FEATURE CARD HOVER GLOW
========================= */

featureCards.forEach((card) => {

    card.addEventListener("mousemove", (event) => {

        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        card.style.setProperty("--x", `${x}px`);
        card.style.setProperty("--y", `${y}px`);

    });

});

/* =========================
   ACTIVE NAV LINK
========================= */

const currentPage =
    window.location.pathname.split("/").pop()
    ||
    "index.html";

navLinks.forEach((link) => {

    const linkPage =
        link.getAttribute("href")
        .split("/")
        .pop();

    if (linkPage === currentPage) {
        link.classList.add("active-link");
    }

});

/* =========================
   LOADING ANIMATION
========================= */

window.addEventListener("load", () => {

    document.body.classList.add("loaded");

});

/* =========================
   DATA SUPPORT
========================= */

async function loadCoreZenData() {

    try {

        const dataPath =
            window.location.pathname.includes("/pages/")
            ? "../data.json"
            : "data.json";

        const response = await fetch(dataPath);

        if (!response.ok) {
            throw new Error("Failed to load data.json");
        }

        return await response.json();

    }

    catch (error) {

        return null;

    }

}

window.coreZenDataPromise = loadCoreZenData();

/* =========================
   MOBILE NAV TOGGLE
========================= */

if (navbar) {

    const mobileMenuButton = document.createElement("button");

    mobileMenuButton.classList.add("mobile-menu-button");
    mobileMenuButton.type = "button";
    mobileMenuButton.textContent = "☰";
    mobileMenuButton.setAttribute("aria-label", "Toggle navigation menu");

    navbar.appendChild(mobileMenuButton);

    mobileMenuButton.addEventListener("click", () => {

        const links = document.querySelector(".nav-links");

        if (links) {
            links.classList.toggle("mobile-active");
        }

    });
}
