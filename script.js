document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a:not(.theme-toggle)');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // testimonial slider logic removed since testimonials section was deleted

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animateElements.forEach(element => {
        observer.observe(element);
        // Immediate fallback check
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            element.classList.add('visible');
            observer.unobserve(element);
        }
    });

    // Dark Mode Toggle Logic
    const themeToggleChk = document.getElementById('theme-toggle-chk');

    if (themeToggleChk) {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme) {
            document.body.classList.add(currentTheme);
            if (currentTheme === 'dark-mode') {
                themeToggleChk.checked = true;
            }
        }

        themeToggleChk.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.removeItem('theme');
            }
        });
    }

    // Contact Form Logic (Mailto)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;

            btn.textContent = 'Preparing email...';
            btn.disabled = true;

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

            // Redirect to mailto link
            window.location.href = `mailto:mitchellesalazar33@gmail.com?subject=${subject}&body=${body}`;

            setTimeout(() => {
                btn.textContent = 'Email App Opened!';
                btn.style.backgroundColor = '#10b981';
                btn.style.color = 'white';
                btn.style.borderColor = '#10b981';

                contactForm.reset();

                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style = '';
                }, 3000);
            }, 1000);
        });
    }
    // Magnetic Navbar Links
    const navButtons = document.querySelectorAll('.nav-links a:not(.theme-toggle), .hire-me');

    navButtons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Subtle magnetic pull
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) translateY(-3px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0, 0)`;
        });
    });

    // Helper function for 3D interactions (Mouse & Touch)
    const init3DInteraction = (container, item, isHero) => {
        if (!container || !item) return;

        const setTransform = (x, y, rect) => {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            let rotateX, rotateY;
            if (isHero) {
                // Hero: Tilt Away
                rotateX = (y - centerY) / 20;
                rotateY = (centerX - x) / 20;
                item.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            } else {
                // About: Tilt Towards (Inverted)
                rotateX = (centerY - y) / 25;
                rotateY = (x - centerX) / 25;
                item.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            }
            item.style.animation = 'none';
        };

        const resetTransform = () => {
            if (isHero) {
                item.style.transform = `rotateX(0deg) rotateY(0deg)`;
                item.style.animation = 'floating 6s ease-in-out infinite';
            } else {
                item.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
                item.style.animation = 'breathing 8s ease-in-out infinite';
            }
        };

        // Mouse Events
        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setTransform(x, y, rect);
        });

        container.addEventListener('mouseleave', resetTransform);

        // Touch Events (for Phone/Tablet)
        container.addEventListener('touchmove', (e) => {
            // Prevent scrolling while interacting with the 3D element if desired, 
            // but usually we just want the effect.
            const touch = e.touches[0];
            const rect = container.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;

            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                e.preventDefault(); // Prevents jittery scroll during interaction
                setTransform(x, y, rect);
            }
        }, { passive: false });

        container.addEventListener('touchend', resetTransform);
    };

    // Initialize Hero Interaction
    init3DInteraction(
        document.querySelector('.hero-image'),
        document.querySelector('.hero-image .geometric-frame'),
        true
    );

    // Initialize About Interaction
    init3DInteraction(
        document.querySelector('.about-image'),
        document.querySelector('.about-3d-card'),
        false
    );

    // Video Modal Controller
    const openVideoBtn = document.getElementById('open-video');
    const videoModal = document.getElementById('video-modal');
    const closeModal = document.querySelector('.close-modal');
    const heroVideo = document.getElementById('hero-video');

    if (openVideoBtn && videoModal) {
        openVideoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            videoModal.classList.add('active');
            heroVideo.play();
        });

        const closeFunc = () => {
            videoModal.classList.remove('active');
            heroVideo.pause();
            heroVideo.currentTime = 0;
        };

        closeModal.addEventListener('click', closeFunc);

        // Close on overlay click
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeFunc();
        });
    }

});

