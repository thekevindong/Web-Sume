// Theme toggle functionality
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const button = document.getElementById('themeToggle');
    if (document.body.classList.contains('light-mode')) {
        button.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
    } else {
        button.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
    }
}

// Preloader animation
document.addEventListener('DOMContentLoaded', () => {
    const text = "Welcome to WebSumé";
    const welcomeText = document.querySelector('.welcome-text');
    const mainContent = document.querySelector('.main-content');
    const preloader = document.querySelector('.preloader');

    // Create spans for each letter
    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        welcomeText.appendChild(span);
    });

    // Animate each letter
    const spans = welcomeText.querySelectorAll('span');
    spans.forEach((span, index) => {
        setTimeout(() => {
            span.classList.add('animate');
        }, 100 * index);
    });

    // Fade out preloader and show main content
    setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
            mainContent.classList.add('show');
        }, 500);
    }, 100 * text.length + 1000);

    setRandomTumbleweedShapes();

    // Randomize shapes again every time the tumbleweed completes a roll
    setInterval(setRandomTumbleweedShapes, 20000); // 20 seconds matches the roll animation

    // Initialize course popover after main content is set up
    initCoursePopover();
});

function setRandomTumbleweedShapes() {
    const elements = document.querySelectorAll('.tumbleweed *::before, .tumbleweed *::after, .tumbleweed::before');

    elements.forEach(element => {
        // Random size between 60% and 95%
        const randomSize = Math.floor(Math.random() * (95 - 60) + 60) + '%';
        // Random rotation between 0 and 360 degrees
        const randomRotation = Math.floor(Math.random() * 360) + 'deg';

        element.style.setProperty('--random-size', randomSize);
        element.style.setProperty('--rotation', randomRotation);

        // Random position adjustments
        const randomX = Math.floor(Math.random() * 20 - 10) + '%';
        const randomY = Math.floor(Math.random() * 20 - 10) + '%';
        element.style.setProperty('top', randomY);
        element.style.setProperty('left', randomX);
    });
}

// ===== Course Popover =====
function initCoursePopover() {
    const popover = document.createElement('div');
    popover.className = 'course-popover';
    popover.setAttribute('role', 'tooltip');
    popover.innerHTML = `
        <div class="course-popover-header">
            <span class="course-popover-code"></span>
            <span class="course-popover-credits"></span>
        </div>
        <div class="course-popover-title"></div>
        <div class="course-popover-desc"></div>
        <a class="course-popover-link" target="_blank" rel="noopener noreferrer">
            View on catalog <i class="fas fa-arrow-up-right-from-square"></i>
        </a>
    `;
    document.body.appendChild(popover);

    const codeEl = popover.querySelector('.course-popover-code');
    const creditsEl = popover.querySelector('.course-popover-credits');
    const titleEl = popover.querySelector('.course-popover-title');
    const descEl = popover.querySelector('.course-popover-desc');
    const linkEl = popover.querySelector('.course-popover-link');

    let activeCourse = null;
    let hideTimeout = null;

    function showPopover(courseEl) {
        clearTimeout(hideTimeout);
        activeCourse = courseEl;

        codeEl.textContent = courseEl.dataset.code || '';
        const credits = courseEl.dataset.credits;
        creditsEl.textContent = credits ? `${credits} cr` : '';
        creditsEl.style.display = credits ? '' : 'none';
        titleEl.textContent = courseEl.dataset.title || '';
        descEl.textContent = courseEl.dataset.desc || '';

        const url = courseEl.dataset.url;
        if (url) {
            linkEl.href = url;
            linkEl.style.display = '';
        } else {
            linkEl.style.display = 'none';
        }

        // Position: prefer below the course span, flip above if no room
        const rect = courseEl.getBoundingClientRect();
        popover.classList.add('measuring');
        popover.classList.add('visible');
        const pRect = popover.getBoundingClientRect();
        popover.classList.remove('measuring');

        const margin = 8;
        let top = rect.bottom + window.scrollY + margin;
        let left = rect.left + window.scrollX + (rect.width / 2) - (pRect.width / 2);

        // Keep within viewport horizontally
        const minLeft = window.scrollX + margin;
        const maxLeft = window.scrollX + document.documentElement.clientWidth - pRect.width - margin;
        if (left < minLeft) left = minLeft;
        if (left > maxLeft) left = maxLeft;

        // Flip above if it would go off the bottom of the viewport
        const viewportBottom = window.scrollY + window.innerHeight;
        if (top + pRect.height > viewportBottom - margin) {
            top = rect.top + window.scrollY - pRect.height - margin;
        }

        popover.style.top = `${top}px`;
        popover.style.left = `${left}px`;
    }

    function hidePopover() {
        hideTimeout = setTimeout(() => {
            popover.classList.remove('visible');
            activeCourse = null;
        }, 120);
    }

    document.querySelectorAll('.course').forEach(course => {
        course.addEventListener('mouseenter', () => showPopover(course));
        course.addEventListener('mouseleave', hidePopover);
        course.addEventListener('focus', () => showPopover(course));
        course.addEventListener('blur', hidePopover);
        // Anchors are natively focusable, but set tabindex if it's a non-anchor fallback
        if (course.tagName !== 'A' && !course.hasAttribute('tabindex')) {
            course.setAttribute('tabindex', '0');
        }
    });

    // Keep popover visible when the cursor is over it
    popover.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
    popover.addEventListener('mouseleave', hidePopover);

    // Reposition on scroll/resize if open
    const reposition = () => {
        if (activeCourse && popover.classList.contains('visible')) {
            showPopover(activeCourse);
        }
    };
    window.addEventListener('scroll', reposition, { passive: true });
    window.addEventListener('resize', reposition);
}