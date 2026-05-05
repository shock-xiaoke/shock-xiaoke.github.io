(function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const host = document.querySelector('[data-hero-glow]');
    if (!host) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config = {
        tile: 18,
        gap: 4,
        radius: 110,
        smoothness: 0.14,
        alpha: 0.32,
        color: '212, 255, 0'
    };

    let width = 0;
    let height = 0;
    let columns = 0;
    let rows = 0;
    let intensity = [];
    let mouse = { x: -9999, y: -9999 };

    canvas.className = 'hero-glow__canvas';
    host.appendChild(canvas);

    const resize = () => {
        width = host.clientWidth;
        height = host.clientHeight;
        canvas.width = width;
        canvas.height = height;
        columns = Math.ceil(width / (config.tile + config.gap));
        rows = Math.ceil(height / (config.tile + config.gap));
        intensity = new Float32Array(columns * rows).fill(0);
    };

    const drawTile = (x, y, size, alpha) => {
        ctx.fillStyle = `rgba(${config.color}, ${alpha})`;
        ctx.fillRect(x, y, size, size);
    };

    const loop = () => {
        if (window.innerWidth < 821) {
            ctx.clearRect(0, 0, width, height);
            requestAnimationFrame(loop);
            return;
        }

        ctx.clearRect(0, 0, width, height);
        const stride = config.tile + config.gap;

        for (let row = 0; row < rows; row += 1) {
            for (let col = 0; col < columns; col += 1) {
                const x = col * stride;
                const y = row * stride;
                const centerX = x + config.tile / 2;
                const centerY = y + config.tile / 2;
                const dx = mouse.x - centerX;
                const dy = mouse.y - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const index = row * columns + col;

                let target = 0;
                if (distance < config.radius) {
                    target = 1 - distance / config.radius;
                    target *= target;
                }

                intensity[index] += (target - intensity[index]) * config.smoothness;
                const alpha = intensity[index] * config.alpha;

                if (alpha > 0.012) drawTile(x, y, config.tile, alpha);
            }
        }

        requestAnimationFrame(loop);
    };

    const updateMouse = (clientX, clientY) => {
        const bounds = host.getBoundingClientRect();
        mouse.x = clientX - bounds.left;
        mouse.y = clientY - bounds.top;
    };

    const resetMouse = () => {
        mouse.x = -9999;
        mouse.y = -9999;
    };

    resize();
    loop();

    host.addEventListener('mousemove', event => updateMouse(event.clientX, event.clientY));
    host.addEventListener('mouseleave', resetMouse);
    window.addEventListener('resize', () => {
        resetMouse();
        resize();
    });
})();
