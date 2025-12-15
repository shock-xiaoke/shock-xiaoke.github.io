/* assets/js/cursor-glow.js */

(function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Configuration
    const config = {
        particleCount: 25,     // Number of blocks in the cluster
        baseSize: 6,           // Size of the blocks
        spread: 40,            // Radius of the loose cluster
        smoothness: 0.12,      // Movement delay (lower = slower/smoother)
        color: '255, 255, 255',// RGB of the blocks
    };

    // State
    let width, height;
    let particles = [];
    const mouse = { x: -1000, y: -1000 }; // Start off-screen

    // Setup Canvas
    canvas.id = 'cursor-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none'; // Click-through
    canvas.style.zIndex = '9999';        // Sit on top of everything
    canvas.style.mixBlendMode = 'overlay'; // Blend nicely with dark bg
    document.body.appendChild(canvas);

    // Particle Class
    class Particle {
        constructor() {
            this.x = 0;
            this.y = 0;
            // Target offset from mouse center
            this.ox = (Math.random() - 0.5) * config.spread;
            this.oy = (Math.random() - 0.5) * config.spread;
            // Slight size variation
            this.size = config.baseSize + (Math.random() * 4);
            // Slight speed variation for depth effect
            this.friction = config.smoothness + (Math.random() * 0.05);
            // Opacity based on distance (simulated here via random for setup)
            this.alpha = 0;
        }

        update() {
            // Calculate target position (Mouse + Offset)
            const targetX = mouse.x + this.ox;
            const targetY = mouse.y + this.oy;

            // LERP (Linear Interpolation) for smooth following
            this.x += (targetX - this.x) * this.friction;
            this.y += (targetY - this.y) * this.friction;

            // Calculate distance to true mouse center for glow intensity
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Bright near center, fade out near edges
            // Max distance is roughly config.spread / 2
            this.alpha = 1 - Math.min(dist / (config.spread * 0.8), 1);
        }

        draw() {
            ctx.fillStyle = `rgba(${config.color}, ${this.alpha * 0.8})`;
            ctx.shadowBlur = 10 * this.alpha; // Glow effect
            ctx.shadowColor = `rgba(${config.color}, ${this.alpha})`;

            ctx.beginPath();
            // Draw Rounded Rectangle manually
            const s = this.size;
            const r = 2; // Corner radius
            const x = this.x - s / 2;
            const y = this.y - s / 2;

            ctx.moveTo(x + r, y);
            ctx.arcTo(x + s, y, x + s, y + s, r);
            ctx.arcTo(x + s, y + s, x, y + s, r);
            ctx.arcTo(x, y + s, x, y, r);
            ctx.arcTo(x, y, x + s, y, r);
            ctx.closePath();

            ctx.fill();
        }
    }

    // Initialization
    function init() {
        resize();
        // Create Particles
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
        loop();
    }

    // Render Loop
    function loop() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(loop);
    }

    // Event Listeners
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('resize', resize);

    // Start
    init();

})();