class VortexAnimation {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.waterLevel = null;
        this.vortex = null;
        this.vaporInterval = null;
        this.isRunning = false;
        this.SVG_NS = "http://www.w3.org/2000/svg";
    }

    createSVGElement(type) {
        return document.createElementNS(this.SVG_NS, type);
    }

    init() {
        // Create water level container
        this.waterLevel = this.createSVGElement('g');
        this.waterLevel.setAttribute('class', 'water-level');
        
        // Create water background
        const waterBg = this.createSVGElement('ellipse');
        waterBg.setAttribute('cx', '0');
        waterBg.setAttribute('cy', '0');
        waterBg.setAttribute('rx', '200');
        waterBg.setAttribute('ry', '100');
        waterBg.setAttribute('fill', 'url(#vortexWaterGradient)');
        this.waterLevel.appendChild(waterBg);
        
        // Create vortex element
        this.vortex = this.createSVGElement('ellipse');
        this.vortex.setAttribute('class', 'vortex');
        this.vortex.setAttribute('cx', '0');
        this.vortex.setAttribute('cy', '0');
        this.vortex.setAttribute('rx', '150');
        this.vortex.setAttribute('ry', '75');
        this.waterLevel.appendChild(this.vortex);

        // Create arrows
        this.createArrows();

        // Add water level to container
        this.container.appendChild(this.waterLevel);
    }

    createArrows() {
        const numArrows = 12;
        const radius = 120;
        
        for (let i = 0; i < numArrows; i++) {
            const angle = (i * 30) * Math.PI / 180;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            const arrow = this.createSVGElement('path');
            arrow.setAttribute('class', 'arrow');
            arrow.setAttribute('d', 'M-8,-3 L0,-3 L0,-6 L8,0 L0,6 L0,3 L-8,3 Z');
            arrow.setAttribute('transform', `translate(${x},${y}) rotate(${angle * 180 / Math.PI + 90})`);
            
            // Add animation
            const animateTransform = this.createSVGElement('animateTransform');
            animateTransform.setAttribute('attributeName', 'transform');
            animateTransform.setAttribute('type', 'rotate');
            animateTransform.setAttribute('from', '0 0 0');
            animateTransform.setAttribute('to', '360 0 0');
            animateTransform.setAttribute('dur', '6s');
            animateTransform.setAttribute('repeatCount', 'indefinite');
            arrow.appendChild(animateTransform);
            
            this.waterLevel.appendChild(arrow);
        }
    }

    createVaporParticle() {
        const vapor = this.createSVGElement('path');
        vapor.setAttribute('class', 'vapor-particle');
        vapor.setAttribute('d', 'M-2,2 L0,-2 L2,2 L1,2 L1,0 L-1,0 L-1,2 Z');
        
        // Random starting position
        const angle = Math.random() * Math.PI * 2;
        const radius = 140;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        vapor.setAttribute('transform', `translate(${x},${y})`);
        
        // Add animation
        const animate = this.createSVGElement('animate');
        animate.setAttribute('attributeName', 'opacity');
        animate.setAttribute('from', '1');
        animate.setAttribute('to', '0');
        animate.setAttribute('dur', '2s');
        animate.setAttribute('begin', '0s');
        animate.setAttribute('fill', 'freeze');
        vapor.appendChild(animate);
        
        const animateTransform = this.createSVGElement('animateTransform');
        animateTransform.setAttribute('attributeName', 'transform');
        animateTransform.setAttribute('type', 'translate');
        animateTransform.setAttribute('from', `${x} ${y}`);
        animateTransform.setAttribute('to', `${x} ${y - 100}`);
        animateTransform.setAttribute('dur', '2s');
        animateTransform.setAttribute('begin', '0s');
        animateTransform.setAttribute('fill', 'freeze');
        vapor.appendChild(animateTransform);
        
        this.waterLevel.appendChild(vapor);
        
        // Remove particle after animation
        setTimeout(() => vapor.remove(), 2000);
    }

    start() {
        if (!this.isRunning) {
            this.init();
            this.vaporInterval = setInterval(() => this.createVaporParticle(), 200);
            this.isRunning = true;
        }
    }

    stop() {
        if (this.isRunning) {
            if (this.vaporInterval) {
                clearInterval(this.vaporInterval);
                this.vaporInterval = null;
            }
            if (this.container) {
                this.container.innerHTML = '';
            }
            this.isRunning = false;
        }
    }
}

// Export the class
window.VortexAnimation = VortexAnimation; 
