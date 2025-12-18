/**
 * LoaderProgress - Manages the page loader progress animation
 */

export class LoaderProgress {
    constructor() {
        this.progressBar = document.getElementById('loader-progress-bar');
        this.progressValue = document.querySelector('.loader-progress-value');
        this.statusText = document.querySelector('.loader-status');
        this.currentProgress = 0;
        this.targetProgress = 0;
        this.isComplete = false;
        this.stages = [
            { progress: 15, status: 'Loading assets...' },
            { progress: 35, status: 'Initializing...' },
            { progress: 55, status: 'Loading modules...' },
            { progress: 75, status: 'Preparing UI...' },
            { progress: 90, status: 'Almost ready...' },
            { progress: 100, status: 'Complete!' }
        ];
    }

    updateProgress(progress) {
        this.targetProgress = Math.min(progress, 100);
        this.animateProgress();
    }

    animateProgress() {
        if (this.currentProgress < this.targetProgress) {
            this.currentProgress += Math.max(1, (this.targetProgress - this.currentProgress) * 0.1);

            if (this.currentProgress >= this.targetProgress - 0.5) {
                this.currentProgress = this.targetProgress;
            }

            const roundedProgress = Math.round(this.currentProgress);

            if (this.progressBar) {
                this.progressBar.style.width = `${roundedProgress}%`;
            }
            if (this.progressValue) {
                this.progressValue.textContent = `${roundedProgress}%`;
            }

            this.updateStatus(roundedProgress);

            if (this.currentProgress < this.targetProgress) {
                requestAnimationFrame(() => this.animateProgress());
            }
        }
    }

    updateStatus(progress) {
        if (!this.statusText) return;

        for (let i = this.stages.length - 1; i >= 0; i--) {
            if (progress >= this.stages[i].progress - 10) {
                this.statusText.textContent = this.stages[i].status;
                break;
            }
        }
    }

    complete() {
        this.isComplete = true;
        this.updateProgress(100);
    }

    hide() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.classList.add('loaded');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 800);
        }
    }
}
