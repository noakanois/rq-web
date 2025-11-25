document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Smooth follow for outline
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Magnetic Button Effect
    const magneticLink = document.querySelector('.magnetic-link');

    magneticLink.addEventListener('mousemove', (e) => {
        const rect = magneticLink.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        magneticLink.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
    });

    magneticLink.addEventListener('mouseleave', () => {
        magneticLink.style.transform = 'translate(0px, 0px)';
    });

    // Text Scramble Effect (Periodic & Slower)
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    function runScramble(element) {
        let iterations = 0;
        const originalText = element.dataset.text;

        const interval = setInterval(() => {
            element.innerText = originalText.split("")
                .map((letter, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return letters[Math.floor(Math.random() * 26)]
                })
                .join("");

            if (iterations >= originalText.length) {
                clearInterval(interval);
            }

            iterations += 1 / 3;
        }, 60); // Slower speed (60ms)
    }

    const glitchHeaders = document.querySelectorAll('.glitch-text');

    // Run initially
    glitchHeaders.forEach(header => runScramble(header));

    // Run periodically every 10 seconds
    setInterval(() => {
        glitchHeaders.forEach(header => runScramble(header));
    }, 10000);
    // Scroll Reveal Effect
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.project-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 1s ease-out';
        observer.observe(section);
    });

    // Add visible class styles dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        .project-section.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Canvas Frame Sequence (High Performance)
    const canvas = document.getElementById('bg-canvas');
    const context = canvas.getContext('2d');
    const frameCount = 125;
    const currentFrame = index => `frames/frame_${index.toString().padStart(4, '0')}.jpg`;

    const images = [];
    const frameObj = { frame: 0 };
    let targetFrame = 0;

    // Preload images
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Draw Image with "object-fit: cover" logic
    function drawImage(img) {
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawWidth = canvas.height * imgRatio;
            drawHeight = canvas.height;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    // Initial draw
    images[0].onload = () => drawImage(images[0]);

    // Update target frame on scroll
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollFraction = Math.max(0, Math.min(1, scrollTop / docHeight));

        targetFrame = scrollFraction * (frameCount - 1);
    });

    // Render loop (Lerp)
    function render() {
        // Lerp frame index
        const diff = targetFrame - frameObj.frame;

        if (Math.abs(diff) > 0.01) {
            frameObj.frame += diff * 0.1;
            const frameIndex = Math.round(frameObj.frame);

            if (images[frameIndex] && images[frameIndex].complete) {
                drawImage(images[frameIndex]);
            }
        }

        requestAnimationFrame(render);
    }

    render();

    // Handle Resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const frameIndex = Math.round(frameObj.frame);
        if (images[frameIndex]) {
            drawImage(images[frameIndex]);
        }
    });
});
