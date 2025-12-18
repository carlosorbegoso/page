import{V as p,S as M,P as b,W as P,B as v,a as h,b as c,A as d,c as u,C as f,d as x,D as S,M as g,e as A,f as E}from"./three.module.CkGWHzBH.js";class z{constructor(e){this.container=document.getElementById(e),this.container&&(this.scene=null,this.camera=null,this.renderer=null,this.flowingParticles=null,this.timelineEnergy=null,this.floatingOrbs=[],this.ambientStars=null,this.time=0,this.isVisible=!1,this.mouse=new p,this.targetMouse=new p,this.isMobile=window.innerWidth<=768,this.isLowPower=window.innerWidth<=480,this.particleMultiplier=this.isLowPower?.3:this.isMobile?.5:1,this.init())}init(){this.scene=new M;const e=this.container.clientWidth/this.container.clientHeight;this.camera=new b(60,e,.1,1e3),this.camera.position.z=50,this.renderer=new P({antialias:!this.isMobile,alpha:!0,powerPreference:this.isMobile?"low-power":"high-performance"}),this.renderer.setSize(this.container.clientWidth,this.container.clientHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,this.isMobile?1.5:2)),this.renderer.setClearColor(0,0),this.container.appendChild(this.renderer.domElement),this.renderer.domElement.style.pointerEvents="none",this.createAmbientStars(),this.createFlowingParticles(),this.createTimelineEnergy(),this.createFloatingOrbs(),window.addEventListener("resize",()=>this.onResize()),window.addEventListener("mousemove",t=>this.onMouseMove(t)),this.setupIntersectionObserver(),this.animate()}createAmbientStars(){const e=Math.floor(100*this.particleMultiplier),t=new v,i=new Float32Array(e*3),s=new Float32Array(e),n=new Float32Array(e);for(let o=0;o<e;o++)i[o*3]=(Math.random()-.5)*150,i[o*3+1]=(Math.random()-.5)*100,i[o*3+2]=-40-Math.random()*30,s[o]=.2+Math.random()*.5,n[o]=Math.random()*Math.PI*2;t.setAttribute("position",new h(i,3)),t.setAttribute("size",new h(s,1)),t.setAttribute("twinklePhase",new h(n,1));const r=new c({uniforms:{time:{value:0},pixelRatio:{value:this.renderer.getPixelRatio()}},vertexShader:`
                attribute float size;
                attribute float twinklePhase;
                uniform float time;
                uniform float pixelRatio;
                varying float vTwinkle;

                void main() {
                    vTwinkle = 0.4 + 0.4 * sin(time * 1.2 + twinklePhase);

                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * pixelRatio * (80.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,fragmentShader:`
                varying float vTwinkle;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    float alpha = vTwinkle * smoothstep(0.5, 0.0, dist) * 0.6;
                    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
                }
            `,transparent:!0,blending:d,depthWrite:!1});this.ambientStars=new u(t,r),this.scene.add(this.ambientStars)}createFlowingParticles(){const e=Math.floor(120*this.particleMultiplier),t=new v,i=new Float32Array(e*3),s=new Float32Array(e*3),n=new Float32Array(e),r=[],o=new Float32Array(e);for(let a=0;a<e;a++){i[a*3]=(Math.random()-.5)*100,i[a*3+1]=Math.random()*100-50,i[a*3+2]=(Math.random()-.5)*40-15;const y=.52+Math.random()*.08,m=new f;m.setHSL(y,.7,.55),s[a*3]=m.r,s[a*3+1]=m.g,s[a*3+2]=m.b,n[a]=.8+Math.random()*1.5,r.push(.015+Math.random()*.03),o[a]=Math.random()*Math.PI*2}t.setAttribute("position",new h(i,3)),t.setAttribute("color",new h(s,3)),t.setAttribute("size",new h(n,1)),t.setAttribute("phase",new h(o,1));const l=new c({uniforms:{time:{value:0},pixelRatio:{value:this.renderer.getPixelRatio()}},vertexShader:`
                attribute float size;
                attribute vec3 color;
                attribute float phase;
                uniform float time;
                uniform float pixelRatio;
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    vColor = color;

                    vec3 pos = position;
                    // Gentle floating motion
                    pos.x += sin(time * 0.4 + phase + position.y * 0.04) * 2.5;
                    pos.z += cos(time * 0.25 + phase) * 1.8;

                    // Pulse alpha based on position
                    vAlpha = 0.35 + 0.25 * sin(time * 1.8 + phase);

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * pixelRatio * (140.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,fragmentShader:`
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    float alpha = vAlpha * smoothstep(0.5, 0.1, dist);
                    vec3 glow = vColor + vec3(0.15) * (1.0 - dist * 2.0);
                    gl_FragColor = vec4(glow, alpha);
                }
            `,transparent:!0,blending:d,depthWrite:!1});this.flowingParticles=new u(t,l),this.particleVelocities=r,this.scene.add(this.flowingParticles)}createTimelineEnergy(){const e=new x(3,120,1,60),t=new c({uniforms:{time:{value:0}},vertexShader:`
                varying vec2 vUv;
                uniform float time;

                void main() {
                    vUv = uv;

                    vec3 pos = position;
                    // Subtle wave
                    pos.x += sin(uv.y * 8.0 + time * 2.0) * 0.3;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,fragmentShader:`
                uniform float time;
                varying vec2 vUv;

                void main() {
                    // Horizontal gradient (fade at edges)
                    float horizFade = exp(-pow(abs(vUv.x - 0.5) * 4.0, 2.0));

                    // Energy pulses moving upward
                    float pulse1 = sin(vUv.y * 20.0 - time * 3.0) * 0.5 + 0.5;
                    float pulse2 = sin(vUv.y * 15.0 - time * 2.0 + 1.5) * 0.5 + 0.5;
                    float energy = pulse1 * 0.6 + pulse2 * 0.4;

                    // Color gradient (cyan to blue)
                    vec3 color1 = vec3(0.0, 0.9, 0.9);
                    vec3 color2 = vec3(0.3, 0.5, 1.0);
                    vec3 color = mix(color1, color2, vUv.y + sin(time * 0.5) * 0.2);

                    float alpha = horizFade * energy * 0.12;

                    gl_FragColor = vec4(color, alpha);
                }
            `,transparent:!0,blending:d,depthWrite:!1,side:S});this.timelineEnergy=new g(e,t),this.timelineEnergy.position.set(-38,0,-10),this.scene.add(this.timelineEnergy)}createFloatingOrbs(){const e=Math.floor(5*this.particleMultiplier);for(let t=0;t<e;t++){const i=2+Math.random()*3,s=new A(i,24,24),n=.5+Math.random()*.12,r=new f;r.setHSL(n,.75,.5);const o=new c({uniforms:{time:{value:0},color:{value:r},phase:{value:Math.random()*Math.PI*2}},vertexShader:`
                    varying vec3 vNormal;
                    void main() {
                        vNormal = normalize(normalMatrix * normal);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,fragmentShader:`
                    uniform float time;
                    uniform vec3 color;
                    uniform float phase;
                    varying vec3 vNormal;

                    void main() {
                        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.8);
                        float pulse = 0.5 + 0.3 * sin(time * 1.8 + phase);
                        float alpha = fresnel * pulse * 0.35;
                        gl_FragColor = vec4(color, alpha);
                    }
                `,transparent:!0,blending:d,depthWrite:!1,side:E}),l=new g(s,o);l.position.set((Math.random()-.5)*80,(Math.random()-.5)*60,(Math.random()-.5)*25-15),l.userData={originalPos:l.position.clone(),floatPhase:Math.random()*Math.PI*2,floatSpeed:.25+Math.random()*.25,floatAmplitude:4+Math.random()*4},this.floatingOrbs.push(l),this.scene.add(l)}}setupIntersectionObserver(){const e=new IntersectionObserver(i=>{i.forEach(s=>{this.isVisible=s.isIntersecting})},{threshold:.1}),t=document.getElementById("experience");t&&e.observe(t)}onMouseMove(e){this.targetMouse.x=e.clientX/window.innerWidth*2-1,this.targetMouse.y=-(e.clientY/window.innerHeight)*2+1}onResize(){if(!this.container)return;const e=this.container.clientWidth,t=this.container.clientHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t)}animate(){if(requestAnimationFrame(()=>this.animate()),!!this.isVisible){if(this.time+=.016,this.mouse.x+=(this.targetMouse.x-this.mouse.x)*.04,this.mouse.y+=(this.targetMouse.y-this.mouse.y)*.04,this.ambientStars&&(this.ambientStars.material.uniforms.time.value=this.time,this.ambientStars.rotation.y+=8e-5),this.flowingParticles){this.flowingParticles.material.uniforms.time.value=this.time;const e=this.flowingParticles.geometry.attributes.position.array;for(let t=0;t<e.length/3;t++)e[t*3+1]+=this.particleVelocities[t],e[t*3+1]>50&&(e[t*3+1]=-50,e[t*3]=(Math.random()-.5)*100);this.flowingParticles.geometry.attributes.position.needsUpdate=!0}this.timelineEnergy&&(this.timelineEnergy.material.uniforms.time.value=this.time),this.floatingOrbs.forEach(e=>{const t=e.userData;e.position.y=t.originalPos.y+Math.sin(this.time*t.floatSpeed+t.floatPhase)*t.floatAmplitude,e.position.x=t.originalPos.x+Math.cos(this.time*t.floatSpeed*.6+t.floatPhase)*t.floatAmplitude*.4,e.material.uniforms.time.value=this.time}),this.camera.position.x+=(this.mouse.x*6-this.camera.position.x)*.02,this.camera.position.y+=(this.mouse.y*4-this.camera.position.y)*.02,this.camera.lookAt(0,0,0),this.renderer.render(this.scene,this.camera)}}dispose(){this.flowingParticles&&(this.flowingParticles.geometry.dispose(),this.flowingParticles.material.dispose()),this.ambientStars&&(this.ambientStars.geometry.dispose(),this.ambientStars.material.dispose()),this.timelineEnergy&&(this.timelineEnergy.geometry.dispose(),this.timelineEnergy.material.dispose()),this.floatingOrbs.forEach(e=>{e.geometry.dispose(),e.material.dispose()}),this.renderer&&(this.renderer.dispose(),this.container.removeChild(this.renderer.domElement))}}document.addEventListener("DOMContentLoaded",()=>{document.getElementById("experience-three-container")&&new z("experience-three-container")});export{z as ExperienceThreeEngine};
