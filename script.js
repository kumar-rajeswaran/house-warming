// --- Scroll Progress Bar ---
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";
});

// --- Sticky Navbar ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- Mobile Hamburger Menu ---
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const links = document.querySelectorAll('.nav-links li a');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when link is clicked
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// --- Scroll Reveal Animation ---
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 120; // slightly higher trigger point
        
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}
window.addEventListener('scroll', reveal);
// Trigger once on load
reveal();

// --- Countdown Timer ---
// Target Date: May 28, 2026 05:00:00
const targetDate = new Date("May 28, 2026 05:00:00").getTime();

const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        clearInterval(countdownInterval);
        document.getElementById("days").innerText = "00";
        document.getElementById("hours").innerText = "00";
        document.getElementById("minutes").innerText = "00";
        document.getElementById("seconds").innerText = "00";
        document.querySelector(".countdown-section .section-title").innerText = "The Joyous Day is Here!";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = days < 10 ? "0" + days : days;
    document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;
}, 1000);

// --- Button Ripple Effect ---
const buttons = document.querySelectorAll('.ripple');
buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Find existing ripples and remove them
        let existingRipples = this.querySelector('.ripple-span');
        if (existingRipples) {
            existingRipples.remove();
        }

        let x = e.clientX - e.target.getBoundingClientRect().left;
        let y = e.clientY - e.target.getBoundingClientRect().top;

        let ripples = document.createElement('span');
        ripples.classList.add('ripple-span');
        ripples.style.left = x + 'px';
        ripples.style.top = y + 'px';
        
        // Ensure size covers button
        const size = Math.max(this.clientWidth, this.clientHeight);
        ripples.style.width = ripples.style.height = size + 'px';
        
        // Offset to center ripple
        ripples.style.marginTop = -(size/2) + 'px';
        ripples.style.marginLeft = -(size/2) + 'px';

        this.appendChild(ripples);

        setTimeout(() => {
            ripples.remove();
        }, 600);
    });
});

// --- Add subtle floating particles to hero ---
const particlesContainer = document.getElementById('particles');
if (particlesContainer) {
    const particleCount = 20; // Number of floating dots
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Randomize position, size, and animation duration
        const size = Math.random() * 8 + 4; // 4px to 12px
        const left = Math.random() * 100; // 0% to 100%
        const duration = Math.random() * 10 + 10; // 10s to 20s
        const delay = Math.random() * 10; // 0s to 10s delay
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.top = '100%';
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        particlesContainer.appendChild(particle);
    }
}
