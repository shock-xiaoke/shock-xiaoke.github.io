/* assets/js/grid-glow.js */

(function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // --- 配置参数 (你可以根据喜好调整这里) ---
    const config = {
        tileSize: 12,
        gap: 1.55,
        radius: 50,        //稍微加大一点光圈
        baseAlpha: 0,    // 保持这一项，确保背景有隐约的纹理
        highlightAlpha: 0.55, // 鼠标靠近时最亮的透明度
        smoothness: 0.2,    // 渐变速度 (越大变色越快)
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

    // --- 关键修改：让 Canvas 浮在最上面，但不可点击 ---
    // 改为极高的层级，确保不被 section 遮挡
    canvas.style.zIndex = '9999';
    // 混合模式：Screen (滤色) 会让黑色透明，白色发光，效果最好
    canvas.style.mixBlendMode = 'screen';
    // 确保鼠标事件能穿透 Canvas 到达下面的按钮和链接
    canvas.style.pointerEvents = 'none';

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

    // Zones (nav/footer) where glow should be suppressed
    const noGlowZones = ['nav', 'footer', '.navbar'];
    const isInNoGlowZone = target => {
        if (!target || typeof target.closest !== 'function') return false;
        return noGlowZones.some(sel => target.closest(sel));
    };
    const resetMouse = () => {
        mouse.x = -1000;
        mouse.y = -1000;
    };

    // 事件监听
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => {
        if (isInNoGlowZone(e.target)) {
            resetMouse();
            return;
        }
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', resetMouse);

    // 启动
    resize();
    loop();

})();
