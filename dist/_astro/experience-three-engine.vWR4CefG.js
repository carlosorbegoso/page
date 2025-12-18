import{i as w,S as M,P as b,W as x,B as m,C as d,b as a,c as h,A as l,d as p,e as y,k as P,f as v,h as S,D as A,j as C}from"./three.module.C3mHAYDF.js";class z{constructor(e){this.container=document.getElementById(e),this.container&&(this.scene=null,this.camera=null,this.renderer=null,this.risingParticles=null,this.glowSpheres=[],this.timelineBeam=null,this.ambientStars=null,this.time=0,this.isVisible=!1,this.mouse=new w,this.isMobile=window.innerWidth<=768,this.isLowPower=window.innerWidth<=480,this.particleMultiplier=this.isLowPower?.3:this.isMobile?.5:1,this.init())}init(){this.scene=new M;const e=this.container.clientWidth/this.container.clientHeight;this.camera=new b(60,e,.1,1e3),this.camera.position.z=50,this.renderer=new x({antialias:!this.isMobile,alpha:!0,powerPreference:this.isMobile?"low-power":"high-performance"}),this.renderer.setSize(this.container.clientWidth,this.container.clientHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,this.isMobile?1.5:2)),this.renderer.setClearColor(0,0),this.container.appendChild(this.renderer.domElement),this.renderer.domElement.style.pointerEvents="none",this.createRisingParticles(),this.createGlowSpheres(),this.createTimelineBeam(),this.createAmbientStars(),window.addEventListener("resize",()=>this.onResize()),window.addEventListener("mousemove",i=>this.onMouseMove(i)),this.setupIntersectionObserver(),this.animate()}createRisingParticles(){const e=Math.floor(150*this.particleMultiplier),i=new m,o=new Float32Array(e*3),n=new Float32Array(e*3),t=new Float32Array(e),c=[];for(let s=0;s<e;s++){o[s*3]=(Math.random()-.5)*100,o[s*3+1]=Math.random()*100-50,o[s*3+2]=(Math.random()-.5)*40-20;const g=.5+Math.random()*.1,r=new d;r.setHSL(g,.8,.6),n[s*3]=r.r,n[s*3+1]=r.g,n[s*3+2]=r.b,t[s]=.5+Math.random()*1.5,c.push(.02+Math.random()*.04)}i.setAttribute("position",new a(o,3)),i.setAttribute("color",new a(n,3)),i.setAttribute("size",new a(t,1));const u=new h({uniforms:{time:{value:0},pixelRatio:{value:this.renderer.getPixelRatio()}},vertexShader:`
                attribute float size;
                attribute vec3 color;
                uniform float time;
                uniform float pixelRatio;
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    vColor = color;

                    vec3 pos = position;
                    // Gentle floating motion
                    pos.x += sin(time * 0.3 + position.y * 0.05) * 2.0;
                    pos.z += cos(time * 0.2 + position.x * 0.03) * 1.5;

                    // Pulse alpha based on position
                    vAlpha = 0.3 + 0.3 * sin(time * 1.5 + position.y * 0.1);

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * pixelRatio * (180.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,fragmentShader:`
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    float alpha = vAlpha * smoothstep(0.5, 0.0, dist);
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,transparent:!0,blending:l,depthWrite:!1});this.risingParticles=new p(i,u),this.particleVelocities=c,this.scene.add(this.risingParticles)}createGlowSpheres(){const e=Math.floor(8*this.particleMultiplier);for(let i=0;i<e;i++){const o=new y(2+Math.random()*3,16,16),n=new h({uniforms:{time:{value:0},color:{value:new d(i%2===0?65535:4491519)}},vertexShader:`
                    varying vec3 vNormal;
                    void main() {
                        vNormal = normalize(normalMatrix * normal);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,fragmentShader:`
                    uniform float time;
                    uniform vec3 color;
                    varying vec3 vNormal;

                    void main() {
                        float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
                        float pulse = 0.5 + 0.3 * sin(time * 2.0);
                        gl_FragColor = vec4(color, intensity * pulse * 0.3);
                    }
                `,transparent:!0,blending:l,depthWrite:!1,side:P}),t=new v(o,n);t.position.set((Math.random()-.5)*80,(Math.random()-.5)*60,(Math.random()-.5)*30-15),t.userData={originalY:t.position.y,floatPhase:Math.random()*Math.PI*2,floatSpeed:.3+Math.random()*.3,driftX:(Math.random()-.5)*.02,driftZ:(Math.random()-.5)*.01},this.glowSpheres.push(t),this.scene.add(t)}}createTimelineBeam(){const e=new S(.5,100),i=new h({uniforms:{time:{value:0}},vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,fragmentShader:`
                uniform float time;
                varying vec2 vUv;

                void main() {
                    float dist = abs(vUv.x - 0.5) * 2.0;
                    float beam = exp(-dist * 8.0);

                    // Moving glow effect
                    float wave = sin(vUv.y * 10.0 - time * 2.0) * 0.5 + 0.5;
                    beam *= 0.3 + wave * 0.4;

                    vec3 color = mix(vec3(0.0, 1.0, 1.0), vec3(0.3, 0.6, 1.0), vUv.y);
                    gl_FragColor = vec4(color, beam * 0.15);
                }
            `,transparent:!0,blending:l,depthWrite:!1,side:A});this.timelineBeam=new v(e,i),this.timelineBeam.position.set(-35,0,-10),this.scene.add(this.timelineBeam)}createAmbientStars(){const e=Math.floor(80*this.particleMultiplier),i=new m,o=new Float32Array(e*3);for(let t=0;t<e;t++)o[t*3]=(Math.random()-.5)*120,o[t*3+1]=(Math.random()-.5)*80,o[t*3+2]=-30-Math.random()*20;i.setAttribute("position",new a(o,3));const n=new C({color:16777215,size:.3,transparent:!0,opacity:.15,blending:l});this.ambientStars=new p(i,n),this.scene.add(this.ambientStars)}setupIntersectionObserver(){const e=new IntersectionObserver(o=>{o.forEach(n=>{this.isVisible=n.isIntersecting})},{threshold:.1}),i=document.getElementById("experience");i&&e.observe(i)}onMouseMove(e){this.mouse.x=e.clientX/window.innerWidth*2-1,this.mouse.y=-(e.clientY/window.innerHeight)*2+1}onResize(){if(!this.container)return;const e=this.container.clientWidth,i=this.container.clientHeight;this.camera.aspect=e/i,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,i)}animate(){if(requestAnimationFrame(()=>this.animate()),!!this.isVisible){if(this.time+=.016,this.risingParticles){this.risingParticles.material.uniforms.time.value=this.time;const e=this.risingParticles.geometry.attributes.position.array;for(let i=0;i<e.length/3;i++)e[i*3+1]+=this.particleVelocities[i],e[i*3+1]>50&&(e[i*3+1]=-50,e[i*3]=(Math.random()-.5)*100);this.risingParticles.geometry.attributes.position.needsUpdate=!0}this.glowSpheres.forEach(e=>{const i=e.userData;e.position.y=i.originalY+Math.sin(this.time*i.floatSpeed+i.floatPhase)*5,e.position.x+=i.driftX,e.position.z+=i.driftZ,e.position.x>50&&(e.position.x=-50),e.position.x<-50&&(e.position.x=50),e.material.uniforms.time.value=this.time}),this.timelineBeam&&(this.timelineBeam.material.uniforms.time.value=this.time),this.ambientStars&&(this.ambientStars.rotation.y+=2e-4,this.ambientStars.rotation.x+=1e-4),this.camera.position.x+=(this.mouse.x*5-this.camera.position.x)*.02,this.camera.position.y+=(this.mouse.y*3-this.camera.position.y)*.02,this.camera.lookAt(0,0,0),this.renderer.render(this.scene,this.camera)}}dispose(){this.renderer&&(this.renderer.dispose(),this.container.removeChild(this.renderer.domElement))}}document.addEventListener("DOMContentLoaded",()=>{document.getElementById("experience-three-container")&&new z("experience-three-container")});export{z as ExperienceThreeEngine};
