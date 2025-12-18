/**
 * KonamiEasterEgg - Handles the Konami Code easter egg
 * Sequence: ↑↑↓↓←→←→BA
 */

export class KonamiEasterEgg {
    constructor() {
        this.sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        this.currentIndex = 0;
        this.overlay = null;
        this.style = null;
    }

    handleKeyPress(key) {
        if (key === this.sequence[this.currentIndex]) {
            this.currentIndex++;
            if (this.currentIndex === this.sequence.length) {
                this.activate();
                this.currentIndex = 0;
            }
        } else {
            this.currentIndex = 0;
        }
    }

    activate() {
        this.createOverlay();
        this.playSound();
        this.setupAutoClose();
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'konami-overlay';
        this.overlay.innerHTML = `
            <div class="konami-content">
                <div class="konami-icon">🎮</div>
                <h2 class="konami-title">Achievement Unlocked!</h2>
                <p class="konami-text">You found the secret Konami Code!</p>
                <div class="konami-badges">
                    <span class="konami-badge">+30 Lives</span>
                    <span class="konami-badge">God Mode</span>
                    <span class="konami-badge">All Weapons</span>
                </div>
                <p class="konami-signature">~ Carlos Orbegoso, Backend Developer & Gamer ~</p>
            </div>
        `;
        document.body.appendChild(this.overlay);

        this.injectStyles();

        this.overlay.addEventListener('click', () => this.close());
    }

    injectStyles() {
        this.style = document.createElement('style');
        this.style.textContent = `
            .konami-overlay {
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                animation: konamiFadeIn 0.5s ease;
            }
            @keyframes konamiFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .konami-content {
                text-align: center;
                animation: konamiSlideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            @keyframes konamiSlideUp {
                from { opacity: 0; transform: translateY(50px) scale(0.9); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            .konami-icon {
                font-size: 5rem;
                animation: konamiPulse 1s ease infinite;
                margin-bottom: 1.5rem;
            }
            @keyframes konamiPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }
            .konami-title {
                font-family: 'Poppins', sans-serif;
                font-size: 2.5rem;
                font-weight: 800;
                background: linear-gradient(90deg, #FFD700, #FF6B35, #00FFFF, #64B5F6);
                background-size: 300% 300%;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: konamiGradient 2s ease infinite;
                margin-bottom: 1rem;
            }
            @keyframes konamiGradient {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }
            .konami-text {
                color: #ccc;
                font-size: 1.1rem;
                margin-bottom: 2rem;
            }
            .konami-badges {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
                margin-bottom: 2rem;
            }
            .konami-badge {
                padding: 0.5rem 1rem;
                background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 107, 53, 0.2));
                border: 1px solid rgba(255, 215, 0, 0.5);
                border-radius: 20px;
                color: #FFD700;
                font-family: 'JetBrains Mono', monospace;
                font-size: 0.85rem;
                animation: konamiBadgePop 0.5s ease backwards;
            }
            .konami-badge:nth-child(1) { animation-delay: 0.3s; }
            .konami-badge:nth-child(2) { animation-delay: 0.5s; }
            .konami-badge:nth-child(3) { animation-delay: 0.7s; }
            @keyframes konamiBadgePop {
                from { opacity: 0; transform: scale(0); }
                to { opacity: 1; transform: scale(1); }
            }
            .konami-signature {
                color: #666;
                font-style: italic;
                font-size: 0.9rem;
            }
            @keyframes konamiFadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(this.style);
    }

    playSound() {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime);
            oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(1174.66, audioCtx.currentTime + 0.2);
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.5);
        } catch (e) {
            // Audio not supported
        }
    }

    setupAutoClose() {
        setTimeout(() => {
            if (document.body.contains(this.overlay)) {
                this.close();
            }
        }, 5000);
    }

    close() {
        if (this.overlay) {
            this.overlay.style.animation = 'konamiFadeOut 0.3s ease forwards';
            setTimeout(() => {
                this.overlay?.remove();
                this.style?.remove();
                this.overlay = null;
                this.style = null;
            }, 300);
        }
    }
}
