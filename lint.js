const falls = document.querySelectorAll('.fall, .fall2, .fall3, .fall4, .fall5');
const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');
const opacitySlider = document.getElementById('opacity-slider');
const opacityValue = document.getElementById('opacity-value');
const toggleFall1 = document.getElementById('toggle-fall1');
const toggleFall2 = document.getElementById('toggle-fall2');
const toggleFall3 = document.getElementById('toggle-fall3');
const toggleFall4 = document.getElementById('toggle-fall4');
const toggleFall5 = document.getElementById('toggle-fall5');
const toggleVideo = document.getElementById('toggle-video');
const toggleControls = document.getElementById('toggle-controls');
const videoPlayer = document.querySelector('.video-player');
const sfx1Button = document.getElementById('sfx1-button');
const sfx2Button = document.getElementById('sfx2-button');
const sfx1 = document.getElementById('sfx1');
const sfx2 = document.getElementById('sfx2');
const controls = document.querySelector('.controls');
const starCanvas = document.getElementById('star-dust');
const starCtx = starCanvas?.getContext('2d');
const cubeContainer = document.querySelector('.cube-container');

// Debug: Check if elements are found
if (!falls.length) console.error('No falls found');
if (!toggleFall1) console.error('toggle-fall1 not found');
if (!toggleFall2) console.error('toggle-fall2 not found');
if (!toggleFall3) console.error('toggle-fall3 not found');
if (!toggleFall4) console.error('toggle-fall4 not found');
if (!toggleFall5) console.error('toggle-fall5 not found');
if (!toggleVideo) console.error('toggle-video not found');
if (!toggleControls) console.error('toggle-controls not found');
if (!videoPlayer) console.error('video-player not found');
if (!sfx1Button) console.error('sfx1-button not found');
if (!sfx2Button) console.error('sfx2-button not found');
if (!sfx1) console.error('sfx1 not found');
if (!sfx2) console.error('sfx2 not found');
if (!starCanvas) console.error('star-dust not found');
if (!cubeContainer) console.error('cube-container not found');

