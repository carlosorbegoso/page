import{V as p,M as y,S as M,a as S,C as g,B as x,L as D,b as I,c as $,d as u,P as Q,e as k,f as L,F as X,g as B,W as O,G as R,A as w,h as ee,i as te,T as V,j as ie,k as E,l as Y,D as W,O as se,m as U,n as q,R as oe,o as ne}from"./three.module.Bmjna7aR.js";const P={APP_NAME:"Carlos Orbegoso Portfolio",VERSION:"2.0.0",DEBUG:!1,LOGGING:{LEVEL:"warn",SHOW_TIMESTAMPS:!0,SHOW_PREFIX:!0,CONSOLE_OUTPUT:!0},ANIMATIONS:{ENABLED:!0,DURATION:{FAST:200,NORMAL:400,SLOW:800},EASING:{FAST:"ease",NORMAL:"cubic-bezier(0.4, 0, 0.2, 1)",SLOW:"cubic-bezier(0.4, 0, 0.2, 1)"}},THREE_JS:{ENABLED:!0,PERFORMANCE:{MOBILE:"low",TABLET:"medium",DESKTOP:"high"},PARTICLES:{COUNT:{MOBILE:100,TABLET:200,DESKTOP:500}}},LANGUAGES:{DEFAULT:"en",SUPPORTED:["en","es"],FALLBACK:"en"},THEMES:{DEFAULT:"light",SUPPORTED:["light","dark"],AUTO_DETECT:!0},BREAKPOINTS:{MOBILE:768,TABLET:1024,DESKTOP:1200},API:{BASE_URL:"",TIMEOUT:5e3,RETRY_ATTEMPTS:3},NOTIFICATIONS:{AUTO_HIDE:!0,DURATION:5e3,POSITION:"top-right",MAX_VISIBLE:3},SCROLL:{SMOOTH:!0,OFFSET:80,THROTTLE:100},PERFORMANCE:{LAZY_LOADING:!0,DEBOUNCE_DELAY:300,THROTTLE_DELAY:100,CLEANUP_INTERVAL:3e4}};class ae{constructor(){this.prefix="[Portfolio]",this.logLevel="warn"}formatMessage(e,t){const i=new Date().toLocaleTimeString();return`${this.prefix} [${i}] [${e.toUpperCase()}] ${t}`}shouldLog(e){const t={error:0,warn:1,info:2,debug:3};return t[e]<=t[this.logLevel]}error(e,t=null){const i=this.formatMessage("error",e);console.error(i,t)}warn(e,t=null){const i=this.formatMessage("warn",e);console.warn(i,t)}info(e,t=null){if(this.shouldLog("info")){const i=this.formatMessage("info",e);console.info(i,t)}}debug(e,t=null){if(this.shouldLog("debug")){const i=this.formatMessage("debug",e);console.debug(i,t)}}performance(e,t=null){if(this.shouldLog("info")){const i=this.formatMessage("perf",e);console.log(i,t)}}animation(e,t=null){if(this.shouldLog("info")){const i=this.formatMessage("anim",e);console.log(i,t)}}threejs(e,t=null){if(this.shouldLog("info")){const i=this.formatMessage("three",e);console.log(i,t)}}setLogLevel(e){this.logLevel=e}}const z=new ae,N={error:(r,e)=>z.error(r,e),warn:(r,e)=>z.warn(r,e),info:(r,e)=>z.info(r,e),debug:(r,e)=>z.debug(r,e),performance:(r,e)=>z.performance(r,e),animation:(r,e)=>z.animation(r,e),threejs:(r,e)=>z.threejs(r,e),setLogLevel:r=>z.setLogLevel(r)},v={select(r,e=document){return e.querySelector(r)},selectAll(r,e=document){return e.querySelectorAll(r)},create(r,e={},t=""){const i=document.createElement(r);return Object.entries(e).forEach(([s,o])=>{s==="className"?i.className=o:s==="textContent"?i.textContent=o:i.setAttribute(s,o)}),t&&(i.innerHTML=t),i},addClasses(r,...e){r.classList.add(...e)},removeClasses(r,...e){r.classList.remove(...e)},toggleClass(r,e,t){r.classList.toggle(e,t)}},b={on(r,e,t,i={}){r.addEventListener(e,t,i)},off(r,e,t){r.removeEventListener(e,t)},trigger(r,e,t={}){const i=new CustomEvent(e,{detail:t});r.dispatchEvent(i)}},re={debounce(r,e=P.PERFORMANCE.DEBOUNCE_DELAY){let t;return function(...i){clearTimeout(t),t=setTimeout(()=>r.apply(this,i),e)}},throttle(r,e=P.PERFORMANCE.THROTTLE_DELAY){let t=0;return function(...i){const s=Date.now();s-t>=e&&(t=s,r.apply(this,i))}},measureTime(r,e="Function execution"){performance.now();const t=r();return performance.now(),t}};class ce{constructor(e){this.scene=e,this.particles=[],this.currentTheme="light",this.performanceMode="high",this.createParticles()}createParticles(){const e=this.performanceMode==="high"?80:40;for(let t=0;t<e;t++){const i={mesh:new y(new M(1+Math.random()*2,8,8),new S({color:new g().setHSL(Math.random()*.3+.6,.8,.7+Math.random()*.3),transparent:!0,opacity:.3+Math.random()*.4})),velocity:new p((Math.random()-.5)*2,(Math.random()-.5)*1.5,(Math.random()-.5)*2),life:Math.random()*120+60,maxLife:Math.random()*120+60,originalPosition:new p,rotationSpeed:(Math.random()-.5)*.02,pulseSpeed:Math.random()*.05+.02},s=t/e*Math.PI*4,o=200+Math.random()*600,n=(Math.random()-.5)*800;i.mesh.position.set(Math.cos(s)*o,n,Math.sin(s)*o),i.originalPosition.copy(i.mesh.position),this.particles.push(i),this.scene.add(i.mesh)}}animate(e){this.particles.forEach((t,i)=>{t.mesh.position.add(t.velocity),t.life--,t.life<=0&&(t.life=t.maxLife,t.mesh.position.copy(t.originalPosition),t.mesh.position.add(new p((Math.random()-.5)*100,(Math.random()-.5)*100,(Math.random()-.5)*100)));const o=1+Math.sin(e*t.pulseSpeed+i*.1)*.1;t.mesh.scale.setScalar(o),t.mesh.material.opacity=.5+Math.sin(e+t.life*.05)*.2;const n=(e*.05+i*.01)%1,a=new g().setHSL(n,.7,.6);t.mesh.material.color.lerp(a,.005)})}updateTheme(e){this.currentTheme=e;const t=e==="dark";this.particles.forEach(i=>{const s=t?.6:.5;i.mesh.material.color.setHSL(s,.8,.7)})}updateScroll(e){this.particles.forEach(t=>{const i=e*100;t.mesh.position.z=t.mesh.position.z+i*.01,t.mesh.position.z>1e3&&(t.mesh.position.z=-1e3)})}setPerformanceMode(e){this.performanceMode=e,e==="low"?this.particles.forEach(t=>{t.mesh.visible=!1}):this.particles.forEach(t=>{t.mesh.visible=!0})}dispose(){this.particles.forEach(e=>{e.mesh.geometry&&e.mesh.geometry.dispose(),e.mesh.material&&e.mesh.material.dispose(),this.scene.remove(e.mesh)}),this.particles=[]}}class le{constructor(e){this.scene=e,this.constellations=[],this.currentTheme="light",this.performanceMode="high",this.createConstellations()}createConstellations(){const e=this.performanceMode==="high"?8:6;for(let t=0;t<e;t++){const i={stars:[],connections:[],center:new p((Math.random()-.5)*1600,(Math.random()-.5)*1e3,(Math.random()-.5)*800),section:t,pulsePhase:Math.random()*Math.PI*2},s=Math.floor(Math.random()*6)+4,o=[];for(let n=0;n<s;n++){const a=new y(new M(2+Math.random()*2,8,8),new S({color:new g().setHSL(.6+Math.random()*.1,.7,.6+Math.random()*.3),transparent:!0,opacity:.6+Math.random()*.3}));let l;if(n===0)l=i.center.clone();else{const c=n/s*Math.PI*2,h=80+Math.random()*120;l=i.center.clone().add(new p(Math.cos(c)*h,Math.sin(c)*h*.5,(Math.random()-.5)*100))}a.position.copy(l),o.push(l),i.stars.push(a),this.scene.add(a)}for(let n=0;n<o.length;n++)for(let a=n+1;a<o.length;a++)if(o[n].distanceTo(o[a])<150){const c=this.createConnection(o[n],o[a]);i.connections.push(c),this.scene.add(c)}this.constellations.push(i)}}createConnection(e,t){const i=new x().setFromPoints([e,t]),s=new D({color:6600182,transparent:!0,opacity:.4});return new I(i,s)}animate(e){this.constellations.forEach((t,i)=>{const s=t.section*.4;t.stars.forEach((o,n)=>{const a=n*.3,l=s+a;o.position.y+=Math.sin(e+l)*.3,o.rotation.x+=.008,o.rotation.y+=.006,o.rotation.z+=.004;const c=Math.sin(e*.8+l)*.08;o.scale.setScalar(1+c);const h=Math.sin(e*3+n*.4)*.3+.7;o.material.opacity=.6+h*.3;const m=(e*.03+n*.1)%1,d=new g().setHSL(m,.6,.7);o.material.color.lerp(d,.003)}),t.connections.forEach((o,n)=>{const a=n*.2,l=Math.sin(e*2+a)*.3+.7;o.material.opacity=.3+l*.3;const c=Math.sin(e*1.5+n*.2)*.15+1;o.scale.setScalar(c)})})}updateTheme(e){this.currentTheme=e;const t=e==="dark";this.constellations.forEach(i=>{i.stars.forEach(s=>{const o=t?.6:.5;s.material.color.setHSL(o,.8,.7)})})}updateScroll(e){this.constellations.forEach((t,i)=>{const s=document.querySelectorAll("section")[i];if(s){const o=s.getBoundingClientRect(),n=o.top+o.height/2,a=window.innerHeight/2,l=Math.abs(n-a),c=window.innerHeight/2,h=Math.max(0,1-l/c);t.stars.forEach(m=>{m.material.opacity=.3+h*.5;const d=1+h*.1;m.scale.setScalar(d),m.position.x+=e*.5*(Math.random()-.5),m.position.y+=e*.3*(Math.random()-.5)}),t.connections.forEach(m=>{m.material.opacity=.2+h*.2})}})}setPerformanceMode(e){this.performanceMode=e,e==="low"?this.constellations.forEach(t=>{t.stars.forEach(i=>{i.visible=!1})}):this.constellations.forEach(t=>{t.stars.forEach(i=>{i.visible=!0})})}dispose(){this.constellations.forEach(e=>{e.stars.forEach(t=>{t.geometry&&t.geometry.dispose(),t.material&&t.material.dispose(),this.scene.remove(t)}),e.connections.forEach(t=>{t.geometry&&t.geometry.dispose(),t.material&&t.material.dispose(),this.scene.remove(t)})}),this.constellations=[]}}class he{constructor(e,t){this.scene=e,this.camera=t,this.cursor=null,this.cursorTrail=[],this.currentTheme="light",this.performanceMode="high",this.createCursor()}createCursor(){const e=new M(8,16,16),t=new S({color:6600182,transparent:!0,opacity:.8});this.cursor=new y(e,t),this.scene.add(this.cursor),this.cursorTrail=[];for(let i=0;i<10;i++){const s=new y(new M(4,8,8),new S({color:6600182,transparent:!0,opacity:.3}));this.cursorTrail.push(s),this.scene.add(s)}}updatePosition(e,t){if(!(!this.cursor||!this.camera))try{const i=new $;i.x=e/window.innerWidth*2-1,i.y=-(t/window.innerHeight)*2+1;const s=new p(i.x,i.y,.5);s.unproject(this.camera);const o=s.sub(this.camera.position).normalize(),n=-this.camera.position.z/o.z,a=this.camera.position.clone().add(o.multiplyScalar(n));this.cursor.position.copy(a),this.updateCursorTrail(a)}catch(i){console.warn("⚠️ Error actualizando posición del cursor:",i)}}updateCursorTrail(e){this.cursorTrail.forEach((t,i)=>{const s=e.clone();s.add(new p((Math.random()-.5)*20,(Math.random()-.5)*20,0)),t.position.lerp(s,.1),t.material.opacity=.3*(1-i/this.cursorTrail.length)})}createClickEffect(e,t){if(this.camera)try{const i=new $;i.x=e/window.innerWidth*2-1,i.y=-(t/window.innerHeight)*2+1;const s=new p(i.x,i.y,.5);s.unproject(this.camera);const o=s.sub(this.camera.position).normalize(),n=-this.camera.position.z/o.z,a=this.camera.position.clone().add(o.multiplyScalar(n));for(let l=0;l<20;l++){const c=new y(new M(2,8,8),new S({color:new g().setHSL(Math.random()*.3+.6,.8,.7),transparent:!0,opacity:.8}));c.position.copy(a),c.velocity=new p((Math.random()-.5)*10,(Math.random()-.5)*10,(Math.random()-.5)*10),c.life=60,this.scene.add(c),setTimeout(()=>{this.scene.remove(c)},1e3)}}catch(i){console.warn("⚠️ Error creando efecto de click:",i)}}animate(e){if(this.cursor){this.cursor.rotation.y+=.03,this.cursor.rotation.x+=.01,this.cursor.material.opacity=.7+Math.sin(e*4)*.2;const t=e*.2%1,i=new g().setHSL(t,.8,.7);this.cursor.material.color.lerp(i,.01)}}updateTheme(e){this.currentTheme=e;const t=e==="dark";this.cursor&&this.cursor.material.color.setHex(t?6600182:1668818),this.cursorTrail.forEach(i=>{i.material.color.setHex(t?6600182:1668818)})}setPerformanceMode(e){this.performanceMode=e,e==="low"?(this.cursor&&(this.cursor.visible=!1),this.cursorTrail.forEach(t=>{t.visible=!1})):(this.cursor&&(this.cursor.visible=!0),this.cursorTrail.forEach(t=>{t.visible=!0}))}dispose(){this.cursor&&(this.cursor.geometry&&this.cursor.geometry.dispose(),this.cursor.material&&this.cursor.material.dispose(),this.scene.remove(this.cursor)),this.cursorTrail.forEach(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose(),this.scene.remove(e)}),this.cursor=null,this.cursorTrail=[]}}class de{constructor(e){this.scene=e,this.background=null,this.currentTheme="light",this.performanceMode="high",this.createBackground()}createBackground(){const e=new x,t=this.performanceMode==="high"?1e3:500,i=new Float32Array(t*3),s=new Float32Array(t*3),o=new Float32Array(t);for(let a=0;a<t;a++){i[a*3]=(Math.random()-.5)*2e3,i[a*3+1]=(Math.random()-.5)*2e3,i[a*3+2]=(Math.random()-.5)*2e3;const l=new g;l.setHSL(Math.random()*.1+.6,.8,Math.random()*.3+.7),s[a*3]=l.r,s[a*3+1]=l.g,s[a*3+2]=l.b,o[a]=Math.random()*3+1}e.setAttribute("position",new u(i,3)),e.setAttribute("color",new u(s,3)),e.setAttribute("size",new u(o,1));const n=new Q({size:2,vertexColors:!0,transparent:!0,opacity:.3});this.background=new k(e,n),this.scene.add(this.background)}updateTheme(e){if(this.currentTheme=e,this.background){const i=e==="dark"?.6:.5,s=this.background.geometry.attributes.color;for(let o=0;o<s.count;o++){const n=new g;n.setHSL(i+Math.random()*.1,.8,Math.random()*.3+.7),s.setXYZ(o,n.r,n.g,n.b)}s.needsUpdate=!0}}updateScroll(e){this.background&&(this.background.rotation.y=e*Math.PI*.1,this.background.position.y=e*50)}setPerformanceMode(e){this.performanceMode=e,e==="low"?this.background&&(this.background.visible=!1):this.background&&(this.background.visible=!0)}dispose(){this.background&&(this.background.geometry&&this.background.geometry.dispose(),this.background.material&&this.background.material.dispose(),this.scene.remove(this.background)),this.background=null}}class me{constructor(){this.isInitialized=!1,this.currentTheme="light",this.performanceMode="high",this.particleSystem=null,this.constellationSystem=null,this.cursorSystem=null,this.backgroundSystem=null,this.scene=null,this.camera=null,this.renderer=null,this.sectionEffects=new Map,this.init()}async init(){try{this.createScene(),this.createCamera(),this.createRenderer(),this.backgroundSystem=new de(this.scene),this.particleSystem=new ce(this.scene);try{await this.initializeConstellationSystem()}catch(e){console.error("❌ Error inicializando ConstellationSystem:",e)}this.cursorSystem=new he(this.scene,this.camera),this.addEventListeners(),this.animate(),this.isInitialized=!0}catch(e){console.error("❌ Error inicializando motor visual:",e)}}async initializeConstellationSystem(){await new Promise(e=>setTimeout(e,50)),this.constellationSystem=new le(this.scene)}createScene(){this.scene=new L,this.scene.fog=new X(0,1e3,2e3)}createCamera(){this.camera=new B(75,window.innerWidth/window.innerHeight,.1,2e3),this.camera.position.set(0,0,500)}createRenderer(){this.renderer=new O({antialias:!0,alpha:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setClearColor(0,0),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),document.body.appendChild(this.renderer.domElement),this.renderer.domElement.style.position="fixed",this.renderer.domElement.style.top="0",this.renderer.domElement.style.left="0",this.renderer.domElement.style.width="100%",this.renderer.domElement.style.height="100%",this.renderer.domElement.style.zIndex="-1",this.renderer.domElement.style.pointerEvents="none"}initSectionEffects(e,t,i={}){try{const s={particles:{count:100,size:{min:1,max:3},speed:{min:.1,max:.3},opacity:{min:.3,max:.8},colors:["#64B5F6","#4FC3F7","#81D4FA"]},constellations:{count:3,starsPerConstellation:{min:4,max:6},connectionOpacity:.4,glowIntensity:.6},stars:{count:150,size:{min:.5,max:2},twinkleSpeed:{min:2,max:5}},floatingElements:{count:4,size:{min:2,max:4}}},o=this.getSectionSpecificConfig(e,s);this.createSectionContainer(t);const n={particles:this.createSectionParticles(t,o.particles),constellations:this.createSectionConstellations(t,o.constellations),stars:this.createSectionStars(t,o.stars),floatingElements:this.createSectionFloatingElements(t,o.floatingElements)};return this.sectionEffects.set(e,n),console.log(`✅ Efectos inicializados para ${e}`),n}catch(s){return console.error(`❌ Error inicializando efectos para ${e}:`,s),null}}getSectionSpecificConfig(e,t){const i=JSON.parse(JSON.stringify(t));switch(e.toLowerCase()){case"hero":i.particles.count=120,i.particles.colors=["#64B5F6","#4FC3F7","#81D4FA","#E3F2FD"],i.particles.speed={min:.1,max:.4},i.particles.opacity={min:.4,max:.9},i.constellations.count=4,i.constellations.connectionOpacity=.5,i.constellations.glowIntensity=.8,i.stars.count=180,i.stars.size={min:.8,max:2.5},i.stars.twinkleSpeed={min:2,max:6},i.floatingElements.count=5,i.floatingElements.size={min:2,max:5};break;case"about":i.particles.count=80,i.particles.colors=["#64B5F6","#4FC3F7","#81D4FA","#E3F2FD"],i.particles.speed={min:.05,max:.2},i.particles.opacity={min:.2,max:.6},i.particles.size={min:.8,max:2.2},i.constellations.count=3,i.constellations.connectionOpacity=.3,i.constellations.glowIntensity=.4,i.constellations.starsPerConstellation={min:3,max:5},i.stars.count=100,i.stars.size={min:.5,max:1.8},i.stars.twinkleSpeed={min:3,max:7},i.floatingElements.count=4,i.floatingElements.size={min:1.5,max:3.5};break;case"experience":i.particles.count=60,i.particles.colors=["#FF6B35","#FF5722","#FF8A65","#FFCC02"],i.particles.speed={min:.03,max:.15},i.particles.opacity={min:.15,max:.5},i.particles.size={min:.6,max:1.8},i.constellations.count=2,i.constellations.connectionOpacity=.4,i.constellations.glowIntensity=.3,i.constellations.starsPerConstellation={min:4,max:6},i.stars.count=80,i.stars.size={min:.4,max:1.5},i.stars.twinkleSpeed={min:4,max:8},i.floatingElements.count=3,i.floatingElements.size={min:1,max:2.8};break;case"skills":i.particles.count=120,i.particles.colors=["#4CAF50","#8BC34A","#64B5F6","#00BCD4"],i.particles.speed={min:.08,max:.25},i.particles.opacity={min:.25,max:.7},i.particles.size={min:1,max:2.5},i.constellations.count=6,i.constellations.connectionOpacity=.5,i.constellations.glowIntensity=.6,i.constellations.starsPerConstellation={min:3,max:5},i.stars.count=150,i.stars.size={min:.6,max:2},i.stars.twinkleSpeed={min:2,max:5},i.floatingElements.count=6,i.floatingElements.size={min:1.5,max:4};break;case"projects":i.particles.count=90,i.particles.colors=["#9C27B0","#673AB7","#64B5F6","#E91E63"],i.particles.speed={min:.06,max:.2},i.particles.opacity={min:.2,max:.6},i.particles.size={min:.8,max:2.2},i.constellations.count=4,i.constellations.connectionOpacity=.4,i.constellations.glowIntensity=.5,i.constellations.starsPerConstellation={min:4,max:6},i.stars.count=120,i.stars.size={min:.5,max:1.8},i.stars.twinkleSpeed={min:3,max:6},i.floatingElements.count=5,i.floatingElements.size={min:1.2,max:3.2};break;case"contact":i.particles.count=70,i.particles.colors=["#00BCD4","#4FC3F7","#64B5F6","#81C784"],i.particles.speed={min:.04,max:.18},i.particles.opacity={min:.18,max:.55},i.particles.size={min:.7,max:2},i.constellations.count=3,i.constellations.connectionOpacity=.3,i.constellations.glowIntensity=.4,i.constellations.starsPerConstellation={min:3,max:5},i.stars.count=90,i.stars.size={min:.4,max:1.6},i.stars.twinkleSpeed={min:3,max:7},i.floatingElements.count=4,i.floatingElements.size={min:1,max:2.5};break}return i}createSectionContainer(e){let t=document.getElementById(e);if(!t){t=document.createElement("div"),t.id=e,t.className="section-effects-container",t.style.cssText=`
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
                overflow: hidden;
            `;const i=document.querySelector(`#${e.replace("-effects","")}`);i&&(i.style.position="relative",i.appendChild(t))}return t}createSectionParticles(e,t){const i=document.getElementById(e);if(!i)return null;const s=[];for(let o=0;o<t.count;o++){const n=document.createElement("div");n.className="section-particle",n.style.cssText=`
                position: absolute;
                width: ${Math.random()*(t.size.max-t.size.min)+t.size.min}px;
                height: ${Math.random()*(t.size.max-t.size.min)+t.size.min}px;
                background: ${t.colors[Math.floor(Math.random()*t.colors.length)]};
                border-radius: 50%;
                opacity: ${Math.random()*(t.opacity.max-t.opacity.min)+t.opacity.min};
                pointer-events: none;
                z-index: 2;
            `,n.style.left=Math.random()*100+"%",n.style.top=Math.random()*100+"%";const a=(Math.random()*(t.speed.max-t.speed.min)+t.speed.min)*10;n.style.animation=`sectionParticleFloat ${a}s ease-in-out infinite`,n.style.animationDelay=Math.random()*5+"s",i.appendChild(n),s.push(n)}return s}createSectionConstellations(e,t){const i=document.getElementById(e);if(!i)return null;const s=[];for(let o=0;o<t.count;o++){const n=document.createElement("div");n.className="section-constellation",n.style.cssText=`
                position: absolute;
                width: ${60+Math.random()*40}px;
                height: ${60+Math.random()*40}px;
                background: radial-gradient(circle, rgba(100, 181, 246, 0.08) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 3;
            `,n.style.left=Math.random()*80+10+"%",n.style.top=Math.random()*80+10+"%",n.style.animation="sectionConstellationGlow 6s ease-in-out infinite",n.style.animationDelay=Math.random()*3+"s",i.appendChild(n),s.push(n)}return s}createSectionStars(e,t){const i=document.getElementById(e);if(!i)return null;const s=[];for(let o=0;o<t.count;o++){const n=document.createElement("div");n.className="section-star",n.style.cssText=`
                position: absolute;
                width: ${Math.random()*(t.size.max-t.size.min)+t.size.min}px;
                height: ${Math.random()*(t.size.max-t.size.min)+t.size.min}px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                pointer-events: none;
                z-index: 4;
            `,n.style.left=Math.random()*100+"%",n.style.top=Math.random()*100+"%";const a=Math.random()*(t.twinkleSpeed.max-t.twinkleSpeed.min)+t.twinkleSpeed.min;n.style.animation=`sectionStarTwinkle ${a}s ease-in-out infinite`,n.style.animationDelay=Math.random()*3+"s",i.appendChild(n),s.push(n)}return s}createSectionFloatingElements(e,t){const i=document.getElementById(e);if(!i)return null;const s=[];for(let o=0;o<t.count;o++){const n=document.createElement("div");n.className="section-floating-element",n.style.cssText=`
                position: absolute;
                width: ${Math.random()*(t.size.max-t.size.min)+t.size.min}px;
                height: ${Math.random()*(t.size.max-t.size.min)+t.size.min}px;
                background: rgba(100, 181, 246, 0.3);
                border-radius: 50%;
                pointer-events: none;
                z-index: 5;
            `,n.style.left=Math.random()*80+10+"%",n.style.top=Math.random()*80+10+"%",n.style.animation="sectionFloat 8s ease-in-out infinite",n.style.animationDelay=Math.random()*4+"s",i.appendChild(n),s.push(n)}return s}cleanupSectionEffects(e){const t=this.sectionEffects.get(e);t&&(t.particles&&t.particles.forEach(i=>i.remove()),t.constellations&&t.constellations.forEach(i=>i.remove()),t.stars&&t.stars.forEach(i=>i.remove()),t.floatingElements&&t.floatingElements.forEach(i=>i.remove()),this.sectionEffects.delete(e))}addEventListeners(){window.addEventListener("resize",this.onWindowResize.bind(this)),window.addEventListener("scroll",this.onScroll.bind(this)),setTimeout(()=>{this.createTechTagHoverEffects(),this.createButtonHoverEffects(),this.createCardHoverEffects()},1e3)}createTechTagHoverEffects(){try{document.querySelectorAll(".tech-tag, .tech-tag-compact").forEach(t=>{t.addEventListener("mouseenter",i=>{this.createHoverParticles(i.target,"tech-tag")}),t.addEventListener("mouseenter",i=>{this.createHoverConstellation(i.target,"tech-tag")})}),console.log("✅ Efectos de hover para tech tags configurados")}catch(e){console.error("❌ Error configurando efectos de hover para tech tags:",e)}}createButtonHoverEffects(){try{document.querySelectorAll(".btn, .btn-primary, .btn-secondary").forEach(t=>{t.addEventListener("mouseenter",i=>{this.createHoverParticles(i.target,"button")}),t.addEventListener("mouseenter",i=>{this.createHoverGlow(i.target,"button")})}),console.log("✅ Efectos de hover para botones configurados")}catch(e){console.error("❌ Error configurando efectos de hover para botones:",e)}}createCardHoverEffects(){try{document.querySelectorAll(".project-card, .about-card, .experience-item, .skill-card").forEach(t=>{t.addEventListener("mouseenter",i=>{this.createHoverParticles(i.target,"card")}),t.addEventListener("mouseenter",i=>{this.createCardElevation(i.target)})}),console.log("✅ Efectos de hover para cards configurados")}catch(e){console.error("❌ Error configurando efectos de hover para cards:",e)}}createHoverParticles(e,t){try{const i=e.getBoundingClientRect(),s=i.left+i.width/2,o=i.top+i.height/2;let n=document.getElementById("hover-particles-container");n||(n=document.createElement("div"),n.id="hover-particles-container",n.style.cssText=`
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 1000;
                `,document.body.appendChild(n));const a=t==="tech-tag"?8:t==="button"?15:20,l=this.getHoverColors(t);for(let c=0;c<a;c++){const h=document.createElement("div");h.className="hover-particle",h.style.cssText=`
                    position: absolute;
                    width: ${Math.random()*3+1}px;
                    height: ${Math.random()*3+1}px;
                    background: ${l[Math.floor(Math.random()*l.length)]};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1001;
                    opacity: 0.8;
                    animation: hoverParticleFloat 1.5s ease-out forwards;
                `,h.style.left=s+"px",h.style.top=o+"px";const m=Math.PI*2*c/a,d=Math.random()*60+20,f=s+Math.cos(m)*d,C=o+Math.sin(m)*d;h.style.setProperty("--end-x",f+"px"),h.style.setProperty("--end-y",C+"px"),n.appendChild(h),setTimeout(()=>{h.parentNode&&h.parentNode.removeChild(h)},1500)}}catch(i){console.error("❌ Error creando partículas de hover:",i)}}getHoverColors(e){const t=this.currentTheme==="dark";switch(e){case"tech-tag":return t?["#4FC3F7","#81D4FA","#E3F2FD","#BBDEFB"]:["#64B5F6","#4FC3F7","#81D4FA","#E3F2FD"];case"button":return t?["#4FC3F7","#81D4FA","#E3F2FD","#BBDEFB"]:["#64B5F6","#4FC3F7","#81D4FA","#E3F2FD"];case"card":return t?["#4FC3F7","#81D4FA","#E3F2FD","#BBDEFB"]:["#64B5F6","#4FC3F7","#81D4FA","#E3F2FD"];default:return["#64B5F6","#4FC3F7","#81D4FA"]}}createHoverConstellation(e,t){try{const i=e.getBoundingClientRect(),s=i.left+i.width/2,o=i.top+i.height/2;let n=document.getElementById("hover-constellation-container");n||(n=document.createElement("div"),n.id="hover-constellation-container",n.style.cssText=`
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 999;
                `,document.body.appendChild(n));const a=document.createElement("div");a.className="hover-constellation",a.style.cssText=`
                position: absolute;
                width: 80px;
                height: 80px;
                left: ${s-40}px;
                top: ${o-40}px;
                background: radial-gradient(circle, rgba(100, 181, 246, 0.1) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                opacity: 0;
                animation: hoverConstellationGlow 2s ease-out forwards;
            `,n.appendChild(a),setTimeout(()=>{a.parentNode&&a.parentNode.removeChild(a)},2e3)}catch(i){console.error("❌ Error creando constelación de hover:",i)}}createHoverGlow(e,t){try{e.classList.add("button-glow-active"),setTimeout(()=>{e.classList.remove("button-glow-active")},2e3)}catch(i){console.error("❌ Error creando glow de hover:",i)}}createCardElevation(e){try{e.classList.add("card-elevation-active"),setTimeout(()=>{e.classList.remove("card-elevation-active")},2e3)}catch(t){console.error("❌ Error creando elevación de card:",t)}}applyParallaxEffects(){try{const e=window.scrollY,t=window.innerHeight;this.sectionEffects.forEach((i,s)=>{i&&i.particles&&i.particles.forEach((o,n)=>{const a=this.getParallaxSpeed(s),l=e*a*(n%3+1)*.1;o.style.transform=`translateY(${l}px)`})})}catch(e){console.error("❌ Error aplicando efectos de parallax:",e)}}getParallaxSpeed(e){switch(e.toLowerCase()){case"hero":return .3;case"about":return .2;case"experience":return .15;case"skills":return .25;case"projects":return .2;case"contact":return .15;default:return .2}}applyThemeEffects(e){try{this.currentTheme=e;const t=e==="dark";this.constellationSystem&&this.constellationSystem.updateTheme(e),this.sectionEffects.forEach((i,s)=>{this.updateSectionTheme(s,e)}),this.applyInteractiveThemeEffects(e),console.log(`✅ Efectos de tema aplicados: ${e}`)}catch(t){console.error("❌ Error aplicando efectos de tema:",t)}}applyInteractiveThemeEffects(e){try{const t=e==="dark";document.querySelectorAll(".tech-tag, .btn, .project-card, .about-card").forEach(s=>{t?(s.classList.add("theme-dark"),s.classList.remove("theme-light")):(s.classList.add("theme-light"),s.classList.remove("theme-dark"))})}catch(t){console.error("❌ Error aplicando efectos de tema interactivos:",t)}}onWindowResize(){this.camera&&this.renderer&&(this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight))}onScroll(){this.applyParallaxEffects()}animate(){this.animationId=requestAnimationFrame(this.animate.bind(this));const e=Date.now()*.001;this.constellationSystem&&typeof this.constellationSystem.animate=="function"&&this.constellationSystem.animate(e),this.renderer&&this.scene&&this.camera&&this.renderer.render(this.scene,this.camera)}updateTheme(e){this.currentTheme=e,this.constellationSystem&&this.constellationSystem.updateTheme(e),this.sectionEffects.forEach((t,i)=>{this.updateSectionTheme(i,e)})}updateSectionTheme(e,t){const i=this.sectionEffects.get(e);if(!i)return;const s=t==="dark";i.particles&&i.particles.forEach(o=>{s?o.style.filter="brightness(1.2)":o.style.filter="brightness(1)"})}destroy(){this.animationId&&cancelAnimationFrame(this.animationId),this.sectionEffects.forEach((e,t)=>{this.cleanupSectionEffects(t)}),this.renderer&&this.renderer.dispose()}}class ue{constructor(e="visual-effects-container"){this.containerId=e,this.container=null,this.scene=null,this.camera=null,this.renderer=null,this.animationId=null,this.brainOutlines=[],this.neuralPaths=[],this.electricBolts=[],this.nodes=[],this.colors={cyan:65535,purple:11158783,pink:16729258,green:4521864,orange:16746564,blue:4491519,yellow:16777028},this.cameraState={targetX:0,targetY:0,targetZ:80,currentX:0,currentY:0,currentZ:80},this.mouse={x:0,y:0},this.scrollY=0,this.time=0,this.init()}init(){this.container=document.getElementById(this.containerId),this.container&&(this.setupScene(),this.setupCamera(),this.setupRenderer(),this.createBrainOutlines(),this.createNeuralPaths(),this.createElectricBolts(),this.createFloatingNodes(),this.setupInteraction(),this.startAnimation(),console.log("🧠 Neural System - Holographic Mode"))}setupScene(){this.scene=new L}setupCamera(){const e=window.innerWidth/window.innerHeight;this.camera=new B(60,e,.1,1e3),this.camera.position.set(0,0,80)}setupRenderer(){this.renderer=new O({antialias:!0,alpha:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setClearColor(0,0);const e=this.renderer.domElement;e.style.position="fixed",e.style.top="0",e.style.left="0",e.style.width="100vw",e.style.height="100vh",e.style.pointerEvents="none",e.style.zIndex="1",this.container.appendChild(e)}createBrainOutlines(){[{y:0,color:this.colors.cyan,type:"frontal",x:-35},{y:0,color:this.colors.cyan,type:"frontal",x:35},{y:-100,color:this.colors.purple,type:"parietal",x:-40},{y:-100,color:this.colors.purple,type:"parietal",x:40},{y:-200,color:this.colors.pink,type:"temporal",x:-45},{y:-200,color:this.colors.pink,type:"temporal",x:45},{y:-300,color:this.colors.green,type:"occipital",x:-35},{y:-300,color:this.colors.green,type:"occipital",x:35},{y:-400,color:this.colors.orange,type:"cerebellum",x:0},{y:-500,color:this.colors.blue,type:"brainstem",x:0}].forEach(t=>{const i=this.createStructureOutline(t);this.brainOutlines.push(i),this.scene.add(i.group)})}createStructureOutline(e){const t=new R,{type:i,color:s,x:o,y:n}=e;let a=[];switch(i){case"frontal":a=this.createFrontalOutline();break;case"parietal":a=this.createParietalOutline();break;case"temporal":a=this.createTemporalOutline();break;case"occipital":a=this.createOccipitalOutline();break;case"cerebellum":a=this.createCerebellumOutline();break;case"brainstem":a=this.createBrainstemOutline();break}const l=new D({color:s,transparent:!0,opacity:.6,blending:w});return a.forEach(c=>{const h=new x().setFromPoints(c),m=new I(h,l.clone());t.add(m)}),t.position.set(o,n,-40),t.scale.setScalar(8),{group:t,baseY:n,baseX:o,color:s,phase:Math.random()*Math.PI*2}}createFrontalOutline(){const e=[],t=[];for(let i=0;i<=1;i+=.05){const s=i*Math.PI*1.5-Math.PI*.25,o=2+Math.sin(i*Math.PI)*.5;t.push(new p(Math.cos(s)*o,Math.sin(s)*o*.8,Math.sin(i*Math.PI*2)*.3))}e.push(t);for(let i=0;i<3;i++){const s=[],o=(i-1)*.6;for(let n=0;n<=1;n+=.1)s.push(new p(-1.5+n*3,o+Math.sin(n*Math.PI*2)*.2,.1));e.push(s)}return e}createParietalOutline(){const e=[],t=[];for(let i=0;i<=1;i+=.05){const s=i*Math.PI*2;t.push(new p(Math.cos(s)*2.2,Math.sin(s)*1.5,Math.sin(i*Math.PI)*.2))}e.push(t);for(let i=0;i<2;i++){const s=[];for(let o=0;o<=1;o+=.1)s.push(new p(-1.8+o*3.6,(i-.5)*.8,0));e.push(s)}return e}createTemporalOutline(){const e=[],t=[];for(let s=0;s<=1;s+=.05){const o=s*Math.PI*2;t.push(new p(Math.cos(o)*2.5,Math.sin(o)*1.2,0))}e.push(t);const i=[];for(let s=0;s<=2;s+=.1){const o=.3+s*.3;i.push(new p(Math.cos(s*Math.PI)*o-.5,Math.sin(s*Math.PI)*o*.5,.1))}return e.push(i),e}createOccipitalOutline(){const e=[],t=[];for(let i=0;i<=1;i+=.05){const s=i*Math.PI*2,o=1.8+Math.cos(s*3)*.3;t.push(new p(Math.cos(s)*o,Math.sin(s)*o*.9,0))}e.push(t);for(let i=0;i<4;i++){const s=[],o=i/4*Math.PI*2;for(let n=0;n<=1;n+=.2)s.push(new p(Math.cos(o)*n*1.2,Math.sin(o)*n*1.2,0));e.push(s)}return e}createCerebellumOutline(){const e=[],t=[];for(let i=0;i<=1;i+=.03){const s=i*Math.PI*2,o=2.5+Math.sin(s*8)*.3;t.push(new p(Math.cos(s)*o,Math.sin(s)*o*.6,0))}e.push(t);for(let i=0;i<5;i++){const s=[],o=-1+i*.4;for(let n=0;n<=1;n+=.1)s.push(new p(-2+n*4,o,0));e.push(s)}return e}createBrainstemOutline(){const e=[],t=[];for(let s=0;s<=1;s+=.05){const o=-2+s*4,n=1+Math.sin(s*Math.PI)*.5;t.push(new p(n,o,0))}for(let s=1;s>=0;s-=.05){const o=-2+s*4,n=1+Math.sin(s*Math.PI)*.5;t.push(new p(-n,o,0))}t.push(t[0].clone()),e.push(t);const i=[];for(let s=0;s<=1;s+=.1)i.push(new p(0,-2+s*4,.1));return e.push(i),e}createNeuralPaths(){for(let t=0;t<40;t++){const i=-Math.random()*550,s=i+(Math.random()-.5)*150,o=[],n=(Math.random()-.5)*80,a=(Math.random()-.5)*80;for(let f=0;f<=1;f+=.1)o.push(new p(n+(a-n)*f+Math.sin(f*Math.PI*2)*10,i+(s-i)*f,-50+Math.random()*20));const l=new ee(o),c=new x().setFromPoints(l.getPoints(20)),h=Object.values(this.colors),m=new D({color:h[t%h.length],transparent:!0,opacity:.15,blending:w}),d=new I(c,m);d.userData={phase:Math.random()*Math.PI*2,speed:.5+Math.random()},this.neuralPaths.push(d),this.scene.add(d)}}createElectricBolts(){for(let e=0;e<30;e++){const t=this.createBolt();this.electricBolts.push(t),this.scene.add(t.line)}}createBolt(){const e=-Math.random()*550,t=(Math.random()-.5)*100,i=[];let s=t,o=e;const n=6+Math.floor(Math.random()*6),a=20+Math.random()*40;for(let d=0;d<=n;d++)i.push(new p(s,o,-45)),s+=(Math.random()-.5)*20,o+=a/n;const l=new x().setFromPoints(i),c=Object.values(this.colors),h=new D({color:c[Math.floor(Math.random()*c.length)],transparent:!0,opacity:0,blending:w});return{line:new I(l,h),active:!1,activeTime:0,nextActivation:Math.random()*8}}createFloatingNodes(){const e=Object.values(this.colors);for(let t=0;t<100;t++){const i=new M(.25+Math.random()*.3,6,6),s=new S({color:e[t%e.length],transparent:!0,opacity:.6,blending:w}),o=new y(i,s),n=(Math.random()-.5)*150,a=-Math.random()*600,l=-70+Math.random()*40;o.position.set(n,a,l),o.userData={phase:Math.random()*Math.PI*2,speed:1+Math.random()*2,baseX:n,baseY:a,baseZ:l,orbitRadius:3+Math.random()*8,orbitSpeed:.2+Math.random()*.5,floatAmplitude:2+Math.random()*5,floatSpeed:.3+Math.random()*.4,driftX:(Math.random()-.5)*.1,driftY:(Math.random()-.5)*.05},this.nodes.push(o),this.scene.add(o)}}setupInteraction(){window.addEventListener("mousemove",e=>{this.mouse.x=e.clientX/window.innerWidth*2-1,this.mouse.y=-(e.clientY/window.innerHeight)*2+1},{passive:!0}),window.addEventListener("wheel",e=>{this.cameraState.targetZ=te.clamp(this.cameraState.targetZ+e.deltaY*.05,40,150)},{passive:!0}),window.addEventListener("scroll",()=>{const e=document.documentElement.scrollHeight-window.innerHeight;this.scrollY=window.scrollY/e*550},{passive:!0}),window.addEventListener("resize",()=>{this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight)},{passive:!0})}startAnimation(){const e=()=>{this.animationId=requestAnimationFrame(e),this.time=performance.now()*.001,this.updateCamera(),this.animateOutlines(),this.animatePaths(),this.animateBolts(),this.animateNodes(),this.renderer.render(this.scene,this.camera)};e()}updateCamera(){this.cameraState.targetY=-this.scrollY,this.cameraState.targetX=this.mouse.x*20,this.cameraState.currentX+=(this.cameraState.targetX-this.cameraState.currentX)*.05,this.cameraState.currentY+=(this.cameraState.targetY-this.cameraState.currentY)*.05,this.cameraState.currentZ+=(this.cameraState.targetZ-this.cameraState.currentZ)*.05,this.camera.position.set(this.cameraState.currentX,this.cameraState.currentY,this.cameraState.currentZ),this.camera.lookAt(0,this.cameraState.currentY,-50)}animateOutlines(){this.brainOutlines.forEach(e=>{const{group:t,baseX:i,baseY:s,phase:o}=e;t.position.x=i+Math.sin(this.time*.3+o)*2,t.position.y=s+Math.cos(this.time*.25+o)*1.5,t.rotation.y=Math.sin(this.time*.1+o)*.1,t.rotation.z=Math.cos(this.time*.15+o)*.05,t.traverse(n=>{n.material&&(n.material.opacity=.4+Math.sin(this.time*.5+o)*.2)})})}animatePaths(){this.neuralPaths.forEach(e=>{const{phase:t,speed:i}=e.userData;e.material.opacity=.1+Math.sin(this.time*i+t)*.08})}animateBolts(){this.electricBolts.forEach(e=>{if(e.nextActivation-=.016,e.nextActivation<=0&&!e.active&&(e.active=!0,e.activeTime=0,e.nextActivation=3+Math.random()*8),e.active)if(e.activeTime+=.016,e.activeTime<.12){e.line.material.opacity=Math.sin(e.activeTime*80)*.8;const t=e.line.geometry.attributes.position.array;for(let i=3;i<t.length-3;i+=3)t[i]+=(Math.random()-.5)*2;e.line.geometry.attributes.position.needsUpdate=!0}else e.active=!1,e.line.material.opacity=0})}animateNodes(){this.nodes.forEach(e=>{const{phase:t,speed:i,baseX:s,baseY:o,baseZ:n,orbitRadius:a,orbitSpeed:l,floatAmplitude:c,floatSpeed:h,driftX:m,driftY:d}=e.userData,f=this.time*l+t,C=Math.sin(this.time*h+t)*c;e.userData.baseX+=m,e.userData.baseY+=d,e.userData.baseX>80&&(e.userData.baseX=-80),e.userData.baseX<-80&&(e.userData.baseX=80),e.userData.baseY>50&&(e.userData.baseY=-600),e.userData.baseY<-650&&(e.userData.baseY=50),e.position.x=e.userData.baseX+Math.cos(f)*a,e.position.y=e.userData.baseY+C,e.position.z=n+Math.sin(f*.7)*(a*.5);const F=Math.sin(this.time*i+t);e.material.opacity=.4+F*.4,e.scale.setScalar(.7+F*.5)})}updateTheme(){}dispose(){this.animationId&&cancelAnimationFrame(this.animationId),this.renderer&&(this.renderer.dispose(),this.container?.removeChild(this.renderer.domElement)),this.scene?.traverse(e=>{e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>t.dispose()):e.material.dispose())})}}class j{constructor(){this.scene=null,this.camera=null,this.renderer=null,this.particles=[],this.constellations=[],this.stars=[],this.titleParticles=null,this.titleGlow=null,this.animationId=null,this.isInitialized=!1,this.currentTheme="light",this.config={particles:{count:80,size:{min:.3,max:.8},speed:{min:.1,max:.3},opacity:{min:.2,max:.5}},constellations:{count:12,starsPerConstellation:{min:3,max:5},starSize:.15,connectionOpacity:.12,connectionWidth:1},stars:{count:100,size:{min:.2,max:.6},twinkleSpeed:{min:2,max:5}},titleEffect:{particleCount:150,orbitRadius:25,orbitSpeed:.3,particleSize:{min:.15,max:.5}}}}async init(e="hero-particles"){try{return typeof V>"u"?(console.warn("Three.js no está disponible"),!1):(this.setupScene(),this.setupCamera(),this.setupRenderer(e),this.createParticleSystem(),this.createConstellationSystem(),this.createStarSystem(),this.createTitleEffect(),this.setupEventListeners(),this.animate(),this.isInitialized=!0,!0)}catch(t){return console.error("❌ Error inicializando Hero Three.js Engine:",t),!1}}setupScene(){this.scene=new L,this.scene.fog=new X(0,50,200)}setupCamera(){this.camera=new B(75,window.innerWidth/window.innerHeight,.1,1e3),this.camera.position.z=50,this.camera.position.y=0}setupRenderer(e){const t=document.getElementById(e);if(!t){console.warn(`Contenedor ${e} no encontrado`);return}this.renderer=new O({antialias:!0,alpha:!0,powerPreference:"high-performance"}),this.renderer.setSize(t.offsetWidth,t.offsetHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setClearColor(0,0),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=ie,t.appendChild(this.renderer.domElement),this.renderer.domElement.style.position="absolute",this.renderer.domElement.style.top="0",this.renderer.domElement.style.left="0",this.renderer.domElement.style.zIndex="1"}createParticleSystem(){const e=new x,t=this.config.particles.count,i=new Float32Array(t*3),s=new Float32Array(t*3),o=new Float32Array(t),n=new Float32Array(t),a=new Float32Array(t);for(let c=0;c<t;c++){i[c*3]=(Math.random()-.5)*100,i[c*3+1]=(Math.random()-.5)*60,i[c*3+2]=(Math.random()-.5)*50-20;const h=this.currentTheme==="dark"?new g(5227511):new g(6600182);s[c*3]=h.r,s[c*3+1]=h.g,s[c*3+2]=h.b,o[c]=Math.random()*(this.config.particles.size.max-this.config.particles.size.min)+this.config.particles.size.min,n[c]=Math.random()*(this.config.particles.speed.max-this.config.particles.speed.min)+this.config.particles.speed.min,a[c]=Math.random()*(this.config.particles.opacity.max-this.config.particles.opacity.min)+this.config.particles.opacity.min}e.setAttribute("position",new u(i,3)),e.setAttribute("color",new u(s,3)),e.setAttribute("size",new u(o,1)),e.setAttribute("speed",new u(n,1)),e.setAttribute("opacity",new u(a,1));const l=new E({uniforms:{time:{value:0},theme:{value:this.currentTheme==="dark"?1:0}},vertexShader:`
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
            `,transparent:!0,blending:w,depthWrite:!1});this.particleSystem=new k(e,l),this.scene.add(this.particleSystem)}createConstellationSystem(){const e=this.config.constellations.count;for(let t=0;t<e;t++){const i=this.createConstellation(t,e);this.constellations.push(i),this.scene.add(i)}}createConstellation(e,t){const i=new R,s=Math.floor(Math.random()*(this.config.constellations.starsPerConstellation.max-this.config.constellations.starsPerConstellation.min)+this.config.constellations.starsPerConstellation.min),o=[],n=this.config.constellations.starSize;for(let c=0;c<s;c++){const h=this.createStar(n,.6),m=c/s*Math.PI*2+Math.random()*.5,d=2+Math.random()*2,f=Math.cos(m)*d,C=Math.sin(m)*d,F=(Math.random()-.5)*1;h.position.set(f,C,F),o.push(new p(f,C,F)),i.add(h)}for(let c=0;c<s;c++)for(let h=c+1;h<s;h++)if(Math.random()>.3){const m=this.createConnection(o[c],o[h]);i.add(m)}i.position.set((Math.random()-.5)*120,(Math.random()-.5)*70,-15+Math.random()*10);const a=(.08+Math.random()*.12)*(Math.random()>.5?1:-1),l=(.04+Math.random()*.08)*(Math.random()>.5?1:-1);return i.userData={velocity:{x:a,y:l,z:0},rotationSpeed:(Math.random()-.5)*.003,pulsePhase:Math.random()*Math.PI*2,originalScale:1},i}createStar(e,t){const i=new M(e,6,4),s=new S({color:16777215,transparent:!0,opacity:t*.8}),o=new y(i,s);return o.userData={originalIntensity:t*.8,twinkleSpeed:Math.random()*2+1},o}createConnection(e,t){const i=new x().setFromPoints([e,t]),s=new D({color:8965375,transparent:!0,opacity:this.config.constellations.connectionOpacity}),o=new I(i,s);return o.userData={baseOpacity:this.config.constellations.connectionOpacity},o}createTitleEffect(){const e=this.config.titleEffect.particleCount,t=new x,i=new Float32Array(e*3),s=new Float32Array(e*3),o=new Float32Array(e),n=new Float32Array(e),a=new Float32Array(e),l=new Float32Array(e);for(let d=0;d<e;d++){const f=d/e*Math.PI*2*3,C=this.config.titleEffect.orbitRadius+(Math.random()-.5)*15,F=(Math.random()-.5)*12;i[d*3]=Math.cos(f)*C,i[d*3+1]=F,i[d*3+2]=Math.sin(f)*C*.3;const J=.52+Math.random()*.08,H=new g;H.setHSL(J,1,.6+Math.random()*.2),s[d*3]=H.r,s[d*3+1]=H.g,s[d*3+2]=H.b,o[d]=Math.random()*(this.config.titleEffect.particleSize.max-this.config.titleEffect.particleSize.min)+this.config.titleEffect.particleSize.min,n[d]=Math.random()*Math.PI*2,a[d]=.2+Math.random()*.4,l[d]=C}t.setAttribute("position",new u(i,3)),t.setAttribute("color",new u(s,3)),t.setAttribute("size",new u(o,1)),t.setAttribute("phase",new u(n,1)),t.setAttribute("speed",new u(a,1)),t.setAttribute("radius",new u(l,1));const c=new E({uniforms:{time:{value:0}},vertexShader:`
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
            `,transparent:!0,blending:w,depthWrite:!1});this.titleParticles=new k(t,c),this.scene.add(this.titleParticles);const h=new Y(60,20),m=new E({uniforms:{time:{value:0}},vertexShader:`
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
            `,transparent:!0,blending:w,depthWrite:!1,side:W});this.titleGlow=new y(h,m),this.titleGlow.position.z=-5,this.scene.add(this.titleGlow)}createStarSystem(){const e=new x,t=this.config.stars.count,i=new Float32Array(t*3),s=new Float32Array(t),o=new Float32Array(t);for(let a=0;a<t;a++){const l=Math.acos(-1+2*a/t),c=Math.sqrt(t*Math.PI)*l,h=80+Math.random()*20;i[a*3]=h*Math.cos(c)*Math.sin(l),i[a*3+1]=h*Math.sin(c)*Math.sin(l),i[a*3+2]=h*Math.cos(l),s[a]=Math.random()*(this.config.stars.size.max-this.config.stars.size.min)+this.config.stars.size.min,o[a]=Math.random()*(this.config.stars.twinkleSpeed.max-this.config.stars.twinkleSpeed.min)+this.config.stars.twinkleSpeed.min}e.setAttribute("position",new u(i,3)),e.setAttribute("size",new u(s,1)),e.setAttribute("twinkleSpeed",new u(o,1));const n=new E({uniforms:{time:{value:0}},vertexShader:`
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
            `,transparent:!0,blending:w,depthWrite:!1});this.starSystem=new k(e,n),this.scene.add(this.starSystem)}setupEventListeners(){window.addEventListener("resize",()=>this.onWindowResize()),document.addEventListener("mousemove",e=>{if(!this.isInitialized)return;const t=e.clientX/window.innerWidth*2-1,i=-(e.clientY/window.innerHeight)*2+1;this.camera.position.x=t*5,this.camera.position.y=i*3,this.camera.lookAt(0,0,0)}),window.addEventListener("scroll",()=>{if(!this.isInitialized)return;const t=window.pageYOffset*-.1;this.particleSystem.position.y=t,this.starSystem.position.y=t*.5})}onWindowResize(){!this.renderer||!this.camera||(this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight))}animate(){if(this.animationId=requestAnimationFrame(()=>this.animate()),!this.isInitialized)return;const e=Date.now()*.001;this.particleSystem&&(this.particleSystem.material.uniforms.time.value=e),this.constellations.forEach(t=>{const i=t.userData;t.position.x+=i.velocity.x,t.position.y+=i.velocity.y;const s=70,o=45;t.position.x>s&&(t.position.x=-s),t.position.x<-s&&(t.position.x=s),t.position.y>o&&(t.position.y=-o),t.position.y<-o&&(t.position.y=o),t.rotation.z+=i.rotationSpeed,t.children.forEach(n=>{if(n.type==="Mesh"&&n.userData.twinkleSpeed){const a=Math.sin(e*n.userData.twinkleSpeed+i.pulsePhase)*.25+.75;n.material.opacity=n.userData.originalIntensity*a}else if(n.type==="Line"&&n.userData.baseOpacity){const a=Math.sin(e*.8+i.pulsePhase)*.03+1;n.material.opacity=n.userData.baseOpacity*a}})}),this.starSystem&&(this.starSystem.material.uniforms.time.value=e),this.titleParticles&&(this.titleParticles.material.uniforms.time.value=e),this.titleGlow&&(this.titleGlow.material.uniforms.time.value=e),this.renderer.render(this.scene,this.camera)}updateTheme(e){this.currentTheme=e,this.particleSystem&&this.particleSystem.material.uniforms&&(this.particleSystem.material.uniforms.theme.value=e==="dark"?1:0),this.constellations.forEach(t=>{t.children.forEach(i=>{i.type==="Line"&&i.material.color.setHex(e==="dark"?5227511:6600182)})})}setPerformanceMode(e=!0){this.renderer&&(e?this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)):this.renderer.setPixelRatio(1))}dispose(){this.animationId&&cancelAnimationFrame(this.animationId),this.renderer&&(this.renderer.dispose(),this.renderer.domElement&&this.renderer.domElement.parentNode&&this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)),this.scene=null,this.camera=null,this.renderer=null,this.particles=[],this.constellations=[],this.stars=[],this.isInitialized=!1}}class pe{constructor(){this.scene=null,this.camera=null,this.renderer=null,this.auroraPlane=null,this.starField=null,this.nebulaClouds=[],this.shootingStars=[],this.animationId=null,this.isInitialized=!1,this.currentTheme="dark",this.mouseX=0,this.mouseY=0,this.scrollProgress=0,this.config={aurora:{intensity:.6,speed:.3,waveFrequency:2,colorShift:.5},stars:{count:150,size:{min:.5,max:2},twinkleSpeed:{min:1,max:3}},nebula:{count:5,size:{min:30,max:60},opacity:.15},shootingStars:{maxCount:3,spawnRate:.005,speed:{min:2,max:4}}}}async init(e="header-aurora-container"){try{return typeof V>"u"?(console.warn("Three.js not available for Header Aurora Engine"),!1):(this.setupScene(),this.setupCamera(),this.setupRenderer(e),this.createAuroraPlane(),this.createStarField(),this.createNebulaClouds(),this.setupEventListeners(),this.animate(),this.isInitialized=!0,console.log("Header Aurora Engine initialized"),!0)}catch(t){return console.error("Error initializing Header Aurora Engine:",t),!1}}setupScene(){this.scene=new L}setupCamera(){this.camera=new se(-1,1,1,-1,.1,100),this.camera.position.z=1}setupRenderer(e){const t=document.getElementById(e);if(t)this.container=t;else{const i=document.querySelector(".header");if(i){const s=document.createElement("div");s.id=e,s.style.cssText=`
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                    pointer-events: none;
                    overflow: hidden;
                `,i.insertBefore(s,i.firstChild),this.container=s}else{console.warn("Header not found");return}}this.renderer=new O({antialias:!0,alpha:!0,powerPreference:"high-performance"}),this.renderer.setSize(this.container.offsetWidth,this.container.offsetHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setClearColor(0,0),this.container.appendChild(this.renderer.domElement),this.renderer.domElement.style.cssText=`
            position: absolute;
            inset: 0;
            width: 100% !important;
            height: 100% !important;
        `}createAuroraPlane(){const e=new Y(2,2),t=new E({uniforms:{time:{value:0},resolution:{value:new $(window.innerWidth,60)},mouseX:{value:0},scrollProgress:{value:0},theme:{value:this.currentTheme==="dark"?1:0},intensity:{value:this.config.aurora.intensity}},vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,fragmentShader:`
                uniform float time;
                uniform vec2 resolution;
                uniform float mouseX;
                uniform float scrollProgress;
                uniform float theme;
                uniform float intensity;

                varying vec2 vUv;

                // Simplex noise function
                vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

                float snoise(vec2 v) {
                    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                    vec2 i  = floor(v + dot(v, C.yy));
                    vec2 x0 = v -   i + dot(i, C.xx);
                    vec2 i1;
                    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                    vec4 x12 = x0.xyxy + C.xxzz;
                    x12.xy -= i1;
                    i = mod289(i);
                    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
                    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                    m = m*m;
                    m = m*m;
                    vec3 x = 2.0 * fract(p * C.www) - 1.0;
                    vec3 h = abs(x) - 0.5;
                    vec3 ox = floor(x + 0.5);
                    vec3 a0 = x - ox;
                    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
                    vec3 g;
                    g.x  = a0.x  * x0.x  + h.x  * x0.y;
                    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                    return 130.0 * dot(m, g);
                }

                // Aurora color palette - cosmic colors
                vec3 getAuroraColor(float t, float theme) {
                    // Cyan/Teal
                    vec3 color1 = vec3(0.0, 0.9, 0.9);
                    // Purple/Magenta
                    vec3 color2 = vec3(0.6, 0.2, 0.9);
                    // Green/Emerald
                    vec3 color3 = vec3(0.2, 0.9, 0.5);
                    // Blue
                    vec3 color4 = vec3(0.3, 0.5, 1.0);
                    // Pink
                    vec3 color5 = vec3(1.0, 0.4, 0.7);

                    t = fract(t);

                    if (t < 0.25) {
                        return mix(color1, color2, t * 4.0);
                    } else if (t < 0.5) {
                        return mix(color2, color3, (t - 0.25) * 4.0);
                    } else if (t < 0.75) {
                        return mix(color3, color4, (t - 0.5) * 4.0);
                    } else {
                        return mix(color4, color5, (t - 0.75) * 4.0);
                    }
                }

                void main() {
                    vec2 uv = vUv;

                    // Multiple aurora layers with different frequencies
                    float aurora = 0.0;

                    // Layer 1 - Main aurora wave
                    float wave1 = snoise(vec2(uv.x * 3.0 + time * 0.1 + mouseX * 0.2, uv.y * 2.0 + time * 0.05));
                    aurora += wave1 * 0.5;

                    // Layer 2 - Secondary wave
                    float wave2 = snoise(vec2(uv.x * 5.0 - time * 0.15, uv.y * 3.0 + time * 0.08));
                    aurora += wave2 * 0.3;

                    // Layer 3 - Fine detail
                    float wave3 = snoise(vec2(uv.x * 8.0 + time * 0.2, uv.y * 4.0 - time * 0.1));
                    aurora += wave3 * 0.2;

                    // Vertical gradient - aurora at bottom of header
                    float verticalFade = pow(1.0 - uv.y, 2.0);

                    // Horizontal variation
                    float horizontalVar = 0.7 + 0.3 * sin(uv.x * 6.28 + time * 0.2);

                    // Combine
                    aurora = aurora * verticalFade * horizontalVar;
                    aurora = smoothstep(0.0, 1.0, aurora + 0.3);

                    // Color based on position and time
                    float colorPhase = uv.x * 0.5 + time * 0.05 + aurora * 0.3;
                    vec3 auroraColor = getAuroraColor(colorPhase, theme);

                    // Add glow effect
                    float glow = exp(-pow(uv.y - 0.8, 2.0) * 20.0);
                    vec3 glowColor = vec3(0.3, 0.7, 1.0) * glow * 0.3;

                    // Final color with intensity
                    vec3 finalColor = auroraColor * aurora * intensity + glowColor;

                    // Alpha based on aurora strength
                    float alpha = aurora * intensity * 0.8;
                    alpha = clamp(alpha, 0.0, 0.7);

                    // Add subtle stars effect
                    float starNoise = snoise(uv * 50.0) * snoise(uv * 100.0);
                    if (starNoise > 0.7) {
                        float starBrightness = (starNoise - 0.7) * 3.0;
                        starBrightness *= (0.7 + 0.3 * sin(time * 5.0 + uv.x * 100.0));
                        finalColor += vec3(1.0) * starBrightness * 0.5;
                        alpha = max(alpha, starBrightness * 0.3);
                    }

                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,transparent:!0,blending:w,depthWrite:!1});this.auroraPlane=new y(e,t),this.scene.add(this.auroraPlane)}createStarField(){const e=new x,t=this.config.stars.count,i=new Float32Array(t*3),s=new Float32Array(t),o=new Float32Array(t),n=new Float32Array(t);for(let l=0;l<t;l++)i[l*3]=(Math.random()-.5)*2,i[l*3+1]=(Math.random()-.5)*2,i[l*3+2]=0,s[l]=Math.random()*(this.config.stars.size.max-this.config.stars.size.min)+this.config.stars.size.min,o[l]=Math.random()*Math.PI*2,n[l]=Math.random()*(this.config.stars.twinkleSpeed.max-this.config.stars.twinkleSpeed.min)+this.config.stars.twinkleSpeed.min;e.setAttribute("position",new u(i,3)),e.setAttribute("size",new u(s,1)),e.setAttribute("phase",new u(o,1)),e.setAttribute("twinkleSpeed",new u(n,1));const a=new E({uniforms:{time:{value:0},pixelRatio:{value:window.devicePixelRatio}},vertexShader:`
                attribute float size;
                attribute float phase;
                attribute float twinkleSpeed;
                uniform float time;
                uniform float pixelRatio;
                varying float vOpacity;
                varying float vSize;

                void main() {
                    vSize = size;

                    // Twinkle effect
                    vOpacity = 0.3 + 0.7 * (0.5 + 0.5 * sin(time * twinkleSpeed + phase));

                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * pixelRatio * 2.0;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,fragmentShader:`
                varying float vOpacity;
                varying float vSize;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    // Soft circular star
                    float alpha = vOpacity * smoothstep(0.5, 0.0, dist);

                    // White-blue color for stars
                    vec3 color = vec3(0.9, 0.95, 1.0);

                    gl_FragColor = vec4(color, alpha);
                }
            `,transparent:!0,blending:w,depthWrite:!1});this.starField=new k(e,a),this.scene.add(this.starField)}createNebulaClouds(){for(let e=0;e<this.config.nebula.count;e++){const t=Math.random()*(this.config.nebula.size.max-this.config.nebula.size.min)+this.config.nebula.size.min,i=new Y(t/100,t/200),s=Math.random(),o=new g().setHSL(s,.8,.6),n=new E({uniforms:{time:{value:0},color:{value:o},opacity:{value:this.config.nebula.opacity}},vertexShader:`
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,fragmentShader:`
                    uniform float time;
                    uniform vec3 color;
                    uniform float opacity;
                    varying vec2 vUv;

                    void main() {
                        vec2 center = vUv - 0.5;
                        float dist = length(center);

                        // Soft circular gradient
                        float alpha = exp(-dist * dist * 8.0) * opacity;

                        // Subtle pulsing
                        alpha *= 0.8 + 0.2 * sin(time * 0.5);

                        gl_FragColor = vec4(color, alpha);
                    }
                `,transparent:!0,blending:w,depthWrite:!1}),a=new y(i,n);a.position.x=(Math.random()-.5)*2,a.position.y=(Math.random()-.5)*2,a.position.z=-.1,a.userData={originalX:a.position.x,originalY:a.position.y,driftSpeed:.01+Math.random()*.02,driftPhase:Math.random()*Math.PI*2},this.nebulaClouds.push(a),this.scene.add(a)}}createShootingStar(){if(this.shootingStars.length>=this.config.shootingStars.maxCount)return;const e=-1+Math.random()*.5,t=.5+Math.random()*.5,i=new x,s=new Float32Array([e,t,0,e+.15,t-.05,0]);i.setAttribute("position",new u(s,3));const o=new E({uniforms:{progress:{value:0}},vertexShader:`
                varying float vProgress;
                uniform float progress;

                void main() {
                    vProgress = position.x < 0.0 ? 0.0 : 1.0;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,fragmentShader:`
                uniform float progress;
                varying float vProgress;

                void main() {
                    float alpha = (1.0 - vProgress) * (1.0 - progress);
                    vec3 color = mix(vec3(1.0, 1.0, 1.0), vec3(0.5, 0.8, 1.0), vProgress);
                    gl_FragColor = vec4(color, alpha * 0.8);
                }
            `,transparent:!0,blending:w,depthWrite:!1}),n=new I(i,o);n.userData={speed:Math.random()*(this.config.shootingStars.speed.max-this.config.shootingStars.speed.min)+this.config.shootingStars.speed.min,progress:0,dirX:.8+Math.random()*.4,dirY:-.3-Math.random()*.2},this.shootingStars.push(n),this.scene.add(n)}setupEventListeners(){window.addEventListener("resize",()=>this.onResize()),document.addEventListener("mousemove",e=>{this.mouseX=e.clientX/window.innerWidth*2-1,this.mouseY=-(e.clientY/window.innerHeight)*2+1}),window.addEventListener("scroll",()=>{const e=document.documentElement.scrollHeight-window.innerHeight;this.scrollProgress=window.scrollY/e})}onResize(){if(!this.container||!this.renderer)return;const e=this.container.offsetWidth,t=this.container.offsetHeight;this.renderer.setSize(e,t),this.auroraPlane&&this.auroraPlane.material.uniforms.resolution&&this.auroraPlane.material.uniforms.resolution.value.set(e,t)}animate(){if(this.animationId=requestAnimationFrame(()=>this.animate()),!this.isInitialized)return;const e=Date.now()*.001;this.auroraPlane&&(this.auroraPlane.material.uniforms.time.value=e,this.auroraPlane.material.uniforms.mouseX.value=this.mouseX,this.auroraPlane.material.uniforms.scrollProgress.value=this.scrollProgress),this.starField&&(this.starField.material.uniforms.time.value=e),this.nebulaClouds.forEach(t=>{t.material.uniforms.time.value=e;const i=t.userData;t.position.x=i.originalX+Math.sin(e*i.driftSpeed+i.driftPhase)*.05,t.position.y=i.originalY+Math.cos(e*i.driftSpeed*.7+i.driftPhase)*.02}),Math.random()<this.config.shootingStars.spawnRate&&this.createShootingStar();for(let t=this.shootingStars.length-1;t>=0;t--){const i=this.shootingStars[t];i.userData.progress+=.02*i.userData.speed,i.position.x+=i.userData.dirX*.02*i.userData.speed,i.position.y+=i.userData.dirY*.02*i.userData.speed,i.material.uniforms.progress.value=i.userData.progress,i.userData.progress>=1&&(this.scene.remove(i),i.geometry.dispose(),i.material.dispose(),this.shootingStars.splice(t,1))}this.renderer.render(this.scene,this.camera)}updateTheme(e){this.currentTheme=e,this.auroraPlane&&(this.auroraPlane.material.uniforms.theme.value=e==="dark"?1:0,this.auroraPlane.material.uniforms.intensity.value=e==="dark"?.7:.4)}dispose(){this.animationId&&cancelAnimationFrame(this.animationId),this.shootingStars.forEach(e=>{this.scene.remove(e),e.geometry.dispose(),e.material.dispose()}),this.nebulaClouds.forEach(e=>{this.scene.remove(e),e.geometry.dispose(),e.material.dispose()}),this.auroraPlane&&(this.scene.remove(this.auroraPlane),this.auroraPlane.geometry.dispose(),this.auroraPlane.material.dispose()),this.starField&&(this.scene.remove(this.starField),this.starField.geometry.dispose(),this.starField.material.dispose()),this.renderer&&(this.renderer.dispose(),this.renderer.domElement&&this.renderer.domElement.parentNode&&this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)),this.scene=null,this.camera=null,this.renderer=null,this.isInitialized=!1}}class fe{constructor(){this.container=null,this.scene=null,this.camera=null,this.renderer=null,this.orbs=[],this.particles=null,this.orbitalRings=[],this.glowMeshes=[],this.mouse={x:0,y:0},this.isVisible=!1,this.animationId=null,this.clock=new U}async init(e){return this.container=document.getElementById(e),this.container?(this.setupScene(),this.setupCamera(),this.setupRenderer(),this.createOrbs(),this.createParticles(),this.createOrbitalRings(),this.setupEventListeners(),this.setupIntersectionObserver(),!0):(console.warn(`Skills container #${e} not found`),!1)}setupScene(){this.scene=new L}setupCamera(){const e=this.container.clientWidth/this.container.clientHeight;this.camera=new B(60,e,.1,1e3),this.camera.position.z=30}setupRenderer(){this.renderer=new O({antialias:!0,alpha:!0,powerPreference:"high-performance"}),this.renderer.setSize(this.container.clientWidth,this.container.clientHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setClearColor(0,0),this.container.appendChild(this.renderer.domElement)}createOrbs(){[{color:6600182,size:8,position:{x:-15,y:10,z:-10},speed:.3},{color:16739125,size:6,position:{x:15,y:-8,z:-15},speed:.4},{color:11158783,size:4,position:{x:0,y:0,z:-20},speed:.5}].forEach((t,i)=>{const s=new M(t.size,32,32),o=new E({uniforms:{uTime:{value:0},uColor:{value:new g(t.color)},uOpacity:{value:.15}},vertexShader:`
                    varying vec3 vNormal;
                    varying vec3 vPosition;

                    void main() {
                        vNormal = normalize(normalMatrix * normal);
                        vPosition = position;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,fragmentShader:`
                    uniform float uTime;
                    uniform vec3 uColor;
                    uniform float uOpacity;
                    varying vec3 vNormal;
                    varying vec3 vPosition;

                    void main() {
                        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                        float pulse = 0.8 + 0.2 * sin(uTime * 0.5);
                        gl_FragColor = vec4(uColor, uOpacity * intensity * pulse);
                    }
                `,transparent:!0,side:q,blending:w,depthWrite:!1}),n=new y(s,o);n.position.set(t.position.x,t.position.y,t.position.z),n.userData={originalPosition:{...t.position},speed:t.speed,phase:i*Math.PI*.66},this.orbs.push(n),this.scene.add(n)})}createParticles(){const t=new Float32Array(300),i=new Float32Array(300),s=new Float32Array(100),o=[new g(6600182),new g(16739125),new g(11158783),new g(65535)];for(let l=0;l<100;l++){const c=l*3;t[c]=(Math.random()-.5)*60,t[c+1]=(Math.random()-.5)*40,t[c+2]=(Math.random()-.5)*30-15;const h=o[Math.floor(Math.random()*o.length)];i[c]=h.r,i[c+1]=h.g,i[c+2]=h.b,s[l]=Math.random()*.5+.2}const n=new x;n.setAttribute("position",new u(t,3)),n.setAttribute("color",new u(i,3)),n.setAttribute("size",new u(s,1));const a=new E({uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)}},vertexShader:`
                attribute float size;
                varying vec3 vColor;
                uniform float uTime;
                uniform float uPixelRatio;

                void main() {
                    vColor = color;
                    vec3 pos = position;
                    pos.y += sin(uTime * 0.5 + position.x * 0.1) * 0.5;
                    pos.x += cos(uTime * 0.3 + position.y * 0.1) * 0.3;

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,fragmentShader:`
                varying vec3 vColor;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                    alpha *= 0.6;

                    gl_FragColor = vec4(vColor, alpha);
                }
            `,transparent:!0,blending:w,depthWrite:!1,vertexColors:!0});this.particles=new k(n,a),this.scene.add(this.particles)}createOrbitalRings(){[{radius:3,color:6600182,speed:1,position:{x:-12,y:5,z:0}},{radius:2.5,color:65535,speed:-.8,position:{x:12,y:-5,z:0}}].forEach((t,i)=>{const s=new R;s.position.set(t.position.x,t.position.y,t.position.z);const o=new oe(t.radius-.05,t.radius+.05,64),n=new S({color:t.color,transparent:!0,opacity:.2,side:W}),a=new y(o,n);s.add(a);const l=new M(.15,16,16),c=new S({color:t.color,transparent:!0,opacity:.9}),h=new y(l,c);h.position.x=t.radius,h.userData={radius:t.radius,speed:t.speed,angle:i*Math.PI},s.add(h);const m=new M(.3,16,16),d=new S({color:t.color,transparent:!0,opacity:.3}),f=new y(m,d);f.position.copy(h.position),h.userData.glow=f,s.add(f),this.orbitalRings.push({group:s,dot:h,ring:a}),this.scene.add(s)})}setupEventListeners(){window.addEventListener("resize",this.handleResize.bind(this)),this.container.addEventListener("mousemove",e=>{const t=this.container.getBoundingClientRect();this.mouse.x=(e.clientX-t.left)/t.width*2-1,this.mouse.y=-((e.clientY-t.top)/t.height)*2+1})}setupIntersectionObserver(){new IntersectionObserver(t=>{t.forEach(i=>{this.isVisible=i.isIntersecting,this.isVisible&&!this.animationId&&this.animate()})},{threshold:.1}).observe(this.container)}handleResize(){if(!this.container)return;const e=this.container.clientWidth,t=this.container.clientHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t)}animate(){if(!this.isVisible){this.animationId=null;return}this.animationId=requestAnimationFrame(()=>this.animate());const e=this.clock.getElapsedTime();this.orbs.forEach(t=>{const{originalPosition:i,speed:s,phase:o}=t.userData;t.position.x=i.x+Math.sin(e*s+o)*3,t.position.y=i.y+Math.cos(e*s*.7+o)*2,t.position.z=i.z+Math.sin(e*s*.5+o)*1,t.material.uniforms.uTime.value=e}),this.particles&&(this.particles.material.uniforms.uTime.value=e,this.particles.rotation.y=e*.02),this.orbitalRings.forEach(({dot:t})=>{const{radius:i,speed:s,angle:o,glow:n}=t.userData,a=o+e*s;t.position.x=Math.cos(a)*i,t.position.y=Math.sin(a)*i,n&&n.position.copy(t.position)}),this.camera.position.x+=(this.mouse.x*2-this.camera.position.x)*.02,this.camera.position.y+=(this.mouse.y*2-this.camera.position.y)*.02,this.camera.lookAt(0,0,0),this.renderer.render(this.scene,this.camera)}updateTheme(e){const i=e==="dark"?6600182:2201331;this.orbs.forEach((s,o)=>{const n=[i,16739125,11158783];s.material.uniforms.uColor.value.setHex(n[o%n.length])})}dispose(){this.animationId&&cancelAnimationFrame(this.animationId),this.orbs.forEach(e=>{e.geometry.dispose(),e.material.dispose()}),this.particles&&(this.particles.geometry.dispose(),this.particles.material.dispose()),this.orbitalRings.forEach(({group:e})=>{e.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&t.material.dispose()})}),this.renderer&&(this.renderer.dispose(),this.container.removeChild(this.renderer.domElement)),this.scene=null,this.camera=null,this.renderer=null}}class ge{constructor(){this.container=null,this.scene=null,this.camera=null,this.renderer=null,this.rings=[],this.particles=null,this.glowSphere=null,this.floatingIcons=[],this.mouse={x:0,y:0},this.isVisible=!1,this.animationId=null,this.clock=new U}async init(e){return this.container=document.getElementById(e),this.container?(this.setupScene(),this.setupCamera(),this.setupRenderer(),this.createProfileRings(),this.createGlowSphere(),this.createFloatingParticles(),this.createFloatingOrbs(),this.setupEventListeners(),this.setupIntersectionObserver(),!0):(console.warn(`About container #${e} not found`),!1)}setupScene(){this.scene=new L}setupCamera(){const e=this.container.clientWidth/this.container.clientHeight;this.camera=new B(50,e,.1,1e3),this.camera.position.z=25}setupRenderer(){this.renderer=new O({antialias:!0,alpha:!0,powerPreference:"high-performance"}),this.renderer.setSize(this.container.clientWidth,this.container.clientHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setClearColor(0,0),this.container.appendChild(this.renderer.domElement)}createProfileRings(){const e=[{radius:5,tubeRadius:.08,color:6600182,speed:.5,rotationAxis:"x"},{radius:5.5,tubeRadius:.06,color:16739125,speed:-.3,rotationAxis:"y"},{radius:6,tubeRadius:.04,color:65535,speed:.4,rotationAxis:"z"}],t=new R;t.position.set(-8,0,0),e.forEach((i,s)=>{const o=new ne(i.radius,i.tubeRadius,16,100),n=new E({uniforms:{uTime:{value:0},uColor:{value:new g(i.color)},uOpacity:{value:.6}},vertexShader:`
                    varying vec3 vPosition;
                    varying vec3 vNormal;

                    void main() {
                        vPosition = position;
                        vNormal = normal;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,fragmentShader:`
                    uniform float uTime;
                    uniform vec3 uColor;
                    uniform float uOpacity;
                    varying vec3 vPosition;
                    varying vec3 vNormal;

                    void main() {
                        float angle = atan(vPosition.y, vPosition.x);
                        float wave = sin(angle * 8.0 + uTime * 2.0) * 0.5 + 0.5;
                        float alpha = uOpacity * (0.5 + wave * 0.5);

                        vec3 finalColor = uColor * (0.8 + wave * 0.4);
                        gl_FragColor = vec4(finalColor, alpha);
                    }
                `,transparent:!0,side:W,blending:w,depthWrite:!1}),a=new y(o,n);a.rotation.x=s*.3,a.rotation.y=s*.2,a.userData={speed:i.speed,rotationAxis:i.rotationAxis,phase:s*Math.PI/3},this.rings.push(a),t.add(a)}),this.scene.add(t),this.ringGroup=t}createGlowSphere(){const e=new M(4,32,32),t=new E({uniforms:{uTime:{value:0},uColor1:{value:new g(6600182)},uColor2:{value:new g(16739125)}},vertexShader:`
                varying vec3 vNormal;
                varying vec3 vPosition;

                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,fragmentShader:`
                uniform float uTime;
                uniform vec3 uColor1;
                uniform vec3 uColor2;
                varying vec3 vNormal;
                varying vec3 vPosition;

                void main() {
                    float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
                    float pulse = 0.7 + 0.3 * sin(uTime * 0.8);

                    vec3 color = mix(uColor1, uColor2, fresnel);
                    float alpha = fresnel * 0.4 * pulse;

                    gl_FragColor = vec4(color, alpha);
                }
            `,transparent:!0,side:q,blending:w,depthWrite:!1});this.glowSphere=new y(e,t),this.glowSphere.position.set(-8,0,0),this.scene.add(this.glowSphere)}createFloatingParticles(){const t=new Float32Array(240),i=new Float32Array(240),s=new Float32Array(80),o=[],n=[new g(6600182),new g(16739125),new g(65535),new g(11158783)];for(let c=0;c<80;c++){const h=c*3,m=Math.random()*Math.PI*2,d=7+Math.random()*8;t[h]=Math.cos(m)*d-8,t[h+1]=(Math.random()-.5)*15,t[h+2]=Math.sin(m)*d*.3-5;const f=n[Math.floor(Math.random()*n.length)];i[h]=f.r,i[h+1]=f.g,i[h+2]=f.b,s[c]=Math.random()*.4+.1,o.push({x:(Math.random()-.5)*.02,y:(Math.random()-.5)*.02,z:(Math.random()-.5)*.01})}const a=new x;a.setAttribute("position",new u(t,3)),a.setAttribute("color",new u(i,3)),a.setAttribute("size",new u(s,1));const l=new E({uniforms:{uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)}},vertexShader:`
                attribute float size;
                varying vec3 vColor;
                uniform float uTime;
                uniform float uPixelRatio;

                void main() {
                    vColor = color;
                    vec3 pos = position;

                    // Floating animation
                    pos.y += sin(uTime + position.x * 0.5) * 0.3;
                    pos.x += cos(uTime * 0.7 + position.y * 0.3) * 0.2;

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * uPixelRatio * (200.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,fragmentShader:`
                varying vec3 vColor;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
                    alpha *= 0.7;

                    gl_FragColor = vec4(vColor, alpha);
                }
            `,transparent:!0,blending:w,depthWrite:!1,vertexColors:!0});this.particles=new k(a,l),this.particles.userData.velocities=o,this.scene.add(this.particles)}createFloatingOrbs(){[{position:{x:10,y:5,z:-5},color:6600182,size:1},{position:{x:12,y:-3,z:-3},color:16739125,size:.8},{position:{x:8,y:-6,z:-4},color:65535,size:.6}].forEach((t,i)=>{const s=new M(t.size,16,16),o=new S({color:t.color,transparent:!0,opacity:.5}),n=new y(s,o);n.position.set(t.position.x,t.position.y,t.position.z),n.userData={originalPosition:{...t.position},phase:i*Math.PI*.66};const a=new M(t.size*2,16,16),l=new S({color:t.color,transparent:!0,opacity:.15,side:q}),c=new y(a,l);n.add(c),this.floatingIcons.push(n),this.scene.add(n)})}setupEventListeners(){window.addEventListener("resize",this.handleResize.bind(this)),this.container.addEventListener("mousemove",e=>{const t=this.container.getBoundingClientRect();this.mouse.x=(e.clientX-t.left)/t.width*2-1,this.mouse.y=-((e.clientY-t.top)/t.height)*2+1})}setupIntersectionObserver(){new IntersectionObserver(t=>{t.forEach(i=>{this.isVisible=i.isIntersecting,this.isVisible&&!this.animationId&&this.animate()})},{threshold:.1}).observe(this.container)}handleResize(){if(!this.container)return;const e=this.container.clientWidth,t=this.container.clientHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t)}animate(){if(!this.isVisible){this.animationId=null;return}this.animationId=requestAnimationFrame(()=>this.animate());const e=this.clock.getElapsedTime();this.rings.forEach(t=>{const{speed:i,rotationAxis:s,phase:o}=t.userData;switch(s){case"x":t.rotation.x+=i*.01;break;case"y":t.rotation.y+=i*.01;break;case"z":t.rotation.z+=i*.01;break}t.material.uniforms.uTime.value=e}),this.glowSphere&&(this.glowSphere.material.uniforms.uTime.value=e,this.glowSphere.rotation.y=e*.1),this.particles&&(this.particles.material.uniforms.uTime.value=e),this.floatingIcons.forEach(t=>{const{originalPosition:i,phase:s}=t.userData;t.position.y=i.y+Math.sin(e+s)*.5,t.position.x=i.x+Math.cos(e*.5+s)*.3}),this.ringGroup&&(this.ringGroup.rotation.y+=(this.mouse.x*.1-this.ringGroup.rotation.y)*.02,this.ringGroup.rotation.x+=(this.mouse.y*.1-this.ringGroup.rotation.x)*.02),this.renderer.render(this.scene,this.camera)}updateTheme(e){const t=e==="dark",i=t?6600182:2201331,s=t?16739125:16733986;this.glowSphere&&(this.glowSphere.material.uniforms.uColor1.value.setHex(i),this.glowSphere.material.uniforms.uColor2.value.setHex(s))}dispose(){this.animationId&&cancelAnimationFrame(this.animationId),this.rings.forEach(e=>{e.geometry.dispose(),e.material.dispose()}),this.glowSphere&&(this.glowSphere.geometry.dispose(),this.glowSphere.material.dispose()),this.particles&&(this.particles.geometry.dispose(),this.particles.material.dispose()),this.floatingIcons.forEach(e=>{e.traverse(t=>{t.geometry&&t.geometry.dispose(),t.material&&t.material.dispose()})}),this.renderer&&(this.renderer.dispose(),this.container.removeChild(this.renderer.domElement)),this.scene=null,this.camera=null,this.renderer=null}}const A={light:{mobile:{background:"rgba(255, 255, 255, 0.9)",backdropFilter:"blur(20px)",borderOpacity:.15,shadow:"0 4px 20px rgba(0, 0, 0, 0.12)",borderColor:"rgba(100, 181, 246, 0.15)"},tablet:{background:"rgba(255, 255, 255, 0.6)",backdropFilter:"blur(15px)",borderOpacity:.08,shadow:"0 2px 15px rgba(0, 0, 0, 0.08)",borderColor:"rgba(100, 181, 246, 0.08)"},desktop:{background:"rgba(255, 255, 255, 0.15)",backdropFilter:"blur(6px)",borderOpacity:.02,shadow:"0 1px 8px rgba(0, 0, 0, 0.03)",borderColor:"rgba(100, 181, 246, 0.02)"}},dark:{mobile:{background:"rgba(26, 26, 46, 0.9)",backdropFilter:"blur(20px)",borderOpacity:.2,shadow:"0 4px 20px rgba(0, 0, 0, 0.2)",borderColor:"rgba(79, 195, 247, 0.2)"},tablet:{background:"rgba(26, 26, 46, 0.7)",backdropFilter:"blur(15px)",borderOpacity:.12,shadow:"0 2px 15px rgba(0, 0, 0, 0.15)",borderColor:"rgba(79, 195, 247, 0.12)"},desktop:{background:"rgba(26, 26, 46, 0.25)",backdropFilter:"blur(6px)",borderOpacity:.03,shadow:"0 1px 8px rgba(0, 0, 0, 0.05)",borderColor:"rgba(79, 195, 247, 0.03)"}},breakpoints:{mobile:768,tablet:1024,desktop:1440},transitions:{duration:"0.4s",easing:"cubic-bezier(0.4, 0, 0.2, 1)",header:"all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",theme:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},responsive:{mobile:{padding:"var(--spacing-sm) var(--spacing-md)",gap:"var(--spacing-md)",iconSize:"32px",buttonSize:"32px"},tablet:{padding:"var(--spacing-md) var(--spacing-lg)",gap:"var(--spacing-lg)",iconSize:"36px",buttonSize:"36px"},desktop:{padding:"var(--spacing-md) var(--spacing-xl)",gap:"var(--spacing-2xl)",iconSize:"40px",buttonSize:"36px"}}};function ve(r,e){return A[r]?.[e]||A.light.desktop}function G(r,e){const t=r/e;return r<=A.breakpoints.mobile||r<=A.breakpoints.tablet&&t<1.2?"mobile":r<=A.breakpoints.tablet||r<=A.breakpoints.desktop&&t<1.5?"tablet":"desktop"}class ye{constructor(){this.deviceType=G(window.innerWidth,window.innerHeight),this.isMobile=this.deviceType==="mobile",this.isTablet=this.deviceType==="tablet",this.isDesktop=this.deviceType==="desktop",this.init()}detectDevice(){return G(window.innerWidth,window.innerHeight)}getTransparencyConfig(){const e=document.documentElement.getAttribute("data-theme")||"light";return ve(e,this.deviceType)}updateHeaderTransparency(){const e=document.querySelector(".header");if(!e)return;const t=this.getTransparencyConfig();e.style.setProperty("--header-bg",t.background),e.style.setProperty("--header-backdrop",t.backdropFilter),e.style.setProperty("--header-border",`1px solid ${t.borderColor}`),e.style.setProperty("--header-shadow",t.shadow),e.style.background=t.background,e.style.backdropFilter=t.backdropFilter,e.style.borderBottom=`1px solid ${t.borderColor}`,e.style.boxShadow=t.shadow}updateThemeTransparency(e){this.updateHeaderTransparency()}handleResize(){const e=this.detectDevice();e!==this.deviceType&&(this.deviceType=e,this.isMobile=this.deviceType==="mobile",this.isTablet=this.deviceType==="tablet",this.isDesktop=this.deviceType==="desktop",this.updateHeaderTransparency())}init(){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{this.setupDeviceDetector()}):this.setupDeviceDetector()}setupDeviceDetector(){this.updateHeaderTransparency(),window.addEventListener("resize",this.handleResize.bind(this)),new MutationObserver(t=>{t.forEach(i=>{if(i.type==="attributes"&&i.attributeName==="data-theme"){const s=document.documentElement.getAttribute("data-theme");this.updateThemeTransparency(s)}})}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]})}refresh(){this.updateHeaderTransparency()}getDeviceInfo(){return{type:this.deviceType,isMobile:this.isMobile,isTablet:this.isTablet,isDesktop:this.isDesktop,width:window.innerWidth,height:window.innerHeight,ratio:window.innerWidth/window.innerHeight}}}class we{constructor(){this.menuToggle=null,this.navLinks=null,this.isMenuOpen=!1,this.init()}init(){this.waitForComponents()}waitForComponents(){let t=0;const i=()=>{this.menuToggle=document.getElementById("menu-toggle"),this.navLinks=document.querySelector(".nav-links"),this.menuToggle&&this.navLinks?this.setupEventListeners():(t++,t<50?setTimeout(i,100):console.warn("⚠️ Elementos del menú móvil no encontrados después de múltiples intentos"))};i()}setupEventListeners(){this.menuToggle.addEventListener("click",()=>{this.toggleMenu()}),this.navLinks.addEventListener("click",e=>{e.target.classList.contains("nav-link")&&this.closeMenu()}),document.addEventListener("click",e=>{!this.menuToggle.contains(e.target)&&!this.navLinks.contains(e.target)&&this.closeMenu()}),window.addEventListener("resize",()=>{window.innerWidth>768&&this.closeMenu()})}toggleMenu(){this.isMenuOpen?this.closeMenu():this.openMenu()}openMenu(){this.isMenuOpen=!0,this.menuToggle.classList.add("active"),this.navLinks.classList.add("active"),document.body.style.overflow="hidden"}closeMenu(){this.isMenuOpen=!1,this.menuToggle.classList.remove("active"),this.navLinks.classList.remove("active"),document.body.style.overflow=""}forceClose(){this.closeMenu()}isOpen(){return this.isMenuOpen}}class Z{constructor(){this.hero=null,this.heroContent=null,this.techBadges=[],this.buttons=[],this.scrollIndicator=null,this.floatingElements=[],this.isAnimating=!1,this.observer=null,this.heroThreeEngine=null,this.textEffectsEngine=null,this.init()}init(){this.setupElements(),this.setupIntersectionObserver(),this.setupEventListeners(),this.startInitialAnimations()}setupElements(){this.hero=document.querySelector(".hero"),this.heroContent=document.querySelector(".hero-content"),this.techBadges=document.querySelectorAll(".tech-badge"),this.buttons=document.querySelectorAll(".btn-hero"),this.scrollIndicator=document.querySelector(".hero-scroll-indicator"),this.floatingElements=document.querySelectorAll(".floating-element")}setupIntersectionObserver(){this.hero&&(this.observer=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&this.onHeroVisible()})},{threshold:.1,rootMargin:"0px 0px -100px 0px"}),this.observer.observe(this.hero))}setupEventListeners(){this.scrollIndicator&&this.scrollIndicator.addEventListener("click",()=>{this.scrollToNextSection()}),this.techBadges.forEach(e=>{e.addEventListener("mouseenter",()=>{this.animateTechBadge(e,"enter")}),e.addEventListener("mouseleave",()=>{this.animateTechBadge(e,"leave")})}),this.buttons.forEach(e=>{e.addEventListener("mouseenter",()=>{this.animateButton(e,"enter")}),e.addEventListener("mouseleave",()=>{this.animateButton(e,"leave")})}),window.addEventListener("scroll",()=>{this.updateParallax()}),window.addEventListener("resize",()=>{this.updateResponsiveAnimations()})}startInitialAnimations(){if(!this.heroContent)return;this.heroContent.querySelectorAll(".animate-fade-in-up").forEach((t,i)=>{const s=parseFloat(t.dataset.delay)||i*.1;setTimeout(()=>{t.style.animationDelay=`${s}s`,t.classList.add("animate-in")},s*1e3)}),this.techBadges.forEach((t,i)=>{const s=parseFloat(t.dataset.delay)||i*.1;setTimeout(()=>{this.animateTechBadge(t,"enter")},(1.4+s)*1e3)})}onHeroVisible(){this.isAnimating||(this.isAnimating=!0,this.animateFloatingElements(),this.scrollIndicator&&this.animateScrollIndicator(),this.textEffectsEngine||this.initTextEffects(),this.initThreeJSAnimations())}animateTechBadge(e,t){if(t==="enter"){e.style.transform="translateY(-8px) scale(1.05)",e.style.boxShadow="0 12px 30px rgba(100, 181, 246, 0.3)";const i=e.querySelector(".tech-icon");i&&(i.style.transform="scale(1.2) rotate(10deg)");const s=e.querySelector(".tech-glow");s&&(s.style.opacity="1")}else{e.style.transform="translateY(0) scale(1)",e.style.boxShadow="0 4px 15px rgba(100, 181, 246, 0.1)";const i=e.querySelector(".tech-icon");i&&(i.style.transform="scale(1) rotate(0deg)");const s=e.querySelector(".tech-glow");s&&(s.style.opacity="0")}}animateButton(e,t){if(t==="enter"){e.style.transform="translateY(-4px)";const i=e.querySelector(".btn-icon");if(i&&(i.style.transform="scale(1.1)"),e.classList.contains("btn-primary")){const s=e.querySelector(".btn-particles");s&&(s.style.opacity="1")}}else{e.style.transform="translateY(0)";const i=e.querySelector(".btn-icon");i&&(i.style.transform="scale(1)");const s=e.querySelector(".btn-particles");s&&(s.style.opacity="0")}}animateFloatingElements(){this.floatingElements.forEach((e,t)=>{const i=t*.5;setTimeout(()=>{e.style.animation="float 6s ease-in-out infinite",e.style.opacity="1"},i*1e3)})}animateScrollIndicator(){if(!this.scrollIndicator)return;this.scrollIndicator.querySelectorAll(".arrow-line").forEach((i,s)=>{i.style.animation=`arrowLine${s+1} 2s infinite`});const t=this.scrollIndicator.querySelector(".scroll-text");t&&(t.style.animation="fadeInOut 2s infinite")}updateParallax(){if(!this.hero)return;const t=window.pageYOffset*-.5;this.hero.querySelectorAll(".hero-particles, .hero-constellations, .hero-stars").forEach(s=>{s.style.transform=`translateY(${t}px)`}),this.floatingElements.forEach((s,o)=>{const n=t*(.1+o*.05);s.style.transform=`translateY(${n}px)`})}updateResponsiveAnimations(){window.innerWidth<=768?this.heroContent?.style.setProperty("--animation-duration","0.6s"):this.heroContent?.style.setProperty("--animation-duration","0.8s")}scrollToNextSection(){const e=this.hero?.nextElementSibling;e&&e.scrollIntoView({behavior:"smooth",block:"start"})}initThreeJSAnimations(){try{this.heroThreeEngine=new j,this.heroThreeEngine.init("hero-particles").then(e=>{e&&this.setupThemeIntegration()})}catch(e){console.warn("Three.js no está disponible para el hero:",e)}}initTextEffects(){}setupThemeIntegration(){new MutationObserver(t=>{t.forEach(i=>{if(i.type==="attributes"&&i.attributeName==="data-theme"){const s=document.documentElement.getAttribute("data-theme");this.heroThreeEngine&&this.heroThreeEngine.updateTheme(s)}})}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]})}createHeroParticles(){const e=document.getElementById("hero-particles");if(e)for(let t=0;t<20;t++){const i=document.createElement("div");i.className="hero-particle",i.style.cssText=`
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
            `,e.appendChild(i)}}destroy(){this.observer&&this.observer.disconnect(),this.heroThreeEngine&&(this.heroThreeEngine.dispose(),this.heroThreeEngine=null),this.textEffectsEngine&&(this.textEffectsEngine.dispose(),this.textEffectsEngine=null),this.scrollIndicator&&this.scrollIndicator.removeEventListener("click",this.scrollToNextSection),this.hero=null,this.heroContent=null,this.techBadges=[],this.buttons=[],this.scrollIndicator=null,this.floatingElements=[]}}document.addEventListener("DOMContentLoaded",()=>{new Z});class be{constructor(){this.aboutSection=null,this.observer=null,this.isInitialized=!1,this.init()}init(){try{this.setupIntersectionObserver(),this.setupScrollAnimations(),this.setupHoverEffects()}catch(e){console.error("❌ Error inicializando About Animations:",e)}}setupIntersectionObserver(){this.observer=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting?this.onAboutVisible(t.target):this.onAboutHidden(t.target)})},{threshold:.3,rootMargin:"0px 0px -100px 0px"}),this.aboutSection=document.getElementById("about"),this.aboutSection&&this.observer.observe(this.aboutSection)}onAboutVisible(e){this.isInitialized||(this.isInitialized=!0,this.activateCSSAnimations(),this.initParticleEffects())}onAboutHidden(e){this.isInitialized=!1}activateCSSAnimations(){this.aboutSection.querySelectorAll(".animate-fade-in-up").forEach((t,i)=>{const s=parseFloat(t.getAttribute("data-delay"))||0;setTimeout(()=>{t.style.opacity="1",t.style.transform="translateY(0)"},s*1e3)})}initParticleEffects(){this.initAvatarParticles(),this.initStatsParticles(),this.initSpecialtyParticles(),this.initTechParticles(),this.initValuesParticles(),this.initCounterAnimations(),this.initIconAnimations()}initIconAnimations(){document.querySelectorAll(".specialty-icon-inline").forEach((o,n)=>{o.style.animationDelay=`${n*.2}s`,o.classList.add("icon-float")}),document.querySelectorAll(".tech-icon").forEach((o,n)=>{o.style.animationDelay=`${n*.1}s`,o.classList.add("icon-pulse")}),document.querySelectorAll(".value-icon-inline").forEach((o,n)=>{o.style.animationDelay=`${n*.15}s`,o.classList.add("icon-rotate")});const s=document.querySelector(".avatar-icon");s&&s.classList.add("avatar-icon-float")}initAvatarParticles(){const e=document.querySelector(".avatar-container");e&&this.createFloatingParticles(e,30,{color:"var(--primary-color)",size:"2px",duration:"8s"})}initStatsParticles(){document.querySelectorAll(".stat-main-item").forEach((t,i)=>{this.createRisingParticles(t,20,{color:"var(--accent-color)",size:"1px",duration:"6s",delay:i*200})})}initSpecialtyParticles(){document.querySelectorAll(".specialty-inline-item").forEach((t,i)=>{this.createOrbitalParticles(t,15,{color:"var(--primary-color)",size:"1.5px",duration:"10s",delay:i*300})})}initTechParticles(){document.querySelectorAll(".tech-tag-compact").forEach((t,i)=>{this.createExpandingParticles(t,12,{color:"var(--accent-color)",size:"1px",duration:"5s",delay:i*100})})}initValuesParticles(){document.querySelectorAll(".value-inline-item").forEach((t,i)=>{this.createSpiralParticles(t,18,{color:"var(--primary-color)",size:"1.5px",duration:"12s",delay:i*400})})}createFloatingParticles(e,t,i){const s=document.createElement("div");s.className="floating-particles",s.style.cssText=`
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
        `,e.style.position="relative",e.appendChild(s);for(let o=0;o<t;o++)this.createSpiralParticle(s,i,o)}createParticle(e,t,i){const s=document.createElement("div");s.className="particle";const o=i/t.count*Math.PI*2,n=60+Math.random()*40,a=Math.random()*t.duration;s.style.cssText=`
            position: absolute;
            width: ${t.size};
            height: ${t.size};
            background: ${t.color};
            border-radius: 50%;
            top: calc(50% + ${Math.sin(o)*n}px);
            left: calc(50% + ${Math.cos(o)*n}px);
            opacity: 0;
            animation: floatingParticle ${t.duration}s ease-in-out infinite;
            animation-delay: ${a}s;
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
        `,e.appendChild(s)}createOrbitalParticle(e,t,i){const s=document.createElement("div");s.className="particle";const o=i/t.count*Math.PI*2,n=40+Math.random()*20,a=t.delay+i*100;s.style.cssText=`
            position: absolute;
            width: ${t.size};
            height: ${t.size};
            background: ${t.color};
            border-radius: 50%;
            top: calc(50% + ${Math.sin(o)*n}px);
            left: calc(50% + ${Math.cos(o)*n}px);
            opacity: 0;
            animation: orbitalParticle ${t.duration}s linear infinite;
            animation-delay: ${a}ms;
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
        `,e.appendChild(s)}setupScrollAnimations(){window.addEventListener("scroll",()=>{if(!this.aboutSection||!this.isInitialized)return;const e=this.aboutSection.getBoundingClientRect(),t=(window.innerHeight-e.top)/(window.innerHeight+e.height);t>0&&t<1&&this.updateScrollEffects(t)})}initCounterAnimations(){document.querySelectorAll(".stat-main-number").forEach(t=>{parseInt(t.textContent);const i=t.textContent.replace(/\d/g,""),s=parseInt(t.textContent.replace(/\D/g,""));t.textContent="0"+i;const o=new IntersectionObserver(n=>{n.forEach(a=>{a.isIntersecting&&(this.animateCounter(t,0,s,i),o.unobserve(a.target))})},{threshold:.5});o.observe(t)})}animateCounter(e,t,i,s){const n=performance.now(),a=l=>{const c=l-n,h=Math.min(c/2e3,1),m=1-Math.pow(1-h,4),d=Math.floor(t+(i-t)*m);e.textContent=d+s,e.style.transform=`scale(${1+h*.1})`,e.style.color=`hsl(${200+h*60}, 70%, ${60+h*20}%)`,h<1?requestAnimationFrame(a):(e.style.transform="scale(1)",e.style.color="",this.createCelebrationEffect(e))};requestAnimationFrame(a)}createCelebrationEffect(e){const t=e.parentElement,i=document.createElement("div");i.className="celebration-particles",i.style.cssText=`
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
        `,i.appendChild(o)}setTimeout(()=>{i.remove()},2e3)}updateScrollEffects(e){const t=document.querySelector(".avatar-container");if(t){const s=e*20;t.style.transform=`translateY(${s}px)`}document.querySelectorAll(".stat-main-item").forEach((s,o)=>{const n=Math.max(.3,1-e*.5);s.style.opacity=n})}setupHoverEffects(){document.querySelectorAll(".specialty-inline-item").forEach(s=>{s.addEventListener("mouseenter",()=>{this.activateHoverEffect(s,"specialty")}),s.addEventListener("mouseleave",()=>{this.deactivateHoverEffect(s,"specialty")})}),document.querySelectorAll(".tech-tag-compact").forEach(s=>{s.addEventListener("mouseenter",()=>{this.activateHoverEffect(s,"tech")}),s.addEventListener("mouseleave",()=>{this.deactivateHoverEffect(s,"tech")})}),document.querySelectorAll(".value-inline-item").forEach(s=>{s.addEventListener("mouseenter",()=>{this.activateHoverEffect(s,"value")}),s.addEventListener("mouseleave",()=>{this.deactivateHoverEffect(s,"value")})})}activateHoverEffect(e,t){switch(t){case"specialty":e.style.transform="translateY(-8px) scale(1.05)",e.style.boxShadow="0 20px 40px rgba(100, 181, 246, 0.15)";break;case"tech":e.style.transform="translateY(-5px) scale(1.1)",e.style.boxShadow="0 15px 30px rgba(100, 181, 246, 0.2)";break;case"value":e.style.transform="translateY(-6px) scale(1.03)",e.style.boxShadow="0 18px 35px rgba(100, 181, 246, 0.18)";break}}deactivateHoverEffect(e,t){e.style.transform="translateY(0) scale(1)",e.style.boxShadow="none"}destroy(){this.observer&&this.observer.disconnect()}}class xe{constructor(){this.isInitialized=!1,this.modules=new Map,this.visualEngine=null,this.brainEngine=null,this.heroEngine=null,this.headerAuroraEngine=null,this.skillsEngine=null,this.aboutEngine=null,this.deviceDetector=null,this.mobileMenuManager=null,this.heroAnimations=null,this.aboutAnimations=null}async init(){try{await this.initializeBasicModules(),this.setupBasicFeatures(),await this.initializeAdvancedModules(),this.setupGlobalEvents(),this.isInitialized=!0,N.info("Portfolio inicializado")}catch(e){console.error("Error inicializando portfolio:",e)}}async initializeBasicModules(){this.deviceDetector=new ye,this.mobileMenuManager=new we,this.heroAnimations=new Z,this.aboutAnimations=new be}async initializeAdvancedModules(){try{this.visualEngine=new me;const e=localStorage.getItem("theme")||P.THEMES.DEFAULT;this.visualEngine.updateTheme(e),this.initializeSectionEffects()}catch(e){N.error("Error inicializando motor visual:",e)}try{this.heroEngine=new j,await this.heroEngine.init("hero-particles")}catch(e){N.error("Error inicializando Hero Three.js Engine:",e)}try{console.log("Creando NeuralSystemEngine (Cerebro Anatómico Épico)..."),this.brainEngine=new ue("visual-effects-container")}catch(e){console.error("Error creando cerebro épico:",e)}try{this.headerAuroraEngine=new pe,await this.headerAuroraEngine.init("header-aurora-container");const e=localStorage.getItem("theme")||P.THEMES.DEFAULT;this.headerAuroraEngine.updateTheme(e),console.log("Header Aurora Engine initialized")}catch(e){console.error("Error initializing Header Aurora Engine:",e)}try{this.skillsEngine=new fe,await this.skillsEngine.init("skills-three-container");const e=localStorage.getItem("theme")||P.THEMES.DEFAULT;this.skillsEngine.updateTheme(e),console.log("Skills Three.js Engine initialized")}catch(e){console.error("Error initializing Skills Three.js Engine:",e)}try{this.aboutEngine=new ge,await this.aboutEngine.init("about-three-container");const e=localStorage.getItem("theme")||P.THEMES.DEFAULT;this.aboutEngine.updateTheme(e),console.log("About Three.js Engine initialized")}catch(e){console.error("Error initializing About Three.js Engine:",e)}}initializeSectionEffects(){if(!this.visualEngine)return;[{name:"Hero",containerId:"hero-effects"},{name:"About",containerId:"about-effects"},{name:"Experience",containerId:"experience-effects"},{name:"Skills",containerId:"skills-effects"},{name:"Projects",containerId:"projects-effects"},{name:"Contact",containerId:"contact-effects"}].forEach(t=>{document.getElementById(t.name.toLowerCase())&&this.visualEngine.initSectionEffects(t.name,t.containerId)}),this.setupSectionEffectsObserver()}setupSectionEffectsObserver(){const e=["hero","about","experience","skills","projects","contact"],t=new IntersectionObserver(i=>{i.forEach(s=>{s.isIntersecting&&s.target.classList.add("section-effects-active")})},{threshold:.1,rootMargin:"0px 0px -100px 0px"});e.forEach(i=>{const s=document.getElementById(i);s&&t.observe(s)})}setupBasicFeatures(){this.setupThemeToggle(),this.setupMobileMenu(),this.setupSmoothScrolling(),this.setupLanguageToggle(),this.setupMobileOptimizations(),this.setupTouchInteractions()}setupThemeToggle(){const e=v.select("#theme-toggle");if(!e)return;const t=localStorage.getItem("theme")||P.THEMES.DEFAULT;document.documentElement.setAttribute("data-theme",t),this.updateThemeIcon(t),b.on(e,"click",()=>{const i=document.documentElement.getAttribute("data-theme")==="light"?"dark":"light";document.documentElement.setAttribute("data-theme",i),localStorage.setItem("theme",i),this.updateThemeIcon(i),this.visualEngine&&this.visualEngine.updateTheme(i),this.heroEngine&&this.heroEngine.updateTheme(i),this.headerAuroraEngine&&this.headerAuroraEngine.updateTheme(i),this.skillsEngine&&this.skillsEngine.updateTheme(i),this.aboutEngine&&this.aboutEngine.updateTheme(i),b.trigger(window,"themeChanged",{theme:i})})}updateThemeIcon(e){const t=v.select("#theme-toggle i");t&&(t.className=e==="light"?"fas fa-moon":"fas fa-sun")}setupMobileMenu(){const e=v.select("#menu-toggle"),t=v.select(".nav-links");!e||!t||(b.on(e,"click",()=>{v.toggleClass(t,"active"),v.toggleClass(e,"active"),document.body.style.overflow=t.classList.contains("active")?"hidden":""}),v.selectAll(".nav-link").forEach(i=>{b.on(i,"click",()=>{v.removeClasses(t,"active"),v.removeClasses(e,"active"),document.body.style.overflow=""})}),b.on(document,"click",i=>{!e.contains(i.target)&&!t.contains(i.target)&&(v.removeClasses(t,"active"),v.removeClasses(e,"active"),document.body.style.overflow="")}))}setupSmoothScrolling(){v.selectAll('a[href^="#"]').forEach(e=>{b.on(e,"click",t=>{t.preventDefault();const i=v.select(e.getAttribute("href"));i&&i.scrollIntoView({behavior:"smooth",block:"start"})})})}setupLanguageToggle(){const e=v.select("#language-toggle");if(!e)return;const t=localStorage.getItem("language")||P.LANGUAGES.DEFAULT;document.documentElement.setAttribute("data-language",t),b.on(e,"click",()=>{const i=localStorage.getItem("language")==="en"?"es":"en";localStorage.setItem("language",i),document.documentElement.setAttribute("data-language",i),b.trigger(window,"languageChanged",{language:i})})}setupMobileOptimizations(){/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)&&v.addClasses(document.body,"mobile-device"),window.innerWidth<=P.BREAKPOINTS.TABLET&&window.innerWidth>P.BREAKPOINTS.MOBILE&&v.addClasses(document.body,"tablet-device")}setupTouchInteractions(){v.selectAll(".btn, .tech-badge, .nav-link, .card").forEach(t=>{b.on(t,"touchstart",()=>{t.style.transform="scale(0.95)"}),b.on(t,"touchend",()=>{t.style.transform=""}),b.on(t,"touchcancel",()=>{t.style.transform=""})})}setupGlobalEvents(){b.on(document,"visibilitychange",()=>{}),b.on(window,"resize",re.throttle(()=>{},100));const e=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];let t=0;b.on(document,"keydown",i=>{if(i.key==="Escape"){const s=v.select(".nav-links"),o=v.select("#menu-toggle");s?.classList.contains("active")&&(v.removeClasses(s,"active"),v.removeClasses(o,"active"))}i.key==="t"&&i.ctrlKey&&(i.preventDefault(),v.select("#theme-toggle")?.click()),i.key===e[t]?(t++,t===e.length&&(this.activateKonamiEasterEgg(),t=0)):t=0})}activateKonamiEasterEgg(){const e=document.createElement("div");e.className="konami-overlay",e.innerHTML=`
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
                `,document.body.appendChild(e);const t=document.createElement("style");t.textContent=`
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
                `,document.head.appendChild(t);try{const i=new(window.AudioContext||window.webkitAudioContext),s=i.createOscillator(),o=i.createGain();s.connect(o),o.connect(i.destination),s.frequency.setValueAtTime(587.33,i.currentTime),s.frequency.setValueAtTime(880,i.currentTime+.1),s.frequency.setValueAtTime(1174.66,i.currentTime+.2),o.gain.setValueAtTime(.3,i.currentTime),o.gain.exponentialRampToValueAtTime(.01,i.currentTime+.5),s.start(i.currentTime),s.stop(i.currentTime+.5)}catch{}e.addEventListener("click",()=>{e.style.animation="konamiFadeOut 0.3s ease forwards",setTimeout(()=>{e.remove(),t.remove()},300)}),setTimeout(()=>{document.body.contains(e)&&e.click()},5e3)}}class Ee{constructor(){this.progressBar=document.getElementById("loader-progress-bar"),this.progressValue=document.querySelector(".loader-progress-value"),this.statusText=document.querySelector(".loader-status"),this.currentProgress=0,this.targetProgress=0,this.isComplete=!1,this.stages=[{progress:15,status:"Loading assets..."},{progress:35,status:"Initializing..."},{progress:55,status:"Loading modules..."},{progress:75,status:"Preparing UI..."},{progress:90,status:"Almost ready..."},{progress:100,status:"Complete!"}]}updateProgress(e){this.targetProgress=Math.min(e,100),this.animateProgress()}animateProgress(){if(this.currentProgress<this.targetProgress){this.currentProgress+=Math.max(1,(this.targetProgress-this.currentProgress)*.1),this.currentProgress>=this.targetProgress-.5&&(this.currentProgress=this.targetProgress);const e=Math.round(this.currentProgress);this.progressBar&&(this.progressBar.style.width=`${e}%`),this.progressValue&&(this.progressValue.textContent=`${e}%`),this.updateStatus(e),this.currentProgress<this.targetProgress&&requestAnimationFrame(()=>this.animateProgress())}}updateStatus(e){if(this.statusText){for(let t=this.stages.length-1;t>=0;t--)if(e>=this.stages[t].progress-10){this.statusText.textContent=this.stages[t].status;break}}}complete(){this.isComplete=!0,this.updateProgress(100)}}const T=new Ee;setTimeout(()=>T.updateProgress(15),100);setTimeout(()=>T.updateProgress(35),400);setTimeout(()=>T.updateProgress(55),800);const K=()=>{T.complete(),setTimeout(()=>{const r=document.getElementById("page-loader");r&&(r.classList.add("loaded"),setTimeout(()=>{r.style.display="none"},800))},400)},Me=()=>{const r=document.querySelector("[data-header-progress]");r&&window.addEventListener("scroll",()=>{const e=window.scrollY,t=document.documentElement.scrollHeight-window.innerHeight,i=e/t*100;r.style.width=`${i}%`})},Se=()=>{const r=document.getElementById("contact-form");r&&r.addEventListener("submit",async e=>{e.preventDefault();const t=r.querySelector('button[type="submit"]'),i=t.innerHTML;t.innerHTML='<i class="fas fa-spinner fa-spin"></i> Sending...',t.disabled=!0,await new Promise(s=>setTimeout(s,1500)),t.innerHTML='<i class="fas fa-check"></i> Sent!',r.reset(),setTimeout(()=>{t.innerHTML=i,t.disabled=!1},2e3)})};document.addEventListener("DOMContentLoaded",async()=>{T.updateProgress(60);const r=new xe;T.updateProgress(75),await r.init(),T.updateProgress(90),window.portfolio=r,Me(),Se(),T.updateProgress(100),setTimeout(K,600)});window.addEventListener("load",()=>{T.isComplete||(T.updateProgress(100),setTimeout(K,800))});const _=()=>{const r=document.getElementById("custom-cursor");if(!r)return;const e=r.querySelector(".cursor-dot"),t=r.querySelector(".cursor-outline");let i=0,s=0,o=0,n=0;document.addEventListener("mousemove",c=>{i=c.clientX,s=c.clientY,e&&(e.style.left=i+"px",e.style.top=s+"px")});const a=()=>{o+=(i-o)*.15,n+=(s-n)*.15,t&&(t.style.left=o+"px",t.style.top=n+"px"),requestAnimationFrame(a)};a(),document.querySelectorAll("a, button, .btn, .nav-link, .project-card, .stat-card, .tech-tag, .social-link, .floating-icon, input, textarea, select").forEach(c=>{c.addEventListener("mouseenter",()=>r.classList.add("hover")),c.addEventListener("mouseleave",()=>r.classList.remove("hover"))}),document.addEventListener("mousedown",()=>r.classList.add("clicking")),document.addEventListener("mouseup",()=>r.classList.remove("clicking")),document.addEventListener("mouseleave",()=>r.style.opacity="0"),document.addEventListener("mouseenter",()=>r.style.opacity="1")};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",_):_();
