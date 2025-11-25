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

    // Text Scramble Effect (Simple version)
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    document.querySelectorAll('.glitch-text').forEach(header => {
        let iterations = 0;
        const originalText = header.dataset.text;

        const interval = setInterval(() => {
            header.innerText = originalText.split("")
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
        }, 30);
    });
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

    // Video Scroll Scrubbing (Optimized with Lerp)
    const video = document.getElementById('bg-video');
    let targetTime = 0;

    // Ensure video metadata is loaded to get duration
    video.addEventListener('loadedmetadata', () => {
        video.pause();
    });

    // Update target time on scroll
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollFraction = Math.max(0, Math.min(1, scrollTop / docHeight));

        if (video.duration) {
            targetTime = video.duration * scrollFraction;
        }
    });

    // Render loop for smooth seeking (Lerp)
    function render() {
        if (video.duration) {
            // Linear interpolation: current = current + (target - current) * factor
            // 0.1 provides a nice smooth "weight" to the movement
            const diff = targetTime - video.currentTime;

            // Only update if the difference is significant to save resources
            if (Math.abs(diff) > 0.01) {
                video.currentTime += diff * 0.1;
            }
        }
        requestAnimationFrame(render);
    }

    // Start the loop
    requestAnimationFrame(render);
});
