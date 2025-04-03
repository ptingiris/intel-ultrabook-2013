# Intel Ultrabook Campaign (2013)
## Hand-Crafted Digital Experience for Walmart.com

![Intel Ultrabook Preview](screenshots/intel-ultrabook-preview.jpg)

## Project Overview

This project was a custom interactive landing page for Intel's Ultrabook campaign that appeared on Walmart.com in 2013. It represents cutting-edge front-end development techniques of that era, showcasing Intel's premium laptop technology through an equally innovative digital experience.

### Key Features

- **Progressive HTML5 Structure**: Implemented semantic markup when HTML5 was still gaining browser support
- **CSS3 Animations**: Created smooth transitions and visual effects without heavy JavaScript or Flash
- **Interactive Elements**: Developed a processor badge selection system that dynamically updated content
- **Particle Animation System**: Hand-crafted confetti-like animation in the processor selection area
- **Responsive Design Principles**: Applied adaptability across devices when responsive design was emerging

## Technical Implementation

### HTML5 Structure

The project was built with a semantic HTML5 structure, which was progressive for 2013 when many sites were still using div-heavy layouts without semantic meaning. This forward-thinking implementation helped with accessibility and laid the groundwork for better SEO practices.

### CSS3 Animations & Transitions

Rather than relying on Flash (which was common at the time) or heavy JavaScript, the project leveraged the then-experimental CSS3 animation and transition properties:

```css
@keyframes particleAnimation {
  0% { transform: translateY(-100%) rotate(0deg); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(100%) rotate(360deg); opacity: 0; }
}

.particle {
  animation: particleAnimation 3s ease-in-out infinite;
  animation-delay: calc(var(--particle-index) * 0.1s);
}
```

These animations required careful vendor prefixing to ensure cross-browser compatibility:

```css
.particle {
  -webkit-animation: float 3s infinite;
  -moz-animation: float 3s infinite;
  -ms-animation: float 3s infinite;
  animation: float 3s infinite;
}
```

### Interactive Badge Selection System

The project featured an innovative processor badge selection system that allowed users to explore different Intel processors by clicking on badges. When a user selected a badge, the content area dynamically updated with relevant information and product links.

```javascript
// Badge selection with dynamic content updating
$('.processor-badge').on('click', function() {
  var processorType = $(this).data('processor-type');
  
  // Update active state
  $('.processor-badge').removeClass('active');
  $(this).addClass('active');
  
  // Update content area
  $('#processor-details').fadeOut(200, function() {
    $('#processor-details')
      .html(processorContent[processorType])
      .fadeIn(300);
  });
  
  // Trigger particle animation
  triggerParticleEffect(processorType);
});
```

### Particle Animation System

One of the most visually striking elements was the custom particle animation system that created a confetti-like effect when users interacted with processor badges. This was achieved using JavaScript to dynamically generate and animate particles:

```javascript
function triggerParticleEffect(processorType) {
  var colors = processorColors[processorType];
  var container = document.querySelector('.particleMovie');
  
  // Clear existing particles
  container.innerHTML = '';
  
  // Create new particles
  for (var i = 0; i < 50; i++) {
    var particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.setProperty('--particle-index', i);
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = Math.random() * 100 + '%';
    container.appendChild(particle);
  }
}
```

### Cross-Browser Compatibility

A significant challenge in 2013 was ensuring consistent experiences across browsers with varying levels of HTML5 and CSS3 support. The project implemented careful fallbacks and feature detection:

```javascript
// Check for CSS animation support
var supportsAnimations = false;
var domPrefixes = 'Webkit Moz O ms Khtml'.split(' ');
var elm = document.createElement('div');

if (elm.style.animationName !== undefined) { supportsAnimations = true; }

if (supportsAnimations === false) {
  for (var i = 0; i < domPrefixes.length; i++) {
    if (elm.style[domPrefixes[i] + 'AnimationName'] !== undefined) {
      supportsAnimations = true;
      break;
    }
  }
}

// Apply fallback for non-supporting browsers
if (!supportsAnimations) {
  $('.animated-element').addClass('no-animation-fallback');
  // Provide alternative experience
}
```

### Responsive Design

The project incorporated early responsive design principles, ensuring the experience adapted to different screen sizes:

```css
/* Base styles for desktop */
.ultrabook-showcase {
  width: 980px;
  margin: 0 auto;
}

/* Early responsive approach with media queries */
@media only screen and (max-width: 768px) {
  .ultrabook-showcase {
    width: 100%;
  }
  
  .product-image,
  .product-details {
    float: none;
    width: 100%;
  }
}
```

## Technical Challenges Overcome

### Cross-Browser Compatibility

In 2013, browser support for CSS3 animations varied significantly. This required extensive testing and vendor prefixing to ensure consistent experiences.

### Performance Optimization

The animated elements needed to run smoothly even on lower-powered devices. This required careful optimization of animation frames and asset loading.

### Integration Constraints

Working within Walmart.com's platform required adherence to strict technical guidelines while still delivering a premium branded experience.

## Visual Design Components

The project featured several key visual elements:

- Ultra-thin laptop hero image with dynamic feature callouts
- Interactive processor badge selection system
- Animated particle effects to enhance user interaction
- Carefully crafted color palette matching Intel's brand guidelines
- Responsive layout adjusting to different viewport sizes

## Legacy and Impact

This project represents an important milestone in my front-end development journey:

- **Client Success**: The campaign successfully showcased Intel's premium products in an engaging format.
- **Technical Foundation**: The hand-coding techniques mastered here laid groundwork for my later work with JavaScript frameworks.
- **Early Adoption**: This work demonstrates my consistent pattern of embracing emerging technologies.

## Technologies Used

- HTML5
- CSS3 (with animations and transitions)
- JavaScript/jQuery
- Cross-browser compatibility techniques
- Responsive design principles

## Setup and Installation

1. Clone this repository
2. Open `index.html` in a modern browser
3. Explore the interactive features of the Intel Ultrabook campaign

## Project Structure

```
intel-ultrabook/
├── css/
│   ├── styles.css
│   ├── reset.css
│   └── intel.fonts.css
├── js/
│   ├── jquery.min.js
│   ├── trm-custom.js
│   └── [other library files]
├── images/
│   ├── _layout/
│   ├── Renders/
│   │   ├── particles/
│   │   ├── pov-compare/
│   │   └── pov-explore/
│   └── [other image files]
└── index.html
```

## Credits

- Developer: Pam Tingris
- Client: Intel Corporation
- Platform: Walmart.com
- Year: 2013

---

*This project demonstrates early adoption of HTML5 and CSS3 techniques that would later become standard practices in front-end development.*
