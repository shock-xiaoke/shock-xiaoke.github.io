/* assets/js/grid-glow.js */

(function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // --- CONFIGURATION ---
    const config = {
        tileSize: 40,        // Size of each grid square (px)
        gap: 4,              // Gap between squares (px)
        radius: 350,         // Radius of the glow effect around cursor
        baseAlpha: 0.03,     // Opacity of tiles when idle (barely visible)
        highlightAlpha: 0.6, // Opacity of tiles when fully lit (white)
        smoothness: 0.1,     // Speed of fade (lower = slower/smoother trail)
        color: '255, 255, 255', // RGB of the blocks
        borderRadius: 4      // Corner roundness
    };

    let width, height;
    let cols, rows;
    let mouse = { x: -1000, y: -1000 };

    // We store the current "brightness" of every tile here
    // to allow for smooth fading animations.
    let tiles = [];

    // Setup Canvas
    canvas.id = 'grid-glow-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none'; // Allow clicks to pass through
    canvas.style.zIndex = '-1';          // Sit BEHIND content
    document.body.appendChild(canvas);

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        // Calculate grid dimensions
        cols = Math.ceil(width / (config.tileSize + config.gap));
        rows = Math.ceil(height / (config.tileSize + config.gap));

        // Initialize tile states (brightness 0 initially)
        tiles = new Float32Array(cols * rows).fill(0);
    }

    function drawRoundedRect(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    function loop() {
        // Clear screen
        ctx.clearRect(0, 0, width, height);

        const totalSize = config.tileSize + config.gap;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {

                // Calculate position
                const x = c * totalSize + (config.gap / 2);
                const y = r * totalSize + (config.gap / 2);

                // Calculate Distance to Mouse
                // We use center of tile for accuracy
                const centerX = x + config.tileSize / 2;
                const centerY = y + config.tileSize / 2;
                const dx = mouse.x - centerX;
                const dy = mouse.y - centerY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Calculate Target Intensity (0.0 to 1.0)
                let targetIntensity = 0;
                if (dist < config.radius) {
                    // Map distance to intensity (Close = 1, Edge of radius = 0)
                    targetIntensity = 1 - (dist / config.radius);
                    // Make it fall off non-linearly for a nicer "glow" curve
                    targetIntensity = Math.pow(targetIntensity, 2);
                }

                // Smooth Animation (Linear Interpolation)
                // Get current brightness from our array
                const index = r * cols + c;
                let currentIntensity = tiles[index];

                // Lerp towards target
                currentIntensity += (targetIntensity - currentIntensity) * config.smoothness;

                // Update state
                tiles[index] = currentIntensity;

                // Render
                // Optimization: Don't draw if it's practically invisible (and close to baseAlpha)
                const visibleAlpha = config.baseAlpha + (currentIntensity * (config.highlightAlpha - config.baseAlpha));

                if (visibleAlpha > 0.01) {
                    ctx.fillStyle = `rgba(${config.color}, ${visibleAlpha})`;
                    drawRoundedRect(x, y, config.tileSize, config.tileSize, config.borderRadius);
                    ctx.fill();
                }
            }
        }

        requestAnimationFrame(loop);
    }

    // Event Listeners
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // Start
    resize();
    loop();

})();