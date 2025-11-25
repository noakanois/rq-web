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

    // Glitch Morph Background
    const canvas = document.getElementById('bg-canvas');
    const context = canvas.getContext('2d');

    // Image Paths
    const imagePaths = [
        'pics/kanoi_a_window_into_knowledge_big_square_frame_58c9371b-7a9b-413f-baf1-215b538c9bbc.png',
        'pics/kanoi_a_window_into_super_intelligence_arctic_galaxy_700b15ce-67d5-43b3-8d05-98ebc7e3d589.png',
        'pics/kanoi_a_window_into_super_intelligence_arctic_galaxy_b742164f-adcf-4162-955b-35e53954292b.png',
        'pics/kanoi_square_window_into_knowledge_humanity_snowy_mountains_e39b3216-b52d-49d7-bf4b-d4a6f2ca7c27.png'
    ];

    // Shuffle Images
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    shuffle(imagePaths);

    const images = [];
    let loadedCount = 0;

    // Preload images
    imagePaths.forEach(path => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            loadedCount++;
            if (loadedCount === 1) drawImageCover(images[0]); // Draw first immediately
        };
        images.push(img);
    });

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Helper to draw image cover
    function drawImageCover(img, opacity = 1, xOffset = 0) {
        if (!img) return;
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

        context.globalAlpha = opacity;
        context.drawImage(img, offsetX + xOffset, offsetY, drawWidth, drawHeight);
        context.globalAlpha = 1.0;
    }

    // Scroll State
    let scrollProgress = 0;
    let targetProgress = 0;
    const totalSections = 6; // We have 6 sections now

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollFraction = Math.max(0, Math.min(1, scrollTop / docHeight));

        // Map scroll to total section range (0 to 5)
        targetProgress = scrollFraction * (totalSections - 1);
    });

    // Render Loop (Glitch Morph)
    function render() {
        // Lerp progress
        const diff = targetProgress - scrollProgress;
        if (Math.abs(diff) > 0.001) {
            scrollProgress += diff * 0.1;
        }

        // Calculate cyclic indices
        const sectionIndex = Math.floor(scrollProgress);
        const imgIndex = sectionIndex % images.length;
        const nextImgIndex = (sectionIndex + 1) % images.length;

        // Progress within the current section transition (0.0 to 1.0)
        const progress = scrollProgress - sectionIndex;

        context.clearRect(0, 0, canvas.width, canvas.height);

        // If static (or near static)
        if (progress < 0.05) {
            drawImageCover(images[imgIndex]);
        } else if (progress > 0.95) {
            drawImageCover(images[nextImgIndex]);
        } else {
            // GLITCH TRANSITION
            const strips = 20;
            const stripHeight = canvas.height / strips;

            for (let i = 0; i < strips; i++) {
                const y = i * stripHeight;
                // Random offset based on progress (peak at 0.5)
                const glitchIntensity = Math.sin(progress * Math.PI) * 100;
                const randomOffset = (Math.random() - 0.5) * glitchIntensity;

                // Save context for clipping
                context.save();
                context.beginPath();
                context.rect(0, y, canvas.width, stripHeight);
                context.clip();

                // Draw Image A (fading out, shifting left)
                drawImageCover(images[imgIndex], 1 - progress, randomOffset);

                // Draw Image B (fading in, shifting right)
                drawImageCover(images[nextImgIndex], progress, -randomOffset);

                context.restore();
            }

            // Add some random color noise bars
            if (Math.random() > 0.7) {
                context.fillStyle = Math.random() > 0.5 ? '#00ffcc' : '#ff00c1';
                context.fillRect(0, Math.random() * canvas.height, canvas.width, 2);
            }

            // TV Static Noise
            if (Math.random() > 0.8) {
                const noiseX = Math.random() * canvas.width;
                const noiseY = Math.random() * canvas.height;
                const noiseW = Math.random() * 200;
                const noiseH = Math.random() * 50;
                context.fillStyle = 'rgba(255, 255, 255, 0.1)';
                context.fillRect(noiseX, noiseY, noiseW, noiseH);
            }
        }

        requestAnimationFrame(render);
    }
    render();

    // Handle Resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // Typewriter Effect for Scroll Snap
    const typeWriterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const desc = entry.target.querySelector('.project-desc');
                if (desc && !desc.dataset.typed) {
                    const text = desc.innerText;
                    desc.innerText = '';
                    desc.dataset.typed = 'true';

                    let i = 0;
                    function type() {
                        if (i < text.length) {
                            desc.innerText += text.charAt(i);
                            i++;
                            setTimeout(type, 20);
                        }
                    }
                    type();
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.project-section').forEach(section => {
        const desc = section.querySelector('.project-desc');
        if (desc) {
            desc.dataset.originalText = desc.innerText;
        }
        typeWriterObserver.observe(section);
    });
});
