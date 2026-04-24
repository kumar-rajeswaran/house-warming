// --- Custom Cursor & Magnetic Effects (Load immediately) ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (cursorDot && cursorOutline) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;
    
    let lastMouseX = mouseX;
    let lastMouseY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    let currentScaleX = 1;
    let currentScaleY = 1;
    let currentAngle = 0;

    const loopCursor = () => {
        const dx = mouseX - outlineX;
        const dy = mouseY - outlineY;
        
        outlineX += dx * 0.15;
        outlineY += dy * 0.15;
        
        const distance = Math.sqrt(dx*dx + dy*dy);
        if (distance > 0.5 && !cursorOutline.classList.contains('hover')) {
            currentAngle = Math.atan2(dy, dx) * 180 / Math.PI;
        }
        
        let targetScaleX = 1;
        let targetScaleY = 1;
        
        if (cursorOutline.classList.contains('hover')) {
            targetScaleX = 1.5;
            targetScaleY = 1.5;
        } else {
            targetScaleX = Math.min(Math.max(1 + distance * 0.005, 1), 2);
            targetScaleY = Math.min(Math.max(1 - distance * 0.005, 0.5), 1);
        }
        
        currentScaleX += (targetScaleX - currentScaleX) * 0.15;
        currentScaleY += (targetScaleY - currentScaleY) * 0.15;
        
        cursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%, -50%) rotate(${currentAngle}deg) scale(${currentScaleX}, ${currentScaleY})`;
        
        requestAnimationFrame(loopCursor);
    };
    loopCursor();

    // Magnetic Effects
    document.addEventListener('DOMContentLoaded', () => {
        const magnetics = document.querySelectorAll('a, .btn, .gallery-item, .detail-card');
        magnetics.forEach(elem => {
            elem.addEventListener('mousemove', (e) => {
                const rect = elem.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                elem.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
                cursorOutline.classList.add('hover');
            });
            
            elem.addEventListener('mouseleave', () => {
                elem.style.transform = ``;
                cursorOutline.classList.remove('hover');
            });
        });
    });
}

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

// --- Initialize Lenis Smooth Scrolling ---
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// cursor logic moved to top

// --- Scroll Progress & Parallax ---
lenis.on('scroll', (e) => {

    
    // Magical 3D Flight Parallax Update
    const magicElements = document.querySelectorAll('.hero-content, .details-grid, .glass-card-3d, .story-card, .timeline-item, .section-title, .venue-details, .rsvp-card, .footer-content');
    magicElements.forEach(el => {
        // Calculate top accurately avoiding transform loop
        let top = 0;
        let current = el;
        while(current && current.tagName !== 'BODY') {
            top += current.offsetTop;
            current = current.offsetParent;
        }
        
        const center = top + el.offsetHeight / 2;
        const windowCenter = window.scrollY + window.innerHeight / 2;
        const offset = center - windowCenter;
        const normalized = offset / window.innerHeight;
        
        let scale = 1;
        let opacity = 1;
        let blur = 0;
        let y = 0;
        let rotateX = 0;
        
        // Deep 3D Flight Physics with Reading Deadzone
        const deadzone = 0.15; // 15% of screen height deadzone
        const distFromCenter = Math.abs(normalized);
        const activeNormalized = distFromCenter > deadzone ? (distFromCenter - deadzone) * Math.sign(normalized) : 0;
        
        if (activeNormalized > 0) { // Coming from deep space (bottom)
            scale = 1 - Math.min(activeNormalized * 0.6, 0.6);
            opacity = 1 - (activeNormalized * 2);
            y = activeNormalized * 100;
            rotateX = activeNormalized * 25;
        } else if (activeNormalized < 0) { // Flying past the camera (top)
            scale = 1 + Math.abs(activeNormalized) * 1.5;
            opacity = 1 - (Math.abs(activeNormalized) * 2.5);
            blur = Math.abs(activeNormalized) * 15;
        }
        
        opacity = Math.max(0, Math.min(1, opacity));
        
        el.style.transform = `perspective(1200px) translate3d(0, ${y}px, 0) scale(${scale}) rotateX(calc(${rotateX}deg + var(--tilt-x, 0deg))) rotateY(var(--tilt-y, 0deg))`;
        el.style.opacity = opacity;
        el.style.filter = `blur(${blur}px)`;
        el.style.willChange = 'transform, opacity, filter';
    });
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
        
        if (elementTop < windowHeight - elementVisible && !reveals[i].classList.contains('active')) {
            reveals[i].classList.add('active');
            setTimeout(() => {
                reveals[i].classList.add('revealed');
            }, 1000);
        }
    }
}
// Attach to lenis scroll loop for high-frequency updates
lenis.on('scroll', reveal);
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
            heroContent.style.setProperty('--tilt-y', xAxis + 'deg');
            heroContent.style.setProperty('--tilt-x', yAxis + 'deg');
        }
    });

    document.addEventListener('mouseleave', () => {
        if (heroContent) {
            heroContent.style.setProperty('--tilt-y', '0deg');
            heroContent.style.setProperty('--tilt-x', '0deg');
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
            
            el.style.setProperty('--tilt-x', rotateX + 'deg');
            el.style.setProperty('--tilt-y', rotateY + 'deg');
            
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
            el.style.setProperty('--tilt-x', '0deg');
            el.style.setProperty('--tilt-y', '0deg');
            
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

// --- Initialize Three.js Background ---
if (typeof THREE !== 'undefined') {
    const canvas = document.getElementById('three-canvas');
    if (canvas) {
        const scene = new THREE.Scene();
        
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Add Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffdf80, 1.5);
        dirLight.position.set(10, 20, 10);
        scene.add(dirLight);
        
        // Materials
        const goldMaterial = new THREE.MeshPhysicalMaterial({
            color: 0xd4af37,
            metalness: 0.8,
            roughness: 0.2,
            transmission: 0.1,
            transparent: true,
            opacity: 0.9,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        });
        
        const darkGreenMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x1f4d3a,
            metalness: 0.5,
            roughness: 0.4,
            clearcoat: 0.5
        });

        const shapes = [];

        // Add Floating Geometries
        const geometries = [
            new THREE.IcosahedronGeometry(1.5, 0),
            new THREE.OctahedronGeometry(1.2, 0)
        ];

        for(let i = 0; i < 40; i++) {
            const geo = geometries[Math.floor(Math.random() * geometries.length)];
            const mat = Math.random() > 0.4 ? goldMaterial : darkGreenMaterial;
            const mesh = new THREE.Mesh(geo, mat);
            
            mesh.position.set(
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 40,
                (Math.random() - 1) * 100
            );
            
            mesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                0
            );
            
            mesh.userData = {
                rx: (Math.random() - 0.5) * 0.02,
                ry: (Math.random() - 0.5) * 0.02,
                rz: (Math.random() - 0.5) * 0.02
            };
            
            scene.add(mesh);
            shapes.push(mesh);
        }
        
        // Add Dense Particle Field (Tunnel feel)
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 1500;
        const posArray = new Float32Array(particlesCount * 3);
        
        for(let i = 0; i < particlesCount * 3; i+=3) {
            const radius = 5 + Math.random() * 30;
            const theta = Math.random() * Math.PI * 2;
            posArray[i] = Math.cos(theta) * radius; // x
            posArray[i+1] = Math.sin(theta) * radius; // y
            posArray[i+2] = (Math.random() - 1) * 150; // z
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.12,
            color: 0xd4af37,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;
        
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX) * 0.05;
            mouseY = (event.clientY - windowHalfY) * 0.05;
        });

        // Animation Loop
        const clock = new THREE.Clock();
        
        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Camera Z follows scroll
            const scrollZ = window.scrollY * 0.03;
            camera.position.z = 30 - scrollZ;

            shapes.forEach(shape => {
                shape.rotation.x += shape.userData.rx;
                shape.rotation.y += shape.userData.ry;
                shape.rotation.z += shape.userData.rz;
                
                // Infinite loop
                if (shape.position.z > camera.position.z + 10) {
                    shape.position.z -= 100;
                }
            });
            
            // Loop particles
            const positions = particlesGeometry.attributes.position.array;
            for(let i=2; i<particlesCount*3; i+=3) {
                if(positions[i] > camera.position.z + 10) {
                    positions[i] -= 150;
                }
            }
            particlesGeometry.attributes.position.needsUpdate = true;
            
            particlesMesh.rotation.z = elapsedTime * 0.05;

            // Camera ease movement (Igloo style extreme follow)
            targetX = mouseX * 2.0;
            targetY = mouseY * 2.0;
            
            camera.position.x += (targetX - camera.position.x) * 0.05;
            camera.position.y += (-targetY - camera.position.y) * 0.05;
            camera.lookAt(camera.position.x, camera.position.y, camera.position.z - 50);

            renderer.render(scene, camera);
        }

        animate();

        // Handle Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
}
