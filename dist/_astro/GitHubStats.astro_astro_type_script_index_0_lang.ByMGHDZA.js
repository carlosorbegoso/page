const b="https://api.github.com",h="carlosorbegoso",p=new Map,B=300*1e3;async function y(t){const a=p.get(t);if(a&&Date.now()-a.timestamp<B)return a.data;try{const e=await fetch(t,{headers:{Accept:"application/vnd.github.v3+json"}});if(!e.ok)throw new Error(`GitHub API error: ${e.status}`);const s=await e.json();return p.set(t,{data:s,timestamp:Date.now()}),s}catch(e){throw console.error("GitHub API fetch error:",e),e}}async function A(){const t=`${b}/users/${h}`;return y(t)}async function E(t={}){const{sort:a="updated",per_page:e=100}=t,s=`${b}/users/${h}/repos?sort=${a}&per_page=${e}`;return y(s)}async function S(){const t=await E(),a={};t.forEach(o=>{o.language&&(a[o.language]=(a[o.language]||0)+1)});const e=Object.entries(a).sort(([,o],[,r])=>r-o).slice(0,6),s=e.reduce((o,[,r])=>o+r,0);return e.map(([o,r])=>({language:o,count:r,percentage:Math.round(r/s*100)}))}async function _(){try{const[t,a]=await Promise.all([A(),E()]),e=a.reduce((n,c)=>n+c.stargazers_count,0),s=a.reduce((n,c)=>n+c.forks_count,0),o=await S(),r=a.filter(n=>!n.fork).sort((n,c)=>c.stargazers_count-n.stargazers_count).slice(0,6);return{profile:{name:t.name||t.login,login:t.login,avatar:t.avatar_url,bio:t.bio,location:t.location,company:t.company,blog:t.blog,publicRepos:t.public_repos,followers:t.followers,following:t.following,createdAt:t.created_at},stats:{totalRepos:a.filter(n=>!n.fork).length,totalStars:e,totalForks:s,followers:t.followers},languages:o,featuredRepos:r.map(n=>({name:n.name,description:n.description,url:n.html_url,stars:n.stargazers_count,forks:n.forks_count,language:n.language,updatedAt:n.updated_at}))}}catch(t){return console.error("Error fetching GitHub stats:",t),null}}const w={Java:"#b07219",JavaScript:"#f1e05a",TypeScript:"#3178c6",Python:"#3572A5",HTML:"#e34c26",CSS:"#563d7c",Go:"#00ADD8",Rust:"#dea584","C++":"#f34b7d","C#":"#178600",PHP:"#4F5D95",Ruby:"#701516",Swift:"#ffac45",Kotlin:"#A97BFF",Shell:"#89e051",Dockerfile:"#384d54",Vue:"#41b883",SCSS:"#c6538c",Astro:"#ff5a03"},i=document.getElementById("github-loading"),u=document.getElementById("github-error"),d=document.getElementById("github-content"),C=document.getElementById("github-retry");function l(t,a,e=1500){const o=performance.now();function r(n){const c=n-o,g=Math.min(c/e,1),$=1-Math.pow(1-g,3),k=Math.floor(0+(a-0)*$);t.textContent=k.toLocaleString(),g<1&&requestAnimationFrame(r)}requestAnimationFrame(r)}function H(t){const a=document.getElementById("languages-chart");!a||!t.length||(a.innerHTML=t.map(({language:e,percentage:s})=>{const o=w[e]||"#8b8b8b";return`
                <div class="language-item">
                    <span class="language-color" style="background: ${o}"></span>
                    <span class="language-name">${e}</span>
                    <div class="language-bar-container">
                        <div class="language-bar" style="width: 0%; background: ${o}" data-width="${s}"></div>
                    </div>
                    <span class="language-percentage">${s}%</span>
                </div>
            `}).join(""),setTimeout(()=>{a.querySelectorAll(".language-bar").forEach(e=>{const s=e.getAttribute("data-width");e.style.width=`${s}%`})},300))}function R(t){const a=document.getElementById("repos-grid");!a||!t.length||(a.innerHTML=t.map(e=>{const s=w[e.language]||"#8b8b8b",o=e.description||"No description available";return`
                <a href="${e.url}" target="_blank" rel="noopener noreferrer" class="repo-card">
                    <div class="repo-header">
                        <i class="fas fa-book-bookmark repo-icon"></i>
                        <span class="repo-name">${e.name}</span>
                    </div>
                    <p class="repo-description">${o}</p>
                    <div class="repo-meta">
                        ${e.language?`
                            <span class="repo-language">
                                <span class="lang-dot" style="background: ${s}"></span>
                                ${e.language}
                            </span>
                        `:""}
                        <span class="repo-stat">
                            <i class="fas fa-star"></i>
                            ${e.stars}
                        </span>
                        <span class="repo-stat">
                            <i class="fas fa-code-fork"></i>
                            ${e.forks}
                        </span>
                    </div>
                </a>
            `}).join(""))}function f(){i.style.display="none",u.style.display="flex",d.style.display="none"}function T(){i.style.display="none",u.style.display="none",d.style.display="grid",setTimeout(()=>{document.querySelectorAll(".github-animate").forEach((t,a)=>{const e=parseInt(t.getAttribute("data-anim-delay")||"0");setTimeout(()=>t.classList.add("visible"),e)})},100)}async function v(){i.style.display="flex",u.style.display="none",d.style.display="none";try{const t=await _();if(!t){f();return}document.getElementById("github-avatar").src=t.profile.avatar,document.getElementById("github-name").textContent=t.profile.name,document.getElementById("github-login").textContent=`@${t.profile.login}`,document.getElementById("github-link").href=`https://github.com/${t.profile.login}`,document.getElementById("github-bio").textContent=t.profile.bio||"",T(),setTimeout(()=>{l(document.getElementById("stat-repos"),t.stats.totalRepos),l(document.getElementById("stat-stars"),t.stats.totalStars),l(document.getElementById("stat-forks"),t.stats.totalForks),l(document.getElementById("stat-followers"),t.stats.followers)},500),H(t.languages),R(t.featuredRepos)}catch(t){console.error("Error loading GitHub data:",t),f()}}C?.addEventListener("click",v);const I=new IntersectionObserver(t=>{t.forEach(a=>{a.isIntersecting&&(v(),I.unobserve(a.target))})},{threshold:.1}),m=document.getElementById("github");m&&I.observe(m);