// Star dust effect
if (starCanvas && starCtx) {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 9000;

    class Particle {
        constructor() {
            this.x = Math.random() * starCanvas.width;
            this.y = Math.random() * starCanvas.height;
            this.size = Math.random() * 4 + 1;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 15 + 8;
            this.speedX = Math.cos(angle) * speed;
            this.speedY = Math.sin(angle) * speed;
            this.opacity = 1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.speedX *= 0.88;
            this.speedY *= 0.88;
            this.opacity -= 0.004;
            if (this.size > 0.1) this.size -= 0.03;
        }

        draw() {
            const gradient = starCtx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
            gradient.addColorStop(1, `rgba(107, 63, 160, ${this.opacity * 0.5})`);
            starCtx.fillStyle = gradient;
            starCtx.beginPath();
            starCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            starCtx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    let startTime = Date.now();
    function animateStarDust() {
        if (Date.now() - startTime > 12000) {
            starCanvas.style.display = 'none';
            return;
        }
        starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
        starCtx.globalCompositeOperation = 'lighter';
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        starCtx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(animateStarDust);
    }
    animateStarDust();

    window.addEventListener('resize', () => {
        starCanvas.width = window.innerWidth;
        starCanvas.height = window.innerHeight;
    });
}

// Cube drag and high bounces with color and sound
if (cubeContainer) {
    const cube = cubeContainer.querySelector('.cube');
    const faces = cube.querySelectorAll('.face');
    let isDragging = false;
    let x = window.innerWidth * 0.5; // Center
    let y = window.innerHeight * 0.5;
    let vx = (Math.random() - 0.5) * 10; // Initial random velocity (-5 to 5)
    let vy = (Math.random() - 0.5) * 10;
    const bounce = 0.95; // High elasticity
    const cubeSize = 200;
    const minBounceVelocity = 5; // Ensure strong bounces

    function getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }

    function playBounceSound() {
        const sounds = [sfx1, sfx2];
        const sound = sounds[Math.floor(Math.random() * sounds.length)];
        sound.currentTime = 0;
        sound.play().catch(e => console.error('Bounce sound play error:', e));
    }

    function updateCube() {
        if (!isDragging) {
            // Update position with constant velocity
            x += vx;
            y += vy;

            // Bounce off all screen edges with color change and sound
            let bounced = false;
            if (x + cubeSize > window.innerWidth) {
                x = window.innerWidth - cubeSize;
                vx = -Math.max(Math.abs(vx) * bounce, minBounceVelocity);
                bounced = true;
            } else if (x < 0) {
                x = 0;
                vx = Math.max(Math.abs(vx) * bounce, minBounceVelocity);
                bounced = true;
            }
            if (y + cubeSize > window.innerHeight) {
                y = window.innerHeight - cubeSize;
                vy = -Math.max(Math.abs(vy) * bounce, minBounceVelocity);
                bounced = true;
            } else if (y < 0) {
                y = 0;
                vy = Math.max(Math.abs(vy) * bounce, minBounceVelocity);
                bounced = true;
            }

            if (bounced) {
                faces.forEach(face => {
                    face.style.backgroundImage = 'none';
                    face.style.backgroundColor = getRandomColor();
                });
                playBounceSound();
            }

            cubeContainer.style.transform = `translate(${x}px, ${y}px)`;
        }
        requestAnimationFrame(updateCube);
    }
    updateCube();

    cubeContainer.addEventListener('mousedown', (e) => {
        if (e.button === 0) { // Left click for dragging
            isDragging = true;
            const rect = cubeContainer.getBoundingClientRect();
            x = rect.left;
            y = rect.top;
            vx = 0; // Reset velocities
            vy = 0;
            cubeContainer.style.transform = `translate(${x}px, ${y}px)`;
        } else if (e.button === 2) { // Right click for rotation toggle
            e.preventDefault();
            const currentState = cube.style.animationPlayState || 'running';
            cube.style.animationPlayState = currentState === 'running' ? 'paused' : 'running';
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            x = e.clientX - cubeSize / 2;
            y = e.clientY - cubeSize / 2;
            cubeContainer.style.transform = `translate(${x}px, ${y}px)`;
            vx = 0; // Reset velocities while dragging
            vy = 0;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            // Apply random velocity on release
            vx = (Math.random() - 0.5) * 10;
            vy = (Math.random() - 0.5) * 10;
            isDragging = false;
        }
    });

    // Update boundaries on resize
    window.addEventListener('resize', () => {
        if (x + cubeSize > window.innerWidth) x = window.innerWidth - cubeSize;
        if (y + cubeSize > window.innerHeight) y = window.innerHeight - cubeSize;
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        cubeContainer.style.transform = `translate(${x}px, ${y}px)`;
    });
}

// Video player drag with default centered fixed position
if (videoPlayer) {
    let isDraggingVideo = false;
    let videoX = (window.innerWidth - videoPlayer.offsetWidth) / 2; // Center horizontally
    let videoY = (window.innerHeight - videoPlayer.offsetHeight) / 2; // Center vertically
    videoPlayer.style.position = 'fixed'; // Ensure fixed positioning
    videoPlayer.style.left = `${videoX}px`;
    videoPlayer.style.top = `${videoY}px`;

    videoPlayer.addEventListener('mousedown', (e) => {
        if (e.button === 0) { // Left click for dragging
            isDraggingVideo = true;
            const rect = videoPlayer.getBoundingClientRect();
            videoX = rect.left;
            videoY = rect.top;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDraggingVideo) {
            e.preventDefault();
            videoX = e.clientX - videoPlayer.offsetWidth / 2;
            videoY = e.clientY - videoPlayer.offsetHeight / 2;
            // Keep within window bounds
            videoX = Math.max(0, Math.min(videoX, window.innerWidth - videoPlayer.offsetWidth));
            videoY = Math.max(0, Math.min(videoY, window.innerHeight - videoPlayer.offsetHeight));
            videoPlayer.style.left = `${videoX}px`;
            videoPlayer.style.top = `${videoY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDraggingVideo) {
            isDraggingVideo = false;
        }
    });

    // Reset to center on double-click
    videoPlayer.addEventListener('dblclick', () => {
        videoX = (window.innerWidth - videoPlayer.offsetWidth) / 2;
        videoY = (window.innerHeight - videoPlayer.offsetHeight) / 2;
        videoPlayer.style.left = `${videoX}px`;
        videoPlayer.style.top = `${videoY}px`;
    });

    // Update position on resize
    window.addEventListener('resize', () => {
        if (!isDraggingVideo) {
            videoX = (window.innerWidth - videoPlayer.offsetWidth) / 2;
            videoY = (window.innerHeight - videoPlayer.offsetHeight) / 2;
            videoPlayer.style.left = `${videoX}px`;
            videoPlayer.style.top = `${videoY}px`;
        }
    });
}

if (speedSlider && speedValue) {
    speedSlider.addEventListener('input', () => {
        const speed = speedSlider.value;
        falls.forEach(fall => {
            fall.style.animationDuration = `${speed}s`;
        });
        speedValue.textContent = speed;
    });
}

if (opacitySlider && opacityValue) {
    opacitySlider.addEventListener('input', () => {
        const opacity = opacitySlider.value;
        falls.forEach(fall => {
            fall.style.opacity = opacity;
        });
        opacityValue.textContent = opacity;
    });
}

if (toggleFall1) {
    toggleFall1.addEventListener('click', () => {
        console.log('Toggle Fall 1 clicked');
        const fall = document.querySelector('.fall');
        if (fall) {
            const currentState = fall.style.animationPlayState || 'running';
            fall.style.animationPlayState = currentState === 'running' ? 'paused' : 'running';
            toggleFall1.textContent = `Toggle Fall 1 (Left) - ${currentState === 'running' ? 'Paused' : 'Running'}`;
        } else {
            console.error('Fall 1 element not found');
        }
    });
}

if (toggleFall2) {
    toggleFall2.addEventListener('click', () => {
        console.log('Toggle Fall 2 clicked');
        const fall = document.querySelector('.fall2');
        if (fall) {
            const currentState = fall.style.animationPlayState || 'running';
            fall.style.animationPlayState = currentState === 'running' ? 'paused' : 'running';
            toggleFall2.textContent = `Toggle Fall 2 (Right) - ${currentState === 'running' ? 'Paused' : 'Running'}`;
        } else {
            console.error('Fall 2 element not found');
        }
    });
}

if (toggleFall3) {
    toggleFall3.addEventListener('click', () => {
        console.log('Toggle Fall 3 clicked');
        const fall = document.querySelector('.fall3');
        if (fall) {
            const currentState = fall.style.animationPlayState || 'running';
            fall.style.animationPlayState = currentState === 'running' ? 'paused' : 'running';
            if (currentState === 'running') {
                fall.pause();
            } else {
                fall.play().catch(e => console.error('Fall 3 video play error:', e));
            }
            toggleFall3.textContent = `Toggle Fall 3 (Center) - ${currentState === 'running' ? 'Paused' : 'Running'}`;
        } else {
            console.error('Fall 3 element not found');
        }
    });
}

if (toggleFall4) {
    toggleFall4.addEventListener('click', () => {
        console.log('Toggle Fall 4 clicked');
        const fall = document.querySelector('.fall4');
        if (fall) {
            const currentState = fall.style.animationPlayState || 'running';
            fall.style.animationPlayState = currentState === 'running' ? 'paused' : 'running';
            if (currentState === 'running') {
                fall.pause();
            } else {
                fall.play().catch(e => console.error('Fall 4 video play error:', e));
            }
            toggleFall4.textContent = `Toggle Fall 4 (Left-Middle) - ${currentState === 'running' ? 'Paused' : 'Running'}`;
        } else {
            console.error('Fall 4 element not found');
        }
    });
}

if (toggleFall5) {
    toggleFall5.addEventListener('click', () => {
        console.log('Toggle Fall 5 clicked');
        const fall = document.querySelector('.fall5');
        if (fall) {
            const currentState = fall.style.animationPlayState || 'running';
            fall.style.animationPlayState = currentState === 'running' ? 'paused' : 'running';
            toggleFall5.textContent = `Toggle Fall 5 (Right-Middle) - ${currentState === 'running' ? 'Paused' : 'Running'}`;
        } else {
            console.error('Fall 5 element not found');
        }
    });
}

if (toggleVideo && videoPlayer) {
    toggleVideo.addEventListener('click', () => {
        console.log('Toggle Video clicked');
        if (videoPlayer.paused) {
            videoPlayer.play().catch(e => console.error('Video play error:', e));
            toggleVideo.textContent = 'Toggle Video - Playing';
        } else {
            videoPlayer.pause();
            toggleVideo.textContent = 'Toggle Video - Paused';
        }
    });
}

if (toggleControls) {
    toggleControls.addEventListener('click', () => {
        console.log('Toggle Controls clicked');
        controls.classList.toggle('toggles-hidden');
        toggleControls.textContent = controls.classList.contains('toggles-hidden') ? 'Show Toggles' : 'Hide Toggles';
    });
}

if (sfx1Button && sfx1) {
    sfx1Button.addEventListener('click', () => {
        console.log('SFX 1 button clicked');
        sfx1.currentTime = 0;
        sfx1.play().catch(e => console.error('SFX1 play error:', e));
    });
}

if (sfx2Button && sfx2) {
    sfx2Button.addEventListener('click', () => {
        console.log('SFX 2 button clicked');
        sfx2.currentTime = 0;
        sfx2.play().catch(e => console.error('SFX2 play error:', e));
    });
}