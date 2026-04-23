// --- 3D Envelope Intro ---
document.body.style.overflow = 'hidden';

const envelopeWrapper = document.querySelector('.envelope-wrapper');
const introOverlay = document.getElementById('invitation-intro');
const mainContent = document.getElementById('main-content');

if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', () => {
        envelopeWrapper.classList.add('is-open');
        
        // After envelope animation completes
        setTimeout(() => {
            introOverlay.classList.add('hidden');
            mainContent.classList.remove('main-content-hidden');
            mainContent.classList.add('main-content-visible');
            document.body.style.overflow = 'auto';
            
            // Trigger scroll reveal for the hero section
            reveal();
            
            // Remove intro from DOM after transition
            setTimeout(() => {
                introOverlay.style.display = 'none';
            }, 1500);
            
        }, 2000); // 2 seconds after click
    });
}

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

links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// --- 3D Scroll Reveal Animation (Unfold Effect) ---
function reveal() {
    const reveals = document.querySelectorAll('.reveal-3d');
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}
window.addEventListener('scroll', reveal);
reveal();

// --- Countdown Timer ---
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
        const title = document.querySelector(".countdown-section .section-title");
        if(title) title.innerText = "The Joyous Day is Here!";
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


// --- 3D Mouse Parallax for Hero ---
const heroContent = document.querySelector('.hero-content');
const heroParticles = document.querySelectorAll('.shape-3d');

// Only run on desktop
if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 40;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 40;
        
        if (heroContent) {
            heroContent.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        }
        
        heroParticles.forEach((shape, index) => {
            const speed = (index + 1) * 0.3;
            const x = (window.innerWidth - e.pageX * speed) / 100;
            const y = (window.innerHeight - e.pageY * speed) / 100;
            
            shape.style.transform = `translate3d(${x}px, ${y}px, ${speed * 50}px) rotateX(${yAxis * speed}deg) rotateY(${xAxis * speed}deg)`;
        });
    });

    document.addEventListener('mouseleave', () => {
        if (heroContent) {
            heroContent.style.transform = `rotateY(0deg) rotateX(0deg)`;
        }
    });
}

// --- Custom 3D Tilt Effect for Cards ---
const tiltElements = document.querySelectorAll('.glass-card-3d, .gallery-item');

if (window.innerWidth > 768) {
    tiltElements.forEach(el => {
        
        const popupElements = el.querySelectorAll('.popup-text, .popup-text-high');
        
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Limit rotation to avoid breaking text flow
            const rotateX = ((y - centerY) / centerY) * -10; 
            const rotateY = ((x - centerX) / centerX) * 10;
            
            el.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            el.style.transition = 'none';
            
            // Push inner elements outwards
            popupElements.forEach(child => {
                if(child.classList.contains('popup-text-high')) {
                    child.style.transform = 'translateZ(90px)';
                } else {
                    child.style.transform = 'translateZ(60px)';
                }
            });
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            el.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
            
            popupElements.forEach(child => {
                if(child.classList.contains('popup-text-high')) {
                    child.style.transform = 'translateZ(70px)';
                } else {
                    child.style.transform = 'translateZ(40px)';
                }
            });
        });
    });
}
