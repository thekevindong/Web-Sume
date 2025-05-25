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
    const text = "Welcome to my Resume";
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