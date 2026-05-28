const fs = require('fs');
const path = require('path');

const wixDir = path.join(__dirname, 'wix-pages');
const outDir = path.join(__dirname, 'services');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}

const header = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Service | London Lux Refurbishment</title>
    
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏠</text></svg>">
    
    <link rel="stylesheet" href="/style.css">
    <link rel="stylesheet" href="/wix-pages/services.css">
    <link rel="stylesheet" href="/wix-pages/portfolio.css">
    
    <link href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" defer></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js" defer></script>
    <script src="https://unpkg.com/@studio-freight/lenis@1.0.33/dist/lenis.min.js" defer></script>
    <script src="/main.js" defer></script>

    <style>
        body { padding-top: 80px; } /* Navbar spacing */
    </style>
</head>
<body>
    <nav class="navbar glass">
        <div class="logo">London Lux <span class="accent-text">Refurbishment & Maintenance</span></div>
        <div class="nav-links">
            <a href="/">Home</a>
            <a href="/#services">Services</a>
            <a href="/#portfolio">Projects</a>
            <a href="/#contact-form" class="btn-primary">Get a Proposal</a>
        </div>
        <div class="menu-toggle" id="mobile-toggle">
            <span></span><span></span><span></span>
        </div>
    </nav>
    <div class="mobile-menu" id="mobile-menu">
        <a href="/">Home</a>
        <a href="/#services">Services</a>
        <a href="/#portfolio">Projects</a>
        <a href="/#contact-form" class="btn-primary">Get a Proposal</a>
    </div>
`;

const footer = `
    <footer id="contact">
        <div class="container footer-content">
            <div class="footer-cta-wrapper fade-up">
                <span class="cta-small-label">Click to initiate</span>
                <a href="https://wa.me/447599847337" target="_blank" rel="noopener noreferrer" class="footer-huge-text hover-target">
                    LET'S TALK. <span class="cta-arrow">↗</span>
                </a>
            </div>
            <div class="footer-grid">
                <div>
                    <h4>Contact</h4>
                    <p><a href="tel:+447599847337" class="footer-link">+44 75 9984 7337</a></p>
                    <p><a href="mailto:kornii@londonluxdecor.co.uk" class="footer-link">kornii@londonluxdecor.co.uk</a></p>
                </div>
                <div>
                    <h4>Legal</h4>
                    <p>London Lux Decor Ltd</p>
                    <p>Company No: 14705544</p>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>`;

const files = fs.readdirSync(wixDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(wixDir, file), 'utf-8');
    
    // Create specific title
    let pageTitle = file.replace('.html', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    let customizedHeader = header.replace('<title>Service | London Lux Refurbishment</title>', '<title>' + pageTitle + ' | London Lux</title>');
    
    const fullHtml = customizedHeader + content + footer;
    fs.writeFileSync(path.join(outDir, file), fullHtml);
    console.log("Generated " + file);
});
