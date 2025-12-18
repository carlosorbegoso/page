class a{constructor(){this.particles=[],this.mouseX=0,this.mouseY=0,this.isActive=!0,this.isTouchDevice="ontouchstart"in window,this.prefersReducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches,this.isMobile=window.innerWidth<=768,this.maxParticles=this.isMobile?25:50,!(this.isTouchDevice||this.prefersReducedMotion)&&this.init()}init(){this.container=document.createElement("div"),this.container.className="cursor-particles-container",this.container.style.cssText=`
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 9998;
            overflow: hidden;
        `,document.body.appendChild(this.container),this.cursor=document.createElement("div"),this.cursor.className="custom-cursor",this.cursor.innerHTML=`
            <div class="cursor-dot"></div>
            <div class="cursor-ring"></div>
            <div class="cursor-ring-outer"></div>
        `,document.body.appendChild(this.cursor),this.addStyles(),this.bindEvents(),this.animate()}addStyles(){const t=document.createElement("style");t.textContent=`
            body {
                cursor: none !important;
            }

            a, button, [role="button"], input, textarea, select, .clickable {
                cursor: none !important;
            }

            .custom-cursor {
                position: fixed;
                pointer-events: none;
                z-index: 9999;
                mix-blend-mode: difference;
            }

            .cursor-dot {
                position: absolute;
                width: 8px;
                height: 8px;
                background: #64b5f6;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                box-shadow: 0 0 10px #64b5f6, 0 0 20px rgba(100, 181, 246, 0.5);
            }

            .cursor-ring {
                position: absolute;
                width: 32px;
                height: 32px;
                border: 1px solid rgba(100, 181, 246, 0.5);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: transform 0.15s ease, border-color 0.15s ease, width 0.15s ease, height 0.15s ease;
            }

            .cursor-ring-outer {
                position: absolute;
                width: 48px;
                height: 48px;
                border: 1px solid rgba(100, 181, 246, 0.2);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: transform 0.2s ease, opacity 0.2s ease;
                animation: cursorRingPulse 2s ease-in-out infinite;
            }

            @keyframes cursorRingPulse {
                0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
                50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.5; }
            }

            .custom-cursor.hover .cursor-ring {
                width: 50px;
                height: 50px;
                border-color: rgba(255, 107, 53, 0.8);
            }

            .custom-cursor.hover .cursor-dot {
                background: #ff6b35;
                box-shadow: 0 0 15px #ff6b35, 0 0 30px rgba(255, 107, 53, 0.5);
            }

            .custom-cursor.hover .cursor-ring-outer {
                opacity: 0;
            }

            .custom-cursor.clicking .cursor-dot {
                transform: translate(-50%, -50%) scale(0.5);
            }

            .custom-cursor.clicking .cursor-ring {
                transform: translate(-50%, -50%) scale(0.8);
            }

            .cursor-particle {
                position: absolute;
                width: 4px;
                height: 4px;
                background: #64b5f6;
                border-radius: 50%;
                pointer-events: none;
                opacity: 0;
                box-shadow: 0 0 6px rgba(100, 181, 246, 0.8);
            }

            @media (max-width: 768px) {
                body {
                    cursor: auto !important;
                }

                .custom-cursor,
                .cursor-particles-container {
                    display: none !important;
                }
            }
        `,document.head.appendChild(t)}bindEvents(){document.addEventListener("mousemove",e=>{this.mouseX=e.clientX,this.mouseY=e.clientY,this.cursor.style.left=`${this.mouseX}px`,this.cursor.style.top=`${this.mouseY}px`,this.isActive&&Math.random()>.5&&this.createParticle(this.mouseX,this.mouseY)}),document.querySelectorAll('a, button, [role="button"], input, textarea, select, .clickable').forEach(e=>{e.addEventListener("mouseenter",()=>{this.cursor.classList.add("hover")}),e.addEventListener("mouseleave",()=>{this.cursor.classList.remove("hover")})}),document.addEventListener("mousedown",()=>{this.cursor.classList.add("clicking"),this.createBurstParticles()}),document.addEventListener("mouseup",()=>{this.cursor.classList.remove("clicking")}),new MutationObserver(()=>{document.querySelectorAll('a:not([data-cursor-bound]), button:not([data-cursor-bound]), [role="button"]:not([data-cursor-bound])').forEach(e=>{e.setAttribute("data-cursor-bound","true"),e.addEventListener("mouseenter",()=>{this.cursor.classList.add("hover")}),e.addEventListener("mouseleave",()=>{this.cursor.classList.remove("hover")})})}).observe(document.body,{childList:!0,subtree:!0}),document.addEventListener("visibilitychange",()=>{this.isActive=!document.hidden})}createParticle(t,e){if(this.particles.length>=this.maxParticles)return;const s=document.createElement("div");s.className="cursor-particle";const o=(Math.random()-.5)*20,r=(Math.random()-.5)*20;s.style.left=`${t+o}px`,s.style.top=`${e+r}px`;const n=["#64b5f6","#90caf9","#42a5f5","#81d4fa"];s.style.background=n[Math.floor(Math.random()*n.length)],this.container.appendChild(s);const i={element:s,x:t+o,y:e+r,vx:(Math.random()-.5)*2,vy:(Math.random()-.5)*2-1,life:1,decay:.02+Math.random()*.02,size:2+Math.random()*3};s.style.width=`${i.size}px`,s.style.height=`${i.size}px`,this.particles.push(i)}createBurstParticles(){for(let e=0;e<12;e++){const s=e/12*Math.PI*2,o=3+Math.random()*2,r=document.createElement("div");r.className="cursor-particle",r.style.left=`${this.mouseX}px`,r.style.top=`${this.mouseY}px`,r.style.background="#ff6b35",r.style.boxShadow="0 0 8px rgba(255, 107, 53, 0.8)",this.container.appendChild(r),this.particles.push({element:r,x:this.mouseX,y:this.mouseY,vx:Math.cos(s)*o,vy:Math.sin(s)*o,life:1,decay:.03,size:3+Math.random()*2})}}animate(){for(let t=this.particles.length-1;t>=0;t--){const e=this.particles[t];e.x+=e.vx,e.y+=e.vy,e.vy+=.05,e.life-=e.decay,e.life<=0?(e.element.remove(),this.particles.splice(t,1)):(e.element.style.left=`${e.x}px`,e.element.style.top=`${e.y}px`,e.element.style.opacity=e.life,e.element.style.transform=`scale(${e.life})`)}requestAnimationFrame(()=>this.animate())}destroy(){this.isActive=!1,this.container?.remove(),this.cursor?.remove(),this.particles.forEach(t=>t.element.remove()),this.particles=[]}}typeof window<"u"&&window.addEventListener("DOMContentLoaded",()=>{new a});export{a as CursorParticlesEngine};
