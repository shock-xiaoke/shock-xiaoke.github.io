/* assets/js/grid-glow.js */

(function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');


    // --- 配置参数 (你可以根据喜好调整这里) ---
    const config = {
        tileSize: 15,
        gap: 1.75,
        radius: 50,        //稍微加大一点光圈
        baseAlpha: 0,    // 保持这一项，确保背景有隐约的纹理
        highlightAlpha: 0.7, // 鼠标靠近时最亮的透明度
        smoothness: 0.15,    // 渐变速度 (越大变色越快)
        color: '255, 255, 255', // 方块颜色 (白色)
        borderRadius: 4      // 圆角大小
    };

    const navBar = document.querySelector('.navbar');
    const footerEl = document.querySelector('footer');


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
        ctx.clearRect(0, 0, width, height);

        const totalSize = config.tileSize + config.gap;

        // 🔽 每一帧根据当前滚动位置计算：上边界 = 导航栏底部，下边界 = footer 顶部
        let activeTop = 0;
        let activeBottom = height;

        if (navBar) {
            const navRect = navBar.getBoundingClientRect();
            activeTop = navRect.bottom;   // 只在导航栏下面开始显示
        }

        if (footerEl) {
            const footerRect = footerEl.getBoundingClientRect();
            // 只有 footer 出现在视口内时才当作下边界，否则就让效果延伸到视口底部
            if (footerRect.top >= 0 && footerRect.top <= height) {
                activeBottom = footerRect.top;
            }
        }

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const x = c * totalSize + (config.gap / 2);
                const y = r * totalSize + (config.gap / 2);

                const centerX = x + config.tileSize / 2;
                const centerY = y + config.tileSize / 2;

                // 🔽 核心：如果当前小方块不在 activeTop ~ activeBottom 之间，就完全不画
                if (centerY <= activeTop || centerY >= activeBottom) {
                    continue;
                }

                // 下面保持你原来的距离计算 & 亮度过渡逻辑
                const dx = mouse.x - centerX;
                const dy = mouse.y - centerY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let targetIntensity = 0;
                if (dist < config.radius) {
                    targetIntensity = 1 - (dist / config.radius);
                    targetIntensity = Math.pow(targetIntensity, 2);
                } else {
                    targetIntensity = 0;
                }

                const tile = tiles[r][c];
                tile.intensity += (targetIntensity - tile.intensity) * config.smoothness;

                const alpha = config.baseAlpha +
                    tile.intensity * (config.highlightAlpha - config.baseAlpha);

                ctx.fillStyle = `rgba(${config.color}, ${alpha})`;
                drawRoundedRect(ctx, x, y, config.tileSize, config.tileSize, config.borderRadius);
                ctx.fill();
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