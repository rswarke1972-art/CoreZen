/* =========================
   COREZEN MAIN SCRIPT
========================= */

console.log("CoreZen Loaded Successfully");

/* =========================
   NAVBAR SCROLL EFFECT
========================= */

const navbar = document.querySelector(".navbar");

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

/* =========================
   FEATURE CARD ANIMATION
========================= */

const featureCards = document.querySelectorAll(".feature-card");

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

/* =========================
   HERO BUTTON SMOOTH SCROLL
========================= */

const heroButton = document.querySelector(".hero-btn");

heroButton.addEventListener("click", (event) => {

    event.preventDefault();

    const targetSection = document.querySelector("#features");

    targetSection.scrollIntoView({
        behavior: "smooth"
    });

});

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

const navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach((link) => {

    link.addEventListener("click", () => {

        navLinks.forEach((nav) => {
            nav.classList.remove("active-link");
        });

        link.classList.add("active-link");

    });

});

/* =========================
   LOADING ANIMATION
========================= */

window.addEventListener("load", () => {

    document.body.classList.add("loaded");

});

/* =========================
   TEMPORARY FEATURE ALERTS
========================= */

const featureButtons = document.querySelectorAll(".feature-card a");

featureButtons.forEach((button) => {

    button.addEventListener("click", () => {

        console.log("Opening Feature Page...");

    });

});

/* =========================
   FUTURE DATA.JSON SUPPORT
========================= */

async function loadCoreZenData() {

    try {

        const response = await fetch("data.json");

        if (!response.ok) {
            throw new Error("Failed to load data.json");
        }

        const data = await response.json();

        console.log("CoreZen Data Loaded:", data);

    }

    catch (error) {

        console.error("Error Loading Data:", error);

    }

}

loadCoreZenData();

/* =========================
   MOBILE NAV TOGGLE
========================= */

const mobileMenuButton = document.createElement("div");

mobileMenuButton.classList.add("mobile-menu-button");

mobileMenuButton.innerHTML = "☰";

document.querySelector(".navbar").appendChild(mobileMenuButton);

mobileMenuButton.addEventListener("click", () => {

    document.querySelector(".nav-links").classList.toggle("mobile-active");

});

/* =========================
   SIMPLE WELCOME MESSAGE
========================= */

setTimeout(() => {

    console.log("Welcome to CoreZen 💪🧘");

}, 1000);