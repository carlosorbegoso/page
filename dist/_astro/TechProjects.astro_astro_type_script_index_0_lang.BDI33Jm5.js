import{g,l as c}from"./github-api.BtI4ngxW.js";function i(e,n,t=1500){if(!e)return;const a=performance.now();function o(s){const r=Math.min((s-a)/t,1),u=1-Math.pow(1-r,3);e.textContent=Math.floor(n*u).toString(),r<1&&requestAnimationFrame(o)}requestAnimationFrame(o)}function m(e){const n=document.getElementById("languages-list"),t=document.getElementById("languages-bar");n&&(n.innerHTML=e.slice(0,6).map(({language:a,percentage:o})=>{const s=c[a]||"#8b8b8b";return`
                <div class="language-item" style="--lang-color: ${s}">
                    <span class="lang-dot" style="background: ${s}"></span>
                    <span class="lang-name">${a}</span>
                    <span class="lang-percent">${o}%</span>
                </div>
            `}).join(""),t&&(t.innerHTML=e.map(({language:a,percentage:o})=>{const s=c[a]||"#8b8b8b";return`<div class="lang-bar-segment" style="width: ${o}%; background: ${s}; color: ${s}"></div>`}).join("")))}function p(e){const n=document.getElementById("projects-grid");n&&(n.innerHTML=e.slice(0,6).map(t=>{const a=t.language&&c[t.language]||"#8b8b8b";return`
                <a href="${t.url}" target="_blank" rel="noopener noreferrer" class="project-card">
                    <div class="project-header">
                        <span class="project-name">${t.name}</span>
                        <i class="fas fa-external-link-alt project-icon"></i>
                    </div>
                    <p class="project-desc">${t.description||"No description available"}</p>
                    <div class="project-meta">
                        ${t.language?`
                            <span class="project-lang">
                                <span class="lang-dot" style="background: ${a}; box-shadow: 0 0 8px ${a}"></span>
                                ${t.language}
                            </span>
                        `:""}
                        <span class="project-stat"><i class="fas fa-star"></i> ${t.stars}</span>
                        <span class="project-stat"><i class="fas fa-code-branch"></i> ${t.forks}</span>
                    </div>
                </a>
            `}).join(""))}function b(e){const n=document.getElementById("contribution-graph");if(!n||!e)return;const t=window.innerWidth<480?13:window.innerWidth<768?26:52,a=e.slice(-t);n.innerHTML=a.map(o=>`
            <div class="contribution-week">
                ${o.map(s=>`
                    <div class="contribution-day level-${s.level}" title="${s.date}: ${s.count} contributions"></div>
                `).join("")}
            </div>
        `).join("")}async function f(){const e=document.getElementById("tech-loading"),n=document.getElementById("tech-content");try{const t=await g();if(!t){e&&(e.innerHTML='<p style="color: var(--text-secondary);">Unable to load GitHub data</p>');return}i(document.getElementById("stat-repos"),t.stats.totalRepos),i(document.getElementById("stat-stars"),t.stats.totalStars),i(document.getElementById("stat-followers"),t.stats.followers),i(document.getElementById("stat-years"),t.profile.yearsOnGitHub);const a=document.getElementById("current-streak");a&&(a.textContent=String(t.stats.currentStreak)),m(t.languages),p(t.featuredRepos),b(t.contributionData),e&&(e.style.display="none"),n&&(n.style.display="flex"),setTimeout(()=>{document.querySelectorAll(".animate-item").forEach((o,s)=>{const r=parseInt(o.getAttribute("data-delay")||"0");setTimeout(()=>o.classList.add("visible"),r+s*50)})},100)}catch(t){console.error("Error loading data:",t),e&&(e.innerHTML='<p style="color: var(--text-secondary);">Unable to load data</p>')}}const d=new IntersectionObserver(e=>{e.forEach(n=>{n.isIntersecting&&(f(),d.unobserve(n.target))})},{threshold:.1}),l=document.getElementById("tech");l&&d.observe(l);
