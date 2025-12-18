import{g,l as i}from"./github-api.BtI4ngxW.js";function r(e,n,t=1500){if(!e)return;const a=performance.now();function s(o){const c=Math.min((o-a)/t,1),u=1-Math.pow(1-c,3);e.textContent=Math.floor(n*u).toString(),c<1&&requestAnimationFrame(s)}requestAnimationFrame(s)}function m(e){const n=document.getElementById("languages-list"),t=document.getElementById("languages-bar");n&&(n.innerHTML=e.slice(0,6).map(({language:a,percentage:s})=>`
                <div class="language-item">
                    <span class="lang-dot" style="background: ${i[a]||"#8b8b8b"}"></span>
                    <span class="lang-name">${a}</span>
                    <span class="lang-percent">${s}%</span>
                </div>
            `).join(""),t&&(t.innerHTML=e.map(({language:a,percentage:s})=>{const o=i[a]||"#8b8b8b";return`<div class="lang-bar-segment" style="width: ${s}%; background: ${o}"></div>`}).join("")))}function p(e){const n=document.getElementById("projects-grid");n&&(n.innerHTML=e.slice(0,6).map(t=>{const a=t.language&&i[t.language]||"#8b8b8b";return`
                <a href="${t.url}" target="_blank" rel="noopener noreferrer" class="project-card">
                    <div class="project-header">
                        <span class="project-name">${t.name}</span>
                        <i class="fas fa-external-link-alt project-icon"></i>
                    </div>
                    <p class="project-desc">${t.description||"No description"}</p>
                    <div class="project-meta">
                        ${t.language?`
                            <span class="project-lang">
                                <span class="lang-dot" style="background: ${a}"></span>
                                ${t.language}
                            </span>
                        `:""}
                        <span class="project-stat"><i class="fas fa-star"></i> ${t.stars}</span>
                        <span class="project-stat"><i class="fas fa-code-fork"></i> ${t.forks}</span>
                    </div>
                </a>
            `}).join(""))}function f(e){const n=document.getElementById("contribution-graph");if(!n||!e)return;const t=window.innerWidth<480?13:window.innerWidth<768?26:52,a=e.slice(-t);n.innerHTML=a.map(s=>`
            <div class="contribution-week">
                ${s.map(o=>`
                    <div class="contribution-day level-${o.level}" title="${o.date}: ${o.count} contributions"></div>
                `).join("")}
            </div>
        `).join("")}async function b(){const e=document.getElementById("tech-loading"),n=document.getElementById("tech-content");try{const t=await g();if(!t){e&&(e.innerHTML="<p>Unable to load data</p>");return}r(document.getElementById("stat-repos"),t.stats.totalRepos),r(document.getElementById("stat-stars"),t.stats.totalStars),r(document.getElementById("stat-followers"),t.stats.followers),r(document.getElementById("stat-years"),t.profile.yearsOnGitHub);const a=document.getElementById("current-streak");a&&(a.textContent=String(t.stats.currentStreak)),m(t.languages),p(t.featuredRepos),f(t.contributionData),e&&(e.style.display="none"),n&&(n.style.display="flex"),setTimeout(()=>{document.querySelectorAll(".animate-item").forEach(s=>{const o=parseInt(s.getAttribute("data-delay")||"0");setTimeout(()=>s.classList.add("visible"),o)})},100)}catch(t){console.error("Error loading data:",t),e&&(e.innerHTML="<p>Unable to load data</p>")}}const d=new IntersectionObserver(e=>{e.forEach(n=>{n.isIntersecting&&(b(),d.unobserve(n.target))})},{threshold:.1}),l=document.getElementById("tech");l&&d.observe(l);
