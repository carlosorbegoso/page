const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/visual-effects-engine.CfhvYuRm.js","_astro/three.module.CkGWHzBH.js"])))=>i.map(i=>d[i]);
import{_ as x}from"./preload-helper.DhfBKQdW.js";import{V as C,T as H,S as R,P as N,W as $,B as P,a as m,b as y,A as b,c as S,C as A,d as _,D as q,M as k,e as W,f as V}from"./three.module.CkGWHzBH.js";const f={APP_NAME:"Carlos Orbegoso Portfolio",VERSION:"2.0.0",DEBUG:!1,LOGGING:{LEVEL:"warn",SHOW_TIMESTAMPS:!0,SHOW_PREFIX:!0,CONSOLE_OUTPUT:!0},ANIMATIONS:{ENABLED:!0,DURATION:{FAST:200,NORMAL:400,SLOW:800},EASING:{FAST:"ease",NORMAL:"cubic-bezier(0.4, 0, 0.2, 1)",SLOW:"cubic-bezier(0.4, 0, 0.2, 1)"}},THREE_JS:{ENABLED:!0,PERFORMANCE:{MOBILE:"low",TABLET:"medium",DESKTOP:"high"},PARTICLES:{COUNT:{MOBILE:100,TABLET:200,DESKTOP:500}}},LANGUAGES:{DEFAULT:"en",SUPPORTED:["en","es"],FALLBACK:"en"},THEMES:{DEFAULT:"light",SUPPORTED:["light","dark"],AUTO_DETECT:!0},BREAKPOINTS:{MOBILE:768,TABLET:1024,DESKTOP:1200},API:{BASE_URL:"",TIMEOUT:5e3,RETRY_ATTEMPTS:3},NOTIFICATIONS:{AUTO_HIDE:!0,DURATION:5e3,POSITION:"top-right",MAX_VISIBLE:3},SCROLL:{SMOOTH:!0,OFFSET:80,THROTTLE:100},PERFORMANCE:{LAZY_LOADING:!0,DEBOUNCE_DELAY:300,THROTTLE_DELAY:100,CLEANUP_INTERVAL:3e4}};class U{constructor(){this.prefix="[Portfolio]",this.logLevel="warn"}formatMessage(e,t){const i=new Date().toLocaleTimeString();return`${this.prefix} [${i}] [${e.toUpperCase()}] ${t}`}shouldLog(e){const t={error:0,warn:1,info:2,debug:3};return t[e]<=t[this.logLevel]}error(e,t=null){const i=this.formatMessage("error",e);console.error(i,t)}warn(e,t=null){const i=this.formatMessage("warn",e);console.warn(i,t)}info(e,t=null){if(this.shouldLog("info")){const i=this.formatMessage("info",e);console.info(i,t)}}debug(e,t=null){if(this.shouldLog("debug")){const i=this.formatMessage("debug",e);console.debug(i,t)}}performance(e,t=null){if(this.shouldLog("info")){const i=this.formatMessage("perf",e);console.log(i,t)}}animation(e,t=null){if(this.shouldLog("info")){const i=this.formatMessage("anim",e);console.log(i,t)}}threejs(e,t=null){if(this.shouldLog("info")){const i=this.formatMessage("three",e);console.log(i,t)}}setLogLevel(e){this.logLevel=e}}const p=new U,M={error:(n,e)=>p.error(n,e),warn:(n,e)=>p.warn(n,e),info:(n,e)=>p.info(n,e),debug:(n,e)=>p.debug(n,e),performance:(n,e)=>p.performance(n,e),animation:(n,e)=>p.animation(n,e),threejs:(n,e)=>p.threejs(n,e),setLogLevel:n=>p.setLogLevel(n)},l={select(n,e=document){return e.querySelector(n)},selectAll(n,e=document){return e.querySelectorAll(n)},create(n,e={},t=""){const i=document.createElement(n);return Object.entries(e).forEach(([s,o])=>{s==="className"?i.className=o:s==="textContent"?i.textContent=o:i.setAttribute(s,o)}),t&&(i.innerHTML=t),i},addClasses(n,...e){n.classList.add(...e)},removeClasses(n,...e){n.classList.remove(...e)},toggleClass(n,e,t){n.classList.toggle(e,t)}},d={on(n,e,t,i={}){n.addEventListener(e,t,i)},off(n,e,t){n.removeEventListener(e,t)},trigger(n,e,t={}){const i=new CustomEvent(e,{detail:t});n.dispatchEvent(i)}},G={debounce(n,e=f.PERFORMANCE.DEBOUNCE_DELAY){let t;return function(...i){clearTimeout(t),t=setTimeout(()=>n.apply(this,i),e)}},throttle(n,e=f.PERFORMANCE.THROTTLE_DELAY){let t=0;return function(...i){const s=Date.now();s-t>=e&&(t=s,n.apply(this,i))}},measureTime(n,e="Function execution"){performance.now();const t=n();return performance.now(),t}},v={light:{mobile:{background:"rgba(255, 255, 255, 0.9)",backdropFilter:"blur(20px)",borderOpacity:.15,shadow:"0 4px 20px rgba(0, 0, 0, 0.12)",borderColor:"rgba(100, 181, 246, 0.15)"},tablet:{background:"rgba(255, 255, 255, 0.6)",backdropFilter:"blur(15px)",borderOpacity:.08,shadow:"0 2px 15px rgba(0, 0, 0, 0.08)",borderColor:"rgba(100, 181, 246, 0.08)"},desktop:{background:"rgba(255, 255, 255, 0.15)",backdropFilter:"blur(6px)",borderOpacity:.02,shadow:"0 1px 8px rgba(0, 0, 0, 0.03)",borderColor:"rgba(100, 181, 246, 0.02)"}},dark:{mobile:{background:"rgba(26, 26, 46, 0.9)",backdropFilter:"blur(20px)",borderOpacity:.2,shadow:"0 4px 20px rgba(0, 0, 0, 0.2)",borderColor:"rgba(79, 195, 247, 0.2)"},tablet:{background:"rgba(26, 26, 46, 0.7)",backdropFilter:"blur(15px)",borderOpacity:.12,shadow:"0 2px 15px rgba(0, 0, 0, 0.15)",borderColor:"rgba(79, 195, 247, 0.12)"},desktop:{background:"rgba(26, 26, 46, 0.25)",backdropFilter:"blur(6px)",borderOpacity:.03,shadow:"0 1px 8px rgba(0, 0, 0, 0.05)",borderColor:"rgba(79, 195, 247, 0.03)"}},breakpoints:{mobile:768,tablet:1024,desktop:1440},transitions:{duration:"0.4s",easing:"cubic-bezier(0.4, 0, 0.2, 1)",header:"all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",theme:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},responsive:{mobile:{padding:"var(--spacing-sm) var(--spacing-md)",gap:"var(--spacing-md)",iconSize:"32px",buttonSize:"32px"},tablet:{padding:"var(--spacing-md) var(--spacing-lg)",gap:"var(--spacing-lg)",iconSize:"36px",buttonSize:"36px"},desktop:{padding:"var(--spacing-md) var(--spacing-xl)",gap:"var(--spacing-2xl)",iconSize:"40px",buttonSize:"36px"}}};function Y(n,e){return v[n]?.[e]||v.light.desktop}function I(n,e){const t=n/e;return n<=v.breakpoints.mobile||n<=v.breakpoints.tablet&&t<1.2?"mobile":n<=v.breakpoints.tablet||n<=v.breakpoints.desktop&&t<1.5?"tablet":"desktop"}class j{constructor(){this.deviceType=I(window.innerWidth,window.innerHeight),this.isMobile=this.deviceType==="mobile",this.isTablet=this.deviceType==="tablet",this.isDesktop=this.deviceType==="desktop",this.init()}detectDevice(){return I(window.innerWidth,window.innerHeight)}getTransparencyConfig(){const e=document.documentElement.getAttribute("data-theme")||"light";return Y(e,this.deviceType)}updateHeaderTransparency(){const e=document.querySelector(".header");if(!e)return;const t=this.getTransparencyConfig();e.style.setProperty("--header-bg",t.background),e.style.setProperty("--header-backdrop",t.backdropFilter),e.style.setProperty("--header-border",`1px solid ${t.borderColor}`),e.style.setProperty("--header-shadow",t.shadow),e.style.background=t.background,e.style.backdropFilter=t.backdropFilter,e.style.borderBottom=`1px solid ${t.borderColor}`,e.style.boxShadow=t.shadow}updateThemeTransparency(e){this.updateHeaderTransparency()}handleResize(){const e=this.detectDevice();e!==this.deviceType&&(this.deviceType=e,this.isMobile=this.deviceType==="mobile",this.isTablet=this.deviceType==="tablet",this.isDesktop=this.deviceType==="desktop",this.updateHeaderTransparency())}init(){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{this.setupDeviceDetector()}):this.setupDeviceDetector()}setupDeviceDetector(){this.updateHeaderTransparency(),window.addEventListener("resize",this.handleResize.bind(this)),new MutationObserver(t=>{t.forEach(i=>{if(i.type==="attributes"&&i.attributeName==="data-theme"){const s=document.documentElement.getAttribute("data-theme");this.updateThemeTransparency(s)}})}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]})}refresh(){this.updateHeaderTransparency()}getDeviceInfo(){return{type:this.deviceType,isMobile:this.isMobile,isTablet:this.isTablet,isDesktop:this.isDesktop,width:window.innerWidth,height:window.innerHeight,ratio:window.innerWidth/window.innerHeight}}}class K{constructor(){this.menuToggle=null,this.navLinks=null,this.isMenuOpen=!1,this.init()}init(){this.waitForComponents()}waitForComponents(){let t=0;const i=()=>{this.menuToggle=document.getElementById("menu-toggle"),this.navLinks=document.querySelector(".nav-links"),this.menuToggle&&this.navLinks?this.setupEventListeners():(t++,t<50?setTimeout(i,100):console.warn("⚠️ Elementos del menú móvil no encontrados después de múltiples intentos"))};i()}setupEventListeners(){this.menuToggle.addEventListener("click",()=>{this.toggleMenu()}),this.navLinks.addEventListener("click",e=>{e.target.classList.contains("nav-link")&&this.closeMenu()}),document.addEventListener("click",e=>{!this.menuToggle.contains(e.target)&&!this.navLinks.contains(e.target)&&this.closeMenu()}),window.addEventListener("resize",()=>{window.innerWidth>768&&this.closeMenu()})}toggleMenu(){this.isMenuOpen?this.closeMenu():this.openMenu()}openMenu(){this.isMenuOpen=!0,this.menuToggle.classList.add("active"),this.navLinks.classList.add("active"),document.body.style.overflow="hidden"}closeMenu(){this.isMenuOpen=!1,this.menuToggle.classList.remove("active"),this.navLinks.classList.remove("active"),document.body.style.overflow=""}forceClose(){this.closeMenu()}isOpen(){return this.isMenuOpen}}let F=class{constructor(){this.scene=null,this.camera=null,this.renderer=null,this.flowingParticles=null,this.auroraWaves=[],this.floatingOrbs=[],this.nebulaClouds=null,this.ambientStars=null,this.animationId=null,this.isInitialized=!1,this.currentTheme="dark",this.time=0,this.mouse=new C(0,0),this.targetMouse=new C(0,0),this.isMobile=window.innerWidth<=768,this.isLowPower=window.innerWidth<=480||navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4;const e=this.isLowPower?.3:this.isMobile?.5:1;this.config={flowingParticles:{count:Math.floor(300*e),layers:3},aurora:{waves:this.isMobile?2:3,segments:Math.floor(80*e)},orbs:{count:Math.floor(6*e)},nebula:{count:Math.floor(40*e)},stars:{count:Math.floor(150*e)}}}async init(e="hero-particles"){try{return typeof H>"u"?(console.warn("Three.js not available"),!1):(this.setupScene(),this.setupCamera(),this.setupRenderer(e),this.createAmbientStars(),this.createFlowingParticles(),this.createAuroraWaves(),this.createFloatingOrbs(),this.createNebulaClouds(),this.setupEventListeners(),this.animate(),this.isInitialized=!0,!0)}catch(t){return console.error("Error initializing Hero Three.js Engine:",t),!1}}setupScene(){this.scene=new R}setupCamera(){this.camera=new N(60,window.innerWidth/window.innerHeight,.1,1e3),this.camera.position.z=50}setupRenderer(e){const t=document.getElementById(e);if(!t){console.warn(`Container ${e} not found`);return}this.renderer=new $({antialias:!this.isMobile,alpha:!0,powerPreference:this.isMobile?"low-power":"high-performance"}),this.renderer.setSize(t.offsetWidth,t.offsetHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,this.isMobile?1.5:2)),this.renderer.setClearColor(0,0),t.appendChild(this.renderer.domElement),this.renderer.domElement.style.position="absolute",this.renderer.domElement.style.top="0",this.renderer.domElement.style.left="0",this.renderer.domElement.style.zIndex="1",this.renderer.domElement.style.pointerEvents="none",this.container=t}createAmbientStars(){const e=this.config.stars.count,t=new P,i=new Float32Array(e*3),s=new Float32Array(e),o=new Float32Array(e);for(let r=0;r<e;r++)i[r*3]=(Math.random()-.5)*200,i[r*3+1]=(Math.random()-.5)*120,i[r*3+2]=-50-Math.random()*50,s[r]=.3+Math.random()*.7,o[r]=Math.random()*Math.PI*2;t.setAttribute("position",new m(i,3)),t.setAttribute("size",new m(s,1)),t.setAttribute("twinklePhase",new m(o,1));const a=new y({uniforms:{time:{value:0},pixelRatio:{value:this.renderer.getPixelRatio()}},vertexShader:`
                attribute float size;
                attribute float twinklePhase;
                uniform float time;
                uniform float pixelRatio;
                varying float vTwinkle;

                void main() {
                    vTwinkle = 0.5 + 0.5 * sin(time * 1.5 + twinklePhase);

                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * pixelRatio * (100.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,fragmentShader:`
                varying float vTwinkle;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    float alpha = vTwinkle * smoothstep(0.5, 0.0, dist) * 0.8;
                    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
                }
            `,transparent:!0,blending:b,depthWrite:!1});this.ambientStars=new S(t,a),this.scene.add(this.ambientStars)}createFlowingParticles(){const e=this.config.flowingParticles.count,t=new P,i=new Float32Array(e*3),s=new Float32Array(e*3),o=new Float32Array(e),a=new Float32Array(e*3),r=new Float32Array(e);for(let c=0;c<e;c++){i[c*3]=(Math.random()-.5)*120,i[c*3+1]=(Math.random()-.5)*80,i[c*3+2]=(Math.random()-.5)*40-10;const g=.52+Math.random()*.08,w=.7+Math.random()*.3,T=.5+Math.random()*.2,E=new A;E.setHSL(g,w,T),s[c*3]=E.r,s[c*3+1]=E.g,s[c*3+2]=E.b,o[c]=1+Math.random()*2,a[c*3]=(Math.random()-.5)*.02,a[c*3+1]=.01+Math.random()*.03,a[c*3+2]=(Math.random()-.5)*.01,r[c]=Math.random()*Math.PI*2}t.setAttribute("position",new m(i,3)),t.setAttribute("color",new m(s,3)),t.setAttribute("size",new m(o,1)),t.setAttribute("phase",new m(r,1)),this.particleVelocities=a;const h=new y({uniforms:{time:{value:0},pixelRatio:{value:this.renderer.getPixelRatio()}},vertexShader:`
                attribute vec3 color;
                attribute float size;
                attribute float phase;
                uniform float time;
                uniform float pixelRatio;
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    vColor = color;

                    vec3 pos = position;
                    // Gentle wave motion
                    pos.x += sin(time * 0.5 + phase + position.y * 0.05) * 3.0;
                    pos.z += cos(time * 0.3 + phase) * 2.0;

                    // Pulsing alpha
                    vAlpha = 0.4 + 0.3 * sin(time * 2.0 + phase);

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * pixelRatio * (150.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,fragmentShader:`
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    // Soft glow
                    float alpha = vAlpha * smoothstep(0.5, 0.1, dist);
                    vec3 finalColor = vColor + vec3(0.2) * (1.0 - dist * 2.0);

                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,transparent:!0,blending:b,depthWrite:!1});this.flowingParticles=new S(t,h),this.scene.add(this.flowingParticles)}createAuroraWaves(){const e=this.config.aurora.waves,t=this.config.aurora.segments;for(let i=0;i<e;i++){const s=new _(140,30,t,1),o=new y({uniforms:{time:{value:0},waveIndex:{value:i},totalWaves:{value:e}},vertexShader:`
                    uniform float time;
                    uniform float waveIndex;
                    varying vec2 vUv;
                    varying float vWave;

                    void main() {
                        vUv = uv;

                        vec3 pos = position;

                        // Multiple wave layers
                        float wave1 = sin(uv.x * 6.0 + time * 0.8 + waveIndex * 2.0) * 4.0;
                        float wave2 = sin(uv.x * 3.0 - time * 0.5 + waveIndex) * 2.0;
                        float wave3 = cos(uv.x * 8.0 + time * 1.2) * 1.5;

                        pos.y += wave1 + wave2 + wave3;
                        pos.z += sin(uv.x * 4.0 + time * 0.3) * 3.0;

                        vWave = (wave1 + wave2 + wave3) / 7.5 + 0.5;

                        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                    }
                `,fragmentShader:`
                    uniform float time;
                    uniform float waveIndex;
                    uniform float totalWaves;
                    varying vec2 vUv;
                    varying float vWave;

                    void main() {
                        // Aurora colors - cyan to purple gradient
                        vec3 color1 = vec3(0.0, 0.9, 0.8); // Cyan
                        vec3 color2 = vec3(0.3, 0.5, 1.0); // Blue
                        vec3 color3 = vec3(0.6, 0.2, 0.8); // Purple

                        float t = vUv.x + sin(time * 0.5) * 0.2;
                        vec3 color = mix(color1, color2, smoothstep(0.0, 0.5, t));
                        color = mix(color, color3, smoothstep(0.5, 1.0, t));

                        // Vertical fade
                        float verticalFade = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);

                        // Wave intensity
                        float intensity = vWave * 0.5 + 0.5;

                        // Edge fade
                        float edgeFade = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x);

                        float alpha = verticalFade * intensity * edgeFade * 0.15;
                        alpha *= 1.0 - (waveIndex / totalWaves) * 0.3;

                        gl_FragColor = vec4(color, alpha);
                    }
                `,transparent:!0,blending:b,depthWrite:!1,side:q}),a=new k(s,o);a.position.set(0,20-i*8,-30-i*5),a.rotation.x=-.3,this.auroraWaves.push(a),this.scene.add(a)}}createFloatingOrbs(){const e=this.config.orbs.count;for(let t=0;t<e;t++){const i=3+Math.random()*4,s=new W(i,32,32),o=.5+Math.random()*.15,a=new A;a.setHSL(o,.8,.5);const r=new y({uniforms:{time:{value:0},color:{value:a},phase:{value:Math.random()*Math.PI*2}},vertexShader:`
                    varying vec3 vNormal;
                    varying vec3 vPosition;

                    void main() {
                        vNormal = normalize(normalMatrix * normal);
                        vPosition = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,fragmentShader:`
                    uniform float time;
                    uniform vec3 color;
                    uniform float phase;
                    varying vec3 vNormal;
                    varying vec3 vPosition;

                    void main() {
                        // Fresnel effect for glow
                        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);

                        // Pulsing
                        float pulse = 0.5 + 0.3 * sin(time * 1.5 + phase);

                        // Inner glow
                        float innerGlow = exp(-length(vPosition) * 0.2) * 0.5;

                        float alpha = (fresnel * 0.6 + innerGlow) * pulse;

                        gl_FragColor = vec4(color, alpha * 0.4);
                    }
                `,transparent:!0,blending:b,depthWrite:!1,side:V}),h=new k(s,r);h.position.set((Math.random()-.5)*100,(Math.random()-.5)*60,(Math.random()-.5)*30-20),h.userData={originalPos:h.position.clone(),floatPhase:Math.random()*Math.PI*2,floatSpeed:.3+Math.random()*.3,floatAmplitude:5+Math.random()*5},this.floatingOrbs.push(h),this.scene.add(h)}}createNebulaClouds(){const e=this.config.nebula.count,t=new P,i=new Float32Array(e*3),s=new Float32Array(e*3),o=new Float32Array(e);for(let r=0;r<e;r++){i[r*3]=(Math.random()-.5)*150,i[r*3+1]=(Math.random()-.5)*100,i[r*3+2]=-60-Math.random()*40;const h=.6+Math.random()*.2,c=new A;c.setHSL(h,.5,.3),s[r*3]=c.r,s[r*3+1]=c.g,s[r*3+2]=c.b,o[r]=20+Math.random()*40}t.setAttribute("position",new m(i,3)),t.setAttribute("color",new m(s,3)),t.setAttribute("size",new m(o,1));const a=new y({uniforms:{time:{value:0},pixelRatio:{value:this.renderer.getPixelRatio()}},vertexShader:`
                attribute vec3 color;
                attribute float size;
                uniform float time;
                uniform float pixelRatio;
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    vColor = color;
                    vAlpha = 0.1 + 0.05 * sin(time * 0.5 + position.x * 0.1);

                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * pixelRatio * (100.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,fragmentShader:`
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    // Very soft cloud effect
                    float alpha = vAlpha * smoothstep(0.5, 0.0, dist);

                    gl_FragColor = vec4(vColor, alpha);
                }
            `,transparent:!0,blending:b,depthWrite:!1});this.nebulaClouds=new S(t,a),this.scene.add(this.nebulaClouds)}setupEventListeners(){window.addEventListener("resize",()=>this.onWindowResize()),document.addEventListener("mousemove",e=>{this.targetMouse.x=e.clientX/window.innerWidth*2-1,this.targetMouse.y=-(e.clientY/window.innerHeight)*2+1}),document.addEventListener("touchmove",e=>{e.touches.length>0&&(this.targetMouse.x=e.touches[0].clientX/window.innerWidth*2-1,this.targetMouse.y=-(e.touches[0].clientY/window.innerHeight)*2+1)})}onWindowResize(){if(!this.renderer||!this.camera||!this.container)return;const e=this.container.offsetWidth,t=this.container.offsetHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t)}animate(){if(this.animationId=requestAnimationFrame(()=>this.animate()),!!this.isInitialized){if(this.time+=.016,this.mouse.x+=(this.targetMouse.x-this.mouse.x)*.05,this.mouse.y+=(this.targetMouse.y-this.mouse.y)*.05,this.camera.position.x=this.mouse.x*8,this.camera.position.y=this.mouse.y*5,this.camera.lookAt(0,0,0),this.ambientStars&&(this.ambientStars.material.uniforms.time.value=this.time,this.ambientStars.rotation.y+=1e-4),this.flowingParticles){this.flowingParticles.material.uniforms.time.value=this.time;const e=this.flowingParticles.geometry.attributes.position.array;for(let t=0;t<e.length/3;t++)e[t*3]+=this.particleVelocities[t*3],e[t*3+1]+=this.particleVelocities[t*3+1],e[t*3+2]+=this.particleVelocities[t*3+2],e[t*3+1]>50&&(e[t*3+1]=-50,e[t*3]=(Math.random()-.5)*120),e[t*3]>70&&(e[t*3]=-70),e[t*3]<-70&&(e[t*3]=70);this.flowingParticles.geometry.attributes.position.needsUpdate=!0}this.auroraWaves.forEach(e=>{e.material.uniforms.time.value=this.time}),this.floatingOrbs.forEach(e=>{const t=e.userData;e.position.y=t.originalPos.y+Math.sin(this.time*t.floatSpeed+t.floatPhase)*t.floatAmplitude,e.position.x=t.originalPos.x+Math.cos(this.time*t.floatSpeed*.7+t.floatPhase)*t.floatAmplitude*.5,e.material.uniforms.time.value=this.time}),this.nebulaClouds&&(this.nebulaClouds.material.uniforms.time.value=this.time,this.nebulaClouds.rotation.y+=2e-4),this.renderer.render(this.scene,this.camera)}}updateTheme(e){this.currentTheme=e}dispose(){this.animationId&&cancelAnimationFrame(this.animationId),this.flowingParticles&&(this.flowingParticles.geometry.dispose(),this.flowingParticles.material.dispose()),this.ambientStars&&(this.ambientStars.geometry.dispose(),this.ambientStars.material.dispose()),this.nebulaClouds&&(this.nebulaClouds.geometry.dispose(),this.nebulaClouds.material.dispose()),this.auroraWaves.forEach(e=>{e.geometry.dispose(),e.material.dispose()}),this.floatingOrbs.forEach(e=>{e.geometry.dispose(),e.material.dispose()}),this.renderer&&(this.renderer.dispose(),this.renderer.domElement&&this.renderer.domElement.parentNode&&this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)),this.scene=null,this.camera=null,this.renderer=null,this.flowingParticles=null,this.auroraWaves=[],this.floatingOrbs=[],this.nebulaClouds=null,this.ambientStars=null,this.isInitialized=!1}};const J=Object.freeze(Object.defineProperty({__proto__:null,HeroThreeEngine:F},Symbol.toStringTag,{value:"Module"}));class B{constructor(){this.hero=null,this.heroContent=null,this.techBadges=[],this.buttons=[],this.scrollIndicator=null,this.floatingElements=[],this.isAnimating=!1,this.observer=null,this.heroThreeEngine=null,this.textEffectsEngine=null,this.init()}init(){this.setupElements(),this.setupIntersectionObserver(),this.setupEventListeners(),this.startInitialAnimations()}setupElements(){this.hero=document.querySelector(".hero"),this.heroContent=document.querySelector(".hero-content"),this.techBadges=document.querySelectorAll(".tech-badge"),this.buttons=document.querySelectorAll(".btn-hero"),this.scrollIndicator=document.querySelector(".hero-scroll-indicator"),this.floatingElements=document.querySelectorAll(".floating-element")}setupIntersectionObserver(){this.hero&&(this.observer=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&this.onHeroVisible()})},{threshold:.1,rootMargin:"0px 0px -100px 0px"}),this.observer.observe(this.hero))}setupEventListeners(){this.scrollIndicator&&this.scrollIndicator.addEventListener("click",()=>{this.scrollToNextSection()}),this.techBadges.forEach(e=>{e.addEventListener("mouseenter",()=>{this.animateTechBadge(e,"enter")}),e.addEventListener("mouseleave",()=>{this.animateTechBadge(e,"leave")})}),this.buttons.forEach(e=>{e.addEventListener("mouseenter",()=>{this.animateButton(e,"enter")}),e.addEventListener("mouseleave",()=>{this.animateButton(e,"leave")})}),window.addEventListener("scroll",()=>{this.updateParallax()}),window.addEventListener("resize",()=>{this.updateResponsiveAnimations()})}startInitialAnimations(){if(!this.heroContent)return;this.heroContent.querySelectorAll(".animate-fade-in-up").forEach((t,i)=>{const s=parseFloat(t.dataset.delay)||i*.1;setTimeout(()=>{t.style.animationDelay=`${s}s`,t.classList.add("animate-in")},s*1e3)}),this.techBadges.forEach((t,i)=>{const s=parseFloat(t.dataset.delay)||i*.1;setTimeout(()=>{this.animateTechBadge(t,"enter")},(1.4+s)*1e3)})}onHeroVisible(){this.isAnimating||(this.isAnimating=!0,this.animateFloatingElements(),this.scrollIndicator&&this.animateScrollIndicator(),this.textEffectsEngine||this.initTextEffects(),this.initThreeJSAnimations())}animateTechBadge(e,t){if(t==="enter"){e.style.transform="translateY(-8px) scale(1.05)",e.style.boxShadow="0 12px 30px rgba(100, 181, 246, 0.3)";const i=e.querySelector(".tech-icon");i&&(i.style.transform="scale(1.2) rotate(10deg)");const s=e.querySelector(".tech-glow");s&&(s.style.opacity="1")}else{e.style.transform="translateY(0) scale(1)",e.style.boxShadow="0 4px 15px rgba(100, 181, 246, 0.1)";const i=e.querySelector(".tech-icon");i&&(i.style.transform="scale(1) rotate(0deg)");const s=e.querySelector(".tech-glow");s&&(s.style.opacity="0")}}animateButton(e,t){if(t==="enter"){e.style.transform="translateY(-4px)";const i=e.querySelector(".btn-icon");if(i&&(i.style.transform="scale(1.1)"),e.classList.contains("btn-primary")){const s=e.querySelector(".btn-particles");s&&(s.style.opacity="1")}}else{e.style.transform="translateY(0)";const i=e.querySelector(".btn-icon");i&&(i.style.transform="scale(1)");const s=e.querySelector(".btn-particles");s&&(s.style.opacity="0")}}animateFloatingElements(){this.floatingElements.forEach((e,t)=>{const i=t*.5;setTimeout(()=>{e.style.animation="float 6s ease-in-out infinite",e.style.opacity="1"},i*1e3)})}animateScrollIndicator(){if(!this.scrollIndicator)return;this.scrollIndicator.querySelectorAll(".arrow-line").forEach((i,s)=>{i.style.animation=`arrowLine${s+1} 2s infinite`});const t=this.scrollIndicator.querySelector(".scroll-text");t&&(t.style.animation="fadeInOut 2s infinite")}updateParallax(){if(!this.hero)return;const t=window.pageYOffset*-.5;this.hero.querySelectorAll(".hero-particles, .hero-constellations, .hero-stars").forEach(s=>{s.style.transform=`translateY(${t}px)`}),this.floatingElements.forEach((s,o)=>{const a=t*(.1+o*.05);s.style.transform=`translateY(${a}px)`})}updateResponsiveAnimations(){window.innerWidth<=768?this.heroContent?.style.setProperty("--animation-duration","0.6s"):this.heroContent?.style.setProperty("--animation-duration","0.8s")}scrollToNextSection(){const e=this.hero?.nextElementSibling;e&&e.scrollIntoView({behavior:"smooth",block:"start"})}initThreeJSAnimations(){try{this.heroThreeEngine=new F,this.heroThreeEngine.init("hero-particles").then(e=>{e&&this.setupThemeIntegration()})}catch(e){console.warn("Three.js no está disponible para el hero:",e)}}initTextEffects(){}setupThemeIntegration(){new MutationObserver(t=>{t.forEach(i=>{if(i.type==="attributes"&&i.attributeName==="data-theme"){const s=document.documentElement.getAttribute("data-theme");this.heroThreeEngine&&this.heroThreeEngine.updateTheme(s)}})}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]})}createHeroParticles(){const e=document.getElementById("hero-particles");if(e)for(let t=0;t<20;t++){const i=document.createElement("div");i.className="hero-particle",i.style.cssText=`
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(100, 181, 246, 0.6);
                border-radius: 50%;
                left: ${Math.random()*100}%;
                top: ${Math.random()*100}%;
                animation: heroParticleFloat ${3+Math.random()*4}s ease-in-out infinite;
                animation-delay: ${Math.random()*2}s;
            `,e.appendChild(i)}}createHeroConstellations(){const e=document.getElementById("hero-constellations");if(e)for(let t=0;t<3;t++){const i=document.createElement("div");i.className="hero-constellation",i.style.cssText=`
                position: absolute;
                width: 100px;
                height: 100px;
                left: ${20+t*30}%;
                top: ${30+t*20}%;
                opacity: 0.3;
                animation: heroConstellationGlow ${4+t}s ease-in-out infinite;
            `,e.appendChild(i)}}createHeroStars(){const e=document.getElementById("hero-stars");if(e)for(let t=0;t<15;t++){const i=document.createElement("div");i.className="hero-star",i.style.cssText=`
                position: absolute;
                width: 1px;
                height: 1px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                left: ${Math.random()*100}%;
                top: ${Math.random()*100}%;
                animation: heroStarTwinkle ${2+Math.random()*3}s ease-in-out infinite;
                animation-delay: ${Math.random()*2}s;
            `,e.appendChild(i)}}destroy(){this.observer&&this.observer.disconnect(),this.heroThreeEngine&&(this.heroThreeEngine.dispose(),this.heroThreeEngine=null),this.textEffectsEngine&&(this.textEffectsEngine.dispose(),this.textEffectsEngine=null),this.scrollIndicator&&this.scrollIndicator.removeEventListener("click",this.scrollToNextSection),this.hero=null,this.heroContent=null,this.techBadges=[],this.buttons=[],this.scrollIndicator=null,this.floatingElements=[]}}document.addEventListener("DOMContentLoaded",()=>{new B});class X{constructor(){this.aboutSection=null,this.observer=null,this.isInitialized=!1,this.init()}init(){try{this.setupIntersectionObserver(),this.setupScrollAnimations(),this.setupHoverEffects()}catch(e){console.error("❌ Error inicializando About Animations:",e)}}setupIntersectionObserver(){this.observer=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting?this.onAboutVisible(t.target):this.onAboutHidden(t.target)})},{threshold:.3,rootMargin:"0px 0px -100px 0px"}),this.aboutSection=document.getElementById("about"),this.aboutSection&&this.observer.observe(this.aboutSection)}onAboutVisible(e){this.isInitialized||(this.isInitialized=!0,this.activateCSSAnimations(),this.initParticleEffects())}onAboutHidden(e){this.isInitialized=!1}activateCSSAnimations(){this.aboutSection.querySelectorAll(".animate-fade-in-up").forEach((t,i)=>{const s=parseFloat(t.getAttribute("data-delay"))||0;setTimeout(()=>{t.style.opacity="1",t.style.transform="translateY(0)"},s*1e3)})}initParticleEffects(){this.initAvatarParticles(),this.initStatsParticles(),this.initSpecialtyParticles(),this.initTechParticles(),this.initValuesParticles(),this.initCounterAnimations(),this.initIconAnimations()}initIconAnimations(){document.querySelectorAll(".specialty-icon-inline").forEach((o,a)=>{o.style.animationDelay=`${a*.2}s`,o.classList.add("icon-float")}),document.querySelectorAll(".tech-icon").forEach((o,a)=>{o.style.animationDelay=`${a*.1}s`,o.classList.add("icon-pulse")}),document.querySelectorAll(".value-icon-inline").forEach((o,a)=>{o.style.animationDelay=`${a*.15}s`,o.classList.add("icon-rotate")});const s=document.querySelector(".avatar-icon");s&&s.classList.add("avatar-icon-float")}initAvatarParticles(){const e=document.querySelector(".avatar-container");e&&this.createFloatingParticles(e,30,{color:"var(--primary-color)",size:"2px",duration:"8s"})}initStatsParticles(){document.querySelectorAll(".stat-main-item").forEach((t,i)=>{this.createRisingParticles(t,20,{color:"var(--accent-color)",size:"1px",duration:"6s",delay:i*200})})}initSpecialtyParticles(){document.querySelectorAll(".specialty-inline-item").forEach((t,i)=>{this.createOrbitalParticles(t,15,{color:"var(--primary-color)",size:"1.5px",duration:"10s",delay:i*300})})}initTechParticles(){document.querySelectorAll(".tech-tag-compact").forEach((t,i)=>{this.createExpandingParticles(t,12,{color:"var(--accent-color)",size:"1px",duration:"5s",delay:i*100})})}initValuesParticles(){document.querySelectorAll(".value-inline-item").forEach((t,i)=>{this.createSpiralParticles(t,18,{color:"var(--primary-color)",size:"1.5px",duration:"12s",delay:i*400})})}createFloatingParticles(e,t,i){const s=document.createElement("div");s.className="floating-particles",s.style.cssText=`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `,e.style.position="relative",e.appendChild(s);for(let o=0;o<t;o++)this.createParticle(s,i,o)}createRisingParticles(e,t,i){const s=document.createElement("div");s.className="rising-particles",s.style.cssText=`
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `,e.style.position="relative",e.appendChild(s);for(let o=0;o<t;o++)this.createRisingParticle(s,i,o)}createOrbitalParticles(e,t,i){const s=document.createElement("div");s.className="orbital-particles",s.style.cssText=`
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `,e.style.position="relative",e.appendChild(s);for(let o=0;o<t;o++)this.createOrbitalParticle(s,i,o)}createExpandingParticles(e,t,i){const s=document.createElement("div");s.className="expanding-particles",s.style.cssText=`
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `,e.style.position="relative",e.appendChild(s);for(let o=0;o<t;o++)this.createExpandingParticle(s,i,o)}createSpiralParticles(e,t,i){const s=document.createElement("div");s.className="spiral-particles",s.style.cssText=`
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `,e.style.position="relative",e.appendChild(s);for(let o=0;o<t;o++)this.createSpiralParticle(s,i,o)}createParticle(e,t,i){const s=document.createElement("div");s.className="particle";const o=i/t.count*Math.PI*2,a=60+Math.random()*40,r=Math.random()*t.duration;s.style.cssText=`
            position: absolute;
            width: ${t.size};
            height: ${t.size};
            background: ${t.color};
            border-radius: 50%;
            top: calc(50% + ${Math.sin(o)*a}px);
            left: calc(50% + ${Math.cos(o)*a}px);
            opacity: 0;
            animation: floatingParticle ${t.duration}s ease-in-out infinite;
            animation-delay: ${r}s;
        `,e.appendChild(s)}createRisingParticle(e,t,i){const s=document.createElement("div");s.className="particle";const o=t.delay+i*50;s.style.cssText=`
            position: absolute;
            width: ${t.size};
            height: ${t.size};
            background: ${t.color};
            border-radius: 50%;
            top: 50%;
            left: 50%;
            opacity: 0;
            animation: risingParticle ${t.duration}s ease-out infinite;
            animation-delay: ${o}ms;
        `,e.appendChild(s)}createOrbitalParticle(e,t,i){const s=document.createElement("div");s.className="particle";const o=i/t.count*Math.PI*2,a=40+Math.random()*20,r=t.delay+i*100;s.style.cssText=`
            position: absolute;
            width: ${t.size};
            height: ${t.size};
            background: ${t.color};
            border-radius: 50%;
            top: calc(50% + ${Math.sin(o)*a}px);
            left: calc(50% + ${Math.cos(o)*a}px);
            opacity: 0;
            animation: orbitalParticle ${t.duration}s linear infinite;
            animation-delay: ${r}ms;
        `,e.appendChild(s)}createExpandingParticle(e,t,i){const s=document.createElement("div");s.className="particle",i/t.count*Math.PI*2;const o=t.delay+i*80;s.style.cssText=`
            position: absolute;
            width: ${t.size};
            height: ${t.size};
            background: ${t.color};
            border-radius: 50%;
            top: 50%;
            left: 50%;
            opacity: 0;
            animation: expandingParticle ${t.duration}s ease-out infinite;
            animation-delay: ${o}ms;
        `,e.appendChild(s)}createSpiralParticle(e,t,i){const s=document.createElement("div");s.className="particle";const o=t.delay+i*200;s.style.cssText=`
            position: absolute;
            width: ${t.size};
            height: ${t.size};
            background: ${t.color};
            border-radius: 50%;
            top: 50%;
            left: 50%;
            opacity: 0;
            animation: spiralParticle ${t.duration}s ease-in-out infinite;
            animation-delay: ${o}ms;
        `,e.appendChild(s)}setupScrollAnimations(){window.addEventListener("scroll",()=>{if(!this.aboutSection||!this.isInitialized)return;const e=this.aboutSection.getBoundingClientRect(),t=(window.innerHeight-e.top)/(window.innerHeight+e.height);t>0&&t<1&&this.updateScrollEffects(t)})}initCounterAnimations(){document.querySelectorAll(".stat-main-number").forEach(t=>{parseInt(t.textContent);const i=t.textContent.replace(/\d/g,""),s=parseInt(t.textContent.replace(/\D/g,""));t.textContent="0"+i;const o=new IntersectionObserver(a=>{a.forEach(r=>{r.isIntersecting&&(this.animateCounter(t,0,s,i),o.unobserve(r.target))})},{threshold:.5});o.observe(t)})}animateCounter(e,t,i,s){const a=performance.now(),r=h=>{const c=h-a,g=Math.min(c/2e3,1),w=1-Math.pow(1-g,4),T=Math.floor(t+(i-t)*w);e.textContent=T+s,e.style.transform=`scale(${1+g*.1})`,e.style.color=`hsl(${200+g*60}, 70%, ${60+g*20}%)`,g<1?requestAnimationFrame(r):(e.style.transform="scale(1)",e.style.color="",this.createCelebrationEffect(e))};requestAnimationFrame(r)}createCelebrationEffect(e){const t=e.parentElement,i=document.createElement("div");i.className="celebration-particles",i.style.cssText=`
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 10;
        `,t.style.position="relative",t.appendChild(i);for(let s=0;s<8;s++){const o=document.createElement("div");o.className="celebration-particle",o.style.cssText=`
                position: absolute;
            width: 6px;
            height: 6px;
            background: linear-gradient(45deg, #64B5F6, #4FC3F7);
            border-radius: 50%;
            animation: celebrationParticle 1.5s ease-out forwards;
            animation-delay: ${s*.1}s;
        `,i.appendChild(o)}setTimeout(()=>{i.remove()},2e3)}updateScrollEffects(e){const t=document.querySelector(".avatar-container");if(t){const s=e*20;t.style.transform=`translateY(${s}px)`}document.querySelectorAll(".stat-main-item").forEach((s,o)=>{const a=Math.max(.3,1-e*.5);s.style.opacity=a})}setupHoverEffects(){document.querySelectorAll(".specialty-inline-item").forEach(s=>{s.addEventListener("mouseenter",()=>{this.activateHoverEffect(s,"specialty")}),s.addEventListener("mouseleave",()=>{this.deactivateHoverEffect(s,"specialty")})}),document.querySelectorAll(".tech-tag-compact").forEach(s=>{s.addEventListener("mouseenter",()=>{this.activateHoverEffect(s,"tech")}),s.addEventListener("mouseleave",()=>{this.deactivateHoverEffect(s,"tech")})}),document.querySelectorAll(".value-inline-item").forEach(s=>{s.addEventListener("mouseenter",()=>{this.activateHoverEffect(s,"value")}),s.addEventListener("mouseleave",()=>{this.deactivateHoverEffect(s,"value")})})}activateHoverEffect(e,t){switch(t){case"specialty":e.style.transform="translateY(-8px) scale(1.05)",e.style.boxShadow="0 20px 40px rgba(100, 181, 246, 0.15)";break;case"tech":e.style.transform="translateY(-5px) scale(1.1)",e.style.boxShadow="0 15px 30px rgba(100, 181, 246, 0.2)";break;case"value":e.style.transform="translateY(-6px) scale(1.03)",e.style.boxShadow="0 18px 35px rgba(100, 181, 246, 0.18)";break}}deactivateHoverEffect(e,t){e.style.transform="translateY(0) scale(1)",e.style.boxShadow="none"}destroy(){this.observer&&this.observer.disconnect()}}class Q{constructor(){this.sequence=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"],this.currentIndex=0,this.overlay=null,this.style=null}handleKeyPress(e){e===this.sequence[this.currentIndex]?(this.currentIndex++,this.currentIndex===this.sequence.length&&(this.activate(),this.currentIndex=0)):this.currentIndex=0}activate(){this.createOverlay(),this.playSound(),this.setupAutoClose()}createOverlay(){this.overlay=document.createElement("div"),this.overlay.className="konami-overlay",this.overlay.innerHTML=`
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
        `,document.body.appendChild(this.overlay),this.injectStyles(),this.overlay.addEventListener("click",()=>this.close())}injectStyles(){this.style=document.createElement("style"),this.style.textContent=`
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
        `,document.head.appendChild(this.style)}playSound(){try{const e=new(window.AudioContext||window.webkitAudioContext),t=e.createOscillator(),i=e.createGain();t.connect(i),i.connect(e.destination),t.frequency.setValueAtTime(587.33,e.currentTime),t.frequency.setValueAtTime(880,e.currentTime+.1),t.frequency.setValueAtTime(1174.66,e.currentTime+.2),i.gain.setValueAtTime(.3,e.currentTime),i.gain.exponentialRampToValueAtTime(.01,e.currentTime+.5),t.start(e.currentTime),t.stop(e.currentTime+.5)}catch{}}setupAutoClose(){setTimeout(()=>{document.body.contains(this.overlay)&&this.close()},5e3)}close(){this.overlay&&(this.overlay.style.animation="konamiFadeOut 0.3s ease forwards",setTimeout(()=>{this.overlay?.remove(),this.style?.remove(),this.overlay=null,this.style=null},300))}}let L=null,O=null,z=null;class Z{constructor(){this.visualEngine=null,this.brainEngine=null,this.neuralBackground=null,this.heroEngine=null,this.cursorEngine=null,this.deviceDetector=null,this.mobileMenuManager=null,this.heroAnimations=null,this.aboutAnimations=null,this.konamiEasterEgg=null,this.isInitialized=!1,this.modules=new Map}async init(){try{await this.initializeBasicModules(),this.setupBasicFeatures(),await this.initializeAdvancedModules(),this.setupGlobalEvents(),this.isInitialized=!0,M.info("Portfolio initialized")}catch(e){console.error("Error initializing portfolio:",e)}}async initializeBasicModules(){this.deviceDetector=new j,this.mobileMenuManager=new K,this.heroAnimations=new B,this.aboutAnimations=new X,this.konamiEasterEgg=new Q}async initializeAdvancedModules(){const e=window.innerWidth<=768,t=window.innerWidth<=480||navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4;if(!e)try{L=(await x(()=>import("./visual-effects-engine.CfhvYuRm.js"),__vite__mapDeps([0,1]))).VisualEffectsEngine,this.visualEngine=new L;const s=localStorage.getItem("theme")||f.THEMES.DEFAULT;this.visualEngine.updateTheme(s),this.initializeSectionEffects()}catch(i){M.error("Error initializing visual engine:",i)}if(!t)try{O=(await x(()=>Promise.resolve().then(()=>J),void 0)).HeroThreeEngine,this.heroEngine=new O,await this.heroEngine.init("hero-particles")}catch(i){M.error("Error initializing Hero Three.js Engine:",i)}if(!e)try{z=(await x(()=>import("./cursor-particles-engine.CtQFKbK1.js"),[])).CursorParticlesEngine,this.cursorEngine=new z}catch(i){console.error("Error initializing Cursor Particles Engine:",i)}}initializeSectionEffects(){if(!this.visualEngine)return;[{name:"Hero",containerId:"hero-effects"},{name:"About",containerId:"about-effects"},{name:"Experience",containerId:"experience-effects"},{name:"Skills",containerId:"skills-effects"},{name:"Projects",containerId:"projects-effects"},{name:"Contact",containerId:"contact-effects"}].forEach(t=>{document.getElementById(t.name.toLowerCase())&&this.visualEngine.initSectionEffects(t.name,t.containerId)}),this.setupSectionEffectsObserver()}setupSectionEffectsObserver(){const e=["hero","about","experience","skills","projects","contact"],t=new IntersectionObserver(i=>{i.forEach(s=>{s.isIntersecting&&s.target.classList.add("section-effects-active")})},{threshold:.1,rootMargin:"0px 0px -100px 0px"});e.forEach(i=>{const s=document.getElementById(i);s&&t.observe(s)})}setupBasicFeatures(){this.setupThemeToggle(),this.setupMobileMenu(),this.setupSmoothScrolling(),this.setupLanguageToggle(),this.setupMobileOptimizations(),this.setupTouchInteractions()}setupThemeToggle(){const e=l.select("#theme-toggle");if(!e)return;const t=localStorage.getItem("theme")||f.THEMES.DEFAULT;document.documentElement.setAttribute("data-theme",t),this.updateThemeIcon(t),d.on(e,"click",()=>{const i=document.documentElement.getAttribute("data-theme")==="light"?"dark":"light";document.documentElement.setAttribute("data-theme",i),localStorage.setItem("theme",i),this.updateThemeIcon(i),this.visualEngine&&this.visualEngine.updateTheme(i),this.heroEngine&&this.heroEngine.updateTheme(i),this.neuralBackground&&this.neuralBackground.updateTheme(i),d.trigger(window,"themeChanged",{theme:i})})}updateThemeIcon(e){const t=l.select("#theme-toggle i");t&&(t.className=e==="light"?"fas fa-moon":"fas fa-sun")}setupMobileMenu(){const e=l.select("#menu-toggle"),t=l.select(".cosmic-nav")||l.select(".nav-links");!e||!t||(d.on(e,"click",()=>{l.toggleClass(t,"active"),l.toggleClass(e,"active"),document.body.style.overflow=t.classList.contains("active")?"hidden":""}),l.selectAll(".nav-link, .cosmic-link").forEach(i=>{d.on(i,"click",()=>{l.removeClasses(t,"active"),l.removeClasses(e,"active"),document.body.style.overflow=""})}),d.on(document,"click",i=>{!e.contains(i.target)&&!t.contains(i.target)&&(l.removeClasses(t,"active"),l.removeClasses(e,"active"),document.body.style.overflow="")}))}setupSmoothScrolling(){l.selectAll('a[href^="#"]').forEach(e=>{d.on(e,"click",t=>{t.preventDefault();const i=l.select(e.getAttribute("href"));i&&i.scrollIntoView({behavior:"smooth",block:"start"})})})}setupLanguageToggle(){const e=l.select("#language-toggle");if(!e)return;const t=localStorage.getItem("language")||f.LANGUAGES.DEFAULT;document.documentElement.setAttribute("data-language",t),d.on(e,"click",()=>{const i=localStorage.getItem("language")==="en"?"es":"en";localStorage.setItem("language",i),document.documentElement.setAttribute("data-language",i),d.trigger(window,"languageChanged",{language:i})})}setupMobileOptimizations(){/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)&&l.addClasses(document.body,"mobile-device"),window.innerWidth<=f.BREAKPOINTS.TABLET&&window.innerWidth>f.BREAKPOINTS.MOBILE&&l.addClasses(document.body,"tablet-device")}setupTouchInteractions(){l.selectAll(".btn, .tech-badge, .nav-link, .card").forEach(t=>{d.on(t,"touchstart",()=>{t.style.transform="scale(0.95)"}),d.on(t,"touchend",()=>{t.style.transform=""}),d.on(t,"touchcancel",()=>{t.style.transform=""})})}setupGlobalEvents(){d.on(document,"visibilitychange",()=>{}),d.on(window,"resize",G.throttle(()=>{},100)),d.on(document,"keydown",e=>{if(e.key==="Escape"){const t=l.select(".cosmic-nav")||l.select(".nav-links"),i=l.select("#menu-toggle");t?.classList.contains("active")&&(l.removeClasses(t,"active"),l.removeClasses(i,"active"),document.body.style.overflow="")}e.key==="t"&&e.ctrlKey&&(e.preventDefault(),l.select("#theme-toggle")?.click()),this.konamiEasterEgg&&this.konamiEasterEgg.handleKeyPress(e.key)})}}class ee{constructor(){this.progressBar=document.getElementById("loader-progress-bar"),this.progressValue=document.querySelector(".loader-progress-value"),this.statusText=document.querySelector(".loader-status"),this.currentProgress=0,this.targetProgress=0,this.isComplete=!1,this.stages=[{progress:15,status:"Loading assets..."},{progress:35,status:"Initializing..."},{progress:55,status:"Loading modules..."},{progress:75,status:"Preparing UI..."},{progress:90,status:"Almost ready..."},{progress:100,status:"Complete!"}]}updateProgress(e){this.targetProgress=Math.min(e,100),this.animateProgress()}animateProgress(){if(this.currentProgress<this.targetProgress){this.currentProgress+=Math.max(1,(this.targetProgress-this.currentProgress)*.1),this.currentProgress>=this.targetProgress-.5&&(this.currentProgress=this.targetProgress);const e=Math.round(this.currentProgress);this.progressBar&&(this.progressBar.style.width=`${e}%`),this.progressValue&&(this.progressValue.textContent=`${e}%`),this.updateStatus(e),this.currentProgress<this.targetProgress&&requestAnimationFrame(()=>this.animateProgress())}}updateStatus(e){if(this.statusText){for(let t=this.stages.length-1;t>=0;t--)if(e>=this.stages[t].progress-10){this.statusText.textContent=this.stages[t].status;break}}}complete(){this.isComplete=!0,this.updateProgress(100)}hide(){const e=document.getElementById("page-loader");e&&(e.classList.add("loaded"),setTimeout(()=>{e.style.display="none"},800))}}const u=new ee;setTimeout(()=>u.updateProgress(15),100);setTimeout(()=>u.updateProgress(35),400);setTimeout(()=>u.updateProgress(55),800);const D=()=>{u.complete(),setTimeout(()=>u.hide(),400)},te=()=>{const n=document.querySelector("[data-header-progress]");n&&window.addEventListener("scroll",()=>{const e=window.scrollY,t=document.documentElement.scrollHeight-window.innerHeight,i=e/t*100;n.style.width=`${i}%`})},ie=()=>{const n=document.getElementById("contact-form");n&&n.addEventListener("submit",async e=>{e.preventDefault();const t=n.querySelector('button[type="submit"]'),i=t.innerHTML;t.innerHTML='<i class="fas fa-spinner fa-spin"></i> Sending...',t.disabled=!0,await new Promise(s=>setTimeout(s,1500)),t.innerHTML='<i class="fas fa-check"></i> Sent!',n.reset(),setTimeout(()=>{t.innerHTML=i,t.disabled=!1},2e3)})};document.addEventListener("DOMContentLoaded",async()=>{u.updateProgress(60);const n=new Z;u.updateProgress(75),await n.init(),u.updateProgress(90),window.portfolio=n,te(),ie(),u.updateProgress(100),setTimeout(D,600)});window.addEventListener("load",()=>{u.isComplete||(u.updateProgress(100),setTimeout(D,800))});
