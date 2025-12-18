import{g as b,l as d}from"./github-api.CvoqdnMi.js";function l(n,t,e=1500){if(!n)return;const a=performance.now();function s(i){const o=Math.min((i-a)/e,1),r=1-Math.pow(1-o,3);n.textContent=Math.floor(t*r).toString(),o<1&&requestAnimationFrame(s)}requestAnimationFrame(s)}function v(n){const t=document.getElementById("languages-list"),e=document.getElementById("languages-bar");t&&(t.innerHTML=n.slice(0,6).map(({language:a,percentage:s})=>{const i=d[a]||"#8b8b8b";return`
                <div class="language-item" style="--lang-color: ${i}">
                    <span class="lang-dot" style="background: ${i}"></span>
                    <span class="lang-name">${a}</span>
                    <span class="lang-percent">${s}%</span>
                </div>
            `}).join(""),e&&(e.innerHTML=n.map(({language:a,percentage:s})=>{const i=d[a]||"#8b8b8b";return`<div class="lang-bar-segment" style="width: ${s}%; background: ${i}; color: ${i}"></div>`}).join("")))}function w(n){const t=n.name.toLowerCase(),e=n.language?.toLowerCase()||"",a=(n.topics||[]).map(s=>s.toLowerCase());return a.includes("api")||t.includes("api")?"fas fa-plug":a.includes("mobile")||e==="kotlin"||e==="swift"?"fas fa-mobile-alt":a.includes("web")||a.includes("frontend")?"fas fa-globe":a.includes("docker")||a.includes("kubernetes")?"fab fa-docker":a.includes("ai")||a.includes("ml")||a.includes("machine-learning")?"fas fa-brain":e==="java"||a.includes("spring")?"fab fa-java":e==="python"?"fab fa-python":e==="typescript"||e==="javascript"?"fab fa-js-square":e==="go"?"fab fa-golang":e==="rust"?"fab fa-rust":t.includes("workflow")||t.includes("ci")||t.includes("cd")?"fas fa-cogs":e==="shell"?"fas fa-terminal":a.includes("database")||a.includes("sql")?"fas fa-database":"fas fa-code"}function h(n){const t=n.language?.toLowerCase()||"",e=(n.topics||[]).map(s=>s.toLowerCase()),a=n.name.toLowerCase();return e.includes("fullstack")||e.includes("full-stack")?"Full Stack":e.includes("frontend")||t==="vue"||t==="svelte"?"Frontend":e.includes("backend")||t==="java"||t==="kotlin"||t==="go"?"Backend":e.includes("mobile")||t==="swift"||t==="dart"?"Mobile":e.includes("devops")||e.includes("ci-cd")||e.includes("docker")?"DevOps":e.includes("api")||a.includes("api")?"API":e.includes("cli")||t==="shell"?"CLI Tool":e.includes("library")||e.includes("package")?"Library":t==="typescript"||t==="javascript"?"Web App":t==="python"?"Python":"Project"}function y(n){if(!n)return"";const t=new Date(n),a=new Date().getTime()-t.getTime(),s=Math.floor(a/(1e3*60*60*24));return s===0?"today":s===1?"yesterday":s<7?`${s}d ago`:s<30?`${Math.floor(s/7)}w ago`:s<365?`${Math.floor(s/30)}mo ago`:`${Math.floor(s/365)}y ago`}function j(n){if(n.description)return n.description;const t=n.language?.toLowerCase()||"",e=n.name.toLowerCase(),a=(n.topics||[]).map(s=>s.toLowerCase());return e.includes("poc")||a.includes("poc")?`Proof of concept exploring ${t||"new technologies"} capabilities and patterns.`:e.includes("template")||a.includes("template")?`Reusable template for ${t||"development"} projects with best practices.`:e.includes("workflow")||a.includes("ci-cd")?"Automation workflows and CI/CD pipeline configurations.":a.includes("api")||e.includes("api")?`RESTful API service built with ${t||"modern"} technologies.`:t==="java"||t==="kotlin"?`Enterprise-grade ${t} application with modern architecture.`:t==="javascript"||t==="typescript"?`Modern web application built with ${t}.`:t==="shell"?"Shell scripts and automation utilities for DevOps workflows.":e.includes("page")||e.includes("portfolio")?"Personal portfolio showcasing projects and skills.":`A ${t||"software"} project exploring new concepts and patterns.`}function $(n){const t=document.getElementById("projects-grid");t&&(t.innerHTML=n.slice(0,6).map(e=>{const a=e.language&&d[e.language]||"#8b8b8b",s=w(e),i=h(e),o=y(e.updatedAt),r=e.topics||[],p=j(e),g=!!e.description,m=e.name.replace(/-/g," ").replace(/_/g," ").split(" ").map(c=>c.charAt(0).toUpperCase()+c.slice(1)).join(" ");return`
                <a href="${e.url}" target="_blank" rel="noopener noreferrer" class="project-card">
                    <div class="shimmer"></div>
                    <div class="project-preview">
                        <div class="project-preview-pattern"></div>
                        <div class="project-preview-icon">
                            <i class="${s}"></i>
                        </div>
                        <span class="project-type-badge">${i}</span>
                        ${e.homepage?`
                            <a href="${e.homepage}" target="_blank" rel="noopener noreferrer" class="project-live-btn" title="Live Demo" onclick="event.stopPropagation()">
                                <i class="fas fa-external-link-alt"></i>
                                <span>Live</span>
                            </a>
                        `:""}
                    </div>
                    <div class="project-content">
                        <div class="project-header">
                            <span class="project-name">${m}</span>
                            ${e.language?`
                                <span class="project-lang-badge">
                                    <span class="lang-dot" style="background: ${a}; color: ${a}"></span>
                                    ${e.language}
                                </span>
                            `:""}
                        </div>
                        <p class="project-desc ${g?"":"auto-desc"}">${p}</p>
                        ${r.length>0?`
                            <div class="project-tech-tags">
                                ${r.slice(0,4).map(c=>`
                                    <span class="project-tech-tag">${c}</span>
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
                            ${o?`
                                <span class="project-updated">
                                    <i class="fas fa-clock"></i>
                                    ${o}
                                </span>
                            `:""}
                        </div>
                    </div>
                </a>
            `}).join(""))}function k(n){const t=document.getElementById("contribution-graph");if(!t||!n)return;const e=window.innerWidth<480?13:window.innerWidth<768?26:52,a=n.slice(-e);t.innerHTML=a.map(s=>`
            <div class="contribution-week">
                ${s.map(i=>`
                    <div class="contribution-day level-${i.level}" title="${i.date}: ${i.count} contributions"></div>
                `).join("")}
            </div>
        `).join("")}async function L(){const n=document.getElementById("tech-loading"),t=document.getElementById("tech-content");try{const e=await b();if(!e){n&&(n.innerHTML='<p style="color: var(--text-secondary);">Unable to load GitHub data</p>');return}l(document.getElementById("stat-repos"),e.stats.totalRepos),l(document.getElementById("stat-stars"),e.stats.totalStars),l(document.getElementById("stat-followers"),e.stats.followers),l(document.getElementById("stat-commits"),e.stats.totalCommits||0);const a=document.getElementById("current-streak");a&&(a.textContent=String(e.stats.currentStreak)),v(e.languages),$(e.featuredRepos),k(e.contributionData),n&&(n.style.display="none"),t&&(t.style.display="flex"),setTimeout(()=>{document.querySelectorAll(".animate-item").forEach((s,i)=>{const o=parseInt(s.getAttribute("data-delay")||"0");setTimeout(()=>s.classList.add("visible"),o+i*50)})},100)}catch(e){console.error("Error loading data:",e),n&&(n.innerHTML='<p style="color: var(--text-secondary);">Unable to load data</p>')}}const f=new IntersectionObserver(n=>{n.forEach(t=>{t.isIntersecting&&(L(),f.unobserve(t.target))})},{threshold:.1}),u=document.getElementById("tech");u&&f.observe(u);
