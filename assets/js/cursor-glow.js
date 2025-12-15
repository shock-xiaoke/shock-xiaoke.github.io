/* assets/js/grid-glow.js */

(function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // --- 配置参数 (你可以根据喜好调整这里) ---
    const config = {
        tileSize: 40,        // 方块大小
        gap: 2,              // 间隙 (改小一点，让方块更密集)
        radius: 250,         // 鼠标影响的半径 (光晕大小)
        baseAlpha: 0.05,     // 闲置时的透明度 (0.05 会有隐约的纹理，设为 0 则完全隐形)
        highlightAlpha: 0.5, // 鼠标靠近时最亮的透明度
        smoothness: 0.15,    // 渐变速度 (越大变色越快)
        color: '255, 255, 255', // 方块颜色 (白色)
        borderRadius: 4      // 圆角大小
    };

    let width, height;
    let cols, rows;
    let mouse = { x: -1000, y: -1000 };

    // 存储每个方块当前的亮度状态
    let tiles = [];

    // 设置 Canvas
    canvas.id = 'grid-glow-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none'; // 让鼠标点击能穿透 Canvas

    // --- 关键修改：Z-Index ---
    // 原来是 -1，被 body 背景遮挡了。改为 0。
    // 因为你的 CSS 中 section 是 z-index: 1，所以文字依然会浮在方块上面。
    canvas.style.zIndex = '0';

    document.body.appendChild(canvas);

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        cols = Math.ceil(width / (config.tileSize + config.gap));
        rows = Math.ceil(height / (config.tileSize + config.gap));

        // 初始化所有方块亮度为 0
        tiles = new Float32Array(cols * rows).fill(0);
    }

    function drawRoundedRect(x, y, w, h, r) {
        ctx.beginPath();
        // 简单的圆角矩形绘制优化
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
    }

    function loop() {
        // 清空画布 (这一步会让之前的帧消失，露出 body 的深蓝背景)
        ctx.clearRect(0, 0, width, height);

        const totalSize = config.tileSize + config.gap;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {

                const x = c * totalSize + (config.gap / 2);
                const y = r * totalSize + (config.gap / 2);

                // 计算鼠标距离
                const centerX = x + config.tileSize / 2;
                const centerY = y + config.tileSize / 2;
                const dx = mouse.x - centerX;
                const dy = mouse.y - centerY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // 计算目标亮度 (0.0 到 1.0)
                let targetIntensity = 0;
                if (dist < config.radius) {
                    // 距离越近越亮
                    targetIntensity = 1 - (dist / config.radius);
                    // 使用平方让光晕边缘更柔和
                    targetIntensity = Math.pow(targetIntensity, 2);
                }

                // 平滑动画 (Lerp)
                const index = r * cols + c;
                let currentIntensity = tiles[index];
                currentIntensity += (targetIntensity - currentIntensity) * config.smoothness;
                tiles[index] = currentIntensity;

                // 渲染逻辑
                // baseAlpha 是基础亮度，currentIntensity * (差值) 是增量
                const visibleAlpha = config.baseAlpha + (currentIntensity * (config.highlightAlpha - config.baseAlpha));

                // 只有当透明度大于 0.01 时才绘制，节省性能
                if (visibleAlpha > 0.01) {
                    ctx.fillStyle = `rgba(${config.color}, ${visibleAlpha})`;
                    drawRoundedRect(x, y, config.tileSize, config.tileSize, config.borderRadius);
                    ctx.fill();
                }
            }
        }

        requestAnimationFrame(loop);
    }

    // 事件监听
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    // 启动
    resize();
    loop();

})();