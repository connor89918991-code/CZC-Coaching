// Mobile navigation behavior
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
const topbar = document.querySelector(".topbar");
const pageSections = document.querySelectorAll("main section[id]");

const closeMenu = () => {
  if (!menuToggle || !navLinks) {
    return;
  }

  navLinks.classList.remove("open");
  menuToggle.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
};

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  navAnchors.forEach((anchor) => {
    anchor.addEventListener("click", closeMenu);
  });
}

const updateNavState = () => {
  if (topbar) {
    topbar.classList.toggle("scrolled", window.scrollY > 24);
  }

  let currentSectionId = "";

  pageSections.forEach((section) => {
    const sectionTop = section.offsetTop - 140;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
      currentSectionId = section.id;
    }
  });

  navAnchors.forEach((anchor) => {
    const targetId = anchor.getAttribute("href")?.slice(1);
    anchor.classList.toggle("active", targetId === currentSectionId);
  });
};

// Scroll reveal animation for premium section entrances
const revealElements = document.querySelectorAll(".reveal");
const interactiveCards = document.querySelectorAll(".interactive-card");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -6% 0px",
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

// Front-end application form feedback
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");

if (contactForm && formMessage) {
  contactForm.addEventListener("submit", (event) => {
    const isExternalFormSubmit =
      contactForm.action.includes("formsubmit.co");

    if (!isExternalFormSubmit) {
      event.preventDefault();
      formMessage.textContent =
        "Application received. We will review your details and reach out soon.";
      contactForm.reset();
      return;
    }

    formMessage.textContent = "Sending application...";
  });
}

// Close the mobile menu if the viewport expands beyond mobile layout
window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    closeMenu();
  }
});

window.addEventListener("scroll", updateNavState, { passive: true });
window.addEventListener("load", updateNavState);

// Subtle pointer-based lift effect for premium cards
interactiveCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (window.innerWidth <= 760) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const rotateY = ((offsetX / rect.width) - 0.5) * 5;
    const rotateX = (((offsetY / rect.height) - 0.5) * -5);

    card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});
