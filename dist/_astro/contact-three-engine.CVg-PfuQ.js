import{V as w,S as x,P as b,W as S,B as v,a as h,b as c,A as m,c as M,G as z,e as g,M as p,R as A,D as C,g as E,i as k,h as F,C as P,f as I}from"./three.module.CkGWHzBH.js";class N{constructor(e){this.container=document.getElementById(e),this.container&&(this.scene=null,this.camera=null,this.renderer=null,this.networkNodes=[],this.networkConnections=[],this.flowingParticles=null,this.ambientStars=null,this.floatingOrbs=[],this.energyPulses=[],this.mouse=new w,this.targetMouse=new w,this.time=0,this.isVisible=!1,this.isMobile=window.innerWidth<=768,this.isLowPower=window.innerWidth<=480,this.particleMultiplier=this.isLowPower?.3:this.isMobile?.5:1,this.init())}init(){this.scene=new x;const e=this.container.clientWidth/this.container.clientHeight;this.camera=new b(60,e,.1,1e3),this.camera.position.z=50,this.renderer=new S({antialias:!this.isMobile,alpha:!0,powerPreference:this.isMobile?"low-power":"high-performance"}),this.renderer.setSize(this.container.clientWidth,this.container.clientHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,this.isMobile?1.5:2)),this.renderer.setClearColor(0,0),this.container.appendChild(this.renderer.domElement),this.renderer.domElement.style.pointerEvents="none",this.createAmbientStars(),this.createNetworkVisualization(),this.createFlowingParticles(),this.createFloatingOrbs(),window.addEventListener("resize",()=>this.onResize()),window.addEventListener("mousemove",t=>this.onMouseMove(t)),this.setupIntersectionObserver(),this.animate()}createAmbientStars(){const e=Math.floor(80*this.particleMultiplier),t=new v,o=new Float32Array(e*3),i=new Float32Array(e),a=new Float32Array(e);for(let n=0;n<e;n++)o[n*3]=(Math.random()-.5)*150,o[n*3+1]=(Math.random()-.5)*100,o[n*3+2]=-40-Math.random()*30,i[n]=.2+Math.random()*.5,a[n]=Math.random()*Math.PI*2;t.setAttribute("position",new h(o,3)),t.setAttribute("size",new h(i,1)),t.setAttribute("twinklePhase",new h(a,1));const r=new c({uniforms:{time:{value:0},pixelRatio:{value:this.renderer.getPixelRatio()}},vertexShader:`
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

                    float alpha = vTwinkle * smoothstep(0.5, 0.0, dist) * 0.5;
                    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
                }
            `,transparent:!0,blending:m,depthWrite:!1});this.ambientStars=new M(t,r),this.scene.add(this.ambientStars)}createNetworkVisualization(){[{x:-20,y:12,z:0},{x:20,y:12,z:0},{x:0,y:-8,z:5},{x:-25,y:-15,z:3},{x:25,y:-15,z:3},{x:0,y:22,z:-5},{x:-12,y:0,z:8},{x:12,y:0,z:8}].forEach((t,o)=>{const i=new z,a=new g(1,24,24),r=new c({uniforms:{time:{value:0},phase:{value:Math.random()*Math.PI*2}},vertexShader:`
                    varying vec3 vNormal;
                    void main() {
                        vNormal = normalize(normalMatrix * normal);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,fragmentShader:`
                    uniform float time;
                    uniform float phase;
                    varying vec3 vNormal;

                    void main() {
                        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
                        float pulse = 0.6 + 0.3 * sin(time * 2.0 + phase);

                        vec3 color = vec3(0.0, 0.9, 0.9);
                        float alpha = (0.4 + fresnel * 0.5) * pulse;

                        gl_FragColor = vec4(color, alpha);
                    }
                `,transparent:!0,blending:m,depthWrite:!1}),n=new p(a,r);i.add(n);const s=new A(1.5,1.8,32),d=new c({uniforms:{time:{value:0},phase:{value:Math.random()*Math.PI*2}},vertexShader:`
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,fragmentShader:`
                    uniform float time;
                    uniform float phase;
                    varying vec2 vUv;

                    void main() {
                        float pulse = 0.5 + 0.3 * sin(time * 1.5 + phase);
                        float ring = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);

                        vec3 color = vec3(0.0, 0.85, 0.85);
                        float alpha = ring * pulse * 0.3;

                        gl_FragColor = vec4(color, alpha);
                    }
                `,transparent:!0,blending:m,depthWrite:!1,side:C}),l=new p(s,d);i.add(l),i.position.set(t.x,t.y,t.z),i.userData={originalPos:{...t},pulsePhase:Math.random()*Math.PI*2,floatPhase:Math.random()*Math.PI*2},this.networkNodes.push(i),this.scene.add(i)}),this.createNetworkConnections()}createNetworkConnections(){[[0,1],[0,2],[1,2],[0,3],[1,4],[2,3],[2,4],[3,4],[0,5],[1,5],[5,2],[6,7],[6,0],[7,1],[6,2],[7,2]].forEach(([t,o])=>{const i=this.networkNodes[t],a=this.networkNodes[o],r=[],n=20;for(let f=0;f<=n;f++){const u=f/n;r.push(new E(i.position.x+(a.position.x-i.position.x)*u,i.position.y+(a.position.y-i.position.y)*u,i.position.z+(a.position.z-i.position.z)*u))}const s=new v().setFromPoints(r),d=new c({uniforms:{time:{value:0},phase:{value:Math.random()*Math.PI*2}},vertexShader:`
                    varying float vProgress;
                    attribute float progress;

                    void main() {
                        vProgress = position.x;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,fragmentShader:`
                    uniform float time;
                    uniform float phase;

                    void main() {
                        vec3 color = vec3(0.0, 0.8, 0.9);
                        float pulse = 0.5 + 0.3 * sin(time * 2.0 + phase);
                        float alpha = 0.12 * pulse;

                        gl_FragColor = vec4(color, alpha);
                    }
                `,transparent:!0,blending:m,depthWrite:!1}),l=new k(s,d);l.userData={nodeA:t,nodeB:o,phase:Math.random()*Math.PI*2},this.networkConnections.push(l),this.scene.add(l),this.createEnergyPulse(i.position,a.position)})}createEnergyPulse(e,t){const o=new g(.2,8,8),i=new F({color:65535,transparent:!0,opacity:.8}),a=new p(o,i);a.userData={startPos:e.clone(),endPos:t.clone(),progress:Math.random(),speed:.003+Math.random()*.004,direction:Math.random()>.5?1:-1},this.energyPulses.push(a),this.scene.add(a)}createFlowingParticles(){const e=Math.floor(100*this.particleMultiplier),t=new v,o=new Float32Array(e*3),i=new Float32Array(e*3),a=new Float32Array(e),r=new Float32Array(e);for(let s=0;s<e;s++){o[s*3]=(Math.random()-.5)*100,o[s*3+1]=(Math.random()-.5)*70,o[s*3+2]=(Math.random()-.5)*40-10;const d=.5+Math.random()*.1,l=new P;l.setHSL(d,.8,.55),i[s*3]=l.r,i[s*3+1]=l.g,i[s*3+2]=l.b,a[s]=.6+Math.random()*1.2,r[s]=Math.random()*Math.PI*2}t.setAttribute("position",new h(o,3)),t.setAttribute("color",new h(i,3)),t.setAttribute("size",new h(a,1)),t.setAttribute("phase",new h(r,1));const n=new c({uniforms:{time:{value:0},pixelRatio:{value:this.renderer.getPixelRatio()}},vertexShader:`
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
                    pos.x += sin(time * 0.4 + phase) * 3.0;
                    pos.y += cos(time * 0.3 + phase * 0.5) * 2.0;

                    vAlpha = 0.3 + 0.25 * sin(time * 1.5 + phase);

                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * pixelRatio * (120.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,fragmentShader:`
                varying vec3 vColor;
                varying float vAlpha;

                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;

                    float alpha = vAlpha * smoothstep(0.5, 0.1, dist);
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,transparent:!0,blending:m,depthWrite:!1});this.flowingParticles=new M(t,n),this.scene.add(this.flowingParticles)}createFloatingOrbs(){const e=Math.floor(4*this.particleMultiplier);for(let t=0;t<e;t++){const o=2.5+Math.random()*3,i=new g(o,24,24),a=.5+Math.random()*.1,r=new P;r.setHSL(a,.75,.5);const n=new c({uniforms:{time:{value:0},color:{value:r},phase:{value:Math.random()*Math.PI*2}},vertexShader:`
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
                        float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);
                        float pulse = 0.5 + 0.3 * sin(time * 1.5 + phase);
                        float alpha = fresnel * pulse * 0.3;
                        gl_FragColor = vec4(color, alpha);
                    }
                `,transparent:!0,blending:m,depthWrite:!1,side:I}),s=new p(i,n);s.position.set((Math.random()-.5)*80,(Math.random()-.5)*50,(Math.random()-.5)*25-15),s.userData={originalPos:s.position.clone(),floatPhase:Math.random()*Math.PI*2,floatSpeed:.2+Math.random()*.2,floatAmplitude:4+Math.random()*4},this.floatingOrbs.push(s),this.scene.add(s)}}setupIntersectionObserver(){const e=new IntersectionObserver(o=>{o.forEach(i=>{this.isVisible=i.isIntersecting})},{threshold:.1}),t=document.getElementById("contact");t&&e.observe(t)}onMouseMove(e){this.targetMouse.x=e.clientX/window.innerWidth*2-1,this.targetMouse.y=-(e.clientY/window.innerHeight)*2+1}onResize(){if(!this.container)return;const e=this.container.clientWidth,t=this.container.clientHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t)}animate(){requestAnimationFrame(()=>this.animate()),this.isVisible&&(this.time+=.016,this.mouse.x+=(this.targetMouse.x-this.mouse.x)*.04,this.mouse.y+=(this.targetMouse.y-this.mouse.y)*.04,this.ambientStars&&(this.ambientStars.material.uniforms.time.value=this.time,this.ambientStars.rotation.y+=8e-5),this.networkNodes.forEach((e,t)=>{e.userData.pulsePhase;const o=e.userData.floatPhase;e.position.y=e.userData.originalPos.y+Math.sin(this.time*.5+o)*1.5,e.children.forEach(i=>{i.material.uniforms&&(i.material.uniforms.time.value=this.time)})}),this.networkConnections.forEach(e=>{e.material.uniforms&&(e.material.uniforms.time.value=this.time)}),this.energyPulses.forEach(e=>{const t=e.userData;t.progress+=t.speed*t.direction,t.progress>1?t.progress=0:t.progress<0&&(t.progress=1),e.position.lerpVectors(t.startPos,t.endPos,t.progress),e.material.opacity=.3+Math.sin(t.progress*Math.PI)*.5}),this.flowingParticles&&(this.flowingParticles.material.uniforms.time.value=this.time),this.floatingOrbs.forEach(e=>{const t=e.userData;e.position.y=t.originalPos.y+Math.sin(this.time*t.floatSpeed+t.floatPhase)*t.floatAmplitude,e.position.x=t.originalPos.x+Math.cos(this.time*t.floatSpeed*.6+t.floatPhase)*t.floatAmplitude*.4,e.material.uniforms.time.value=this.time}),this.camera.position.x+=(this.mouse.x*6-this.camera.position.x)*.02,this.camera.position.y+=(this.mouse.y*4-this.camera.position.y)*.02,this.camera.lookAt(0,0,0),this.renderer.render(this.scene,this.camera))}dispose(){this.ambientStars&&(this.ambientStars.geometry.dispose(),this.ambientStars.material.dispose()),this.flowingParticles&&(this.flowingParticles.geometry.dispose(),this.flowingParticles.material.dispose()),this.networkNodes.forEach(e=>{e.children.forEach(t=>{t.geometry.dispose(),t.material.dispose()})}),this.networkConnections.forEach(e=>{e.geometry.dispose(),e.material.dispose()}),this.energyPulses.forEach(e=>{e.geometry.dispose(),e.material.dispose()}),this.floatingOrbs.forEach(e=>{e.geometry.dispose(),e.material.dispose()}),this.renderer&&(this.renderer.dispose(),this.container.removeChild(this.renderer.domElement))}}document.addEventListener("DOMContentLoaded",()=>{document.getElementById("contact-three-container")&&new N("contact-three-container")});export{N as ContactThreeEngine};
