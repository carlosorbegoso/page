import{g as p,l}from"./github-api.BtI4ngxW.js";function c(a,t,e=1500){if(!a)return;const n=performance.now();function s(r){const i=Math.min((r-n)/e,1),o=1-Math.pow(1-i,3);a.textContent=Math.floor(t*o).toString(),i<1&&requestAnimationFrame(s)}requestAnimationFrame(s)}function g(a){const t=document.getElementById("languages-list"),e=document.getElementById("languages-bar");t&&(t.innerHTML=a.slice(0,6).map(({language:n,percentage:s})=>{const r=l[n]||"#8b8b8b";return`
                <div class="language-item" style="--lang-color: ${r}">
                    <span class="lang-dot" style="background: ${r}"></span>
                    <span class="lang-name">${n}</span>
                    <span class="lang-percent">${s}%</span>
                </div>
            `}).join(""),e&&(e.innerHTML=a.map(({language:n,percentage:s})=>{const r=l[n]||"#8b8b8b";return`<div class="lang-bar-segment" style="width: ${s}%; background: ${r}; color: ${r}"></div>`}).join("")))}function m(a){const t=a.name.toLowerCase(),e=a.language?.toLowerCase()||"",n=(a.topics||[]).map(s=>s.toLowerCase());return n.includes("api")||t.includes("api")?"fas fa-plug":n.includes("mobile")||e==="kotlin"||e==="swift"?"fas fa-mobile-alt":n.includes("web")||n.includes("frontend")?"fas fa-globe":n.includes("docker")||n.includes("kubernetes")?"fab fa-docker":n.includes("ai")||n.includes("ml")||n.includes("machine-learning")?"fas fa-brain":e==="java"||n.includes("spring")?"fab fa-java":e==="python"?"fab fa-python":e==="typescript"||e==="javascript"?"fab fa-js-square":e==="go"?"fab fa-golang":e==="rust"?"fab fa-rust":t.includes("workflow")||t.includes("ci")||t.includes("cd")?"fas fa-cogs":e==="shell"?"fas fa-terminal":n.includes("database")||n.includes("sql")?"fas fa-database":"fas fa-code"}function b(a){const t=a.language?.toLowerCase()||"",e=(a.topics||[]).map(s=>s.toLowerCase()),n=a.name.toLowerCase();return e.includes("fullstack")||e.includes("full-stack")?"Full Stack":e.includes("frontend")||t==="vue"||t==="svelte"?"Frontend":e.includes("backend")||t==="java"||t==="kotlin"||t==="go"?"Backend":e.includes("mobile")||t==="swift"||t==="dart"?"Mobile":e.includes("devops")||e.includes("ci-cd")||e.includes("docker")?"DevOps":e.includes("api")||n.includes("api")?"API":e.includes("cli")||t==="shell"?"CLI Tool":e.includes("library")||e.includes("package")?"Library":t==="typescript"||t==="javascript"?"Web App":t==="python"?"Python":"Project"}function v(a){if(!a)return"";const t=new Date(a),n=new Date().getTime()-t.getTime(),s=Math.floor(n/(1e3*60*60*24));return s===0?"today":s===1?"yesterday":s<7?`${s}d ago`:s<30?`${Math.floor(s/7)}w ago`:s<365?`${Math.floor(s/30)}mo ago`:`${Math.floor(s/365)}y ago`}function y(a){const t=document.getElementById("projects-grid");t&&(t.innerHTML=a.slice(0,6).map(e=>{const n=e.language&&l[e.language]||"#8b8b8b",s=m(e),r=b(e),i=v(e.updatedAt),o=e.topics||[];return`
                <div class="project-card">
                    <div class="shimmer"></div>
                    <div class="project-preview">
                        <div class="project-preview-pattern"></div>
                        <div class="project-preview-icon">
                            <i class="${s}"></i>
                        </div>
                        <span class="project-type-badge">${r}</span>
                        <div class="project-links">
                            <a href="${e.url}" target="_blank" rel="noopener noreferrer" class="project-link-btn" title="View on GitHub">
                                <i class="fab fa-github"></i>
                            </a>
                            ${e.homepage?`
                                <a href="${e.homepage}" target="_blank" rel="noopener noreferrer" class="project-link-btn" title="Live Demo">
                                    <i class="fas fa-external-link-alt"></i>
                                </a>
                            `:""}
                        </div>
                    </div>
                    <div class="project-content">
                        <div class="project-header">
                            <span class="project-name">${e.name}</span>
                            ${e.language?`
                                <span class="project-lang-badge">
                                    <span class="lang-dot" style="background: ${n}; color: ${n}"></span>
                                    ${e.language}
                                </span>
                            `:""}
                        </div>
                        <p class="project-desc">${e.description||"No description available"}</p>
                        ${o.length>0?`
                            <div class="project-tech-tags">
                                ${o.slice(0,4).map(f=>`
                                    <span class="project-tech-tag">${f}</span>
                                `).join("")}
                            </div>
                        `:""}
                        <div class="project-stats-footer">
                            <span class="project-stat stars">
                                <i class="fas fa-star"></i>
                                ${e.stars}
                            </span>
                            <span class="project-stat forks">
                                <i class="fas fa-code-branch"></i>
                                ${e.forks}
                            </span>
                            ${i?`
                                <span class="project-updated">
                                    <i class="fas fa-clock"></i>
                                    ${i}
                                </span>
                            `:""}
                        </div>
                    </div>
                </div>
            `}).join(""))}function h(a){const t=document.getElementById("contribution-graph");if(!t||!a)return;const e=window.innerWidth<480?13:window.innerWidth<768?26:52,n=a.slice(-e);t.innerHTML=n.map(s=>`
            <div class="contribution-week">
                ${s.map(r=>`
                    <div class="contribution-day level-${r.level}" title="${r.date}: ${r.count} contributions"></div>
                `).join("")}
            </div>
        `).join("")}async function j(){const a=document.getElementById("tech-loading"),t=document.getElementById("tech-content");try{const e=await p();if(!e){a&&(a.innerHTML='<p style="color: var(--text-secondary);">Unable to load GitHub data</p>');return}c(document.getElementById("stat-repos"),e.stats.totalRepos),c(document.getElementById("stat-stars"),e.stats.totalStars),c(document.getElementById("stat-followers"),e.stats.followers),c(document.getElementById("stat-years"),e.profile.yearsOnGitHub);const n=document.getElementById("current-streak");n&&(n.textContent=String(e.stats.currentStreak)),g(e.languages),y(e.featuredRepos),h(e.contributionData),a&&(a.style.display="none"),t&&(t.style.display="flex"),setTimeout(()=>{document.querySelectorAll(".animate-item").forEach((s,r)=>{const i=parseInt(s.getAttribute("data-delay")||"0");setTimeout(()=>s.classList.add("visible"),i+r*50)})},100)}catch(e){console.error("Error loading data:",e),a&&(a.innerHTML='<p style="color: var(--text-secondary);">Unable to load data</p>')}}const u=new IntersectionObserver(a=>{a.forEach(t=>{t.isIntersecting&&(j(),u.unobserve(t.target))})},{threshold:.1}),d=document.getElementById("tech");d&&u.observe(d);
