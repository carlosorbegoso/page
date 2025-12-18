const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/visual-effects-engine.B84Ynj0S.js","_astro/three.module.BNNMFZoX.js"])))=>i.map(i=>d[i]);
import{_ as k}from"./preload-helper.DhfBKQdW.js";import{V,S as B,P as H,W as R,B as x,C as T,a as m,b as Y,A as M,c as A,L as $,d as N,T as j,F as K,e as X,f as P,G as J,g as Q,h as Z,M as ee,i as I,j as te,D as ie}from"./three.module.BNNMFZoX.js";const w={APP_NAME:"Carlos Orbegoso Portfolio",VERSION:"2.0.0",DEBUG:!1,LOGGING:{LEVEL:"warn",SHOW_TIMESTAMPS:!0,SHOW_PREFIX:!0,CONSOLE_OUTPUT:!0},ANIMATIONS:{ENABLED:!0,DURATION:{FAST:200,NORMAL:400,SLOW:800},EASING:{FAST:"ease",NORMAL:"cubic-bezier(0.4, 0, 0.2, 1)",SLOW:"cubic-bezier(0.4, 0, 0.2, 1)"}},THREE_JS:{ENABLED:!0,PERFORMANCE:{MOBILE:"low",TABLET:"medium",DESKTOP:"high"},PARTICLES:{COUNT:{MOBILE:100,TABLET:200,DESKTOP:500}}},LANGUAGES:{DEFAULT:"en",SUPPORTED:["en","es"],FALLBACK:"en"},THEMES:{DEFAULT:"light",SUPPORTED:["light","dark"],AUTO_DETECT:!0},BREAKPOINTS:{MOBILE:768,TABLET:1024,DESKTOP:1200},API:{BASE_URL:"",TIMEOUT:5e3,RETRY_ATTEMPTS:3},NOTIFICATIONS:{AUTO_HIDE:!0,DURATION:5e3,POSITION:"top-right",MAX_VISIBLE:3},SCROLL:{SMOOTH:!0,OFFSET:80,THROTTLE:100},PERFORMANCE:{LAZY_LOADING:!0,DEBOUNCE_DELAY:300,THROTTLE_DELAY:100,CLEANUP_INTERVAL:3e4}};class se{constructor(){this.prefix="[Portfolio]",this.logLevel="warn"}formatMessage(e,t){const i=new Date().toLocaleTimeString();return`${this.prefix} [${i}] [${e.toUpperCase()}] ${t}`}shouldLog(e){const t={error:0,warn:1,info:2,debug:3};return t[e]<=t[this.logLevel]}error(e,t=null){const i=this.formatMessage("error",e);console.error(i,t)}warn(e,t=null){const i=this.formatMessage("warn",e);console.warn(i,t)}info(e,t=null){if(this.shouldLog("info")){const i=this.formatMessage("info",e);console.info(i,t)}}debug(e,t=null){if(this.shouldLog("debug")){const i=this.formatMessage("debug",e);console.debug(i,t)}}performance(e,t=null){if(this.shouldLog("info")){const i=this.formatMessage("perf",e);console.log(i,t)}}animation(e,t=null){if(this.shouldLog("info")){const i=this.formatMessage("anim",e);console.log(i,t)}}threejs(e,t=null){if(this.shouldLog("info")){const i=this.formatMessage("three",e);console.log(i,t)}}setLogLevel(e){this.logLevel=e}}const b=new se,L={error:(o,e)=>b.error(o,e),warn:(o,e)=>b.warn(o,e),info:(o,e)=>b.info(o,e),debug:(o,e)=>b.debug(o,e),performance:(o,e)=>b.performance(o,e),animation:(o,e)=>b.animation(o,e),threejs:(o,e)=>b.threejs(o,e),setLogLevel:o=>b.setLogLevel(o)},h={select(o,e=document){return e.querySelector(o)},selectAll(o,e=document){return e.querySelectorAll(o)},create(o,e={},t=""){const i=document.createElement(o);return Object.entries(e).forEach(([s,n])=>{s==="className"?i.className=n:s==="textContent"?i.textContent=n:i.setAttribute(s,n)}),t&&(i.innerHTML=t),i},addClasses(o,...e){o.classList.add(...e)},removeClasses(o,...e){o.classList.remove(...e)},toggleClass(o,e,t){o.classList.toggle(e,t)}},p={on(o,e,t,i={}){o.addEventListener(e,t,i)},off(o,e,t){o.removeEventListener(e,t)},trigger(o,e,t={}){const i=new CustomEvent(e,{detail:t});o.dispatchEvent(i)}},ne={debounce(o,e=w.PERFORMANCE.DEBOUNCE_DELAY){let t;return function(...i){clearTimeout(t),t=setTimeout(()=>o.apply(this,i),e)}},throttle(o,e=w.PERFORMANCE.THROTTLE_DELAY){let t=0;return function(...i){const s=Date.now();s-t>=e&&(t=s,o.apply(this,i))}},measureTime(o,e="Function execution"){performance.now();const t=o();return performance.now(),t}};class q{constructor(e="neural-background-container"){this.container=document.getElementById(e),this.container||(this.container=document.createElement("div"),this.container.id=e,this.container.style.cssText=`
                position: fixed;
                inset: 0;
                z-index: -1;
                pointer-events: none;
                overflow: hidden;
            `,document.body.prepend(this.container)),this.scene=null,this.camera=null,this.renderer=null,this.particles=null,this.connections=[],this.time=0,this.scrollY=0,this.mouse=new V(0,0),this.isActive=!0,this.colors={primary:6600182,cyan:65535,purple:11158783,spark:16739125},this.isMobile=window.innerWidth<=768,this.isLowPower=window.innerWidth<=480||navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4,this.config={particleCount:this.isLowPower?60:this.isMobile?100:180,connectionDistance:this.isMobile?80:120,maxConnections:this.isLowPower?30:this.isMobile?50:100,particleSize:this.isMobile?2:2.5,parallaxStrength:.02,mouseInfluence:.3},this.init()}init(){this.scene=new B;const e=window.innerWidth/window.innerHeight;this.camera=new H(60,e,.1,1e3),this.camera.position.z=100,this.renderer=new R({antialias:!this.isMobile,alpha:!0,powerPreference:this.isMobile?"low-power":"default"}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,this.isMobile?1.5:2)),this.renderer.setClearColor(0,0),this.container.appendChild(this.renderer.domElement),this.createNeuralParticles(),this.createSynapticConnections(),window.addEventListener("resize",()=>this.onResize()),window.addEventListener("scroll",()=>this.onScroll()),window.addEventListener("mousemove",t=>this.onMouseMove(t)),document.addEventListener("visibilitychange",()=>{this.isActive=!document.hidden}),this.animate()}createNeuralParticles(){const e=new x,t=new Float32Array(this.config.particleCount*3),i=new Float32Array(this.config.particleCount*3),s=new Float32Array(this.config.particleCount),n=new Float32Array(this.config.particleCount*3),a=[new T(this.colors.primary),new T(this.colors.cyan),new T(this.colors.purple)];for(let d=0;d<this.config.particleCount;d++){const r=d*3;t[r]=(Math.random()-.5)*200,t[r+1]=(Math.random()-.5)*200,t[r+2]=(Math.random()-.5)*100,n[r]=(Math.random()-.5)*.02,n[r+1]=(Math.random()-.5)*.02,n[r+2]=(Math.random()-.5)*.01;const l=a[Math.floor(Math.random()*a.length)];i[r]=l.r,i[r+1]=l.g,i[r+2]=l.b,s[d]=this.config.particleSize+Math.random()*1.5}e.setAttribute("position",new m(t,3)),e.setAttribute("color",new m(i,3)),e.setAttribute("size",new m(s,1)),e.setAttribute("velocity",new m(n,3));const c=new Y({size:this.config.particleSize,vertexColors:!0,transparent:!0,opacity:.7,blending:M,sizeAttenuation:!0});this.particles=new A(e,c),this.scene.add(this.particles)}createSynapticConnections(){const e=new $({color:this.colors.cyan,transparent:!0,opacity:.15,blending:M});for(let t=0;t<this.config.maxConnections;t++){const i=new x,s=new Float32Array(6);i.setAttribute("position",new m(s,3));const n=new N(i,e.clone());n.visible=!1,this.scene.add(n),this.connections.push(n)}}updateConnections(){if(!this.particles)return;const e=this.particles.geometry.attributes.position.array,t=this.config.particleCount;let i=0;this.connections.forEach(s=>s.visible=!1);for(let s=0;s<t&&i<this.config.maxConnections;s++){const n=e[s*3],a=e[s*3+1],c=e[s*3+2];for(let d=s+1;d<t&&i<this.config.maxConnections;d++){const r=e[d*3],l=e[d*3+1],f=e[d*3+2],u=Math.sqrt((r-n)**2+(l-a)**2+(f-c)**2);if(u<this.config.connectionDistance){const v=this.connections[i],g=v.geometry.attributes.position.array;g[0]=n,g[1]=a,g[2]=c,g[3]=r,g[4]=l,g[5]=f,v.geometry.attributes.position.needsUpdate=!0;const E=.15*(1-u/this.config.connectionDistance);v.material.opacity=E,v.visible=!0,i++}}}}onResize(){const e=window.innerWidth,t=window.innerHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t)}onScroll(){this.scrollY=window.scrollY}onMouseMove(e){this.mouse.x=e.clientX/window.innerWidth*2-1,this.mouse.y=-(e.clientY/window.innerHeight)*2+1}animate(){if(requestAnimationFrame(()=>this.animate()),!this.isActive)return;if(this.time+=.005,this.particles){const t=this.particles.geometry.attributes.position.array,i=this.particles.geometry.attributes.velocity.array;for(let s=0;s<this.config.particleCount;s++){const n=s*3;t[n]+=i[n],t[n+1]+=i[n+1],t[n+2]+=i[n+2],t[n]+=Math.sin(this.time+s*.1)*.02,t[n+1]+=Math.cos(this.time+s*.1)*.02,t[n]>100&&(t[n]=-100),t[n]<-100&&(t[n]=100),t[n+1]>100&&(t[n+1]=-100),t[n+1]<-100&&(t[n+1]=100)}this.particles.geometry.attributes.position.needsUpdate=!0,this.particles.rotation.y=this.time*.05}Math.floor(this.time*100)%5===0&&this.updateConnections();const e=this.scrollY*this.config.parallaxStrength;this.camera.position.y=-e,this.camera.position.x+=(this.mouse.x*5-this.camera.position.x)*.02,this.renderer.render(this.scene,this.camera)}updateTheme(e){}dispose(){this.isActive=!1,this.renderer&&(this.renderer.dispose(),this.container?.removeChild(this.renderer.domElement)),this.particles&&(this.particles.geometry.dispose(),this.particles.material.dispose()),this.connections.forEach(e=>{e.geometry.dispose(),e.material.dispose()})}}typeof window<"u"&&window.addEventListener("DOMContentLoaded",()=>{window.matchMedia("(prefers-reduced-motion: reduce)").matches||(window.neuralBackground=new q)});const S={light:{mobile:{background:"rgba(255, 255, 255, 0.9)",backdropFilter:"blur(20px)",borderOpacity:.15,shadow:"0 4px 20px rgba(0, 0, 0, 0.12)",borderColor:"rgba(100, 181, 246, 0.15)"},tablet:{background:"rgba(255, 255, 255, 0.6)",backdropFilter:"blur(15px)",borderOpacity:.08,shadow:"0 2px 15px rgba(0, 0, 0, 0.08)",borderColor:"rgba(100, 181, 246, 0.08)"},desktop:{background:"rgba(255, 255, 255, 0.15)",backdropFilter:"blur(6px)",borderOpacity:.02,shadow:"0 1px 8px rgba(0, 0, 0, 0.03)",borderColor:"rgba(100, 181, 246, 0.02)"}},dark:{mobile:{background:"rgba(26, 26, 46, 0.9)",backdropFilter:"blur(20px)",borderOpacity:.2,shadow:"0 4px 20px rgba(0, 0, 0, 0.2)",borderColor:"rgba(79, 195, 247, 0.2)"},tablet:{background:"rgba(26, 26, 46, 0.7)",backdropFilter:"blur(15px)",borderOpacity:.12,shadow:"0 2px 15px rgba(0, 0, 0, 0.15)",borderColor:"rgba(79, 195, 247, 0.12)"},desktop:{background:"rgba(26, 26, 46, 0.25)",backdropFilter:"blur(6px)",borderOpacity:.03,shadow:"0 1px 8px rgba(0, 0, 0, 0.05)",borderColor:"rgba(79, 195, 247, 0.03)"}},breakpoints:{mobile:768,tablet:1024,desktop:1440},transitions:{duration:"0.4s",easing:"cubic-bezier(0.4, 0, 0.2, 1)",header:"all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",theme:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},responsive:{mobile:{padding:"var(--spacing-sm) var(--spacing-md)",gap:"var(--spacing-md)",iconSize:"32px",buttonSize:"32px"},tablet:{padding:"var(--spacing-md) var(--spacing-lg)",gap:"var(--spacing-lg)",iconSize:"36px",buttonSize:"36px"},desktop:{padding:"var(--spacing-md) var(--spacing-xl)",gap:"var(--spacing-2xl)",iconSize:"40px",buttonSize:"36px"}}};function oe(o,e){return S[o]?.[e]||S.light.desktop}function z(o,e){const t=o/e;return o<=S.breakpoints.mobile||o<=S.breakpoints.tablet&&t<1.2?"mobile":o<=S.breakpoints.tablet||o<=S.breakpoints.desktop&&t<1.5?"tablet":"desktop"}class ae{constructor(){this.deviceType=z(window.innerWidth,window.innerHeight),this.isMobile=this.deviceType==="mobile",this.isTablet=this.deviceType==="tablet",this.isDesktop=this.deviceType==="desktop",this.init()}detectDevice(){return z(window.innerWidth,window.innerHeight)}getTransparencyConfig(){const e=document.documentElement.getAttribute("data-theme")||"light";return oe(e,this.deviceType)}updateHeaderTransparency(){const e=document.querySelector(".header");if(!e)return;const t=this.getTransparencyConfig();e.style.setProperty("--header-bg",t.background),e.style.setProperty("--header-backdrop",t.backdropFilter),e.style.setProperty("--header-border",`1px solid ${t.borderColor}`),e.style.setProperty("--header-shadow",t.shadow),e.style.background=t.background,e.style.backdropFilter=t.backdropFilter,e.style.borderBottom=`1px solid ${t.borderColor}`,e.style.boxShadow=t.shadow}updateThemeTransparency(e){this.updateHeaderTransparency()}handleResize(){const e=this.detectDevice();e!==this.deviceType&&(this.deviceType=e,this.isMobile=this.deviceType==="mobile",this.isTablet=this.deviceType==="tablet",this.isDesktop=this.deviceType==="desktop",this.updateHeaderTransparency())}init(){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{this.setupDeviceDetector()}):this.setupDeviceDetector()}setupDeviceDetector(){this.updateHeaderTransparency(),window.addEventListener("resize",this.handleResize.bind(this)),new MutationObserver(t=>{t.forEach(i=>{if(i.type==="attributes"&&i.attributeName==="data-theme"){const s=document.documentElement.getAttribute("data-theme");this.updateThemeTransparency(s)}})}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]})}refresh(){this.updateHeaderTransparency()}getDeviceInfo(){return{type:this.deviceType,isMobile:this.isMobile,isTablet:this.isTablet,isDesktop:this.isDesktop,width:window.innerWidth,height:window.innerHeight,ratio:window.innerWidth/window.innerHeight}}}class re{constructor(){this.menuToggle=null,this.navLinks=null,this.isMenuOpen=!1,this.init()}init(){this.waitForComponents()}waitForComponents(){let t=0;const i=()=>{this.menuToggle=document.getElementById("menu-toggle"),this.navLinks=document.querySelector(".nav-links"),this.menuToggle&&this.navLinks?this.setupEventListeners():(t++,t<50?setTimeout(i,100):console.warn("⚠️ Elementos del menú móvil no encontrados después de múltiples intentos"))};i()}setupEventListeners(){this.menuToggle.addEventListener("click",()=>{this.toggleMenu()}),this.navLinks.addEventListener("click",e=>{e.target.classList.contains("nav-link")&&this.closeMenu()}),document.addEventListener("click",e=>{!this.menuToggle.contains(e.target)&&!this.navLinks.contains(e.target)&&this.closeMenu()}),window.addEventListener("resize",()=>{window.innerWidth>768&&this.closeMenu()})}toggleMenu(){this.isMenuOpen?this.closeMenu():this.openMenu()}openMenu(){this.isMenuOpen=!0,this.menuToggle.classList.add("active"),this.navLinks.classList.add("active"),document.body.style.overflow="hidden"}closeMenu(){this.isMenuOpen=!1,this.menuToggle.classList.remove("active"),this.navLinks.classList.remove("active"),document.body.style.overflow=""}forceClose(){this.closeMenu()}isOpen(){return this.isMenuOpen}}let _=class{constructor(){this.scene=null,this.camera=null,this.renderer=null,this.particles=[],this.constellations=[],this.stars=[],this.titleParticles=null,this.titleGlow=null,this.animationId=null,this.isInitialized=!1,this.currentTheme="light",this.isMobile=window.innerWidth<=768,this.isLowPower=window.innerWidth<=480||navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4;const e=this.isLowPower?.3:this.isMobile?.5:1;this.config={particles:{count:Math.floor(80*e),size:{min:.3,max:.8},speed:{min:.1,max:.3},opacity:{min:.2,max:.5}},constellations:{count:Math.floor(12*e),starsPerConstellation:{min:3,max:this.isMobile?4:5},starSize:.15,connectionOpacity:.12,connectionWidth:1},stars:{count:Math.floor(100*e),size:{min:.2,max:.6},twinkleSpeed:{min:2,max:5}},titleEffect:{particleCount:Math.floor(150*e),orbitRadius:25,orbitSpeed:.3,particleSize:{min:.15,max:.5}}}}async init(e="hero-particles"){try{return typeof j>"u"?(console.warn("Three.js no está disponible"),!1):(this.setupScene(),this.setupCamera(),this.setupRenderer(e),this.createParticleSystem(),this.createConstellationSystem(),this.createStarSystem(),this.createTitleEffect(),this.setupEventListeners(),this.animate(),this.isInitialized=!0,!0)}catch(t){return console.error("❌ Error inicializando Hero Three.js Engine:",t),!1}}setupScene(){this.scene=new B,this.scene.fog=new K(0,50,200)}setupCamera(){this.camera=new H(75,window.innerWidth/window.innerHeight,.1,1e3),this.camera.position.z=50,this.camera.position.y=0}setupRenderer(e){const t=document.getElementById(e);if(!t){console.warn(`Contenedor ${e} no encontrado`);return}this.renderer=new R({antialias:!0,alpha:!0,powerPreference:"high-performance"}),this.renderer.setSize(t.offsetWidth,t.offsetHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setClearColor(0,0),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=X,t.appendChild(this.renderer.domElement),this.renderer.domElement.style.position="absolute",this.renderer.domElement.style.top="0",this.renderer.domElement.style.left="0",this.renderer.domElement.style.zIndex="1"}createParticleSystem(){const e=new x,t=this.config.particles.count,i=new Float32Array(t*3),s=new Float32Array(t*3),n=new Float32Array(t),a=new Float32Array(t),c=new Float32Array(t);for(let r=0;r<t;r++){i[r*3]=(Math.random()-.5)*100,i[r*3+1]=(Math.random()-.5)*60,i[r*3+2]=(Math.random()-.5)*50-20;const l=this.currentTheme==="dark"?new T(5227511):new T(6600182);s[r*3]=l.r,s[r*3+1]=l.g,s[r*3+2]=l.b,n[r]=Math.random()*(this.config.particles.size.max-this.config.particles.size.min)+this.config.particles.size.min,a[r]=Math.random()*(this.config.particles.speed.max-this.config.particles.speed.min)+this.config.particles.speed.min,c[r]=Math.random()*(this.config.particles.opacity.max-this.config.particles.opacity.min)+this.config.particles.opacity.min}e.setAttribute("position",new m(i,3)),e.setAttribute("color",new m(s,3)),e.setAttribute("size",new m(n,1)),e.setAttribute("speed",new m(a,1)),e.setAttribute("opacity",new m(c,1));const d=new P({uniforms:{time:{value:0},theme:{value:this.currentTheme==="dark"?1:0}},vertexShader:`
                attribute vec3 color;
                attribute float size;
                attribute float speed;
                attribute float opacity;
                varying float vOpacity;
                varying vec3 vColor;
                
                void main() {
                    vOpacity = opacity;
                    vColor = color;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,fragmentShader:`
                uniform float time;
                uniform float theme;
                varying float vOpacity;
                varying vec3 vColor;

                void main() {
                    // Crear forma circular suave
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    // Brillo suave con efecto de twinkle lento
                    float twinkle = 0.7 + 0.3 * sin(time * 1.5);
                    float alpha = vOpacity * twinkle;
                    alpha *= smoothstep(0.5, 0.0, dist);
                    vec3 finalColor = mix(vColor, vec3(1.0, 1.0, 1.0), 0.2);
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,transparent:!0,blending:M,depthWrite:!1});this.particleSystem=new A(e,d),this.scene.add(this.particleSystem)}createConstellationSystem(){const e=this.config.constellations.count;for(let t=0;t<e;t++){const i=this.createConstellation(t,e);this.constellations.push(i),this.scene.add(i)}}createConstellation(e,t){const i=new J,s=Math.floor(Math.random()*(this.config.constellations.starsPerConstellation.max-this.config.constellations.starsPerConstellation.min)+this.config.constellations.starsPerConstellation.min),n=[],a=this.config.constellations.starSize;for(let r=0;r<s;r++){const l=this.createStar(a,.6),f=r/s*Math.PI*2+Math.random()*.5,u=2+Math.random()*2,v=Math.cos(f)*u,g=Math.sin(f)*u,E=(Math.random()-.5)*1;l.position.set(v,g,E),n.push(new Q(v,g,E)),i.add(l)}for(let r=0;r<s;r++)for(let l=r+1;l<s;l++)if(Math.random()>.3){const f=this.createConnection(n[r],n[l]);i.add(f)}i.position.set((Math.random()-.5)*120,(Math.random()-.5)*70,-15+Math.random()*10);const c=(.08+Math.random()*.12)*(Math.random()>.5?1:-1),d=(.04+Math.random()*.08)*(Math.random()>.5?1:-1);return i.userData={velocity:{x:c,y:d,z:0},rotationSpeed:(Math.random()-.5)*.003,pulsePhase:Math.random()*Math.PI*2,originalScale:1},i}createStar(e,t){const i=new Z(e,6,4),s=new ee({color:16777215,transparent:!0,opacity:t*.8}),n=new I(i,s);return n.userData={originalIntensity:t*.8,twinkleSpeed:Math.random()*2+1},n}createConnection(e,t){const i=new x().setFromPoints([e,t]),s=new $({color:8965375,transparent:!0,opacity:this.config.constellations.connectionOpacity}),n=new N(i,s);return n.userData={baseOpacity:this.config.constellations.connectionOpacity},n}createTitleEffect(){const e=this.config.titleEffect.particleCount,t=new x,i=new Float32Array(e*3),s=new Float32Array(e*3),n=new Float32Array(e),a=new Float32Array(e),c=new Float32Array(e),d=new Float32Array(e);for(let u=0;u<e;u++){const v=u/e*Math.PI*2*3,g=this.config.titleEffect.orbitRadius+(Math.random()-.5)*15,E=(Math.random()-.5)*12;i[u*3]=Math.cos(v)*g,i[u*3+1]=E,i[u*3+2]=Math.sin(v)*g*.3;const U=.52+Math.random()*.08,C=new T;C.setHSL(U,1,.6+Math.random()*.2),s[u*3]=C.r,s[u*3+1]=C.g,s[u*3+2]=C.b,n[u]=Math.random()*(this.config.titleEffect.particleSize.max-this.config.titleEffect.particleSize.min)+this.config.titleEffect.particleSize.min,a[u]=Math.random()*Math.PI*2,c[u]=.2+Math.random()*.4,d[u]=g}t.setAttribute("position",new m(i,3)),t.setAttribute("color",new m(s,3)),t.setAttribute("size",new m(n,1)),t.setAttribute("phase",new m(a,1)),t.setAttribute("speed",new m(c,1)),t.setAttribute("radius",new m(d,1));const r=new P({uniforms:{time:{value:0}},vertexShader:`
                attribute vec3 color;
                attribute float size;
                attribute float phase;
                attribute float speed;
                attribute float radius;
                uniform float time;
                varying vec3 vColor;
                varying float vOpacity;

                void main() {
                    vColor = color;

                    // Orbitar alrededor del centro
                    float angle = phase + time * speed;
                    vec3 pos = position;
                    pos.x = cos(angle) * radius;
                    pos.z = sin(angle) * radius * 0.3;

                    // Movimiento vertical suave
                    pos.y += sin(time * 2.0 + phase) * 1.5;

                    // Pulso de opacidad
                    vOpacity = 0.4 + 0.4 * sin(time * 3.0 + phase);

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,fragmentShader:`
                varying vec3 vColor;
                varying float vOpacity;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    float alpha = vOpacity * smoothstep(0.5, 0.0, dist);
                    vec3 finalColor = mix(vColor, vec3(1.0), 0.3);

                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,transparent:!0,blending:M,depthWrite:!1});this.titleParticles=new A(t,r),this.scene.add(this.titleParticles);const l=new te(60,20),f=new P({uniforms:{time:{value:0}},vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,fragmentShader:`
                uniform float time;
                varying vec2 vUv;

                void main() {
                    vec2 center = vUv - 0.5;
                    float dist = length(center * vec2(1.0, 2.0));

                    // Glow pulsante
                    float pulse = 0.5 + 0.3 * sin(time * 2.0);
                    float glow = exp(-dist * 4.0) * pulse;

                    vec3 color = mix(vec3(0.4, 0.7, 1.0), vec3(0.0, 1.0, 1.0), sin(time) * 0.5 + 0.5);

                    gl_FragColor = vec4(color, glow * 0.3);
                }
            `,transparent:!0,blending:M,depthWrite:!1,side:ie});this.titleGlow=new I(l,f),this.titleGlow.position.z=-5,this.scene.add(this.titleGlow)}createStarSystem(){const e=new x,t=this.config.stars.count,i=new Float32Array(t*3),s=new Float32Array(t),n=new Float32Array(t);for(let c=0;c<t;c++){const d=Math.acos(-1+2*c/t),r=Math.sqrt(t*Math.PI)*d,l=80+Math.random()*20;i[c*3]=l*Math.cos(r)*Math.sin(d),i[c*3+1]=l*Math.sin(r)*Math.sin(d),i[c*3+2]=l*Math.cos(d),s[c]=Math.random()*(this.config.stars.size.max-this.config.stars.size.min)+this.config.stars.size.min,n[c]=Math.random()*(this.config.stars.twinkleSpeed.max-this.config.stars.twinkleSpeed.min)+this.config.stars.twinkleSpeed.min}e.setAttribute("position",new m(i,3)),e.setAttribute("size",new m(s,1)),e.setAttribute("twinkleSpeed",new m(n,1));const a=new P({uniforms:{time:{value:0}},vertexShader:`
                attribute float size;
                varying float vSize;
                
                void main() {
                    vSize = size;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,fragmentShader:`
                uniform float time;
                varying float vSize;
                
                void main() {
                    float twinkle = 0.8 + 0.2 * sin(time * 2.0);
                    float alpha = twinkle * (0.6 + 0.4 * (vSize / 2.0));
                    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
                }
            `,transparent:!0,blending:M,depthWrite:!1});this.starSystem=new A(e,a),this.scene.add(this.starSystem)}setupEventListeners(){window.addEventListener("resize",()=>this.onWindowResize()),document.addEventListener("mousemove",e=>{if(!this.isInitialized)return;const t=e.clientX/window.innerWidth*2-1,i=-(e.clientY/window.innerHeight)*2+1;this.camera.position.x=t*5,this.camera.position.y=i*3,this.camera.lookAt(0,0,0)}),window.addEventListener("scroll",()=>{if(!this.isInitialized)return;const t=window.pageYOffset*-.1;this.particleSystem.position.y=t,this.starSystem.position.y=t*.5})}onWindowResize(){!this.renderer||!this.camera||(this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight))}animate(){if(this.animationId=requestAnimationFrame(()=>this.animate()),!this.isInitialized)return;const e=Date.now()*.001;this.particleSystem&&(this.particleSystem.material.uniforms.time.value=e),this.constellations.forEach(t=>{const i=t.userData;t.position.x+=i.velocity.x,t.position.y+=i.velocity.y;const s=70,n=45;t.position.x>s&&(t.position.x=-s),t.position.x<-s&&(t.position.x=s),t.position.y>n&&(t.position.y=-n),t.position.y<-n&&(t.position.y=n),t.rotation.z+=i.rotationSpeed,t.children.forEach(a=>{if(a.type==="Mesh"&&a.userData.twinkleSpeed){const c=Math.sin(e*a.userData.twinkleSpeed+i.pulsePhase)*.25+.75;a.material.opacity=a.userData.originalIntensity*c}else if(a.type==="Line"&&a.userData.baseOpacity){const c=Math.sin(e*.8+i.pulsePhase)*.03+1;a.material.opacity=a.userData.baseOpacity*c}})}),this.starSystem&&(this.starSystem.material.uniforms.time.value=e),this.titleParticles&&(this.titleParticles.material.uniforms.time.value=e),this.titleGlow&&(this.titleGlow.material.uniforms.time.value=e),this.renderer.render(this.scene,this.camera)}updateTheme(e){this.currentTheme=e,this.particleSystem&&this.particleSystem.material.uniforms&&(this.particleSystem.material.uniforms.theme.value=e==="dark"?1:0),this.constellations.forEach(t=>{t.children.forEach(i=>{i.type==="Line"&&i.material.color.setHex(e==="dark"?5227511:6600182)})})}setPerformanceMode(e=!0){this.renderer&&(e?this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)):this.renderer.setPixelRatio(1))}dispose(){this.animationId&&cancelAnimationFrame(this.animationId),this.renderer&&(this.renderer.dispose(),this.renderer.domElement&&this.renderer.domElement.parentNode&&this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)),this.scene=null,this.camera=null,this.renderer=null,this.particles=[],this.constellations=[],this.stars=[],this.isInitialized=!1}};const ce=Object.freeze(Object.defineProperty({__proto__:null,HeroThreeEngine:_},Symbol.toStringTag,{value:"Module"}));class W{constructor(){this.hero=null,this.heroContent=null,this.techBadges=[],this.buttons=[],this.scrollIndicator=null,this.floatingElements=[],this.isAnimating=!1,this.observer=null,this.heroThreeEngine=null,this.textEffectsEngine=null,this.init()}init(){this.setupElements(),this.setupIntersectionObserver(),this.setupEventListeners(),this.startInitialAnimations()}setupElements(){this.hero=document.querySelector(".hero"),this.heroContent=document.querySelector(".hero-content"),this.techBadges=document.querySelectorAll(".tech-badge"),this.buttons=document.querySelectorAll(".btn-hero"),this.scrollIndicator=document.querySelector(".hero-scroll-indicator"),this.floatingElements=document.querySelectorAll(".floating-element")}setupIntersectionObserver(){this.hero&&(this.observer=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&this.onHeroVisible()})},{threshold:.1,rootMargin:"0px 0px -100px 0px"}),this.observer.observe(this.hero))}setupEventListeners(){this.scrollIndicator&&this.scrollIndicator.addEventListener("click",()=>{this.scrollToNextSection()}),this.techBadges.forEach(e=>{e.addEventListener("mouseenter",()=>{this.animateTechBadge(e,"enter")}),e.addEventListener("mouseleave",()=>{this.animateTechBadge(e,"leave")})}),this.buttons.forEach(e=>{e.addEventListener("mouseenter",()=>{this.animateButton(e,"enter")}),e.addEventListener("mouseleave",()=>{this.animateButton(e,"leave")})}),window.addEventListener("scroll",()=>{this.updateParallax()}),window.addEventListener("resize",()=>{this.updateResponsiveAnimations()})}startInitialAnimations(){if(!this.heroContent)return;this.heroContent.querySelectorAll(".animate-fade-in-up").forEach((t,i)=>{const s=parseFloat(t.dataset.delay)||i*.1;setTimeout(()=>{t.style.animationDelay=`${s}s`,t.classList.add("animate-in")},s*1e3)}),this.techBadges.forEach((t,i)=>{const s=parseFloat(t.dataset.delay)||i*.1;setTimeout(()=>{this.animateTechBadge(t,"enter")},(1.4+s)*1e3)})}onHeroVisible(){this.isAnimating||(this.isAnimating=!0,this.animateFloatingElements(),this.scrollIndicator&&this.animateScrollIndicator(),this.textEffectsEngine||this.initTextEffects(),this.initThreeJSAnimations())}animateTechBadge(e,t){if(t==="enter"){e.style.transform="translateY(-8px) scale(1.05)",e.style.boxShadow="0 12px 30px rgba(100, 181, 246, 0.3)";const i=e.querySelector(".tech-icon");i&&(i.style.transform="scale(1.2) rotate(10deg)");const s=e.querySelector(".tech-glow");s&&(s.style.opacity="1")}else{e.style.transform="translateY(0) scale(1)",e.style.boxShadow="0 4px 15px rgba(100, 181, 246, 0.1)";const i=e.querySelector(".tech-icon");i&&(i.style.transform="scale(1) rotate(0deg)");const s=e.querySelector(".tech-glow");s&&(s.style.opacity="0")}}animateButton(e,t){if(t==="enter"){e.style.transform="translateY(-4px)";const i=e.querySelector(".btn-icon");if(i&&(i.style.transform="scale(1.1)"),e.classList.contains("btn-primary")){const s=e.querySelector(".btn-particles");s&&(s.style.opacity="1")}}else{e.style.transform="translateY(0)";const i=e.querySelector(".btn-icon");i&&(i.style.transform="scale(1)");const s=e.querySelector(".btn-particles");s&&(s.style.opacity="0")}}animateFloatingElements(){this.floatingElements.forEach((e,t)=>{const i=t*.5;setTimeout(()=>{e.style.animation="float 6s ease-in-out infinite",e.style.opacity="1"},i*1e3)})}animateScrollIndicator(){if(!this.scrollIndicator)return;this.scrollIndicator.querySelectorAll(".arrow-line").forEach((i,s)=>{i.style.animation=`arrowLine${s+1} 2s infinite`});const t=this.scrollIndicator.querySelector(".scroll-text");t&&(t.style.animation="fadeInOut 2s infinite")}updateParallax(){if(!this.hero)return;const t=window.pageYOffset*-.5;this.hero.querySelectorAll(".hero-particles, .hero-constellations, .hero-stars").forEach(s=>{s.style.transform=`translateY(${t}px)`}),this.floatingElements.forEach((s,n)=>{const a=t*(.1+n*.05);s.style.transform=`translateY(${a}px)`})}updateResponsiveAnimations(){window.innerWidth<=768?this.heroContent?.style.setProperty("--animation-duration","0.6s"):this.heroContent?.style.setProperty("--animation-duration","0.8s")}scrollToNextSection(){const e=this.hero?.nextElementSibling;e&&e.scrollIntoView({behavior:"smooth",block:"start"})}initThreeJSAnimations(){try{this.heroThreeEngine=new _,this.heroThreeEngine.init("hero-particles").then(e=>{e&&this.setupThemeIntegration()})}catch(e){console.warn("Three.js no está disponible para el hero:",e)}}initTextEffects(){}setupThemeIntegration(){new MutationObserver(t=>{t.forEach(i=>{if(i.type==="attributes"&&i.attributeName==="data-theme"){const s=document.documentElement.getAttribute("data-theme");this.heroThreeEngine&&this.heroThreeEngine.updateTheme(s)}})}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]})}createHeroParticles(){const e=document.getElementById("hero-particles");if(e)for(let t=0;t<20;t++){const i=document.createElement("div");i.className="hero-particle",i.style.cssText=`
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
            `,e.appendChild(i)}}destroy(){this.observer&&this.observer.disconnect(),this.heroThreeEngine&&(this.heroThreeEngine.dispose(),this.heroThreeEngine=null),this.textEffectsEngine&&(this.textEffectsEngine.dispose(),this.textEffectsEngine=null),this.scrollIndicator&&this.scrollIndicator.removeEventListener("click",this.scrollToNextSection),this.hero=null,this.heroContent=null,this.techBadges=[],this.buttons=[],this.scrollIndicator=null,this.floatingElements=[]}}document.addEventListener("DOMContentLoaded",()=>{new W});class le{constructor(){this.aboutSection=null,this.observer=null,this.isInitialized=!1,this.init()}init(){try{this.setupIntersectionObserver(),this.setupScrollAnimations(),this.setupHoverEffects()}catch(e){console.error("❌ Error inicializando About Animations:",e)}}setupIntersectionObserver(){this.observer=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting?this.onAboutVisible(t.target):this.onAboutHidden(t.target)})},{threshold:.3,rootMargin:"0px 0px -100px 0px"}),this.aboutSection=document.getElementById("about"),this.aboutSection&&this.observer.observe(this.aboutSection)}onAboutVisible(e){this.isInitialized||(this.isInitialized=!0,this.activateCSSAnimations(),this.initParticleEffects())}onAboutHidden(e){this.isInitialized=!1}activateCSSAnimations(){this.aboutSection.querySelectorAll(".animate-fade-in-up").forEach((t,i)=>{const s=parseFloat(t.getAttribute("data-delay"))||0;setTimeout(()=>{t.style.opacity="1",t.style.transform="translateY(0)"},s*1e3)})}initParticleEffects(){this.initAvatarParticles(),this.initStatsParticles(),this.initSpecialtyParticles(),this.initTechParticles(),this.initValuesParticles(),this.initCounterAnimations(),this.initIconAnimations()}initIconAnimations(){document.querySelectorAll(".specialty-icon-inline").forEach((n,a)=>{n.style.animationDelay=`${a*.2}s`,n.classList.add("icon-float")}),document.querySelectorAll(".tech-icon").forEach((n,a)=>{n.style.animationDelay=`${a*.1}s`,n.classList.add("icon-pulse")}),document.querySelectorAll(".value-icon-inline").forEach((n,a)=>{n.style.animationDelay=`${a*.15}s`,n.classList.add("icon-rotate")});const s=document.querySelector(".avatar-icon");s&&s.classList.add("avatar-icon-float")}initAvatarParticles(){const e=document.querySelector(".avatar-container");e&&this.createFloatingParticles(e,30,{color:"var(--primary-color)",size:"2px",duration:"8s"})}initStatsParticles(){document.querySelectorAll(".stat-main-item").forEach((t,i)=>{this.createRisingParticles(t,20,{color:"var(--accent-color)",size:"1px",duration:"6s",delay:i*200})})}initSpecialtyParticles(){document.querySelectorAll(".specialty-inline-item").forEach((t,i)=>{this.createOrbitalParticles(t,15,{color:"var(--primary-color)",size:"1.5px",duration:"10s",delay:i*300})})}initTechParticles(){document.querySelectorAll(".tech-tag-compact").forEach((t,i)=>{this.createExpandingParticles(t,12,{color:"var(--accent-color)",size:"1px",duration:"5s",delay:i*100})})}initValuesParticles(){document.querySelectorAll(".value-inline-item").forEach((t,i)=>{this.createSpiralParticles(t,18,{color:"var(--primary-color)",size:"1.5px",duration:"12s",delay:i*400})})}createFloatingParticles(e,t,i){const s=document.createElement("div");s.className="floating-particles",s.style.cssText=`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `,e.style.position="relative",e.appendChild(s);for(let n=0;n<t;n++)this.createParticle(s,i,n)}createRisingParticles(e,t,i){const s=document.createElement("div");s.className="rising-particles",s.style.cssText=`
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `,e.style.position="relative",e.appendChild(s);for(let n=0;n<t;n++)this.createRisingParticle(s,i,n)}createOrbitalParticles(e,t,i){const s=document.createElement("div");s.className="orbital-particles",s.style.cssText=`
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `,e.style.position="relative",e.appendChild(s);for(let n=0;n<t;n++)this.createOrbitalParticle(s,i,n)}createExpandingParticles(e,t,i){const s=document.createElement("div");s.className="expanding-particles",s.style.cssText=`
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `,e.style.position="relative",e.appendChild(s);for(let n=0;n<t;n++)this.createExpandingParticle(s,i,n)}createSpiralParticles(e,t,i){const s=document.createElement("div");s.className="spiral-particles",s.style.cssText=`
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `,e.style.position="relative",e.appendChild(s);for(let n=0;n<t;n++)this.createSpiralParticle(s,i,n)}createParticle(e,t,i){const s=document.createElement("div");s.className="particle";const n=i/t.count*Math.PI*2,a=60+Math.random()*40,c=Math.random()*t.duration;s.style.cssText=`
            position: absolute;
            width: ${t.size};
            height: ${t.size};
            background: ${t.color};
            border-radius: 50%;
            top: calc(50% + ${Math.sin(n)*a}px);
            left: calc(50% + ${Math.cos(n)*a}px);
            opacity: 0;
            animation: floatingParticle ${t.duration}s ease-in-out infinite;
            animation-delay: ${c}s;
        `,e.appendChild(s)}createRisingParticle(e,t,i){const s=document.createElement("div");s.className="particle";const n=t.delay+i*50;s.style.cssText=`
            position: absolute;
            width: ${t.size};
            height: ${t.size};
            background: ${t.color};
            border-radius: 50%;
            top: 50%;
            left: 50%;
            opacity: 0;
            animation: risingParticle ${t.duration}s ease-out infinite;
            animation-delay: ${n}ms;
        `,e.appendChild(s)}createOrbitalParticle(e,t,i){const s=document.createElement("div");s.className="particle";const n=i/t.count*Math.PI*2,a=40+Math.random()*20,c=t.delay+i*100;s.style.cssText=`
            position: absolute;
            width: ${t.size};
            height: ${t.size};
            background: ${t.color};
            border-radius: 50%;
            top: calc(50% + ${Math.sin(n)*a}px);
            left: calc(50% + ${Math.cos(n)*a}px);
            opacity: 0;
            animation: orbitalParticle ${t.duration}s linear infinite;
            animation-delay: ${c}ms;
        `,e.appendChild(s)}createExpandingParticle(e,t,i){const s=document.createElement("div");s.className="particle",i/t.count*Math.PI*2;const n=t.delay+i*80;s.style.cssText=`
            position: absolute;
            width: ${t.size};
            height: ${t.size};
            background: ${t.color};
            border-radius: 50%;
            top: 50%;
            left: 50%;
            opacity: 0;
            animation: expandingParticle ${t.duration}s ease-out infinite;
            animation-delay: ${n}ms;
        `,e.appendChild(s)}createSpiralParticle(e,t,i){const s=document.createElement("div");s.className="particle";const n=t.delay+i*200;s.style.cssText=`
            position: absolute;
            width: ${t.size};
            height: ${t.size};
            background: ${t.color};
            border-radius: 50%;
            top: 50%;
            left: 50%;
            opacity: 0;
            animation: spiralParticle ${t.duration}s ease-in-out infinite;
            animation-delay: ${n}ms;
        `,e.appendChild(s)}setupScrollAnimations(){window.addEventListener("scroll",()=>{if(!this.aboutSection||!this.isInitialized)return;const e=this.aboutSection.getBoundingClientRect(),t=(window.innerHeight-e.top)/(window.innerHeight+e.height);t>0&&t<1&&this.updateScrollEffects(t)})}initCounterAnimations(){document.querySelectorAll(".stat-main-number").forEach(t=>{parseInt(t.textContent);const i=t.textContent.replace(/\d/g,""),s=parseInt(t.textContent.replace(/\D/g,""));t.textContent="0"+i;const n=new IntersectionObserver(a=>{a.forEach(c=>{c.isIntersecting&&(this.animateCounter(t,0,s,i),n.unobserve(c.target))})},{threshold:.5});n.observe(t)})}animateCounter(e,t,i,s){const a=performance.now(),c=d=>{const r=d-a,l=Math.min(r/2e3,1),f=1-Math.pow(1-l,4),u=Math.floor(t+(i-t)*f);e.textContent=u+s,e.style.transform=`scale(${1+l*.1})`,e.style.color=`hsl(${200+l*60}, 70%, ${60+l*20}%)`,l<1?requestAnimationFrame(c):(e.style.transform="scale(1)",e.style.color="",this.createCelebrationEffect(e))};requestAnimationFrame(c)}createCelebrationEffect(e){const t=e.parentElement,i=document.createElement("div");i.className="celebration-particles",i.style.cssText=`
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 10;
        `,t.style.position="relative",t.appendChild(i);for(let s=0;s<8;s++){const n=document.createElement("div");n.className="celebration-particle",n.style.cssText=`
                position: absolute;
            width: 6px;
            height: 6px;
            background: linear-gradient(45deg, #64B5F6, #4FC3F7);
            border-radius: 50%;
            animation: celebrationParticle 1.5s ease-out forwards;
            animation-delay: ${s*.1}s;
        `,i.appendChild(n)}setTimeout(()=>{i.remove()},2e3)}updateScrollEffects(e){const t=document.querySelector(".avatar-container");if(t){const s=e*20;t.style.transform=`translateY(${s}px)`}document.querySelectorAll(".stat-main-item").forEach((s,n)=>{const a=Math.max(.3,1-e*.5);s.style.opacity=a})}setupHoverEffects(){document.querySelectorAll(".specialty-inline-item").forEach(s=>{s.addEventListener("mouseenter",()=>{this.activateHoverEffect(s,"specialty")}),s.addEventListener("mouseleave",()=>{this.deactivateHoverEffect(s,"specialty")})}),document.querySelectorAll(".tech-tag-compact").forEach(s=>{s.addEventListener("mouseenter",()=>{this.activateHoverEffect(s,"tech")}),s.addEventListener("mouseleave",()=>{this.deactivateHoverEffect(s,"tech")})}),document.querySelectorAll(".value-inline-item").forEach(s=>{s.addEventListener("mouseenter",()=>{this.activateHoverEffect(s,"value")}),s.addEventListener("mouseleave",()=>{this.deactivateHoverEffect(s,"value")})})}activateHoverEffect(e,t){switch(t){case"specialty":e.style.transform="translateY(-8px) scale(1.05)",e.style.boxShadow="0 20px 40px rgba(100, 181, 246, 0.15)";break;case"tech":e.style.transform="translateY(-5px) scale(1.1)",e.style.boxShadow="0 15px 30px rgba(100, 181, 246, 0.2)";break;case"value":e.style.transform="translateY(-6px) scale(1.03)",e.style.boxShadow="0 18px 35px rgba(100, 181, 246, 0.18)";break}}deactivateHoverEffect(e,t){e.style.transform="translateY(0) scale(1)",e.style.boxShadow="none"}destroy(){this.observer&&this.observer.disconnect()}}class de{constructor(){this.sequence=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"],this.currentIndex=0,this.overlay=null,this.style=null}handleKeyPress(e){e===this.sequence[this.currentIndex]?(this.currentIndex++,this.currentIndex===this.sequence.length&&(this.activate(),this.currentIndex=0)):this.currentIndex=0}activate(){this.createOverlay(),this.playSound(),this.setupAutoClose()}createOverlay(){this.overlay=document.createElement("div"),this.overlay.className="konami-overlay",this.overlay.innerHTML=`
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
        `,document.head.appendChild(this.style)}playSound(){try{const e=new(window.AudioContext||window.webkitAudioContext),t=e.createOscillator(),i=e.createGain();t.connect(i),i.connect(e.destination),t.frequency.setValueAtTime(587.33,e.currentTime),t.frequency.setValueAtTime(880,e.currentTime+.1),t.frequency.setValueAtTime(1174.66,e.currentTime+.2),i.gain.setValueAtTime(.3,e.currentTime),i.gain.exponentialRampToValueAtTime(.01,e.currentTime+.5),t.start(e.currentTime),t.stop(e.currentTime+.5)}catch{}}setupAutoClose(){setTimeout(()=>{document.body.contains(this.overlay)&&this.close()},5e3)}close(){this.overlay&&(this.overlay.style.animation="konamiFadeOut 0.3s ease forwards",setTimeout(()=>{this.overlay?.remove(),this.style?.remove(),this.overlay=null,this.style=null},300))}}let O=null,F=null,D=null;class he{constructor(){this.visualEngine=null,this.brainEngine=null,this.neuralBackground=null,this.heroEngine=null,this.cursorEngine=null,this.deviceDetector=null,this.mobileMenuManager=null,this.heroAnimations=null,this.aboutAnimations=null,this.konamiEasterEgg=null,this.isInitialized=!1,this.modules=new Map}async init(){try{await this.initializeBasicModules(),this.setupBasicFeatures(),await this.initializeAdvancedModules(),this.setupGlobalEvents(),this.isInitialized=!0,L.info("Portfolio initialized")}catch(e){console.error("Error initializing portfolio:",e)}}async initializeBasicModules(){this.deviceDetector=new ae,this.mobileMenuManager=new re,this.heroAnimations=new W,this.aboutAnimations=new le,this.konamiEasterEgg=new de}async initializeAdvancedModules(){const e=window.innerWidth<=768,t=window.innerWidth<=480||navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4;if(!e)try{O=(await k(()=>import("./visual-effects-engine.B84Ynj0S.js"),__vite__mapDeps([0,1]))).VisualEffectsEngine,this.visualEngine=new O;const s=localStorage.getItem("theme")||w.THEMES.DEFAULT;this.visualEngine.updateTheme(s),this.initializeSectionEffects()}catch(i){L.error("Error initializing visual engine:",i)}if(!e)try{this.neuralBackground=new q("neural-background-container")}catch(i){console.error("Error creating Neural Background:",i)}if(!t)try{F=(await k(()=>Promise.resolve().then(()=>ce),void 0)).HeroThreeEngine,this.heroEngine=new F,await this.heroEngine.init("hero-particles")}catch(i){L.error("Error initializing Hero Three.js Engine:",i)}if(!e)try{D=(await k(()=>import("./cursor-particles-engine.CtQFKbK1.js"),[])).CursorParticlesEngine,this.cursorEngine=new D}catch(i){console.error("Error initializing Cursor Particles Engine:",i)}}initializeSectionEffects(){if(!this.visualEngine)return;[{name:"Hero",containerId:"hero-effects"},{name:"About",containerId:"about-effects"},{name:"Experience",containerId:"experience-effects"},{name:"Skills",containerId:"skills-effects"},{name:"Projects",containerId:"projects-effects"},{name:"Contact",containerId:"contact-effects"}].forEach(t=>{document.getElementById(t.name.toLowerCase())&&this.visualEngine.initSectionEffects(t.name,t.containerId)}),this.setupSectionEffectsObserver()}setupSectionEffectsObserver(){const e=["hero","about","experience","skills","projects","contact"],t=new IntersectionObserver(i=>{i.forEach(s=>{s.isIntersecting&&s.target.classList.add("section-effects-active")})},{threshold:.1,rootMargin:"0px 0px -100px 0px"});e.forEach(i=>{const s=document.getElementById(i);s&&t.observe(s)})}setupBasicFeatures(){this.setupThemeToggle(),this.setupMobileMenu(),this.setupSmoothScrolling(),this.setupLanguageToggle(),this.setupMobileOptimizations(),this.setupTouchInteractions()}setupThemeToggle(){const e=h.select("#theme-toggle");if(!e)return;const t=localStorage.getItem("theme")||w.THEMES.DEFAULT;document.documentElement.setAttribute("data-theme",t),this.updateThemeIcon(t),p.on(e,"click",()=>{const i=document.documentElement.getAttribute("data-theme")==="light"?"dark":"light";document.documentElement.setAttribute("data-theme",i),localStorage.setItem("theme",i),this.updateThemeIcon(i),this.visualEngine&&this.visualEngine.updateTheme(i),this.heroEngine&&this.heroEngine.updateTheme(i),this.neuralBackground&&this.neuralBackground.updateTheme(i),p.trigger(window,"themeChanged",{theme:i})})}updateThemeIcon(e){const t=h.select("#theme-toggle i");t&&(t.className=e==="light"?"fas fa-moon":"fas fa-sun")}setupMobileMenu(){const e=h.select("#menu-toggle"),t=h.select(".cosmic-nav")||h.select(".nav-links");!e||!t||(p.on(e,"click",()=>{h.toggleClass(t,"active"),h.toggleClass(e,"active"),document.body.style.overflow=t.classList.contains("active")?"hidden":""}),h.selectAll(".nav-link, .cosmic-link").forEach(i=>{p.on(i,"click",()=>{h.removeClasses(t,"active"),h.removeClasses(e,"active"),document.body.style.overflow=""})}),p.on(document,"click",i=>{!e.contains(i.target)&&!t.contains(i.target)&&(h.removeClasses(t,"active"),h.removeClasses(e,"active"),document.body.style.overflow="")}))}setupSmoothScrolling(){h.selectAll('a[href^="#"]').forEach(e=>{p.on(e,"click",t=>{t.preventDefault();const i=h.select(e.getAttribute("href"));i&&i.scrollIntoView({behavior:"smooth",block:"start"})})})}setupLanguageToggle(){const e=h.select("#language-toggle");if(!e)return;const t=localStorage.getItem("language")||w.LANGUAGES.DEFAULT;document.documentElement.setAttribute("data-language",t),p.on(e,"click",()=>{const i=localStorage.getItem("language")==="en"?"es":"en";localStorage.setItem("language",i),document.documentElement.setAttribute("data-language",i),p.trigger(window,"languageChanged",{language:i})})}setupMobileOptimizations(){/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)&&h.addClasses(document.body,"mobile-device"),window.innerWidth<=w.BREAKPOINTS.TABLET&&window.innerWidth>w.BREAKPOINTS.MOBILE&&h.addClasses(document.body,"tablet-device")}setupTouchInteractions(){h.selectAll(".btn, .tech-badge, .nav-link, .card").forEach(t=>{p.on(t,"touchstart",()=>{t.style.transform="scale(0.95)"}),p.on(t,"touchend",()=>{t.style.transform=""}),p.on(t,"touchcancel",()=>{t.style.transform=""})})}setupGlobalEvents(){p.on(document,"visibilitychange",()=>{}),p.on(window,"resize",ne.throttle(()=>{},100)),p.on(document,"keydown",e=>{if(e.key==="Escape"){const t=h.select(".cosmic-nav")||h.select(".nav-links"),i=h.select("#menu-toggle");t?.classList.contains("active")&&(h.removeClasses(t,"active"),h.removeClasses(i,"active"),document.body.style.overflow="")}e.key==="t"&&e.ctrlKey&&(e.preventDefault(),h.select("#theme-toggle")?.click()),this.konamiEasterEgg&&this.konamiEasterEgg.handleKeyPress(e.key)})}}class ue{constructor(){this.progressBar=document.getElementById("loader-progress-bar"),this.progressValue=document.querySelector(".loader-progress-value"),this.statusText=document.querySelector(".loader-status"),this.currentProgress=0,this.targetProgress=0,this.isComplete=!1,this.stages=[{progress:15,status:"Loading assets..."},{progress:35,status:"Initializing..."},{progress:55,status:"Loading modules..."},{progress:75,status:"Preparing UI..."},{progress:90,status:"Almost ready..."},{progress:100,status:"Complete!"}]}updateProgress(e){this.targetProgress=Math.min(e,100),this.animateProgress()}animateProgress(){if(this.currentProgress<this.targetProgress){this.currentProgress+=Math.max(1,(this.targetProgress-this.currentProgress)*.1),this.currentProgress>=this.targetProgress-.5&&(this.currentProgress=this.targetProgress);const e=Math.round(this.currentProgress);this.progressBar&&(this.progressBar.style.width=`${e}%`),this.progressValue&&(this.progressValue.textContent=`${e}%`),this.updateStatus(e),this.currentProgress<this.targetProgress&&requestAnimationFrame(()=>this.animateProgress())}}updateStatus(e){if(this.statusText){for(let t=this.stages.length-1;t>=0;t--)if(e>=this.stages[t].progress-10){this.statusText.textContent=this.stages[t].status;break}}}complete(){this.isComplete=!0,this.updateProgress(100)}hide(){const e=document.getElementById("page-loader");e&&(e.classList.add("loaded"),setTimeout(()=>{e.style.display="none"},800))}}const y=new ue;setTimeout(()=>y.updateProgress(15),100);setTimeout(()=>y.updateProgress(35),400);setTimeout(()=>y.updateProgress(55),800);const G=()=>{y.complete(),setTimeout(()=>y.hide(),400)},me=()=>{const o=document.querySelector("[data-header-progress]");o&&window.addEventListener("scroll",()=>{const e=window.scrollY,t=document.documentElement.scrollHeight-window.innerHeight,i=e/t*100;o.style.width=`${i}%`})},pe=()=>{const o=document.getElementById("contact-form");o&&o.addEventListener("submit",async e=>{e.preventDefault();const t=o.querySelector('button[type="submit"]'),i=t.innerHTML;t.innerHTML='<i class="fas fa-spinner fa-spin"></i> Sending...',t.disabled=!0,await new Promise(s=>setTimeout(s,1500)),t.innerHTML='<i class="fas fa-check"></i> Sent!',o.reset(),setTimeout(()=>{t.innerHTML=i,t.disabled=!1},2e3)})};document.addEventListener("DOMContentLoaded",async()=>{y.updateProgress(60);const o=new he;y.updateProgress(75),await o.init(),y.updateProgress(90),window.portfolio=o,me(),pe(),y.updateProgress(100),setTimeout(G,600)});window.addEventListener("load",()=>{y.isComplete||(y.updateProgress(100),setTimeout(G,800))});
