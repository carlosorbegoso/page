var Ja=Math.pow;var cp=(n,e)=>()=>(e||n((e={exports:{}}).exports,e),e.exports);var xt=(n,e,t)=>new Promise((i,r)=>{var s=l=>{try{o(t.next(l))}catch(c){r(c)}},a=l=>{try{o(t.throw(l))}catch(c){r(c)}},o=l=>l.done?i(l.value):Promise.resolve(l.value).then(s,a);o((t=t.apply(n,e)).next())});var vx=cp(rp=>{(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const hp={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},up={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Hh=0,Do=1,Gh=2,dp=3,pp=0,Ml=1,ga=2,di=3,Ni=0,Bt=1,pi=2,mp=2,Ii=0,Sr=1,vi=2,Uo=3,No=4,Vh=5,Zi=100,Wh=101,Xh=102,Oo=103,Fo=104,jh=200,qh=201,Yh=202,Zh=203,ha=204,ua=205,Jh=206,Kh=207,$h=208,Qh=209,eu=210,tu=211,iu=212,ru=213,su=214,nu=0,au=1,ou=2,Ds=3,lu=4,cu=5,hu=6,uu=7,tn=0,du=1,pu=2,Di=0,mu=1,fu=2,gu=3,vu=4,yu=5,zo="attached",_u="detached",va=300,Oi=301,Qi=302,Us=303,Ns=304,hs=306,Os=1e3,It=1001,Fs=1002,dt=1003,da=1004,fp=1004,Rs=1005,gp=1005,pt=1006,bl=1007,vp=1007,er=1008,yp=1008,Ui=1009,xu=1010,Mu=1011,ya=1012,Sl=1013,Li=1014,mi=1015,as=1016,wl=1017,El=1018,Ji=1020,bu=1021,Zt=1023,Su=1024,wu=1025,Ki=1026,Tr=1027,Eu=1028,Tl=1029,Tu=1030,Al=1031,Rl=1033,ra=33776,sa=33777,na=33778,aa=33779,Bo=35840,ko=35841,Ho=35842,Go=35843,Au=36196,Vo=37492,Wo=37496,Xo=37808,jo=37809,qo=37810,Yo=37811,Zo=37812,Jo=37813,Ko=37814,$o=37815,Qo=37816,el=37817,tl=37818,il=37819,rl=37820,sl=37821,oa=36492,nl=36494,al=36495,Ru=36283,ol=36284,ll=36285,cl=36286,Cu=2200,Lu=2201,Pu=2202,zs=2300,Bs=2301,la=2302,_r=2400,xr=2401,ks=2402,_a=2500,Cl=2501,_p=0,xp=1,Mp=2,Ll=3e3,$i=3001,Iu=3200,Du=3201,ir=0,Uu=1,Jt="",Mt="srgb",yi="srgb-linear",xa="display-p3",rn="display-p3-linear",Hs="linear",nt="srgb",Gs="rec709",Vs="p3",bp=0,gr=7680,Sp=7681,wp=7682,Ep=7683,Tp=34055,Ap=34056,Rp=5386,Cp=512,Lp=513,Pp=514,Ip=515,Dp=516,Up=517,Np=518,hl=519,Nu=512,Ou=513,Fu=514,zu=515,Bu=516,ku=517,Hu=518,Gu=519,Ws=35044,Op=35048,Fp=35040,zp=35045,Bp=35049,kp=35041,Hp=35046,Gp=35050,Vp=35042,Wp="100",ul="300 es",pa=1035,fi=2e3,Xs=2001;class ki{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const i=this._listeners[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const t=this._listeners[e.type];if(t!==void 0){e.target=this;const i=t.slice(0);for(let r=0,s=i.length;r<s;r++)i[r].call(this,e);e.target=null}}}const Ct=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let hc=1234567;const wr=Math.PI/180,os=180/Math.PI;function Kt(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ct[n&255]+Ct[n>>8&255]+Ct[n>>16&255]+Ct[n>>24&255]+"-"+Ct[e&255]+Ct[e>>8&255]+"-"+Ct[e>>16&15|64]+Ct[e>>24&255]+"-"+Ct[t&63|128]+Ct[t>>8&255]+"-"+Ct[t>>16&255]+Ct[t>>24&255]+Ct[i&255]+Ct[i>>8&255]+Ct[i>>16&255]+Ct[i>>24&255]).toLowerCase()}function ht(n,e,t){return Math.max(e,Math.min(t,n))}function Pl(n,e){return(n%e+e)%e}function Xp(n,e,t,i,r){return i+(n-e)*(r-i)/(t-e)}function jp(n,e,t){return n!==e?(t-n)/(e-n):0}function Cs(n,e,t){return(1-t)*n+t*e}function qp(n,e,t,i){return Cs(n,e,1-Math.exp(-t*i))}function Yp(n,e=1){return e-Math.abs(Pl(n,e*2)-e)}function Zp(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Jp(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Kp(n,e){return n+Math.floor(Math.random()*(e-n+1))}function $p(n,e){return n+Math.random()*(e-n)}function Qp(n){return n*(.5-Math.random())}function em(n){n!==void 0&&(hc=n);let e=hc+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function tm(n){return n*wr}function im(n){return n*os}function dl(n){return(n&n-1)===0&&n!==0}function Vu(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function ma(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function rm(n,e,t,i,r){const s=Math.cos,a=Math.sin,o=s(t/2),l=a(t/2),c=s((e+i)/2),h=a((e+i)/2),d=s((e-i)/2),u=a((e-i)/2),p=s((i-e)/2),f=a((i-e)/2);switch(r){case"XYX":n.set(o*h,l*d,l*u,o*c);break;case"YZY":n.set(l*u,o*h,l*d,o*c);break;case"ZXZ":n.set(l*d,l*u,o*h,o*c);break;case"XZX":n.set(o*h,l*f,l*p,o*c);break;case"YXY":n.set(l*p,o*h,l*f,o*c);break;case"ZYZ":n.set(l*f,l*p,o*h,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Gt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function ke(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const sm={DEG2RAD:wr,RAD2DEG:os,generateUUID:Kt,clamp:ht,euclideanModulo:Pl,mapLinear:Xp,inverseLerp:jp,lerp:Cs,damp:qp,pingpong:Yp,smoothstep:Zp,smootherstep:Jp,randInt:Kp,randFloat:$p,randFloatSpread:Qp,seededRandom:em,degToRad:tm,radToDeg:im,isPowerOfTwo:dl,ceilPowerOfTwo:Vu,floorPowerOfTwo:ma,setQuaternionFromProperEuler:rm,normalize:ke,denormalize:Gt};class q{constructor(e=0,t=0){q.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ht(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ge{constructor(e,t,i,r,s,a,o,l,c){Ge.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,l,c)}set(e,t,i,r,s,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=r,h[2]=o,h[3]=t,h[4]=s,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],d=i[7],u=i[2],p=i[5],f=i[8],v=r[0],g=r[3],m=r[6],_=r[1],y=r[4],x=r[7],w=r[2],A=r[5],C=r[8];return s[0]=a*v+o*_+l*w,s[3]=a*g+o*y+l*A,s[6]=a*m+o*x+l*C,s[1]=c*v+h*_+d*w,s[4]=c*g+h*y+d*A,s[7]=c*m+h*x+d*C,s[2]=u*v+p*_+f*w,s[5]=u*g+p*y+f*A,s[8]=u*m+p*x+f*C,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-i*s*h+i*o*l+r*s*c-r*a*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=h*a-o*c,u=o*l-h*s,p=c*s-a*l,f=t*d+i*u+r*p;if(f===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/f;return e[0]=d*v,e[1]=(r*c-h*i)*v,e[2]=(o*i-r*a)*v,e[3]=u*v,e[4]=(h*t-r*l)*v,e[5]=(r*s-o*t)*v,e[6]=p*v,e[7]=(i*l-c*t)*v,e[8]=(a*t-i*s)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Ka.makeScale(e,t)),this}rotate(e){return this.premultiply(Ka.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ka.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ka=new Ge;function Wu(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}const nm={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array};function es(n,e){return new nm[n](e)}function js(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Xu(){const n=js("canvas");return n.style.display="block",n}const uc={};function Ls(n){n in uc||(uc[n]=!0,console.warn(n))}const dc=new Ge().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),pc=new Ge().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),pn={[yi]:{transfer:Hs,primaries:Gs,toReference:n=>n,fromReference:n=>n},[Mt]:{transfer:nt,primaries:Gs,toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[rn]:{transfer:Hs,primaries:Vs,toReference:n=>n.applyMatrix3(pc),fromReference:n=>n.applyMatrix3(dc)},[xa]:{transfer:nt,primaries:Vs,toReference:n=>n.convertSRGBToLinear().applyMatrix3(pc),fromReference:n=>n.applyMatrix3(dc).convertLinearToSRGB()}},am=new Set([yi,rn]),Qe={enabled:!0,_workingColorSpace:yi,get legacyMode(){return console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),!this.enabled},set legacyMode(n){console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."),this.enabled=!n},get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!am.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,e,t){if(this.enabled===!1||e===t||!e||!t)return n;const i=pn[e].toReference,r=pn[t].fromReference;return r(i(n))},fromWorkingColorSpace:function(n,e){return this.convert(n,this._workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this._workingColorSpace)},getPrimaries:function(n){return pn[n].primaries},getTransfer:function(n){return n===Jt?Hs:pn[n].transfer}};function ss(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function $a(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Ur;class Il{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Ur===void 0&&(Ur=js("canvas")),Ur.width=e.width,Ur.height=e.height;const i=Ur.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Ur}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=js("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=ss(s[a]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(ss(t[i]/255)*255):t[i]=ss(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let om=0;class Mr{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:om++}),this.uuid=Kt(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Qa(r[a].image)):s.push(Qa(r[a]))}else s=Qa(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function Qa(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Il.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let lm=0;class mt extends ki{constructor(e=mt.DEFAULT_IMAGE,t=mt.DEFAULT_MAPPING,i=It,r=It,s=pt,a=er,o=Zt,l=Ui,c=mt.DEFAULT_ANISOTROPY,h=Jt){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:lm++}),this.uuid=Kt(),this.name="",this.source=new Mr(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new q(0,0),this.repeat=new q(1,1),this.center=new q(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ge,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(Ls("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===$i?Mt:Jt),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==va)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Os:e.x=e.x-Math.floor(e.x);break;case It:e.x=e.x<0?0:1;break;case Fs:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Os:e.y=e.y-Math.floor(e.y);break;case It:e.y=e.y<0?0:1;break;case Fs:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Ls("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Mt?$i:Ll}set encoding(e){Ls("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===$i?Mt:Jt}}mt.DEFAULT_IMAGE=null;mt.DEFAULT_MAPPING=va;mt.DEFAULT_ANISOTROPY=1;class et{constructor(e=0,t=0,i=0,r=1){et.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*i+a[11]*r+a[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const a=e.elements,o=a[0],l=a[4],c=a[8],h=a[1],d=a[5],u=a[9],p=a[2],f=a[6],v=a[10];if(Math.abs(l-h)<.01&&Math.abs(c-p)<.01&&Math.abs(u-f)<.01){if(Math.abs(l+h)<.1&&Math.abs(c+p)<.1&&Math.abs(u+f)<.1&&Math.abs(o+d+v-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const m=(o+1)/2,_=(d+1)/2,y=(v+1)/2,x=(l+h)/4,w=(c+p)/4,A=(u+f)/4;return m>_&&m>y?m<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(m),r=x/i,s=w/i):_>y?_<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(_),i=x/r,s=A/r):y<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(y),i=w/s,r=A/s),this.set(i,r,s,t),this}let g=Math.sqrt((f-u)*(f-u)+(c-p)*(c-p)+(h-l)*(h-l));return Math.abs(g)<.001&&(g=1),this.x=(f-u)/g,this.y=(c-p)/g,this.z=(h-l)/g,this.w=Math.acos((o+d+v-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class ju extends ki{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new et(0,0,e,t),this.scissorTest=!1,this.viewport=new et(0,0,e,t);const r={width:e,height:t,depth:1};i.encoding!==void 0&&(Ls("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===$i?Mt:Jt),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:pt,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},i),this.texture=new mt(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=i.generateMipmaps,this.texture.internalFormat=i.internalFormat,this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}setSize(e,t,i=1){(this.width!==e||this.height!==t||this.depth!==i)&&(this.width=e,this.height=t,this.depth=i,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=i,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Mr(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ai extends ju{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Ma extends mt{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=dt,this.minFilter=dt,this.wrapR=It,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class cm extends ai{constructor(e=1,t=1,i=1){super(e,t),this.isWebGLArrayRenderTarget=!0,this.depth=i,this.texture=new Ma(null,e,t,i),this.texture.isRenderTargetTexture=!0}}class Dl extends mt{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=dt,this.minFilter=dt,this.wrapR=It,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class hm extends ai{constructor(e=1,t=1,i=1){super(e,t),this.isWebGL3DRenderTarget=!0,this.depth=i,this.texture=new Dl(null,e,t,i),this.texture.isRenderTargetTexture=!0}}class um extends ai{constructor(e=1,t=1,i=1,r={}){super(e,t,r),this.isWebGLMultipleRenderTargets=!0;const s=this.texture;this.texture=[];for(let a=0;a<i;a++)this.texture[a]=s.clone(),this.texture[a].isRenderTargetTexture=!0}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.texture.length;r<s;r++)this.texture[r].image.width=e,this.texture[r].image.height=t,this.texture[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}copy(e){this.dispose(),this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.texture.length=0;for(let t=0,i=e.texture.length;t<i;t++)this.texture[t]=e.texture[t].clone(),this.texture[t].isRenderTargetTexture=!0;return this}}class Vt{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,a,o){let l=i[r+0],c=i[r+1],h=i[r+2],d=i[r+3];const u=s[a+0],p=s[a+1],f=s[a+2],v=s[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d;return}if(o===1){e[t+0]=u,e[t+1]=p,e[t+2]=f,e[t+3]=v;return}if(d!==v||l!==u||c!==p||h!==f){let g=1-o;const m=l*u+c*p+h*f+d*v,_=m>=0?1:-1,y=1-m*m;if(y>Number.EPSILON){const w=Math.sqrt(y),A=Math.atan2(w,m*_);g=Math.sin(g*A)/w,o=Math.sin(o*A)/w}const x=o*_;if(l=l*g+u*x,c=c*g+p*x,h=h*g+f*x,d=d*g+v*x,g===1-o){const w=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=w,c*=w,h*=w,d*=w}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,r,s,a){const o=i[r],l=i[r+1],c=i[r+2],h=i[r+3],d=s[a],u=s[a+1],p=s[a+2],f=s[a+3];return e[t]=o*f+h*d+l*p-c*u,e[t+1]=l*f+h*u+c*d-o*p,e[t+2]=c*f+h*p+o*u-l*d,e[t+3]=h*f-o*d-l*u-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(r/2),d=o(s/2),u=l(i/2),p=l(r/2),f=l(s/2);switch(a){case"XYZ":this._x=u*h*d+c*p*f,this._y=c*p*d-u*h*f,this._z=c*h*f+u*p*d,this._w=c*h*d-u*p*f;break;case"YXZ":this._x=u*h*d+c*p*f,this._y=c*p*d-u*h*f,this._z=c*h*f-u*p*d,this._w=c*h*d+u*p*f;break;case"ZXY":this._x=u*h*d-c*p*f,this._y=c*p*d+u*h*f,this._z=c*h*f+u*p*d,this._w=c*h*d-u*p*f;break;case"ZYX":this._x=u*h*d-c*p*f,this._y=c*p*d+u*h*f,this._z=c*h*f-u*p*d,this._w=c*h*d+u*p*f;break;case"YZX":this._x=u*h*d+c*p*f,this._y=c*p*d+u*h*f,this._z=c*h*f-u*p*d,this._w=c*h*d-u*p*f;break;case"XZY":this._x=u*h*d-c*p*f,this._y=c*p*d-u*h*f,this._z=c*h*f+u*p*d,this._w=c*h*d+u*p*f;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t!==!1&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],d=t[10],u=i+o+d;if(u>0){const p=.5/Math.sqrt(u+1);this._w=.25/p,this._x=(h-l)*p,this._y=(s-c)*p,this._z=(a-r)*p}else if(i>o&&i>d){const p=2*Math.sqrt(1+i-o-d);this._w=(h-l)/p,this._x=.25*p,this._y=(r+a)/p,this._z=(s+c)/p}else if(o>d){const p=2*Math.sqrt(1+o-i-d);this._w=(s-c)/p,this._x=(r+a)/p,this._y=.25*p,this._z=(l+h)/p}else{const p=2*Math.sqrt(1+d-i-o);this._w=(a-r)/p,this._x=(s+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ht(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+a*o+r*c-s*l,this._y=r*h+a*l+s*o-i*c,this._z=s*h+a*c+i*l-r*o,this._w=a*h-i*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+i*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=r,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const p=1-t;return this._w=p*a+t*this._w,this._x=p*i+t*this._x,this._y=p*r+t*this._y,this._z=p*s+t*this._z,this.normalize(),this._onChangeCallback(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),d=Math.sin((1-t)*h)/c,u=Math.sin(t*h)/c;return this._w=a*d+this._w*u,this._x=i*d+this._x*u,this._y=r*d+this._y*u,this._z=s*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=Math.random(),t=Math.sqrt(1-e),i=Math.sqrt(e),r=2*Math.PI*Math.random(),s=2*Math.PI*Math.random();return this.set(t*Math.cos(r),i*Math.sin(s),i*Math.cos(s),t*Math.sin(r))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class E{constructor(e=0,t=0,i=0){E.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(mc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(mc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*i),h=2*(o*t-s*r),d=2*(s*i-a*t);return this.x=t+l*c+a*d-o*h,this.y=i+l*h+o*c-s*d,this.z=r+l*d+s*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return eo.copy(this).projectOnVector(e),this.sub(eo)}reflect(e){return this.sub(eo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ht(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,i=Math.sqrt(1-Ja(e,2));return this.x=i*Math.cos(t),this.y=i*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const eo=new E,mc=new Vt;class xi{constructor(e=new E(1/0,1/0,1/0),t=new E(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(ti.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(ti.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=ti.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,ti):ti.fromBufferAttribute(s,a),ti.applyMatrix4(e.matrixWorld),this.expandByPoint(ti);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),mn.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),mn.copy(i.boundingBox)),mn.applyMatrix4(e.matrixWorld),this.union(mn)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,ti),ti.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(gs),fn.subVectors(this.max,gs),Nr.subVectors(e.a,gs),Or.subVectors(e.b,gs),Fr.subVectors(e.c,gs),Hi.subVectors(Or,Nr),Gi.subVectors(Fr,Or),or.subVectors(Nr,Fr);let t=[0,-Hi.z,Hi.y,0,-Gi.z,Gi.y,0,-or.z,or.y,Hi.z,0,-Hi.x,Gi.z,0,-Gi.x,or.z,0,-or.x,-Hi.y,Hi.x,0,-Gi.y,Gi.x,0,-or.y,or.x,0];return!to(t,Nr,Or,Fr,fn)||(t=[1,0,0,0,1,0,0,0,1],!to(t,Nr,Or,Fr,fn))?!1:(gn.crossVectors(Hi,Gi),t=[gn.x,gn.y,gn.z],to(t,Nr,Or,Fr,fn))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ti).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ti).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Si[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Si[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Si[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Si[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Si[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Si[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Si[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Si[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Si),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Si=[new E,new E,new E,new E,new E,new E,new E,new E],ti=new E,mn=new xi,Nr=new E,Or=new E,Fr=new E,Hi=new E,Gi=new E,or=new E,gs=new E,fn=new E,gn=new E,lr=new E;function to(n,e,t,i,r){for(let s=0,a=n.length-3;s<=a;s+=3){lr.fromArray(n,s);const o=r.x*Math.abs(lr.x)+r.y*Math.abs(lr.y)+r.z*Math.abs(lr.z),l=e.dot(lr),c=t.dot(lr),h=i.dot(lr);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const dm=new xi,vs=new E,io=new E;class li{constructor(e=new E,t=-1){this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):dm.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;vs.subVectors(e,this.center);const t=vs.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(vs,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(io.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(vs.copy(e.center).add(io)),this.expandByPoint(vs.copy(e.center).sub(io))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const wi=new E,ro=new E,vn=new E,Vi=new E,so=new E,yn=new E,no=new E;class us{constructor(e=new E,t=new E(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,wi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=wi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(wi.copy(this.origin).addScaledVector(this.direction,t),wi.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){ro.copy(e).add(t).multiplyScalar(.5),vn.copy(t).sub(e).normalize(),Vi.copy(this.origin).sub(ro);const s=e.distanceTo(t)*.5,a=-this.direction.dot(vn),o=Vi.dot(this.direction),l=-Vi.dot(vn),c=Vi.lengthSq(),h=Math.abs(1-a*a);let d,u,p,f;if(h>0)if(d=a*l-o,u=a*o-l,f=s*h,d>=0)if(u>=-f)if(u<=f){const v=1/h;d*=v,u*=v,p=d*(d+a*u+2*o)+u*(a*d+u+2*l)+c}else u=s,d=Math.max(0,-(a*u+o)),p=-d*d+u*(u+2*l)+c;else u=-s,d=Math.max(0,-(a*u+o)),p=-d*d+u*(u+2*l)+c;else u<=-f?(d=Math.max(0,-(-a*s+o)),u=d>0?-s:Math.min(Math.max(-s,-l),s),p=-d*d+u*(u+2*l)+c):u<=f?(d=0,u=Math.min(Math.max(-s,-l),s),p=u*(u+2*l)+c):(d=Math.max(0,-(a*s+o)),u=d>0?s:Math.min(Math.max(-s,-l),s),p=-d*d+u*(u+2*l)+c);else u=a>0?-s:s,d=Math.max(0,-(a*u+o)),p=-d*d+u*(u+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(ro).addScaledVector(vn,u),p}intersectSphere(e,t){wi.subVectors(e.center,this.origin);const i=wi.dot(this.direction),r=wi.dot(wi)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(i=(e.min.x-u.x)*c,r=(e.max.x-u.x)*c):(i=(e.max.x-u.x)*c,r=(e.min.x-u.x)*c),h>=0?(s=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(s=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),d>=0?(o=(e.min.z-u.z)*d,l=(e.max.z-u.z)*d):(o=(e.max.z-u.z)*d,l=(e.min.z-u.z)*d),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,wi)!==null}intersectTriangle(e,t,i,r,s){so.subVectors(t,e),yn.subVectors(i,e),no.crossVectors(so,yn);let a=this.direction.dot(no),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Vi.subVectors(this.origin,e);const l=o*this.direction.dot(yn.crossVectors(Vi,yn));if(l<0)return null;const c=o*this.direction.dot(so.cross(Vi));if(c<0||l+c>a)return null;const h=-o*Vi.dot(no);return h<0?null:this.at(h/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Fe{constructor(e,t,i,r,s,a,o,l,c,h,d,u,p,f,v,g){Fe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,l,c,h,d,u,p,f,v,g)}set(e,t,i,r,s,a,o,l,c,h,d,u,p,f,v,g){const m=this.elements;return m[0]=e,m[4]=t,m[8]=i,m[12]=r,m[1]=s,m[5]=a,m[9]=o,m[13]=l,m[2]=c,m[6]=h,m[10]=d,m[14]=u,m[3]=p,m[7]=f,m[11]=v,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Fe().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/zr.setFromMatrixColumn(e,0).length(),s=1/zr.setFromMatrixColumn(e,1).length(),a=1/zr.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),c=Math.sin(r),h=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){const u=a*h,p=a*d,f=o*h,v=o*d;t[0]=l*h,t[4]=-l*d,t[8]=c,t[1]=p+f*c,t[5]=u-v*c,t[9]=-o*l,t[2]=v-u*c,t[6]=f+p*c,t[10]=a*l}else if(e.order==="YXZ"){const u=l*h,p=l*d,f=c*h,v=c*d;t[0]=u+v*o,t[4]=f*o-p,t[8]=a*c,t[1]=a*d,t[5]=a*h,t[9]=-o,t[2]=p*o-f,t[6]=v+u*o,t[10]=a*l}else if(e.order==="ZXY"){const u=l*h,p=l*d,f=c*h,v=c*d;t[0]=u-v*o,t[4]=-a*d,t[8]=f+p*o,t[1]=p+f*o,t[5]=a*h,t[9]=v-u*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const u=a*h,p=a*d,f=o*h,v=o*d;t[0]=l*h,t[4]=f*c-p,t[8]=u*c+v,t[1]=l*d,t[5]=v*c+u,t[9]=p*c-f,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const u=a*l,p=a*c,f=o*l,v=o*c;t[0]=l*h,t[4]=v-u*d,t[8]=f*d+p,t[1]=d,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=p*d+f,t[10]=u-v*d}else if(e.order==="XZY"){const u=a*l,p=a*c,f=o*l,v=o*c;t[0]=l*h,t[4]=-d,t[8]=c*h,t[1]=u*d+v,t[5]=a*h,t[9]=p*d-f,t[2]=f*d-p,t[6]=o*h,t[10]=v*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(pm,e,mm)}lookAt(e,t,i){const r=this.elements;return qt.subVectors(e,t),qt.lengthSq()===0&&(qt.z=1),qt.normalize(),Wi.crossVectors(i,qt),Wi.lengthSq()===0&&(Math.abs(i.z)===1?qt.x+=1e-4:qt.z+=1e-4,qt.normalize(),Wi.crossVectors(i,qt)),Wi.normalize(),_n.crossVectors(qt,Wi),r[0]=Wi.x,r[4]=_n.x,r[8]=qt.x,r[1]=Wi.y,r[5]=_n.y,r[9]=qt.y,r[2]=Wi.z,r[6]=_n.z,r[10]=qt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],d=i[5],u=i[9],p=i[13],f=i[2],v=i[6],g=i[10],m=i[14],_=i[3],y=i[7],x=i[11],w=i[15],A=r[0],C=r[4],P=r[8],M=r[12],T=r[1],F=r[5],G=r[9],Z=r[13],D=r[2],B=r[6],Y=r[10],W=r[14],te=r[3],J=r[7],K=r[11],U=r[15];return s[0]=a*A+o*T+l*D+c*te,s[4]=a*C+o*F+l*B+c*J,s[8]=a*P+o*G+l*Y+c*K,s[12]=a*M+o*Z+l*W+c*U,s[1]=h*A+d*T+u*D+p*te,s[5]=h*C+d*F+u*B+p*J,s[9]=h*P+d*G+u*Y+p*K,s[13]=h*M+d*Z+u*W+p*U,s[2]=f*A+v*T+g*D+m*te,s[6]=f*C+v*F+g*B+m*J,s[10]=f*P+v*G+g*Y+m*K,s[14]=f*M+v*Z+g*W+m*U,s[3]=_*A+y*T+x*D+w*te,s[7]=_*C+y*F+x*B+w*J,s[11]=_*P+y*G+x*Y+w*K,s[15]=_*M+y*Z+x*W+w*U,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],d=e[6],u=e[10],p=e[14],f=e[3],v=e[7],g=e[11],m=e[15];return f*(+s*l*d-r*c*d-s*o*u+i*c*u+r*o*p-i*l*p)+v*(+t*l*p-t*c*u+s*a*u-r*a*p+r*c*h-s*l*h)+g*(+t*c*d-t*o*p-s*a*d+i*a*p+s*o*h-i*c*h)+m*(-r*o*h-t*l*d+t*o*u+r*a*d-i*a*u+i*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],d=e[9],u=e[10],p=e[11],f=e[12],v=e[13],g=e[14],m=e[15],_=d*g*c-v*u*c+v*l*p-o*g*p-d*l*m+o*u*m,y=f*u*c-h*g*c-f*l*p+a*g*p+h*l*m-a*u*m,x=h*v*c-f*d*c+f*o*p-a*v*p-h*o*m+a*d*m,w=f*d*l-h*v*l-f*o*u+a*v*u+h*o*g-a*d*g,A=t*_+i*y+r*x+s*w;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/A;return e[0]=_*C,e[1]=(v*u*s-d*g*s-v*r*p+i*g*p+d*r*m-i*u*m)*C,e[2]=(o*g*s-v*l*s+v*r*c-i*g*c-o*r*m+i*l*m)*C,e[3]=(d*l*s-o*u*s-d*r*c+i*u*c+o*r*p-i*l*p)*C,e[4]=y*C,e[5]=(h*g*s-f*u*s+f*r*p-t*g*p-h*r*m+t*u*m)*C,e[6]=(f*l*s-a*g*s-f*r*c+t*g*c+a*r*m-t*l*m)*C,e[7]=(a*u*s-h*l*s+h*r*c-t*u*c-a*r*p+t*l*p)*C,e[8]=x*C,e[9]=(f*d*s-h*v*s-f*i*p+t*v*p+h*i*m-t*d*m)*C,e[10]=(a*v*s-f*o*s+f*i*c-t*v*c-a*i*m+t*o*m)*C,e[11]=(h*o*s-a*d*s-h*i*c+t*d*c+a*i*p-t*o*p)*C,e[12]=w*C,e[13]=(h*v*r-f*d*r+f*i*u-t*v*u-h*i*g+t*d*g)*C,e[14]=(f*o*r-a*v*r-f*i*l+t*v*l+a*i*g-t*o*g)*C,e[15]=(a*d*r-h*o*r+h*i*l-t*d*l-a*i*u+t*o*u)*C,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,a=e.x,o=e.y,l=e.z,c=s*a,h=s*o;return this.set(c*a+i,c*o-r*l,c*l+r*o,0,c*o+r*l,h*o+i,h*l-r*a,0,c*l-r*o,h*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,h=a+a,d=o+o,u=s*c,p=s*h,f=s*d,v=a*h,g=a*d,m=o*d,_=l*c,y=l*h,x=l*d,w=i.x,A=i.y,C=i.z;return r[0]=(1-(v+m))*w,r[1]=(p+x)*w,r[2]=(f-y)*w,r[3]=0,r[4]=(p-x)*A,r[5]=(1-(u+m))*A,r[6]=(g+_)*A,r[7]=0,r[8]=(f+y)*C,r[9]=(g-_)*C,r[10]=(1-(u+v))*C,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=zr.set(r[0],r[1],r[2]).length();const a=zr.set(r[4],r[5],r[6]).length(),o=zr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],ii.copy(this);const l=1/s,c=1/a,h=1/o;return ii.elements[0]*=l,ii.elements[1]*=l,ii.elements[2]*=l,ii.elements[4]*=c,ii.elements[5]*=c,ii.elements[6]*=c,ii.elements[8]*=h,ii.elements[9]*=h,ii.elements[10]*=h,t.setFromRotationMatrix(ii),i.x=s,i.y=a,i.z=o,this}makePerspective(e,t,i,r,s,a,o=fi){const l=this.elements,c=2*s/(t-e),h=2*s/(i-r),d=(t+e)/(t-e),u=(i+r)/(i-r);let p,f;if(o===fi)p=-(a+s)/(a-s),f=-2*a*s/(a-s);else if(o===Xs)p=-a/(a-s),f=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=d,l[12]=0,l[1]=0,l[5]=h,l[9]=u,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=f,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,a,o=fi){const l=this.elements,c=1/(t-e),h=1/(i-r),d=1/(a-s),u=(t+e)*c,p=(i+r)*h;let f,v;if(o===fi)f=(a+s)*d,v=-2*d;else if(o===Xs)f=s*d,v=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-u,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=v,l[14]=-f,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const zr=new E,ii=new Fe,pm=new E(0,0,0),mm=new E(1,1,1),Wi=new E,_n=new E,qt=new E,fc=new Fe,gc=new Vt;class sn{constructor(e=0,t=0,i=0,r=sn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],h=r[9],d=r[2],u=r[6],p=r[10];switch(t){case"XYZ":this._y=Math.asin(ht(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ht(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(ht(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-ht(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ht(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-ht(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return fc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(fc,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return gc.setFromEuler(this),this.setFromQuaternion(gc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}sn.DEFAULT_ORDER="XYZ";class ba{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let fm=0;const vc=new E,Br=new Vt,Ei=new Fe,xn=new E,ys=new E,gm=new E,vm=new Vt,yc=new E(1,0,0),_c=new E(0,1,0),xc=new E(0,0,1),ym={type:"added"},_m={type:"removed"};class Ke extends ki{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:fm++}),this.uuid=Kt(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ke.DEFAULT_UP.clone();const e=new E,t=new sn,i=new Vt,r=new E(1,1,1);function s(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Fe},normalMatrix:{value:new Ge}}),this.matrix=new Fe,this.matrixWorld=new Fe,this.matrixAutoUpdate=Ke.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.matrixWorldAutoUpdate=Ke.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.layers=new ba,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Br.setFromAxisAngle(e,t),this.quaternion.multiply(Br),this}rotateOnWorldAxis(e,t){return Br.setFromAxisAngle(e,t),this.quaternion.premultiply(Br),this}rotateX(e){return this.rotateOnAxis(yc,e)}rotateY(e){return this.rotateOnAxis(_c,e)}rotateZ(e){return this.rotateOnAxis(xc,e)}translateOnAxis(e,t){return vc.copy(e).applyQuaternion(this.quaternion),this.position.add(vc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(yc,e)}translateY(e){return this.translateOnAxis(_c,e)}translateZ(e){return this.translateOnAxis(xc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ei.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?xn.copy(e):xn.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),ys.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ei.lookAt(ys,xn,this.up):Ei.lookAt(xn,ys,this.up),this.quaternion.setFromRotationMatrix(Ei),r&&(Ei.extractRotation(r.matrixWorld),Br.setFromRotationMatrix(Ei),this.quaternion.premultiply(Br.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(ym)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(_m)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ei.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ei.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ei),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const s=this.children[i].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t){let i=[];this[e]===t&&i.push(this);for(let r=0,s=this.children.length;r<s;r++){const a=this.children[r].getObjectsByProperty(e,t);a.length>0&&(i=i.concat(a))}return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ys,e,gm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ys,vm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++){const s=t[i];(s.matrixWorldAutoUpdate===!0||e===!0)&&s.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++){const o=r[s];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const d=l[c];s(e.shapes,d)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),d=a(e.shapes),u=a(e.skeletons),p=a(e.animations),f=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),d.length>0&&(i.shapes=d),u.length>0&&(i.skeletons=u),p.length>0&&(i.animations=p),f.length>0&&(i.nodes=f)}return i.object=r,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Ke.DEFAULT_UP=new E(0,1,0);Ke.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ke.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const ri=new E,Ti=new E,ao=new E,Ai=new E,kr=new E,Hr=new E,Mc=new E,oo=new E,lo=new E,co=new E;let Mn=!1;class Ht{constructor(e=new E,t=new E,i=new E){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),ri.subVectors(e,t),r.cross(ri);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){ri.subVectors(r,t),Ti.subVectors(i,t),ao.subVectors(e,t);const a=ri.dot(ri),o=ri.dot(Ti),l=ri.dot(ao),c=Ti.dot(Ti),h=Ti.dot(ao),d=a*c-o*o;if(d===0)return s.set(-2,-1,-1);const u=1/d,p=(c*l-o*h)*u,f=(a*h-o*l)*u;return s.set(1-p-f,f,p)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Ai),Ai.x>=0&&Ai.y>=0&&Ai.x+Ai.y<=1}static getUV(e,t,i,r,s,a,o,l){return Mn===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Mn=!0),this.getInterpolation(e,t,i,r,s,a,o,l)}static getInterpolation(e,t,i,r,s,a,o,l){return this.getBarycoord(e,t,i,r,Ai),l.setScalar(0),l.addScaledVector(s,Ai.x),l.addScaledVector(a,Ai.y),l.addScaledVector(o,Ai.z),l}static isFrontFacing(e,t,i,r){return ri.subVectors(i,t),Ti.subVectors(e,t),ri.cross(Ti).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ri.subVectors(this.c,this.b),Ti.subVectors(this.a,this.b),ri.cross(Ti).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Ht.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Ht.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,i,r,s){return Mn===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Mn=!0),Ht.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}getInterpolation(e,t,i,r,s){return Ht.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return Ht.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Ht.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let a,o;kr.subVectors(r,i),Hr.subVectors(s,i),oo.subVectors(e,i);const l=kr.dot(oo),c=Hr.dot(oo);if(l<=0&&c<=0)return t.copy(i);lo.subVectors(e,r);const h=kr.dot(lo),d=Hr.dot(lo);if(h>=0&&d<=h)return t.copy(r);const u=l*d-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(i).addScaledVector(kr,a);co.subVectors(e,s);const p=kr.dot(co),f=Hr.dot(co);if(f>=0&&p<=f)return t.copy(s);const v=p*c-l*f;if(v<=0&&c>=0&&f<=0)return o=c/(c-f),t.copy(i).addScaledVector(Hr,o);const g=h*f-p*d;if(g<=0&&d-h>=0&&p-f>=0)return Mc.subVectors(s,r),o=(d-h)/(d-h+(p-f)),t.copy(r).addScaledVector(Mc,o);const m=1/(g+v+u);return a=v*m,o=u*m,t.copy(i).addScaledVector(kr,a).addScaledVector(Hr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const qu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Xi={h:0,s:0,l:0},bn={h:0,s:0,l:0};function ho(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}let oe=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Mt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Qe.toWorkingColorSpace(this,t),this}setRGB(e,t,i,r=Qe.workingColorSpace){return this.r=e,this.g=t,this.b=i,Qe.toWorkingColorSpace(this,r),this}setHSL(e,t,i,r=Qe.workingColorSpace){if(e=Pl(e,1),t=ht(t,0,1),i=ht(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,a=2*i-s;this.r=ho(a,s,e+1/3),this.g=ho(a,s,e),this.b=ho(a,s,e-1/3)}return Qe.toWorkingColorSpace(this,r),this}setStyle(e,t=Mt){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Mt){const i=qu[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ss(e.r),this.g=ss(e.g),this.b=ss(e.b),this}copyLinearToSRGB(e){return this.r=$a(e.r),this.g=$a(e.g),this.b=$a(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Mt){return Qe.fromWorkingColorSpace(Lt.copy(this),e),Math.round(ht(Lt.r*255,0,255))*65536+Math.round(ht(Lt.g*255,0,255))*256+Math.round(ht(Lt.b*255,0,255))}getHexString(e=Mt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Qe.workingColorSpace){Qe.fromWorkingColorSpace(Lt.copy(this),t);const i=Lt.r,r=Lt.g,s=Lt.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const d=a-o;switch(c=h<=.5?d/(a+o):d/(2-a-o),a){case i:l=(r-s)/d+(r<s?6:0);break;case r:l=(s-i)/d+2;break;case s:l=(i-r)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=Qe.workingColorSpace){return Qe.fromWorkingColorSpace(Lt.copy(this),t),e.r=Lt.r,e.g=Lt.g,e.b=Lt.b,e}getStyle(e=Mt){Qe.fromWorkingColorSpace(Lt.copy(this),e);const t=Lt.r,i=Lt.g,r=Lt.b;return e!==Mt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Xi),this.setHSL(Xi.h+e,Xi.s+t,Xi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Xi),e.getHSL(bn);const i=Cs(Xi.h,bn.h,t),r=Cs(Xi.s,bn.s,t),s=Cs(Xi.l,bn.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}};const Lt=new oe;oe.NAMES=qu;let xm=0;class Ut extends ki{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:xm++}),this.uuid=Kt(),this.name="",this.type="Material",this.blending=Sr,this.side=Ni,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ha,this.blendDst=ua,this.blendEquation=Zi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new oe(0,0,0),this.blendAlpha=0,this.depthFunc=Ds,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=hl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=gr,this.stencilZFail=gr,this.stencilZPass=gr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Sr&&(i.blending=this.blending),this.side!==Ni&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ha&&(i.blendSrc=this.blendSrc),this.blendDst!==ua&&(i.blendDst=this.blendDst),this.blendEquation!==Zi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ds&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==hl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==gr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==gr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==gr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class At extends Ut{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new oe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=tn,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ci=Mm();function Mm(){const n=new ArrayBuffer(4),e=new Float32Array(n),t=new Uint32Array(n),i=new Uint32Array(512),r=new Uint32Array(512);for(let l=0;l<256;++l){const c=l-127;c<-27?(i[l]=0,i[l|256]=32768,r[l]=24,r[l|256]=24):c<-14?(i[l]=1024>>-c-14,i[l|256]=1024>>-c-14|32768,r[l]=-c-1,r[l|256]=-c-1):c<=15?(i[l]=c+15<<10,i[l|256]=c+15<<10|32768,r[l]=13,r[l|256]=13):c<128?(i[l]=31744,i[l|256]=64512,r[l]=24,r[l|256]=24):(i[l]=31744,i[l|256]=64512,r[l]=13,r[l|256]=13)}const s=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(c&8388608)===0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,s[l]=c|h}for(let l=1024;l<2048;++l)s[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(o[l]=1024);return{floatView:e,uint32View:t,baseTable:i,shiftTable:r,mantissaTable:s,exponentTable:a,offsetTable:o}}function kt(n){Math.abs(n)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),n=ht(n,-65504,65504),Ci.floatView[0]=n;const e=Ci.uint32View[0],t=e>>23&511;return Ci.baseTable[t]+((e&8388607)>>Ci.shiftTable[t])}function Ts(n){const e=n>>10;return Ci.uint32View[0]=Ci.mantissaTable[Ci.offsetTable[e]+(n&1023)]+Ci.exponentTable[e],Ci.floatView[0]}const bm={toHalfFloat:kt,fromHalfFloat:Ts},vt=new E,Sn=new q;class Pe{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Ws,this.updateRange={offset:0,count:-1},this.gpuType=mi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Sn.fromBufferAttribute(this,t),Sn.applyMatrix3(e),this.setXY(t,Sn.x,Sn.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)vt.fromBufferAttribute(this,t),vt.applyMatrix3(e),this.setXYZ(t,vt.x,vt.y,vt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)vt.fromBufferAttribute(this,t),vt.applyMatrix4(e),this.setXYZ(t,vt.x,vt.y,vt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)vt.fromBufferAttribute(this,t),vt.applyNormalMatrix(e),this.setXYZ(t,vt.x,vt.y,vt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)vt.fromBufferAttribute(this,t),vt.transformDirection(e),this.setXYZ(t,vt.x,vt.y,vt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Gt(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=ke(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Gt(t,this.array)),t}setX(e,t){return this.normalized&&(t=ke(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Gt(t,this.array)),t}setY(e,t){return this.normalized&&(t=ke(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Gt(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ke(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Gt(t,this.array)),t}setW(e,t){return this.normalized&&(t=ke(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=ke(t,this.array),i=ke(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=ke(t,this.array),i=ke(i,this.array),r=ke(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=ke(t,this.array),i=ke(i,this.array),r=ke(r,this.array),s=ke(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Ws&&(e.usage=this.usage),(this.updateRange.offset!==0||this.updateRange.count!==-1)&&(e.updateRange=this.updateRange),e}}class Sm extends Pe{constructor(e,t,i){super(new Int8Array(e),t,i)}}class wm extends Pe{constructor(e,t,i){super(new Uint8Array(e),t,i)}}class Em extends Pe{constructor(e,t,i){super(new Uint8ClampedArray(e),t,i)}}class Tm extends Pe{constructor(e,t,i){super(new Int16Array(e),t,i)}}class Ul extends Pe{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Am extends Pe{constructor(e,t,i){super(new Int32Array(e),t,i)}}class Nl extends Pe{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Rm extends Pe{constructor(e,t,i){super(new Uint16Array(e),t,i),this.isFloat16BufferAttribute=!0}getX(e){let t=Ts(this.array[e*this.itemSize]);return this.normalized&&(t=Gt(t,this.array)),t}setX(e,t){return this.normalized&&(t=ke(t,this.array)),this.array[e*this.itemSize]=kt(t),this}getY(e){let t=Ts(this.array[e*this.itemSize+1]);return this.normalized&&(t=Gt(t,this.array)),t}setY(e,t){return this.normalized&&(t=ke(t,this.array)),this.array[e*this.itemSize+1]=kt(t),this}getZ(e){let t=Ts(this.array[e*this.itemSize+2]);return this.normalized&&(t=Gt(t,this.array)),t}setZ(e,t){return this.normalized&&(t=ke(t,this.array)),this.array[e*this.itemSize+2]=kt(t),this}getW(e){let t=Ts(this.array[e*this.itemSize+3]);return this.normalized&&(t=Gt(t,this.array)),t}setW(e,t){return this.normalized&&(t=ke(t,this.array)),this.array[e*this.itemSize+3]=kt(t),this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=ke(t,this.array),i=ke(i,this.array)),this.array[e+0]=kt(t),this.array[e+1]=kt(i),this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=ke(t,this.array),i=ke(i,this.array),r=ke(r,this.array)),this.array[e+0]=kt(t),this.array[e+1]=kt(i),this.array[e+2]=kt(r),this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=ke(t,this.array),i=ke(i,this.array),r=ke(r,this.array),s=ke(s,this.array)),this.array[e+0]=kt(t),this.array[e+1]=kt(i),this.array[e+2]=kt(r),this.array[e+3]=kt(s),this}}class fe extends Pe{constructor(e,t,i){super(new Float32Array(e),t,i)}}class Cm extends Pe{constructor(e,t,i){super(new Float64Array(e),t,i)}}let Lm=0;const ei=new Fe,uo=new Ke,Gr=new E,Yt=new xi,_s=new xi,wt=new E;class Re extends ki{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Lm++}),this.uuid=Kt(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Wu(e)?Nl:Ul)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Ge().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return ei.makeRotationFromQuaternion(e),this.applyMatrix4(ei),this}rotateX(e){return ei.makeRotationX(e),this.applyMatrix4(ei),this}rotateY(e){return ei.makeRotationY(e),this.applyMatrix4(ei),this}rotateZ(e){return ei.makeRotationZ(e),this.applyMatrix4(ei),this}translate(e,t,i){return ei.makeTranslation(e,t,i),this.applyMatrix4(ei),this}scale(e,t,i){return ei.makeScale(e,t,i),this.applyMatrix4(ei),this}lookAt(e){return uo.lookAt(e),uo.updateMatrix(),this.applyMatrix4(uo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Gr).negate(),this.translate(Gr.x,Gr.y,Gr.z),this}setFromPoints(e){const t=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new fe(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new xi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new E(-1/0,-1/0,-1/0),new E(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];Yt.setFromBufferAttribute(s),this.morphTargetsRelative?(wt.addVectors(this.boundingBox.min,Yt.min),this.boundingBox.expandByPoint(wt),wt.addVectors(this.boundingBox.max,Yt.max),this.boundingBox.expandByPoint(wt)):(this.boundingBox.expandByPoint(Yt.min),this.boundingBox.expandByPoint(Yt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new li);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new E,1/0);return}if(e){const i=this.boundingSphere.center;if(Yt.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];_s.setFromBufferAttribute(o),this.morphTargetsRelative?(wt.addVectors(Yt.min,_s.min),Yt.expandByPoint(wt),wt.addVectors(Yt.max,_s.max),Yt.expandByPoint(wt)):(Yt.expandByPoint(_s.min),Yt.expandByPoint(_s.max))}Yt.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)wt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(wt));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)wt.fromBufferAttribute(o,c),l&&(Gr.fromBufferAttribute(e,c),wt.add(Gr)),r=Math.max(r,i.distanceToSquared(wt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.array,r=t.position.array,s=t.normal.array,a=t.uv.array,o=r.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Pe(new Float32Array(4*o),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let T=0;T<o;T++)c[T]=new E,h[T]=new E;const d=new E,u=new E,p=new E,f=new q,v=new q,g=new q,m=new E,_=new E;function y(T,F,G){d.fromArray(r,T*3),u.fromArray(r,F*3),p.fromArray(r,G*3),f.fromArray(a,T*2),v.fromArray(a,F*2),g.fromArray(a,G*2),u.sub(d),p.sub(d),v.sub(f),g.sub(f);const Z=1/(v.x*g.y-g.x*v.y);isFinite(Z)&&(m.copy(u).multiplyScalar(g.y).addScaledVector(p,-v.y).multiplyScalar(Z),_.copy(p).multiplyScalar(v.x).addScaledVector(u,-g.x).multiplyScalar(Z),c[T].add(m),c[F].add(m),c[G].add(m),h[T].add(_),h[F].add(_),h[G].add(_))}let x=this.groups;x.length===0&&(x=[{start:0,count:i.length}]);for(let T=0,F=x.length;T<F;++T){const G=x[T],Z=G.start,D=G.count;for(let B=Z,Y=Z+D;B<Y;B+=3)y(i[B+0],i[B+1],i[B+2])}const w=new E,A=new E,C=new E,P=new E;function M(T){C.fromArray(s,T*3),P.copy(C);const F=c[T];w.copy(F),w.sub(C.multiplyScalar(C.dot(F))).normalize(),A.crossVectors(P,F);const G=A.dot(h[T])<0?-1:1;l[T*4]=w.x,l[T*4+1]=w.y,l[T*4+2]=w.z,l[T*4+3]=G}for(let T=0,F=x.length;T<F;++T){const G=x[T],Z=G.start,D=G.count;for(let B=Z,Y=Z+D;B<Y;B+=3)M(i[B+0]),M(i[B+1]),M(i[B+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Pe(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let u=0,p=i.count;u<p;u++)i.setXYZ(u,0,0,0);const r=new E,s=new E,a=new E,o=new E,l=new E,c=new E,h=new E,d=new E;if(e)for(let u=0,p=e.count;u<p;u+=3){const f=e.getX(u+0),v=e.getX(u+1),g=e.getX(u+2);r.fromBufferAttribute(t,f),s.fromBufferAttribute(t,v),a.fromBufferAttribute(t,g),h.subVectors(a,s),d.subVectors(r,s),h.cross(d),o.fromBufferAttribute(i,f),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,g),o.add(h),l.add(h),c.add(h),i.setXYZ(f,o.x,o.y,o.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let u=0,p=t.count;u<p;u+=3)r.fromBufferAttribute(t,u+0),s.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,s),d.subVectors(r,s),h.cross(d),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)wt.fromBufferAttribute(e,t),wt.normalize(),e.setXYZ(t,wt.x,wt.y,wt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,d=o.normalized,u=new c.constructor(l.length*h);let p=0,f=0;for(let v=0,g=l.length;v<g;v++){o.isInterleavedBufferAttribute?p=l[v]*o.data.stride+o.offset:p=l[v]*h;for(let m=0;m<h;m++)u[f++]=c[p++]}return new Pe(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Re,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,i);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let h=0,d=c.length;h<d;h++){const u=c[h],p=e(u,i);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){const p=c[d];h.push(p.toJSON(e.data))}h.length>0&&(r[l]=h,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const r=e.attributes;for(const c in r){const h=r[c];this.setAttribute(c,h.clone(t))}const s=e.morphAttributes;for(const c in s){const h=[],d=s[c];for(let u=0,p=d.length;u<p;u++)h.push(d[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const d=a[c];this.addGroup(d.start,d.count,d.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const bc=new Fe,cr=new us,wn=new li,Sc=new E,Vr=new E,Wr=new E,Xr=new E,po=new E,En=new E,Tn=new q,An=new q,Rn=new q,wc=new E,Ec=new E,Tc=new E,Cn=new E,Ln=new E;class at extends Ke{constructor(e=new Re,t=new At){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){const i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=i.length;r<s;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){En.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=o[l],d=s[l];h!==0&&(po.fromBufferAttribute(d,e),a?En.addScaledVector(po,h):En.addScaledVector(po.sub(t),h))}t.add(En)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),wn.copy(i.boundingSphere),wn.applyMatrix4(s),cr.copy(e.ray).recast(e.near),!(wn.containsPoint(cr.origin)===!1&&(cr.intersectSphere(wn,Sc)===null||cr.origin.distanceToSquared(Sc)>Ja(e.far-e.near,2)))&&(bc.copy(s).invert(),cr.copy(e.ray).applyMatrix4(bc),!(i.boundingBox!==null&&cr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,cr)))}_computeIntersections(e,t,i){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,d=s.attributes.normal,u=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let f=0,v=u.length;f<v;f++){const g=u[f],m=a[g.materialIndex],_=Math.max(g.start,p.start),y=Math.min(o.count,Math.min(g.start+g.count,p.start+p.count));for(let x=_,w=y;x<w;x+=3){const A=o.getX(x),C=o.getX(x+1),P=o.getX(x+2);r=Pn(this,m,e,i,c,h,d,A,C,P),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=g.materialIndex,t.push(r))}}else{const f=Math.max(0,p.start),v=Math.min(o.count,p.start+p.count);for(let g=f,m=v;g<m;g+=3){const _=o.getX(g),y=o.getX(g+1),x=o.getX(g+2);r=Pn(this,a,e,i,c,h,d,_,y,x),r&&(r.faceIndex=Math.floor(g/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let f=0,v=u.length;f<v;f++){const g=u[f],m=a[g.materialIndex],_=Math.max(g.start,p.start),y=Math.min(l.count,Math.min(g.start+g.count,p.start+p.count));for(let x=_,w=y;x<w;x+=3){const A=x,C=x+1,P=x+2;r=Pn(this,m,e,i,c,h,d,A,C,P),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=g.materialIndex,t.push(r))}}else{const f=Math.max(0,p.start),v=Math.min(l.count,p.start+p.count);for(let g=f,m=v;g<m;g+=3){const _=g,y=g+1,x=g+2;r=Pn(this,a,e,i,c,h,d,_,y,x),r&&(r.faceIndex=Math.floor(g/3),t.push(r))}}}}function Pm(n,e,t,i,r,s,a,o){let l;if(e.side===Bt?l=i.intersectTriangle(a,s,r,!0,o):l=i.intersectTriangle(r,s,a,e.side===Ni,o),l===null)return null;Ln.copy(o),Ln.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Ln);return c<t.near||c>t.far?null:{distance:c,point:Ln.clone(),object:n}}function Pn(n,e,t,i,r,s,a,o,l,c){n.getVertexPosition(o,Vr),n.getVertexPosition(l,Wr),n.getVertexPosition(c,Xr);const h=Pm(n,e,t,i,Vr,Wr,Xr,Cn);if(h){r&&(Tn.fromBufferAttribute(r,o),An.fromBufferAttribute(r,l),Rn.fromBufferAttribute(r,c),h.uv=Ht.getInterpolation(Cn,Vr,Wr,Xr,Tn,An,Rn,new q)),s&&(Tn.fromBufferAttribute(s,o),An.fromBufferAttribute(s,l),Rn.fromBufferAttribute(s,c),h.uv1=Ht.getInterpolation(Cn,Vr,Wr,Xr,Tn,An,Rn,new q),h.uv2=h.uv1),a&&(wc.fromBufferAttribute(a,o),Ec.fromBufferAttribute(a,l),Tc.fromBufferAttribute(a,c),h.normal=Ht.getInterpolation(Cn,Vr,Wr,Xr,wc,Ec,Tc,new E),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new E,materialIndex:0};Ht.getNormal(Vr,Wr,Xr,d.normal),h.face=d}return h}class Lr extends Re{constructor(e=1,t=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],h=[],d=[];let u=0,p=0;f("z","y","x",-1,-1,i,t,e,a,s,0),f("z","y","x",1,-1,i,t,-e,a,s,1),f("x","z","y",1,1,e,i,t,r,a,2),f("x","z","y",1,-1,e,i,-t,r,a,3),f("x","y","z",1,-1,e,t,i,r,s,4),f("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new fe(c,3)),this.setAttribute("normal",new fe(h,3)),this.setAttribute("uv",new fe(d,2));function f(v,g,m,_,y,x,w,A,C,P,M){const T=x/C,F=w/P,G=x/2,Z=w/2,D=A/2,B=C+1,Y=P+1;let W=0,te=0;const J=new E;for(let K=0;K<Y;K++){const U=K*F-Z;for(let V=0;V<B;V++){const le=V*T-G;J[v]=le*_,J[g]=U*y,J[m]=D,c.push(J.x,J.y,J.z),J[v]=0,J[g]=0,J[m]=A>0?1:-1,h.push(J.x,J.y,J.z),d.push(V/C),d.push(1-K/P),W+=1}}for(let K=0;K<P;K++)for(let U=0;U<C;U++){const V=u+U+B*K,le=u+U+B*(K+1),ve=u+(U+1)+B*(K+1),we=u+(U+1)+B*K;l.push(V,le,we),l.push(le,ve,we),te+=6}o.addGroup(p,te,M),p+=te,u+=W}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Lr(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ls(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function zt(n){const e={};for(let t=0;t<n.length;t++){const i=ls(n[t]);for(const r in i)e[r]=i[r]}return e}function Im(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Yu(n){return n.getRenderTarget()===null?n.outputColorSpace:Qe.workingColorSpace}const Zu={clone:ls,merge:zt};var Dm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Um=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Dt extends Ut{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Dm,this.fragmentShader=Um,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ls(e.uniforms),this.uniformsGroups=Im(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const s=this.uniforms[r].value;s&&s.isTexture?t.uniforms[r]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[r]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[r]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[r]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[r]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[r]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[r]={type:"m4",value:s.toArray()}:t.uniforms[r]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Sa extends Ke{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Fe,this.projectionMatrix=new Fe,this.projectionMatrixInverse=new Fe,this.coordinateSystem=fi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class yt extends Sa{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=os*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(wr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return os*2*Math.atan(Math.tan(wr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,i,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(wr*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,t-=a.offsetY*i/c,r*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const jr=-90,qr=1;class Ju extends Ke{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new yt(jr,qr,e,t);r.layers=this.layers,this.add(r);const s=new yt(jr,qr,e,t);s.layers=this.layers,this.add(s);const a=new yt(jr,qr,e,t);a.layers=this.layers,this.add(a);const o=new yt(jr,qr,e,t);o.layers=this.layers,this.add(o);const l=new yt(jr,qr,e,t);l.layers=this.layers,this.add(l);const c=new yt(jr,qr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===fi)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Xs)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),f=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,a),e.setRenderTarget(i,2,r),e.render(t,o),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,c),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,r),e.render(t,h),e.setRenderTarget(d,u,p),e.xr.enabled=f,i.texture.needsPMREMUpdate=!0}}class nn extends mt{constructor(e,t,i,r,s,a,o,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:Oi,super(e,t,i,r,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Ku extends ai{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];t.encoding!==void 0&&(Ls("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===$i?Mt:Jt),this.texture=new nn(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:pt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Lr(5,5,5),s=new Dt({name:"CubemapFromEquirect",uniforms:ls(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Bt,blending:Ii});s.uniforms.tEquirect.value=t;const a=new at(r,s),o=t.minFilter;return t.minFilter===er&&(t.minFilter=pt),new Ju(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,i,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,r);e.setRenderTarget(s)}}const mo=new E,Nm=new E,Om=new Ge;class Yi{constructor(e=new E(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=mo.subVectors(i,t).cross(Nm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(mo),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Om.getNormalMatrix(e),r=this.coplanarPoint(mo).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const hr=new li,In=new E;class wa{constructor(e=new Yi,t=new Yi,i=new Yi,r=new Yi,s=new Yi,a=new Yi){this.planes=[e,t,i,r,s,a]}set(e,t,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=fi){const i=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],l=r[3],c=r[4],h=r[5],d=r[6],u=r[7],p=r[8],f=r[9],v=r[10],g=r[11],m=r[12],_=r[13],y=r[14],x=r[15];if(i[0].setComponents(l-s,u-c,g-p,x-m).normalize(),i[1].setComponents(l+s,u+c,g+p,x+m).normalize(),i[2].setComponents(l+a,u+h,g+f,x+_).normalize(),i[3].setComponents(l-a,u-h,g-f,x-_).normalize(),i[4].setComponents(l-o,u-d,g-v,x-y).normalize(),t===fi)i[5].setComponents(l+o,u+d,g+v,x+y).normalize();else if(t===Xs)i[5].setComponents(o,d,v,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),hr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),hr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(hr)}intersectsSprite(e){return hr.center.set(0,0,0),hr.radius=.7071067811865476,hr.applyMatrix4(e.matrixWorld),this.intersectsSphere(hr)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(In.x=r.normal.x>0?e.max.x:e.min.x,In.y=r.normal.y>0?e.max.y:e.min.y,In.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(In)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function $u(){let n=null,e=!1,t=null,i=null;function r(s,a){t(s,a),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function Fm(n,e){const t=e.isWebGL2,i=new WeakMap;function r(c,h){const d=c.array,u=c.usage,p=n.createBuffer();n.bindBuffer(h,p),n.bufferData(h,d,u),c.onUploadCallback();let f;if(d instanceof Float32Array)f=n.FLOAT;else if(d instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(t)f=n.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else f=n.UNSIGNED_SHORT;else if(d instanceof Int16Array)f=n.SHORT;else if(d instanceof Uint32Array)f=n.UNSIGNED_INT;else if(d instanceof Int32Array)f=n.INT;else if(d instanceof Int8Array)f=n.BYTE;else if(d instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:p,type:f,bytesPerElement:d.BYTES_PER_ELEMENT,version:c.version}}function s(c,h,d){const u=h.array,p=h.updateRange;n.bindBuffer(d,c),p.count===-1?n.bufferSubData(d,0,u):(t?n.bufferSubData(d,p.offset*u.BYTES_PER_ELEMENT,u,p.offset,p.count):n.bufferSubData(d,p.offset*u.BYTES_PER_ELEMENT,u.subarray(p.offset,p.offset+p.count)),p.count=-1),h.onUploadCallback()}function a(c){return c.isInterleavedBufferAttribute&&(c=c.data),i.get(c)}function o(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=i.get(c);h&&(n.deleteBuffer(h.buffer),i.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const u=i.get(c);(!u||u.version<c.version)&&i.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const d=i.get(c);d===void 0?i.set(c,r(c,h)):d.version<c.version&&(s(d.buffer,c,h),d.version=c.version)}return{get:a,remove:o,update:l}}class an extends Re{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(i),l=Math.floor(r),c=o+1,h=l+1,d=e/o,u=t/l,p=[],f=[],v=[],g=[];for(let m=0;m<h;m++){const _=m*u-a;for(let y=0;y<c;y++){const x=y*d-s;f.push(x,-_,0),v.push(0,0,1),g.push(y/o),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let _=0;_<o;_++){const y=_+c*m,x=_+c*(m+1),w=_+1+c*(m+1),A=_+1+c*m;p.push(y,x,A),p.push(x,w,A)}this.setIndex(p),this.setAttribute("position",new fe(f,3)),this.setAttribute("normal",new fe(v,3)),this.setAttribute("uv",new fe(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new an(e.width,e.height,e.widthSegments,e.heightSegments)}}var zm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Bm=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,km=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Hm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Gm=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Vm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Wm=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Xm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,jm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,qm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ym=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Zm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Jm=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Km=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,$m=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Qm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ef=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,tf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,rf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,sf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,nf=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,af=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,of=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_v0 0.339
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_v1 0.276
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_v4 0.046
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_v5 0.016
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_v6 0.0038
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,lf=`vec3 transformedNormal = objectNormal;
#ifdef USE_INSTANCING
	mat3 m = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );
	transformedNormal = m * transformedNormal;
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	vec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,cf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,hf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,uf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,df=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,pf="gl_FragColor = linearToOutputTexel( gl_FragColor );",mf=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,ff=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,gf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,vf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,yf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,_f=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,xf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Mf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,bf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Sf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,wf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ef=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Tf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Af=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Rf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Cf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Lf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Pf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,If=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Df=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Uf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Nf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	anisotropyV /= material.anisotropy;
	material.anisotropy = saturate( material.anisotropy );
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x - tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x + tbn[ 0 ] * anisotropyV.y;
#endif`,Of=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Ff=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,zf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Bf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,kf=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Hf=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Gf=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Vf=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,Wf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Xf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,jf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,qf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Yf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Zf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Jf=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Kf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,$f=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,Qf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,eg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,tg=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,ig=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,rg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,sg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,ng=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,ag=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,og=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,lg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,cg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,hg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ug=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,dg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,pg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,mg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,fg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,gg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,vg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,yg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,_g=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,xg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Mg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,bg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Sg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	uniform int boneTextureSize;
	mat4 getBoneMatrix( const in float i ) {
		float j = i * 4.0;
		float x = mod( j, float( boneTextureSize ) );
		float y = floor( j / float( boneTextureSize ) );
		float dx = 1.0 / float( boneTextureSize );
		float dy = 1.0 / float( boneTextureSize );
		y = dy * ( y + 0.5 );
		vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );
		vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );
		vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );
		vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );
		mat4 bone = mat4( v1, v2, v3, v4 );
		return bone;
	}
#endif`,wg=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Eg=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Tg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Ag=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Rg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Cg=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Lg=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Pg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Ig=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Dg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Ug=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Ng=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Og=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Fg=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,zg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Bg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Hg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Gg=`#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Vg=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,Wg=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Xg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,jg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,qg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Yg=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Zg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Jg=`#include <common>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Kg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,$g=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Qg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,e0=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,t0=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,i0=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,r0=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,s0=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,n0=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,a0=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,o0=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,l0=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,c0=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,h0=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,u0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,d0=`#include <common>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,p0=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,m0=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,f0=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Be={alphahash_fragment:zm,alphahash_pars_fragment:Bm,alphamap_fragment:km,alphamap_pars_fragment:Hm,alphatest_fragment:Gm,alphatest_pars_fragment:Vm,aomap_fragment:Wm,aomap_pars_fragment:Xm,begin_vertex:jm,beginnormal_vertex:qm,bsdfs:Ym,iridescence_fragment:Zm,bumpmap_pars_fragment:Jm,clipping_planes_fragment:Km,clipping_planes_pars_fragment:$m,clipping_planes_pars_vertex:Qm,clipping_planes_vertex:ef,color_fragment:tf,color_pars_fragment:rf,color_pars_vertex:sf,color_vertex:nf,common:af,cube_uv_reflection_fragment:of,defaultnormal_vertex:lf,displacementmap_pars_vertex:cf,displacementmap_vertex:hf,emissivemap_fragment:uf,emissivemap_pars_fragment:df,colorspace_fragment:pf,colorspace_pars_fragment:mf,envmap_fragment:ff,envmap_common_pars_fragment:gf,envmap_pars_fragment:vf,envmap_pars_vertex:yf,envmap_physical_pars_fragment:Lf,envmap_vertex:_f,fog_vertex:xf,fog_pars_vertex:Mf,fog_fragment:bf,fog_pars_fragment:Sf,gradientmap_pars_fragment:wf,lightmap_fragment:Ef,lightmap_pars_fragment:Tf,lights_lambert_fragment:Af,lights_lambert_pars_fragment:Rf,lights_pars_begin:Cf,lights_toon_fragment:Pf,lights_toon_pars_fragment:If,lights_phong_fragment:Df,lights_phong_pars_fragment:Uf,lights_physical_fragment:Nf,lights_physical_pars_fragment:Of,lights_fragment_begin:Ff,lights_fragment_maps:zf,lights_fragment_end:Bf,logdepthbuf_fragment:kf,logdepthbuf_pars_fragment:Hf,logdepthbuf_pars_vertex:Gf,logdepthbuf_vertex:Vf,map_fragment:Wf,map_pars_fragment:Xf,map_particle_fragment:jf,map_particle_pars_fragment:qf,metalnessmap_fragment:Yf,metalnessmap_pars_fragment:Zf,morphcolor_vertex:Jf,morphnormal_vertex:Kf,morphtarget_pars_vertex:$f,morphtarget_vertex:Qf,normal_fragment_begin:eg,normal_fragment_maps:tg,normal_pars_fragment:ig,normal_pars_vertex:rg,normal_vertex:sg,normalmap_pars_fragment:ng,clearcoat_normal_fragment_begin:ag,clearcoat_normal_fragment_maps:og,clearcoat_pars_fragment:lg,iridescence_pars_fragment:cg,opaque_fragment:hg,packing:ug,premultiplied_alpha_fragment:dg,project_vertex:pg,dithering_fragment:mg,dithering_pars_fragment:fg,roughnessmap_fragment:gg,roughnessmap_pars_fragment:vg,shadowmap_pars_fragment:yg,shadowmap_pars_vertex:_g,shadowmap_vertex:xg,shadowmask_pars_fragment:Mg,skinbase_vertex:bg,skinning_pars_vertex:Sg,skinning_vertex:wg,skinnormal_vertex:Eg,specularmap_fragment:Tg,specularmap_pars_fragment:Ag,tonemapping_fragment:Rg,tonemapping_pars_fragment:Cg,transmission_fragment:Lg,transmission_pars_fragment:Pg,uv_pars_fragment:Ig,uv_pars_vertex:Dg,uv_vertex:Ug,worldpos_vertex:Ng,background_vert:Og,background_frag:Fg,backgroundCube_vert:zg,backgroundCube_frag:Bg,cube_vert:kg,cube_frag:Hg,depth_vert:Gg,depth_frag:Vg,distanceRGBA_vert:Wg,distanceRGBA_frag:Xg,equirect_vert:jg,equirect_frag:qg,linedashed_vert:Yg,linedashed_frag:Zg,meshbasic_vert:Jg,meshbasic_frag:Kg,meshlambert_vert:$g,meshlambert_frag:Qg,meshmatcap_vert:e0,meshmatcap_frag:t0,meshnormal_vert:i0,meshnormal_frag:r0,meshphong_vert:s0,meshphong_frag:n0,meshphysical_vert:a0,meshphysical_frag:o0,meshtoon_vert:l0,meshtoon_frag:c0,points_vert:h0,points_frag:u0,shadow_vert:d0,shadow_frag:p0,sprite_vert:m0,sprite_frag:f0},de={common:{diffuse:{value:new oe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ge}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ge}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ge}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ge},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ge},normalScale:{value:new q(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ge},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ge}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ge}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ge}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new oe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new oe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0},uvTransform:{value:new Ge}},sprite:{diffuse:{value:new oe(16777215)},opacity:{value:1},center:{value:new q(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}}},ni={basic:{uniforms:zt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:Be.meshbasic_vert,fragmentShader:Be.meshbasic_frag},lambert:{uniforms:zt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new oe(0)}}]),vertexShader:Be.meshlambert_vert,fragmentShader:Be.meshlambert_frag},phong:{uniforms:zt([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new oe(0)},specular:{value:new oe(1118481)},shininess:{value:30}}]),vertexShader:Be.meshphong_vert,fragmentShader:Be.meshphong_frag},standard:{uniforms:zt([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new oe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Be.meshphysical_vert,fragmentShader:Be.meshphysical_frag},toon:{uniforms:zt([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new oe(0)}}]),vertexShader:Be.meshtoon_vert,fragmentShader:Be.meshtoon_frag},matcap:{uniforms:zt([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:Be.meshmatcap_vert,fragmentShader:Be.meshmatcap_frag},points:{uniforms:zt([de.points,de.fog]),vertexShader:Be.points_vert,fragmentShader:Be.points_frag},dashed:{uniforms:zt([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Be.linedashed_vert,fragmentShader:Be.linedashed_frag},depth:{uniforms:zt([de.common,de.displacementmap]),vertexShader:Be.depth_vert,fragmentShader:Be.depth_frag},normal:{uniforms:zt([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:Be.meshnormal_vert,fragmentShader:Be.meshnormal_frag},sprite:{uniforms:zt([de.sprite,de.fog]),vertexShader:Be.sprite_vert,fragmentShader:Be.sprite_frag},background:{uniforms:{uvTransform:{value:new Ge},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Be.background_vert,fragmentShader:Be.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Be.backgroundCube_vert,fragmentShader:Be.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Be.cube_vert,fragmentShader:Be.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Be.equirect_vert,fragmentShader:Be.equirect_frag},distanceRGBA:{uniforms:zt([de.common,de.displacementmap,{referencePosition:{value:new E},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Be.distanceRGBA_vert,fragmentShader:Be.distanceRGBA_frag},shadow:{uniforms:zt([de.lights,de.fog,{color:{value:new oe(0)},opacity:{value:1}}]),vertexShader:Be.shadow_vert,fragmentShader:Be.shadow_frag}};ni.physical={uniforms:zt([ni.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ge},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ge},clearcoatNormalScale:{value:new q(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ge},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ge},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ge},sheen:{value:0},sheenColor:{value:new oe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ge},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ge},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ge},transmissionSamplerSize:{value:new q},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ge},attenuationDistance:{value:0},attenuationColor:{value:new oe(0)},specularColor:{value:new oe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ge},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ge},anisotropyVector:{value:new q},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ge}}]),vertexShader:Be.meshphysical_vert,fragmentShader:Be.meshphysical_frag};const Dn={r:0,b:0,g:0};function g0(n,e,t,i,r,s,a){const o=new oe(0);let l=s===!0?0:1,c,h,d=null,u=0,p=null;function f(g,m){let _=!1,y=m.isScene===!0?m.background:null;y&&y.isTexture&&(y=(m.backgroundBlurriness>0?t:e).get(y)),y===null?v(o,l):y&&y.isColor&&(v(y,1),_=!0);const x=n.xr.getEnvironmentBlendMode();x==="additive"?i.buffers.color.setClear(0,0,0,1,a):x==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||_)&&n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil),y&&(y.isCubeTexture||y.mapping===hs)?(h===void 0&&(h=new at(new Lr(1,1,1),new Dt({name:"BackgroundCubeMaterial",uniforms:ls(ni.backgroundCube.uniforms),vertexShader:ni.backgroundCube.vertexShader,fragmentShader:ni.backgroundCube.fragmentShader,side:Bt,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,A,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=m.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=m.backgroundIntensity,h.material.toneMapped=Qe.getTransfer(y.colorSpace)!==nt,(d!==y||u!==y.version||p!==n.toneMapping)&&(h.material.needsUpdate=!0,d=y,u=y.version,p=n.toneMapping),h.layers.enableAll(),g.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new at(new an(2,2),new Dt({name:"BackgroundMaterial",uniforms:ls(ni.background.uniforms),vertexShader:ni.background.vertexShader,fragmentShader:ni.background.fragmentShader,side:Ni,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=m.backgroundIntensity,c.material.toneMapped=Qe.getTransfer(y.colorSpace)!==nt,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(d!==y||u!==y.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,d=y,u=y.version,p=n.toneMapping),c.layers.enableAll(),g.unshift(c,c.geometry,c.material,0,0,null))}function v(g,m){g.getRGB(Dn,Yu(n)),i.buffers.color.setClear(Dn.r,Dn.g,Dn.b,m,a)}return{getClearColor:function(){return o},setClearColor:function(g,m=1){o.set(g),l=m,v(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(g){l=g,v(o,l)},render:f}}function v0(n,e,t,i){const r=n.getParameter(n.MAX_VERTEX_ATTRIBS),s=i.isWebGL2?null:e.get("OES_vertex_array_object"),a=i.isWebGL2||s!==null,o={},l=g(null);let c=l,h=!1;function d(D,B,Y,W,te){let J=!1;if(a){const K=v(W,Y,B);c!==K&&(c=K,p(c.object)),J=m(D,W,Y,te),J&&_(D,W,Y,te)}else{const K=B.wireframe===!0;(c.geometry!==W.id||c.program!==Y.id||c.wireframe!==K)&&(c.geometry=W.id,c.program=Y.id,c.wireframe=K,J=!0)}te!==null&&t.update(te,n.ELEMENT_ARRAY_BUFFER),(J||h)&&(h=!1,P(D,B,Y,W),te!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(te).buffer))}function u(){return i.isWebGL2?n.createVertexArray():s.createVertexArrayOES()}function p(D){return i.isWebGL2?n.bindVertexArray(D):s.bindVertexArrayOES(D)}function f(D){return i.isWebGL2?n.deleteVertexArray(D):s.deleteVertexArrayOES(D)}function v(D,B,Y){const W=Y.wireframe===!0;let te=o[D.id];te===void 0&&(te={},o[D.id]=te);let J=te[B.id];J===void 0&&(J={},te[B.id]=J);let K=J[W];return K===void 0&&(K=g(u()),J[W]=K),K}function g(D){const B=[],Y=[],W=[];for(let te=0;te<r;te++)B[te]=0,Y[te]=0,W[te]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:Y,attributeDivisors:W,object:D,attributes:{},index:null}}function m(D,B,Y,W){const te=c.attributes,J=B.attributes;let K=0;const U=Y.getAttributes();for(const V in U)if(U[V].location>=0){const le=te[V];let ve=J[V];if(ve===void 0&&(V==="instanceMatrix"&&D.instanceMatrix&&(ve=D.instanceMatrix),V==="instanceColor"&&D.instanceColor&&(ve=D.instanceColor)),le===void 0||le.attribute!==ve||ve&&le.data!==ve.data)return!0;K++}return c.attributesNum!==K||c.index!==W}function _(D,B,Y,W){const te={},J=B.attributes;let K=0;const U=Y.getAttributes();for(const V in U)if(U[V].location>=0){let le=J[V];le===void 0&&(V==="instanceMatrix"&&D.instanceMatrix&&(le=D.instanceMatrix),V==="instanceColor"&&D.instanceColor&&(le=D.instanceColor));const ve={};ve.attribute=le,le&&le.data&&(ve.data=le.data),te[V]=ve,K++}c.attributes=te,c.attributesNum=K,c.index=W}function y(){const D=c.newAttributes;for(let B=0,Y=D.length;B<Y;B++)D[B]=0}function x(D){w(D,0)}function w(D,B){const Y=c.newAttributes,W=c.enabledAttributes,te=c.attributeDivisors;Y[D]=1,W[D]===0&&(n.enableVertexAttribArray(D),W[D]=1),te[D]!==B&&((i.isWebGL2?n:e.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](D,B),te[D]=B)}function A(){const D=c.newAttributes,B=c.enabledAttributes;for(let Y=0,W=B.length;Y<W;Y++)B[Y]!==D[Y]&&(n.disableVertexAttribArray(Y),B[Y]=0)}function C(D,B,Y,W,te,J,K){K===!0?n.vertexAttribIPointer(D,B,Y,te,J):n.vertexAttribPointer(D,B,Y,W,te,J)}function P(D,B,Y,W){if(i.isWebGL2===!1&&(D.isInstancedMesh||W.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;y();const te=W.attributes,J=Y.getAttributes(),K=B.defaultAttributeValues;for(const U in J){const V=J[U];if(V.location>=0){let le=te[U];if(le===void 0&&(U==="instanceMatrix"&&D.instanceMatrix&&(le=D.instanceMatrix),U==="instanceColor"&&D.instanceColor&&(le=D.instanceColor)),le!==void 0){const ve=le.normalized,we=le.itemSize,Me=t.get(le);if(Me===void 0)continue;const He=Me.buffer,De=Me.type,Ae=Me.bytesPerElement,Ze=i.isWebGL2===!0&&(De===n.INT||De===n.UNSIGNED_INT||le.gpuType===Sl);if(le.isInterleavedBufferAttribute){const j=le.data,L=j.stride,he=le.offset;if(j.isInstancedInterleavedBuffer){for(let Q=0;Q<V.locationSize;Q++)w(V.location+Q,j.meshPerAttribute);D.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=j.meshPerAttribute*j.count)}else for(let Q=0;Q<V.locationSize;Q++)x(V.location+Q);n.bindBuffer(n.ARRAY_BUFFER,He);for(let Q=0;Q<V.locationSize;Q++)C(V.location+Q,we/V.locationSize,De,ve,L*Ae,(he+we/V.locationSize*Q)*Ae,Ze)}else{if(le.isInstancedBufferAttribute){for(let j=0;j<V.locationSize;j++)w(V.location+j,le.meshPerAttribute);D.isInstancedMesh!==!0&&W._maxInstanceCount===void 0&&(W._maxInstanceCount=le.meshPerAttribute*le.count)}else for(let j=0;j<V.locationSize;j++)x(V.location+j);n.bindBuffer(n.ARRAY_BUFFER,He);for(let j=0;j<V.locationSize;j++)C(V.location+j,we/V.locationSize,De,ve,we*Ae,we/V.locationSize*j*Ae,Ze)}}else if(K!==void 0){const ve=K[U];if(ve!==void 0)switch(ve.length){case 2:n.vertexAttrib2fv(V.location,ve);break;case 3:n.vertexAttrib3fv(V.location,ve);break;case 4:n.vertexAttrib4fv(V.location,ve);break;default:n.vertexAttrib1fv(V.location,ve)}}}}A()}function M(){G();for(const D in o){const B=o[D];for(const Y in B){const W=B[Y];for(const te in W)f(W[te].object),delete W[te];delete B[Y]}delete o[D]}}function T(D){if(o[D.id]===void 0)return;const B=o[D.id];for(const Y in B){const W=B[Y];for(const te in W)f(W[te].object),delete W[te];delete B[Y]}delete o[D.id]}function F(D){for(const B in o){const Y=o[B];if(Y[D.id]===void 0)continue;const W=Y[D.id];for(const te in W)f(W[te].object),delete W[te];delete Y[D.id]}}function G(){Z(),h=!0,c!==l&&(c=l,p(c.object))}function Z(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:d,reset:G,resetDefaultState:Z,dispose:M,releaseStatesOfGeometry:T,releaseStatesOfProgram:F,initAttributes:y,enableAttribute:x,disableUnusedAttributes:A}}function y0(n,e,t,i){const r=i.isWebGL2;let s;function a(c){s=c}function o(c,h){n.drawArrays(s,c,h),t.update(h,s,1)}function l(c,h,d){if(d===0)return;let u,p;if(r)u=n,p="drawArraysInstanced";else if(u=e.get("ANGLE_instanced_arrays"),p="drawArraysInstancedANGLE",u===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}u[p](s,c,h,d),t.update(h,s,d)}this.setMode=a,this.render=o,this.renderInstances=l}function _0(n,e,t){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");i=n.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function s(C){if(C==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&n.constructor.name==="WebGL2RenderingContext";let o=t.precision!==void 0?t.precision:"highp";const l=s(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);const c=a||e.has("WEBGL_draw_buffers"),h=t.logarithmicDepthBuffer===!0,d=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),u=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_TEXTURE_SIZE),f=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),v=n.getParameter(n.MAX_VERTEX_ATTRIBS),g=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),m=n.getParameter(n.MAX_VARYING_VECTORS),_=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),y=u>0,x=a||e.has("OES_texture_float"),w=y&&x,A=a?n.getParameter(n.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:c,getMaxAnisotropy:r,getMaxPrecision:s,precision:o,logarithmicDepthBuffer:h,maxTextures:d,maxVertexTextures:u,maxTextureSize:p,maxCubemapSize:f,maxAttributes:v,maxVertexUniforms:g,maxVaryings:m,maxFragmentUniforms:_,vertexTextures:y,floatFragmentTextures:x,floatVertexTextures:w,maxSamples:A}}function x0(n){const e=this;let t=null,i=0,r=!1,s=!1;const a=new Yi,o=new Ge,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const p=d.length!==0||u||i!==0||r;return r=u,i=d.length,p},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,p){const f=d.clippingPlanes,v=d.clipIntersection,g=d.clipShadows,m=n.get(d);if(!r||f===null||f.length===0||s&&!g)s?h(null):c();else{const _=s?0:i,y=_*4;let x=m.clippingState||null;l.value=x,x=h(f,u,y,p);for(let w=0;w!==y;++w)x[w]=t[w];m.clippingState=x,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(d,u,p,f){const v=d!==null?d.length:0;let g=null;if(v!==0){if(g=l.value,f!==!0||g===null){const m=p+v*4,_=u.matrixWorldInverse;o.getNormalMatrix(_),(g===null||g.length<m)&&(g=new Float32Array(m));for(let y=0,x=p;y!==v;++y,x+=4)a.copy(d[y]).applyMatrix4(_,o),a.normal.toArray(g,x),g[x+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,g}}function M0(n){let e=new WeakMap;function t(a,o){return o===Us?a.mapping=Oi:o===Ns&&(a.mapping=Qi),a}function i(a){if(a&&a.isTexture&&a.isRenderTargetTexture===!1){const o=a.mapping;if(o===Us||o===Ns)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Ku(l.height/2);return c.fromEquirectangularTexture(n,a),e.set(a,c),a.addEventListener("dispose",r),t(c.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class tr extends Sa{constructor(e=-1,t=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const ts=4,Ac=[.125,.215,.35,.446,.526,.582],yr=20,fo=new tr,Rc=new oe;let go=null,vo=0,yo=0;const vr=(1+Math.sqrt(5))/2,Yr=1/vr,Cc=[new E(1,1,1),new E(-1,1,1),new E(1,1,-1),new E(-1,1,-1),new E(0,vr,Yr),new E(0,vr,-Yr),new E(Yr,0,vr),new E(-Yr,0,vr),new E(vr,Yr,0),new E(-vr,Yr,0)];class pl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100){go=this._renderer.getRenderTarget(),vo=this._renderer.getActiveCubeFace(),yo=this._renderer.getActiveMipmapLevel(),this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ic(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Pc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(go,vo,yo),e.scissorTest=!1,Un(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Oi||e.mapping===Qi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),go=this._renderer.getRenderTarget(),vo=this._renderer.getActiveCubeFace(),yo=this._renderer.getActiveMipmapLevel();const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:pt,minFilter:pt,generateMipmaps:!1,type:as,format:Zt,colorSpace:yi,depthBuffer:!1},r=Lc(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Lc(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=b0(s)),this._blurMaterial=S0(s,e,t)}return r}_compileMaterial(e){const t=new at(this._lodPlanes[0],e);this._renderer.compile(t,fo)}_sceneToCubeUV(e,t,i,r){const s=new yt(90,1,t,i),a=[1,-1,1,1,1,1],o=[1,1,1,-1,-1,-1],l=this._renderer,c=l.autoClear,h=l.toneMapping;l.getClearColor(Rc),l.toneMapping=Di,l.autoClear=!1;const d=new At({name:"PMREM.Background",side:Bt,depthWrite:!1,depthTest:!1}),u=new at(new Lr,d);let p=!1;const f=e.background;f?f.isColor&&(d.color.copy(f),e.background=null,p=!0):(d.color.copy(Rc),p=!0);for(let v=0;v<6;v++){const g=v%3;g===0?(s.up.set(0,a[v],0),s.lookAt(o[v],0,0)):g===1?(s.up.set(0,0,a[v]),s.lookAt(0,o[v],0)):(s.up.set(0,a[v],0),s.lookAt(0,0,o[v]));const m=this._cubeSize;Un(r,g*m,v>2?m:0,m,m),l.setRenderTarget(r),p&&l.render(u,s),l.render(e,s)}u.geometry.dispose(),u.material.dispose(),l.toneMapping=h,l.autoClear=c,e.background=f}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===Oi||e.mapping===Qi;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ic()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Pc());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new at(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;Un(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,fo)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;for(let r=1;r<this._lodPlanes.length;r++){const s=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Cc[(r-1)%Cc.length];this._blur(e,r-1,r,s,a)}t.autoClear=i}_blur(e,t,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new at(this._lodPlanes[r],c),u=c.uniforms,p=this._sizeLods[i]-1,f=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*yr-1),v=s/f,g=isFinite(s)?1+Math.floor(h*v):yr;g>yr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${yr}`);const m=[];let _=0;for(let C=0;C<yr;++C){const P=C/v,M=Math.exp(-P*P/2);m.push(M),C===0?_+=M:C<g&&(_+=2*M)}for(let C=0;C<m.length;C++)m[C]=m[C]/_;u.envMap.value=e.texture,u.samples.value=g,u.weights.value=m,u.latitudinal.value=a==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:y}=this;u.dTheta.value=f,u.mipInt.value=y-i;const x=this._sizeLods[r],w=3*x*(r>y-ts?r-y+ts:0),A=4*(this._cubeSize-x);Un(t,w,A,3*x,2*x),l.setRenderTarget(t),l.render(d,fo)}}function b0(n){const e=[],t=[],i=[];let r=n;const s=n-ts+1+Ac.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);t.push(o);let l=1/o;a>n-ts?l=Ac[a-n+ts-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),h=-c,d=1+c,u=[h,h,d,h,d,d,h,h,d,d,h,d],p=6,f=6,v=3,g=2,m=1,_=new Float32Array(v*f*p),y=new Float32Array(g*f*p),x=new Float32Array(m*f*p);for(let A=0;A<p;A++){const C=A%3*2/3-1,P=A>2?0:-1,M=[C,P,0,C+2/3,P,0,C+2/3,P+1,0,C,P,0,C+2/3,P+1,0,C,P+1,0];_.set(M,v*f*A),y.set(u,g*f*A);const T=[A,A,A,A,A,A];x.set(T,m*f*A)}const w=new Re;w.setAttribute("position",new Pe(_,v)),w.setAttribute("uv",new Pe(y,g)),w.setAttribute("faceIndex",new Pe(x,m)),e.push(w),r>ts&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function Lc(n,e,t){const i=new ai(n,e,t);return i.texture.mapping=hs,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Un(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function S0(n,e,t){const i=new Float32Array(yr),r=new E(0,1,0);return new Dt({name:"SphericalGaussianBlur",defines:{n:yr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Ol(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Ii,depthTest:!1,depthWrite:!1})}function Pc(){return new Dt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ol(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Ii,depthTest:!1,depthWrite:!1})}function Ic(){return new Dt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ol(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ii,depthTest:!1,depthWrite:!1})}function Ol(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function w0(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===Us||l===Ns,h=l===Oi||l===Qi;if(c||h)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let d=e.get(o);return t===null&&(t=new pl(n)),d=c?t.fromEquirectangular(o,d):t.fromCubemap(o,d),e.set(o,d),d.texture}else{if(e.has(o))return e.get(o).texture;{const d=o.image;if(c&&d&&d.height>0||h&&d&&r(d)){t===null&&(t=new pl(n));const u=c?t.fromEquirectangular(o):t.fromCubemap(o);return e.set(o,u),o.addEventListener("dispose",s),u.texture}else return null}}}return o}function r(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function E0(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(i){i.isWebGL2?t("EXT_color_buffer_float"):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(i){const r=t(i);return r===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function T0(n,e,t,i){const r={},s=new WeakMap;function a(d){const u=d.target;u.index!==null&&e.remove(u.index);for(const f in u.attributes)e.remove(u.attributes[f]);for(const f in u.morphAttributes){const v=u.morphAttributes[f];for(let g=0,m=v.length;g<m;g++)e.remove(v[g])}u.removeEventListener("dispose",a),delete r[u.id];const p=s.get(u);p&&(e.remove(p),s.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(d,u){return r[u.id]===!0||(u.addEventListener("dispose",a),r[u.id]=!0,t.memory.geometries++),u}function l(d){const u=d.attributes;for(const f in u)e.update(u[f],n.ARRAY_BUFFER);const p=d.morphAttributes;for(const f in p){const v=p[f];for(let g=0,m=v.length;g<m;g++)e.update(v[g],n.ARRAY_BUFFER)}}function c(d){const u=[],p=d.index,f=d.attributes.position;let v=0;if(p!==null){const _=p.array;v=p.version;for(let y=0,x=_.length;y<x;y+=3){const w=_[y+0],A=_[y+1],C=_[y+2];u.push(w,A,A,C,C,w)}}else if(f!==void 0){const _=f.array;v=f.version;for(let y=0,x=_.length/3-1;y<x;y+=3){const w=y+0,A=y+1,C=y+2;u.push(w,A,A,C,C,w)}}else return;const g=new(Wu(u)?Nl:Ul)(u,1);g.version=v;const m=s.get(d);m&&e.remove(m),s.set(d,g)}function h(d){const u=s.get(d);if(u){const p=d.index;p!==null&&u.version<p.version&&c(d)}else c(d);return s.get(d)}return{get:o,update:l,getWireframeAttribute:h}}function A0(n,e,t,i){const r=i.isWebGL2;let s;function a(u){s=u}let o,l;function c(u){o=u.type,l=u.bytesPerElement}function h(u,p){n.drawElements(s,p,o,u*l),t.update(p,s,1)}function d(u,p,f){if(f===0)return;let v,g;if(r)v=n,g="drawElementsInstanced";else if(v=e.get("ANGLE_instanced_arrays"),g="drawElementsInstancedANGLE",v===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}v[g](s,p,o,u*l,f),t.update(p,s,f)}this.setMode=a,this.setIndex=c,this.render=h,this.renderInstances=d}function R0(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(s/3);break;case n.LINES:t.lines+=o*(s/2);break;case n.LINE_STRIP:t.lines+=o*(s-1);break;case n.LINE_LOOP:t.lines+=o*s;break;case n.POINTS:t.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function C0(n,e){return n[0]-e[0]}function L0(n,e){return Math.abs(e[1])-Math.abs(n[1])}function P0(n,e,t){const i={},r=new Float32Array(8),s=new WeakMap,a=new et,o=[];for(let c=0;c<8;c++)o[c]=[c,0];function l(c,h,d){const u=c.morphTargetInfluences;if(e.isWebGL2===!0){const p=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,f=p!==void 0?p.length:0;let v=s.get(h);if(v===void 0||v.count!==f){let _=function(){Z.dispose(),s.delete(h),h.removeEventListener("dispose",_)};v!==void 0&&v.texture.dispose();const y=h.morphAttributes.position!==void 0,x=h.morphAttributes.normal!==void 0,w=h.morphAttributes.color!==void 0,A=h.morphAttributes.position||[],C=h.morphAttributes.normal||[],P=h.morphAttributes.color||[];let M=0;y===!0&&(M=1),x===!0&&(M=2),w===!0&&(M=3);let T=h.attributes.position.count*M,F=1;T>e.maxTextureSize&&(F=Math.ceil(T/e.maxTextureSize),T=e.maxTextureSize);const G=new Float32Array(T*F*4*f),Z=new Ma(G,T,F,f);Z.type=mi,Z.needsUpdate=!0;const D=M*4;for(let B=0;B<f;B++){const Y=A[B],W=C[B],te=P[B],J=T*F*4*B;for(let K=0;K<Y.count;K++){const U=K*D;y===!0&&(a.fromBufferAttribute(Y,K),G[J+U+0]=a.x,G[J+U+1]=a.y,G[J+U+2]=a.z,G[J+U+3]=0),x===!0&&(a.fromBufferAttribute(W,K),G[J+U+4]=a.x,G[J+U+5]=a.y,G[J+U+6]=a.z,G[J+U+7]=0),w===!0&&(a.fromBufferAttribute(te,K),G[J+U+8]=a.x,G[J+U+9]=a.y,G[J+U+10]=a.z,G[J+U+11]=te.itemSize===4?a.w:1)}}v={count:f,texture:Z,size:new q(T,F)},s.set(h,v),h.addEventListener("dispose",_)}let g=0;for(let _=0;_<u.length;_++)g+=u[_];const m=h.morphTargetsRelative?1:1-g;d.getUniforms().setValue(n,"morphTargetBaseInfluence",m),d.getUniforms().setValue(n,"morphTargetInfluences",u),d.getUniforms().setValue(n,"morphTargetsTexture",v.texture,t),d.getUniforms().setValue(n,"morphTargetsTextureSize",v.size)}else{const p=u===void 0?0:u.length;let f=i[h.id];if(f===void 0||f.length!==p){f=[];for(let y=0;y<p;y++)f[y]=[y,0];i[h.id]=f}for(let y=0;y<p;y++){const x=f[y];x[0]=y,x[1]=u[y]}f.sort(L0);for(let y=0;y<8;y++)y<p&&f[y][1]?(o[y][0]=f[y][0],o[y][1]=f[y][1]):(o[y][0]=Number.MAX_SAFE_INTEGER,o[y][1]=0);o.sort(C0);const v=h.morphAttributes.position,g=h.morphAttributes.normal;let m=0;for(let y=0;y<8;y++){const x=o[y],w=x[0],A=x[1];w!==Number.MAX_SAFE_INTEGER&&A?(v&&h.getAttribute("morphTarget"+y)!==v[w]&&h.setAttribute("morphTarget"+y,v[w]),g&&h.getAttribute("morphNormal"+y)!==g[w]&&h.setAttribute("morphNormal"+y,g[w]),r[y]=A,m+=A):(v&&h.hasAttribute("morphTarget"+y)===!0&&h.deleteAttribute("morphTarget"+y),g&&h.hasAttribute("morphNormal"+y)===!0&&h.deleteAttribute("morphNormal"+y),r[y]=0)}const _=h.morphTargetsRelative?1:1-m;d.getUniforms().setValue(n,"morphTargetBaseInfluence",_),d.getUniforms().setValue(n,"morphTargetInfluences",r)}}return{update:l}}function I0(n,e,t,i){let r=new WeakMap;function s(l){const c=i.render.frame,h=l.geometry,d=e.get(l,h);if(r.get(d)!==c&&(e.update(d),r.set(d,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;r.get(u)!==c&&(u.update(),r.set(u,c))}return d}function a(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:a}}const Qu=new mt,ed=new Ma,td=new Dl,id=new nn,Dc=[],Uc=[],Nc=new Float32Array(16),Oc=new Float32Array(9),Fc=new Float32Array(4);function ds(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=Dc[r];if(s===void 0&&(s=new Float32Array(r),Dc[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(s,o)}return s}function bt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function St(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Ea(n,e){let t=Uc[e];t===void 0&&(t=new Int32Array(e),Uc[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function D0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function U0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;n.uniform2fv(this.addr,e),St(t,e)}}function N0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(bt(t,e))return;n.uniform3fv(this.addr,e),St(t,e)}}function O0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;n.uniform4fv(this.addr,e),St(t,e)}}function F0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(bt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),St(t,e)}else{if(bt(t,i))return;Fc.set(i),n.uniformMatrix2fv(this.addr,!1,Fc),St(t,i)}}function z0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(bt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),St(t,e)}else{if(bt(t,i))return;Oc.set(i),n.uniformMatrix3fv(this.addr,!1,Oc),St(t,i)}}function B0(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(bt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),St(t,e)}else{if(bt(t,i))return;Nc.set(i),n.uniformMatrix4fv(this.addr,!1,Nc),St(t,i)}}function k0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function H0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;n.uniform2iv(this.addr,e),St(t,e)}}function G0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(bt(t,e))return;n.uniform3iv(this.addr,e),St(t,e)}}function V0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;n.uniform4iv(this.addr,e),St(t,e)}}function W0(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function X0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(bt(t,e))return;n.uniform2uiv(this.addr,e),St(t,e)}}function j0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(bt(t,e))return;n.uniform3uiv(this.addr,e),St(t,e)}}function q0(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(bt(t,e))return;n.uniform4uiv(this.addr,e),St(t,e)}}function Y0(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2D(e||Qu,r)}function Z0(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||td,r)}function J0(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||id,r)}function K0(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||ed,r)}function $0(n){switch(n){case 5126:return D0;case 35664:return U0;case 35665:return N0;case 35666:return O0;case 35674:return F0;case 35675:return z0;case 35676:return B0;case 5124:case 35670:return k0;case 35667:case 35671:return H0;case 35668:case 35672:return G0;case 35669:case 35673:return V0;case 5125:return W0;case 36294:return X0;case 36295:return j0;case 36296:return q0;case 35678:case 36198:case 36298:case 36306:case 35682:return Y0;case 35679:case 36299:case 36307:return Z0;case 35680:case 36300:case 36308:case 36293:return J0;case 36289:case 36303:case 36311:case 36292:return K0}}function Q0(n,e){n.uniform1fv(this.addr,e)}function ev(n,e){const t=ds(e,this.size,2);n.uniform2fv(this.addr,t)}function tv(n,e){const t=ds(e,this.size,3);n.uniform3fv(this.addr,t)}function iv(n,e){const t=ds(e,this.size,4);n.uniform4fv(this.addr,t)}function rv(n,e){const t=ds(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function sv(n,e){const t=ds(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function nv(n,e){const t=ds(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function av(n,e){n.uniform1iv(this.addr,e)}function ov(n,e){n.uniform2iv(this.addr,e)}function lv(n,e){n.uniform3iv(this.addr,e)}function cv(n,e){n.uniform4iv(this.addr,e)}function hv(n,e){n.uniform1uiv(this.addr,e)}function uv(n,e){n.uniform2uiv(this.addr,e)}function dv(n,e){n.uniform3uiv(this.addr,e)}function pv(n,e){n.uniform4uiv(this.addr,e)}function mv(n,e,t){const i=this.cache,r=e.length,s=Ea(t,r);bt(i,s)||(n.uniform1iv(this.addr,s),St(i,s));for(let a=0;a!==r;++a)t.setTexture2D(e[a]||Qu,s[a])}function fv(n,e,t){const i=this.cache,r=e.length,s=Ea(t,r);bt(i,s)||(n.uniform1iv(this.addr,s),St(i,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||td,s[a])}function gv(n,e,t){const i=this.cache,r=e.length,s=Ea(t,r);bt(i,s)||(n.uniform1iv(this.addr,s),St(i,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||id,s[a])}function vv(n,e,t){const i=this.cache,r=e.length,s=Ea(t,r);bt(i,s)||(n.uniform1iv(this.addr,s),St(i,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||ed,s[a])}function yv(n){switch(n){case 5126:return Q0;case 35664:return ev;case 35665:return tv;case 35666:return iv;case 35674:return rv;case 35675:return sv;case 35676:return nv;case 5124:case 35670:return av;case 35667:case 35671:return ov;case 35668:case 35672:return lv;case 35669:case 35673:return cv;case 5125:return hv;case 36294:return uv;case 36295:return dv;case 36296:return pv;case 35678:case 36198:case 36298:case 36306:case 35682:return mv;case 35679:case 36299:case 36307:return fv;case 35680:case 36300:case 36308:case 36293:return gv;case 36289:case 36303:case 36311:case 36292:return vv}}class _v{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.setValue=$0(t.type)}}class xv{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.size=t.size,this.setValue=yv(t.type)}}class Mv{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],i)}}}const _o=/(\w+)(\])?(\[|\.)?/g;function zc(n,e){n.seq.push(e),n.map[e.id]=e}function bv(n,e,t){const i=n.name,r=i.length;for(_o.lastIndex=0;;){const s=_o.exec(i),a=_o.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){zc(t,c===void 0?new _v(o,n,e):new xv(o,n,e));break}else{let h=t.map[o];h===void 0&&(h=new Mv(o),zc(t,h)),t=h}}}class ca{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),a=e.getUniformLocation(t,s.name);bv(s,a,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&i.push(a)}return i}}function Bc(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Sv=37297;let wv=0;function Ev(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}function Tv(n){const e=Qe.getPrimaries(Qe.workingColorSpace),t=Qe.getPrimaries(n);let i;switch(e===t?i="":e===Vs&&t===Gs?i="LinearDisplayP3ToLinearSRGB":e===Gs&&t===Vs&&(i="LinearSRGBToLinearDisplayP3"),n){case yi:case rn:return[i,"LinearTransferOETF"];case Mt:case xa:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function kc(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=n.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+Ev(n.getShaderSource(e),a)}else return r}function Av(n,e){const t=Tv(e);return`vec4 ${n}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function Rv(n,e){let t;switch(e){case mu:t="Linear";break;case fu:t="Reinhard";break;case gu:t="OptimizedCineon";break;case vu:t="ACESFilmic";break;case yu:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Cv(n){return[n.extensionDerivatives||n.envMapCubeUVHeight||n.bumpMap||n.normalMapTangentSpace||n.clearcoatNormalMap||n.flatShading||n.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(n.extensionFragDepth||n.logarithmicDepthBuffer)&&n.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",n.extensionDrawBuffers&&n.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(n.extensionShaderTextureLOD||n.envMap||n.transmission)&&n.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(As).join(`
`)}function Lv(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Pv(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),a=s.name;let o=1;s.type===n.FLOAT_MAT2&&(o=2),s.type===n.FLOAT_MAT3&&(o=3),s.type===n.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function As(n){return n!==""}function Hc(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Gc(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Iv=/^[ \t]*#include +<([\w\d./]+)>/gm;function ml(n){return n.replace(Iv,Uv)}const Dv=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Uv(n,e){let t=Be[e];if(t===void 0){const i=Dv.get(e);if(i!==void 0)t=Be[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return ml(t)}const Nv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Vc(n){return n.replace(Nv,Ov)}function Ov(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Wc(n){let e="precision "+n.precision+` float;
precision `+n.precision+" int;";return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Fv(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Ml?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===ga?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===di&&(e="SHADOWMAP_TYPE_VSM"),e}function zv(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Oi:case Qi:e="ENVMAP_TYPE_CUBE";break;case hs:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Bv(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Qi:e="ENVMAP_MODE_REFRACTION";break}return e}function kv(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case tn:e="ENVMAP_BLENDING_MULTIPLY";break;case du:e="ENVMAP_BLENDING_MIX";break;case pu:e="ENVMAP_BLENDING_ADD";break}return e}function Hv(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function Gv(n,e,t,i){const r=n.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=Fv(t),c=zv(t),h=Bv(t),d=kv(t),u=Hv(t),p=t.isWebGL2?"":Cv(t),f=Lv(s),v=r.createProgram();let g,m,_=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f].filter(As).join(`
`),g.length>0&&(g+=`
`),m=[p,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f].filter(As).join(`
`),m.length>0&&(m+=`
`)):(g=[Wc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f,t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(As).join(`
`),m=[p,Wc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,f,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Di?"#define TONE_MAPPING":"",t.toneMapping!==Di?Be.tonemapping_pars_fragment:"",t.toneMapping!==Di?Rv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Be.colorspace_pars_fragment,Av("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(As).join(`
`)),a=ml(a),a=Hc(a,t),a=Gc(a,t),o=ml(o),o=Hc(o,t),o=Gc(o,t),a=Vc(a),o=Vc(o),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,g=["precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===ul?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ul?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const y=_+g+a,x=_+m+o,w=Bc(r,r.VERTEX_SHADER,y),A=Bc(r,r.FRAGMENT_SHADER,x);r.attachShader(v,w),r.attachShader(v,A),t.index0AttributeName!==void 0?r.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(v,0,"position"),r.linkProgram(v);function C(F){if(n.debug.checkShaderErrors){const G=r.getProgramInfoLog(v).trim(),Z=r.getShaderInfoLog(w).trim(),D=r.getShaderInfoLog(A).trim();let B=!0,Y=!0;if(r.getProgramParameter(v,r.LINK_STATUS)===!1)if(B=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,v,w,A);else{const W=kc(r,w,"vertex"),te=kc(r,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(v,r.VALIDATE_STATUS)+`

Program Info Log: `+G+`
`+W+`
`+te)}else G!==""?console.warn("THREE.WebGLProgram: Program Info Log:",G):(Z===""||D==="")&&(Y=!1);Y&&(F.diagnostics={runnable:B,programLog:G,vertexShader:{log:Z,prefix:g},fragmentShader:{log:D,prefix:m}})}r.deleteShader(w),r.deleteShader(A),P=new ca(r,v),M=Pv(r,v)}let P;this.getUniforms=function(){return P===void 0&&C(this),P};let M;this.getAttributes=function(){return M===void 0&&C(this),M};let T=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return T===!1&&(T=r.getProgramParameter(v,Sv)),T},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=wv++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=w,this.fragmentShader=A,this}let Vv=0;class Wv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Xv(e),t.set(e,i)),i}}class Xv{constructor(e){this.id=Vv++,this.code=e,this.usedTimes=0}}function jv(n,e,t,i,r,s,a){const o=new ba,l=new Wv,c=[],h=r.isWebGL2,d=r.logarithmicDepthBuffer,u=r.vertexTextures;let p=r.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(M){return M===0?"uv":`uv${M}`}function g(M,T,F,G,Z){const D=G.fog,B=Z.geometry,Y=M.isMeshStandardMaterial?G.environment:null,W=(M.isMeshStandardMaterial?t:e).get(M.envMap||Y),te=W&&W.mapping===hs?W.image.height:null,J=f[M.type];M.precision!==null&&(p=r.getMaxPrecision(M.precision),p!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",p,"instead."));const K=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,U=K!==void 0?K.length:0;let V=0;B.morphAttributes.position!==void 0&&(V=1),B.morphAttributes.normal!==void 0&&(V=2),B.morphAttributes.color!==void 0&&(V=3);let le,ve,we,Me;if(J){const it=ni[J];le=it.vertexShader,ve=it.fragmentShader}else le=M.vertexShader,ve=M.fragmentShader,l.update(M),we=l.getVertexShaderID(M),Me=l.getFragmentShaderID(M);const He=n.getRenderTarget(),De=Z.isInstancedMesh===!0,Ae=!!M.map,Ze=!!M.matcap,j=!!W,L=!!M.aoMap,he=!!M.lightMap,Q=!!M.bumpMap,$=!!M.normalMap,pe=!!M.displacementMap,Ee=!!M.emissiveMap,_e=!!M.metalnessMap,be=!!M.roughnessMap,Ue=M.anisotropy>0,ot=M.clearcoat>0,ft=M.iridescence>0,R=M.sheen>0,b=M.transmission>0,O=Ue&&!!M.anisotropyMap,se=ot&&!!M.clearcoatMap,ee=ot&&!!M.clearcoatNormalMap,ie=ot&&!!M.clearcoatRoughnessMap,xe=ft&&!!M.iridescenceMap,ne=ft&&!!M.iridescenceThicknessMap,ge=R&&!!M.sheenColorMap,Ie=R&&!!M.sheenRoughnessMap,$e=!!M.specularMap,ae=!!M.specularColorMap,tt=!!M.specularIntensityMap,ze=b&&!!M.transmissionMap,Ne=b&&!!M.thicknessMap,Ce=!!M.gradientMap,ye=!!M.alphaMap,qe=M.alphaTest>0,I=!!M.alphaHash,me=!!M.extensions,re=!!B.attributes.uv1,X=!!B.attributes.uv2,ce=!!B.attributes.uv3;let Se=Di;return M.toneMapped&&(He===null||He.isXRRenderTarget===!0)&&(Se=n.toneMapping),{isWebGL2:h,shaderID:J,shaderType:M.type,shaderName:M.name,vertexShader:le,fragmentShader:ve,defines:M.defines,customVertexShaderID:we,customFragmentShaderID:Me,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:p,instancing:De,instancingColor:De&&Z.instanceColor!==null,supportsVertexTextures:u,outputColorSpace:He===null?n.outputColorSpace:He.isXRRenderTarget===!0?He.texture.colorSpace:yi,map:Ae,matcap:Ze,envMap:j,envMapMode:j&&W.mapping,envMapCubeUVHeight:te,aoMap:L,lightMap:he,bumpMap:Q,normalMap:$,displacementMap:u&&pe,emissiveMap:Ee,normalMapObjectSpace:$&&M.normalMapType===Uu,normalMapTangentSpace:$&&M.normalMapType===ir,metalnessMap:_e,roughnessMap:be,anisotropy:Ue,anisotropyMap:O,clearcoat:ot,clearcoatMap:se,clearcoatNormalMap:ee,clearcoatRoughnessMap:ie,iridescence:ft,iridescenceMap:xe,iridescenceThicknessMap:ne,sheen:R,sheenColorMap:ge,sheenRoughnessMap:Ie,specularMap:$e,specularColorMap:ae,specularIntensityMap:tt,transmission:b,transmissionMap:ze,thicknessMap:Ne,gradientMap:Ce,opaque:M.transparent===!1&&M.blending===Sr,alphaMap:ye,alphaTest:qe,alphaHash:I,combine:M.combine,mapUv:Ae&&v(M.map.channel),aoMapUv:L&&v(M.aoMap.channel),lightMapUv:he&&v(M.lightMap.channel),bumpMapUv:Q&&v(M.bumpMap.channel),normalMapUv:$&&v(M.normalMap.channel),displacementMapUv:pe&&v(M.displacementMap.channel),emissiveMapUv:Ee&&v(M.emissiveMap.channel),metalnessMapUv:_e&&v(M.metalnessMap.channel),roughnessMapUv:be&&v(M.roughnessMap.channel),anisotropyMapUv:O&&v(M.anisotropyMap.channel),clearcoatMapUv:se&&v(M.clearcoatMap.channel),clearcoatNormalMapUv:ee&&v(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ie&&v(M.clearcoatRoughnessMap.channel),iridescenceMapUv:xe&&v(M.iridescenceMap.channel),iridescenceThicknessMapUv:ne&&v(M.iridescenceThicknessMap.channel),sheenColorMapUv:ge&&v(M.sheenColorMap.channel),sheenRoughnessMapUv:Ie&&v(M.sheenRoughnessMap.channel),specularMapUv:$e&&v(M.specularMap.channel),specularColorMapUv:ae&&v(M.specularColorMap.channel),specularIntensityMapUv:tt&&v(M.specularIntensityMap.channel),transmissionMapUv:ze&&v(M.transmissionMap.channel),thicknessMapUv:Ne&&v(M.thicknessMap.channel),alphaMapUv:ye&&v(M.alphaMap.channel),vertexTangents:!!B.attributes.tangent&&($||Ue),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,vertexUv1s:re,vertexUv2s:X,vertexUv3s:ce,pointsUvs:Z.isPoints===!0&&!!B.attributes.uv&&(Ae||ye),fog:!!D,useFog:M.fog===!0,fogExp2:D&&D.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:d,skinning:Z.isSkinnedMesh===!0,morphTargets:B.morphAttributes.position!==void 0,morphNormals:B.morphAttributes.normal!==void 0,morphColors:B.morphAttributes.color!==void 0,morphTargetsCount:U,morphTextureStride:V,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:n.shadowMap.enabled&&F.length>0,shadowMapType:n.shadowMap.type,toneMapping:Se,useLegacyLights:n._useLegacyLights,decodeVideoTexture:Ae&&M.map.isVideoTexture===!0&&Qe.getTransfer(M.map.colorSpace)===nt,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===pi,flipSided:M.side===Bt,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionDerivatives:me&&M.extensions.derivatives===!0,extensionFragDepth:me&&M.extensions.fragDepth===!0,extensionDrawBuffers:me&&M.extensions.drawBuffers===!0,extensionShaderTextureLOD:me&&M.extensions.shaderTextureLOD===!0,rendererExtensionFragDepth:h||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||i.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()}}function m(M){const T=[];if(M.shaderID?T.push(M.shaderID):(T.push(M.customVertexShaderID),T.push(M.customFragmentShaderID)),M.defines!==void 0)for(const F in M.defines)T.push(F),T.push(M.defines[F]);return M.isRawShaderMaterial===!1&&(_(T,M),y(T,M),T.push(n.outputColorSpace)),T.push(M.customProgramCacheKey),T.join()}function _(M,T){M.push(T.precision),M.push(T.outputColorSpace),M.push(T.envMapMode),M.push(T.envMapCubeUVHeight),M.push(T.mapUv),M.push(T.alphaMapUv),M.push(T.lightMapUv),M.push(T.aoMapUv),M.push(T.bumpMapUv),M.push(T.normalMapUv),M.push(T.displacementMapUv),M.push(T.emissiveMapUv),M.push(T.metalnessMapUv),M.push(T.roughnessMapUv),M.push(T.anisotropyMapUv),M.push(T.clearcoatMapUv),M.push(T.clearcoatNormalMapUv),M.push(T.clearcoatRoughnessMapUv),M.push(T.iridescenceMapUv),M.push(T.iridescenceThicknessMapUv),M.push(T.sheenColorMapUv),M.push(T.sheenRoughnessMapUv),M.push(T.specularMapUv),M.push(T.specularColorMapUv),M.push(T.specularIntensityMapUv),M.push(T.transmissionMapUv),M.push(T.thicknessMapUv),M.push(T.combine),M.push(T.fogExp2),M.push(T.sizeAttenuation),M.push(T.morphTargetsCount),M.push(T.morphAttributeCount),M.push(T.numDirLights),M.push(T.numPointLights),M.push(T.numSpotLights),M.push(T.numSpotLightMaps),M.push(T.numHemiLights),M.push(T.numRectAreaLights),M.push(T.numDirLightShadows),M.push(T.numPointLightShadows),M.push(T.numSpotLightShadows),M.push(T.numSpotLightShadowsWithMaps),M.push(T.numLightProbes),M.push(T.shadowMapType),M.push(T.toneMapping),M.push(T.numClippingPlanes),M.push(T.numClipIntersection),M.push(T.depthPacking)}function y(M,T){o.disableAll(),T.isWebGL2&&o.enable(0),T.supportsVertexTextures&&o.enable(1),T.instancing&&o.enable(2),T.instancingColor&&o.enable(3),T.matcap&&o.enable(4),T.envMap&&o.enable(5),T.normalMapObjectSpace&&o.enable(6),T.normalMapTangentSpace&&o.enable(7),T.clearcoat&&o.enable(8),T.iridescence&&o.enable(9),T.alphaTest&&o.enable(10),T.vertexColors&&o.enable(11),T.vertexAlphas&&o.enable(12),T.vertexUv1s&&o.enable(13),T.vertexUv2s&&o.enable(14),T.vertexUv3s&&o.enable(15),T.vertexTangents&&o.enable(16),T.anisotropy&&o.enable(17),T.alphaHash&&o.enable(18),M.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.skinning&&o.enable(4),T.morphTargets&&o.enable(5),T.morphNormals&&o.enable(6),T.morphColors&&o.enable(7),T.premultipliedAlpha&&o.enable(8),T.shadowMapEnabled&&o.enable(9),T.useLegacyLights&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),M.push(o.mask)}function x(M){const T=f[M.type];let F;if(T){const G=ni[T];F=Zu.clone(G.uniforms)}else F=M.uniforms;return F}function w(M,T){let F;for(let G=0,Z=c.length;G<Z;G++){const D=c[G];if(D.cacheKey===T){F=D,++F.usedTimes;break}}return F===void 0&&(F=new Gv(n,T,M,s),c.push(F)),F}function A(M){if(--M.usedTimes===0){const T=c.indexOf(M);c[T]=c[c.length-1],c.pop(),M.destroy()}}function C(M){l.remove(M)}function P(){l.dispose()}return{getParameters:g,getProgramCacheKey:m,getUniforms:x,acquireProgram:w,releaseProgram:A,releaseShaderCache:C,programs:c,dispose:P}}function qv(){let n=new WeakMap;function e(s){let a=n.get(s);return a===void 0&&(a={},n.set(s,a)),a}function t(s){n.delete(s)}function i(s,a,o){n.get(s)[a]=o}function r(){n=new WeakMap}return{get:e,remove:t,update:i,dispose:r}}function Yv(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Xc(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function jc(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function a(d,u,p,f,v,g){let m=n[e];return m===void 0?(m={id:d.id,object:d,geometry:u,material:p,groupOrder:f,renderOrder:d.renderOrder,z:v,group:g},n[e]=m):(m.id=d.id,m.object=d,m.geometry=u,m.material=p,m.groupOrder=f,m.renderOrder=d.renderOrder,m.z=v,m.group=g),e++,m}function o(d,u,p,f,v,g){const m=a(d,u,p,f,v,g);p.transmission>0?i.push(m):p.transparent===!0?r.push(m):t.push(m)}function l(d,u,p,f,v,g){const m=a(d,u,p,f,v,g);p.transmission>0?i.unshift(m):p.transparent===!0?r.unshift(m):t.unshift(m)}function c(d,u){t.length>1&&t.sort(d||Yv),i.length>1&&i.sort(u||Xc),r.length>1&&r.sort(u||Xc)}function h(){for(let d=e,u=n.length;d<u;d++){const p=n[d];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:o,unshift:l,finish:h,sort:c}}function Zv(){let n=new WeakMap;function e(i,r){const s=n.get(i);let a;return s===void 0?(a=new jc,n.set(i,[a])):r>=s.length?(a=new jc,s.push(a)):a=s[r],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function Jv(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new E,color:new oe};break;case"SpotLight":t={position:new E,direction:new E,color:new oe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new E,color:new oe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new E,skyColor:new oe,groundColor:new oe};break;case"RectAreaLight":t={color:new oe,position:new E,halfWidth:new E,halfHeight:new E};break}return n[e.id]=t,t}}}function Kv(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new q};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new q};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new q,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let $v=0;function Qv(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function ey(n,e){const t=new Jv,i=Kv(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)r.probe.push(new E);const s=new E,a=new Fe,o=new Fe;function l(h,d){let u=0,p=0,f=0;for(let G=0;G<9;G++)r.probe[G].set(0,0,0);let v=0,g=0,m=0,_=0,y=0,x=0,w=0,A=0,C=0,P=0,M=0;h.sort(Qv);const T=d===!0?Math.PI:1;for(let G=0,Z=h.length;G<Z;G++){const D=h[G],B=D.color,Y=D.intensity,W=D.distance,te=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)u+=B.r*Y*T,p+=B.g*Y*T,f+=B.b*Y*T;else if(D.isLightProbe){for(let J=0;J<9;J++)r.probe[J].addScaledVector(D.sh.coefficients[J],Y);M++}else if(D.isDirectionalLight){const J=t.get(D);if(J.color.copy(D.color).multiplyScalar(D.intensity*T),D.castShadow){const K=D.shadow,U=i.get(D);U.shadowBias=K.bias,U.shadowNormalBias=K.normalBias,U.shadowRadius=K.radius,U.shadowMapSize=K.mapSize,r.directionalShadow[v]=U,r.directionalShadowMap[v]=te,r.directionalShadowMatrix[v]=D.shadow.matrix,x++}r.directional[v]=J,v++}else if(D.isSpotLight){const J=t.get(D);J.position.setFromMatrixPosition(D.matrixWorld),J.color.copy(B).multiplyScalar(Y*T),J.distance=W,J.coneCos=Math.cos(D.angle),J.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),J.decay=D.decay,r.spot[m]=J;const K=D.shadow;if(D.map&&(r.spotLightMap[C]=D.map,C++,K.updateMatrices(D),D.castShadow&&P++),r.spotLightMatrix[m]=K.matrix,D.castShadow){const U=i.get(D);U.shadowBias=K.bias,U.shadowNormalBias=K.normalBias,U.shadowRadius=K.radius,U.shadowMapSize=K.mapSize,r.spotShadow[m]=U,r.spotShadowMap[m]=te,A++}m++}else if(D.isRectAreaLight){const J=t.get(D);J.color.copy(B).multiplyScalar(Y),J.halfWidth.set(D.width*.5,0,0),J.halfHeight.set(0,D.height*.5,0),r.rectArea[_]=J,_++}else if(D.isPointLight){const J=t.get(D);if(J.color.copy(D.color).multiplyScalar(D.intensity*T),J.distance=D.distance,J.decay=D.decay,D.castShadow){const K=D.shadow,U=i.get(D);U.shadowBias=K.bias,U.shadowNormalBias=K.normalBias,U.shadowRadius=K.radius,U.shadowMapSize=K.mapSize,U.shadowCameraNear=K.camera.near,U.shadowCameraFar=K.camera.far,r.pointShadow[g]=U,r.pointShadowMap[g]=te,r.pointShadowMatrix[g]=D.shadow.matrix,w++}r.point[g]=J,g++}else if(D.isHemisphereLight){const J=t.get(D);J.skyColor.copy(D.color).multiplyScalar(Y*T),J.groundColor.copy(D.groundColor).multiplyScalar(Y*T),r.hemi[y]=J,y++}}_>0&&(e.isWebGL2||n.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=de.LTC_FLOAT_1,r.rectAreaLTC2=de.LTC_FLOAT_2):n.has("OES_texture_half_float_linear")===!0?(r.rectAreaLTC1=de.LTC_HALF_1,r.rectAreaLTC2=de.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),r.ambient[0]=u,r.ambient[1]=p,r.ambient[2]=f;const F=r.hash;(F.directionalLength!==v||F.pointLength!==g||F.spotLength!==m||F.rectAreaLength!==_||F.hemiLength!==y||F.numDirectionalShadows!==x||F.numPointShadows!==w||F.numSpotShadows!==A||F.numSpotMaps!==C||F.numLightProbes!==M)&&(r.directional.length=v,r.spot.length=m,r.rectArea.length=_,r.point.length=g,r.hemi.length=y,r.directionalShadow.length=x,r.directionalShadowMap.length=x,r.pointShadow.length=w,r.pointShadowMap.length=w,r.spotShadow.length=A,r.spotShadowMap.length=A,r.directionalShadowMatrix.length=x,r.pointShadowMatrix.length=w,r.spotLightMatrix.length=A+C-P,r.spotLightMap.length=C,r.numSpotLightShadowsWithMaps=P,r.numLightProbes=M,F.directionalLength=v,F.pointLength=g,F.spotLength=m,F.rectAreaLength=_,F.hemiLength=y,F.numDirectionalShadows=x,F.numPointShadows=w,F.numSpotShadows=A,F.numSpotMaps=C,F.numLightProbes=M,r.version=$v++)}function c(h,d){let u=0,p=0,f=0,v=0,g=0;const m=d.matrixWorldInverse;for(let _=0,y=h.length;_<y;_++){const x=h[_];if(x.isDirectionalLight){const w=r.directional[u];w.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(m),u++}else if(x.isSpotLight){const w=r.spot[f];w.position.setFromMatrixPosition(x.matrixWorld),w.position.applyMatrix4(m),w.direction.setFromMatrixPosition(x.matrixWorld),s.setFromMatrixPosition(x.target.matrixWorld),w.direction.sub(s),w.direction.transformDirection(m),f++}else if(x.isRectAreaLight){const w=r.rectArea[v];w.position.setFromMatrixPosition(x.matrixWorld),w.position.applyMatrix4(m),o.identity(),a.copy(x.matrixWorld),a.premultiply(m),o.extractRotation(a),w.halfWidth.set(x.width*.5,0,0),w.halfHeight.set(0,x.height*.5,0),w.halfWidth.applyMatrix4(o),w.halfHeight.applyMatrix4(o),v++}else if(x.isPointLight){const w=r.point[p];w.position.setFromMatrixPosition(x.matrixWorld),w.position.applyMatrix4(m),p++}else if(x.isHemisphereLight){const w=r.hemi[g];w.direction.setFromMatrixPosition(x.matrixWorld),w.direction.transformDirection(m),g++}}}return{setup:l,setupView:c,state:r}}function qc(n,e){const t=new ey(n,e),i=[],r=[];function s(){i.length=0,r.length=0}function a(h){i.push(h)}function o(h){r.push(h)}function l(h){t.setup(i,h)}function c(h){t.setupView(i,h)}return{init:s,state:{lightsArray:i,shadowsArray:r,lights:t},setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function ty(n,e){let t=new WeakMap;function i(s,a=0){const o=t.get(s);let l;return o===void 0?(l=new qc(n,e),t.set(s,[l])):a>=o.length?(l=new qc(n,e),o.push(l)):l=o[a],l}function r(){t=new WeakMap}return{get:i,dispose:r}}class Fl extends Ut{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Iu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class zl extends Ut{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const iy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ry=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function sy(n,e,t){let i=new wa;const r=new q,s=new q,a=new et,o=new Fl({depthPacking:Du}),l=new zl,c={},h=t.maxTextureSize,d={[Ni]:Bt,[Bt]:Ni,[pi]:pi},u=new Dt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new q},radius:{value:4}},vertexShader:iy,fragmentShader:ry}),p=u.clone();p.defines.HORIZONTAL_PASS=1;const f=new Re;f.setAttribute("position",new Pe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new at(f,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ml;let m=this.type;this.render=function(w,A,C){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||w.length===0)return;const P=n.getRenderTarget(),M=n.getActiveCubeFace(),T=n.getActiveMipmapLevel(),F=n.state;F.setBlending(Ii),F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const G=m!==di&&this.type===di,Z=m===di&&this.type!==di;for(let D=0,B=w.length;D<B;D++){const Y=w[D],W=Y.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;r.copy(W.mapSize);const te=W.getFrameExtents();if(r.multiply(te),s.copy(W.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/te.x),r.x=s.x*te.x,W.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/te.y),r.y=s.y*te.y,W.mapSize.y=s.y)),W.map===null||G===!0||Z===!0){const K=this.type!==di?{minFilter:dt,magFilter:dt}:{};W.map!==null&&W.map.dispose(),W.map=new ai(r.x,r.y,K),W.map.texture.name=Y.name+".shadowMap",W.camera.updateProjectionMatrix()}n.setRenderTarget(W.map),n.clear();const J=W.getViewportCount();for(let K=0;K<J;K++){const U=W.getViewport(K);a.set(s.x*U.x,s.y*U.y,s.x*U.z,s.y*U.w),F.viewport(a),W.updateMatrices(Y,K),i=W.getFrustum(),x(A,C,W.camera,Y,this.type)}W.isPointLightShadow!==!0&&this.type===di&&_(W,C),W.needsUpdate=!1}m=this.type,g.needsUpdate=!1,n.setRenderTarget(P,M,T)};function _(w,A){const C=e.update(v);u.defines.VSM_SAMPLES!==w.blurSamples&&(u.defines.VSM_SAMPLES=w.blurSamples,p.defines.VSM_SAMPLES=w.blurSamples,u.needsUpdate=!0,p.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new ai(r.x,r.y)),u.uniforms.shadow_pass.value=w.map.texture,u.uniforms.resolution.value=w.mapSize,u.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(A,null,C,u,v,null),p.uniforms.shadow_pass.value=w.mapPass.texture,p.uniforms.resolution.value=w.mapSize,p.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(A,null,C,p,v,null)}function y(w,A,C,P){let M=null;const T=C.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(T!==void 0)M=T;else if(M=C.isPointLight===!0?l:o,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const F=M.uuid,G=A.uuid;let Z=c[F];Z===void 0&&(Z={},c[F]=Z);let D=Z[G];D===void 0&&(D=M.clone(),Z[G]=D),M=D}if(M.visible=A.visible,M.wireframe=A.wireframe,P===di?M.side=A.shadowSide!==null?A.shadowSide:A.side:M.side=A.shadowSide!==null?A.shadowSide:d[A.side],M.alphaMap=A.alphaMap,M.alphaTest=A.alphaTest,M.map=A.map,M.clipShadows=A.clipShadows,M.clippingPlanes=A.clippingPlanes,M.clipIntersection=A.clipIntersection,M.displacementMap=A.displacementMap,M.displacementScale=A.displacementScale,M.displacementBias=A.displacementBias,M.wireframeLinewidth=A.wireframeLinewidth,M.linewidth=A.linewidth,C.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const F=n.properties.get(M);F.light=C}return M}function x(w,A,C,P,M){if(w.visible===!1)return;if(w.layers.test(A.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&M===di)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,w.matrixWorld);const F=e.update(w),G=w.material;if(Array.isArray(G)){const Z=F.groups;for(let D=0,B=Z.length;D<B;D++){const Y=Z[D],W=G[Y.materialIndex];if(W&&W.visible){const te=y(w,W,P,M);n.renderBufferDirect(C,null,F,te,w,Y)}}}else if(G.visible){const Z=y(w,G,P,M);n.renderBufferDirect(C,null,F,Z,w,null)}}const T=w.children;for(let F=0,G=T.length;F<G;F++)x(T[F],A,C,P,M)}}function ny(n,e,t){const i=t.isWebGL2;function r(){let I=!1;const me=new et;let re=null;const X=new et(0,0,0,0);return{setMask:function(ce){re!==ce&&!I&&(n.colorMask(ce,ce,ce,ce),re=ce)},setLocked:function(ce){I=ce},setClear:function(ce,Se,it,Tt,$t){$t===!0&&(ce*=Tt,Se*=Tt,it*=Tt),me.set(ce,Se,it,Tt),X.equals(me)===!1&&(n.clearColor(ce,Se,it,Tt),X.copy(me))},reset:function(){I=!1,re=null,X.set(-1,0,0,0)}}}function s(){let I=!1,me=null,re=null,X=null;return{setTest:function(ce){ce?Ae(n.DEPTH_TEST):Ze(n.DEPTH_TEST)},setMask:function(ce){me!==ce&&!I&&(n.depthMask(ce),me=ce)},setFunc:function(ce){if(re!==ce){switch(ce){case nu:n.depthFunc(n.NEVER);break;case au:n.depthFunc(n.ALWAYS);break;case ou:n.depthFunc(n.LESS);break;case Ds:n.depthFunc(n.LEQUAL);break;case lu:n.depthFunc(n.EQUAL);break;case cu:n.depthFunc(n.GEQUAL);break;case hu:n.depthFunc(n.GREATER);break;case uu:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}re=ce}},setLocked:function(ce){I=ce},setClear:function(ce){X!==ce&&(n.clearDepth(ce),X=ce)},reset:function(){I=!1,me=null,re=null,X=null}}}function a(){let I=!1,me=null,re=null,X=null,ce=null,Se=null,it=null,Tt=null,$t=null;return{setTest:function(rt){I||(rt?Ae(n.STENCIL_TEST):Ze(n.STENCIL_TEST))},setMask:function(rt){me!==rt&&!I&&(n.stencilMask(rt),me=rt)},setFunc:function(rt,Nt,ui){(re!==rt||X!==Nt||ce!==ui)&&(n.stencilFunc(rt,Nt,ui),re=rt,X=Nt,ce=ui)},setOp:function(rt,Nt,ui){(Se!==rt||it!==Nt||Tt!==ui)&&(n.stencilOp(rt,Nt,ui),Se=rt,it=Nt,Tt=ui)},setLocked:function(rt){I=rt},setClear:function(rt){$t!==rt&&(n.clearStencil(rt),$t=rt)},reset:function(){I=!1,me=null,re=null,X=null,ce=null,Se=null,it=null,Tt=null,$t=null}}}const o=new r,l=new s,c=new a,h=new WeakMap,d=new WeakMap;let u={},p={},f=new WeakMap,v=[],g=null,m=!1,_=null,y=null,x=null,w=null,A=null,C=null,P=null,M=new oe(0,0,0),T=0,F=!1,G=null,Z=null,D=null,B=null,Y=null;const W=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let te=!1,J=0;const K=n.getParameter(n.VERSION);K.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(K)[1]),te=J>=1):K.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),te=J>=2);let U=null,V={};const le=n.getParameter(n.SCISSOR_BOX),ve=n.getParameter(n.VIEWPORT),we=new et().fromArray(le),Me=new et().fromArray(ve);function He(I,me,re,X){const ce=new Uint8Array(4),Se=n.createTexture();n.bindTexture(I,Se),n.texParameteri(I,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(I,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let it=0;it<re;it++)i&&(I===n.TEXTURE_3D||I===n.TEXTURE_2D_ARRAY)?n.texImage3D(me,0,n.RGBA,1,1,X,0,n.RGBA,n.UNSIGNED_BYTE,ce):n.texImage2D(me+it,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ce);return Se}const De={};De[n.TEXTURE_2D]=He(n.TEXTURE_2D,n.TEXTURE_2D,1),De[n.TEXTURE_CUBE_MAP]=He(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(De[n.TEXTURE_2D_ARRAY]=He(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),De[n.TEXTURE_3D]=He(n.TEXTURE_3D,n.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Ae(n.DEPTH_TEST),l.setFunc(Ds),_e(!1),be(Do),Ae(n.CULL_FACE),pe(Ii);function Ae(I){u[I]!==!0&&(n.enable(I),u[I]=!0)}function Ze(I){u[I]!==!1&&(n.disable(I),u[I]=!1)}function j(I,me){return p[I]!==me?(n.bindFramebuffer(I,me),p[I]=me,i&&(I===n.DRAW_FRAMEBUFFER&&(p[n.FRAMEBUFFER]=me),I===n.FRAMEBUFFER&&(p[n.DRAW_FRAMEBUFFER]=me)),!0):!1}function L(I,me){let re=v,X=!1;if(I)if(re=f.get(me),re===void 0&&(re=[],f.set(me,re)),I.isWebGLMultipleRenderTargets){const ce=I.texture;if(re.length!==ce.length||re[0]!==n.COLOR_ATTACHMENT0){for(let Se=0,it=ce.length;Se<it;Se++)re[Se]=n.COLOR_ATTACHMENT0+Se;re.length=ce.length,X=!0}}else re[0]!==n.COLOR_ATTACHMENT0&&(re[0]=n.COLOR_ATTACHMENT0,X=!0);else re[0]!==n.BACK&&(re[0]=n.BACK,X=!0);X&&(t.isWebGL2?n.drawBuffers(re):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(re))}function he(I){return g!==I?(n.useProgram(I),g=I,!0):!1}const Q={[Zi]:n.FUNC_ADD,[Wh]:n.FUNC_SUBTRACT,[Xh]:n.FUNC_REVERSE_SUBTRACT};if(i)Q[Oo]=n.MIN,Q[Fo]=n.MAX;else{const I=e.get("EXT_blend_minmax");I!==null&&(Q[Oo]=I.MIN_EXT,Q[Fo]=I.MAX_EXT)}const $={[jh]:n.ZERO,[qh]:n.ONE,[Yh]:n.SRC_COLOR,[ha]:n.SRC_ALPHA,[eu]:n.SRC_ALPHA_SATURATE,[$h]:n.DST_COLOR,[Jh]:n.DST_ALPHA,[Zh]:n.ONE_MINUS_SRC_COLOR,[ua]:n.ONE_MINUS_SRC_ALPHA,[Qh]:n.ONE_MINUS_DST_COLOR,[Kh]:n.ONE_MINUS_DST_ALPHA,[tu]:n.CONSTANT_COLOR,[iu]:n.ONE_MINUS_CONSTANT_COLOR,[ru]:n.CONSTANT_ALPHA,[su]:n.ONE_MINUS_CONSTANT_ALPHA};function pe(I,me,re,X,ce,Se,it,Tt,$t,rt){if(I===Ii){m===!0&&(Ze(n.BLEND),m=!1);return}if(m===!1&&(Ae(n.BLEND),m=!0),I!==Vh){if(I!==_||rt!==F){if((y!==Zi||A!==Zi)&&(n.blendEquation(n.FUNC_ADD),y=Zi,A=Zi),rt)switch(I){case Sr:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case vi:n.blendFunc(n.ONE,n.ONE);break;case Uo:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case No:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case Sr:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case vi:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Uo:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case No:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}x=null,w=null,C=null,P=null,M.set(0,0,0),T=0,_=I,F=rt}return}ce=ce||me,Se=Se||re,it=it||X,(me!==y||ce!==A)&&(n.blendEquationSeparate(Q[me],Q[ce]),y=me,A=ce),(re!==x||X!==w||Se!==C||it!==P)&&(n.blendFuncSeparate($[re],$[X],$[Se],$[it]),x=re,w=X,C=Se,P=it),(Tt.equals(M)===!1||$t!==T)&&(n.blendColor(Tt.r,Tt.g,Tt.b,$t),M.copy(Tt),T=$t),_=I,F=!1}function Ee(I,me){I.side===pi?Ze(n.CULL_FACE):Ae(n.CULL_FACE);let re=I.side===Bt;me&&(re=!re),_e(re),I.blending===Sr&&I.transparent===!1?pe(Ii):pe(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),l.setFunc(I.depthFunc),l.setTest(I.depthTest),l.setMask(I.depthWrite),o.setMask(I.colorWrite);const X=I.stencilWrite;c.setTest(X),X&&(c.setMask(I.stencilWriteMask),c.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),c.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),ot(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?Ae(n.SAMPLE_ALPHA_TO_COVERAGE):Ze(n.SAMPLE_ALPHA_TO_COVERAGE)}function _e(I){G!==I&&(I?n.frontFace(n.CW):n.frontFace(n.CCW),G=I)}function be(I){I!==Hh?(Ae(n.CULL_FACE),I!==Z&&(I===Do?n.cullFace(n.BACK):I===Gh?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Ze(n.CULL_FACE),Z=I}function Ue(I){I!==D&&(te&&n.lineWidth(I),D=I)}function ot(I,me,re){I?(Ae(n.POLYGON_OFFSET_FILL),(B!==me||Y!==re)&&(n.polygonOffset(me,re),B=me,Y=re)):Ze(n.POLYGON_OFFSET_FILL)}function ft(I){I?Ae(n.SCISSOR_TEST):Ze(n.SCISSOR_TEST)}function R(I){I===void 0&&(I=n.TEXTURE0+W-1),U!==I&&(n.activeTexture(I),U=I)}function b(I,me,re){re===void 0&&(U===null?re=n.TEXTURE0+W-1:re=U);let X=V[re];X===void 0&&(X={type:void 0,texture:void 0},V[re]=X),(X.type!==I||X.texture!==me)&&(U!==re&&(n.activeTexture(re),U=re),n.bindTexture(I,me||De[I]),X.type=I,X.texture=me)}function O(){const I=V[U];I!==void 0&&I.type!==void 0&&(n.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function se(){try{n.compressedTexImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ee(){try{n.compressedTexImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ie(){try{n.texSubImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function xe(){try{n.texSubImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ne(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ge(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ie(){try{n.texStorage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function $e(){try{n.texStorage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ae(){try{n.texImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function tt(){try{n.texImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ze(I){we.equals(I)===!1&&(n.scissor(I.x,I.y,I.z,I.w),we.copy(I))}function Ne(I){Me.equals(I)===!1&&(n.viewport(I.x,I.y,I.z,I.w),Me.copy(I))}function Ce(I,me){let re=d.get(me);re===void 0&&(re=new WeakMap,d.set(me,re));let X=re.get(I);X===void 0&&(X=n.getUniformBlockIndex(me,I.name),re.set(I,X))}function ye(I,me){const re=d.get(me).get(I);h.get(me)!==re&&(n.uniformBlockBinding(me,re,I.__bindingPointIndex),h.set(me,re))}function qe(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),i===!0&&(n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null)),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),u={},U=null,V={},p={},f=new WeakMap,v=[],g=null,m=!1,_=null,y=null,x=null,w=null,A=null,C=null,P=null,M=new oe(0,0,0),T=0,F=!1,G=null,Z=null,D=null,B=null,Y=null,we.set(0,0,n.canvas.width,n.canvas.height),Me.set(0,0,n.canvas.width,n.canvas.height),o.reset(),l.reset(),c.reset()}return{buffers:{color:o,depth:l,stencil:c},enable:Ae,disable:Ze,bindFramebuffer:j,drawBuffers:L,useProgram:he,setBlending:pe,setMaterial:Ee,setFlipSided:_e,setCullFace:be,setLineWidth:Ue,setPolygonOffset:ot,setScissorTest:ft,activeTexture:R,bindTexture:b,unbindTexture:O,compressedTexImage2D:se,compressedTexImage3D:ee,texImage2D:ae,texImage3D:tt,updateUBOMapping:Ce,uniformBlockBinding:ye,texStorage2D:Ie,texStorage3D:$e,texSubImage2D:ie,texSubImage3D:xe,compressedTexSubImage2D:ne,compressedTexSubImage3D:ge,scissor:ze,viewport:Ne,reset:qe}}function ay(n,e,t,i,r,s,a){const o=r.isWebGL2,l=r.maxTextures,c=r.maxCubemapSize,h=r.maxTextureSize,d=r.maxSamples,u=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,p=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),f=new WeakMap;let v;const g=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch(R){}function _(R,b){return m?new OffscreenCanvas(R,b):js("canvas")}function y(R,b,O,se){let ee=1;if((R.width>se||R.height>se)&&(ee=se/Math.max(R.width,R.height)),ee<1||b===!0)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap){const ie=b?ma:Math.floor,xe=ie(ee*R.width),ne=ie(ee*R.height);v===void 0&&(v=_(xe,ne));const ge=O?_(xe,ne):v;return ge.width=xe,ge.height=ne,ge.getContext("2d").drawImage(R,0,0,xe,ne),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+R.width+"x"+R.height+") to ("+xe+"x"+ne+")."),ge}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+R.width+"x"+R.height+")."),R;return R}function x(R){return dl(R.width)&&dl(R.height)}function w(R){return o?!1:R.wrapS!==It||R.wrapT!==It||R.minFilter!==dt&&R.minFilter!==pt}function A(R,b){return R.generateMipmaps&&b&&R.minFilter!==dt&&R.minFilter!==pt}function C(R){n.generateMipmap(R)}function P(R,b,O,se,ee=!1){if(o===!1)return b;if(R!==null){if(n[R]!==void 0)return n[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let ie=b;if(b===n.RED&&(O===n.FLOAT&&(ie=n.R32F),O===n.HALF_FLOAT&&(ie=n.R16F),O===n.UNSIGNED_BYTE&&(ie=n.R8)),b===n.RED_INTEGER&&(O===n.UNSIGNED_BYTE&&(ie=n.R8UI),O===n.UNSIGNED_SHORT&&(ie=n.R16UI),O===n.UNSIGNED_INT&&(ie=n.R32UI),O===n.BYTE&&(ie=n.R8I),O===n.SHORT&&(ie=n.R16I),O===n.INT&&(ie=n.R32I)),b===n.RG&&(O===n.FLOAT&&(ie=n.RG32F),O===n.HALF_FLOAT&&(ie=n.RG16F),O===n.UNSIGNED_BYTE&&(ie=n.RG8)),b===n.RGBA){const xe=ee?Hs:Qe.getTransfer(se);O===n.FLOAT&&(ie=n.RGBA32F),O===n.HALF_FLOAT&&(ie=n.RGBA16F),O===n.UNSIGNED_BYTE&&(ie=xe===nt?n.SRGB8_ALPHA8:n.RGBA8),O===n.UNSIGNED_SHORT_4_4_4_4&&(ie=n.RGBA4),O===n.UNSIGNED_SHORT_5_5_5_1&&(ie=n.RGB5_A1)}return(ie===n.R16F||ie===n.R32F||ie===n.RG16F||ie===n.RG32F||ie===n.RGBA16F||ie===n.RGBA32F)&&e.get("EXT_color_buffer_float"),ie}function M(R,b,O){return A(R,O)===!0||R.isFramebufferTexture&&R.minFilter!==dt&&R.minFilter!==pt?Math.log2(Math.max(b.width,b.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?b.mipmaps.length:1}function T(R){return R===dt||R===da||R===Rs?n.NEAREST:n.LINEAR}function F(R){const b=R.target;b.removeEventListener("dispose",F),Z(b),b.isVideoTexture&&f.delete(b)}function G(R){const b=R.target;b.removeEventListener("dispose",G),B(b)}function Z(R){const b=i.get(R);if(b.__webglInit===void 0)return;const O=R.source,se=g.get(O);if(se){const ee=se[b.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&D(R),Object.keys(se).length===0&&g.delete(O)}i.remove(R)}function D(R){const b=i.get(R);n.deleteTexture(b.__webglTexture);const O=R.source,se=g.get(O);delete se[b.__cacheKey],a.memory.textures--}function B(R){const b=R.texture,O=i.get(R),se=i.get(b);if(se.__webglTexture!==void 0&&(n.deleteTexture(se.__webglTexture),a.memory.textures--),R.depthTexture&&R.depthTexture.dispose(),R.isWebGLCubeRenderTarget)for(let ee=0;ee<6;ee++){if(Array.isArray(O.__webglFramebuffer[ee]))for(let ie=0;ie<O.__webglFramebuffer[ee].length;ie++)n.deleteFramebuffer(O.__webglFramebuffer[ee][ie]);else n.deleteFramebuffer(O.__webglFramebuffer[ee]);O.__webglDepthbuffer&&n.deleteRenderbuffer(O.__webglDepthbuffer[ee])}else{if(Array.isArray(O.__webglFramebuffer))for(let ee=0;ee<O.__webglFramebuffer.length;ee++)n.deleteFramebuffer(O.__webglFramebuffer[ee]);else n.deleteFramebuffer(O.__webglFramebuffer);if(O.__webglDepthbuffer&&n.deleteRenderbuffer(O.__webglDepthbuffer),O.__webglMultisampledFramebuffer&&n.deleteFramebuffer(O.__webglMultisampledFramebuffer),O.__webglColorRenderbuffer)for(let ee=0;ee<O.__webglColorRenderbuffer.length;ee++)O.__webglColorRenderbuffer[ee]&&n.deleteRenderbuffer(O.__webglColorRenderbuffer[ee]);O.__webglDepthRenderbuffer&&n.deleteRenderbuffer(O.__webglDepthRenderbuffer)}if(R.isWebGLMultipleRenderTargets)for(let ee=0,ie=b.length;ee<ie;ee++){const xe=i.get(b[ee]);xe.__webglTexture&&(n.deleteTexture(xe.__webglTexture),a.memory.textures--),i.remove(b[ee])}i.remove(b),i.remove(R)}let Y=0;function W(){Y=0}function te(){const R=Y;return R>=l&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+l),Y+=1,R}function J(R){const b=[];return b.push(R.wrapS),b.push(R.wrapT),b.push(R.wrapR||0),b.push(R.magFilter),b.push(R.minFilter),b.push(R.anisotropy),b.push(R.internalFormat),b.push(R.format),b.push(R.type),b.push(R.generateMipmaps),b.push(R.premultiplyAlpha),b.push(R.flipY),b.push(R.unpackAlignment),b.push(R.colorSpace),b.join()}function K(R,b){const O=i.get(R);if(R.isVideoTexture&&ot(R),R.isRenderTargetTexture===!1&&R.version>0&&O.__version!==R.version){const se=R.image;if(se===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(se.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Ae(O,R,b);return}}t.bindTexture(n.TEXTURE_2D,O.__webglTexture,n.TEXTURE0+b)}function U(R,b){const O=i.get(R);if(R.version>0&&O.__version!==R.version){Ae(O,R,b);return}t.bindTexture(n.TEXTURE_2D_ARRAY,O.__webglTexture,n.TEXTURE0+b)}function V(R,b){const O=i.get(R);if(R.version>0&&O.__version!==R.version){Ae(O,R,b);return}t.bindTexture(n.TEXTURE_3D,O.__webglTexture,n.TEXTURE0+b)}function le(R,b){const O=i.get(R);if(R.version>0&&O.__version!==R.version){Ze(O,R,b);return}t.bindTexture(n.TEXTURE_CUBE_MAP,O.__webglTexture,n.TEXTURE0+b)}const ve={[Os]:n.REPEAT,[It]:n.CLAMP_TO_EDGE,[Fs]:n.MIRRORED_REPEAT},we={[dt]:n.NEAREST,[da]:n.NEAREST_MIPMAP_NEAREST,[Rs]:n.NEAREST_MIPMAP_LINEAR,[pt]:n.LINEAR,[bl]:n.LINEAR_MIPMAP_NEAREST,[er]:n.LINEAR_MIPMAP_LINEAR},Me={[Nu]:n.NEVER,[Gu]:n.ALWAYS,[Ou]:n.LESS,[zu]:n.LEQUAL,[Fu]:n.EQUAL,[Hu]:n.GEQUAL,[Bu]:n.GREATER,[ku]:n.NOTEQUAL};function He(R,b,O){if(O?(n.texParameteri(R,n.TEXTURE_WRAP_S,ve[b.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,ve[b.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,ve[b.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,we[b.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,we[b.minFilter])):(n.texParameteri(R,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(R,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,n.CLAMP_TO_EDGE),(b.wrapS!==It||b.wrapT!==It)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),n.texParameteri(R,n.TEXTURE_MAG_FILTER,T(b.magFilter)),n.texParameteri(R,n.TEXTURE_MIN_FILTER,T(b.minFilter)),b.minFilter!==dt&&b.minFilter!==pt&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),b.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,Me[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const se=e.get("EXT_texture_filter_anisotropic");if(b.magFilter===dt||b.minFilter!==Rs&&b.minFilter!==er||b.type===mi&&e.has("OES_texture_float_linear")===!1||o===!1&&b.type===as&&e.has("OES_texture_half_float_linear")===!1)return;(b.anisotropy>1||i.get(b).__currentAnisotropy)&&(n.texParameterf(R,se.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,r.getMaxAnisotropy())),i.get(b).__currentAnisotropy=b.anisotropy)}}function De(R,b){let O=!1;R.__webglInit===void 0&&(R.__webglInit=!0,b.addEventListener("dispose",F));const se=b.source;let ee=g.get(se);ee===void 0&&(ee={},g.set(se,ee));const ie=J(b);if(ie!==R.__cacheKey){ee[ie]===void 0&&(ee[ie]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,O=!0),ee[ie].usedTimes++;const xe=ee[R.__cacheKey];xe!==void 0&&(ee[R.__cacheKey].usedTimes--,xe.usedTimes===0&&D(b)),R.__cacheKey=ie,R.__webglTexture=ee[ie].texture}return O}function Ae(R,b,O){let se=n.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(se=n.TEXTURE_2D_ARRAY),b.isData3DTexture&&(se=n.TEXTURE_3D);const ee=De(R,b),ie=b.source;t.bindTexture(se,R.__webglTexture,n.TEXTURE0+O);const xe=i.get(ie);if(ie.version!==xe.__version||ee===!0){t.activeTexture(n.TEXTURE0+O);const ne=Qe.getPrimaries(Qe.workingColorSpace),ge=b.colorSpace===Jt?null:Qe.getPrimaries(b.colorSpace),Ie=b.colorSpace===Jt||ne===ge?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,b.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,b.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ie);const $e=w(b)&&x(b.image)===!1;let ae=y(b.image,$e,!1,h);ae=ft(b,ae);const tt=x(ae)||o,ze=s.convert(b.format,b.colorSpace);let Ne=s.convert(b.type),Ce=P(b.internalFormat,ze,Ne,b.colorSpace,b.isVideoTexture);He(se,b,tt);let ye;const qe=b.mipmaps,I=o&&b.isVideoTexture!==!0,me=xe.__version===void 0||ee===!0,re=M(b,ae,tt);if(b.isDepthTexture)Ce=n.DEPTH_COMPONENT,o?b.type===mi?Ce=n.DEPTH_COMPONENT32F:b.type===Li?Ce=n.DEPTH_COMPONENT24:b.type===Ji?Ce=n.DEPTH24_STENCIL8:Ce=n.DEPTH_COMPONENT16:b.type===mi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),b.format===Ki&&Ce===n.DEPTH_COMPONENT&&b.type!==ya&&b.type!==Li&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),b.type=Li,Ne=s.convert(b.type)),b.format===Tr&&Ce===n.DEPTH_COMPONENT&&(Ce=n.DEPTH_STENCIL,b.type!==Ji&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),b.type=Ji,Ne=s.convert(b.type))),me&&(I?t.texStorage2D(n.TEXTURE_2D,1,Ce,ae.width,ae.height):t.texImage2D(n.TEXTURE_2D,0,Ce,ae.width,ae.height,0,ze,Ne,null));else if(b.isDataTexture)if(qe.length>0&&tt){I&&me&&t.texStorage2D(n.TEXTURE_2D,re,Ce,qe[0].width,qe[0].height);for(let X=0,ce=qe.length;X<ce;X++)ye=qe[X],I?t.texSubImage2D(n.TEXTURE_2D,X,0,0,ye.width,ye.height,ze,Ne,ye.data):t.texImage2D(n.TEXTURE_2D,X,Ce,ye.width,ye.height,0,ze,Ne,ye.data);b.generateMipmaps=!1}else I?(me&&t.texStorage2D(n.TEXTURE_2D,re,Ce,ae.width,ae.height),t.texSubImage2D(n.TEXTURE_2D,0,0,0,ae.width,ae.height,ze,Ne,ae.data)):t.texImage2D(n.TEXTURE_2D,0,Ce,ae.width,ae.height,0,ze,Ne,ae.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){I&&me&&t.texStorage3D(n.TEXTURE_2D_ARRAY,re,Ce,qe[0].width,qe[0].height,ae.depth);for(let X=0,ce=qe.length;X<ce;X++)ye=qe[X],b.format!==Zt?ze!==null?I?t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,X,0,0,0,ye.width,ye.height,ae.depth,ze,ye.data,0,0):t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,X,Ce,ye.width,ye.height,ae.depth,0,ye.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):I?t.texSubImage3D(n.TEXTURE_2D_ARRAY,X,0,0,0,ye.width,ye.height,ae.depth,ze,Ne,ye.data):t.texImage3D(n.TEXTURE_2D_ARRAY,X,Ce,ye.width,ye.height,ae.depth,0,ze,Ne,ye.data)}else{I&&me&&t.texStorage2D(n.TEXTURE_2D,re,Ce,qe[0].width,qe[0].height);for(let X=0,ce=qe.length;X<ce;X++)ye=qe[X],b.format!==Zt?ze!==null?I?t.compressedTexSubImage2D(n.TEXTURE_2D,X,0,0,ye.width,ye.height,ze,ye.data):t.compressedTexImage2D(n.TEXTURE_2D,X,Ce,ye.width,ye.height,0,ye.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):I?t.texSubImage2D(n.TEXTURE_2D,X,0,0,ye.width,ye.height,ze,Ne,ye.data):t.texImage2D(n.TEXTURE_2D,X,Ce,ye.width,ye.height,0,ze,Ne,ye.data)}else if(b.isDataArrayTexture)I?(me&&t.texStorage3D(n.TEXTURE_2D_ARRAY,re,Ce,ae.width,ae.height,ae.depth),t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ae.width,ae.height,ae.depth,ze,Ne,ae.data)):t.texImage3D(n.TEXTURE_2D_ARRAY,0,Ce,ae.width,ae.height,ae.depth,0,ze,Ne,ae.data);else if(b.isData3DTexture)I?(me&&t.texStorage3D(n.TEXTURE_3D,re,Ce,ae.width,ae.height,ae.depth),t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ae.width,ae.height,ae.depth,ze,Ne,ae.data)):t.texImage3D(n.TEXTURE_3D,0,Ce,ae.width,ae.height,ae.depth,0,ze,Ne,ae.data);else if(b.isFramebufferTexture){if(me)if(I)t.texStorage2D(n.TEXTURE_2D,re,Ce,ae.width,ae.height);else{let X=ae.width,ce=ae.height;for(let Se=0;Se<re;Se++)t.texImage2D(n.TEXTURE_2D,Se,Ce,X,ce,0,ze,Ne,null),X>>=1,ce>>=1}}else if(qe.length>0&&tt){I&&me&&t.texStorage2D(n.TEXTURE_2D,re,Ce,qe[0].width,qe[0].height);for(let X=0,ce=qe.length;X<ce;X++)ye=qe[X],I?t.texSubImage2D(n.TEXTURE_2D,X,0,0,ze,Ne,ye):t.texImage2D(n.TEXTURE_2D,X,Ce,ze,Ne,ye);b.generateMipmaps=!1}else I?(me&&t.texStorage2D(n.TEXTURE_2D,re,Ce,ae.width,ae.height),t.texSubImage2D(n.TEXTURE_2D,0,0,0,ze,Ne,ae)):t.texImage2D(n.TEXTURE_2D,0,Ce,ze,Ne,ae);A(b,tt)&&C(se),xe.__version=ie.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}function Ze(R,b,O){if(b.image.length!==6)return;const se=De(R,b),ee=b.source;t.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+O);const ie=i.get(ee);if(ee.version!==ie.__version||se===!0){t.activeTexture(n.TEXTURE0+O);const xe=Qe.getPrimaries(Qe.workingColorSpace),ne=b.colorSpace===Jt?null:Qe.getPrimaries(b.colorSpace),ge=b.colorSpace===Jt||xe===ne?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,b.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,b.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ge);const Ie=b.isCompressedTexture||b.image[0].isCompressedTexture,$e=b.image[0]&&b.image[0].isDataTexture,ae=[];for(let X=0;X<6;X++)!Ie&&!$e?ae[X]=y(b.image[X],!1,!0,c):ae[X]=$e?b.image[X].image:b.image[X],ae[X]=ft(b,ae[X]);const tt=ae[0],ze=x(tt)||o,Ne=s.convert(b.format,b.colorSpace),Ce=s.convert(b.type),ye=P(b.internalFormat,Ne,Ce,b.colorSpace),qe=o&&b.isVideoTexture!==!0,I=ie.__version===void 0||se===!0;let me=M(b,tt,ze);He(n.TEXTURE_CUBE_MAP,b,ze);let re;if(Ie){qe&&I&&t.texStorage2D(n.TEXTURE_CUBE_MAP,me,ye,tt.width,tt.height);for(let X=0;X<6;X++){re=ae[X].mipmaps;for(let ce=0;ce<re.length;ce++){const Se=re[ce];b.format!==Zt?Ne!==null?qe?t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,ce,0,0,Se.width,Se.height,Ne,Se.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,ce,ye,Se.width,Se.height,0,Se.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):qe?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,ce,0,0,Se.width,Se.height,Ne,Ce,Se.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,ce,ye,Se.width,Se.height,0,Ne,Ce,Se.data)}}}else{re=b.mipmaps,qe&&I&&(re.length>0&&me++,t.texStorage2D(n.TEXTURE_CUBE_MAP,me,ye,ae[0].width,ae[0].height));for(let X=0;X<6;X++)if($e){qe?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,0,0,ae[X].width,ae[X].height,Ne,Ce,ae[X].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,ye,ae[X].width,ae[X].height,0,Ne,Ce,ae[X].data);for(let ce=0;ce<re.length;ce++){const Se=re[ce].image[X].image;qe?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,ce+1,0,0,Se.width,Se.height,Ne,Ce,Se.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,ce+1,ye,Se.width,Se.height,0,Ne,Ce,Se.data)}}else{qe?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,0,0,Ne,Ce,ae[X]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,0,ye,Ne,Ce,ae[X]);for(let ce=0;ce<re.length;ce++){const Se=re[ce];qe?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,ce+1,0,0,Ne,Ce,Se.image[X]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+X,ce+1,ye,Ne,Ce,Se.image[X])}}}A(b,ze)&&C(n.TEXTURE_CUBE_MAP),ie.__version=ee.version,b.onUpdate&&b.onUpdate(b)}R.__version=b.version}function j(R,b,O,se,ee,ie){const xe=s.convert(O.format,O.colorSpace),ne=s.convert(O.type),ge=P(O.internalFormat,xe,ne,O.colorSpace);if(!i.get(b).__hasExternalTextures){const Ie=Math.max(1,b.width>>ie),$e=Math.max(1,b.height>>ie);ee===n.TEXTURE_3D||ee===n.TEXTURE_2D_ARRAY?t.texImage3D(ee,ie,ge,Ie,$e,b.depth,0,xe,ne,null):t.texImage2D(ee,ie,ge,Ie,$e,0,xe,ne,null)}t.bindFramebuffer(n.FRAMEBUFFER,R),Ue(b)?u.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,se,ee,i.get(O).__webglTexture,0,be(b)):(ee===n.TEXTURE_2D||ee>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,se,ee,i.get(O).__webglTexture,ie),t.bindFramebuffer(n.FRAMEBUFFER,null)}function L(R,b,O){if(n.bindRenderbuffer(n.RENDERBUFFER,R),b.depthBuffer&&!b.stencilBuffer){let se=o===!0?n.DEPTH_COMPONENT24:n.DEPTH_COMPONENT16;if(O||Ue(b)){const ee=b.depthTexture;ee&&ee.isDepthTexture&&(ee.type===mi?se=n.DEPTH_COMPONENT32F:ee.type===Li&&(se=n.DEPTH_COMPONENT24));const ie=be(b);Ue(b)?u.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ie,se,b.width,b.height):n.renderbufferStorageMultisample(n.RENDERBUFFER,ie,se,b.width,b.height)}else n.renderbufferStorage(n.RENDERBUFFER,se,b.width,b.height);n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.RENDERBUFFER,R)}else if(b.depthBuffer&&b.stencilBuffer){const se=be(b);O&&Ue(b)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,se,n.DEPTH24_STENCIL8,b.width,b.height):Ue(b)?u.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,se,n.DEPTH24_STENCIL8,b.width,b.height):n.renderbufferStorage(n.RENDERBUFFER,n.DEPTH_STENCIL,b.width,b.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.RENDERBUFFER,R)}else{const se=b.isWebGLMultipleRenderTargets===!0?b.texture:[b.texture];for(let ee=0;ee<se.length;ee++){const ie=se[ee],xe=s.convert(ie.format,ie.colorSpace),ne=s.convert(ie.type),ge=P(ie.internalFormat,xe,ne,ie.colorSpace),Ie=be(b);O&&Ue(b)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ie,ge,b.width,b.height):Ue(b)?u.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ie,ge,b.width,b.height):n.renderbufferStorage(n.RENDERBUFFER,ge,b.width,b.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function he(R,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,R),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(b.depthTexture).__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),K(b.depthTexture,0);const O=i.get(b.depthTexture).__webglTexture,se=be(b);if(b.depthTexture.format===Ki)Ue(b)?u.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,O,0,se):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,O,0);else if(b.depthTexture.format===Tr)Ue(b)?u.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,O,0,se):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,O,0);else throw new Error("Unknown depthTexture format")}function Q(R){const b=i.get(R),O=R.isWebGLCubeRenderTarget===!0;if(R.depthTexture&&!b.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");he(b.__webglFramebuffer,R)}else if(O){b.__webglDepthbuffer=[];for(let se=0;se<6;se++)t.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer[se]),b.__webglDepthbuffer[se]=n.createRenderbuffer(),L(b.__webglDepthbuffer[se],R,!1)}else t.bindFramebuffer(n.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer=n.createRenderbuffer(),L(b.__webglDepthbuffer,R,!1);t.bindFramebuffer(n.FRAMEBUFFER,null)}function $(R,b,O){const se=i.get(R);b!==void 0&&j(se.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),O!==void 0&&Q(R)}function pe(R){const b=R.texture,O=i.get(R),se=i.get(b);R.addEventListener("dispose",G),R.isWebGLMultipleRenderTargets!==!0&&(se.__webglTexture===void 0&&(se.__webglTexture=n.createTexture()),se.__version=b.version,a.memory.textures++);const ee=R.isWebGLCubeRenderTarget===!0,ie=R.isWebGLMultipleRenderTargets===!0,xe=x(R)||o;if(ee){O.__webglFramebuffer=[];for(let ne=0;ne<6;ne++)if(o&&b.mipmaps&&b.mipmaps.length>0){O.__webglFramebuffer[ne]=[];for(let ge=0;ge<b.mipmaps.length;ge++)O.__webglFramebuffer[ne][ge]=n.createFramebuffer()}else O.__webglFramebuffer[ne]=n.createFramebuffer()}else{if(o&&b.mipmaps&&b.mipmaps.length>0){O.__webglFramebuffer=[];for(let ne=0;ne<b.mipmaps.length;ne++)O.__webglFramebuffer[ne]=n.createFramebuffer()}else O.__webglFramebuffer=n.createFramebuffer();if(ie)if(r.drawBuffers){const ne=R.texture;for(let ge=0,Ie=ne.length;ge<Ie;ge++){const $e=i.get(ne[ge]);$e.__webglTexture===void 0&&($e.__webglTexture=n.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&R.samples>0&&Ue(R)===!1){const ne=ie?b:[b];O.__webglMultisampledFramebuffer=n.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let ge=0;ge<ne.length;ge++){const Ie=ne[ge];O.__webglColorRenderbuffer[ge]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,O.__webglColorRenderbuffer[ge]);const $e=s.convert(Ie.format,Ie.colorSpace),ae=s.convert(Ie.type),tt=P(Ie.internalFormat,$e,ae,Ie.colorSpace,R.isXRRenderTarget===!0),ze=be(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,ze,tt,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.RENDERBUFFER,O.__webglColorRenderbuffer[ge])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(O.__webglDepthRenderbuffer=n.createRenderbuffer(),L(O.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ee){t.bindTexture(n.TEXTURE_CUBE_MAP,se.__webglTexture),He(n.TEXTURE_CUBE_MAP,b,xe);for(let ne=0;ne<6;ne++)if(o&&b.mipmaps&&b.mipmaps.length>0)for(let ge=0;ge<b.mipmaps.length;ge++)j(O.__webglFramebuffer[ne][ge],R,b,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ge);else j(O.__webglFramebuffer[ne],R,b,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0);A(b,xe)&&C(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ie){const ne=R.texture;for(let ge=0,Ie=ne.length;ge<Ie;ge++){const $e=ne[ge],ae=i.get($e);t.bindTexture(n.TEXTURE_2D,ae.__webglTexture),He(n.TEXTURE_2D,$e,xe),j(O.__webglFramebuffer,R,$e,n.COLOR_ATTACHMENT0+ge,n.TEXTURE_2D,0),A($e,xe)&&C(n.TEXTURE_2D)}t.unbindTexture()}else{let ne=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(o?ne=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(ne,se.__webglTexture),He(ne,b,xe),o&&b.mipmaps&&b.mipmaps.length>0)for(let ge=0;ge<b.mipmaps.length;ge++)j(O.__webglFramebuffer[ge],R,b,n.COLOR_ATTACHMENT0,ne,ge);else j(O.__webglFramebuffer,R,b,n.COLOR_ATTACHMENT0,ne,0);A(b,xe)&&C(ne),t.unbindTexture()}R.depthBuffer&&Q(R)}function Ee(R){const b=x(R)||o,O=R.isWebGLMultipleRenderTargets===!0?R.texture:[R.texture];for(let se=0,ee=O.length;se<ee;se++){const ie=O[se];if(A(ie,b)){const xe=R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,ne=i.get(ie).__webglTexture;t.bindTexture(xe,ne),C(xe),t.unbindTexture()}}}function _e(R){if(o&&R.samples>0&&Ue(R)===!1){const b=R.isWebGLMultipleRenderTargets?R.texture:[R.texture],O=R.width,se=R.height;let ee=n.COLOR_BUFFER_BIT;const ie=[],xe=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ne=i.get(R),ge=R.isWebGLMultipleRenderTargets===!0;if(ge)for(let Ie=0;Ie<b.length;Ie++)t.bindFramebuffer(n.FRAMEBUFFER,ne.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ie,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,ne.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ie,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,ne.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ne.__webglFramebuffer);for(let Ie=0;Ie<b.length;Ie++){ie.push(n.COLOR_ATTACHMENT0+Ie),R.depthBuffer&&ie.push(xe);const $e=ne.__ignoreDepthValues!==void 0?ne.__ignoreDepthValues:!1;if($e===!1&&(R.depthBuffer&&(ee|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&(ee|=n.STENCIL_BUFFER_BIT)),ge&&n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,ne.__webglColorRenderbuffer[Ie]),$e===!0&&(n.invalidateFramebuffer(n.READ_FRAMEBUFFER,[xe]),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[xe])),ge){const ae=i.get(b[Ie]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,ae,0)}n.blitFramebuffer(0,0,O,se,0,0,O,se,ee,n.NEAREST),p&&n.invalidateFramebuffer(n.READ_FRAMEBUFFER,ie)}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ge)for(let Ie=0;Ie<b.length;Ie++){t.bindFramebuffer(n.FRAMEBUFFER,ne.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ie,n.RENDERBUFFER,ne.__webglColorRenderbuffer[Ie]);const $e=i.get(b[Ie]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,ne.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ie,n.TEXTURE_2D,$e,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,ne.__webglMultisampledFramebuffer)}}function be(R){return Math.min(d,R.samples)}function Ue(R){const b=i.get(R);return o&&R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function ot(R){const b=a.render.frame;f.get(R)!==b&&(f.set(R,b),R.update())}function ft(R,b){const O=R.colorSpace,se=R.format,ee=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||R.format===pa||O!==yi&&O!==Jt&&(Qe.getTransfer(O)===nt?o===!1?e.has("EXT_sRGB")===!0&&se===Zt?(R.format=pa,R.minFilter=pt,R.generateMipmaps=!1):b=Il.sRGBToLinear(b):(se!==Zt||ee!==Ui)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),b}this.allocateTextureUnit=te,this.resetTextureUnits=W,this.setTexture2D=K,this.setTexture2DArray=U,this.setTexture3D=V,this.setTextureCube=le,this.rebindTextures=$,this.setupRenderTarget=pe,this.updateRenderTargetMipmap=Ee,this.updateMultisampleRenderTarget=_e,this.setupDepthRenderbuffer=Q,this.setupFrameBufferTexture=j,this.useMultisampledRTT=Ue}function rd(n,e,t){const i=t.isWebGL2;function r(s,a=Jt){let o;const l=Qe.getTransfer(a);if(s===Ui)return n.UNSIGNED_BYTE;if(s===wl)return n.UNSIGNED_SHORT_4_4_4_4;if(s===El)return n.UNSIGNED_SHORT_5_5_5_1;if(s===xu)return n.BYTE;if(s===Mu)return n.SHORT;if(s===ya)return n.UNSIGNED_SHORT;if(s===Sl)return n.INT;if(s===Li)return n.UNSIGNED_INT;if(s===mi)return n.FLOAT;if(s===as)return i?n.HALF_FLOAT:(o=e.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(s===bu)return n.ALPHA;if(s===Zt)return n.RGBA;if(s===Su)return n.LUMINANCE;if(s===wu)return n.LUMINANCE_ALPHA;if(s===Ki)return n.DEPTH_COMPONENT;if(s===Tr)return n.DEPTH_STENCIL;if(s===pa)return o=e.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(s===Eu)return n.RED;if(s===Tl)return n.RED_INTEGER;if(s===Tu)return n.RG;if(s===Al)return n.RG_INTEGER;if(s===Rl)return n.RGBA_INTEGER;if(s===ra||s===sa||s===na||s===aa)if(l===nt)if(o=e.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(s===ra)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===sa)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===na)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===aa)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=e.get("WEBGL_compressed_texture_s3tc"),o!==null){if(s===ra)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===sa)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===na)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===aa)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===Bo||s===ko||s===Ho||s===Go)if(o=e.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(s===Bo)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===ko)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===Ho)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===Go)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===Au)return o=e.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(s===Vo||s===Wo)if(o=e.get("WEBGL_compressed_texture_etc"),o!==null){if(s===Vo)return l===nt?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(s===Wo)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===Xo||s===jo||s===qo||s===Yo||s===Zo||s===Jo||s===Ko||s===$o||s===Qo||s===el||s===tl||s===il||s===rl||s===sl)if(o=e.get("WEBGL_compressed_texture_astc"),o!==null){if(s===Xo)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===jo)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===qo)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===Yo)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===Zo)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===Jo)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===Ko)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===$o)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===Qo)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===el)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===tl)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===il)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===rl)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===sl)return l===nt?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===oa||s===nl||s===al)if(o=e.get("EXT_texture_compression_bptc"),o!==null){if(s===oa)return l===nt?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===nl)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===al)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===Ru||s===ol||s===ll||s===cl)if(o=e.get("EXT_texture_compression_rgtc"),o!==null){if(s===oa)return o.COMPRESSED_RED_RGTC1_EXT;if(s===ol)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===ll)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===cl)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===Ji?i?n.UNSIGNED_INT_24_8:(o=e.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):n[s]!==void 0?n[s]:null}return{convert:r}}class sd extends yt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Pi extends Ke{constructor(){super(),this.isGroup=!0,this.type="Group"}}const oy={type:"move"};class xo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Pi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Pi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new E,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new E),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Pi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new E,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new E),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const g=t.getJointPose(v,i),m=this._getHandJoint(c,v);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}const h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),p=.02,f=.005;c.inputState.pinching&&u>p+f?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=p-f&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(oy)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new Pi;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class nd extends mt{constructor(e,t,i,r,s,a,o,l,c,h){if(h=h!==void 0?h:Ki,h!==Ki&&h!==Tr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===Ki&&(i=Li),i===void 0&&h===Tr&&(i=Ji),super(null,r,s,a,o,l,h,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:dt,this.minFilter=l!==void 0?l:dt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class ly extends ki{constructor(e,t){super();const i=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,d=null,u=null,p=null,f=null;const v=t.getContextAttributes();let g=null,m=null;const _=[],y=[],x=new yt;x.layers.enable(1),x.viewport=new et;const w=new yt;w.layers.enable(2),w.viewport=new et;const A=[x,w],C=new sd;C.layers.enable(1),C.layers.enable(2);let P=null,M=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(U){let V=_[U];return V===void 0&&(V=new xo,_[U]=V),V.getTargetRaySpace()},this.getControllerGrip=function(U){let V=_[U];return V===void 0&&(V=new xo,_[U]=V),V.getGripSpace()},this.getHand=function(U){let V=_[U];return V===void 0&&(V=new xo,_[U]=V),V.getHandSpace()};function T(U){const V=y.indexOf(U.inputSource);if(V===-1)return;const le=_[V];le!==void 0&&(le.update(U.inputSource,U.frame,c||a),le.dispatchEvent({type:U.type,data:U.inputSource}))}function F(){r.removeEventListener("select",T),r.removeEventListener("selectstart",T),r.removeEventListener("selectend",T),r.removeEventListener("squeeze",T),r.removeEventListener("squeezestart",T),r.removeEventListener("squeezeend",T),r.removeEventListener("end",F),r.removeEventListener("inputsourceschange",G);for(let U=0;U<_.length;U++){const V=y[U];V!==null&&(y[U]=null,_[U].disconnect(V))}P=null,M=null,e.setRenderTarget(g),p=null,u=null,d=null,r=null,m=null,K.stop(),i.isPresenting=!1,i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(U){s=U,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(U){o=U,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(U){c=U},this.getBaseLayer=function(){return u!==null?u:p},this.getBinding=function(){return d},this.getFrame=function(){return f},this.getSession=function(){return r},this.setSession=function(U){return xt(this,null,function*(){if(r=U,r!==null){if(g=e.getRenderTarget(),r.addEventListener("select",T),r.addEventListener("selectstart",T),r.addEventListener("selectend",T),r.addEventListener("squeeze",T),r.addEventListener("squeezestart",T),r.addEventListener("squeezeend",T),r.addEventListener("end",F),r.addEventListener("inputsourceschange",G),v.xrCompatible!==!0&&(yield t.makeXRCompatible()),r.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const V={antialias:r.renderState.layers===void 0?v.antialias:!0,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,t,V),r.updateRenderState({baseLayer:p}),m=new ai(p.framebufferWidth,p.framebufferHeight,{format:Zt,type:Ui,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil})}else{let V=null,le=null,ve=null;v.depth&&(ve=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,V=v.stencil?Tr:Ki,le=v.stencil?Ji:Li);const we={colorFormat:t.RGBA8,depthFormat:ve,scaleFactor:s};d=new XRWebGLBinding(r,t),u=d.createProjectionLayer(we),r.updateRenderState({layers:[u]}),m=new ai(u.textureWidth,u.textureHeight,{format:Zt,type:Ui,depthTexture:new nd(u.textureWidth,u.textureHeight,le,void 0,void 0,void 0,void 0,void 0,void 0,V),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0});const Me=e.properties.get(m);Me.__ignoreDepthValues=u.ignoreDepthValues}m.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=yield r.requestReferenceSpace(o),K.setContext(r),K.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}})},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode};function G(U){for(let V=0;V<U.removed.length;V++){const le=U.removed[V],ve=y.indexOf(le);ve>=0&&(y[ve]=null,_[ve].disconnect(le))}for(let V=0;V<U.added.length;V++){const le=U.added[V];let ve=y.indexOf(le);if(ve===-1){for(let Me=0;Me<_.length;Me++)if(Me>=y.length){y.push(le),ve=Me;break}else if(y[Me]===null){y[Me]=le,ve=Me;break}if(ve===-1)break}const we=_[ve];we&&we.connect(le)}}const Z=new E,D=new E;function B(U,V,le){Z.setFromMatrixPosition(V.matrixWorld),D.setFromMatrixPosition(le.matrixWorld);const ve=Z.distanceTo(D),we=V.projectionMatrix.elements,Me=le.projectionMatrix.elements,He=we[14]/(we[10]-1),De=we[14]/(we[10]+1),Ae=(we[9]+1)/we[5],Ze=(we[9]-1)/we[5],j=(we[8]-1)/we[0],L=(Me[8]+1)/Me[0],he=He*j,Q=He*L,$=ve/(-j+L),pe=$*-j;V.matrixWorld.decompose(U.position,U.quaternion,U.scale),U.translateX(pe),U.translateZ($),U.matrixWorld.compose(U.position,U.quaternion,U.scale),U.matrixWorldInverse.copy(U.matrixWorld).invert();const Ee=He+$,_e=De+$,be=he-pe,Ue=Q+(ve-pe),ot=Ae*De/_e*Ee,ft=Ze*De/_e*Ee;U.projectionMatrix.makePerspective(be,Ue,ot,ft,Ee,_e),U.projectionMatrixInverse.copy(U.projectionMatrix).invert()}function Y(U,V){V===null?U.matrixWorld.copy(U.matrix):U.matrixWorld.multiplyMatrices(V.matrixWorld,U.matrix),U.matrixWorldInverse.copy(U.matrixWorld).invert()}this.updateCamera=function(U){if(r===null)return;C.near=w.near=x.near=U.near,C.far=w.far=x.far=U.far,(P!==C.near||M!==C.far)&&(r.updateRenderState({depthNear:C.near,depthFar:C.far}),P=C.near,M=C.far);const V=U.parent,le=C.cameras;Y(C,V);for(let ve=0;ve<le.length;ve++)Y(le[ve],V);le.length===2?B(C,x,w):C.projectionMatrix.copy(x.projectionMatrix),W(U,C,V)};function W(U,V,le){le===null?U.matrix.copy(V.matrixWorld):(U.matrix.copy(le.matrixWorld),U.matrix.invert(),U.matrix.multiply(V.matrixWorld)),U.matrix.decompose(U.position,U.quaternion,U.scale),U.updateMatrixWorld(!0),U.projectionMatrix.copy(V.projectionMatrix),U.projectionMatrixInverse.copy(V.projectionMatrixInverse),U.isPerspectiveCamera&&(U.fov=os*2*Math.atan(1/U.projectionMatrix.elements[5]),U.zoom=1)}this.getCamera=function(){return C},this.getFoveation=function(){if(!(u===null&&p===null))return l},this.setFoveation=function(U){l=U,u!==null&&(u.fixedFoveation=U),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=U)};let te=null;function J(U,V){if(h=V.getViewerPose(c||a),f=V,h!==null){const le=h.views;p!==null&&(e.setRenderTargetFramebuffer(m,p.framebuffer),e.setRenderTarget(m));let ve=!1;le.length!==C.cameras.length&&(C.cameras.length=0,ve=!0);for(let we=0;we<le.length;we++){const Me=le[we];let He=null;if(p!==null)He=p.getViewport(Me);else{const Ae=d.getViewSubImage(u,Me);He=Ae.viewport,we===0&&(e.setRenderTargetTextures(m,Ae.colorTexture,u.ignoreDepthValues?void 0:Ae.depthStencilTexture),e.setRenderTarget(m))}let De=A[we];De===void 0&&(De=new yt,De.layers.enable(we),De.viewport=new et,A[we]=De),De.matrix.fromArray(Me.transform.matrix),De.matrix.decompose(De.position,De.quaternion,De.scale),De.projectionMatrix.fromArray(Me.projectionMatrix),De.projectionMatrixInverse.copy(De.projectionMatrix).invert(),De.viewport.set(He.x,He.y,He.width,He.height),we===0&&(C.matrix.copy(De.matrix),C.matrix.decompose(C.position,C.quaternion,C.scale)),ve===!0&&C.cameras.push(De)}}for(let le=0;le<_.length;le++){const ve=y[le],we=_[le];ve!==null&&we!==void 0&&we.update(ve,V,c||a)}te&&te(U,V),V.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:V}),f=null}const K=new $u;K.setAnimationLoop(J),this.setAnimationLoop=function(U){te=U},this.dispose=function(){}}}function cy(n,e){function t(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function i(g,m){m.color.getRGB(g.fogColor.value,Yu(n)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function r(g,m,_,y,x){m.isMeshBasicMaterial||m.isMeshLambertMaterial?s(g,m):m.isMeshToonMaterial?(s(g,m),d(g,m)):m.isMeshPhongMaterial?(s(g,m),h(g,m)):m.isMeshStandardMaterial?(s(g,m),u(g,m),m.isMeshPhysicalMaterial&&p(g,m,x)):m.isMeshMatcapMaterial?(s(g,m),f(g,m)):m.isMeshDepthMaterial?s(g,m):m.isMeshDistanceMaterial?(s(g,m),v(g,m)):m.isMeshNormalMaterial?s(g,m):m.isLineBasicMaterial?(a(g,m),m.isLineDashedMaterial&&o(g,m)):m.isPointsMaterial?l(g,m,_,y):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function s(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,t(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===Bt&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,t(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===Bt&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,t(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,t(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);const _=e.get(m).envMap;if(_&&(g.envMap.value=_,g.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap){g.lightMap.value=m.lightMap;const y=n._useLegacyLights===!0?Math.PI:1;g.lightMapIntensity.value=m.lightMapIntensity*y,t(m.lightMap,g.lightMapTransform)}m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,g.aoMapTransform))}function a(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform))}function o(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,_,y){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*_,g.scale.value=y*.5,m.map&&(g.map.value=m.map,t(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function d(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function u(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,g.roughnessMapTransform)),e.get(m).envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function p(g,m,_){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Bt&&g.clearcoatNormalScale.value.negate())),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,g.specularIntensityMapTransform))}function f(g,m){m.matcap&&(g.matcap.value=m.matcap)}function v(g,m){const _=e.get(m).light;g.referencePosition.value.setFromMatrixPosition(_.matrixWorld),g.nearDistance.value=_.shadow.camera.near,g.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function hy(n,e,t,i){let r={},s={},a=[];const o=t.isWebGL2?n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(_,y){const x=y.program;i.uniformBlockBinding(_,x)}function c(_,y){let x=r[_.id];x===void 0&&(f(_),x=h(_),r[_.id]=x,_.addEventListener("dispose",g));const w=y.program;i.updateUBOMapping(_,w);const A=e.render.frame;s[_.id]!==A&&(u(_),s[_.id]=A)}function h(_){const y=d();_.__bindingPointIndex=y;const x=n.createBuffer(),w=_.__size,A=_.usage;return n.bindBuffer(n.UNIFORM_BUFFER,x),n.bufferData(n.UNIFORM_BUFFER,w,A),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,y,x),x}function d(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(_){const y=r[_.id],x=_.uniforms,w=_.__cache;n.bindBuffer(n.UNIFORM_BUFFER,y);for(let A=0,C=x.length;A<C;A++){const P=x[A];if(p(P,A,w)===!0){const M=P.__offset,T=Array.isArray(P.value)?P.value:[P.value];let F=0;for(let G=0;G<T.length;G++){const Z=T[G],D=v(Z);typeof Z=="number"?(P.__data[0]=Z,n.bufferSubData(n.UNIFORM_BUFFER,M+F,P.__data)):Z.isMatrix3?(P.__data[0]=Z.elements[0],P.__data[1]=Z.elements[1],P.__data[2]=Z.elements[2],P.__data[3]=Z.elements[0],P.__data[4]=Z.elements[3],P.__data[5]=Z.elements[4],P.__data[6]=Z.elements[5],P.__data[7]=Z.elements[0],P.__data[8]=Z.elements[6],P.__data[9]=Z.elements[7],P.__data[10]=Z.elements[8],P.__data[11]=Z.elements[0]):(Z.toArray(P.__data,F),F+=D.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,M,P.__data)}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(_,y,x){const w=_.value;if(x[y]===void 0){if(typeof w=="number")x[y]=w;else{const A=Array.isArray(w)?w:[w],C=[];for(let P=0;P<A.length;P++)C.push(A[P].clone());x[y]=C}return!0}else if(typeof w=="number"){if(x[y]!==w)return x[y]=w,!0}else{const A=Array.isArray(x[y])?x[y]:[x[y]],C=Array.isArray(w)?w:[w];for(let P=0;P<A.length;P++){const M=A[P];if(M.equals(C[P])===!1)return M.copy(C[P]),!0}}return!1}function f(_){const y=_.uniforms;let x=0;const w=16;let A=0;for(let C=0,P=y.length;C<P;C++){const M=y[C],T={boundary:0,storage:0},F=Array.isArray(M.value)?M.value:[M.value];for(let G=0,Z=F.length;G<Z;G++){const D=F[G],B=v(D);T.boundary+=B.boundary,T.storage+=B.storage}if(M.__data=new Float32Array(T.storage/Float32Array.BYTES_PER_ELEMENT),M.__offset=x,C>0){A=x%w;const G=w-A;A!==0&&G-T.boundary<0&&(x+=w-A,M.__offset=x)}x+=T.storage}return A=x%w,A>0&&(x+=w-A),_.__size=x,_.__cache={},this}function v(_){const y={boundary:0,storage:0};return typeof _=="number"?(y.boundary=4,y.storage=4):_.isVector2?(y.boundary=8,y.storage=8):_.isVector3||_.isColor?(y.boundary=16,y.storage=12):_.isVector4?(y.boundary=16,y.storage=16):_.isMatrix3?(y.boundary=48,y.storage=48):_.isMatrix4?(y.boundary=64,y.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),y}function g(_){const y=_.target;y.removeEventListener("dispose",g);const x=a.indexOf(y.__bindingPointIndex);a.splice(x,1),n.deleteBuffer(r[y.id]),delete r[y.id],delete s[y.id]}function m(){for(const _ in r)n.deleteBuffer(r[_]);a=[],r={},s={}}return{bind:l,update:c,dispose:m}}class Fi{constructor(e={}){const{canvas:t=Xu(),context:i=null,depth:r=!0,stencil:s=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1}=e;this.isWebGLRenderer=!0;let u;i!==null?u=i.getContextAttributes().alpha:u=a;const p=new Uint32Array(4),f=new Int32Array(4);let v=null,g=null;const m=[],_=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Mt,this._useLegacyLights=!1,this.toneMapping=Di,this.toneMappingExposure=1;const y=this;let x=!1,w=0,A=0,C=null,P=-1,M=null;const T=new et,F=new et;let G=null;const Z=new oe(0);let D=0,B=t.width,Y=t.height,W=1,te=null,J=null;const K=new et(0,0,B,Y),U=new et(0,0,B,Y);let V=!1;const le=new wa;let ve=!1,we=!1,Me=null;const He=new Fe,De=new q,Ae=new E,Ze={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function j(){return C===null?W:1}let L=i;function he(S,N){for(let z=0;z<S.length;z++){const H=S[z],k=t.getContext(H,N);if(k!==null)return k}return null}try{const S={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine","three.js r158"),t.addEventListener("webglcontextlost",qe,!1),t.addEventListener("webglcontextrestored",I,!1),t.addEventListener("webglcontextcreationerror",me,!1),L===null){const N=["webgl2","webgl","experimental-webgl"];if(y.isWebGL1Renderer===!0&&N.shift(),L=he(N,S),L===null)throw he(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&L instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),L.getShaderPrecisionFormat===void 0&&(L.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(S){throw console.error("THREE.WebGLRenderer: "+S.message),S}let Q,$,pe,Ee,_e,be,Ue,ot,ft,R,b,O,se,ee,ie,xe,ne,ge,Ie,$e,ae,tt,ze,Ne;function Ce(){Q=new E0(L),$=new _0(L,Q,e),Q.init($),tt=new rd(L,Q,$),pe=new ny(L,Q,$),Ee=new R0(L),_e=new qv,be=new ay(L,Q,pe,_e,$,tt,Ee),Ue=new M0(y),ot=new w0(y),ft=new Fm(L,$),ze=new v0(L,Q,ft,$),R=new T0(L,ft,Ee,ze),b=new I0(L,R,ft,Ee),Ie=new P0(L,$,be),xe=new x0(_e),O=new jv(y,Ue,ot,Q,$,ze,xe),se=new cy(y,_e),ee=new Zv,ie=new ty(Q,$),ge=new g0(y,Ue,ot,pe,b,u,l),ne=new sy(y,b,$),Ne=new hy(L,Ee,$,pe),$e=new y0(L,Q,Ee,$),ae=new A0(L,Q,Ee,$),Ee.programs=O.programs,y.capabilities=$,y.extensions=Q,y.properties=_e,y.renderLists=ee,y.shadowMap=ne,y.state=pe,y.info=Ee}Ce();const ye=new ly(y,L);this.xr=ye,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const S=Q.get("WEBGL_lose_context");S&&S.loseContext()},this.forceContextRestore=function(){const S=Q.get("WEBGL_lose_context");S&&S.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(S){S!==void 0&&(W=S,this.setSize(B,Y,!1))},this.getSize=function(S){return S.set(B,Y)},this.setSize=function(S,N,z=!0){if(ye.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}B=S,Y=N,t.width=Math.floor(S*W),t.height=Math.floor(N*W),z===!0&&(t.style.width=S+"px",t.style.height=N+"px"),this.setViewport(0,0,S,N)},this.getDrawingBufferSize=function(S){return S.set(B*W,Y*W).floor()},this.setDrawingBufferSize=function(S,N,z){B=S,Y=N,W=z,t.width=Math.floor(S*z),t.height=Math.floor(N*z),this.setViewport(0,0,S,N)},this.getCurrentViewport=function(S){return S.copy(T)},this.getViewport=function(S){return S.copy(K)},this.setViewport=function(S,N,z,H){S.isVector4?K.set(S.x,S.y,S.z,S.w):K.set(S,N,z,H),pe.viewport(T.copy(K).multiplyScalar(W).floor())},this.getScissor=function(S){return S.copy(U)},this.setScissor=function(S,N,z,H){S.isVector4?U.set(S.x,S.y,S.z,S.w):U.set(S,N,z,H),pe.scissor(F.copy(U).multiplyScalar(W).floor())},this.getScissorTest=function(){return V},this.setScissorTest=function(S){pe.setScissorTest(V=S)},this.setOpaqueSort=function(S){te=S},this.setTransparentSort=function(S){J=S},this.getClearColor=function(S){return S.copy(ge.getClearColor())},this.setClearColor=function(){ge.setClearColor.apply(ge,arguments)},this.getClearAlpha=function(){return ge.getClearAlpha()},this.setClearAlpha=function(){ge.setClearAlpha.apply(ge,arguments)},this.clear=function(S=!0,N=!0,z=!0){let H=0;if(S){let k=!1;if(C!==null){const ue=C.texture.format;k=ue===Rl||ue===Al||ue===Tl}if(k){const ue=C.texture.type,Te=ue===Ui||ue===Li||ue===ya||ue===Ji||ue===wl||ue===El,Le=ge.getClearColor(),Oe=ge.getClearAlpha(),Xe=Le.r,Ve=Le.g,We=Le.b;Te?(p[0]=Xe,p[1]=Ve,p[2]=We,p[3]=Oe,L.clearBufferuiv(L.COLOR,0,p)):(f[0]=Xe,f[1]=Ve,f[2]=We,f[3]=Oe,L.clearBufferiv(L.COLOR,0,f))}else H|=L.COLOR_BUFFER_BIT}N&&(H|=L.DEPTH_BUFFER_BIT),z&&(H|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",qe,!1),t.removeEventListener("webglcontextrestored",I,!1),t.removeEventListener("webglcontextcreationerror",me,!1),ee.dispose(),ie.dispose(),_e.dispose(),Ue.dispose(),ot.dispose(),b.dispose(),ze.dispose(),Ne.dispose(),O.dispose(),ye.dispose(),ye.removeEventListener("sessionstart",$t),ye.removeEventListener("sessionend",rt),Me&&(Me.dispose(),Me=null),Nt.stop()};function qe(S){S.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),x=!0}function I(){console.log("THREE.WebGLRenderer: Context Restored."),x=!1;const S=Ee.autoReset,N=ne.enabled,z=ne.autoUpdate,H=ne.needsUpdate,k=ne.type;Ce(),Ee.autoReset=S,ne.enabled=N,ne.autoUpdate=z,ne.needsUpdate=H,ne.type=k}function me(S){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",S.statusMessage)}function re(S){const N=S.target;N.removeEventListener("dispose",re),X(N)}function X(S){ce(S),_e.remove(S)}function ce(S){const N=_e.get(S).programs;N!==void 0&&(N.forEach(function(z){O.releaseProgram(z)}),S.isShaderMaterial&&O.releaseShaderCache(S))}this.renderBufferDirect=function(S,N,z,H,k,ue){N===null&&(N=Ze);const Te=k.isMesh&&k.matrixWorld.determinant()<0,Le=np(S,N,z,H,k);pe.setMaterial(H,Te);let Oe=z.index,Xe=1;if(H.wireframe===!0){if(Oe=R.getWireframeAttribute(z),Oe===void 0)return;Xe=2}const Ve=z.drawRange,We=z.attributes.position;let Rt=Ve.start*Xe,_t=(Ve.start+Ve.count)*Xe;ue!==null&&(Rt=Math.max(Rt,ue.start*Xe),_t=Math.min(_t,(ue.start+ue.count)*Xe)),Oe!==null?(Rt=Math.max(Rt,0),_t=Math.min(_t,Oe.count)):We!=null&&(Rt=Math.max(Rt,0),_t=Math.min(_t,We.count));const Qt=_t-Rt;if(Qt<0||Qt===1/0)return;ze.setup(k,H,Le,z,Oe);let bi,gt=$e;if(Oe!==null&&(bi=ft.get(Oe),gt=ae,gt.setIndex(bi)),k.isMesh)H.wireframe===!0?(pe.setLineWidth(H.wireframeLinewidth*j()),gt.setMode(L.LINES)):gt.setMode(L.TRIANGLES);else if(k.isLine){let je=H.linewidth;je===void 0&&(je=1),pe.setLineWidth(je*j()),k.isLineSegments?gt.setMode(L.LINES):k.isLineLoop?gt.setMode(L.LINE_LOOP):gt.setMode(L.LINE_STRIP)}else k.isPoints?gt.setMode(L.POINTS):k.isSprite&&gt.setMode(L.TRIANGLES);if(k.isInstancedMesh)gt.renderInstances(Rt,Qt,k.count);else if(z.isInstancedBufferGeometry){const je=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,Xa=Math.min(z.instanceCount,je);gt.renderInstances(Rt,Qt,Xa)}else gt.render(Rt,Qt)};function Se(S,N,z){S.transparent===!0&&S.side===pi&&S.forceSinglePass===!1?(S.side=Bt,S.needsUpdate=!0,dn(S,N,z),S.side=Ni,S.needsUpdate=!0,dn(S,N,z),S.side=pi):dn(S,N,z)}this.compile=function(S,N,z=null){z===null&&(z=S),g=ie.get(z),g.init(),_.push(g),z.traverseVisible(function(k){k.isLight&&k.layers.test(N.layers)&&(g.pushLight(k),k.castShadow&&g.pushShadow(k))}),S!==z&&S.traverseVisible(function(k){k.isLight&&k.layers.test(N.layers)&&(g.pushLight(k),k.castShadow&&g.pushShadow(k))}),g.setupLights(y._useLegacyLights);const H=new Set;return S.traverse(function(k){const ue=k.material;if(ue)if(Array.isArray(ue))for(let Te=0;Te<ue.length;Te++){const Le=ue[Te];Se(Le,z,k),H.add(Le)}else Se(ue,z,k),H.add(ue)}),_.pop(),g=null,H},this.compileAsync=function(S,N,z=null){const H=this.compile(S,N,z);return new Promise(k=>{function ue(){if(H.forEach(function(Te){_e.get(Te).currentProgram.isReady()&&H.delete(Te)}),H.size===0){k(S);return}setTimeout(ue,10)}Q.get("KHR_parallel_shader_compile")!==null?ue():setTimeout(ue,10)})};let it=null;function Tt(S){it&&it(S)}function $t(){Nt.stop()}function rt(){Nt.start()}const Nt=new $u;Nt.setAnimationLoop(Tt),typeof self<"u"&&Nt.setContext(self),this.setAnimationLoop=function(S){it=S,ye.setAnimationLoop(S),S===null?Nt.stop():Nt.start()},ye.addEventListener("sessionstart",$t),ye.addEventListener("sessionend",rt),this.render=function(S,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(x===!0)return;S.matrixWorldAutoUpdate===!0&&S.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),ye.enabled===!0&&ye.isPresenting===!0&&(ye.cameraAutoUpdate===!0&&ye.updateCamera(N),N=ye.getCamera()),S.isScene===!0&&S.onBeforeRender(y,S,N,C),g=ie.get(S,_.length),g.init(),_.push(g),He.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),le.setFromProjectionMatrix(He),we=this.localClippingEnabled,ve=xe.init(this.clippingPlanes,we),v=ee.get(S,m.length),v.init(),m.push(v),ui(S,N,0,y.sortObjects),v.finish(),y.sortObjects===!0&&v.sort(te,J),this.info.render.frame++,ve===!0&&xe.beginShadows();const z=g.state.shadowsArray;if(ne.render(z,S,N),ve===!0&&xe.endShadows(),this.info.autoReset===!0&&this.info.reset(),ge.render(v,S),g.setupLights(y._useLegacyLights),N.isArrayCamera){const H=N.cameras;for(let k=0,ue=H.length;k<ue;k++){const Te=H[k];sc(v,S,Te,Te.viewport)}}else sc(v,S,N);C!==null&&(be.updateMultisampleRenderTarget(C),be.updateRenderTargetMipmap(C)),S.isScene===!0&&S.onAfterRender(y,S,N),ze.resetDefaultState(),P=-1,M=null,_.pop(),_.length>0?g=_[_.length-1]:g=null,m.pop(),m.length>0?v=m[m.length-1]:v=null};function ui(S,N,z,H){if(S.visible===!1)return;if(S.layers.test(N.layers)){if(S.isGroup)z=S.renderOrder;else if(S.isLOD)S.autoUpdate===!0&&S.update(N);else if(S.isLight)g.pushLight(S),S.castShadow&&g.pushShadow(S);else if(S.isSprite){if(!S.frustumCulled||le.intersectsSprite(S)){H&&Ae.setFromMatrixPosition(S.matrixWorld).applyMatrix4(He);const ue=b.update(S),Te=S.material;Te.visible&&v.push(S,ue,Te,z,Ae.z,null)}}else if((S.isMesh||S.isLine||S.isPoints)&&(!S.frustumCulled||le.intersectsObject(S))){const ue=b.update(S),Te=S.material;if(H&&(S.boundingSphere!==void 0?(S.boundingSphere===null&&S.computeBoundingSphere(),Ae.copy(S.boundingSphere.center)):(ue.boundingSphere===null&&ue.computeBoundingSphere(),Ae.copy(ue.boundingSphere.center)),Ae.applyMatrix4(S.matrixWorld).applyMatrix4(He)),Array.isArray(Te)){const Le=ue.groups;for(let Oe=0,Xe=Le.length;Oe<Xe;Oe++){const Ve=Le[Oe],We=Te[Ve.materialIndex];We&&We.visible&&v.push(S,ue,We,z,Ae.z,Ve)}}else Te.visible&&v.push(S,ue,Te,z,Ae.z,null)}}const k=S.children;for(let ue=0,Te=k.length;ue<Te;ue++)ui(k[ue],N,z,H)}function sc(S,N,z,H){const k=S.opaque,ue=S.transmissive,Te=S.transparent;g.setupLightsView(z),ve===!0&&xe.setGlobalState(y.clippingPlanes,z),ue.length>0&&sp(k,ue,N,z),H&&pe.viewport(T.copy(H)),k.length>0&&un(k,N,z),ue.length>0&&un(ue,N,z),Te.length>0&&un(Te,N,z),pe.buffers.depth.setTest(!0),pe.buffers.depth.setMask(!0),pe.buffers.color.setMask(!0),pe.setPolygonOffset(!1)}function sp(S,N,z,H){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;const k=$.isWebGL2;Me===null&&(Me=new ai(1,1,{generateMipmaps:!0,type:Q.has("EXT_color_buffer_half_float")?as:Ui,minFilter:er,samples:k?4:0})),y.getDrawingBufferSize(De),k?Me.setSize(De.x,De.y):Me.setSize(ma(De.x),ma(De.y));const ue=y.getRenderTarget();y.setRenderTarget(Me),y.getClearColor(Z),D=y.getClearAlpha(),D<1&&y.setClearColor(16777215,.5),y.clear();const Te=y.toneMapping;y.toneMapping=Di,un(S,z,H),be.updateMultisampleRenderTarget(Me),be.updateRenderTargetMipmap(Me);let Le=!1;for(let Oe=0,Xe=N.length;Oe<Xe;Oe++){const Ve=N[Oe],We=Ve.object,Rt=Ve.geometry,_t=Ve.material,Qt=Ve.group;if(_t.side===pi&&We.layers.test(H.layers)){const bi=_t.side;_t.side=Bt,_t.needsUpdate=!0,nc(We,z,H,Rt,_t,Qt),_t.side=bi,_t.needsUpdate=!0,Le=!0}}Le===!0&&(be.updateMultisampleRenderTarget(Me),be.updateRenderTargetMipmap(Me)),y.setRenderTarget(ue),y.setClearColor(Z,D),y.toneMapping=Te}function un(S,N,z){const H=N.isScene===!0?N.overrideMaterial:null;for(let k=0,ue=S.length;k<ue;k++){const Te=S[k],Le=Te.object,Oe=Te.geometry,Xe=H===null?Te.material:H,Ve=Te.group;Le.layers.test(z.layers)&&nc(Le,N,z,Oe,Xe,Ve)}}function nc(S,N,z,H,k,ue){S.onBeforeRender(y,N,z,H,k,ue),S.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,S.matrixWorld),S.normalMatrix.getNormalMatrix(S.modelViewMatrix),k.onBeforeRender(y,N,z,H,S,ue),k.transparent===!0&&k.side===pi&&k.forceSinglePass===!1?(k.side=Bt,k.needsUpdate=!0,y.renderBufferDirect(z,N,H,k,S,ue),k.side=Ni,k.needsUpdate=!0,y.renderBufferDirect(z,N,H,k,S,ue),k.side=pi):y.renderBufferDirect(z,N,H,k,S,ue),S.onAfterRender(y,N,z,H,k,ue)}function dn(S,N,z){N.isScene!==!0&&(N=Ze);const H=_e.get(S),k=g.state.lights,ue=g.state.shadowsArray,Te=k.state.version,Le=O.getParameters(S,k.state,ue,N,z),Oe=O.getProgramCacheKey(Le);let Xe=H.programs;H.environment=S.isMeshStandardMaterial?N.environment:null,H.fog=N.fog,H.envMap=(S.isMeshStandardMaterial?ot:Ue).get(S.envMap||H.environment),Xe===void 0&&(S.addEventListener("dispose",re),Xe=new Map,H.programs=Xe);let Ve=Xe.get(Oe);if(Ve!==void 0){if(H.currentProgram===Ve&&H.lightsStateVersion===Te)return oc(S,Le),Ve}else Le.uniforms=O.getUniforms(S),S.onBuild(z,Le,y),S.onBeforeCompile(Le,y),Ve=O.acquireProgram(Le,Oe),Xe.set(Oe,Ve),H.uniforms=Le.uniforms;const We=H.uniforms;return(!S.isShaderMaterial&&!S.isRawShaderMaterial||S.clipping===!0)&&(We.clippingPlanes=xe.uniform),oc(S,Le),H.needsLights=op(S),H.lightsStateVersion=Te,H.needsLights&&(We.ambientLightColor.value=k.state.ambient,We.lightProbe.value=k.state.probe,We.directionalLights.value=k.state.directional,We.directionalLightShadows.value=k.state.directionalShadow,We.spotLights.value=k.state.spot,We.spotLightShadows.value=k.state.spotShadow,We.rectAreaLights.value=k.state.rectArea,We.ltc_1.value=k.state.rectAreaLTC1,We.ltc_2.value=k.state.rectAreaLTC2,We.pointLights.value=k.state.point,We.pointLightShadows.value=k.state.pointShadow,We.hemisphereLights.value=k.state.hemi,We.directionalShadowMap.value=k.state.directionalShadowMap,We.directionalShadowMatrix.value=k.state.directionalShadowMatrix,We.spotShadowMap.value=k.state.spotShadowMap,We.spotLightMatrix.value=k.state.spotLightMatrix,We.spotLightMap.value=k.state.spotLightMap,We.pointShadowMap.value=k.state.pointShadowMap,We.pointShadowMatrix.value=k.state.pointShadowMatrix),H.currentProgram=Ve,H.uniformsList=null,Ve}function ac(S){if(S.uniformsList===null){const N=S.currentProgram.getUniforms();S.uniformsList=ca.seqWithValue(N.seq,S.uniforms)}return S.uniformsList}function oc(S,N){const z=_e.get(S);z.outputColorSpace=N.outputColorSpace,z.instancing=N.instancing,z.instancingColor=N.instancingColor,z.skinning=N.skinning,z.morphTargets=N.morphTargets,z.morphNormals=N.morphNormals,z.morphColors=N.morphColors,z.morphTargetsCount=N.morphTargetsCount,z.numClippingPlanes=N.numClippingPlanes,z.numIntersection=N.numClipIntersection,z.vertexAlphas=N.vertexAlphas,z.vertexTangents=N.vertexTangents,z.toneMapping=N.toneMapping}function np(S,N,z,H,k){N.isScene!==!0&&(N=Ze),be.resetTextureUnits();const ue=N.fog,Te=H.isMeshStandardMaterial?N.environment:null,Le=C===null?y.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:yi,Oe=(H.isMeshStandardMaterial?ot:Ue).get(H.envMap||Te),Xe=H.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,Ve=!!z.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),We=!!z.morphAttributes.position,Rt=!!z.morphAttributes.normal,_t=!!z.morphAttributes.color;let Qt=Di;H.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(Qt=y.toneMapping);const bi=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,gt=bi!==void 0?bi.length:0,je=_e.get(H),Xa=g.state.lights;if(ve===!0&&(we===!0||S!==M)){const jt=S===M&&H.id===P;xe.setState(H,S,jt)}let ja=!1;H.version===je.__version?(je.needsLights&&je.lightsStateVersion!==Xa.state.version||je.outputColorSpace!==Le||k.isInstancedMesh&&je.instancing===!1||!k.isInstancedMesh&&je.instancing===!0||k.isSkinnedMesh&&je.skinning===!1||!k.isSkinnedMesh&&je.skinning===!0||k.isInstancedMesh&&je.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&je.instancingColor===!1&&k.instanceColor!==null||je.envMap!==Oe||H.fog===!0&&je.fog!==ue||je.numClippingPlanes!==void 0&&(je.numClippingPlanes!==xe.numPlanes||je.numIntersection!==xe.numIntersection)||je.vertexAlphas!==Xe||je.vertexTangents!==Ve||je.morphTargets!==We||je.morphNormals!==Rt||je.morphColors!==_t||je.toneMapping!==Qt||$.isWebGL2===!0&&je.morphTargetsCount!==gt)&&(ja=!0):(ja=!0,je.__version=H.version);let nr=je.currentProgram;ja===!0&&(nr=dn(H,N,k));let lc=!1,fs=!1,qa=!1;const Ot=nr.getUniforms(),ar=je.uniforms;if(pe.useProgram(nr.program)&&(lc=!0,fs=!0,qa=!0),H.id!==P&&(P=H.id,fs=!0),lc||M!==S){Ot.setValue(L,"projectionMatrix",S.projectionMatrix),Ot.setValue(L,"viewMatrix",S.matrixWorldInverse);const jt=Ot.map.cameraPosition;jt!==void 0&&jt.setValue(L,Ae.setFromMatrixPosition(S.matrixWorld)),$.logarithmicDepthBuffer&&Ot.setValue(L,"logDepthBufFC",2/(Math.log(S.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&Ot.setValue(L,"isOrthographic",S.isOrthographicCamera===!0),M!==S&&(M=S,fs=!0,qa=!0)}if(k.isSkinnedMesh){Ot.setOptional(L,k,"bindMatrix"),Ot.setOptional(L,k,"bindMatrixInverse");const jt=k.skeleton;jt&&($.floatVertexTextures?(jt.boneTexture===null&&jt.computeBoneTexture(),Ot.setValue(L,"boneTexture",jt.boneTexture,be),Ot.setValue(L,"boneTextureSize",jt.boneTextureSize)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}const Ya=z.morphAttributes;if((Ya.position!==void 0||Ya.normal!==void 0||Ya.color!==void 0&&$.isWebGL2===!0)&&Ie.update(k,z,nr),(fs||je.receiveShadow!==k.receiveShadow)&&(je.receiveShadow=k.receiveShadow,Ot.setValue(L,"receiveShadow",k.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(ar.envMap.value=Oe,ar.flipEnvMap.value=Oe.isCubeTexture&&Oe.isRenderTargetTexture===!1?-1:1),fs&&(Ot.setValue(L,"toneMappingExposure",y.toneMappingExposure),je.needsLights&&ap(ar,qa),ue&&H.fog===!0&&se.refreshFogUniforms(ar,ue),se.refreshMaterialUniforms(ar,H,W,Y,Me),ca.upload(L,ac(je),ar,be)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(ca.upload(L,ac(je),ar,be),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&Ot.setValue(L,"center",k.center),Ot.setValue(L,"modelViewMatrix",k.modelViewMatrix),Ot.setValue(L,"normalMatrix",k.normalMatrix),Ot.setValue(L,"modelMatrix",k.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const jt=H.uniformsGroups;for(let Za=0,lp=jt.length;Za<lp;Za++)if($.isWebGL2){const cc=jt[Za];Ne.update(cc,nr),Ne.bind(cc,nr)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return nr}function ap(S,N){S.ambientLightColor.needsUpdate=N,S.lightProbe.needsUpdate=N,S.directionalLights.needsUpdate=N,S.directionalLightShadows.needsUpdate=N,S.pointLights.needsUpdate=N,S.pointLightShadows.needsUpdate=N,S.spotLights.needsUpdate=N,S.spotLightShadows.needsUpdate=N,S.rectAreaLights.needsUpdate=N,S.hemisphereLights.needsUpdate=N}function op(S){return S.isMeshLambertMaterial||S.isMeshToonMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isShadowMaterial||S.isShaderMaterial&&S.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(S,N,z){_e.get(S.texture).__webglTexture=N,_e.get(S.depthTexture).__webglTexture=z;const H=_e.get(S);H.__hasExternalTextures=!0,H.__hasExternalTextures&&(H.__autoAllocateDepthBuffer=z===void 0,H.__autoAllocateDepthBuffer||Q.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),H.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(S,N){const z=_e.get(S);z.__webglFramebuffer=N,z.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(S,N=0,z=0){C=S,w=N,A=z;let H=!0,k=null,ue=!1,Te=!1;if(S){const Le=_e.get(S);Le.__useDefaultFramebuffer!==void 0?(pe.bindFramebuffer(L.FRAMEBUFFER,null),H=!1):Le.__webglFramebuffer===void 0?be.setupRenderTarget(S):Le.__hasExternalTextures&&be.rebindTextures(S,_e.get(S.texture).__webglTexture,_e.get(S.depthTexture).__webglTexture);const Oe=S.texture;(Oe.isData3DTexture||Oe.isDataArrayTexture||Oe.isCompressedArrayTexture)&&(Te=!0);const Xe=_e.get(S).__webglFramebuffer;S.isWebGLCubeRenderTarget?(Array.isArray(Xe[N])?k=Xe[N][z]:k=Xe[N],ue=!0):$.isWebGL2&&S.samples>0&&be.useMultisampledRTT(S)===!1?k=_e.get(S).__webglMultisampledFramebuffer:Array.isArray(Xe)?k=Xe[z]:k=Xe,T.copy(S.viewport),F.copy(S.scissor),G=S.scissorTest}else T.copy(K).multiplyScalar(W).floor(),F.copy(U).multiplyScalar(W).floor(),G=V;if(pe.bindFramebuffer(L.FRAMEBUFFER,k)&&$.drawBuffers&&H&&pe.drawBuffers(S,k),pe.viewport(T),pe.scissor(F),pe.setScissorTest(G),ue){const Le=_e.get(S.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+N,Le.__webglTexture,z)}else if(Te){const Le=_e.get(S.texture),Oe=N||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,Le.__webglTexture,z||0,Oe)}P=-1},this.readRenderTargetPixels=function(S,N,z,H,k,ue,Te){if(!(S&&S.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Le=_e.get(S).__webglFramebuffer;if(S.isWebGLCubeRenderTarget&&Te!==void 0&&(Le=Le[Te]),Le){pe.bindFramebuffer(L.FRAMEBUFFER,Le);try{const Oe=S.texture,Xe=Oe.format,Ve=Oe.type;if(Xe!==Zt&&tt.convert(Xe)!==L.getParameter(L.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const We=Ve===as&&(Q.has("EXT_color_buffer_half_float")||$.isWebGL2&&Q.has("EXT_color_buffer_float"));if(Ve!==Ui&&tt.convert(Ve)!==L.getParameter(L.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Ve===mi&&($.isWebGL2||Q.has("OES_texture_float")||Q.has("WEBGL_color_buffer_float")))&&!We){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=S.width-H&&z>=0&&z<=S.height-k&&L.readPixels(N,z,H,k,tt.convert(Xe),tt.convert(Ve),ue)}finally{const Oe=C!==null?_e.get(C).__webglFramebuffer:null;pe.bindFramebuffer(L.FRAMEBUFFER,Oe)}}},this.copyFramebufferToTexture=function(S,N,z=0){const H=Math.pow(2,-z),k=Math.floor(N.image.width*H),ue=Math.floor(N.image.height*H);be.setTexture2D(N,0),L.copyTexSubImage2D(L.TEXTURE_2D,z,0,0,S.x,S.y,k,ue),pe.unbindTexture()},this.copyTextureToTexture=function(S,N,z,H=0){const k=N.image.width,ue=N.image.height,Te=tt.convert(z.format),Le=tt.convert(z.type);be.setTexture2D(z,0),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,z.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,z.unpackAlignment),N.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,H,S.x,S.y,k,ue,Te,Le,N.image.data):N.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,H,S.x,S.y,N.mipmaps[0].width,N.mipmaps[0].height,Te,N.mipmaps[0].data):L.texSubImage2D(L.TEXTURE_2D,H,S.x,S.y,Te,Le,N.image),H===0&&z.generateMipmaps&&L.generateMipmap(L.TEXTURE_2D),pe.unbindTexture()},this.copyTextureToTexture3D=function(S,N,z,H,k=0){if(y.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const ue=S.max.x-S.min.x+1,Te=S.max.y-S.min.y+1,Le=S.max.z-S.min.z+1,Oe=tt.convert(H.format),Xe=tt.convert(H.type);let Ve;if(H.isData3DTexture)be.setTexture3D(H,0),Ve=L.TEXTURE_3D;else if(H.isDataArrayTexture)be.setTexture2DArray(H,0),Ve=L.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,H.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,H.unpackAlignment);const We=L.getParameter(L.UNPACK_ROW_LENGTH),Rt=L.getParameter(L.UNPACK_IMAGE_HEIGHT),_t=L.getParameter(L.UNPACK_SKIP_PIXELS),Qt=L.getParameter(L.UNPACK_SKIP_ROWS),bi=L.getParameter(L.UNPACK_SKIP_IMAGES),gt=z.isCompressedTexture?z.mipmaps[0]:z.image;L.pixelStorei(L.UNPACK_ROW_LENGTH,gt.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,gt.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,S.min.x),L.pixelStorei(L.UNPACK_SKIP_ROWS,S.min.y),L.pixelStorei(L.UNPACK_SKIP_IMAGES,S.min.z),z.isDataTexture||z.isData3DTexture?L.texSubImage3D(Ve,k,N.x,N.y,N.z,ue,Te,Le,Oe,Xe,gt.data):z.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),L.compressedTexSubImage3D(Ve,k,N.x,N.y,N.z,ue,Te,Le,Oe,gt.data)):L.texSubImage3D(Ve,k,N.x,N.y,N.z,ue,Te,Le,Oe,Xe,gt),L.pixelStorei(L.UNPACK_ROW_LENGTH,We),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Rt),L.pixelStorei(L.UNPACK_SKIP_PIXELS,_t),L.pixelStorei(L.UNPACK_SKIP_ROWS,Qt),L.pixelStorei(L.UNPACK_SKIP_IMAGES,bi),k===0&&H.generateMipmaps&&L.generateMipmap(Ve),pe.unbindTexture()},this.initTexture=function(S){S.isCubeTexture?be.setTextureCube(S,0):S.isData3DTexture?be.setTexture3D(S,0):S.isDataArrayTexture||S.isCompressedArrayTexture?be.setTexture2DArray(S,0):be.setTexture2D(S,0),pe.unbindTexture()},this.resetState=function(){w=0,A=0,C=null,pe.reset(),ze.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return fi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===xa?"display-p3":"srgb",t.unpackColorSpace=Qe.workingColorSpace===rn?"display-p3":"srgb"}get physicallyCorrectLights(){return console.warn("THREE.WebGLRenderer: The property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),!this.useLegacyLights}set physicallyCorrectLights(e){console.warn("THREE.WebGLRenderer: The property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."),this.useLegacyLights=!e}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Mt?$i:Ll}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===$i?Mt:yi}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class ad extends Fi{}ad.prototype.isWebGL1Renderer=!0;class Ta{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new oe(e),this.density=t}clone(){return new Ta(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Pr{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new oe(e),this.near=t,this.far=i}clone(){return new Pr(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class zi extends Ke{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}}class Aa{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Ws,this.updateRange={offset:0,count:-1},this.version=0,this.uuid=Kt()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=t.array[i+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Kt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Kt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ft=new E;class Ar{constructor(e,t,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix4(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Ft.fromBufferAttribute(this,t),Ft.applyNormalMatrix(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Ft.fromBufferAttribute(this,t),Ft.transformDirection(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}setX(e,t){return this.normalized&&(t=ke(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=ke(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=ke(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=ke(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Gt(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Gt(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Gt(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Gt(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=ke(t,this.array),i=ke(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=ke(t,this.array),i=ke(i,this.array),r=ke(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=ke(t,this.array),i=ke(i,this.array),r=ke(r,this.array),s=ke(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new Pe(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Ar(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Bl extends Ut{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new oe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Zr;const xs=new E,Jr=new E,Kr=new E,$r=new q,Ms=new q,od=new Fe,Nn=new E,bs=new E,On=new E,Yc=new q,Mo=new q,Zc=new q;class ld extends Ke{constructor(e=new Bl){if(super(),this.isSprite=!0,this.type="Sprite",Zr===void 0){Zr=new Re;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new Aa(t,5);Zr.setIndex([0,1,2,0,2,3]),Zr.setAttribute("position",new Ar(i,3,0,!1)),Zr.setAttribute("uv",new Ar(i,2,3,!1))}this.geometry=Zr,this.material=e,this.center=new q(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Jr.setFromMatrixScale(this.matrixWorld),od.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Kr.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Jr.multiplyScalar(-Kr.z);const i=this.material.rotation;let r,s;i!==0&&(s=Math.cos(i),r=Math.sin(i));const a=this.center;Fn(Nn.set(-.5,-.5,0),Kr,a,Jr,r,s),Fn(bs.set(.5,-.5,0),Kr,a,Jr,r,s),Fn(On.set(.5,.5,0),Kr,a,Jr,r,s),Yc.set(0,0),Mo.set(1,0),Zc.set(1,1);let o=e.ray.intersectTriangle(Nn,bs,On,!1,xs);if(o===null&&(Fn(bs.set(-.5,.5,0),Kr,a,Jr,r,s),Mo.set(0,1),o=e.ray.intersectTriangle(Nn,On,bs,!1,xs),o===null))return;const l=e.ray.origin.distanceTo(xs);l<e.near||l>e.far||t.push({distance:l,point:xs.clone(),uv:Ht.getInterpolation(xs,Nn,bs,On,Yc,Mo,Zc,new q),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Fn(n,e,t,i,r,s){$r.subVectors(n,t).addScalar(.5).multiply(i),r!==void 0?(Ms.x=s*$r.x-r*$r.y,Ms.y=r*$r.x+s*$r.y):Ms.copy($r),n.copy(e),n.x+=Ms.x,n.y+=Ms.y,n.applyMatrix4(od)}const zn=new E,Jc=new E;class cd extends Ke{constructor(){super(),this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]},isLOD:{value:!0}}),this.autoUpdate=!0}copy(e){super.copy(e,!1);const t=e.levels;for(let i=0,r=t.length;i<r;i++){const s=t[i];this.addLevel(s.object.clone(),s.distance,s.hysteresis)}return this.autoUpdate=e.autoUpdate,this}addLevel(e,t=0,i=0){t=Math.abs(t);const r=this.levels;let s;for(s=0;s<r.length&&!(t<r[s].distance);s++);return r.splice(s,0,{distance:t,hysteresis:i,object:e}),this.add(e),this}getCurrentLevel(){return this._currentLevel}getObjectForDistance(e){const t=this.levels;if(t.length>0){let i,r;for(i=1,r=t.length;i<r;i++){let s=t[i].distance;if(t[i].object.visible&&(s-=s*t[i].hysteresis),e<s)break}return t[i-1].object}return null}raycast(e,t){if(this.levels.length>0){zn.setFromMatrixPosition(this.matrixWorld);const i=e.ray.origin.distanceTo(zn);this.getObjectForDistance(i).raycast(e,t)}}update(e){const t=this.levels;if(t.length>1){zn.setFromMatrixPosition(e.matrixWorld),Jc.setFromMatrixPosition(this.matrixWorld);const i=zn.distanceTo(Jc)/e.zoom;t[0].object.visible=!0;let r,s;for(r=1,s=t.length;r<s;r++){let a=t[r].distance;if(t[r].object.visible&&(a-=a*t[r].hysteresis),i>=a)t[r-1].object.visible=!1,t[r].object.visible=!0;else break}for(this._currentLevel=r-1;r<s;r++)t[r].object.visible=!1}}toJSON(e){const t=super.toJSON(e);this.autoUpdate===!1&&(t.object.autoUpdate=!1),t.object.levels=[];const i=this.levels;for(let r=0,s=i.length;r<s;r++){const a=i[r];t.object.levels.push({object:a.object.uuid,distance:a.distance,hysteresis:a.hysteresis})}return t}}const Kc=new E,$c=new et,Qc=new et,uy=new E,eh=new Fe,Bn=new E,bo=new li,th=new Fe,So=new us;class hd extends at{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=zo,this.bindMatrix=new Fe,this.bindMatrixInverse=new Fe,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new xi),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Bn),this.boundingBox.expandByPoint(Bn)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new li),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let i=0;i<t.count;i++)this.getVertexPosition(i,Bn),this.boundingSphere.expandByPoint(Bn)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const i=this.material,r=this.matrixWorld;i!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),bo.copy(this.boundingSphere),bo.applyMatrix4(r),e.ray.intersectsSphere(bo)!==!1&&(th.copy(r).invert(),So.copy(e.ray).applyMatrix4(th),!(this.boundingBox!==null&&So.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,So)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new et,t=this.geometry.attributes.skinWeight;for(let i=0,r=t.count;i<r;i++){e.fromBufferAttribute(t,i);const s=1/e.manhattanLength();s!==1/0?e.multiplyScalar(s):e.set(1,0,0,0),t.setXYZW(i,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===zo?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===_u?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const i=this.skeleton,r=this.geometry;$c.fromBufferAttribute(r.attributes.skinIndex,e),Qc.fromBufferAttribute(r.attributes.skinWeight,e),Kc.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let s=0;s<4;s++){const a=Qc.getComponent(s);if(a!==0){const o=$c.getComponent(s);eh.multiplyMatrices(i.bones[o].matrixWorld,i.boneInverses[o]),t.addScaledVector(uy.copy(Kc).applyMatrix4(eh),a)}}return t.applyMatrix4(this.bindMatrixInverse)}boneTransform(e,t){return console.warn("THREE.SkinnedMesh: .boneTransform() was renamed to .applyBoneTransform() in r151."),this.applyBoneTransform(e,t)}}class kl extends Ke{constructor(){super(),this.isBone=!0,this.type="Bone"}}class ns extends mt{constructor(e=null,t=1,i=1,r,s,a,o,l,c=dt,h=dt,d,u){super(null,a,o,l,c,h,r,s,d,u),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const ih=new Fe,dy=new Fe;class Ra{constructor(e=[],t=[]){this.uuid=Kt(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.boneTextureSize=0,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let i=0,r=this.bones.length;i<r;i++)this.boneInverses.push(new Fe)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const i=new Fe;this.bones[e]&&i.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(i)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&i.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const i=this.bones[e];i&&(i.parent&&i.parent.isBone?(i.matrix.copy(i.parent.matrixWorld).invert(),i.matrix.multiply(i.matrixWorld)):i.matrix.copy(i.matrixWorld),i.matrix.decompose(i.position,i.quaternion,i.scale))}}update(){const e=this.bones,t=this.boneInverses,i=this.boneMatrices,r=this.boneTexture;for(let s=0,a=e.length;s<a;s++){const o=e[s]?e[s].matrixWorld:dy;ih.multiplyMatrices(o,t[s]),ih.toArray(i,s*16)}r!==null&&(r.needsUpdate=!0)}clone(){return new Ra(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Vu(e),e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const i=new ns(t,e,e,Zt,mi);return i.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=i,this.boneTextureSize=e,this}getBoneByName(e){for(let t=0,i=this.bones.length;t<i;t++){const r=this.bones[t];if(r.name===e)return r}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let i=0,r=e.bones.length;i<r;i++){const s=e.bones[i];let a=t[s];a===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),a=new kl),this.bones.push(a),this.boneInverses.push(new Fe().fromArray(e.boneInverses[i]))}return this.init(),this}toJSON(){const e={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,i=this.boneInverses;for(let r=0,s=t.length;r<s;r++){const a=t[r];e.bones.push(a.uuid);const o=i[r];e.boneInverses.push(o.toArray())}return e}}class cs extends Pe{constructor(e,t,i,r=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Qr=new Fe,rh=new Fe,kn=[],sh=new xi,py=new Fe,Ss=new at,ws=new li;class ud extends at{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new cs(new Float32Array(i*16),16),this.instanceColor=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,py)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new xi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Qr),sh.copy(e.boundingBox).applyMatrix4(Qr),this.boundingBox.union(sh)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new li),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Qr),ws.copy(e.boundingSphere).applyMatrix4(Qr),this.boundingSphere.union(ws)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}raycast(e,t){const i=this.matrixWorld,r=this.count;if(Ss.geometry=this.geometry,Ss.material=this.material,Ss.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ws.copy(this.boundingSphere),ws.applyMatrix4(i),e.ray.intersectsSphere(ws)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,Qr),rh.multiplyMatrices(i,Qr),Ss.matrixWorld=rh,Ss.raycast(e,kn);for(let a=0,o=kn.length;a<o;a++){const l=kn[a];l.instanceId=s,l.object=this,t.push(l)}kn.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new cs(new Float32Array(this.instanceMatrix.count*3),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class Et extends Ut{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new oe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const nh=new E,ah=new E,oh=new Fe,wo=new us,Hn=new li;class oi extends Ke{constructor(e=new Re,t=new Et){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)nh.fromBufferAttribute(t,r-1),ah.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=nh.distanceTo(ah);e.setAttribute("lineDistance",new fe(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Hn.copy(i.boundingSphere),Hn.applyMatrix4(r),Hn.radius+=s,e.ray.intersectsSphere(Hn)===!1)return;oh.copy(r).invert(),wo.copy(e.ray).applyMatrix4(oh);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=new E,h=new E,d=new E,u=new E,p=this.isLineSegments?2:1,f=i.index,v=i.attributes.position;if(f!==null){const g=Math.max(0,a.start),m=Math.min(f.count,a.start+a.count);for(let _=g,y=m-1;_<y;_+=p){const x=f.getX(_),w=f.getX(_+1);if(c.fromBufferAttribute(v,x),h.fromBufferAttribute(v,w),wo.distanceSqToSegment(c,h,u,d)>l)continue;u.applyMatrix4(this.matrixWorld);const A=e.ray.origin.distanceTo(u);A<e.near||A>e.far||t.push({distance:A,point:d.clone().applyMatrix4(this.matrixWorld),index:_,face:null,faceIndex:null,object:this})}}else{const g=Math.max(0,a.start),m=Math.min(v.count,a.start+a.count);for(let _=g,y=m-1;_<y;_+=p){if(c.fromBufferAttribute(v,_),h.fromBufferAttribute(v,_+1),wo.distanceSqToSegment(c,h,u,d)>l)continue;u.applyMatrix4(this.matrixWorld);const x=e.ray.origin.distanceTo(u);x<e.near||x>e.far||t.push({distance:x,point:d.clone().applyMatrix4(this.matrixWorld),index:_,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){const i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=i.length;r<s;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}const lh=new E,ch=new E;class Mi extends oi{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let r=0,s=t.count;r<s;r+=2)lh.fromBufferAttribute(t,r),ch.fromBufferAttribute(t,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+lh.distanceTo(ch);e.setAttribute("lineDistance",new fe(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class dd extends oi{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class on extends Ut{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new oe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const hh=new Fe,fl=new us,Gn=new li,Vn=new E;class _i extends Ke{constructor(e=new Re,t=new on){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Gn.copy(i.boundingSphere),Gn.applyMatrix4(r),Gn.radius+=s,e.ray.intersectsSphere(Gn)===!1)return;hh.copy(r).invert(),fl.copy(e.ray).applyMatrix4(hh);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=i.index,h=i.attributes.position;if(c!==null){const d=Math.max(0,a.start),u=Math.min(c.count,a.start+a.count);for(let p=d,f=u;p<f;p++){const v=c.getX(p);Vn.fromBufferAttribute(h,v),uh(Vn,v,l,r,e,t,this)}}else{const d=Math.max(0,a.start),u=Math.min(h.count,a.start+a.count);for(let p=d,f=u;p<f;p++)Vn.fromBufferAttribute(h,p),uh(Vn,p,l,r,e,t,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){const i=e[t[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=i.length;r<s;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function uh(n,e,t,i,r,s,a){const o=fl.distanceSqToPoint(n);if(o<t){const l=new E;fl.closestPointToPoint(n,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,object:a})}}class my extends mt{constructor(e,t,i,r,s,a,o,l,c){super(e,t,i,r,s,a,o,l,c),this.isVideoTexture=!0,this.minFilter=a!==void 0?a:pt,this.magFilter=s!==void 0?s:pt,this.generateMipmaps=!1;const h=this;function d(){h.needsUpdate=!0,e.requestVideoFrameCallback(d)}"requestVideoFrameCallback"in e&&e.requestVideoFrameCallback(d)}clone(){return new this.constructor(this.image).copy(this)}update(){const e=this.image;!("requestVideoFrameCallback"in e)&&e.readyState>=e.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}}class fy extends mt{constructor(e,t){super({width:e,height:t}),this.isFramebufferTexture=!0,this.magFilter=dt,this.minFilter=dt,this.generateMipmaps=!1,this.needsUpdate=!0}}class Ca extends mt{constructor(e,t,i,r,s,a,o,l,c,h,d,u){super(null,a,o,l,c,h,r,s,d,u),this.isCompressedTexture=!0,this.image={width:t,height:i},this.mipmaps=e,this.flipY=!1,this.generateMipmaps=!1}}class gy extends Ca{constructor(e,t,i,r,s,a){super(e,t,i,s,a),this.isCompressedArrayTexture=!0,this.image.depth=r,this.wrapR=It}}class vy extends Ca{constructor(e,t,i){super(void 0,e[0].width,e[0].height,t,i,Oi),this.isCompressedCubeTexture=!0,this.isCubeTexture=!0,this.image=e}}class yy extends mt{constructor(e,t,i,r,s,a,o,l,c){super(e,t,i,r,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ci{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,r=this.getPoint(0),s=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),s+=i.distanceTo(r),t.push(s),r=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const i=this.getLengths();let r=0;const s=i.length;let a;t?a=t:a=e*i[s-1];let o=0,l=s-1,c;for(;o<=l;)if(r=Math.floor(o+(l-o)/2),c=i[r]-a,c<0)o=r+1;else if(c>0)l=r-1;else{l=r;break}if(r=l,i[r]===a)return r/(s-1);const h=i[r],d=i[r+1]-h,u=(a-h)/d;return(r+u)/(s-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);const s=this.getPoint(i),a=this.getPoint(r),o=t||(s.isVector2?new q:new E);return o.copy(a).sub(s).normalize(),o}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t){const i=new E,r=[],s=[],a=[],o=new E,l=new Fe;for(let p=0;p<=e;p++){const f=p/e;r[p]=this.getTangentAt(f,new E)}s[0]=new E,a[0]=new E;let c=Number.MAX_VALUE;const h=Math.abs(r[0].x),d=Math.abs(r[0].y),u=Math.abs(r[0].z);h<=c&&(c=h,i.set(1,0,0)),d<=c&&(c=d,i.set(0,1,0)),u<=c&&i.set(0,0,1),o.crossVectors(r[0],i).normalize(),s[0].crossVectors(r[0],o),a[0].crossVectors(r[0],s[0]);for(let p=1;p<=e;p++){if(s[p]=s[p-1].clone(),a[p]=a[p-1].clone(),o.crossVectors(r[p-1],r[p]),o.length()>Number.EPSILON){o.normalize();const f=Math.acos(ht(r[p-1].dot(r[p]),-1,1));s[p].applyMatrix4(l.makeRotationAxis(o,f))}a[p].crossVectors(r[p],s[p])}if(t===!0){let p=Math.acos(ht(s[0].dot(s[e]),-1,1));p/=e,r[0].dot(o.crossVectors(s[0],s[e]))>0&&(p=-p);for(let f=1;f<=e;f++)s[f].applyMatrix4(l.makeRotationAxis(r[f],p*f)),a[f].crossVectors(r[f],s[f])}return{tangents:r,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class La extends ci{constructor(e=0,t=0,i=1,r=1,s=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t){const i=t||new q,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(a?s=0:s=r),this.aClockwise===!0&&!a&&(s===r?s=-r:s=s-r);const o=this.aStartAngle+e*s;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=l-this.aX,p=c-this.aY;l=u*h-p*d+this.aX,c=u*d+p*h+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class pd extends La{constructor(e,t,i,r,s,a){super(e,t,i,i,r,s,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Hl(){let n=0,e=0,t=0,i=0;function r(s,a,o,l){n=s,e=o,t=-3*s+3*a-2*o-l,i=2*s-2*a+o+l}return{initCatmullRom:function(s,a,o,l,c){r(a,o,c*(o-s),c*(l-a))},initNonuniformCatmullRom:function(s,a,o,l,c,h,d){let u=(a-s)/c-(o-s)/(c+h)+(o-a)/h,p=(o-a)/h-(l-a)/(h+d)+(l-o)/d;u*=h,p*=h,r(a,o,u,p)},calc:function(s){const a=s*s,o=a*s;return n+e*s+t*a+i*o}}}const Wn=new E,Eo=new Hl,To=new Hl,Ao=new Hl;class md extends ci{constructor(e=[],t=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=r}getPoint(e,t=new E){const i=t,r=this.points,s=r.length,a=(s-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:l===0&&o===s-1&&(o=s-2,l=1);let c,h;this.closed||o>0?c=r[(o-1)%s]:(Wn.subVectors(r[0],r[1]).add(r[0]),c=Wn);const d=r[o%s],u=r[(o+1)%s];if(this.closed||o+2<s?h=r[(o+2)%s]:(Wn.subVectors(r[s-1],r[s-2]).add(r[s-1]),h=Wn),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let f=Math.pow(c.distanceToSquared(d),p),v=Math.pow(d.distanceToSquared(u),p),g=Math.pow(u.distanceToSquared(h),p);v<1e-4&&(v=1),f<1e-4&&(f=v),g<1e-4&&(g=v),Eo.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,f,v,g),To.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,f,v,g),Ao.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,f,v,g)}else this.curveType==="catmullrom"&&(Eo.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),To.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),Ao.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return i.set(Eo.calc(l),To.calc(l),Ao.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new E().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function dh(n,e,t,i,r){const s=(i-e)*.5,a=(r-t)*.5,o=n*n,l=n*o;return(2*t-2*i+s+a)*l+(-3*t+3*i-2*s-a)*o+s*n+t}function _y(n,e){const t=1-n;return t*t*e}function xy(n,e){return 2*(1-n)*n*e}function My(n,e){return n*n*e}function Ps(n,e,t,i){return _y(n,e)+xy(n,t)+My(n,i)}function by(n,e){const t=1-n;return t*t*t*e}function Sy(n,e){const t=1-n;return 3*t*t*n*e}function wy(n,e){return 3*(1-n)*n*n*e}function Ey(n,e){return n*n*n*e}function Is(n,e,t,i,r){return by(n,e)+Sy(n,t)+wy(n,i)+Ey(n,r)}class Gl extends ci{constructor(e=new q,t=new q,i=new q,r=new q){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new q){const i=t,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return i.set(Is(e,r.x,s.x,a.x,o.x),Is(e,r.y,s.y,a.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class fd extends ci{constructor(e=new E,t=new E,i=new E,r=new E){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new E){const i=t,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return i.set(Is(e,r.x,s.x,a.x,o.x),Is(e,r.y,s.y,a.y,o.y),Is(e,r.z,s.z,a.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Vl extends ci{constructor(e=new q,t=new q){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new q){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new q){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class gd extends ci{constructor(e=new E,t=new E){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new E){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new E){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Wl extends ci{constructor(e=new q,t=new q,i=new q){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new q){const i=t,r=this.v0,s=this.v1,a=this.v2;return i.set(Ps(e,r.x,s.x,a.x),Ps(e,r.y,s.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Xl extends ci{constructor(e=new E,t=new E,i=new E){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new E){const i=t,r=this.v0,s=this.v1,a=this.v2;return i.set(Ps(e,r.x,s.x,a.x),Ps(e,r.y,s.y,a.y),Ps(e,r.z,s.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class jl extends ci{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new q){const i=t,r=this.points,s=(r.length-1)*e,a=Math.floor(s),o=s-a,l=r[a===0?a:a-1],c=r[a],h=r[a>r.length-2?r.length-1:a+1],d=r[a>r.length-3?r.length-1:a+2];return i.set(dh(o,l.x,c.x,h.x,d.x),dh(o,l.y,c.y,h.y,d.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new q().fromArray(r))}return this}}var fa=Object.freeze({__proto__:null,ArcCurve:pd,CatmullRomCurve3:md,CubicBezierCurve:Gl,CubicBezierCurve3:fd,EllipseCurve:La,LineCurve:Vl,LineCurve3:gd,QuadraticBezierCurve:Wl,QuadraticBezierCurve3:Xl,SplineCurve:jl});class vd extends ci{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new fa[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=i){const a=r[s]-i,o=this.curves[s],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}s++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,r=this.curves.length;i<r;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let r=0,s=this.curves;r<s.length;r++){const a=s[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(t.push(h),i=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const r=e.curves[t];this.curves.push(new fa[r.type]().fromJSON(r))}return this}}class qs extends vd{constructor(e){super(),this.type="Path",this.currentPoint=new q,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new Vl(this.currentPoint.clone(),new q(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,r){const s=new Wl(this.currentPoint.clone(),new q(e,t),new q(i,r));return this.curves.push(s),this.currentPoint.set(i,r),this}bezierCurveTo(e,t,i,r,s,a){const o=new Gl(this.currentPoint.clone(),new q(e,t),new q(i,r),new q(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new jl(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,r,s,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,i,r,s,a),this}absarc(e,t,i,r,s,a){return this.absellipse(e,t,i,i,r,s,a),this}ellipse(e,t,i,r,s,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,i,r,s,a,o,l),this}absellipse(e,t,i,r,s,a,o,l){const c=new La(e,t,i,r,s,a,o,l);if(this.curves.length>0){const d=c.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class ln extends Re{constructor(e=[new q(0,-.5),new q(.5,0),new q(0,.5)],t=12,i=0,r=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:t,phiStart:i,phiLength:r},t=Math.floor(t),r=ht(r,0,Math.PI*2);const s=[],a=[],o=[],l=[],c=[],h=1/t,d=new E,u=new q,p=new E,f=new E,v=new E;let g=0,m=0;for(let _=0;_<=e.length-1;_++)switch(_){case 0:g=e[_+1].x-e[_].x,m=e[_+1].y-e[_].y,p.x=m*1,p.y=-g,p.z=m*0,v.copy(p),p.normalize(),l.push(p.x,p.y,p.z);break;case e.length-1:l.push(v.x,v.y,v.z);break;default:g=e[_+1].x-e[_].x,m=e[_+1].y-e[_].y,p.x=m*1,p.y=-g,p.z=m*0,f.copy(p),p.x+=v.x,p.y+=v.y,p.z+=v.z,p.normalize(),l.push(p.x,p.y,p.z),v.copy(f)}for(let _=0;_<=t;_++){const y=i+_*h*r,x=Math.sin(y),w=Math.cos(y);for(let A=0;A<=e.length-1;A++){d.x=e[A].x*x,d.y=e[A].y,d.z=e[A].x*w,a.push(d.x,d.y,d.z),u.x=_/t,u.y=A/(e.length-1),o.push(u.x,u.y);const C=l[3*A+0]*x,P=l[3*A+1],M=l[3*A+0]*w;c.push(C,P,M)}}for(let _=0;_<t;_++)for(let y=0;y<e.length-1;y++){const x=y+_*e.length,w=x,A=x+e.length,C=x+e.length+1,P=x+1;s.push(w,A,P),s.push(C,P,A)}this.setIndex(s),this.setAttribute("position",new fe(a,3)),this.setAttribute("uv",new fe(o,2)),this.setAttribute("normal",new fe(c,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ln(e.points,e.segments,e.phiStart,e.phiLength)}}class Pa extends ln{constructor(e=1,t=1,i=4,r=8){const s=new qs;s.absarc(0,-t/2,e,Math.PI*1.5,0),s.absarc(0,t/2,e,0,Math.PI*.5),super(s.getPoints(i),r),this.type="CapsuleGeometry",this.parameters={radius:e,length:t,capSegments:i,radialSegments:r}}static fromJSON(e){return new Pa(e.radius,e.length,e.capSegments,e.radialSegments)}}class Ia extends Re{constructor(e=1,t=32,i=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:r},t=Math.max(3,t);const s=[],a=[],o=[],l=[],c=new E,h=new q;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let d=0,u=3;d<=t;d++,u+=3){const p=i+d/t*r;c.x=e*Math.cos(p),c.y=e*Math.sin(p),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[u]/e+1)/2,h.y=(a[u+1]/e+1)/2,l.push(h.x,h.y)}for(let d=1;d<=t;d++)s.push(d,d+1,0);this.setIndex(s),this.setAttribute("position",new fe(a,3)),this.setAttribute("normal",new fe(o,3)),this.setAttribute("uv",new fe(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ia(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class ps extends Re{constructor(e=1,t=1,i=1,r=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const h=[],d=[],u=[],p=[];let f=0;const v=[],g=i/2;let m=0;_(),a===!1&&(e>0&&y(!0),t>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new fe(d,3)),this.setAttribute("normal",new fe(u,3)),this.setAttribute("uv",new fe(p,2));function _(){const x=new E,w=new E;let A=0;const C=(t-e)/i;for(let P=0;P<=s;P++){const M=[],T=P/s,F=T*(t-e)+e;for(let G=0;G<=r;G++){const Z=G/r,D=Z*l+o,B=Math.sin(D),Y=Math.cos(D);w.x=F*B,w.y=-T*i+g,w.z=F*Y,d.push(w.x,w.y,w.z),x.set(B,C,Y).normalize(),u.push(x.x,x.y,x.z),p.push(Z,1-T),M.push(f++)}v.push(M)}for(let P=0;P<r;P++)for(let M=0;M<s;M++){const T=v[M][P],F=v[M+1][P],G=v[M+1][P+1],Z=v[M][P+1];h.push(T,F,Z),h.push(F,G,Z),A+=6}c.addGroup(m,A,0),m+=A}function y(x){const w=f,A=new q,C=new E;let P=0;const M=x===!0?e:t,T=x===!0?1:-1;for(let G=1;G<=r;G++)d.push(0,g*T,0),u.push(0,T,0),p.push(.5,.5),f++;const F=f;for(let G=0;G<=r;G++){const Z=G/r*l+o,D=Math.cos(Z),B=Math.sin(Z);C.x=M*B,C.y=g*T,C.z=M*D,d.push(C.x,C.y,C.z),u.push(0,T,0),A.x=D*.5+.5,A.y=B*.5*T+.5,p.push(A.x,A.y),f++}for(let G=0;G<r;G++){const Z=w+G,D=F+G;x===!0?h.push(D,D+1,Z):h.push(D+1,D,Z),P+=3}c.addGroup(m,P,x===!0?1:2),m+=P}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ps(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Da extends ps{constructor(e=1,t=1,i=32,r=1,s=!1,a=0,o=Math.PI*2){super(0,e,t,i,r,s,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:r,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Da(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class rr extends Re{constructor(e=[],t=[],i=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:r};const s=[],a=[];o(r),c(i),h(),this.setAttribute("position",new fe(s,3)),this.setAttribute("normal",new fe(s.slice(),3)),this.setAttribute("uv",new fe(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(_){const y=new E,x=new E,w=new E;for(let A=0;A<t.length;A+=3)p(t[A+0],y),p(t[A+1],x),p(t[A+2],w),l(y,x,w,_)}function l(_,y,x,w){const A=w+1,C=[];for(let P=0;P<=A;P++){C[P]=[];const M=_.clone().lerp(x,P/A),T=y.clone().lerp(x,P/A),F=A-P;for(let G=0;G<=F;G++)G===0&&P===A?C[P][G]=M:C[P][G]=M.clone().lerp(T,G/F)}for(let P=0;P<A;P++)for(let M=0;M<2*(A-P)-1;M++){const T=Math.floor(M/2);M%2===0?(u(C[P][T+1]),u(C[P+1][T]),u(C[P][T])):(u(C[P][T+1]),u(C[P+1][T+1]),u(C[P+1][T]))}}function c(_){const y=new E;for(let x=0;x<s.length;x+=3)y.x=s[x+0],y.y=s[x+1],y.z=s[x+2],y.normalize().multiplyScalar(_),s[x+0]=y.x,s[x+1]=y.y,s[x+2]=y.z}function h(){const _=new E;for(let y=0;y<s.length;y+=3){_.x=s[y+0],_.y=s[y+1],_.z=s[y+2];const x=g(_)/2/Math.PI+.5,w=m(_)/Math.PI+.5;a.push(x,1-w)}f(),d()}function d(){for(let _=0;_<a.length;_+=6){const y=a[_+0],x=a[_+2],w=a[_+4],A=Math.max(y,x,w),C=Math.min(y,x,w);A>.9&&C<.1&&(y<.2&&(a[_+0]+=1),x<.2&&(a[_+2]+=1),w<.2&&(a[_+4]+=1))}}function u(_){s.push(_.x,_.y,_.z)}function p(_,y){const x=_*3;y.x=e[x+0],y.y=e[x+1],y.z=e[x+2]}function f(){const _=new E,y=new E,x=new E,w=new E,A=new q,C=new q,P=new q;for(let M=0,T=0;M<s.length;M+=9,T+=6){_.set(s[M+0],s[M+1],s[M+2]),y.set(s[M+3],s[M+4],s[M+5]),x.set(s[M+6],s[M+7],s[M+8]),A.set(a[T+0],a[T+1]),C.set(a[T+2],a[T+3]),P.set(a[T+4],a[T+5]),w.copy(_).add(y).add(x).divideScalar(3);const F=g(w);v(A,T+0,_,F),v(C,T+2,y,F),v(P,T+4,x,F)}}function v(_,y,x,w){w<0&&_.x===1&&(a[y]=_.x-1),x.x===0&&x.z===0&&(a[y]=w/2/Math.PI+.5)}function g(_){return Math.atan2(_.z,-_.x)}function m(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new rr(e.vertices,e.indices,e.radius,e.details)}}class Ua extends rr{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,r=1/i,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-i,0,-r,i,0,r,-i,0,r,i,-r,-i,0,-r,i,0,r,-i,0,r,i,0,-i,0,-r,i,0,-r,-i,0,r,i,0,r],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,a,e,t),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ua(e.radius,e.detail)}}const Xn=new E,jn=new E,Ro=new E,qn=new Ht;class yd extends Re{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const i=Math.pow(10,4),r=Math.cos(wr*t),s=e.getIndex(),a=e.getAttribute("position"),o=s?s.count:a.count,l=[0,0,0],c=["a","b","c"],h=new Array(3),d={},u=[];for(let p=0;p<o;p+=3){s?(l[0]=s.getX(p),l[1]=s.getX(p+1),l[2]=s.getX(p+2)):(l[0]=p,l[1]=p+1,l[2]=p+2);const{a:f,b:v,c:g}=qn;if(f.fromBufferAttribute(a,l[0]),v.fromBufferAttribute(a,l[1]),g.fromBufferAttribute(a,l[2]),qn.getNormal(Ro),h[0]=`${Math.round(f.x*i)},${Math.round(f.y*i)},${Math.round(f.z*i)}`,h[1]=`${Math.round(v.x*i)},${Math.round(v.y*i)},${Math.round(v.z*i)}`,h[2]=`${Math.round(g.x*i)},${Math.round(g.y*i)},${Math.round(g.z*i)}`,!(h[0]===h[1]||h[1]===h[2]||h[2]===h[0]))for(let m=0;m<3;m++){const _=(m+1)%3,y=h[m],x=h[_],w=qn[c[m]],A=qn[c[_]],C=`${y}_${x}`,P=`${x}_${y}`;P in d&&d[P]?(Ro.dot(d[P].normal)<=r&&(u.push(w.x,w.y,w.z),u.push(A.x,A.y,A.z)),d[P]=null):C in d||(d[C]={index0:l[m],index1:l[_],normal:Ro.clone()})}}for(const p in d)if(d[p]){const{index0:f,index1:v}=d[p];Xn.fromBufferAttribute(a,f),jn.fromBufferAttribute(a,v),u.push(Xn.x,Xn.y,Xn.z),u.push(jn.x,jn.y,jn.z)}this.setAttribute("position",new fe(u,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class Er extends qs{constructor(e){super(e),this.uuid=Kt(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,r=this.holes.length;i<r;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const r=e.holes[t];this.holes.push(new qs().fromJSON(r))}return this}}const Ty={triangulate:function(n,e,t=2){const i=e&&e.length,r=i?e[0]*t:n.length;let s=_d(n,0,r,t,!0);const a=[];if(!s||s.next===s.prev)return a;let o,l,c,h,d,u,p;if(i&&(s=Py(n,e,s,t)),n.length>80*t){o=c=n[0],l=h=n[1];for(let f=t;f<r;f+=t)d=n[f],u=n[f+1],d<o&&(o=d),u<l&&(l=u),d>c&&(c=d),u>h&&(h=u);p=Math.max(c-o,h-l),p=p!==0?32767/p:0}return Ys(s,a,t,o,l,p,0),a}};function _d(n,e,t,i,r){let s,a;if(r===Gy(n,e,t,i)>0)for(s=e;s<t;s+=i)a=ph(s,n[s],n[s+1],a);else for(s=t-i;s>=e;s-=i)a=ph(s,n[s],n[s+1],a);return a&&Na(a,a.next)&&(Js(a),a=a.next),a}function Rr(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(Na(t,t.next)||lt(t.prev,t,t.next)===0)){if(Js(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Ys(n,e,t,i,r,s,a){if(!n)return;!a&&s&&Oy(n,i,r,s);let o=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,s?Ry(n,i,r,s):Ay(n)){e.push(l.i/t|0),e.push(n.i/t|0),e.push(c.i/t|0),Js(n),n=c.next,o=c.next;continue}if(n=c,n===o){a?a===1?(n=Cy(Rr(n),e,t),Ys(n,e,t,i,r,s,2)):a===2&&Ly(n,e,t,i,r,s):Ys(Rr(n),e,t,i,r,s,1);break}}}function Ay(n){const e=n.prev,t=n,i=n.next;if(lt(e,t,i)>=0)return!1;const r=e.x,s=t.x,a=i.x,o=e.y,l=t.y,c=i.y,h=r<s?r<a?r:a:s<a?s:a,d=o<l?o<c?o:c:l<c?l:c,u=r>s?r>a?r:a:s>a?s:a,p=o>l?o>c?o:c:l>c?l:c;let f=i.next;for(;f!==e;){if(f.x>=h&&f.x<=u&&f.y>=d&&f.y<=p&&is(r,o,s,l,a,c,f.x,f.y)&&lt(f.prev,f,f.next)>=0)return!1;f=f.next}return!0}function Ry(n,e,t,i){const r=n.prev,s=n,a=n.next;if(lt(r,s,a)>=0)return!1;const o=r.x,l=s.x,c=a.x,h=r.y,d=s.y,u=a.y,p=o<l?o<c?o:c:l<c?l:c,f=h<d?h<u?h:u:d<u?d:u,v=o>l?o>c?o:c:l>c?l:c,g=h>d?h>u?h:u:d>u?d:u,m=gl(p,f,e,t,i),_=gl(v,g,e,t,i);let y=n.prevZ,x=n.nextZ;for(;y&&y.z>=m&&x&&x.z<=_;){if(y.x>=p&&y.x<=v&&y.y>=f&&y.y<=g&&y!==r&&y!==a&&is(o,h,l,d,c,u,y.x,y.y)&&lt(y.prev,y,y.next)>=0||(y=y.prevZ,x.x>=p&&x.x<=v&&x.y>=f&&x.y<=g&&x!==r&&x!==a&&is(o,h,l,d,c,u,x.x,x.y)&&lt(x.prev,x,x.next)>=0))return!1;x=x.nextZ}for(;y&&y.z>=m;){if(y.x>=p&&y.x<=v&&y.y>=f&&y.y<=g&&y!==r&&y!==a&&is(o,h,l,d,c,u,y.x,y.y)&&lt(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;x&&x.z<=_;){if(x.x>=p&&x.x<=v&&x.y>=f&&x.y<=g&&x!==r&&x!==a&&is(o,h,l,d,c,u,x.x,x.y)&&lt(x.prev,x,x.next)>=0)return!1;x=x.nextZ}return!0}function Cy(n,e,t){let i=n;do{const r=i.prev,s=i.next.next;!Na(r,s)&&xd(r,i,i.next,s)&&Zs(r,s)&&Zs(s,r)&&(e.push(r.i/t|0),e.push(i.i/t|0),e.push(s.i/t|0),Js(i),Js(i.next),i=n=s),i=i.next}while(i!==n);return Rr(i)}function Ly(n,e,t,i,r,s){let a=n;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&By(a,o)){let l=Md(a,o);a=Rr(a,a.next),l=Rr(l,l.next),Ys(a,e,t,i,r,s,0),Ys(l,e,t,i,r,s,0);return}o=o.next}a=a.next}while(a!==n)}function Py(n,e,t,i){const r=[];let s,a,o,l,c;for(s=0,a=e.length;s<a;s++)o=e[s]*i,l=s<a-1?e[s+1]*i:n.length,c=_d(n,o,l,i,!1),c===c.next&&(c.steiner=!0),r.push(zy(c));for(r.sort(Iy),s=0;s<r.length;s++)t=Dy(r[s],t);return t}function Iy(n,e){return n.x-e.x}function Dy(n,e){const t=Uy(n,e);if(!t)return e;const i=Md(t,n);return Rr(i,i.next),Rr(t,t.next)}function Uy(n,e){let t=e,i=-1/0,r;const s=n.x,a=n.y;do{if(a<=t.y&&a>=t.next.y&&t.next.y!==t.y){const u=t.x+(a-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=s&&u>i&&(i=u,r=t.x<t.next.x?t:t.next,u===s))return r}t=t.next}while(t!==e);if(!r)return null;const o=r,l=r.x,c=r.y;let h=1/0,d;t=r;do s>=t.x&&t.x>=l&&s!==t.x&&is(a<c?s:i,a,l,c,a<c?i:s,a,t.x,t.y)&&(d=Math.abs(a-t.y)/(s-t.x),Zs(t,n)&&(d<h||d===h&&(t.x>r.x||t.x===r.x&&Ny(r,t)))&&(r=t,h=d)),t=t.next;while(t!==o);return r}function Ny(n,e){return lt(n.prev,n,e.prev)<0&&lt(e.next,n,n.next)<0}function Oy(n,e,t,i){let r=n;do r.z===0&&(r.z=gl(r.x,r.y,e,t,i)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==n);r.prevZ.nextZ=null,r.prevZ=null,Fy(r)}function Fy(n){let e,t,i,r,s,a,o,l,c=1;do{for(t=n,n=null,s=null,a=0;t;){for(a++,i=t,o=0,e=0;e<c&&(o++,i=i.nextZ,!!i);e++);for(l=c;o>0||l>0&&i;)o!==0&&(l===0||!i||t.z<=i.z)?(r=t,t=t.nextZ,o--):(r=i,i=i.nextZ,l--),s?s.nextZ=r:n=r,r.prevZ=s,s=r;t=i}s.nextZ=null,c*=2}while(a>1);return n}function gl(n,e,t,i,r){return n=(n-t)*r|0,e=(e-i)*r|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function zy(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function is(n,e,t,i,r,s,a,o){return(r-a)*(e-o)>=(n-a)*(s-o)&&(n-a)*(i-o)>=(t-a)*(e-o)&&(t-a)*(s-o)>=(r-a)*(i-o)}function By(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!ky(n,e)&&(Zs(n,e)&&Zs(e,n)&&Hy(n,e)&&(lt(n.prev,n,e.prev)||lt(n,e.prev,e))||Na(n,e)&&lt(n.prev,n,n.next)>0&&lt(e.prev,e,e.next)>0)}function lt(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function Na(n,e){return n.x===e.x&&n.y===e.y}function xd(n,e,t,i){const r=Zn(lt(n,e,t)),s=Zn(lt(n,e,i)),a=Zn(lt(t,i,n)),o=Zn(lt(t,i,e));return!!(r!==s&&a!==o||r===0&&Yn(n,t,e)||s===0&&Yn(n,i,e)||a===0&&Yn(t,n,i)||o===0&&Yn(t,e,i))}function Yn(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function Zn(n){return n>0?1:n<0?-1:0}function ky(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&xd(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function Zs(n,e){return lt(n.prev,n,n.next)<0?lt(n,e,n.next)>=0&&lt(n,n.prev,e)>=0:lt(n,e,n.prev)<0||lt(n,n.next,e)<0}function Hy(n,e){let t=n,i=!1;const r=(n.x+e.x)/2,s=(n.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&r<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function Md(n,e){const t=new vl(n.i,n.x,n.y),i=new vl(e.i,e.x,e.y),r=n.next,s=e.prev;return n.next=e,e.prev=n,t.next=r,r.prev=t,i.next=t,t.prev=i,s.next=i,i.prev=s,i}function ph(n,e,t,i){const r=new vl(n,e,t);return i?(r.next=i.next,r.prev=i,i.next.prev=r,i.next=r):(r.prev=r,r.next=r),r}function Js(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function vl(n,e,t){this.i=n,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function Gy(n,e,t,i){let r=0;for(let s=e,a=t-i;s<t;s+=i)r+=(n[a]-n[s])*(n[s+1]+n[a+1]),a=s;return r}class gi{static area(e){const t=e.length;let i=0;for(let r=t-1,s=0;s<t;r=s++)i+=e[r].x*e[s].y-e[s].x*e[r].y;return i*.5}static isClockWise(e){return gi.area(e)<0}static triangulateShape(e,t){const i=[],r=[],s=[];mh(e),fh(i,e);let a=e.length;t.forEach(mh);for(let l=0;l<t.length;l++)r.push(a),a+=t[l].length,fh(i,t[l]);const o=Ty.triangulate(i,r);for(let l=0;l<o.length;l+=3)s.push(o.slice(l,l+3));return s}}function mh(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function fh(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class Oa extends Re{constructor(e=new Er([new q(.5,.5),new q(-.5,.5),new q(-.5,-.5),new q(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const i=this,r=[],s=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];a(c)}this.setAttribute("position",new fe(r,3)),this.setAttribute("uv",new fe(s,2)),this.computeVertexNormals();function a(o){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,d=t.depth!==void 0?t.depth:1;let u=t.bevelEnabled!==void 0?t.bevelEnabled:!0,p=t.bevelThickness!==void 0?t.bevelThickness:.2,f=t.bevelSize!==void 0?t.bevelSize:p-.1,v=t.bevelOffset!==void 0?t.bevelOffset:0,g=t.bevelSegments!==void 0?t.bevelSegments:3;const m=t.extrudePath,_=t.UVGenerator!==void 0?t.UVGenerator:Vy;let y,x=!1,w,A,C,P;m&&(y=m.getSpacedPoints(h),x=!0,u=!1,w=m.computeFrenetFrames(h,!1),A=new E,C=new E,P=new E),u||(g=0,p=0,f=0,v=0);const M=o.extractPoints(c);let T=M.shape;const F=M.holes;if(!gi.isClockWise(T)){T=T.reverse();for(let j=0,L=F.length;j<L;j++){const he=F[j];gi.isClockWise(he)&&(F[j]=he.reverse())}}const G=gi.triangulateShape(T,F),Z=T;for(let j=0,L=F.length;j<L;j++){const he=F[j];T=T.concat(he)}function D(j,L,he){return L||console.error("THREE.ExtrudeGeometry: vec does not exist"),j.clone().addScaledVector(L,he)}const B=T.length,Y=G.length;function W(j,L,he){let Q,$,pe;const Ee=j.x-L.x,_e=j.y-L.y,be=he.x-j.x,Ue=he.y-j.y,ot=Ee*Ee+_e*_e,ft=Ee*Ue-_e*be;if(Math.abs(ft)>Number.EPSILON){const R=Math.sqrt(ot),b=Math.sqrt(be*be+Ue*Ue),O=L.x-_e/R,se=L.y+Ee/R,ee=he.x-Ue/b,ie=he.y+be/b,xe=((ee-O)*Ue-(ie-se)*be)/(Ee*Ue-_e*be);Q=O+Ee*xe-j.x,$=se+_e*xe-j.y;const ne=Q*Q+$*$;if(ne<=2)return new q(Q,$);pe=Math.sqrt(ne/2)}else{let R=!1;Ee>Number.EPSILON?be>Number.EPSILON&&(R=!0):Ee<-Number.EPSILON?be<-Number.EPSILON&&(R=!0):Math.sign(_e)===Math.sign(Ue)&&(R=!0),R?(Q=-_e,$=Ee,pe=Math.sqrt(ot)):(Q=Ee,$=_e,pe=Math.sqrt(ot/2))}return new q(Q/pe,$/pe)}const te=[];for(let j=0,L=Z.length,he=L-1,Q=j+1;j<L;j++,he++,Q++)he===L&&(he=0),Q===L&&(Q=0),te[j]=W(Z[j],Z[he],Z[Q]);const J=[];let K,U=te.concat();for(let j=0,L=F.length;j<L;j++){const he=F[j];K=[];for(let Q=0,$=he.length,pe=$-1,Ee=Q+1;Q<$;Q++,pe++,Ee++)pe===$&&(pe=0),Ee===$&&(Ee=0),K[Q]=W(he[Q],he[pe],he[Ee]);J.push(K),U=U.concat(K)}for(let j=0;j<g;j++){const L=j/g,he=p*Math.cos(L*Math.PI/2),Q=f*Math.sin(L*Math.PI/2)+v;for(let $=0,pe=Z.length;$<pe;$++){const Ee=D(Z[$],te[$],Q);Me(Ee.x,Ee.y,-he)}for(let $=0,pe=F.length;$<pe;$++){const Ee=F[$];K=J[$];for(let _e=0,be=Ee.length;_e<be;_e++){const Ue=D(Ee[_e],K[_e],Q);Me(Ue.x,Ue.y,-he)}}}const V=f+v;for(let j=0;j<B;j++){const L=u?D(T[j],U[j],V):T[j];x?(C.copy(w.normals[0]).multiplyScalar(L.x),A.copy(w.binormals[0]).multiplyScalar(L.y),P.copy(y[0]).add(C).add(A),Me(P.x,P.y,P.z)):Me(L.x,L.y,0)}for(let j=1;j<=h;j++)for(let L=0;L<B;L++){const he=u?D(T[L],U[L],V):T[L];x?(C.copy(w.normals[j]).multiplyScalar(he.x),A.copy(w.binormals[j]).multiplyScalar(he.y),P.copy(y[j]).add(C).add(A),Me(P.x,P.y,P.z)):Me(he.x,he.y,d/h*j)}for(let j=g-1;j>=0;j--){const L=j/g,he=p*Math.cos(L*Math.PI/2),Q=f*Math.sin(L*Math.PI/2)+v;for(let $=0,pe=Z.length;$<pe;$++){const Ee=D(Z[$],te[$],Q);Me(Ee.x,Ee.y,d+he)}for(let $=0,pe=F.length;$<pe;$++){const Ee=F[$];K=J[$];for(let _e=0,be=Ee.length;_e<be;_e++){const Ue=D(Ee[_e],K[_e],Q);x?Me(Ue.x,Ue.y+y[h-1].y,y[h-1].x+he):Me(Ue.x,Ue.y,d+he)}}}le(),ve();function le(){const j=r.length/3;if(u){let L=0,he=B*L;for(let Q=0;Q<Y;Q++){const $=G[Q];He($[2]+he,$[1]+he,$[0]+he)}L=h+g*2,he=B*L;for(let Q=0;Q<Y;Q++){const $=G[Q];He($[0]+he,$[1]+he,$[2]+he)}}else{for(let L=0;L<Y;L++){const he=G[L];He(he[2],he[1],he[0])}for(let L=0;L<Y;L++){const he=G[L];He(he[0]+B*h,he[1]+B*h,he[2]+B*h)}}i.addGroup(j,r.length/3-j,0)}function ve(){const j=r.length/3;let L=0;we(Z,L),L+=Z.length;for(let he=0,Q=F.length;he<Q;he++){const $=F[he];we($,L),L+=$.length}i.addGroup(j,r.length/3-j,1)}function we(j,L){let he=j.length;for(;--he>=0;){const Q=he;let $=he-1;$<0&&($=j.length-1);for(let pe=0,Ee=h+g*2;pe<Ee;pe++){const _e=B*pe,be=B*(pe+1),Ue=L+Q+_e,ot=L+$+_e,ft=L+$+be,R=L+Q+be;De(Ue,ot,ft,R)}}}function Me(j,L,he){l.push(j),l.push(L),l.push(he)}function He(j,L,he){Ae(j),Ae(L),Ae(he);const Q=r.length/3,$=_.generateTopUV(i,r,Q-3,Q-2,Q-1);Ze($[0]),Ze($[1]),Ze($[2])}function De(j,L,he,Q){Ae(j),Ae(L),Ae(Q),Ae(L),Ae(he),Ae(Q);const $=r.length/3,pe=_.generateSideWallUV(i,r,$-6,$-3,$-2,$-1);Ze(pe[0]),Ze(pe[1]),Ze(pe[3]),Ze(pe[1]),Ze(pe[2]),Ze(pe[3])}function Ae(j){r.push(l[j*3+0]),r.push(l[j*3+1]),r.push(l[j*3+2])}function Ze(j){s.push(j.x),s.push(j.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return Wy(t,i,e)}static fromJSON(e,t){const i=[];for(let s=0,a=e.shapes.length;s<a;s++){const o=t[e.shapes[s]];i.push(o)}const r=e.options.extrudePath;return r!==void 0&&(e.options.extrudePath=new fa[r.type]().fromJSON(r)),new Oa(i,e.options)}}const Vy={generateTopUV:function(n,e,t,i,r){const s=e[t*3],a=e[t*3+1],o=e[i*3],l=e[i*3+1],c=e[r*3],h=e[r*3+1];return[new q(s,a),new q(o,l),new q(c,h)]},generateSideWallUV:function(n,e,t,i,r,s){const a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[i*3],h=e[i*3+1],d=e[i*3+2],u=e[r*3],p=e[r*3+1],f=e[r*3+2],v=e[s*3],g=e[s*3+1],m=e[s*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new q(a,1-l),new q(c,1-d),new q(u,1-f),new q(v,1-m)]:[new q(o,1-l),new q(h,1-d),new q(p,1-f),new q(g,1-m)]}};function Wy(n,e,t){if(t.shapes=[],Array.isArray(n))for(let i=0,r=n.length;i<r;i++){const s=n[i];t.shapes.push(s.uuid)}else t.shapes.push(n.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Fa extends rr{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,r=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Fa(e.radius,e.detail)}}class cn extends rr{constructor(e=1,t=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],r=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,r,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new cn(e.radius,e.detail)}}class za extends Re{constructor(e=.5,t=1,i=32,r=1,s=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:r,thetaStart:s,thetaLength:a},i=Math.max(3,i),r=Math.max(1,r);const o=[],l=[],c=[],h=[];let d=e;const u=(t-e)/r,p=new E,f=new q;for(let v=0;v<=r;v++){for(let g=0;g<=i;g++){const m=s+g/i*a;p.x=d*Math.cos(m),p.y=d*Math.sin(m),l.push(p.x,p.y,p.z),c.push(0,0,1),f.x=(p.x/t+1)/2,f.y=(p.y/t+1)/2,h.push(f.x,f.y)}d+=u}for(let v=0;v<r;v++){const g=v*(i+1);for(let m=0;m<i;m++){const _=m+g,y=_,x=_+i+1,w=_+i+2,A=_+1;o.push(y,x,A),o.push(x,w,A)}}this.setIndex(o),this.setAttribute("position",new fe(l,3)),this.setAttribute("normal",new fe(c,3)),this.setAttribute("uv",new fe(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new za(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Ba extends Re{constructor(e=new Er([new q(0,.5),new q(-.5,-.5),new q(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const i=[],r=[],s=[],a=[];let o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(i),this.setAttribute("position",new fe(r,3)),this.setAttribute("normal",new fe(s,3)),this.setAttribute("uv",new fe(a,2));function c(h){const d=r.length/3,u=h.extractPoints(t);let p=u.shape;const f=u.holes;gi.isClockWise(p)===!1&&(p=p.reverse());for(let g=0,m=f.length;g<m;g++){const _=f[g];gi.isClockWise(_)===!0&&(f[g]=_.reverse())}const v=gi.triangulateShape(p,f);for(let g=0,m=f.length;g<m;g++){const _=f[g];p=p.concat(_)}for(let g=0,m=p.length;g<m;g++){const _=p[g];r.push(_.x,_.y,0),s.push(0,0,1),a.push(_.x,_.y)}for(let g=0,m=v.length;g<m;g++){const _=v[g],y=_[0]+d,x=_[1]+d,w=_[2]+d;i.push(y,x,w),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return Xy(t,e)}static fromJSON(e,t){const i=[];for(let r=0,s=e.shapes.length;r<s;r++){const a=t[e.shapes[r]];i.push(a)}return new Ba(i,e.curveSegments)}}function Xy(n,e){if(e.shapes=[],Array.isArray(n))for(let t=0,i=n.length;t<i;t++){const r=n[t];e.shapes.push(r.uuid)}else e.shapes.push(n.uuid);return e}class Wt extends Re{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const h=[],d=new E,u=new E,p=[],f=[],v=[],g=[];for(let m=0;m<=i;m++){const _=[],y=m/i;let x=0;m===0&&a===0?x=.5/t:m===i&&l===Math.PI&&(x=-.5/t);for(let w=0;w<=t;w++){const A=w/t;d.x=-e*Math.cos(r+A*s)*Math.sin(a+y*o),d.y=e*Math.cos(a+y*o),d.z=e*Math.sin(r+A*s)*Math.sin(a+y*o),f.push(d.x,d.y,d.z),u.copy(d).normalize(),v.push(u.x,u.y,u.z),g.push(A+x,1-y),_.push(c++)}h.push(_)}for(let m=0;m<i;m++)for(let _=0;_<t;_++){const y=h[m][_+1],x=h[m][_],w=h[m+1][_],A=h[m+1][_+1];(m!==0||a>0)&&p.push(y,x,A),(m!==i-1||l<Math.PI)&&p.push(x,w,A)}this.setIndex(p),this.setAttribute("position",new fe(f,3)),this.setAttribute("normal",new fe(v,3)),this.setAttribute("uv",new fe(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wt(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class ka extends rr{constructor(e=1,t=0){const i=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],r=[2,1,0,0,3,2,1,3,0,2,3,1];super(i,r,e,t),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new ka(e.radius,e.detail)}}class Ha extends Re{constructor(e=1,t=.4,i=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:r,arc:s},i=Math.floor(i),r=Math.floor(r);const a=[],o=[],l=[],c=[],h=new E,d=new E,u=new E;for(let p=0;p<=i;p++)for(let f=0;f<=r;f++){const v=f/r*s,g=p/i*Math.PI*2;d.x=(e+t*Math.cos(g))*Math.cos(v),d.y=(e+t*Math.cos(g))*Math.sin(v),d.z=t*Math.sin(g),o.push(d.x,d.y,d.z),h.x=e*Math.cos(v),h.y=e*Math.sin(v),u.subVectors(d,h).normalize(),l.push(u.x,u.y,u.z),c.push(f/r),c.push(p/i)}for(let p=1;p<=i;p++)for(let f=1;f<=r;f++){const v=(r+1)*p+f-1,g=(r+1)*(p-1)+f-1,m=(r+1)*(p-1)+f,_=(r+1)*p+f;a.push(v,g,_),a.push(g,m,_)}this.setIndex(a),this.setAttribute("position",new fe(o,3)),this.setAttribute("normal",new fe(l,3)),this.setAttribute("uv",new fe(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ha(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Ga extends Re{constructor(e=1,t=.4,i=64,r=8,s=2,a=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:e,tube:t,tubularSegments:i,radialSegments:r,p:s,q:a},i=Math.floor(i),r=Math.floor(r);const o=[],l=[],c=[],h=[],d=new E,u=new E,p=new E,f=new E,v=new E,g=new E,m=new E;for(let y=0;y<=i;++y){const x=y/i*s*Math.PI*2;_(x,s,a,e,p),_(x+.01,s,a,e,f),g.subVectors(f,p),m.addVectors(f,p),v.crossVectors(g,m),m.crossVectors(v,g),v.normalize(),m.normalize();for(let w=0;w<=r;++w){const A=w/r*Math.PI*2,C=-t*Math.cos(A),P=t*Math.sin(A);d.x=p.x+(C*m.x+P*v.x),d.y=p.y+(C*m.y+P*v.y),d.z=p.z+(C*m.z+P*v.z),l.push(d.x,d.y,d.z),u.subVectors(d,p).normalize(),c.push(u.x,u.y,u.z),h.push(y/i),h.push(w/r)}}for(let y=1;y<=i;y++)for(let x=1;x<=r;x++){const w=(r+1)*(y-1)+(x-1),A=(r+1)*y+(x-1),C=(r+1)*y+x,P=(r+1)*(y-1)+x;o.push(w,A,P),o.push(A,C,P)}this.setIndex(o),this.setAttribute("position",new fe(l,3)),this.setAttribute("normal",new fe(c,3)),this.setAttribute("uv",new fe(h,2));function _(y,x,w,A,C){const P=Math.cos(y),M=Math.sin(y),T=w/x*y,F=Math.cos(T);C.x=A*(2+F)*.5*P,C.y=A*(2+F)*M*.5,C.z=A*Math.sin(T)*.5}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ga(e.radius,e.tube,e.tubularSegments,e.radialSegments,e.p,e.q)}}class Va extends Re{constructor(e=new Xl(new E(-1,-1,0),new E(-1,1,0),new E(1,1,0)),t=64,i=1,r=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:e,tubularSegments:t,radius:i,radialSegments:r,closed:s};const a=e.computeFrenetFrames(t,s);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new E,l=new E,c=new q;let h=new E;const d=[],u=[],p=[],f=[];v(),this.setIndex(f),this.setAttribute("position",new fe(d,3)),this.setAttribute("normal",new fe(u,3)),this.setAttribute("uv",new fe(p,2));function v(){for(let y=0;y<t;y++)g(y);g(s===!1?t:0),_(),m()}function g(y){h=e.getPointAt(y/t,h);const x=a.normals[y],w=a.binormals[y];for(let A=0;A<=r;A++){const C=A/r*Math.PI*2,P=Math.sin(C),M=-Math.cos(C);l.x=M*x.x+P*w.x,l.y=M*x.y+P*w.y,l.z=M*x.z+P*w.z,l.normalize(),u.push(l.x,l.y,l.z),o.x=h.x+i*l.x,o.y=h.y+i*l.y,o.z=h.z+i*l.z,d.push(o.x,o.y,o.z)}}function m(){for(let y=1;y<=t;y++)for(let x=1;x<=r;x++){const w=(r+1)*(y-1)+(x-1),A=(r+1)*y+(x-1),C=(r+1)*y+x,P=(r+1)*(y-1)+x;f.push(w,A,P),f.push(A,C,P)}}function _(){for(let y=0;y<=t;y++)for(let x=0;x<=r;x++)c.x=y/t,c.y=x/r,p.push(c.x,c.y)}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON();return e.path=this.parameters.path.toJSON(),e}static fromJSON(e){return new Va(new fa[e.path.type]().fromJSON(e.path),e.tubularSegments,e.radius,e.radialSegments,e.closed)}}class bd extends Re{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){const t=[],i=new Set,r=new E,s=new E;if(e.index!==null){const a=e.attributes.position,o=e.index;let l=e.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,h=l.length;c<h;++c){const d=l[c],u=d.start,p=d.count;for(let f=u,v=u+p;f<v;f+=3)for(let g=0;g<3;g++){const m=o.getX(f+g),_=o.getX(f+(g+1)%3);r.fromBufferAttribute(a,m),s.fromBufferAttribute(a,_),gh(r,s,i)===!0&&(t.push(r.x,r.y,r.z),t.push(s.x,s.y,s.z))}}}else{const a=e.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){const h=3*o+c,d=3*o+(c+1)%3;r.fromBufferAttribute(a,h),s.fromBufferAttribute(a,d),gh(r,s,i)===!0&&(t.push(r.x,r.y,r.z),t.push(s.x,s.y,s.z))}}this.setAttribute("position",new fe(t,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}function gh(n,e,t){const i=`${n.x},${n.y},${n.z}-${e.x},${e.y},${e.z}`,r=`${e.x},${e.y},${e.z}-${n.x},${n.y},${n.z}`;return t.has(i)===!0||t.has(r)===!0?!1:(t.add(i),t.add(r),!0)}var vh=Object.freeze({__proto__:null,BoxGeometry:Lr,CapsuleGeometry:Pa,CircleGeometry:Ia,ConeGeometry:Da,CylinderGeometry:ps,DodecahedronGeometry:Ua,EdgesGeometry:yd,ExtrudeGeometry:Oa,IcosahedronGeometry:Fa,LatheGeometry:ln,OctahedronGeometry:cn,PlaneGeometry:an,PolyhedronGeometry:rr,RingGeometry:za,ShapeGeometry:Ba,SphereGeometry:Wt,TetrahedronGeometry:ka,TorusGeometry:Ha,TorusKnotGeometry:Ga,TubeGeometry:Va,WireframeGeometry:bd});class Sd extends Ut{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new oe(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}}class wd extends Dt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class ql extends Ut{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new oe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new oe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ir,this.normalScale=new q(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Ed extends ql{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new q(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ht(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new oe(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new oe(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new oe(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Td extends Ut{constructor(e){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new oe(16777215),this.specular=new oe(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new oe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ir,this.normalScale=new q(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=tn,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.specular.copy(e.specular),this.shininess=e.shininess,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Ad extends Ut{constructor(e){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new oe(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new oe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ir,this.normalScale=new q(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.gradientMap=e.gradientMap,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}class Rd extends Ut{constructor(e){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ir,this.normalScale=new q(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(e)}copy(e){return super.copy(e),this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.flatShading=e.flatShading,this}}class Cd extends Ut{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new oe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new oe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ir,this.normalScale=new q(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=tn,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Ld extends Ut{constructor(e){super(),this.isMeshMatcapMaterial=!0,this.defines={MATCAP:""},this.type="MeshMatcapMaterial",this.color=new oe(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ir,this.normalScale=new q(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={MATCAP:""},this.color.copy(e.color),this.matcap=e.matcap,this.map=e.map,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.alphaMap=e.alphaMap,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Pd extends Et{constructor(e){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(e)}copy(e){return super.copy(e),this.scale=e.scale,this.dashSize=e.dashSize,this.gapSize=e.gapSize,this}}function br(n,e,t){return!n||!t&&n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function Id(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function Dd(n){function e(r,s){return n[r]-n[s]}const t=n.length,i=new Array(t);for(let r=0;r!==t;++r)i[r]=r;return i.sort(e),i}function yl(n,e,t){const i=n.length,r=new n.constructor(i);for(let s=0,a=0;a!==i;++s){const o=t[s]*e;for(let l=0;l!==e;++l)r[a++]=n[o+l]}return r}function Yl(n,e,t,i){let r=1,s=n[0];for(;s!==void 0&&s[i]===void 0;)s=n[r++];if(s===void 0)return;let a=s[i];if(a!==void 0)if(Array.isArray(a))do a=s[i],a!==void 0&&(e.push(s.time),t.push.apply(t,a)),s=n[r++];while(s!==void 0);else if(a.toArray!==void 0)do a=s[i],a!==void 0&&(e.push(s.time),a.toArray(t,t.length)),s=n[r++];while(s!==void 0);else do a=s[i],a!==void 0&&(e.push(s.time),t.push(a)),s=n[r++];while(s!==void 0)}function jy(n,e,t,i,r=30){const s=n.clone();s.name=e;const a=[];for(let l=0;l<s.tracks.length;++l){const c=s.tracks[l],h=c.getValueSize(),d=[],u=[];for(let p=0;p<c.times.length;++p){const f=c.times[p]*r;if(!(f<t||f>=i)){d.push(c.times[p]);for(let v=0;v<h;++v)u.push(c.values[p*h+v])}}d.length!==0&&(c.times=br(d,c.times.constructor),c.values=br(u,c.values.constructor),a.push(c))}s.tracks=a;let o=1/0;for(let l=0;l<s.tracks.length;++l)o>s.tracks[l].times[0]&&(o=s.tracks[l].times[0]);for(let l=0;l<s.tracks.length;++l)s.tracks[l].shift(-1*o);return s.resetDuration(),s}function qy(n,e=0,t=n,i=30){i<=0&&(i=30);const r=t.tracks.length,s=e/i;for(let a=0;a<r;++a){const o=t.tracks[a],l=o.ValueTypeName;if(l==="bool"||l==="string")continue;const c=n.tracks.find(function(m){return m.name===o.name&&m.ValueTypeName===l});if(c===void 0)continue;let h=0;const d=o.getValueSize();o.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(h=d/3);let u=0;const p=c.getValueSize();c.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(u=p/3);const f=o.times.length-1;let v;if(s<=o.times[0]){const m=h,_=d-h;v=o.values.slice(m,_)}else if(s>=o.times[f]){const m=f*d+h,_=m+d-h;v=o.values.slice(m,_)}else{const m=o.createInterpolant(),_=h,y=d-h;m.evaluate(s),v=m.resultBuffer.slice(_,y)}l==="quaternion"&&new Vt().fromArray(v).normalize().conjugate().toArray(v);const g=c.times.length;for(let m=0;m<g;++m){const _=m*p+u;if(l==="quaternion")Vt.multiplyQuaternionsFlat(c.values,_,v,0,c.values,_);else{const y=p-u*2;for(let x=0;x<y;++x)c.values[_+x]-=v[x]}}}return n.blendMode=Cl,n}const Yy={convertArray:br,isTypedArray:Id,getKeyframeOrder:Dd,sortedArray:yl,flattenJSON:Yl,subclip:jy,makeClipAdditive:qy};class hn{constructor(e,t,i,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let i=this._cachedIndex,r=t[i],s=t[i-1];e:{t:{let a;i:{r:if(!(e<r)){for(let o=i+2;;){if(r===void 0){if(e<s)break r;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===o)break;if(s=r,r=t[++i],e<r)break t}a=t.length;break i}if(!(e>=s)){const o=t[1];e<o&&(i=2,s=o);for(let l=i-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(r=s,s=t[--i-1],e>=s)break t}a=i,i=0;break i}break e}for(;i<a;){const o=i+a>>>1;e<t[o]?a=o:i=o+1}if(r=t[i],s=t[i-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,s,r)}return this.interpolate_(i,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,i=this.sampleValues,r=this.valueSize,s=e*r;for(let a=0;a!==r;++a)t[a]=i[s+a];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}}class Ud extends hn{constructor(e,t,i,r){super(e,t,i,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:_r,endingEnd:_r}}intervalChanged_(e,t,i){const r=this.parameterPositions;let s=e-2,a=e+1,o=r[s],l=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case xr:s=e,o=2*t-i;break;case ks:s=r.length-2,o=t+r[s]-r[s+1];break;default:s=e,o=i}if(l===void 0)switch(this.getSettings_().endingEnd){case xr:a=e,l=2*i-t;break;case ks:a=1,l=i+r[1]-r[0];break;default:a=e-1,l=t}const c=(i-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-i),this._offsetPrev=s*h,this._offsetNext=a*h}interpolate_(e,t,i,r){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,p=this._weightNext,f=(i-t)/(r-t),v=f*f,g=v*f,m=-u*g+2*u*v-u*f,_=(1+u)*g+(-1.5-2*u)*v+(-.5+u)*f+1,y=(-1-p)*g+(1.5+p)*v+.5*f,x=p*g-p*v;for(let w=0;w!==o;++w)s[w]=m*a[h+w]+_*a[c+w]+y*a[l+w]+x*a[d+w];return s}}class Zl extends hn{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e,t,i,r){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(i-t)/(r-t),d=1-h;for(let u=0;u!==o;++u)s[u]=a[c+u]*d+a[l+u]*h;return s}}class Nd extends hn{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e){return this.copySampleValue_(e-1)}}class hi{constructor(e,t,i,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=br(t,this.TimeBufferType),this.values=br(i,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:br(e.times,Array),values:br(e.values,Array)};const r=e.getInterpolation();r!==e.DefaultInterpolation&&(i.interpolation=r)}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new Nd(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Zl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Ud(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case zs:t=this.InterpolantFactoryMethodDiscrete;break;case Bs:t=this.InterpolantFactoryMethodLinear;break;case la:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){const i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return console.warn("THREE.KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return zs;case this.InterpolantFactoryMethodLinear:return Bs;case this.InterpolantFactoryMethodSmooth:return la}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let i=0,r=t.length;i!==r;++i)t[i]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let i=0,r=t.length;i!==r;++i)t[i]*=e}return this}trim(e,t){const i=this.times,r=i.length;let s=0,a=r-1;for(;s!==r&&i[s]<e;)++s;for(;a!==-1&&i[a]>t;)--a;if(++a,s!==0||a!==r){s>=a&&(a=Math.max(a,1),s=a-1);const o=this.getValueSize();this.times=i.slice(s,a),this.values=this.values.slice(s*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);const i=this.times,r=this.values,s=i.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==s;o++){const l=i[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(r!==void 0&&Id(r))for(let o=0,l=r.length;o!==l;++o){const c=r[o];if(isNaN(c)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),r=this.getInterpolation()===la,s=e.length-1;let a=1;for(let o=1;o<s;++o){let l=!1;const c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(r)l=!0;else{const d=o*i,u=d-i,p=d+i;for(let f=0;f!==i;++f){const v=t[d+f];if(v!==t[u+f]||v!==t[p+f]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const d=o*i,u=a*i;for(let p=0;p!==i;++p)t[u+p]=t[d+p]}++a}}if(s>0){e[a]=e[s];for(let o=s*i,l=a*i,c=0;c!==i;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*i)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),i=this.constructor,r=new i(this.name,e,t);return r.createInterpolant=this.createInterpolant,r}}hi.prototype.TimeBufferType=Float32Array;hi.prototype.ValueBufferType=Float32Array;hi.prototype.DefaultInterpolation=Bs;class Ir extends hi{}Ir.prototype.ValueTypeName="bool";Ir.prototype.ValueBufferType=Array;Ir.prototype.DefaultInterpolation=zs;Ir.prototype.InterpolantFactoryMethodLinear=void 0;Ir.prototype.InterpolantFactoryMethodSmooth=void 0;class Jl extends hi{}Jl.prototype.ValueTypeName="color";class Ks extends hi{}Ks.prototype.ValueTypeName="number";class Od extends hn{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e,t,i,r){const s=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(i-t)/(r-t);let c=e*o;for(let h=c+o;c!==h;c+=4)Vt.slerpFlat(s,0,a,c-o,a,c,l);return s}}class ms extends hi{InterpolantFactoryMethodLinear(e){return new Od(this.times,this.values,this.getValueSize(),e)}}ms.prototype.ValueTypeName="quaternion";ms.prototype.DefaultInterpolation=Bs;ms.prototype.InterpolantFactoryMethodSmooth=void 0;class Dr extends hi{}Dr.prototype.ValueTypeName="string";Dr.prototype.ValueBufferType=Array;Dr.prototype.DefaultInterpolation=zs;Dr.prototype.InterpolantFactoryMethodLinear=void 0;Dr.prototype.InterpolantFactoryMethodSmooth=void 0;class $s extends hi{}$s.prototype.ValueTypeName="vector";class Qs{constructor(e,t=-1,i,r=_a){this.name=e,this.tracks=i,this.duration=t,this.blendMode=r,this.uuid=Kt(),this.duration<0&&this.resetDuration()}static parse(e){const t=[],i=e.tracks,r=1/(e.fps||1);for(let a=0,o=i.length;a!==o;++a)t.push(Jy(i[a]).scale(r));const s=new this(e.name,e.duration,t,e.blendMode);return s.uuid=e.uuid,s}static toJSON(e){const t=[],i=e.tracks,r={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let s=0,a=i.length;s!==a;++s)t.push(hi.toJSON(i[s]));return r}static CreateFromMorphTargetSequence(e,t,i,r){const s=t.length,a=[];for(let o=0;o<s;o++){let l=[],c=[];l.push((o+s-1)%s,o,(o+1)%s),c.push(0,1,0);const h=Dd(l);l=yl(l,1,h),c=yl(c,1,h),!r&&l[0]===0&&(l.push(s),c.push(c[0])),a.push(new Ks(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/i))}return new this(e,-1,a)}static findByName(e,t){let i=e;if(!Array.isArray(e)){const r=e;i=r.geometry&&r.geometry.animations||r.animations}for(let r=0;r<i.length;r++)if(i[r].name===t)return i[r];return null}static CreateClipsFromMorphTargetSequences(e,t,i){const r={},s=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],h=c.name.match(s);if(h&&h.length>1){const d=h[1];let u=r[d];u||(r[d]=u=[]),u.push(c)}}const a=[];for(const o in r)a.push(this.CreateFromMorphTargetSequence(o,r[o],t,i));return a}static parseAnimation(e,t){if(!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;const i=function(h,d,u,p,f){if(u.length!==0){const v=[],g=[];Yl(u,v,g,p),v.length!==0&&f.push(new h(d,v,g))}},r=[],s=e.name||"default",a=e.fps||30,o=e.blendMode;let l=e.length||-1;const c=e.hierarchy||[];for(let h=0;h<c.length;h++){const d=c[h].keys;if(!(!d||d.length===0))if(d[0].morphTargets){const u={};let p;for(p=0;p<d.length;p++)if(d[p].morphTargets)for(let f=0;f<d[p].morphTargets.length;f++)u[d[p].morphTargets[f]]=-1;for(const f in u){const v=[],g=[];for(let m=0;m!==d[p].morphTargets.length;++m){const _=d[p];v.push(_.time),g.push(_.morphTarget===f?1:0)}r.push(new Ks(".morphTargetInfluence["+f+"]",v,g))}l=u.length*a}else{const u=".bones["+t[h].name+"]";i($s,u+".position",d,"pos",r),i(ms,u+".quaternion",d,"rot",r),i($s,u+".scale",d,"scl",r)}}return r.length===0?null:new this(s,l,r,o)}resetDuration(){const e=this.tracks;let t=0;for(let i=0,r=e.length;i!==r;++i){const s=this.tracks[i];t=Math.max(t,s.times[s.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}}function Zy(n){switch(n.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Ks;case"vector":case"vector2":case"vector3":case"vector4":return $s;case"color":return Jl;case"quaternion":return ms;case"bool":case"boolean":return Ir;case"string":return Dr}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+n)}function Jy(n){if(n.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=Zy(n.type);if(n.times===void 0){const t=[],i=[];Yl(n.keys,t,i,"value"),n.times=t,n.values=i}return e.parse!==void 0?e.parse(n):new e(n.name,n.times,n.values,n.interpolation)}const Cr={enabled:!1,files:{},add:function(n,e){this.enabled!==!1&&(this.files[n]=e)},get:function(n){if(this.enabled!==!1)return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}};class Kl{constructor(e,t,i){const r=this;let s=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this.itemStart=function(h){o++,s===!1&&r.onStart!==void 0&&r.onStart(h,a,o),s=!0},this.itemEnd=function(h){a++,r.onProgress!==void 0&&r.onProgress(h,a,o),a===o&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(h){r.onError!==void 0&&r.onError(h)},this.resolveURL=function(h){return l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){const d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){const p=c[d],f=c[d+1];if(p.global&&(p.lastIndex=0),p.test(h))return f}return null}}}const Fd=new Kl;class Xt{constructor(e){this.manager=e!==void 0?e:Fd,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const i=this;return new Promise(function(r,s){i.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Xt.DEFAULT_MATERIAL_NAME="__DEFAULT";const Ri={};class Ky extends Error{constructor(e,t){super(e),this.response=t}}class Bi extends Xt{constructor(e){super(e)}load(e,t,i,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=Cr.get(e);if(s!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(s),this.manager.itemEnd(e)},0),s;if(Ri[e]!==void 0){Ri[e].push({onLoad:t,onProgress:i,onError:r});return}Ri[e]=[],Ri[e].push({onLoad:t,onProgress:i,onError:r});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=Ri[e],d=c.body.getReader(),u=c.headers.get("Content-Length")||c.headers.get("X-File-Size"),p=u?parseInt(u):0,f=p!==0;let v=0;const g=new ReadableStream({start(m){_();function _(){d.read().then(({done:y,value:x})=>{if(y)m.close();else{v+=x.byteLength;const w=new ProgressEvent("progress",{lengthComputable:f,loaded:v,total:p});for(let A=0,C=h.length;A<C;A++){const P=h[A];P.onProgress&&P.onProgress(w)}m.enqueue(x),_()}})}}});return new Response(g)}else throw new Ky(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o===void 0)return c.text();{const h=/charset="?([^;"\s]*)"?/i.exec(o),d=h&&h[1]?h[1].toLowerCase():void 0,u=new TextDecoder(d);return c.arrayBuffer().then(p=>u.decode(p))}}}).then(c=>{Cr.add(e,c);const h=Ri[e];delete Ri[e];for(let d=0,u=h.length;d<u;d++){const p=h[d];p.onLoad&&p.onLoad(c)}}).catch(c=>{const h=Ri[e];if(h===void 0)throw this.manager.itemError(e),c;delete Ri[e];for(let d=0,u=h.length;d<u;d++){const p=h[d];p.onError&&p.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class $y extends Xt{constructor(e){super(e)}load(e,t,i,r){const s=this,a=new Bi(this.manager);a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(o){try{t(s.parse(JSON.parse(o)))}catch(l){r?r(l):console.error(l),s.manager.itemError(e)}},i,r)}parse(e){const t=[];for(let i=0;i<e.length;i++){const r=Qs.parse(e[i]);t.push(r)}return t}}class Qy extends Xt{constructor(e){super(e)}load(e,t,i,r){const s=this,a=[],o=new Ca,l=new Bi(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(s.withCredentials);let c=0;function h(d){l.load(e[d],function(u){const p=s.parse(u,!0);a[d]={width:p.width,height:p.height,format:p.format,mipmaps:p.mipmaps},c+=1,c===6&&(p.mipmapCount===1&&(o.minFilter=pt),o.image=a,o.format=p.format,o.needsUpdate=!0,t&&t(o))},i,r)}if(Array.isArray(e))for(let d=0,u=e.length;d<u;++d)h(d);else l.load(e,function(d){const u=s.parse(d,!0);if(u.isCubemap){const p=u.mipmaps.length/u.mipmapCount;for(let f=0;f<p;f++){a[f]={mipmaps:[]};for(let v=0;v<u.mipmapCount;v++)a[f].mipmaps.push(u.mipmaps[f*u.mipmapCount+v]),a[f].format=u.format,a[f].width=u.width,a[f].height=u.height}o.image=a}else o.image.width=u.width,o.image.height=u.height,o.mipmaps=u.mipmaps;u.mipmapCount===1&&(o.minFilter=pt),o.format=u.format,o.needsUpdate=!0,t&&t(o)},i,r);return o}}class en extends Xt{constructor(e){super(e)}load(e,t,i,r){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Cr.get(e);if(a!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a;const o=js("img");function l(){h(),Cr.add(e,this),t&&t(this),s.manager.itemEnd(e)}function c(d){h(),r&&r(d),s.manager.itemError(e),s.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),s.manager.itemStart(e),o.src=e,o}}class e_ extends Xt{constructor(e){super(e)}load(e,t,i,r){const s=new nn;s.colorSpace=Mt;const a=new en(this.manager);a.setCrossOrigin(this.crossOrigin),a.setPath(this.path);let o=0;function l(c){a.load(e[c],function(h){s.images[c]=h,o++,o===6&&(s.needsUpdate=!0,t&&t(s))},void 0,r)}for(let c=0;c<e.length;++c)l(c);return s}}class t_ extends Xt{constructor(e){super(e)}load(e,t,i,r){const s=this,a=new ns,o=new Bi(this.manager);return o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setPath(this.path),o.setWithCredentials(s.withCredentials),o.load(e,function(l){let c;try{c=s.parse(l)}catch(h){if(r!==void 0)r(h);else{console.error(h);return}}c.image!==void 0?a.image=c.image:c.data!==void 0&&(a.image.width=c.width,a.image.height=c.height,a.image.data=c.data),a.wrapS=c.wrapS!==void 0?c.wrapS:It,a.wrapT=c.wrapT!==void 0?c.wrapT:It,a.magFilter=c.magFilter!==void 0?c.magFilter:pt,a.minFilter=c.minFilter!==void 0?c.minFilter:pt,a.anisotropy=c.anisotropy!==void 0?c.anisotropy:1,c.colorSpace!==void 0?a.colorSpace=c.colorSpace:c.encoding!==void 0&&(a.encoding=c.encoding),c.flipY!==void 0&&(a.flipY=c.flipY),c.format!==void 0&&(a.format=c.format),c.type!==void 0&&(a.type=c.type),c.mipmaps!==void 0&&(a.mipmaps=c.mipmaps,a.minFilter=er),c.mipmapCount===1&&(a.minFilter=pt),c.generateMipmaps!==void 0&&(a.generateMipmaps=c.generateMipmaps),a.needsUpdate=!0,t&&t(a,c)},i,r),a}}class i_ extends Xt{constructor(e){super(e)}load(e,t,i,r){const s=new mt,a=new en(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){s.image=o,s.needsUpdate=!0,t!==void 0&&t(s)},i,r),s}}class sr extends Ke{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new oe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}class zd extends sr{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ke.DEFAULT_UP),this.updateMatrix(),this.groundColor=new oe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Co=new Fe,yh=new E,_h=new E;class $l{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new q(512,512),this.map=null,this.mapPass=null,this.matrix=new Fe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new wa,this._frameExtents=new q(1,1),this._viewportCount=1,this._viewports=[new et(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;yh.setFromMatrixPosition(e.matrixWorld),t.position.copy(yh),_h.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(_h),t.updateMatrixWorld(),Co.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Co),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Co)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class r_ extends $l{constructor(){super(new yt(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(e){const t=this.camera,i=os*2*e.angle*this.focus,r=this.mapSize.width/this.mapSize.height,s=e.distance||t.far;(i!==t.fov||r!==t.aspect||s!==t.far)&&(t.fov=i,t.aspect=r,t.far=s,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}}class Bd extends sr{constructor(e,t,i=0,r=Math.PI/3,s=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(Ke.DEFAULT_UP),this.updateMatrix(),this.target=new Ke,this.distance=i,this.angle=r,this.penumbra=s,this.decay=a,this.map=null,this.shadow=new r_}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const xh=new Fe,Es=new E,Lo=new E;class s_ extends $l{constructor(){super(new yt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new q(4,2),this._viewportCount=6,this._viewports=[new et(2,1,1,1),new et(0,1,1,1),new et(3,1,1,1),new et(1,1,1,1),new et(3,0,1,1),new et(1,0,1,1)],this._cubeDirections=[new E(1,0,0),new E(-1,0,0),new E(0,0,1),new E(0,0,-1),new E(0,1,0),new E(0,-1,0)],this._cubeUps=[new E(0,1,0),new E(0,1,0),new E(0,1,0),new E(0,1,0),new E(0,0,1),new E(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,r=this.matrix,s=e.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),Es.setFromMatrixPosition(e.matrixWorld),i.position.copy(Es),Lo.copy(i.position),Lo.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(Lo),i.updateMatrixWorld(),r.makeTranslation(-Es.x,-Es.y,-Es.z),xh.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(xh)}}class kd extends sr{constructor(e,t,i=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new s_}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class n_ extends $l{constructor(){super(new tr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Hd extends sr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ke.DEFAULT_UP),this.updateMatrix(),this.target=new Ke,this.shadow=new n_}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Gd extends sr{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Vd extends sr{constructor(e,t,i=10,r=10){super(e,t),this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=i,this.height=r}get power(){return this.intensity*this.width*this.height*Math.PI}set power(e){this.intensity=e/(this.width*this.height*Math.PI)}copy(e){return super.copy(e),this.width=e.width,this.height=e.height,this}toJSON(e){const t=super.toJSON(e);return t.object.width=this.width,t.object.height=this.height,t}}class Wd{constructor(){this.isSphericalHarmonics3=!0,this.coefficients=[];for(let e=0;e<9;e++)this.coefficients.push(new E)}set(e){for(let t=0;t<9;t++)this.coefficients[t].copy(e[t]);return this}zero(){for(let e=0;e<9;e++)this.coefficients[e].set(0,0,0);return this}getAt(e,t){const i=e.x,r=e.y,s=e.z,a=this.coefficients;return t.copy(a[0]).multiplyScalar(.282095),t.addScaledVector(a[1],.488603*r),t.addScaledVector(a[2],.488603*s),t.addScaledVector(a[3],.488603*i),t.addScaledVector(a[4],1.092548*(i*r)),t.addScaledVector(a[5],1.092548*(r*s)),t.addScaledVector(a[6],.315392*(3*s*s-1)),t.addScaledVector(a[7],1.092548*(i*s)),t.addScaledVector(a[8],.546274*(i*i-r*r)),t}getIrradianceAt(e,t){const i=e.x,r=e.y,s=e.z,a=this.coefficients;return t.copy(a[0]).multiplyScalar(.886227),t.addScaledVector(a[1],2*.511664*r),t.addScaledVector(a[2],2*.511664*s),t.addScaledVector(a[3],2*.511664*i),t.addScaledVector(a[4],2*.429043*i*r),t.addScaledVector(a[5],2*.429043*r*s),t.addScaledVector(a[6],.743125*s*s-.247708),t.addScaledVector(a[7],2*.429043*i*s),t.addScaledVector(a[8],.429043*(i*i-r*r)),t}add(e){for(let t=0;t<9;t++)this.coefficients[t].add(e.coefficients[t]);return this}addScaledSH(e,t){for(let i=0;i<9;i++)this.coefficients[i].addScaledVector(e.coefficients[i],t);return this}scale(e){for(let t=0;t<9;t++)this.coefficients[t].multiplyScalar(e);return this}lerp(e,t){for(let i=0;i<9;i++)this.coefficients[i].lerp(e.coefficients[i],t);return this}equals(e){for(let t=0;t<9;t++)if(!this.coefficients[t].equals(e.coefficients[t]))return!1;return!0}copy(e){return this.set(e.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(e,t=0){const i=this.coefficients;for(let r=0;r<9;r++)i[r].fromArray(e,t+r*3);return this}toArray(e=[],t=0){const i=this.coefficients;for(let r=0;r<9;r++)i[r].toArray(e,t+r*3);return e}static getBasisAt(e,t){const i=e.x,r=e.y,s=e.z;t[0]=.282095,t[1]=.488603*r,t[2]=.488603*s,t[3]=.488603*i,t[4]=1.092548*i*r,t[5]=1.092548*r*s,t[6]=.315392*(3*s*s-1),t[7]=1.092548*i*s,t[8]=.546274*(i*i-r*r)}}class Xd extends sr{constructor(e=new Wd,t=1){super(void 0,t),this.isLightProbe=!0,this.sh=e}copy(e){return super.copy(e),this.sh.copy(e.sh),this}fromJSON(e){return this.intensity=e.intensity,this.sh.fromArray(e.sh),this}toJSON(e){const t=super.toJSON(e);return t.object.sh=this.sh.toArray(),t}}class Wa extends Xt{constructor(e){super(e),this.textures={}}load(e,t,i,r){const s=this,a=new Bi(s.manager);a.setPath(s.path),a.setRequestHeader(s.requestHeader),a.setWithCredentials(s.withCredentials),a.load(e,function(o){try{t(s.parse(JSON.parse(o)))}catch(l){r?r(l):console.error(l),s.manager.itemError(e)}},i,r)}parse(e){const t=this.textures;function i(s){return t[s]===void 0&&console.warn("THREE.MaterialLoader: Undefined texture",s),t[s]}const r=Wa.createMaterialFromType(e.type);if(e.uuid!==void 0&&(r.uuid=e.uuid),e.name!==void 0&&(r.name=e.name),e.color!==void 0&&r.color!==void 0&&r.color.setHex(e.color),e.roughness!==void 0&&(r.roughness=e.roughness),e.metalness!==void 0&&(r.metalness=e.metalness),e.sheen!==void 0&&(r.sheen=e.sheen),e.sheenColor!==void 0&&(r.sheenColor=new oe().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(r.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&r.emissive!==void 0&&r.emissive.setHex(e.emissive),e.specular!==void 0&&r.specular!==void 0&&r.specular.setHex(e.specular),e.specularIntensity!==void 0&&(r.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&r.specularColor!==void 0&&r.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(r.shininess=e.shininess),e.clearcoat!==void 0&&(r.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(r.clearcoatRoughness=e.clearcoatRoughness),e.iridescence!==void 0&&(r.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(r.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(r.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(r.transmission=e.transmission),e.thickness!==void 0&&(r.thickness=e.thickness),e.attenuationDistance!==void 0&&(r.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&r.attenuationColor!==void 0&&r.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(r.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(r.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(r.fog=e.fog),e.flatShading!==void 0&&(r.flatShading=e.flatShading),e.blending!==void 0&&(r.blending=e.blending),e.combine!==void 0&&(r.combine=e.combine),e.side!==void 0&&(r.side=e.side),e.shadowSide!==void 0&&(r.shadowSide=e.shadowSide),e.opacity!==void 0&&(r.opacity=e.opacity),e.transparent!==void 0&&(r.transparent=e.transparent),e.alphaTest!==void 0&&(r.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(r.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(r.depthFunc=e.depthFunc),e.depthTest!==void 0&&(r.depthTest=e.depthTest),e.depthWrite!==void 0&&(r.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(r.colorWrite=e.colorWrite),e.blendSrc!==void 0&&(r.blendSrc=e.blendSrc),e.blendDst!==void 0&&(r.blendDst=e.blendDst),e.blendEquation!==void 0&&(r.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(r.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(r.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(r.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&r.blendColor!==void 0&&r.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(r.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(r.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(r.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(r.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(r.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(r.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(r.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(r.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(r.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(r.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(r.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(r.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(r.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(r.rotation=e.rotation),e.linewidth!==void 0&&(r.linewidth=e.linewidth),e.dashSize!==void 0&&(r.dashSize=e.dashSize),e.gapSize!==void 0&&(r.gapSize=e.gapSize),e.scale!==void 0&&(r.scale=e.scale),e.polygonOffset!==void 0&&(r.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(r.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(r.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(r.dithering=e.dithering),e.alphaToCoverage!==void 0&&(r.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(r.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(r.forceSinglePass=e.forceSinglePass),e.visible!==void 0&&(r.visible=e.visible),e.toneMapped!==void 0&&(r.toneMapped=e.toneMapped),e.userData!==void 0&&(r.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?r.vertexColors=e.vertexColors>0:r.vertexColors=e.vertexColors),e.uniforms!==void 0)for(const s in e.uniforms){const a=e.uniforms[s];switch(r.uniforms[s]={},a.type){case"t":r.uniforms[s].value=i(a.value);break;case"c":r.uniforms[s].value=new oe().setHex(a.value);break;case"v2":r.uniforms[s].value=new q().fromArray(a.value);break;case"v3":r.uniforms[s].value=new E().fromArray(a.value);break;case"v4":r.uniforms[s].value=new et().fromArray(a.value);break;case"m3":r.uniforms[s].value=new Ge().fromArray(a.value);break;case"m4":r.uniforms[s].value=new Fe().fromArray(a.value);break;default:r.uniforms[s].value=a.value}}if(e.defines!==void 0&&(r.defines=e.defines),e.vertexShader!==void 0&&(r.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(r.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(r.glslVersion=e.glslVersion),e.extensions!==void 0)for(const s in e.extensions)r.extensions[s]=e.extensions[s];if(e.lights!==void 0&&(r.lights=e.lights),e.clipping!==void 0&&(r.clipping=e.clipping),e.size!==void 0&&(r.size=e.size),e.sizeAttenuation!==void 0&&(r.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(r.map=i(e.map)),e.matcap!==void 0&&(r.matcap=i(e.matcap)),e.alphaMap!==void 0&&(r.alphaMap=i(e.alphaMap)),e.bumpMap!==void 0&&(r.bumpMap=i(e.bumpMap)),e.bumpScale!==void 0&&(r.bumpScale=e.bumpScale),e.normalMap!==void 0&&(r.normalMap=i(e.normalMap)),e.normalMapType!==void 0&&(r.normalMapType=e.normalMapType),e.normalScale!==void 0){let s=e.normalScale;Array.isArray(s)===!1&&(s=[s,s]),r.normalScale=new q().fromArray(s)}return e.displacementMap!==void 0&&(r.displacementMap=i(e.displacementMap)),e.displacementScale!==void 0&&(r.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(r.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(r.roughnessMap=i(e.roughnessMap)),e.metalnessMap!==void 0&&(r.metalnessMap=i(e.metalnessMap)),e.emissiveMap!==void 0&&(r.emissiveMap=i(e.emissiveMap)),e.emissiveIntensity!==void 0&&(r.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(r.specularMap=i(e.specularMap)),e.specularIntensityMap!==void 0&&(r.specularIntensityMap=i(e.specularIntensityMap)),e.specularColorMap!==void 0&&(r.specularColorMap=i(e.specularColorMap)),e.envMap!==void 0&&(r.envMap=i(e.envMap)),e.envMapIntensity!==void 0&&(r.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(r.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(r.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(r.lightMap=i(e.lightMap)),e.lightMapIntensity!==void 0&&(r.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(r.aoMap=i(e.aoMap)),e.aoMapIntensity!==void 0&&(r.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(r.gradientMap=i(e.gradientMap)),e.clearcoatMap!==void 0&&(r.clearcoatMap=i(e.clearcoatMap)),e.clearcoatRoughnessMap!==void 0&&(r.clearcoatRoughnessMap=i(e.clearcoatRoughnessMap)),e.clearcoatNormalMap!==void 0&&(r.clearcoatNormalMap=i(e.clearcoatNormalMap)),e.clearcoatNormalScale!==void 0&&(r.clearcoatNormalScale=new q().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(r.iridescenceMap=i(e.iridescenceMap)),e.iridescenceThicknessMap!==void 0&&(r.iridescenceThicknessMap=i(e.iridescenceThicknessMap)),e.transmissionMap!==void 0&&(r.transmissionMap=i(e.transmissionMap)),e.thicknessMap!==void 0&&(r.thicknessMap=i(e.thicknessMap)),e.anisotropyMap!==void 0&&(r.anisotropyMap=i(e.anisotropyMap)),e.sheenColorMap!==void 0&&(r.sheenColorMap=i(e.sheenColorMap)),e.sheenRoughnessMap!==void 0&&(r.sheenRoughnessMap=i(e.sheenRoughnessMap)),r}setTextures(e){return this.textures=e,this}static createMaterialFromType(e){const t={ShadowMaterial:Sd,SpriteMaterial:Bl,RawShaderMaterial:wd,ShaderMaterial:Dt,PointsMaterial:on,MeshPhysicalMaterial:Ed,MeshStandardMaterial:ql,MeshPhongMaterial:Td,MeshToonMaterial:Ad,MeshNormalMaterial:Rd,MeshLambertMaterial:Cd,MeshDepthMaterial:Fl,MeshDistanceMaterial:zl,MeshBasicMaterial:At,MeshMatcapMaterial:Ld,LineDashedMaterial:Pd,LineBasicMaterial:Et,Material:Ut};return new t[e]}}class _l{static decodeText(e){if(typeof TextDecoder<"u")return new TextDecoder().decode(e);let t="";for(let i=0,r=e.length;i<r;i++)t+=String.fromCharCode(e[i]);try{return decodeURIComponent(escape(t))}catch(i){return t}}static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}class jd extends Re{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}class qd extends Xt{constructor(e){super(e)}load(e,t,i,r){const s=this,a=new Bi(s.manager);a.setPath(s.path),a.setRequestHeader(s.requestHeader),a.setWithCredentials(s.withCredentials),a.load(e,function(o){try{t(s.parse(JSON.parse(o)))}catch(l){r?r(l):console.error(l),s.manager.itemError(e)}},i,r)}parse(e){const t={},i={};function r(u,p){if(t[p]!==void 0)return t[p];const f=u.interleavedBuffers[p],v=s(u,f.buffer),g=es(f.type,v),m=new Aa(g,f.stride);return m.uuid=f.uuid,t[p]=m,m}function s(u,p){if(i[p]!==void 0)return i[p];const f=u.arrayBuffers[p],v=new Uint32Array(f).buffer;return i[p]=v,v}const a=e.isInstancedBufferGeometry?new jd:new Re,o=e.data.index;if(o!==void 0){const u=es(o.type,o.array);a.setIndex(new Pe(u,1))}const l=e.data.attributes;for(const u in l){const p=l[u];let f;if(p.isInterleavedBufferAttribute){const v=r(e.data,p.data);f=new Ar(v,p.itemSize,p.offset,p.normalized)}else{const v=es(p.type,p.array),g=p.isInstancedBufferAttribute?cs:Pe;f=new g(v,p.itemSize,p.normalized)}p.name!==void 0&&(f.name=p.name),p.usage!==void 0&&f.setUsage(p.usage),p.updateRange!==void 0&&(f.updateRange.offset=p.updateRange.offset,f.updateRange.count=p.updateRange.count),a.setAttribute(u,f)}const c=e.data.morphAttributes;if(c)for(const u in c){const p=c[u],f=[];for(let v=0,g=p.length;v<g;v++){const m=p[v];let _;if(m.isInterleavedBufferAttribute){const y=r(e.data,m.data);_=new Ar(y,m.itemSize,m.offset,m.normalized)}else{const y=es(m.type,m.array);_=new Pe(y,m.itemSize,m.normalized)}m.name!==void 0&&(_.name=m.name),f.push(_)}a.morphAttributes[u]=f}e.data.morphTargetsRelative&&(a.morphTargetsRelative=!0);const h=e.data.groups||e.data.drawcalls||e.data.offsets;if(h!==void 0)for(let u=0,p=h.length;u!==p;++u){const f=h[u];a.addGroup(f.start,f.count,f.materialIndex)}const d=e.data.boundingSphere;if(d!==void 0){const u=new E;d.center!==void 0&&u.fromArray(d.center),a.boundingSphere=new li(u,d.radius)}return e.name&&(a.name=e.name),e.userData&&(a.userData=e.userData),a}}class a_ extends Xt{constructor(e){super(e)}load(e,t,i,r){const s=this,a=this.path===""?_l.extractUrlBase(e):this.path;this.resourcePath=this.resourcePath||a;const o=new Bi(this.manager);o.setPath(this.path),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(e,function(l){let c=null;try{c=JSON.parse(l)}catch(d){r!==void 0&&r(d),console.error("THREE:ObjectLoader: Can't parse "+e+".",d.message);return}const h=c.metadata;if(h===void 0||h.type===void 0||h.type.toLowerCase()==="geometry"){r!==void 0&&r(new Error("THREE.ObjectLoader: Can't load "+e)),console.error("THREE.ObjectLoader: Can't load "+e);return}s.parse(c,t)},i,r)}loadAsync(e,t){return xt(this,null,function*(){const i=this,r=this.path===""?_l.extractUrlBase(e):this.path;this.resourcePath=this.resourcePath||r;const s=new Bi(this.manager);s.setPath(this.path),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials);const a=yield s.loadAsync(e,t),o=JSON.parse(a),l=o.metadata;if(l===void 0||l.type===void 0||l.type.toLowerCase()==="geometry")throw new Error("THREE.ObjectLoader: Can't load "+e);return yield i.parseAsync(o)})}parse(e,t){const i=this.parseAnimations(e.animations),r=this.parseShapes(e.shapes),s=this.parseGeometries(e.geometries,r),a=this.parseImages(e.images,function(){t!==void 0&&t(c)}),o=this.parseTextures(e.textures,a),l=this.parseMaterials(e.materials,o),c=this.parseObject(e.object,s,l,o,i),h=this.parseSkeletons(e.skeletons,c);if(this.bindSkeletons(c,h),t!==void 0){let d=!1;for(const u in a)if(a[u].data instanceof HTMLImageElement){d=!0;break}d===!1&&t(c)}return c}parseAsync(e){return xt(this,null,function*(){const t=this.parseAnimations(e.animations),i=this.parseShapes(e.shapes),r=this.parseGeometries(e.geometries,i),s=yield this.parseImagesAsync(e.images),a=this.parseTextures(e.textures,s),o=this.parseMaterials(e.materials,a),l=this.parseObject(e.object,r,o,a,t),c=this.parseSkeletons(e.skeletons,l);return this.bindSkeletons(l,c),l})}parseShapes(e){const t={};if(e!==void 0)for(let i=0,r=e.length;i<r;i++){const s=new Er().fromJSON(e[i]);t[s.uuid]=s}return t}parseSkeletons(e,t){const i={},r={};if(t.traverse(function(s){s.isBone&&(r[s.uuid]=s)}),e!==void 0)for(let s=0,a=e.length;s<a;s++){const o=new Ra().fromJSON(e[s],r);i[o.uuid]=o}return i}parseGeometries(e,t){const i={};if(e!==void 0){const r=new qd;for(let s=0,a=e.length;s<a;s++){let o;const l=e[s];switch(l.type){case"BufferGeometry":case"InstancedBufferGeometry":o=r.parse(l);break;default:l.type in vh?o=vh[l.type].fromJSON(l,t):console.warn(`THREE.ObjectLoader: Unsupported geometry type "${l.type}"`)}o.uuid=l.uuid,l.name!==void 0&&(o.name=l.name),l.userData!==void 0&&(o.userData=l.userData),i[l.uuid]=o}}return i}parseMaterials(e,t){const i={},r={};if(e!==void 0){const s=new Wa;s.setTextures(t);for(let a=0,o=e.length;a<o;a++){const l=e[a];i[l.uuid]===void 0&&(i[l.uuid]=s.parse(l)),r[l.uuid]=i[l.uuid]}}return r}parseAnimations(e){const t={};if(e!==void 0)for(let i=0;i<e.length;i++){const r=e[i],s=Qs.parse(r);t[s.uuid]=s}return t}parseImages(e,t){const i=this,r={};let s;function a(l){return i.manager.itemStart(l),s.load(l,function(){i.manager.itemEnd(l)},void 0,function(){i.manager.itemError(l),i.manager.itemEnd(l)})}function o(l){if(typeof l=="string"){const c=l,h=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(c)?c:i.resourcePath+c;return a(h)}else return l.data?{data:es(l.type,l.data),width:l.width,height:l.height}:null}if(e!==void 0&&e.length>0){const l=new Kl(t);s=new en(l),s.setCrossOrigin(this.crossOrigin);for(let c=0,h=e.length;c<h;c++){const d=e[c],u=d.url;if(Array.isArray(u)){const p=[];for(let f=0,v=u.length;f<v;f++){const g=u[f],m=o(g);m!==null&&(m instanceof HTMLImageElement?p.push(m):p.push(new ns(m.data,m.width,m.height)))}r[d.uuid]=new Mr(p)}else{const p=o(d.url);r[d.uuid]=new Mr(p)}}}return r}parseImagesAsync(e){return xt(this,null,function*(){const t=this,i={};let r;function s(a){return xt(this,null,function*(){if(typeof a=="string"){const o=a,l=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(o)?o:t.resourcePath+o;return yield r.loadAsync(l)}else return a.data?{data:es(a.type,a.data),width:a.width,height:a.height}:null})}if(e!==void 0&&e.length>0){r=new en(this.manager),r.setCrossOrigin(this.crossOrigin);for(let a=0,o=e.length;a<o;a++){const l=e[a],c=l.url;if(Array.isArray(c)){const h=[];for(let d=0,u=c.length;d<u;d++){const p=c[d],f=yield s(p);f!==null&&(f instanceof HTMLImageElement?h.push(f):h.push(new ns(f.data,f.width,f.height)))}i[l.uuid]=new Mr(h)}else{const h=yield s(l.url);i[l.uuid]=new Mr(h)}}}return i})}parseTextures(e,t){function i(s,a){return typeof s=="number"?s:(console.warn("THREE.ObjectLoader.parseTexture: Constant should be in numeric form.",s),a[s])}const r={};if(e!==void 0)for(let s=0,a=e.length;s<a;s++){const o=e[s];o.image===void 0&&console.warn('THREE.ObjectLoader: No "image" specified for',o.uuid),t[o.image]===void 0&&console.warn("THREE.ObjectLoader: Undefined image",o.image);const l=t[o.image],c=l.data;let h;Array.isArray(c)?(h=new nn,c.length===6&&(h.needsUpdate=!0)):(c&&c.data?h=new ns:h=new mt,c&&(h.needsUpdate=!0)),h.source=l,h.uuid=o.uuid,o.name!==void 0&&(h.name=o.name),o.mapping!==void 0&&(h.mapping=i(o.mapping,o_)),o.channel!==void 0&&(h.channel=o.channel),o.offset!==void 0&&h.offset.fromArray(o.offset),o.repeat!==void 0&&h.repeat.fromArray(o.repeat),o.center!==void 0&&h.center.fromArray(o.center),o.rotation!==void 0&&(h.rotation=o.rotation),o.wrap!==void 0&&(h.wrapS=i(o.wrap[0],Mh),h.wrapT=i(o.wrap[1],Mh)),o.format!==void 0&&(h.format=o.format),o.internalFormat!==void 0&&(h.internalFormat=o.internalFormat),o.type!==void 0&&(h.type=o.type),o.colorSpace!==void 0&&(h.colorSpace=o.colorSpace),o.encoding!==void 0&&(h.encoding=o.encoding),o.minFilter!==void 0&&(h.minFilter=i(o.minFilter,bh)),o.magFilter!==void 0&&(h.magFilter=i(o.magFilter,bh)),o.anisotropy!==void 0&&(h.anisotropy=o.anisotropy),o.flipY!==void 0&&(h.flipY=o.flipY),o.generateMipmaps!==void 0&&(h.generateMipmaps=o.generateMipmaps),o.premultiplyAlpha!==void 0&&(h.premultiplyAlpha=o.premultiplyAlpha),o.unpackAlignment!==void 0&&(h.unpackAlignment=o.unpackAlignment),o.compareFunction!==void 0&&(h.compareFunction=o.compareFunction),o.userData!==void 0&&(h.userData=o.userData),r[o.uuid]=h}return r}parseObject(e,t,i,r,s){let a;function o(u){return t[u]===void 0&&console.warn("THREE.ObjectLoader: Undefined geometry",u),t[u]}function l(u){if(u!==void 0){if(Array.isArray(u)){const p=[];for(let f=0,v=u.length;f<v;f++){const g=u[f];i[g]===void 0&&console.warn("THREE.ObjectLoader: Undefined material",g),p.push(i[g])}return p}return i[u]===void 0&&console.warn("THREE.ObjectLoader: Undefined material",u),i[u]}}function c(u){return r[u]===void 0&&console.warn("THREE.ObjectLoader: Undefined texture",u),r[u]}let h,d;switch(e.type){case"Scene":a=new zi,e.background!==void 0&&(Number.isInteger(e.background)?a.background=new oe(e.background):a.background=c(e.background)),e.environment!==void 0&&(a.environment=c(e.environment)),e.fog!==void 0&&(e.fog.type==="Fog"?a.fog=new Pr(e.fog.color,e.fog.near,e.fog.far):e.fog.type==="FogExp2"&&(a.fog=new Ta(e.fog.color,e.fog.density)),e.fog.name!==""&&(a.fog.name=e.fog.name)),e.backgroundBlurriness!==void 0&&(a.backgroundBlurriness=e.backgroundBlurriness),e.backgroundIntensity!==void 0&&(a.backgroundIntensity=e.backgroundIntensity);break;case"PerspectiveCamera":a=new yt(e.fov,e.aspect,e.near,e.far),e.focus!==void 0&&(a.focus=e.focus),e.zoom!==void 0&&(a.zoom=e.zoom),e.filmGauge!==void 0&&(a.filmGauge=e.filmGauge),e.filmOffset!==void 0&&(a.filmOffset=e.filmOffset),e.view!==void 0&&(a.view=Object.assign({},e.view));break;case"OrthographicCamera":a=new tr(e.left,e.right,e.top,e.bottom,e.near,e.far),e.zoom!==void 0&&(a.zoom=e.zoom),e.view!==void 0&&(a.view=Object.assign({},e.view));break;case"AmbientLight":a=new Gd(e.color,e.intensity);break;case"DirectionalLight":a=new Hd(e.color,e.intensity);break;case"PointLight":a=new kd(e.color,e.intensity,e.distance,e.decay);break;case"RectAreaLight":a=new Vd(e.color,e.intensity,e.width,e.height);break;case"SpotLight":a=new Bd(e.color,e.intensity,e.distance,e.angle,e.penumbra,e.decay);break;case"HemisphereLight":a=new zd(e.color,e.groundColor,e.intensity);break;case"LightProbe":a=new Xd().fromJSON(e);break;case"SkinnedMesh":h=o(e.geometry),d=l(e.material),a=new hd(h,d),e.bindMode!==void 0&&(a.bindMode=e.bindMode),e.bindMatrix!==void 0&&a.bindMatrix.fromArray(e.bindMatrix),e.skeleton!==void 0&&(a.skeleton=e.skeleton);break;case"Mesh":h=o(e.geometry),d=l(e.material),a=new at(h,d);break;case"InstancedMesh":h=o(e.geometry),d=l(e.material);const u=e.count,p=e.instanceMatrix,f=e.instanceColor;a=new ud(h,d,u),a.instanceMatrix=new cs(new Float32Array(p.array),16),f!==void 0&&(a.instanceColor=new cs(new Float32Array(f.array),f.itemSize));break;case"LOD":a=new cd;break;case"Line":a=new oi(o(e.geometry),l(e.material));break;case"LineLoop":a=new dd(o(e.geometry),l(e.material));break;case"LineSegments":a=new Mi(o(e.geometry),l(e.material));break;case"PointCloud":case"Points":a=new _i(o(e.geometry),l(e.material));break;case"Sprite":a=new ld(l(e.material));break;case"Group":a=new Pi;break;case"Bone":a=new kl;break;default:a=new Ke}if(a.uuid=e.uuid,e.name!==void 0&&(a.name=e.name),e.matrix!==void 0?(a.matrix.fromArray(e.matrix),e.matrixAutoUpdate!==void 0&&(a.matrixAutoUpdate=e.matrixAutoUpdate),a.matrixAutoUpdate&&a.matrix.decompose(a.position,a.quaternion,a.scale)):(e.position!==void 0&&a.position.fromArray(e.position),e.rotation!==void 0&&a.rotation.fromArray(e.rotation),e.quaternion!==void 0&&a.quaternion.fromArray(e.quaternion),e.scale!==void 0&&a.scale.fromArray(e.scale)),e.up!==void 0&&a.up.fromArray(e.up),e.castShadow!==void 0&&(a.castShadow=e.castShadow),e.receiveShadow!==void 0&&(a.receiveShadow=e.receiveShadow),e.shadow&&(e.shadow.bias!==void 0&&(a.shadow.bias=e.shadow.bias),e.shadow.normalBias!==void 0&&(a.shadow.normalBias=e.shadow.normalBias),e.shadow.radius!==void 0&&(a.shadow.radius=e.shadow.radius),e.shadow.mapSize!==void 0&&a.shadow.mapSize.fromArray(e.shadow.mapSize),e.shadow.camera!==void 0&&(a.shadow.camera=this.parseObject(e.shadow.camera))),e.visible!==void 0&&(a.visible=e.visible),e.frustumCulled!==void 0&&(a.frustumCulled=e.frustumCulled),e.renderOrder!==void 0&&(a.renderOrder=e.renderOrder),e.userData!==void 0&&(a.userData=e.userData),e.layers!==void 0&&(a.layers.mask=e.layers),e.children!==void 0){const u=e.children;for(let p=0;p<u.length;p++)a.add(this.parseObject(u[p],t,i,r,s))}if(e.animations!==void 0){const u=e.animations;for(let p=0;p<u.length;p++){const f=u[p];a.animations.push(s[f])}}if(e.type==="LOD"){e.autoUpdate!==void 0&&(a.autoUpdate=e.autoUpdate);const u=e.levels;for(let p=0;p<u.length;p++){const f=u[p],v=a.getObjectByProperty("uuid",f.object);v!==void 0&&a.addLevel(v,f.distance,f.hysteresis)}}return a}bindSkeletons(e,t){Object.keys(t).length!==0&&e.traverse(function(i){if(i.isSkinnedMesh===!0&&i.skeleton!==void 0){const r=t[i.skeleton];r===void 0?console.warn("THREE.ObjectLoader: No skeleton found with UUID:",i.skeleton):i.bind(r,i.bindMatrix)}})}}const o_={UVMapping:va,CubeReflectionMapping:Oi,CubeRefractionMapping:Qi,EquirectangularReflectionMapping:Us,EquirectangularRefractionMapping:Ns,CubeUVReflectionMapping:hs},Mh={RepeatWrapping:Os,ClampToEdgeWrapping:It,MirroredRepeatWrapping:Fs},bh={NearestFilter:dt,NearestMipmapNearestFilter:da,NearestMipmapLinearFilter:Rs,LinearFilter:pt,LinearMipmapNearestFilter:bl,LinearMipmapLinearFilter:er};class l_ extends Xt{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(e){return this.options=e,this}load(e,t,i,r){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const s=this,a=Cr.get(e);if(a!==void 0)return s.manager.itemStart(e),setTimeout(function(){t&&t(a),s.manager.itemEnd(e)},0),a;const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,fetch(e,o).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(l){Cr.add(e,l),t&&t(l),s.manager.itemEnd(e)}).catch(function(l){r&&r(l),s.manager.itemError(e),s.manager.itemEnd(e)}),s.manager.itemStart(e)}}let Jn;class Ql{static getContext(){return Jn===void 0&&(Jn=new(window.AudioContext||window.webkitAudioContext)),Jn}static setContext(e){Jn=e}}class c_ extends Xt{constructor(e){super(e)}load(e,t,i,r){const s=this,a=new Bi(this.manager);a.setResponseType("arraybuffer"),a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(e,function(l){try{const c=l.slice(0);Ql.getContext().decodeAudioData(c,function(h){t(h)},o)}catch(c){o(c)}},i,r);function o(l){r?r(l):console.error(l),s.manager.itemError(e)}}}const Sh=new Fe,wh=new Fe,ur=new Fe;class h_{constructor(){this.type="StereoCamera",this.aspect=1,this.eyeSep=.064,this.cameraL=new yt,this.cameraL.layers.enable(1),this.cameraL.matrixAutoUpdate=!1,this.cameraR=new yt,this.cameraR.layers.enable(2),this.cameraR.matrixAutoUpdate=!1,this._cache={focus:null,fov:null,aspect:null,near:null,far:null,zoom:null,eyeSep:null}}update(e){const t=this._cache;if(t.focus!==e.focus||t.fov!==e.fov||t.aspect!==e.aspect*this.aspect||t.near!==e.near||t.far!==e.far||t.zoom!==e.zoom||t.eyeSep!==this.eyeSep){t.focus=e.focus,t.fov=e.fov,t.aspect=e.aspect*this.aspect,t.near=e.near,t.far=e.far,t.zoom=e.zoom,t.eyeSep=this.eyeSep,ur.copy(e.projectionMatrix);const i=t.eyeSep/2,r=i*t.near/t.focus,s=t.near*Math.tan(wr*t.fov*.5)/t.zoom;let a,o;wh.elements[12]=-i,Sh.elements[12]=i,a=-s*t.aspect+r,o=s*t.aspect+r,ur.elements[0]=2*t.near/(o-a),ur.elements[8]=(o+a)/(o-a),this.cameraL.projectionMatrix.copy(ur),a=-s*t.aspect-r,o=s*t.aspect-r,ur.elements[0]=2*t.near/(o-a),ur.elements[8]=(o+a)/(o-a),this.cameraR.projectionMatrix.copy(ur)}this.cameraL.matrixWorld.copy(e.matrixWorld).multiply(wh),this.cameraR.matrixWorld.copy(e.matrixWorld).multiply(Sh)}}class Yd{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Eh(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=Eh();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function Eh(){return(typeof performance>"u"?Date:performance).now()}const dr=new E,Th=new Vt,u_=new E,pr=new E;class d_ extends Ke{constructor(){super(),this.type="AudioListener",this.context=Ql.getContext(),this.gain=this.context.createGain(),this.gain.connect(this.context.destination),this.filter=null,this.timeDelta=0,this._clock=new Yd}getInput(){return this.gain}removeFilter(){return this.filter!==null&&(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination),this.gain.connect(this.context.destination),this.filter=null),this}getFilter(){return this.filter}setFilter(e){return this.filter!==null?(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination)):this.gain.disconnect(this.context.destination),this.filter=e,this.gain.connect(this.filter),this.filter.connect(this.context.destination),this}getMasterVolume(){return this.gain.gain.value}setMasterVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}updateMatrixWorld(e){super.updateMatrixWorld(e);const t=this.context.listener,i=this.up;if(this.timeDelta=this._clock.getDelta(),this.matrixWorld.decompose(dr,Th,u_),pr.set(0,0,-1).applyQuaternion(Th),t.positionX){const r=this.context.currentTime+this.timeDelta;t.positionX.linearRampToValueAtTime(dr.x,r),t.positionY.linearRampToValueAtTime(dr.y,r),t.positionZ.linearRampToValueAtTime(dr.z,r),t.forwardX.linearRampToValueAtTime(pr.x,r),t.forwardY.linearRampToValueAtTime(pr.y,r),t.forwardZ.linearRampToValueAtTime(pr.z,r),t.upX.linearRampToValueAtTime(i.x,r),t.upY.linearRampToValueAtTime(i.y,r),t.upZ.linearRampToValueAtTime(i.z,r)}else t.setPosition(dr.x,dr.y,dr.z),t.setOrientation(pr.x,pr.y,pr.z,i.x,i.y,i.z)}}class Zd extends Ke{constructor(e){super(),this.type="Audio",this.listener=e,this.context=e.context,this.gain=this.context.createGain(),this.gain.connect(e.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType="empty",this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(e){return this.hasPlaybackControl=!1,this.sourceType="audioNode",this.source=e,this.connect(),this}setMediaElementSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaNode",this.source=this.context.createMediaElementSource(e),this.connect(),this}setMediaStreamSource(e){return this.hasPlaybackControl=!1,this.sourceType="mediaStreamNode",this.source=this.context.createMediaStreamSource(e),this.connect(),this}setBuffer(e){return this.buffer=e,this.sourceType="buffer",this.autoplay&&this.play(),this}play(e=0){if(this.isPlaying===!0){console.warn("THREE.Audio: Audio is already playing.");return}if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}this._startedAt=this.context.currentTime+e;const t=this.context.createBufferSource();return t.buffer=this.buffer,t.loop=this.loop,t.loopStart=this.loopStart,t.loopEnd=this.loopEnd,t.onended=this.onEnded.bind(this),t.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=t,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress=this._progress%(this.duration||this.buffer.duration)),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this}stop(){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this._progress=0,this.source!==null&&(this.source.stop(),this.source.onended=null),this.isPlaying=!1,this}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].connect(this.filters[e]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(this._connected!==!1){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let e=1,t=this.filters.length;e<t;e++)this.filters[e-1].disconnect(this.filters[e]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}}getFilters(){return this.filters}setFilters(e){return e||(e=[]),this._connected===!0?(this.disconnect(),this.filters=e.slice(),this.connect()):this.filters=e.slice(),this}setDetune(e){if(this.detune=e,this.source.detune!==void 0)return this.isPlaying===!0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(e){return this.setFilters(e?[e]:[])}setPlaybackRate(e){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.playbackRate=e,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1}getLoop(){return this.hasPlaybackControl===!1?(console.warn("THREE.Audio: this Audio has no playback control."),!1):this.loop}setLoop(e){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.loop=e,this.isPlaying===!0&&(this.source.loop=this.loop),this}setLoopStart(e){return this.loopStart=e,this}setLoopEnd(e){return this.loopEnd=e,this}getVolume(){return this.gain.gain.value}setVolume(e){return this.gain.gain.setTargetAtTime(e,this.context.currentTime,.01),this}}const mr=new E,Ah=new Vt,p_=new E,fr=new E;class m_ extends Zd{constructor(e){super(e),this.panner=this.context.createPanner(),this.panner.panningModel="HRTF",this.panner.connect(this.gain)}connect(){super.connect(),this.panner.connect(this.gain)}disconnect(){super.disconnect(),this.panner.disconnect(this.gain)}getOutput(){return this.panner}getRefDistance(){return this.panner.refDistance}setRefDistance(e){return this.panner.refDistance=e,this}getRolloffFactor(){return this.panner.rolloffFactor}setRolloffFactor(e){return this.panner.rolloffFactor=e,this}getDistanceModel(){return this.panner.distanceModel}setDistanceModel(e){return this.panner.distanceModel=e,this}getMaxDistance(){return this.panner.maxDistance}setMaxDistance(e){return this.panner.maxDistance=e,this}setDirectionalCone(e,t,i){return this.panner.coneInnerAngle=e,this.panner.coneOuterAngle=t,this.panner.coneOuterGain=i,this}updateMatrixWorld(e){if(super.updateMatrixWorld(e),this.hasPlaybackControl===!0&&this.isPlaying===!1)return;this.matrixWorld.decompose(mr,Ah,p_),fr.set(0,0,1).applyQuaternion(Ah);const t=this.panner;if(t.positionX){const i=this.context.currentTime+this.listener.timeDelta;t.positionX.linearRampToValueAtTime(mr.x,i),t.positionY.linearRampToValueAtTime(mr.y,i),t.positionZ.linearRampToValueAtTime(mr.z,i),t.orientationX.linearRampToValueAtTime(fr.x,i),t.orientationY.linearRampToValueAtTime(fr.y,i),t.orientationZ.linearRampToValueAtTime(fr.z,i)}else t.setPosition(mr.x,mr.y,mr.z),t.setOrientation(fr.x,fr.y,fr.z)}}class f_{constructor(e,t=2048){this.analyser=e.context.createAnalyser(),this.analyser.fftSize=t,this.data=new Uint8Array(this.analyser.frequencyBinCount),e.getOutput().connect(this.analyser)}getFrequencyData(){return this.analyser.getByteFrequencyData(this.data),this.data}getAverageFrequency(){let e=0;const t=this.getFrequencyData();for(let i=0;i<t.length;i++)e+=t[i];return e/t.length}}class Jd{constructor(e,t,i){this.binding=e,this.valueSize=i;let r,s,a;switch(t){case"quaternion":r=this._slerp,s=this._slerpAdditive,a=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(i*6),this._workIndex=5;break;case"string":case"bool":r=this._select,s=this._select,a=this._setAdditiveIdentityOther,this.buffer=new Array(i*5);break;default:r=this._lerp,s=this._lerpAdditive,a=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(i*5)}this._mixBufferRegion=r,this._mixBufferRegionAdditive=s,this._setIdentity=a,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){const i=this.buffer,r=this.valueSize,s=e*r+r;let a=this.cumulativeWeight;if(a===0){for(let o=0;o!==r;++o)i[s+o]=i[o];a=t}else{a+=t;const o=t/a;this._mixBufferRegion(i,s,0,o,r)}this.cumulativeWeight=a}accumulateAdditive(e){const t=this.buffer,i=this.valueSize,r=i*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,r,0,e,i),this.cumulativeWeightAdditive+=e}apply(e){const t=this.valueSize,i=this.buffer,r=e*t+t,s=this.cumulativeWeight,a=this.cumulativeWeightAdditive,o=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,s<1){const l=t*this._origIndex;this._mixBufferRegion(i,r,l,1-s,t)}a>0&&this._mixBufferRegionAdditive(i,r,this._addIndex*t,1,t);for(let l=t,c=t+t;l!==c;++l)if(i[l]!==i[l+t]){o.setValue(i,r);break}}saveOriginalState(){const e=this.binding,t=this.buffer,i=this.valueSize,r=i*this._origIndex;e.getValue(t,r);for(let s=i,a=r;s!==a;++s)t[s]=t[r+s%i];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){const e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){const e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let i=e;i<t;i++)this.buffer[i]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){const e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let i=0;i<this.valueSize;i++)this.buffer[t+i]=this.buffer[e+i]}_select(e,t,i,r,s){if(r>=.5)for(let a=0;a!==s;++a)e[t+a]=e[i+a]}_slerp(e,t,i,r){Vt.slerpFlat(e,t,e,t,e,i,r)}_slerpAdditive(e,t,i,r,s){const a=this._workIndex*s;Vt.multiplyQuaternionsFlat(e,a,e,t,e,i),Vt.slerpFlat(e,t,e,t,e,a,r)}_lerp(e,t,i,r,s){const a=1-r;for(let o=0;o!==s;++o){const l=t+o;e[l]=e[l]*a+e[i+o]*r}}_lerpAdditive(e,t,i,r,s){for(let a=0;a!==s;++a){const o=t+a;e[o]=e[o]+e[i+a]*r}}}const ec="\\[\\]\\.:\\/",g_=new RegExp("["+ec+"]","g"),tc="[^"+ec+"]",v_="[^"+ec.replace("\\.","")+"]",y_=/((?:WC+[\/:])*)/.source.replace("WC",tc),__=/(WCOD+)?/.source.replace("WCOD",v_),x_=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",tc),M_=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",tc),b_=new RegExp("^"+y_+__+x_+M_+"$"),S_=["material","materials","bones","map"];class w_{constructor(e,t,i){const r=i||Ye.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();const i=this._targetGroup.nCachedObjects_,r=this._bindings[i];r!==void 0&&r.getValue(e,t)}setValue(e,t){const i=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=i.length;r!==s;++r)i[r].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}}class Ye{constructor(e,t,i){this.path=t,this.parsedPath=i||Ye.parseTrackName(t),this.node=Ye.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new Ye.Composite(e,t,i):new Ye(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(g_,"")}static parseTrackName(e){const t=b_.exec(e);if(t===null)throw new Error("PropertyBinding: Cannot parse trackName: "+e);const i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=i.nodeName&&i.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){const s=i.nodeName.substring(r+1);S_.indexOf(s)!==-1&&(i.nodeName=i.nodeName.substring(0,r),i.objectName=s)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){const i=function(s){for(let a=0;a<s.length;a++){const o=s[a];if(o.name===t||o.uuid===t)return o;const l=i(o.children);if(l)return l}return null},r=i(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)e[t++]=i[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,i=t.objectName,r=t.propertyName;let s=t.propertyIndex;if(e||(e=Ye.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[r];if(a===void 0){const c=t.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+c+"."+r+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:e.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=s}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=r;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}Ye.Composite=w_;Ye.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ye.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ye.prototype.GetterByBindingType=[Ye.prototype._getValue_direct,Ye.prototype._getValue_array,Ye.prototype._getValue_arrayElement,Ye.prototype._getValue_toArray];Ye.prototype.SetterByBindingTypeAndVersioning=[[Ye.prototype._setValue_direct,Ye.prototype._setValue_direct_setNeedsUpdate,Ye.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ye.prototype._setValue_array,Ye.prototype._setValue_array_setNeedsUpdate,Ye.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ye.prototype._setValue_arrayElement,Ye.prototype._setValue_arrayElement_setNeedsUpdate,Ye.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ye.prototype._setValue_fromArray,Ye.prototype._setValue_fromArray_setNeedsUpdate,Ye.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];class E_{constructor(){this.isAnimationObjectGroup=!0,this.uuid=Kt(),this._objects=Array.prototype.slice.call(arguments),this.nCachedObjects_=0;const e={};this._indicesByUUID=e;for(let i=0,r=arguments.length;i!==r;++i)e[arguments[i].uuid]=i;this._paths=[],this._parsedPaths=[],this._bindings=[],this._bindingsIndicesByPath={};const t=this;this.stats={objects:{get total(){return t._objects.length},get inUse(){return this.total-t.nCachedObjects_}},get bindingsPerObject(){return t._bindings.length}}}add(){const e=this._objects,t=this._indicesByUUID,i=this._paths,r=this._parsedPaths,s=this._bindings,a=s.length;let o,l=e.length,c=this.nCachedObjects_;for(let h=0,d=arguments.length;h!==d;++h){const u=arguments[h],p=u.uuid;let f=t[p];if(f===void 0){f=l++,t[p]=f,e.push(u);for(let v=0,g=a;v!==g;++v)s[v].push(new Ye(u,i[v],r[v]))}else if(f<c){o=e[f];const v=--c,g=e[v];t[g.uuid]=f,e[f]=g,t[p]=v,e[v]=u;for(let m=0,_=a;m!==_;++m){const y=s[m],x=y[v];let w=y[f];y[f]=x,w===void 0&&(w=new Ye(u,i[m],r[m])),y[v]=w}}else e[f]!==o&&console.error("THREE.AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes.")}this.nCachedObjects_=c}remove(){const e=this._objects,t=this._indicesByUUID,i=this._bindings,r=i.length;let s=this.nCachedObjects_;for(let a=0,o=arguments.length;a!==o;++a){const l=arguments[a],c=l.uuid,h=t[c];if(h!==void 0&&h>=s){const d=s++,u=e[d];t[u.uuid]=h,e[h]=u,t[c]=d,e[d]=l;for(let p=0,f=r;p!==f;++p){const v=i[p],g=v[d],m=v[h];v[h]=g,v[d]=m}}}this.nCachedObjects_=s}uncache(){const e=this._objects,t=this._indicesByUUID,i=this._bindings,r=i.length;let s=this.nCachedObjects_,a=e.length;for(let o=0,l=arguments.length;o!==l;++o){const c=arguments[o],h=c.uuid,d=t[h];if(d!==void 0)if(delete t[h],d<s){const u=--s,p=e[u],f=--a,v=e[f];t[p.uuid]=d,e[d]=p,t[v.uuid]=u,e[u]=v,e.pop();for(let g=0,m=r;g!==m;++g){const _=i[g],y=_[u],x=_[f];_[d]=y,_[u]=x,_.pop()}}else{const u=--a,p=e[u];u>0&&(t[p.uuid]=d),e[d]=p,e.pop();for(let f=0,v=r;f!==v;++f){const g=i[f];g[d]=g[u],g.pop()}}}this.nCachedObjects_=s}subscribe_(e,t){const i=this._bindingsIndicesByPath;let r=i[e];const s=this._bindings;if(r!==void 0)return s[r];const a=this._paths,o=this._parsedPaths,l=this._objects,c=l.length,h=this.nCachedObjects_,d=new Array(c);r=s.length,i[e]=r,a.push(e),o.push(t),s.push(d);for(let u=h,p=l.length;u!==p;++u){const f=l[u];d[u]=new Ye(f,e,t)}return d}unsubscribe_(e){const t=this._bindingsIndicesByPath,i=t[e];if(i!==void 0){const r=this._paths,s=this._parsedPaths,a=this._bindings,o=a.length-1,l=a[o],c=e[o];t[c]=i,a[i]=l,a.pop(),s[i]=s[o],s.pop(),r[i]=r[o],r.pop()}}}class Kd{constructor(e,t,i=null,r=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=i,this.blendMode=r;const s=t.tracks,a=s.length,o=new Array(a),l={endingStart:_r,endingEnd:_r};for(let c=0;c!==a;++c){const h=s[c].createInterpolant(null);o[c]=h,h.settings=l}this._interpolantSettings=l,this._interpolants=o,this._propertyBindings=new Array(a),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=Lu,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,i){if(e.fadeOut(t),this.fadeIn(t),i){const r=this._clip.duration,s=e._clip.duration,a=s/r,o=r/s;e.warp(1,a,t),this.warp(o,1,t)}return this}crossFadeTo(e,t,i){return e.crossFadeFrom(this,t,i)}stopFading(){const e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,i){const r=this._mixer,s=r.time,a=this.timeScale;let o=this._timeScaleInterpolant;o===null&&(o=r._lendControlInterpolant(),this._timeScaleInterpolant=o);const l=o.parameterPositions,c=o.sampleValues;return l[0]=s,l[1]=s+i,c[0]=e/a,c[1]=t/a,this}stopWarping(){const e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,i,r){if(!this.enabled){this._updateWeight(e);return}const s=this._startTime;if(s!==null){const l=(e-s)*i;l<0||i===0?t=0:(this._startTime=null,t=i*l)}t*=this._updateTimeScale(e);const a=this._updateTime(t),o=this._updateWeight(e);if(o>0){const l=this._interpolants,c=this._propertyBindings;switch(this.blendMode){case Cl:for(let h=0,d=l.length;h!==d;++h)l[h].evaluate(a),c[h].accumulateAdditive(o);break;case _a:default:for(let h=0,d=l.length;h!==d;++h)l[h].evaluate(a),c[h].accumulate(r,o)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;const i=this._weightInterpolant;if(i!==null){const r=i.evaluate(e)[0];t*=r,e>i.parameterPositions[1]&&(this.stopFading(),r===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;const i=this._timeScaleInterpolant;if(i!==null){const r=i.evaluate(e)[0];t*=r,e>i.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t)}}return this._effectiveTimeScale=t,t}_updateTime(e){const t=this._clip.duration,i=this.loop;let r=this.time+e,s=this._loopCount;const a=i===Pu;if(e===0)return s===-1?r:a&&(s&1)===1?t-r:r;if(i===Cu){s===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(r>=t)r=t;else if(r<0)r=0;else{this.time=r;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=r,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(s===-1&&(e>=0?(s=0,this._setEndings(!0,this.repetitions===0,a)):this._setEndings(this.repetitions===0,!0,a)),r>=t||r<0){const o=Math.floor(r/t);r-=t*o,s+=Math.abs(o);const l=this.repetitions-s;if(l<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,r=e>0?t:0,this.time=r,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(l===1){const c=e<0;this._setEndings(c,!c,a)}else this._setEndings(!1,!1,a);this._loopCount=s,this.time=r,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:o})}}else this.time=r;if(a&&(s&1)===1)return t-r}return r}_setEndings(e,t,i){const r=this._interpolantSettings;i?(r.endingStart=xr,r.endingEnd=xr):(e?r.endingStart=this.zeroSlopeAtStart?xr:_r:r.endingStart=ks,t?r.endingEnd=this.zeroSlopeAtEnd?xr:_r:r.endingEnd=ks)}_scheduleFading(e,t,i){const r=this._mixer,s=r.time;let a=this._weightInterpolant;a===null&&(a=r._lendControlInterpolant(),this._weightInterpolant=a);const o=a.parameterPositions,l=a.sampleValues;return o[0]=s,l[0]=t,o[1]=s+e,l[1]=i,this}}const T_=new Float32Array(1);class A_ extends ki{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){const i=e._localRoot||this._root,r=e._clip.tracks,s=r.length,a=e._propertyBindings,o=e._interpolants,l=i.uuid,c=this._bindingsByRootAndName;let h=c[l];h===void 0&&(h={},c[l]=h);for(let d=0;d!==s;++d){const u=r[d],p=u.name;let f=h[p];if(f!==void 0)++f.referenceCount,a[d]=f;else{if(f=a[d],f!==void 0){f._cacheIndex===null&&(++f.referenceCount,this._addInactiveBinding(f,l,p));continue}const v=t&&t._propertyBindings[d].binding.parsedPath;f=new Jd(Ye.create(i,p,v),u.ValueTypeName,u.getValueSize()),++f.referenceCount,this._addInactiveBinding(f,l,p),a[d]=f}o[d].resultBuffer=f.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){const i=(e._localRoot||this._root).uuid,r=e._clip.uuid,s=this._actionsByClip[r];this._bindAction(e,s&&s.knownActions[0]),this._addInactiveAction(e,r,i)}const t=e._propertyBindings;for(let i=0,r=t.length;i!==r;++i){const s=t[i];s.useCount++===0&&(this._lendBinding(s),s.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){const t=e._propertyBindings;for(let i=0,r=t.length;i!==r;++i){const s=t[i];--s.useCount===0&&(s.restoreOriginalState(),this._takeBackBinding(s))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;const e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){const t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,i){const r=this._actions,s=this._actionsByClip;let a=s[t];if(a===void 0)a={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,s[t]=a;else{const o=a.knownActions;e._byClipCacheIndex=o.length,o.push(e)}e._cacheIndex=r.length,r.push(e),a.actionByRoot[i]=e}_removeInactiveAction(e){const t=this._actions,i=t[t.length-1],r=e._cacheIndex;i._cacheIndex=r,t[r]=i,t.pop(),e._cacheIndex=null;const s=e._clip.uuid,a=this._actionsByClip,o=a[s],l=o.knownActions,c=l[l.length-1],h=e._byClipCacheIndex;c._byClipCacheIndex=h,l[h]=c,l.pop(),e._byClipCacheIndex=null;const d=o.actionByRoot,u=(e._localRoot||this._root).uuid;delete d[u],l.length===0&&delete a[s],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){const t=e._propertyBindings;for(let i=0,r=t.length;i!==r;++i){const s=t[i];--s.referenceCount===0&&this._removeInactiveBinding(s)}}_lendAction(e){const t=this._actions,i=e._cacheIndex,r=this._nActiveActions++,s=t[r];e._cacheIndex=r,t[r]=e,s._cacheIndex=i,t[i]=s}_takeBackAction(e){const t=this._actions,i=e._cacheIndex,r=--this._nActiveActions,s=t[r];e._cacheIndex=r,t[r]=e,s._cacheIndex=i,t[i]=s}_addInactiveBinding(e,t,i){const r=this._bindingsByRootAndName,s=this._bindings;let a=r[t];a===void 0&&(a={},r[t]=a),a[i]=e,e._cacheIndex=s.length,s.push(e)}_removeInactiveBinding(e){const t=this._bindings,i=e.binding,r=i.rootNode.uuid,s=i.path,a=this._bindingsByRootAndName,o=a[r],l=t[t.length-1],c=e._cacheIndex;l._cacheIndex=c,t[c]=l,t.pop(),delete o[s],Object.keys(o).length===0&&delete a[r]}_lendBinding(e){const t=this._bindings,i=e._cacheIndex,r=this._nActiveBindings++,s=t[r];e._cacheIndex=r,t[r]=e,s._cacheIndex=i,t[i]=s}_takeBackBinding(e){const t=this._bindings,i=e._cacheIndex,r=--this._nActiveBindings,s=t[r];e._cacheIndex=r,t[r]=e,s._cacheIndex=i,t[i]=s}_lendControlInterpolant(){const e=this._controlInterpolants,t=this._nActiveControlInterpolants++;let i=e[t];return i===void 0&&(i=new Zl(new Float32Array(2),new Float32Array(2),1,T_),i.__cacheIndex=t,e[t]=i),i}_takeBackControlInterpolant(e){const t=this._controlInterpolants,i=e.__cacheIndex,r=--this._nActiveControlInterpolants,s=t[r];e.__cacheIndex=r,t[r]=e,s.__cacheIndex=i,t[i]=s}clipAction(e,t,i){const r=t||this._root,s=r.uuid;let a=typeof e=="string"?Qs.findByName(r,e):e;const o=a!==null?a.uuid:e,l=this._actionsByClip[o];let c=null;if(i===void 0&&(a!==null?i=a.blendMode:i=_a),l!==void 0){const d=l.actionByRoot[s];if(d!==void 0&&d.blendMode===i)return d;c=l.knownActions[0],a===null&&(a=c._clip)}if(a===null)return null;const h=new Kd(this,a,t,i);return this._bindAction(h,c),this._addInactiveAction(h,o,s),h}existingAction(e,t){const i=t||this._root,r=i.uuid,s=typeof e=="string"?Qs.findByName(i,e):e,a=s?s.uuid:e,o=this._actionsByClip[a];return o!==void 0&&o.actionByRoot[r]||null}stopAllAction(){const e=this._actions,t=this._nActiveActions;for(let i=t-1;i>=0;--i)e[i].stop();return this}update(e){e*=this.timeScale;const t=this._actions,i=this._nActiveActions,r=this.time+=e,s=Math.sign(e),a=this._accuIndex^=1;for(let c=0;c!==i;++c)t[c]._update(r,e,s,a);const o=this._bindings,l=this._nActiveBindings;for(let c=0;c!==l;++c)o[c].apply(a);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){const t=this._actions,i=e.uuid,r=this._actionsByClip,s=r[i];if(s!==void 0){const a=s.knownActions;for(let o=0,l=a.length;o!==l;++o){const c=a[o];this._deactivateAction(c);const h=c._cacheIndex,d=t[t.length-1];c._cacheIndex=null,c._byClipCacheIndex=null,d._cacheIndex=h,t[h]=d,t.pop(),this._removeInactiveBindingsForAction(c)}delete r[i]}}uncacheRoot(e){const t=e.uuid,i=this._actionsByClip;for(const a in i){const o=i[a].actionByRoot,l=o[t];l!==void 0&&(this._deactivateAction(l),this._removeInactiveAction(l))}const r=this._bindingsByRootAndName,s=r[t];if(s!==void 0)for(const a in s){const o=s[a];o.restoreOriginalState(),this._removeInactiveBinding(o)}}uncacheAction(e,t){const i=this.existingAction(e,t);i!==null&&(this._deactivateAction(i),this._removeInactiveAction(i))}}class ic{constructor(e){this.value=e}clone(){return new ic(this.value.clone===void 0?this.value:this.value.clone())}}let R_=0;class C_ extends ki{constructor(){super(),this.isUniformsGroup=!0,Object.defineProperty(this,"id",{value:R_++}),this.name="",this.usage=Ws,this.uniforms=[]}add(e){return this.uniforms.push(e),this}remove(e){const t=this.uniforms.indexOf(e);return t!==-1&&this.uniforms.splice(t,1),this}setName(e){return this.name=e,this}setUsage(e){return this.usage=e,this}dispose(){return this.dispatchEvent({type:"dispose"}),this}copy(e){this.name=e.name,this.usage=e.usage;const t=e.uniforms;this.uniforms.length=0;for(let i=0,r=t.length;i<r;i++)this.uniforms.push(t[i].clone());return this}clone(){return new this.constructor().copy(this)}}class L_ extends Aa{constructor(e,t,i=1){super(e,t),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){const t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){const t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}}class P_{constructor(e,t,i,r,s){this.isGLBufferAttribute=!0,this.name="",this.buffer=e,this.type=t,this.itemSize=i,this.elementSize=r,this.count=s,this.version=0}set needsUpdate(e){e===!0&&this.version++}setBuffer(e){return this.buffer=e,this}setType(e,t){return this.type=e,this.elementSize=t,this}setItemSize(e){return this.itemSize=e,this}setCount(e){return this.count=e,this}}class I_{constructor(e,t,i=0,r=1/0){this.ray=new us(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new ba,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}intersectObject(e,t=!0,i=[]){return xl(e,this,i,t),i.sort(Rh),i}intersectObjects(e,t=!0,i=[]){for(let r=0,s=e.length;r<s;r++)xl(e[r],this,i,t);return i.sort(Rh),i}}function Rh(n,e){return n.distance-e.distance}function xl(n,e,t,i){if(n.layers.test(e.layers)&&n.raycast(e,t),i===!0){const r=n.children;for(let s=0,a=r.length;s<a;s++)xl(r[s],e,t,!0)}}class D_{constructor(e=1,t=0,i=0){return this.radius=e,this.phi=t,this.theta=i,this}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(ht(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class U_{constructor(e=1,t=0,i=0){return this.radius=e,this.theta=t,this.y=i,this}set(e,t,i){return this.radius=e,this.theta=t,this.y=i,this}copy(e){return this.radius=e.radius,this.theta=e.theta,this.y=e.y,this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+i*i),this.theta=Math.atan2(e,i),this.y=t,this}clone(){return new this.constructor().copy(this)}}const Ch=new q;class N_{constructor(e=new q(1/0,1/0),t=new q(-1/0,-1/0)){this.isBox2=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Ch.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(e){return this.isEmpty()?e.set(0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y)}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ch).distanceTo(e)}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Lh=new E,Kn=new E;class O_{constructor(e=new E,t=new E){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){Lh.subVectors(e,this.start),Kn.subVectors(this.end,this.start);const i=Kn.dot(Kn);let r=Kn.dot(Lh)/i;return t&&(r=ht(r,0,1)),r}closestPointToPoint(e,t,i){const r=this.closestPointToPointParameter(e,t);return this.delta(i).multiplyScalar(r).add(this.start)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}const Ph=new E;class F_ extends Ke{constructor(e,t){super(),this.light=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=t,this.type="SpotLightHelper";const i=new Re,r=[0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,-1,0,1,0,0,0,0,1,1,0,0,0,0,-1,1];for(let a=0,o=1,l=32;a<l;a++,o++){const c=a/l*Math.PI*2,h=o/l*Math.PI*2;r.push(Math.cos(c),Math.sin(c),1,Math.cos(h),Math.sin(h),1)}i.setAttribute("position",new fe(r,3));const s=new Et({fog:!1,toneMapped:!1});this.cone=new Mi(i,s),this.add(this.cone),this.update()}dispose(){this.cone.geometry.dispose(),this.cone.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1);const e=this.light.distance?this.light.distance:1e3,t=e*Math.tan(this.light.angle);this.cone.scale.set(t,t,e),Ph.setFromMatrixPosition(this.light.target.matrixWorld),this.cone.lookAt(Ph),this.color!==void 0?this.cone.material.color.set(this.color):this.cone.material.color.copy(this.light.color)}}const ji=new E,$n=new Fe,Po=new Fe;class z_ extends Mi{constructor(e){const t=$d(e),i=new Re,r=[],s=[],a=new oe(0,0,1),o=new oe(0,1,0);for(let c=0;c<t.length;c++){const h=t[c];h.parent&&h.parent.isBone&&(r.push(0,0,0),r.push(0,0,0),s.push(a.r,a.g,a.b),s.push(o.r,o.g,o.b))}i.setAttribute("position",new fe(r,3)),i.setAttribute("color",new fe(s,3));const l=new Et({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(i,l),this.isSkeletonHelper=!0,this.type="SkeletonHelper",this.root=e,this.bones=t,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1}updateMatrixWorld(e){const t=this.bones,i=this.geometry,r=i.getAttribute("position");Po.copy(this.root.matrixWorld).invert();for(let s=0,a=0;s<t.length;s++){const o=t[s];o.parent&&o.parent.isBone&&($n.multiplyMatrices(Po,o.matrixWorld),ji.setFromMatrixPosition($n),r.setXYZ(a,ji.x,ji.y,ji.z),$n.multiplyMatrices(Po,o.parent.matrixWorld),ji.setFromMatrixPosition($n),r.setXYZ(a+1,ji.x,ji.y,ji.z),a+=2)}i.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(e)}dispose(){this.geometry.dispose(),this.material.dispose()}}function $d(n){const e=[];n.isBone===!0&&e.push(n);for(let t=0;t<n.children.length;t++)e.push.apply(e,$d(n.children[t]));return e}class B_ extends at{constructor(e,t,i){const r=new Wt(t,4,2),s=new At({wireframe:!0,fog:!1,toneMapped:!1});super(r,s),this.light=e,this.color=i,this.type="PointLightHelper",this.matrix=this.light.matrixWorld,this.matrixAutoUpdate=!1,this.update()}dispose(){this.geometry.dispose(),this.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.color!==void 0?this.material.color.set(this.color):this.material.color.copy(this.light.color)}}const k_=new E,Ih=new oe,Dh=new oe;class H_ extends Ke{constructor(e,t,i){super(),this.light=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=i,this.type="HemisphereLightHelper";const r=new cn(t);r.rotateY(Math.PI*.5),this.material=new At({wireframe:!0,fog:!1,toneMapped:!1}),this.color===void 0&&(this.material.vertexColors=!0);const s=r.getAttribute("position"),a=new Float32Array(s.count*3);r.setAttribute("color",new Pe(a,3)),this.add(new at(r,this.material)),this.update()}dispose(){this.children[0].geometry.dispose(),this.children[0].material.dispose()}update(){const e=this.children[0];if(this.color!==void 0)this.material.color.set(this.color);else{const t=e.geometry.getAttribute("color");Ih.copy(this.light.color),Dh.copy(this.light.groundColor);for(let i=0,r=t.count;i<r;i++){const s=i<r/2?Ih:Dh;t.setXYZ(i,s.r,s.g,s.b)}t.needsUpdate=!0}this.light.updateWorldMatrix(!0,!1),e.lookAt(k_.setFromMatrixPosition(this.light.matrixWorld).negate())}}class G_ extends Mi{constructor(e=10,t=10,i=4473924,r=8947848){i=new oe(i),r=new oe(r);const s=t/2,a=e/t,o=e/2,l=[],c=[];for(let u=0,p=0,f=-o;u<=t;u++,f+=a){l.push(-o,0,f,o,0,f),l.push(f,0,-o,f,0,o);const v=u===s?i:r;v.toArray(c,p),p+=3,v.toArray(c,p),p+=3,v.toArray(c,p),p+=3,v.toArray(c,p),p+=3}const h=new Re;h.setAttribute("position",new fe(l,3)),h.setAttribute("color",new fe(c,3));const d=new Et({vertexColors:!0,toneMapped:!1});super(h,d),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class V_ extends Mi{constructor(e=10,t=16,i=8,r=64,s=4473924,a=8947848){s=new oe(s),a=new oe(a);const o=[],l=[];if(t>1)for(let d=0;d<t;d++){const u=d/t*(Math.PI*2),p=Math.sin(u)*e,f=Math.cos(u)*e;o.push(0,0,0),o.push(p,0,f);const v=d&1?s:a;l.push(v.r,v.g,v.b),l.push(v.r,v.g,v.b)}for(let d=0;d<i;d++){const u=d&1?s:a,p=e-e/i*d;for(let f=0;f<r;f++){let v=f/r*(Math.PI*2),g=Math.sin(v)*p,m=Math.cos(v)*p;o.push(g,0,m),l.push(u.r,u.g,u.b),v=(f+1)/r*(Math.PI*2),g=Math.sin(v)*p,m=Math.cos(v)*p,o.push(g,0,m),l.push(u.r,u.g,u.b)}}const c=new Re;c.setAttribute("position",new fe(o,3)),c.setAttribute("color",new fe(l,3));const h=new Et({vertexColors:!0,toneMapped:!1});super(c,h),this.type="PolarGridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}const Uh=new E,Qn=new E,Nh=new E;class W_ extends Ke{constructor(e,t,i){super(),this.light=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=i,this.type="DirectionalLightHelper",t===void 0&&(t=1);let r=new Re;r.setAttribute("position",new fe([-t,t,0,t,t,0,t,-t,0,-t,-t,0,-t,t,0],3));const s=new Et({fog:!1,toneMapped:!1});this.lightPlane=new oi(r,s),this.add(this.lightPlane),r=new Re,r.setAttribute("position",new fe([0,0,0,0,0,1],3)),this.targetLine=new oi(r,s),this.add(this.targetLine),this.update()}dispose(){this.lightPlane.geometry.dispose(),this.lightPlane.material.dispose(),this.targetLine.geometry.dispose(),this.targetLine.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),Uh.setFromMatrixPosition(this.light.matrixWorld),Qn.setFromMatrixPosition(this.light.target.matrixWorld),Nh.subVectors(Qn,Uh),this.lightPlane.lookAt(Qn),this.color!==void 0?(this.lightPlane.material.color.set(this.color),this.targetLine.material.color.set(this.color)):(this.lightPlane.material.color.copy(this.light.color),this.targetLine.material.color.copy(this.light.color)),this.targetLine.lookAt(Qn),this.targetLine.scale.z=Nh.length()}}const ea=new E,ct=new Sa;class X_ extends Mi{constructor(e){const t=new Re,i=new Et({color:16777215,vertexColors:!0,toneMapped:!1}),r=[],s=[],a={};o("n1","n2"),o("n2","n4"),o("n4","n3"),o("n3","n1"),o("f1","f2"),o("f2","f4"),o("f4","f3"),o("f3","f1"),o("n1","f1"),o("n2","f2"),o("n3","f3"),o("n4","f4"),o("p","n1"),o("p","n2"),o("p","n3"),o("p","n4"),o("u1","u2"),o("u2","u3"),o("u3","u1"),o("c","t"),o("p","c"),o("cn1","cn2"),o("cn3","cn4"),o("cf1","cf2"),o("cf3","cf4");function o(f,v){l(f),l(v)}function l(f){r.push(0,0,0),s.push(0,0,0),a[f]===void 0&&(a[f]=[]),a[f].push(r.length/3-1)}t.setAttribute("position",new fe(r,3)),t.setAttribute("color",new fe(s,3)),super(t,i),this.type="CameraHelper",this.camera=e,this.camera.updateProjectionMatrix&&this.camera.updateProjectionMatrix(),this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.pointMap=a,this.update();const c=new oe(16755200),h=new oe(16711680),d=new oe(43775),u=new oe(16777215),p=new oe(3355443);this.setColors(c,h,d,u,p)}setColors(e,t,i,r,s){const a=this.geometry.getAttribute("color");a.setXYZ(0,e.r,e.g,e.b),a.setXYZ(1,e.r,e.g,e.b),a.setXYZ(2,e.r,e.g,e.b),a.setXYZ(3,e.r,e.g,e.b),a.setXYZ(4,e.r,e.g,e.b),a.setXYZ(5,e.r,e.g,e.b),a.setXYZ(6,e.r,e.g,e.b),a.setXYZ(7,e.r,e.g,e.b),a.setXYZ(8,e.r,e.g,e.b),a.setXYZ(9,e.r,e.g,e.b),a.setXYZ(10,e.r,e.g,e.b),a.setXYZ(11,e.r,e.g,e.b),a.setXYZ(12,e.r,e.g,e.b),a.setXYZ(13,e.r,e.g,e.b),a.setXYZ(14,e.r,e.g,e.b),a.setXYZ(15,e.r,e.g,e.b),a.setXYZ(16,e.r,e.g,e.b),a.setXYZ(17,e.r,e.g,e.b),a.setXYZ(18,e.r,e.g,e.b),a.setXYZ(19,e.r,e.g,e.b),a.setXYZ(20,e.r,e.g,e.b),a.setXYZ(21,e.r,e.g,e.b),a.setXYZ(22,e.r,e.g,e.b),a.setXYZ(23,e.r,e.g,e.b),a.setXYZ(24,t.r,t.g,t.b),a.setXYZ(25,t.r,t.g,t.b),a.setXYZ(26,t.r,t.g,t.b),a.setXYZ(27,t.r,t.g,t.b),a.setXYZ(28,t.r,t.g,t.b),a.setXYZ(29,t.r,t.g,t.b),a.setXYZ(30,t.r,t.g,t.b),a.setXYZ(31,t.r,t.g,t.b),a.setXYZ(32,i.r,i.g,i.b),a.setXYZ(33,i.r,i.g,i.b),a.setXYZ(34,i.r,i.g,i.b),a.setXYZ(35,i.r,i.g,i.b),a.setXYZ(36,i.r,i.g,i.b),a.setXYZ(37,i.r,i.g,i.b),a.setXYZ(38,r.r,r.g,r.b),a.setXYZ(39,r.r,r.g,r.b),a.setXYZ(40,s.r,s.g,s.b),a.setXYZ(41,s.r,s.g,s.b),a.setXYZ(42,s.r,s.g,s.b),a.setXYZ(43,s.r,s.g,s.b),a.setXYZ(44,s.r,s.g,s.b),a.setXYZ(45,s.r,s.g,s.b),a.setXYZ(46,s.r,s.g,s.b),a.setXYZ(47,s.r,s.g,s.b),a.setXYZ(48,s.r,s.g,s.b),a.setXYZ(49,s.r,s.g,s.b),a.needsUpdate=!0}update(){const e=this.geometry,t=this.pointMap,i=1,r=1;ct.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse),ut("c",t,e,ct,0,0,-1),ut("t",t,e,ct,0,0,1),ut("n1",t,e,ct,-i,-r,-1),ut("n2",t,e,ct,i,-r,-1),ut("n3",t,e,ct,-i,r,-1),ut("n4",t,e,ct,i,r,-1),ut("f1",t,e,ct,-i,-r,1),ut("f2",t,e,ct,i,-r,1),ut("f3",t,e,ct,-i,r,1),ut("f4",t,e,ct,i,r,1),ut("u1",t,e,ct,i*.7,r*1.1,-1),ut("u2",t,e,ct,-i*.7,r*1.1,-1),ut("u3",t,e,ct,0,r*2,-1),ut("cf1",t,e,ct,-i,0,1),ut("cf2",t,e,ct,i,0,1),ut("cf3",t,e,ct,0,-r,1),ut("cf4",t,e,ct,0,r,1),ut("cn1",t,e,ct,-i,0,-1),ut("cn2",t,e,ct,i,0,-1),ut("cn3",t,e,ct,0,-r,-1),ut("cn4",t,e,ct,0,r,-1),e.getAttribute("position").needsUpdate=!0}dispose(){this.geometry.dispose(),this.material.dispose()}}function ut(n,e,t,i,r,s,a){ea.set(r,s,a).unproject(i);const o=e[n];if(o!==void 0){const l=t.getAttribute("position");for(let c=0,h=o.length;c<h;c++)l.setXYZ(o[c],ea.x,ea.y,ea.z)}}const ta=new xi;class j_ extends Mi{constructor(e,t=16776960){const i=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),r=new Float32Array(24),s=new Re;s.setIndex(new Pe(i,1)),s.setAttribute("position",new Pe(r,3)),super(s,new Et({color:t,toneMapped:!1})),this.object=e,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update()}update(e){if(e!==void 0&&console.warn("THREE.BoxHelper: .update() has no longer arguments."),this.object!==void 0&&ta.setFromObject(this.object),ta.isEmpty())return;const t=ta.min,i=ta.max,r=this.geometry.attributes.position,s=r.array;s[0]=i.x,s[1]=i.y,s[2]=i.z,s[3]=t.x,s[4]=i.y,s[5]=i.z,s[6]=t.x,s[7]=t.y,s[8]=i.z,s[9]=i.x,s[10]=t.y,s[11]=i.z,s[12]=i.x,s[13]=i.y,s[14]=t.z,s[15]=t.x,s[16]=i.y,s[17]=t.z,s[18]=t.x,s[19]=t.y,s[20]=t.z,s[21]=i.x,s[22]=t.y,s[23]=t.z,r.needsUpdate=!0,this.geometry.computeBoundingSphere()}setFromObject(e){return this.object=e,this.update(),this}copy(e,t){return super.copy(e,t),this.object=e.object,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class q_ extends Mi{constructor(e,t=16776960){const i=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),r=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],s=new Re;s.setIndex(new Pe(i,1)),s.setAttribute("position",new fe(r,3)),super(s,new Et({color:t,toneMapped:!1})),this.box=e,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(e){const t=this.box;t.isEmpty()||(t.getCenter(this.position),t.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(e))}dispose(){this.geometry.dispose(),this.material.dispose()}}class Y_ extends oi{constructor(e,t=1,i=16776960){const r=i,s=[1,-1,0,-1,1,0,-1,-1,0,1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0],a=new Re;a.setAttribute("position",new fe(s,3)),a.computeBoundingSphere(),super(a,new Et({color:r,toneMapped:!1})),this.type="PlaneHelper",this.plane=e,this.size=t;const o=[1,1,0,-1,1,0,-1,-1,0,1,1,0,-1,-1,0,1,-1,0],l=new Re;l.setAttribute("position",new fe(o,3)),l.computeBoundingSphere(),this.add(new at(l,new At({color:r,opacity:.2,transparent:!0,depthWrite:!1,toneMapped:!1})))}updateMatrixWorld(e){this.position.set(0,0,0),this.scale.set(.5*this.size,.5*this.size,1),this.lookAt(this.plane.normal),this.translateZ(-this.plane.constant),super.updateMatrixWorld(e)}dispose(){this.geometry.dispose(),this.material.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}}const Oh=new E;let ia,Io;class Z_ extends Ke{constructor(e=new E(0,0,1),t=new E(0,0,0),i=1,r=16776960,s=i*.2,a=s*.2){super(),this.type="ArrowHelper",ia===void 0&&(ia=new Re,ia.setAttribute("position",new fe([0,0,0,0,1,0],3)),Io=new ps(0,.5,1,5,1),Io.translate(0,-.5,0)),this.position.copy(t),this.line=new oi(ia,new Et({color:r,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new at(Io,new At({color:r,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(e),this.setLength(i,s,a)}setDirection(e){if(e.y>.99999)this.quaternion.set(0,0,0,1);else if(e.y<-.99999)this.quaternion.set(1,0,0,0);else{Oh.set(e.z,0,-e.x).normalize();const t=Math.acos(e.y);this.quaternion.setFromAxisAngle(Oh,t)}}setLength(e,t=e*.2,i=t*.2){this.line.scale.set(1,Math.max(1e-4,e-t),1),this.line.updateMatrix(),this.cone.scale.set(i,t,i),this.cone.position.y=e,this.cone.updateMatrix()}setColor(e){this.line.material.color.set(e),this.cone.material.color.set(e)}copy(e){return super.copy(e,!1),this.line.copy(e.line),this.cone.copy(e.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}class J_ extends Mi{constructor(e=1){const t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],i=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],r=new Re;r.setAttribute("position",new fe(t,3)),r.setAttribute("color",new fe(i,3));const s=new Et({vertexColors:!0,toneMapped:!1});super(r,s),this.type="AxesHelper"}setColors(e,t,i){const r=new oe,s=this.geometry.attributes.color.array;return r.set(e),r.toArray(s,0),r.toArray(s,3),r.set(t),r.toArray(s,6),r.toArray(s,9),r.set(i),r.toArray(s,12),r.toArray(s,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class K_{constructor(){this.type="ShapePath",this.color=new oe,this.subPaths=[],this.currentPath=null}moveTo(e,t){return this.currentPath=new qs,this.subPaths.push(this.currentPath),this.currentPath.moveTo(e,t),this}lineTo(e,t){return this.currentPath.lineTo(e,t),this}quadraticCurveTo(e,t,i,r){return this.currentPath.quadraticCurveTo(e,t,i,r),this}bezierCurveTo(e,t,i,r,s,a){return this.currentPath.bezierCurveTo(e,t,i,r,s,a),this}splineThru(e){return this.currentPath.splineThru(e),this}toShapes(e){function t(m){const _=[];for(let y=0,x=m.length;y<x;y++){const w=m[y],A=new Er;A.curves=w.curves,_.push(A)}return _}function i(m,_){const y=_.length;let x=!1;for(let w=y-1,A=0;A<y;w=A++){let C=_[w],P=_[A],M=P.x-C.x,T=P.y-C.y;if(Math.abs(T)>Number.EPSILON){if(T<0&&(C=_[A],M=-M,P=_[w],T=-T),m.y<C.y||m.y>P.y)continue;if(m.y===C.y){if(m.x===C.x)return!0}else{const F=T*(m.x-C.x)-M*(m.y-C.y);if(F===0)return!0;if(F<0)continue;x=!x}}else{if(m.y!==C.y)continue;if(P.x<=m.x&&m.x<=C.x||C.x<=m.x&&m.x<=P.x)return!0}}return x}const r=gi.isClockWise,s=this.subPaths;if(s.length===0)return[];let a,o,l;const c=[];if(s.length===1)return o=s[0],l=new Er,l.curves=o.curves,c.push(l),c;let h=!r(s[0].getPoints());h=e?!h:h;const d=[],u=[];let p=[],f=0,v;u[f]=void 0,p[f]=[];for(let m=0,_=s.length;m<_;m++)o=s[m],v=o.getPoints(),a=r(v),a=e?!a:a,a?(!h&&u[f]&&f++,u[f]={s:new Er,p:v},u[f].s.curves=o.curves,h&&f++,p[f]=[]):p[f].push({h:o,p:v[0]});if(!u[0])return t(s);if(u.length>1){let m=!1,_=0;for(let y=0,x=u.length;y<x;y++)d[y]=[];for(let y=0,x=u.length;y<x;y++){const w=p[y];for(let A=0;A<w.length;A++){const C=w[A];let P=!0;for(let M=0;M<u.length;M++)i(C.p,u[M].p)&&(y!==M&&_++,P?(P=!1,d[M].push(C)):m=!0);P&&d[y].push(C)}}_>0&&m===!1&&(p=d)}let g;for(let m=0,_=u.length;m<_;m++){l=u[m].s,c.push(l),g=p[m];for(let y=0,x=g.length;y<x;y++)l.holes.push(g[y].h)}return c}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"158"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="158");const Qd=Object.freeze(Object.defineProperty({__proto__:null,ACESFilmicToneMapping:vu,AddEquation:Zi,AddOperation:pu,AdditiveAnimationBlendMode:Cl,AdditiveBlending:vi,AlphaFormat:bu,AlwaysCompare:Gu,AlwaysDepth:au,AlwaysStencilFunc:hl,AmbientLight:Gd,AnimationAction:Kd,AnimationClip:Qs,AnimationLoader:$y,AnimationMixer:A_,AnimationObjectGroup:E_,AnimationUtils:Yy,ArcCurve:pd,ArrayCamera:sd,ArrowHelper:Z_,AttachedBindMode:zo,Audio:Zd,AudioAnalyser:f_,AudioContext:Ql,AudioListener:d_,AudioLoader:c_,AxesHelper:J_,BackSide:Bt,BasicDepthPacking:Iu,BasicShadowMap:pp,Bone:kl,BooleanKeyframeTrack:Ir,Box2:N_,Box3:xi,Box3Helper:q_,BoxGeometry:Lr,BoxHelper:j_,BufferAttribute:Pe,BufferGeometry:Re,BufferGeometryLoader:qd,ByteType:xu,Cache:Cr,Camera:Sa,CameraHelper:X_,CanvasTexture:yy,CapsuleGeometry:Pa,CatmullRomCurve3:md,CineonToneMapping:gu,CircleGeometry:Ia,ClampToEdgeWrapping:It,Clock:Yd,Color:oe,ColorKeyframeTrack:Jl,ColorManagement:Qe,CompressedArrayTexture:gy,CompressedCubeTexture:vy,CompressedTexture:Ca,CompressedTextureLoader:Qy,ConeGeometry:Da,ConstantAlphaFactor:ru,ConstantColorFactor:tu,CubeCamera:Ju,CubeReflectionMapping:Oi,CubeRefractionMapping:Qi,CubeTexture:nn,CubeTextureLoader:e_,CubeUVReflectionMapping:hs,CubicBezierCurve:Gl,CubicBezierCurve3:fd,CubicInterpolant:Ud,CullFaceBack:Do,CullFaceFront:Gh,CullFaceFrontBack:dp,CullFaceNone:Hh,Curve:ci,CurvePath:vd,CustomBlending:Vh,CustomToneMapping:yu,CylinderGeometry:ps,Cylindrical:U_,Data3DTexture:Dl,DataArrayTexture:Ma,DataTexture:ns,DataTextureLoader:t_,DataUtils:bm,DecrementStencilOp:Ep,DecrementWrapStencilOp:Ap,DefaultLoadingManager:Fd,DepthFormat:Ki,DepthStencilFormat:Tr,DepthTexture:nd,DetachedBindMode:_u,DirectionalLight:Hd,DirectionalLightHelper:W_,DiscreteInterpolant:Nd,DisplayP3ColorSpace:xa,DodecahedronGeometry:Ua,DoubleSide:pi,DstAlphaFactor:Jh,DstColorFactor:$h,DynamicCopyUsage:Gp,DynamicDrawUsage:Op,DynamicReadUsage:Bp,EdgesGeometry:yd,EllipseCurve:La,EqualCompare:Fu,EqualDepth:lu,EqualStencilFunc:Pp,EquirectangularReflectionMapping:Us,EquirectangularRefractionMapping:Ns,Euler:sn,EventDispatcher:ki,ExtrudeGeometry:Oa,FileLoader:Bi,Float16BufferAttribute:Rm,Float32BufferAttribute:fe,Float64BufferAttribute:Cm,FloatType:mi,Fog:Pr,FogExp2:Ta,FramebufferTexture:fy,FrontSide:Ni,Frustum:wa,GLBufferAttribute:P_,GLSL1:Wp,GLSL3:ul,GreaterCompare:Bu,GreaterDepth:hu,GreaterEqualCompare:Hu,GreaterEqualDepth:cu,GreaterEqualStencilFunc:Np,GreaterStencilFunc:Dp,GridHelper:G_,Group:Pi,HalfFloatType:as,HemisphereLight:zd,HemisphereLightHelper:H_,IcosahedronGeometry:Fa,ImageBitmapLoader:l_,ImageLoader:en,ImageUtils:Il,IncrementStencilOp:wp,IncrementWrapStencilOp:Tp,InstancedBufferAttribute:cs,InstancedBufferGeometry:jd,InstancedInterleavedBuffer:L_,InstancedMesh:ud,Int16BufferAttribute:Tm,Int32BufferAttribute:Am,Int8BufferAttribute:Sm,IntType:Sl,InterleavedBuffer:Aa,InterleavedBufferAttribute:Ar,Interpolant:hn,InterpolateDiscrete:zs,InterpolateLinear:Bs,InterpolateSmooth:la,InvertStencilOp:Rp,KeepStencilOp:gr,KeyframeTrack:hi,LOD:cd,LatheGeometry:ln,Layers:ba,LessCompare:Ou,LessDepth:ou,LessEqualCompare:zu,LessEqualDepth:Ds,LessEqualStencilFunc:Ip,LessStencilFunc:Lp,Light:sr,LightProbe:Xd,Line:oi,Line3:O_,LineBasicMaterial:Et,LineCurve:Vl,LineCurve3:gd,LineDashedMaterial:Pd,LineLoop:dd,LineSegments:Mi,LinearDisplayP3ColorSpace:rn,LinearEncoding:Ll,LinearFilter:pt,LinearInterpolant:Zl,LinearMipMapLinearFilter:yp,LinearMipMapNearestFilter:vp,LinearMipmapLinearFilter:er,LinearMipmapNearestFilter:bl,LinearSRGBColorSpace:yi,LinearToneMapping:mu,LinearTransfer:Hs,Loader:Xt,LoaderUtils:_l,LoadingManager:Kl,LoopOnce:Cu,LoopPingPong:Pu,LoopRepeat:Lu,LuminanceAlphaFormat:wu,LuminanceFormat:Su,MOUSE:hp,Material:Ut,MaterialLoader:Wa,MathUtils:sm,Matrix3:Ge,Matrix4:Fe,MaxEquation:Fo,Mesh:at,MeshBasicMaterial:At,MeshDepthMaterial:Fl,MeshDistanceMaterial:zl,MeshLambertMaterial:Cd,MeshMatcapMaterial:Ld,MeshNormalMaterial:Rd,MeshPhongMaterial:Td,MeshPhysicalMaterial:Ed,MeshStandardMaterial:ql,MeshToonMaterial:Ad,MinEquation:Oo,MirroredRepeatWrapping:Fs,MixOperation:du,MultiplyBlending:No,MultiplyOperation:tn,NearestFilter:dt,NearestMipMapLinearFilter:gp,NearestMipMapNearestFilter:fp,NearestMipmapLinearFilter:Rs,NearestMipmapNearestFilter:da,NeverCompare:Nu,NeverDepth:nu,NeverStencilFunc:Cp,NoBlending:Ii,NoColorSpace:Jt,NoToneMapping:Di,NormalAnimationBlendMode:_a,NormalBlending:Sr,NotEqualCompare:ku,NotEqualDepth:uu,NotEqualStencilFunc:Up,NumberKeyframeTrack:Ks,Object3D:Ke,ObjectLoader:a_,ObjectSpaceNormalMap:Uu,OctahedronGeometry:cn,OneFactor:qh,OneMinusConstantAlphaFactor:su,OneMinusConstantColorFactor:iu,OneMinusDstAlphaFactor:Kh,OneMinusDstColorFactor:Qh,OneMinusSrcAlphaFactor:ua,OneMinusSrcColorFactor:Zh,OrthographicCamera:tr,P3Primaries:Vs,PCFShadowMap:Ml,PCFSoftShadowMap:ga,PMREMGenerator:pl,Path:qs,PerspectiveCamera:yt,Plane:Yi,PlaneGeometry:an,PlaneHelper:Y_,PointLight:kd,PointLightHelper:B_,Points:_i,PointsMaterial:on,PolarGridHelper:V_,PolyhedronGeometry:rr,PositionalAudio:m_,PropertyBinding:Ye,PropertyMixer:Jd,QuadraticBezierCurve:Wl,QuadraticBezierCurve3:Xl,Quaternion:Vt,QuaternionKeyframeTrack:ms,QuaternionLinearInterpolant:Od,RED_GREEN_RGTC2_Format:ll,RED_RGTC1_Format:Ru,REVISION:"158",RGBADepthPacking:Du,RGBAFormat:Zt,RGBAIntegerFormat:Rl,RGBA_ASTC_10x10_Format:il,RGBA_ASTC_10x5_Format:Qo,RGBA_ASTC_10x6_Format:el,RGBA_ASTC_10x8_Format:tl,RGBA_ASTC_12x10_Format:rl,RGBA_ASTC_12x12_Format:sl,RGBA_ASTC_4x4_Format:Xo,RGBA_ASTC_5x4_Format:jo,RGBA_ASTC_5x5_Format:qo,RGBA_ASTC_6x5_Format:Yo,RGBA_ASTC_6x6_Format:Zo,RGBA_ASTC_8x5_Format:Jo,RGBA_ASTC_8x6_Format:Ko,RGBA_ASTC_8x8_Format:$o,RGBA_BPTC_Format:oa,RGBA_ETC2_EAC_Format:Wo,RGBA_PVRTC_2BPPV1_Format:Go,RGBA_PVRTC_4BPPV1_Format:Ho,RGBA_S3TC_DXT1_Format:sa,RGBA_S3TC_DXT3_Format:na,RGBA_S3TC_DXT5_Format:aa,RGB_BPTC_SIGNED_Format:nl,RGB_BPTC_UNSIGNED_Format:al,RGB_ETC1_Format:Au,RGB_ETC2_Format:Vo,RGB_PVRTC_2BPPV1_Format:ko,RGB_PVRTC_4BPPV1_Format:Bo,RGB_S3TC_DXT1_Format:ra,RGFormat:Tu,RGIntegerFormat:Al,RawShaderMaterial:wd,Ray:us,Raycaster:I_,Rec709Primaries:Gs,RectAreaLight:Vd,RedFormat:Eu,RedIntegerFormat:Tl,ReinhardToneMapping:fu,RenderTarget:ju,RepeatWrapping:Os,ReplaceStencilOp:Sp,ReverseSubtractEquation:Xh,RingGeometry:za,SIGNED_RED_GREEN_RGTC2_Format:cl,SIGNED_RED_RGTC1_Format:ol,SRGBColorSpace:Mt,SRGBTransfer:nt,Scene:zi,ShaderChunk:Be,ShaderLib:ni,ShaderMaterial:Dt,ShadowMaterial:Sd,Shape:Er,ShapeGeometry:Ba,ShapePath:K_,ShapeUtils:gi,ShortType:Mu,Skeleton:Ra,SkeletonHelper:z_,SkinnedMesh:hd,Source:Mr,Sphere:li,SphereGeometry:Wt,Spherical:D_,SphericalHarmonics3:Wd,SplineCurve:jl,SpotLight:Bd,SpotLightHelper:F_,Sprite:ld,SpriteMaterial:Bl,SrcAlphaFactor:ha,SrcAlphaSaturateFactor:eu,SrcColorFactor:Yh,StaticCopyUsage:Hp,StaticDrawUsage:Ws,StaticReadUsage:zp,StereoCamera:h_,StreamCopyUsage:Vp,StreamDrawUsage:Fp,StreamReadUsage:kp,StringKeyframeTrack:Dr,SubtractEquation:Wh,SubtractiveBlending:Uo,TOUCH:up,TangentSpaceNormalMap:ir,TetrahedronGeometry:ka,Texture:mt,TextureLoader:i_,TorusGeometry:Ha,TorusKnotGeometry:Ga,Triangle:Ht,TriangleFanDrawMode:Mp,TriangleStripDrawMode:xp,TrianglesDrawMode:_p,TubeGeometry:Va,TwoPassDoubleSide:mp,UVMapping:va,Uint16BufferAttribute:Ul,Uint32BufferAttribute:Nl,Uint8BufferAttribute:wm,Uint8ClampedBufferAttribute:Em,Uniform:ic,UniformsGroup:C_,UniformsLib:de,UniformsUtils:Zu,UnsignedByteType:Ui,UnsignedInt248Type:Ji,UnsignedIntType:Li,UnsignedShort4444Type:wl,UnsignedShort5551Type:El,UnsignedShortType:ya,VSMShadowMap:di,Vector2:q,Vector3:E,Vector4:et,VectorKeyframeTrack:$s,VideoTexture:my,WebGL1Renderer:ad,WebGL3DRenderTarget:hm,WebGLArrayRenderTarget:cm,WebGLCoordinateSystem:fi,WebGLCubeRenderTarget:Ku,WebGLMultipleRenderTargets:um,WebGLRenderTarget:ai,WebGLRenderer:Fi,WebGLUtils:rd,WebGPUCoordinateSystem:Xs,WireframeGeometry:bd,WrapAroundEnding:ks,ZeroCurvatureEnding:_r,ZeroFactor:jh,ZeroSlopeEnding:xr,ZeroStencilOp:bp,_SRGBAFormat:pa,createCanvasElement:Xu,sRGBEncoding:$i},Symbol.toStringTag,{value:"Module"}));(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))t(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&t(s)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function t(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();const si={APP_NAME:"Carlos Orbegoso Portfolio",VERSION:"2.0.0",DEBUG:!1,LOGGING:{LEVEL:"warn",SHOW_TIMESTAMPS:!0,SHOW_PREFIX:!0,CONSOLE_OUTPUT:!0},ANIMATIONS:{ENABLED:!0,DURATION:{FAST:200,NORMAL:400,SLOW:800},EASING:{FAST:"ease",NORMAL:"cubic-bezier(0.4, 0, 0.2, 1)",SLOW:"cubic-bezier(0.4, 0, 0.2, 1)"}},THREE_JS:{ENABLED:!0,PERFORMANCE:{MOBILE:"low",TABLET:"medium",DESKTOP:"high"},PARTICLES:{COUNT:{MOBILE:100,TABLET:200,DESKTOP:500}}},LANGUAGES:{DEFAULT:"en",SUPPORTED:["en","es"],FALLBACK:"en"},THEMES:{DEFAULT:"light",SUPPORTED:["light","dark"],AUTO_DETECT:!0},BREAKPOINTS:{MOBILE:768,TABLET:1024,DESKTOP:1200},API:{BASE_URL:"",TIMEOUT:5e3,RETRY_ATTEMPTS:3},NOTIFICATIONS:{AUTO_HIDE:!0,DURATION:5e3,POSITION:"top-right",MAX_VISIBLE:3},SCROLL:{SMOOTH:!0,OFFSET:80,THROTTLE:100},PERFORMANCE:{LAZY_LOADING:!0,DEBOUNCE_DELAY:300,THROTTLE_DELAY:100,CLEANUP_INTERVAL:3e4}};class $_{constructor(){this.prefix="[Portfolio]",this.logLevel="warn"}formatMessage(e,t){const i=new Date().toLocaleTimeString();return`${this.prefix} [${i}] [${e.toUpperCase()}] ${t}`}shouldLog(e){const t={error:0,warn:1,info:2,debug:3};return t[e]<=t[this.logLevel]}error(e,t=null){const i=this.formatMessage("error",e);console.error(i,t)}warn(e,t=null){const i=this.formatMessage("warn",e);console.warn(i,t)}info(e,t=null){if(this.shouldLog("info")){const i=this.formatMessage("info",e);console.info(i,t)}}debug(e,t=null){if(this.shouldLog("debug")){const i=this.formatMessage("debug",e);console.debug(i,t)}}performance(e,t=null){if(this.shouldLog("info")){const i=this.formatMessage("perf",e);console.log(i,t)}}animation(e,t=null){if(this.shouldLog("info")){const i=this.formatMessage("anim",e);console.log(i,t)}}threejs(e,t=null){if(this.shouldLog("info")){const i=this.formatMessage("three",e);console.log(i,t)}}setLogLevel(e){this.logLevel=e}}const qi=new $_,Je={error:(n,e)=>qi.error(n,e),warn:(n,e)=>qi.warn(n,e),info:(n,e)=>qi.info(n,e),debug:(n,e)=>qi.debug(n,e),performance:(n,e)=>qi.performance(n,e),animation:(n,e)=>qi.animation(n,e),threejs:(n,e)=>qi.threejs(n,e),setLogLevel:n=>qi.setLogLevel(n)},st={select(n,e=document){return e.querySelector(n)},selectAll(n,e=document){return e.querySelectorAll(n)},create(n,e={},t=""){const i=document.createElement(n);return Object.entries(e).forEach(([r,s])=>{r==="className"?i.className=s:r==="textContent"?i.textContent=s:i.setAttribute(r,s)}),t&&(i.innerHTML=t),i},addClasses(n,...e){n.classList.add(...e)},removeClasses(n,...e){n.classList.remove(...e)},toggleClass(n,e,t){n.classList.toggle(e,t)}},Pt={on(n,e,t,i={}){n.addEventListener(e,t,i)},off(n,e,t){n.removeEventListener(e,t)},trigger(n,e,t={}){const i=new CustomEvent(e,{detail:t});n.dispatchEvent(i)}},Fh={debounce(n,e=si.PERFORMANCE.DEBOUNCE_DELAY){let t;return function(...i){clearTimeout(t),t=setTimeout(()=>n.apply(this,i),e)}},throttle(n,e=si.PERFORMANCE.THROTTLE_DELAY){let t=0;return function(...i){const r=Date.now();r-t>=e&&(t=r,n.apply(this,i))}},measureTime(n,e="Function execution"){performance.now();const t=n();return performance.now(),t}};class Q_{constructor(e){this.scene=e,this.particles=[],this.currentTheme="light",this.performanceMode="high",this.createParticles()}createParticles(){const e=this.performanceMode==="high"?80:40;for(let t=0;t<e;t++){const i={mesh:new at(new Wt(1+Math.random()*2,8,8),new At({color:new oe().setHSL(Math.random()*.3+.6,.8,.7+Math.random()*.3),transparent:!0,opacity:.3+Math.random()*.4})),velocity:new E((Math.random()-.5)*2,(Math.random()-.5)*1.5,(Math.random()-.5)*2),life:Math.random()*120+60,maxLife:Math.random()*120+60,originalPosition:new E,rotationSpeed:(Math.random()-.5)*.02,pulseSpeed:Math.random()*.05+.02},r=t/e*Math.PI*4,s=200+Math.random()*600,a=(Math.random()-.5)*800;i.mesh.position.set(Math.cos(r)*s,a,Math.sin(r)*s),i.originalPosition.copy(i.mesh.position),this.particles.push(i),this.scene.add(i.mesh)}}animate(e){this.particles.forEach((t,i)=>{t.mesh.position.add(t.velocity),t.life--,t.life<=0&&(t.life=t.maxLife,t.mesh.position.copy(t.originalPosition),t.mesh.position.add(new E((Math.random()-.5)*100,(Math.random()-.5)*100,(Math.random()-.5)*100)));const r=1+Math.sin(e*t.pulseSpeed+i*.1)*.1;t.mesh.scale.setScalar(r),t.mesh.material.opacity=.5+Math.sin(e+t.life*.05)*.2;const s=(e*.05+i*.01)%1,a=new oe().setHSL(s,.7,.6);t.mesh.material.color.lerp(a,.005)})}updateTheme(e){this.currentTheme=e;const t=e==="dark";this.particles.forEach(i=>{const r=t?.6:.5;i.mesh.material.color.setHSL(r,.8,.7)})}updateScroll(e){this.particles.forEach(t=>{const i=e*100;t.mesh.position.z=t.mesh.position.z+i*.01,t.mesh.position.z>1e3&&(t.mesh.position.z=-1e3)})}setPerformanceMode(e){this.performanceMode=e,e==="low"?this.particles.forEach(t=>{t.mesh.visible=!1}):this.particles.forEach(t=>{t.mesh.visible=!0})}dispose(){this.particles.forEach(e=>{e.mesh.geometry&&e.mesh.geometry.dispose(),e.mesh.material&&e.mesh.material.dispose(),this.scene.remove(e.mesh)}),this.particles=[]}}class ex{constructor(e){this.scene=e,this.constellations=[],this.currentTheme="light",this.performanceMode="high",this.createConstellations()}createConstellations(){const e=this.performanceMode==="high"?8:6;for(let t=0;t<e;t++){const i={stars:[],connections:[],center:new E((Math.random()-.5)*1600,(Math.random()-.5)*1e3,(Math.random()-.5)*800),section:t,pulsePhase:Math.random()*Math.PI*2},r=Math.floor(Math.random()*6)+4,s=[];for(let a=0;a<r;a++){const o=new at(new Wt(2+Math.random()*2,8,8),new At({color:new oe().setHSL(.6+Math.random()*.1,.7,.6+Math.random()*.3),transparent:!0,opacity:.6+Math.random()*.3}));let l;if(a===0)l=i.center.clone();else{const c=a/r*Math.PI*2,h=80+Math.random()*120;l=i.center.clone().add(new E(Math.cos(c)*h,Math.sin(c)*h*.5,(Math.random()-.5)*100))}o.position.copy(l),s.push(l),i.stars.push(o),this.scene.add(o)}for(let a=0;a<s.length;a++)for(let o=a+1;o<s.length;o++)if(s[a].distanceTo(s[o])<150){const l=this.createConnection(s[a],s[o]);i.connections.push(l),this.scene.add(l)}this.constellations.push(i)}}createConnection(e,t){const i=new Re().setFromPoints([e,t]),r=new Et({color:6600182,transparent:!0,opacity:.4});return new oi(i,r)}animate(e){this.constellations.forEach((t,i)=>{const r=t.section*.4;t.stars.forEach((s,a)=>{const o=a*.3,l=r+o;s.position.y+=Math.sin(e+l)*.3,s.rotation.x+=.008,s.rotation.y+=.006,s.rotation.z+=.004;const c=Math.sin(e*.8+l)*.08;s.scale.setScalar(1+c);const h=Math.sin(e*3+a*.4)*.3+.7;s.material.opacity=.6+h*.3;const d=(e*.03+a*.1)%1,u=new oe().setHSL(d,.6,.7);s.material.color.lerp(u,.003)}),t.connections.forEach((s,a)=>{const o=a*.2,l=Math.sin(e*2+o)*.3+.7;s.material.opacity=.3+l*.3;const c=Math.sin(e*1.5+a*.2)*.15+1;s.scale.setScalar(c)})})}updateTheme(e){this.currentTheme=e;const t=e==="dark";this.constellations.forEach(i=>{i.stars.forEach(r=>{const s=t?.6:.5;r.material.color.setHSL(s,.8,.7)})})}updateScroll(e){this.constellations.forEach((t,i)=>{const r=document.querySelectorAll("section")[i];if(r){const s=r.getBoundingClientRect(),a=s.top+s.height/2,o=window.innerHeight/2,l=Math.abs(a-o),c=window.innerHeight/2,h=Math.max(0,1-l/c);t.stars.forEach(d=>{d.material.opacity=.3+h*.5;const u=1+h*.1;d.scale.setScalar(u),d.position.x+=e*.5*(Math.random()-.5),d.position.y+=e*.3*(Math.random()-.5)}),t.connections.forEach(d=>{d.material.opacity=.2+h*.2})}})}setPerformanceMode(e){this.performanceMode=e,e==="low"?this.constellations.forEach(t=>{t.stars.forEach(i=>{i.visible=!1})}):this.constellations.forEach(t=>{t.stars.forEach(i=>{i.visible=!0})})}dispose(){this.constellations.forEach(e=>{e.stars.forEach(t=>{t.geometry&&t.geometry.dispose(),t.material&&t.material.dispose(),this.scene.remove(t)}),e.connections.forEach(t=>{t.geometry&&t.geometry.dispose(),t.material&&t.material.dispose(),this.scene.remove(t)})}),this.constellations=[]}}class tx{constructor(e,t){this.scene=e,this.camera=t,this.cursor=null,this.cursorTrail=[],this.currentTheme="light",this.performanceMode="high",this.createCursor()}createCursor(){const e=new Wt(8,16,16),t=new At({color:6600182,transparent:!0,opacity:.8});this.cursor=new at(e,t),this.scene.add(this.cursor),this.cursorTrail=[];for(let i=0;i<10;i++){const r=new at(new Wt(4,8,8),new At({color:6600182,transparent:!0,opacity:.3}));this.cursorTrail.push(r),this.scene.add(r)}}updatePosition(e,t){if(!(!this.cursor||!this.camera))try{const i=new q;i.x=e/window.innerWidth*2-1,i.y=-(t/window.innerHeight)*2+1;const r=new E(i.x,i.y,.5);r.unproject(this.camera);const s=r.sub(this.camera.position).normalize(),a=-this.camera.position.z/s.z,o=this.camera.position.clone().add(s.multiplyScalar(a));this.cursor.position.copy(o),this.updateCursorTrail(o)}catch(i){console.warn("⚠️ Error actualizando posición del cursor:",i)}}updateCursorTrail(e){this.cursorTrail.forEach((t,i)=>{const r=e.clone();r.add(new E((Math.random()-.5)*20,(Math.random()-.5)*20,0)),t.position.lerp(r,.1),t.material.opacity=.3*(1-i/this.cursorTrail.length)})}createClickEffect(e,t){if(this.camera)try{const i=new q;i.x=e/window.innerWidth*2-1,i.y=-(t/window.innerHeight)*2+1;const r=new E(i.x,i.y,.5);r.unproject(this.camera);const s=r.sub(this.camera.position).normalize(),a=-this.camera.position.z/s.z,o=this.camera.position.clone().add(s.multiplyScalar(a));for(let l=0;l<20;l++){const c=new at(new Wt(2,8,8),new At({color:new oe().setHSL(Math.random()*.3+.6,.8,.7),transparent:!0,opacity:.8}));c.position.copy(o),c.velocity=new E((Math.random()-.5)*10,(Math.random()-.5)*10,(Math.random()-.5)*10),c.life=60,this.scene.add(c),setTimeout(()=>{this.scene.remove(c)},1e3)}}catch(i){console.warn("⚠️ Error creando efecto de click:",i)}}animate(e){if(this.cursor){this.cursor.rotation.y+=.03,this.cursor.rotation.x+=.01,this.cursor.material.opacity=.7+Math.sin(e*4)*.2;const t=e*.2%1,i=new oe().setHSL(t,.8,.7);this.cursor.material.color.lerp(i,.01)}}updateTheme(e){this.currentTheme=e;const t=e==="dark";this.cursor&&this.cursor.material.color.setHex(t?6600182:1668818),this.cursorTrail.forEach(i=>{i.material.color.setHex(t?6600182:1668818)})}setPerformanceMode(e){this.performanceMode=e,e==="low"?(this.cursor&&(this.cursor.visible=!1),this.cursorTrail.forEach(t=>{t.visible=!1})):(this.cursor&&(this.cursor.visible=!0),this.cursorTrail.forEach(t=>{t.visible=!0}))}dispose(){this.cursor&&(this.cursor.geometry&&this.cursor.geometry.dispose(),this.cursor.material&&this.cursor.material.dispose(),this.scene.remove(this.cursor)),this.cursorTrail.forEach(e=>{e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose(),this.scene.remove(e)}),this.cursor=null,this.cursorTrail=[]}}class ix{constructor(e){this.scene=e,this.background=null,this.currentTheme="light",this.performanceMode="high",this.createBackground()}createBackground(){const e=new Re,t=this.performanceMode==="high"?1e3:500,i=new Float32Array(t*3),r=new Float32Array(t*3),s=new Float32Array(t);for(let o=0;o<t;o++){i[o*3]=(Math.random()-.5)*2e3,i[o*3+1]=(Math.random()-.5)*2e3,i[o*3+2]=(Math.random()-.5)*2e3;const l=new oe;l.setHSL(Math.random()*.1+.6,.8,Math.random()*.3+.7),r[o*3]=l.r,r[o*3+1]=l.g,r[o*3+2]=l.b,s[o]=Math.random()*3+1}e.setAttribute("position",new Pe(i,3)),e.setAttribute("color",new Pe(r,3)),e.setAttribute("size",new Pe(s,1));const a=new on({size:2,vertexColors:!0,transparent:!0,opacity:.3});this.background=new _i(e,a),this.scene.add(this.background)}updateTheme(e){if(this.currentTheme=e,this.background){const t=e==="dark"?.6:.5,i=this.background.geometry.attributes.color;for(let r=0;r<i.count;r++){const s=new oe;s.setHSL(t+Math.random()*.1,.8,Math.random()*.3+.7),i.setXYZ(r,s.r,s.g,s.b)}i.needsUpdate=!0}}updateScroll(e){this.background&&(this.background.rotation.y=e*Math.PI*.1,this.background.position.y=e*50)}setPerformanceMode(e){this.performanceMode=e,e==="low"?this.background&&(this.background.visible=!1):this.background&&(this.background.visible=!0)}dispose(){this.background&&(this.background.geometry&&this.background.geometry.dispose(),this.background.material&&this.background.material.dispose(),this.scene.remove(this.background)),this.background=null}}class rx{constructor(){this.isInitialized=!1,this.currentTheme="light",this.performanceMode="high",this.particleSystem=null,this.constellationSystem=null,this.cursorSystem=null,this.backgroundSystem=null,this.scene=null,this.camera=null,this.renderer=null,this.init()}init(){return xt(this,null,function*(){try{this.createScene(),this.createCamera(),this.createRenderer(),this.backgroundSystem=new ix(this.scene),this.particleSystem=new Q_(this.scene);try{yield this.initializeConstellationSystem()}catch(e){console.error("❌ Error inicializando ConstellationSystem:",e)}this.cursorSystem=new tx(this.scene,this.camera),this.addEventListeners(),this.animate(),this.isInitialized=!0}catch(e){console.error("❌ Error inicializando motor visual:",e)}})}initializeConstellationSystem(){return xt(this,null,function*(){yield new Promise(e=>setTimeout(e,50)),this.constellationSystem=new ex(this.scene)})}createScene(){this.scene=new zi,this.scene.fog=new Pr(0,1e3,2e3)}createCamera(){this.camera=new yt(75,window.innerWidth/window.innerHeight,.1,2e3),this.camera.position.set(0,0,500)}createRenderer(){this.renderer=new Fi({antialias:!0,alpha:!0}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setClearColor(0,0),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));const e=document.getElementById("visual-effects-container");e&&e.appendChild(this.renderer.domElement)}addEventListeners(){window.addEventListener("resize",()=>this.onWindowResize()),document.addEventListener("mousemove",e=>{this.cursorSystem&&this.cursorSystem.updatePosition(e.clientX,e.clientY)}),document.addEventListener("click",e=>{this.cursorSystem&&this.cursorSystem.createClickEffect(e.clientX,e.clientY)})}animate(){if(requestAnimationFrame(()=>this.animate()),!this.isInitialized)return;const e=Date.now()*.001;this.particleSystem&&this.particleSystem.animate(e),this.constellationSystem&&this.constellationSystem.animate(e),this.cursorSystem&&this.cursorSystem.animate(e),this.renderer.render(this.scene,this.camera)}updateTheme(e){this.currentTheme=e,this.particleSystem&&this.particleSystem.updateTheme(e),this.constellationSystem&&this.constellationSystem.updateTheme(e),this.cursorSystem&&this.cursorSystem.updateTheme(e),this.backgroundSystem&&this.backgroundSystem.updateTheme(e)}updateScrollEffects(){const e=window.pageYOffset,t=document.body.scrollHeight-window.innerHeight,i=e/t;this.backgroundSystem&&this.backgroundSystem.updateScroll(i),this.constellationSystem&&this.constellationSystem.updateScroll(i),this.particleSystem&&this.particleSystem.updateScroll(i)}onWindowResize(){this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight)}setPerformanceMode(e){this.performanceMode=e,this.particleSystem&&this.particleSystem.setPerformanceMode(e),this.constellationSystem&&this.constellationSystem.setPerformanceMode(e),this.cursorSystem&&this.cursorSystem.setPerformanceMode(e)}dispose(){this.particleSystem&&this.particleSystem.dispose(),this.constellationSystem&&this.constellationSystem.dispose(),this.cursorSystem&&this.cursorSystem.dispose(),this.backgroundSystem&&this.backgroundSystem.dispose(),this.renderer&&this.renderer.dispose(),this.isInitialized=!1}}class sx{constructor(){this.components=new Map,this.loadedComponents=new Set}loadComponent(r,s){return xt(this,arguments,function*(e,t,i={}){try{const a=`src/components/${e}.html`,o=yield fetch(a);if(!o.ok)throw new Error(`Error cargando componente: ${e} - Status: ${o.status}`);const l=yield o.text(),c=document.createElement("div");c.innerHTML=l.trim();let h=null;for(let u of c.children)if(u.nodeType===Node.ELEMENT_NODE&&u.tagName!=="SCRIPT"&&u.tagName!=="STYLE"){h=u;break}if(h||(h=c.firstElementChild),!h)throw new Error(`Componente ${e} no tiene elementos hijos válidos`);this.processComponentData(h,i);const d=document.querySelector(t);if(d)d.appendChild(h);else throw new Error(`Target no encontrado: ${t}`);return this.components.set(e,h),this.loadedComponents.add(e),h}catch(a){throw console.error(`❌ Error cargando componente ${e}:`,a),a}})}processComponentData(e,t){Object.keys(t).forEach(i=>{e.querySelectorAll(`[data-bind="${i}"]`).forEach(r=>{r.tagName==="INPUT"||r.tagName==="TEXTAREA"?r.value=t[i]:r.textContent=t[i]})})}loadComponents(e){return xt(this,null,function*(){const t=e.map(i=>this.loadComponent(i.name,i.target,i.data));return Promise.all(t)})}reloadComponent(r,s){return xt(this,arguments,function*(e,t,i={}){const a=this.components.get(e);return a&&a.parentNode&&a.parentNode.removeChild(a),this.components.delete(e),this.loadedComponents.delete(e),this.loadComponent(e,t,i)})}getComponent(e){return this.components.get(e)||null}isComponentLoaded(e){return this.loadedComponents.has(e)}clearComponents(){this.components.forEach(e=>{e.parentNode&&e.parentNode.removeChild(e)}),this.components.clear(),this.loadedComponents.clear()}}const zh=new sx,rc={main:[{name:"Header",target:"body",data:{},order:1},{name:"Hero",target:"#main-content",data:{name:"Carlos Orbegoso",role:"Backend Developer & Java Specialist",company:"Tata Consultancy Services",techStack:["Java","Spring","Quarkus","Angular"]},order:2},{name:"About",target:"#main-content",data:{title:"Sobre Mí",description:"Backend Developer con más de 5 años de experiencia en desarrollo de aplicaciones empresariales robustas y escalables.",image:"src/assets/images/profile.jpeg"},order:3},{name:"Experience",target:"#main-content",data:{title:"Experiencia",experiences:[{period:"2023 - Presente",title:"Senior Backend Developer",company:"Tata Consultancy Services",description:"Desarrollo de microservicios con Spring Boot y Quarkus."},{period:"2021 - 2023",title:"Backend Developer",company:"Tech Solutions Inc.",description:"Desarrollo de APIs RESTful con Spring Framework."}]},order:4},{name:"Skills",target:"#main-content",data:{title:"Habilidades",categories:[{name:"Backend",skills:["Java 11+","Spring Boot","Quarkus","Microservicios"]},{name:"Frontend",skills:["Angular","TypeScript","HTML5/CSS3","JavaScript ES6+"]},{name:"DevOps",skills:["Docker","Kubernetes","Jenkins","AWS"]}]},order:5},{name:"Projects",target:"#main-content",data:{title:"Proyectos",projects:[{name:"E-commerce Microservices",type:"Full Stack - Java + Angular",description:"Microservices architecture for e-commerce platform.",tech:["Java 11","Spring Cloud","Angular","MySQL","Kubernetes"],icon:"fas fa-shopping-cart"},{name:"Hospital Management System",type:"Backend - Quarkus",description:"Comprehensive hospital management system with Quarkus.",tech:["Quarkus","PostgreSQL","JUnit 5","Swagger","Docker"],icon:"fas fa-hospital"}]},order:6},{name:"Contact",target:"#main-content",data:{title:"Let's Connect!",subtitle:"Are you looking for a challenging backend project?",email:"carlos.orbegoso@email.com",linkedin:"linkedin.com/in/carlosorbegoso",github:"github.com/carlosorbegoso"},order:7},{name:"Footer",target:"body",data:{copyright:"© 2024 Carlos Orbegoso. All rights reserved."},order:8}],optional:[],loading:{strategy:"sequential",delay:100,timeout:5e3,retryAttempts:3}};function nx(){return rc.main.sort((n,e)=>n.order-e.order)}function ax(){return rc.optional.filter(n=>n.condition?n.condition():!0)}function ox(){return rc.loading}const rs={light:{mobile:{background:"rgba(255, 255, 255, 0.9)",backdropFilter:"blur(20px)",borderOpacity:.15,shadow:"0 4px 20px rgba(0, 0, 0, 0.12)",borderColor:"rgba(100, 181, 246, 0.15)"},tablet:{background:"rgba(255, 255, 255, 0.6)",backdropFilter:"blur(15px)",borderOpacity:.08,shadow:"0 2px 15px rgba(0, 0, 0, 0.08)",borderColor:"rgba(100, 181, 246, 0.08)"},desktop:{background:"rgba(255, 255, 255, 0.15)",backdropFilter:"blur(6px)",borderOpacity:.02,shadow:"0 1px 8px rgba(0, 0, 0, 0.03)",borderColor:"rgba(100, 181, 246, 0.02)"}},dark:{mobile:{background:"rgba(26, 26, 46, 0.9)",backdropFilter:"blur(20px)",borderOpacity:.2,shadow:"0 4px 20px rgba(0, 0, 0, 0.2)",borderColor:"rgba(79, 195, 247, 0.2)"},tablet:{background:"rgba(26, 26, 46, 0.7)",backdropFilter:"blur(15px)",borderOpacity:.12,shadow:"0 2px 15px rgba(0, 0, 0, 0.15)",borderColor:"rgba(79, 195, 247, 0.12)"},desktop:{background:"rgba(26, 26, 46, 0.25)",backdropFilter:"blur(6px)",borderOpacity:.03,shadow:"0 1px 8px rgba(0, 0, 0, 0.05)",borderColor:"rgba(79, 195, 247, 0.03)"}},breakpoints:{mobile:768,tablet:1024,desktop:1440},transitions:{duration:"0.4s",easing:"cubic-bezier(0.4, 0, 0.2, 1)",header:"all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",theme:"all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"},responsive:{mobile:{padding:"var(--spacing-sm) var(--spacing-md)",gap:"var(--spacing-md)",iconSize:"32px",buttonSize:"32px"},tablet:{padding:"var(--spacing-md) var(--spacing-lg)",gap:"var(--spacing-lg)",iconSize:"36px",buttonSize:"36px"},desktop:{padding:"var(--spacing-md) var(--spacing-xl)",gap:"var(--spacing-2xl)",iconSize:"40px",buttonSize:"36px"}}};function lx(n,e){var t;return((t=rs[n])==null?void 0:t[e])||rs.light.desktop}function Bh(n,e){const t=n/e;return n<=rs.breakpoints.mobile||n<=rs.breakpoints.tablet&&t<1.2?"mobile":n<=rs.breakpoints.tablet||n<=rs.breakpoints.desktop&&t<1.5?"tablet":"desktop"}class cx{constructor(){this.deviceType=Bh(window.innerWidth,window.innerHeight),this.isMobile=this.deviceType==="mobile",this.isTablet=this.deviceType==="tablet",this.isDesktop=this.deviceType==="desktop",this.init()}detectDevice(){return Bh(window.innerWidth,window.innerHeight)}getTransparencyConfig(){const e=document.documentElement.getAttribute("data-theme")||"light";return lx(e,this.deviceType)}updateHeaderTransparency(){const e=document.querySelector(".header");if(!e)return;const t=this.getTransparencyConfig();e.style.setProperty("--header-bg",t.background),e.style.setProperty("--header-backdrop",t.backdropFilter),e.style.setProperty("--header-border",`1px solid ${t.borderColor}`),e.style.setProperty("--header-shadow",t.shadow),e.style.background=t.background,e.style.backdropFilter=t.backdropFilter,e.style.borderBottom=`1px solid ${t.borderColor}`,e.style.boxShadow=t.shadow}updateThemeTransparency(e){this.updateHeaderTransparency()}handleResize(){const e=this.detectDevice();e!==this.deviceType&&(this.deviceType=e,this.isMobile=this.deviceType==="mobile",this.isTablet=this.deviceType==="tablet",this.isDesktop=this.deviceType==="desktop",this.updateHeaderTransparency())}init(){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{this.setupDeviceDetector()}):this.setupDeviceDetector()}setupDeviceDetector(){this.updateHeaderTransparency(),window.addEventListener("resize",this.handleResize.bind(this)),new MutationObserver(e=>{e.forEach(t=>{if(t.type==="attributes"&&t.attributeName==="data-theme"){const i=document.documentElement.getAttribute("data-theme");this.updateThemeTransparency(i)}})}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]})}refresh(){this.updateHeaderTransparency()}getDeviceInfo(){return{type:this.deviceType,isMobile:this.isMobile,isTablet:this.isTablet,isDesktop:this.isDesktop,width:window.innerWidth,height:window.innerHeight,ratio:window.innerWidth/window.innerHeight}}}class hx{constructor(){this.menuToggle=null,this.navLinks=null,this.isMenuOpen=!1,this.init()}init(){this.waitForComponents()}waitForComponents(){let e=0;const t=()=>{this.menuToggle=document.getElementById("menu-toggle"),this.navLinks=document.querySelector(".nav-links"),this.menuToggle&&this.navLinks?this.setupEventListeners():(e++,e<50?setTimeout(t,100):console.warn("⚠️ Elementos del menú móvil no encontrados después de múltiples intentos"))};t()}setupEventListeners(){this.menuToggle.addEventListener("click",()=>{this.toggleMenu()}),this.navLinks.addEventListener("click",e=>{e.target.classList.contains("nav-link")&&this.closeMenu()}),document.addEventListener("click",e=>{!this.menuToggle.contains(e.target)&&!this.navLinks.contains(e.target)&&this.closeMenu()}),window.addEventListener("resize",()=>{window.innerWidth>768&&this.closeMenu()})}toggleMenu(){this.isMenuOpen?this.closeMenu():this.openMenu()}openMenu(){this.isMenuOpen=!0,this.menuToggle.classList.add("active"),this.navLinks.classList.add("active"),document.body.style.overflow="hidden"}closeMenu(){this.isMenuOpen=!1,this.menuToggle.classList.remove("active"),this.navLinks.classList.remove("active"),document.body.style.overflow=""}forceClose(){this.closeMenu()}isOpen(){return this.isMenuOpen}}class ux{constructor(){this.scene=null,this.camera=null,this.renderer=null,this.particles=[],this.constellations=[],this.stars=[],this.animationId=null,this.isInitialized=!1,this.currentTheme="light",this.config={particles:{count:150,size:{min:1,max:3},speed:{min:.1,max:.3},opacity:{min:.3,max:.8}},constellations:{count:5,starsPerConstellation:{min:4,max:8},connectionOpacity:.4,glowIntensity:.6},stars:{count:200,size:{min:.5,max:2},twinkleSpeed:{min:2,max:5}}}}init(e="hero-particles"){return xt(this,null,function*(){try{return typeof Qd>"u"?(console.warn("Three.js no está disponible"),!1):(this.setupScene(),this.setupCamera(),this.setupRenderer(e),this.createParticleSystem(),this.createConstellationSystem(),this.createStarSystem(),this.setupEventListeners(),this.animate(),this.isInitialized=!0,!0)}catch(t){return console.error("❌ Error inicializando Hero Three.js Engine:",t),!1}})}setupScene(){this.scene=new zi,this.scene.fog=new Pr(0,50,200)}setupCamera(){this.camera=new yt(75,window.innerWidth/window.innerHeight,.1,1e3),this.camera.position.z=50,this.camera.position.y=0}setupRenderer(e){const t=document.getElementById(e);if(!t){console.warn(`Contenedor ${e} no encontrado`);return}this.renderer=new Fi({antialias:!0,alpha:!0,powerPreference:"high-performance"}),this.renderer.setSize(t.offsetWidth,t.offsetHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setClearColor(0,0),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=ga,t.appendChild(this.renderer.domElement),this.renderer.domElement.style.position="absolute",this.renderer.domElement.style.top="0",this.renderer.domElement.style.left="0",this.renderer.domElement.style.zIndex="1"}createParticleSystem(){const e=new Re,t=this.config.particles.count,i=new Float32Array(t*3),r=new Float32Array(t*3),s=new Float32Array(t),a=new Float32Array(t),o=new Float32Array(t);for(let c=0;c<t;c++){const h=c/t*Math.PI*4,d=20+c/t*30,u=c/t*40-20;i[c*3]=Math.cos(h)*d,i[c*3+1]=u,i[c*3+2]=Math.sin(h)*d;const p=this.currentTheme==="dark"?new oe(5227511):new oe(6600182);r[c*3]=p.r,r[c*3+1]=p.g,r[c*3+2]=p.b,s[c]=Math.random()*(this.config.particles.size.max-this.config.particles.size.min)+this.config.particles.size.min,a[c]=Math.random()*(this.config.particles.speed.max-this.config.particles.speed.min)+this.config.particles.speed.min,o[c]=Math.random()*(this.config.particles.opacity.max-this.config.particles.opacity.min)+this.config.particles.opacity.min}e.setAttribute("position",new Pe(i,3)),e.setAttribute("color",new Pe(r,3)),e.setAttribute("size",new Pe(s,1)),e.setAttribute("speed",new Pe(a,1)),e.setAttribute("opacity",new Pe(o,1));const l=new Dt({uniforms:{time:{value:0},theme:{value:this.currentTheme==="dark"?1:0}},vertexShader:`
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
                    float alpha = vOpacity * (0.8 + 0.2 * sin(time * 2.0));
                    vec3 finalColor = mix(vColor, vec3(1.0, 1.0, 1.0), theme * 0.3);
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,transparent:!0,blending:vi,depthWrite:!1});this.particleSystem=new _i(e,l),this.scene.add(this.particleSystem)}createConstellationSystem(){const e=this.config.constellations.count;for(let t=0;t<e;t++){const i=this.createConstellation(t,e);this.constellations.push(i),this.scene.add(i)}}createConstellation(e,t){const i=new Pi,r=Math.floor(Math.random()*(this.config.constellations.starsPerConstellation.max-this.config.constellations.starsPerConstellation.min)+this.config.constellations.starsPerConstellation.min),s=[];for(let l=0;l<r;l++){const c=this.createStar(.8,1.2),h=l/r*Math.PI*2,d=8+Math.random()*4,u=Math.cos(h)*d,p=Math.sin(h)*d,f=(Math.random()-.5)*10;c.position.set(u,p,f),s.push(new E(u,p,f)),i.add(c)}for(let l=0;l<r;l++)for(let c=l+1;c<r;c++)if(Math.random()>.5){const h=this.createConnection(s[l],s[c]);i.add(h)}const a=e/t*Math.PI*2,o=25+Math.random()*15;return i.position.set(Math.cos(a)*o,Math.sin(a)*o*.5,(Math.random()-.5)*20),i}createStar(e,t){const i=new Wt(e,8,6),r=new At({color:16777215,transparent:!0,opacity:t}),s=new at(i,r);return s.userData={originalIntensity:t,twinkleSpeed:Math.random()*3+2},s}createConnection(e,t){const i=new Re().setFromPoints([e,t]),r=new Et({color:5227511,transparent:!0,opacity:this.config.constellations.connectionOpacity});return new oi(i,r)}createStarSystem(){const e=new Re,t=this.config.stars.count,i=new Float32Array(t*3),r=new Float32Array(t),s=new Float32Array(t);for(let o=0;o<t;o++){const l=Math.acos(-1+2*o/t),c=Math.sqrt(t*Math.PI)*l,h=80+Math.random()*20;i[o*3]=h*Math.cos(c)*Math.sin(l),i[o*3+1]=h*Math.sin(c)*Math.sin(l),i[o*3+2]=h*Math.cos(l),r[o]=Math.random()*(this.config.stars.size.max-this.config.stars.size.min)+this.config.stars.size.min,s[o]=Math.random()*(this.config.stars.twinkleSpeed.max-this.config.stars.twinkleSpeed.min)+this.config.stars.twinkleSpeed.min}e.setAttribute("position",new Pe(i,3)),e.setAttribute("size",new Pe(r,1)),e.setAttribute("twinkleSpeed",new Pe(s,1));const a=new Dt({uniforms:{time:{value:0}},vertexShader:`
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
            `,transparent:!0,blending:vi,depthWrite:!1});this.starSystem=new _i(e,a),this.scene.add(this.starSystem)}setupEventListeners(){window.addEventListener("resize",()=>this.onWindowResize()),document.addEventListener("mousemove",e=>{if(!this.isInitialized)return;const t=e.clientX/window.innerWidth*2-1,i=-(e.clientY/window.innerHeight)*2+1;this.camera.position.x=t*5,this.camera.position.y=i*3,this.camera.lookAt(0,0,0)}),window.addEventListener("scroll",()=>{if(!this.isInitialized)return;const e=window.pageYOffset*-.1;this.particleSystem.position.y=e,this.starSystem.position.y=e*.5})}onWindowResize(){!this.renderer||!this.camera||(this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight))}animate(){if(this.animationId=requestAnimationFrame(()=>this.animate()),!this.isInitialized)return;const e=Date.now()*.001;this.particleSystem&&(this.particleSystem.material.uniforms.time.value=e,this.particleSystem.rotation.y=e*.1,this.particleSystem.rotation.x=e*.05),this.constellations.forEach((t,i)=>{t.rotation.y=e*(.1+i*.05),t.rotation.z=e*(.05+i*.02),t.children.forEach((r,s)=>{if(r.type==="Mesh"){const a=Math.sin(e*r.userData.twinkleSpeed)*.3+.7;r.material.opacity=r.userData.originalIntensity*a}})}),this.starSystem&&(this.starSystem.material.uniforms.time.value=e,this.starSystem.rotation.y=e*.02),this.renderer.render(this.scene,this.camera)}updateTheme(e){this.currentTheme=e,this.particleSystem&&this.particleSystem.material.uniforms&&(this.particleSystem.material.uniforms.theme.value=e==="dark"?1:0),this.constellations.forEach(t=>{t.children.forEach(i=>{i.type==="Line"&&i.material.color.setHex(e==="dark"?5227511:6600182)})})}setPerformanceMode(e=!0){this.renderer&&(e?this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)):this.renderer.setPixelRatio(1))}dispose(){this.animationId&&cancelAnimationFrame(this.animationId),this.renderer&&(this.renderer.dispose(),this.renderer.domElement&&this.renderer.domElement.parentNode&&this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)),this.scene=null,this.camera=null,this.renderer=null,this.particles=[],this.constellations=[],this.stars=[],this.isInitialized=!1}}class dx{constructor(){this.isInitialized=!1,this.currentTheme="light",this.effects=new Map,this.animationId=null,this.config={glow:{intensity:.3,spread:15,color:{light:"#64B5F6",dark:"#4FC3F7"}},particles:{count:20,size:{min:1,max:3},speed:{min:.5,max:2},opacity:{min:.1,max:.4}},wave:{amplitude:2,frequency:.02,speed:.5}}}init(){this.isInitialized||(this.setupEventListeners(),this.createTextEffects(),this.animate(),this.isInitialized=!0)}setupEventListeners(){new MutationObserver(e=>{e.forEach(t=>{if(t.type==="attributes"&&t.attributeName==="data-theme"){const i=document.documentElement.getAttribute("data-theme");this.updateTheme(i)}})}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]}),window.addEventListener("scroll",()=>{this.updateScrollEffects()}),document.addEventListener("mousemove",e=>{this.updateMouseEffects(e)})}createTextEffects(){this.createTitleEffects(),this.createSubtitleEffects(),this.createBadgeEffects()}createTitleEffects(){const e=document.querySelector(".title-first"),t=document.querySelector(".title-second");e&&(this.createGlowEffect(e,this.config.glow.color.light),this.createParticleEffect(e),this.createWaveEffect(e)),t&&(this.createGlowEffect(t,this.config.glow.color.dark),this.createParticleEffect(t),this.createWaveEffect(t))}createSubtitleEffects(){const e=document.querySelector(".hero-subtitle");e&&this.createSubtleGlowEffect(e)}createBadgeEffects(){document.querySelectorAll(".tech-badge, .hero-badge, .company-badge").forEach(e=>{this.createBadgeGlowEffect(e)})}createGlowEffect(e,t){const i=`glow-${Math.random().toString(36).substr(2,9)}`,r=document.createElement("div");r.className="text-glow",r.style.cssText=`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, ${t}20 0%, transparent 70%);
            filter: blur(${this.config.glow.spread}px);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: -1;
        `,e.style.position="relative",e.appendChild(r),this.effects.set(i,{type:"glow",element:r,target:e,color:t}),setTimeout(()=>{r.style.opacity=this.config.glow.intensity},100)}createParticleEffect(e){const t=`particles-${Math.random().toString(36).substr(2,9)}`,i=[];for(let r=0;r<this.config.particles.count;r++){const s=document.createElement("div");s.className="text-particle";const a=Math.random()*(this.config.particles.size.max-this.config.particles.size.min)+this.config.particles.size.min;s.style.cssText=`
                position: absolute;
                width: ${a}px;
                height: ${a}px;
                background: ${this.currentTheme==="dark"?"#4FC3F7":"#64B5F6"};
                border-radius: 50%;
                opacity: 0;
                pointer-events: none;
                z-index: 10;
            `,e.appendChild(s),i.push(s)}this.effects.set(t,{type:"particles",particles:i,target:e})}createWaveEffect(e){const t=`wave-${Math.random().toString(36).substr(2,9)}`,i=document.createElement("div");i.className="text-wave",i.style.cssText=`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, ${this.currentTheme==="dark"?"#4FC3F7":"#64B5F6"}20, transparent);
            opacity: 0;
            transform: translateX(-100%);
            transition: all 0.6s ease;
            pointer-events: none;
            z-index: 1;
        `,e.appendChild(i),this.effects.set(t,{type:"wave",element:i,target:e}),setInterval(()=>{i.style.transform="translateX(100%)",i.style.opacity="0.3",setTimeout(()=>{i.style.transform="translateX(-100%)",i.style.opacity="0"},600)},3e3)}createSubtleGlowEffect(e){const t=`subtle-glow-${Math.random().toString(36).substr(2,9)}`,i=document.createElement("div");i.className="subtle-glow",i.style.cssText=`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(100, 181, 246, 0.1) 0%, transparent 80%);
            filter: blur(8px);
            opacity: 0;
            transition: opacity 0.4s ease;
            pointer-events: none;
            z-index: -1;
        `,e.style.position="relative",e.appendChild(i),this.effects.set(t,{type:"subtle-glow",element:i,target:e}),setTimeout(()=>{i.style.opacity="1"},200)}createBadgeGlowEffect(e){const t=`badge-glow-${Math.random().toString(36).substr(2,9)}`,i=document.createElement("div");i.className="badge-glow",i.style.cssText=`
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #64B5F6, #4FC3F7, #64B5F6);
            border-radius: inherit;
            opacity: 0;
            filter: blur(4px);
            transition: opacity 0.3s ease;
            pointer-events: none;
            z-index: -1;
        `,e.style.position="relative",e.appendChild(i),this.effects.set(t,{type:"badge-glow",element:i,target:e}),e.addEventListener("mouseenter",()=>{i.style.opacity="0.6"}),e.addEventListener("mouseleave",()=>{i.style.opacity="0"})}updateTheme(e){this.currentTheme=e,this.effects.forEach((t,i)=>{if(t.type==="glow"){const r=e==="dark"?this.config.glow.color.dark:this.config.glow.color.light;t.element.style.background=`radial-gradient(circle, ${r}20 0%, transparent 70%)`,t.color=r}t.type==="particles"&&t.particles.forEach(r=>{r.style.background=e==="dark"?"#4FC3F7":"#64B5F6"}),t.type==="wave"&&(t.element.style.background=`linear-gradient(90deg, transparent, ${e==="dark"?"#4FC3F7":"#64B5F6"}20, transparent)`)})}updateScrollEffects(){const e=window.pageYOffset*.001;this.effects.forEach((t,i)=>{t.type==="particles"&&t.particles.forEach((r,s)=>{const a=s/t.particles.length*.5;r.style.transform=`translateY(${e*a*100}px)`})})}updateMouseEffects(e){const t=e.clientX,i=e.clientY;this.effects.forEach((r,s)=>{r.type==="particles"&&r.particles.forEach((a,o)=>{const l=r.target.getBoundingClientRect(),c=l.left+l.width/2,h=l.top+l.height/2,d=(t-c)*.01,u=(i-h)*.01;a.style.transform=`translate(${d}px, ${u}px)`})})}animate(){if(this.animationId=requestAnimationFrame(()=>this.animate()),!this.isInitialized)return;const e=Date.now()*.001;this.effects.forEach((t,i)=>{t.type==="particles"&&t.particles.forEach((r,s)=>{const a=this.config.particles.speed.min+(this.config.particles.speed.max-this.config.particles.speed.min)*(s/t.particles.length),o=this.config.particles.opacity.min+(this.config.particles.opacity.max-this.config.particles.opacity.min)*Math.sin(e*a+s);r.style.opacity=o})})}dispose(){this.animationId&&cancelAnimationFrame(this.animationId),this.effects.forEach((e,t)=>{e.element&&e.element.parentNode&&e.element.parentNode.removeChild(e.element),e.particles&&e.particles.forEach(i=>{i.parentNode&&i.parentNode.removeChild(i)})}),this.effects.clear(),this.isInitialized=!1}}class px{constructor(){this.scene=null,this.camera=null,this.renderer=null,this.particles=[],this.buttons=[],this.animationId=null,this.isInitialized=!1,this.currentTheme="light",this.config={particlesPerButton:8,size:{min:.3,max:.8},speed:{min:.2,max:.6},opacity:{min:.06,max:.15},colors:{primary:{light:"rgba(255, 255, 255, 0.3)",dark:"rgba(255, 255, 255, 0.3)"},outline:{light:"rgba(255, 255, 255, 0.25)",dark:"rgba(255, 255, 255, 0.25)"}}}}init(){return xt(this,null,function*(){try{return typeof Qd>"u"?(console.warn("Three.js no está disponible para Button Particles"),!1):(this.setupScene(),this.setupCamera(),this.setupRenderer(),this.findButtons(),this.createButtonParticles(),this.setupEventListeners(),this.animate(),this.isInitialized=!0,!0)}catch(e){return console.error("❌ Error inicializando Button Particles Engine:",e),!1}})}setupScene(){this.scene=new zi,this.scene.fog=new Pr(0,10,50)}setupCamera(){this.camera=new yt(75,window.innerWidth/window.innerHeight,.1,100),this.camera.position.z=30}setupRenderer(){this.renderer=new Fi({antialias:!0,alpha:!0,powerPreference:"high-performance"}),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setClearColor(0,0),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=ga,document.body.appendChild(this.renderer.domElement),this.renderer.domElement.style.cssText=`
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `}findButtons(){this.buttons=document.querySelectorAll(".btn-hero")}createButtonParticles(){this.buttons.forEach((e,t)=>{const i=e.classList.contains("btn-primary")?"primary":"outline";e.getBoundingClientRect();for(let r=0;r<this.config.particlesPerButton;r++){const s=this.createParticle(i,t,r);this.particles.push(s),this.scene.add(s)}})}createParticle(e,t,i){const r=new Re,s=i/this.config.particlesPerButton*Math.PI*2,a=8+Math.random()*4,o=Math.cos(s)*a,l=Math.sin(s)*a,c=(Math.random()-.5)*6;r.setAttribute("position",new Pe(new Float32Array([o,l,c]),3));const h=Math.random()*(this.config.size.max-this.config.size.min)+this.config.size.min,d=Math.random()*(this.config.speed.max-this.config.speed.min)+this.config.speed.min;r.setAttribute("size",new Pe(new Float32Array([h]),1)),r.setAttribute("speed",new Pe(new Float32Array([d]),1));const u=new Dt({uniforms:{time:{value:0},theme:{value:this.currentTheme==="dark"?1:0},buttonType:{value:e==="primary"?1:0}},vertexShader:`
                attribute float size;
                attribute float speed;
                varying float vSize;
                varying float vSpeed;
                
                void main() {
                    vSize = size;
                    vSpeed = speed;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,fragmentShader:`
                uniform float time;
                uniform float theme;
                uniform float buttonType;
                varying float vSize;
                varying float vSpeed;
                
                void main() {
                    // Color base unificado para ambos botones
                    vec3 baseColor = vec3(1.0, 1.0, 1.0);
                    
                    // Efecto de twinkle sutil
                    float twinkle = 0.8 + 0.2 * sin(time * vSpeed * 1.0);
                    
                    // Efecto de respiración suave
                    float breathing = 0.9 + 0.1 * sin(time * 0.3);
                    
                    // Efecto de pulso orbital
                    float pulse = 0.7 + 0.3 * sin(time * 0.5);
                    
                    // Opacidad final ultra sutil y elegante
                    float alpha = twinkle * breathing * pulse * 0.12;
                    
                    gl_FragColor = vec4(baseColor, alpha);
                }
            `,transparent:!0,blending:vi,depthWrite:!1}),p=new _i(r,u);return p.userData={buttonType:e,buttonIndex:t,particleIndex:i,originalPosition:new E(o,l,c),targetPosition:new E(o,l,c),orbitalRadius:a,orbitalAngle:s,orbitalSpeed:.5+Math.random()*.5,velocity:new E((Math.random()-.5)*.05,(Math.random()-.5)*.05,(Math.random()-.5)*.02)},p}setupEventListeners(){new MutationObserver(e=>{e.forEach(t=>{if(t.type==="attributes"&&t.attributeName==="data-theme"){const i=document.documentElement.getAttribute("data-theme");this.updateTheme(i)}})}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]}),document.addEventListener("mousemove",e=>{this.updateMouseEffects(e)}),window.addEventListener("resize",()=>{this.onWindowResize()})}updateMouseEffects(e){const t=e.clientX/window.innerWidth*2-1,i=-(e.clientY/window.innerHeight)*2+1;this.camera.position.x=t*5,this.camera.position.y=i*3,this.camera.lookAt(0,0,0),this.particles.forEach(r=>{var a;const s=(a=this.buttons[r.userData.buttonIndex])==null?void 0:a.getBoundingClientRect();if(s){const o=(s.left+s.width/2)/window.innerWidth*2-1,l=-(s.top+s.height/2)/window.innerHeight*2+1,c=(t-o)*.05,h=(i-l)*.05;r.userData.orbitalRadius=r.userData.orbitalRadius+(c+h)*2,r.userData.orbitalRadius=Math.max(6,Math.min(12,r.userData.orbitalRadius))}})}updateTheme(e){this.currentTheme=e,this.particles.forEach(t=>{t.material.uniforms&&(t.material.uniforms.theme.value=e==="dark"?1:0)})}onWindowResize(){!this.camera||!this.renderer||(this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight))}animate(){if(this.animationId=requestAnimationFrame(()=>this.animate()),!this.isInitialized)return;const e=Date.now()*.001;this.particles.forEach(t=>{t.material.uniforms&&(t.material.uniforms.time.value=e);const i=t.userData.orbitalRadius,r=t.userData.orbitalAngle,s=t.userData.orbitalSpeed,a=r+e*s*.2,o=Math.cos(a)*i,l=Math.sin(a)*i,c=Math.sin(e*t.userData.velocity.x)*.3+Math.sin(e*.5)*.2,h=Math.cos(e*t.userData.velocity.y)*.3+Math.cos(e*.7)*.2,d=Math.sin(e*t.userData.velocity.z)*.2+Math.sin(e*.3)*.1;t.position.x+=(o+c-t.position.x)*.015,t.position.y+=(l+h-t.position.y)*.015,t.position.z+=(t.userData.originalPosition.z+d-t.position.z)*.008,t.rotation.y=e*.015,t.rotation.x=e*.008}),this.renderer.render(this.scene,this.camera)}dispose(){this.animationId&&cancelAnimationFrame(this.animationId),this.renderer&&(this.renderer.dispose(),this.renderer.domElement&&this.renderer.domElement.parentNode&&this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)),this.scene=null,this.camera=null,this.renderer=null,this.particles=[],this.buttons=[],this.isInitialized=!1}}class ep{constructor(e){this.badgeElement=e,this.scene=null,this.camera=null,this.renderer=null,this.particles=[],this.animationId=null,this.isActive=!1,this.config={particlesCount:8,size:{min:.15,max:.4},speed:{min:.05,max:.2},opacity:{min:.02,max:.05},colors:{primary:"rgba(100, 181, 246, 0.25)",accent:"rgba(79, 195, 247, 0.25)",white:"rgba(255, 255, 255, 0.2)"}},this.init()}init(){try{this.setupThreeJS(),this.createParticles(),this.setupEventListeners(),this.animate(),this.isActive=!0}catch(e){console.warn("❌ Error inicializando Badge Particles Engine:",e)}}setupThreeJS(){this.scene=new zi;const e=1,t=2;this.camera=new tr(t*e/-2,t*e/2,t/2,t/-2,.1,1e3),this.camera.position.z=1,this.renderer=new Fi({alpha:!0,antialias:!0}),this.renderer.setSize(200,200),this.renderer.setClearColor(0,0),this.particlesContainer=document.createElement("div"),this.particlesContainer.className="badge-particles-container",this.particlesContainer.style.cssText=`
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 200px;
            height: 200px;
            pointer-events: none;
            z-index: 1;
        `,this.particlesContainer.appendChild(this.renderer.domElement),this.badgeElement.appendChild(this.particlesContainer)}createParticles(){const e=new Re,t=[],i=[],r=[],s=[];for(let o=0;o<this.config.particlesCount;o++){const l=o/this.config.particlesCount*Math.PI*2,c=.8+Math.random()*.4,h=Math.cos(l)*c,d=Math.sin(l)*c,u=(Math.random()-.5)*.1;t.push(h,d,u);const p=Object.keys(this.config.colors),f=this.config.colors[p[Math.floor(Math.random()*p.length)]],v=new oe(f);i.push(v.r,v.g,v.b);const g=this.config.size.min+Math.random()*(this.config.size.max-this.config.size.min),m=this.config.speed.min+Math.random()*(this.config.speed.max-this.config.speed.min);r.push(g),s.push(m)}e.setAttribute("position",new fe(t,3)),e.setAttribute("color",new fe(i,3)),e.setAttribute("size",new fe(r,1)),e.setAttribute("speed",new fe(s,1));const a=new Dt({uniforms:{time:{value:0},theme:{value:0}},vertexShader:`
                attribute float size;
                attribute float speed;
                attribute vec3 color;
                varying float vOpacity;
                varying vec3 vColor;
                
                void main() {
                    vOpacity = 0.6;
                    vColor = color;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (100.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,fragmentShader:`
                precision mediump float;
                uniform float time;
                uniform float theme;
                varying float vOpacity;
                varying vec3 vColor;
                
                void main() {
                    // Efecto de twinkle ultra sutil
                    float twinkle = 0.85 + 0.15 * sin(time * 1.5);
                    
                    // Efecto de respiración ultra sutil
                    float breathing = 0.9 + 0.1 * sin(time * 0.6);
                    
                    // Opacidad final ultra sutil
                    float alpha = twinkle * breathing * vOpacity * 0.8;
                    
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,transparent:!0,depthWrite:!1,blending:vi});this.particles=new _i(e,a),this.scene.add(this.particles)}setupEventListeners(){this.badgeElement.addEventListener("mouseenter",()=>{this.activateSubtleEffects()}),this.badgeElement.addEventListener("mouseleave",()=>{this.deactivateSubtleEffects()})}activateSubtleEffects(){this.particles&&this.particles.material&&(this.particles.material.uniforms.theme.value=1,this.particles.scale.setScalar(1.05),this.particles.rotation.z+=.1)}deactivateSubtleEffects(){this.particles&&this.particles.material&&(this.particles.material.uniforms.theme.value=0,this.particles.scale.setScalar(1))}animate(){if(!this.isActive)return;this.animationId=requestAnimationFrame(()=>this.animate());const e=Date.now()*.001;this.particles&&this.particles.material&&(this.particles.material.uniforms.time.value=e,this.particles.rotation.z=e*.05,this.particles.position.x=Math.sin(e*.2)*.02,this.particles.position.y=Math.cos(e*.2)*.02),this.renderer.render(this.scene,this.camera)}updateTheme(e){this.particles&&this.particles.material&&(this.particles.material.uniforms.theme.value=e?0:1)}dispose(){this.isActive=!1,this.animationId&&cancelAnimationFrame(this.animationId),this.renderer&&this.renderer.dispose(),this.particlesContainer&&this.particlesContainer.parentNode&&this.particlesContainer.parentNode.removeChild(this.particlesContainer),this.scene&&this.scene.clear()}}window.BadgeParticlesEngine=ep;class tp{constructor(){this.techBadges=[],this.particlesEngines=[],this.isActive=!1,this.config={particlesPerBadge:8,size:{min:.2,max:.5},speed:{min:.05,max:.2},opacity:{min:.08,max:.15},colors:{java:"rgba(255, 69, 0, 0.6)",spring:"rgba(108, 194, 74, 0.6)",quarkus:"rgba(255, 105, 180, 0.6)",angular:"rgba(221, 0, 0, 0.6)"}},this.init()}init(){try{this.findTechBadges(),this.createParticlesEngines(),this.setupEventListeners(),this.isActive=!0}catch(e){console.warn("❌ Error inicializando Tech Badges Particles Engine:",e)}}findTechBadges(){this.techBadges=document.querySelectorAll(".tech-badge")}createParticlesEngines(){this.techBadges.forEach((e,t)=>{const i=e.getAttribute("data-tech"),r=new mx(e,i,this.config);this.particlesEngines.push(r)})}setupEventListeners(){this.setupThemeListener(),this.setupDOMObserver(),this.setupHoverEffects()}setupThemeListener(){new MutationObserver(e=>{e.forEach(t=>{if(t.type==="attributes"&&t.attributeName==="data-theme"){const i=document.documentElement.getAttribute("data-theme");this.updateTheme(i==="dark")}})}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]})}setupDOMObserver(){new MutationObserver(e=>{e.forEach(t=>{t.type==="childList"&&document.querySelectorAll(".tech-badge").length>this.techBadges.length&&this.refreshBadges()})}).observe(document.body,{childList:!0,subtree:!0})}setupHoverEffects(){this.techBadges.forEach((e,t)=>{e.addEventListener("mouseenter",()=>{this.activateBadgeHover(t)}),e.addEventListener("mouseleave",()=>{this.deactivateBadgeHover(t)})})}activateBadgeHover(e){this.particlesEngines[e]&&this.particlesEngines[e].activateHover()}deactivateBadgeHover(e){this.particlesEngines[e]&&this.particlesEngines[e].deactivateHover()}refreshBadges(){this.particlesEngines.forEach(e=>e.dispose()),this.particlesEngines=[],this.findTechBadges(),this.createParticlesEngines()}updateTheme(e){this.particlesEngines.forEach(t=>{t.updateTheme(e)})}dispose(){this.isActive=!1,this.particlesEngines.forEach(e=>{e.dispose()}),this.particlesEngines=[],this.techBadges=[]}}class mx{constructor(e,t,i){this.badgeElement=e,this.techType=t,this.config=i,this.scene=null,this.camera=null,this.renderer=null,this.particles=null,this.animationId=null,this.isActive=!1,this.init()}init(){try{this.setupThreeJS(),this.createParticles(),this.animate(),this.isActive=!0}catch(e){console.warn(`❌ Error inicializando partículas para ${this.techType}:`,e)}}setupThreeJS(){this.scene=new zi;const e=1,t=1.5;this.camera=new tr(t*e/-2,t*e/2,t/2,t/-2,.1,1e3),this.camera.position.z=1,this.renderer=new Fi({alpha:!0,antialias:!0}),this.renderer.setSize(150,150),this.renderer.setClearColor(0,0),this.particlesContainer=document.createElement("div"),this.particlesContainer.className="tech-badge-particles-container",this.particlesContainer.style.cssText=`
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 150px;
            height: 150px;
            pointer-events: none;
            z-index: 1;
        `,this.particlesContainer.appendChild(this.renderer.domElement),this.badgeElement.appendChild(this.particlesContainer)}createParticles(){const e=new Re,t=[],i=[],r=[],s=[],a=this.config.colors[this.techType]||this.config.colors.java,o=new oe(a);for(let c=0;c<this.config.particlesPerBadge;c++){const h=c/this.config.particlesPerBadge*Math.PI*2,d=.6+Math.random()*.3,u=Math.cos(h)*d,p=Math.sin(h)*d,f=(Math.random()-.5)*.05;t.push(u,p,f),i.push(o.r,o.g,o.b);const v=this.config.size.min+Math.random()*(this.config.size.max-this.config.size.min),g=this.config.speed.min+Math.random()*(this.config.speed.max-this.config.speed.min);r.push(v),s.push(g)}e.setAttribute("position",new fe(t,3)),e.setAttribute("color",new fe(i,3)),e.setAttribute("size",new fe(r,1)),e.setAttribute("speed",new fe(s,1));const l=new Dt({uniforms:{time:{value:0},theme:{value:0}},vertexShader:`
                attribute float size;
                attribute float speed;
                attribute vec3 color;
                varying float vOpacity;
                varying vec3 vColor;
                
                void main() {
                    vOpacity = 0.4;
                    vColor = color;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (75.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,fragmentShader:`
                precision mediump float;
                uniform float time;
                uniform float theme;
                varying float vOpacity;
                varying vec3 vColor;
                
                void main() {
                    // Efecto de twinkle sutil
                    float twinkle = 0.8 + 0.2 * sin(time * 1.5);
                    
                    // Efecto de respiración sutil
                    float breathing = 0.9 + 0.1 * sin(time * 0.8);
                    
                    // Efecto de energía cuando está en hover
                    float energy = 1.0;
                    if (theme > 0.5) {
                        energy = 1.0 + 0.3 * sin(time * 4.0) + 0.2 * sin(time * 2.0);
                    }
                    
                    // Opacidad final con efectos de energía
                    float alpha = twinkle * breathing * energy * vOpacity * 1.2;
                    
                    // Color con efecto de energía
                    vec3 finalColor = vColor;
                    if (theme > 0.5) {
                        // Añadir brillo de energía
                        float glow = 0.3 * sin(time * 3.0);
                        finalColor = mix(vColor, vec3(1.0), glow * 0.2);
                    }
                    
                    gl_FragColor = vec4(finalColor, alpha);
                }
            `,transparent:!0,depthWrite:!1,blending:vi});this.particles=new _i(e,l),this.scene.add(this.particles)}animate(){if(!this.isActive)return;this.animationId=requestAnimationFrame(()=>this.animate());const e=Date.now()*.001;if(this.particles&&this.particles.material){this.particles.material.uniforms.time.value=e;const t=e*.08;if(this.particles.userData.isHovered){this.particles.rotation.z=t*2;const i=1+Math.sin(e*3)*.3;this.particles.position.x=Math.sin(e*.6)*.05*i,this.particles.position.y=Math.cos(e*.6)*.05*i;const r=1+Math.sin(e*4)*.1;this.particles.scale.setScalar(this.particles.scale.x*r)}else this.particles.rotation.z=t,this.particles.position.x=Math.sin(e*.3)*.03,this.particles.position.y=Math.cos(e*.3)*.03}this.renderer.render(this.scene,this.camera)}updateTheme(e){this.particles&&this.particles.material&&(this.particles.material.uniforms.theme.value=e?0:1)}activateHover(){this.particles&&(this.particles.userData.isHovered=!0,typeof gsap<"u"?(gsap.to(this.particles.scale,{x:1.4,y:1.4,z:1.4,duration:.8,ease:"power2.out"}),gsap.to(this.particles.material.uniforms,{theme:{value:1},duration:.6,ease:"power2.out"})):(this.particles.scale.setScalar(1.4),this.particles.material.uniforms.theme.value=1),this.particles.userData.energyMode=!0,this.createHoverParticles())}deactivateHover(){this.particles&&(this.particles.userData.isHovered=!1,typeof gsap<"u"?(gsap.to(this.particles.scale,{x:1,y:1,z:1,duration:1.2,ease:"power3.out"}),gsap.to(this.particles.material.uniforms,{theme:{value:0},duration:.8,ease:"power2.out"})):(this.particles.scale.setScalar(1),this.particles.material.uniforms.theme.value=0),this.particles.userData.energyMode=!1,this.cleanupHoverParticles())}createHoverParticles(){if(!this.hoverParticles){this.hoverParticles=[];for(let e=0;e<4;e++){const t=document.createElement("div");t.className="hover-particle",t.style.cssText=`
                    position: absolute;
                    width: 3px;
                    height: 3px;
                    background: var(--primary-color);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 10;
                    opacity: 0;
                    animation: hoverParticleFloat 2s ease-out forwards;
                `;const i=e/4*Math.PI*2,r=60+Math.random()*20;t.style.left=`calc(50% + ${Math.cos(i)*r}px)`,t.style.top=`calc(50% + ${Math.sin(i)*r}px)`,this.badgeElement.appendChild(t),this.hoverParticles.push(t)}}}cleanupHoverParticles(){this.hoverParticles&&(this.hoverParticles.forEach(e=>{e.parentNode&&e.parentNode.removeChild(e)}),this.hoverParticles=[])}dispose(){this.isActive=!1,this.animationId&&cancelAnimationFrame(this.animationId),this.renderer&&this.renderer.dispose(),this.particlesContainer&&this.particlesContainer.parentNode&&this.particlesContainer.parentNode.removeChild(this.particlesContainer),this.scene&&this.scene.clear()}}window.TechBadgesParticlesEngine=tp;class ip{constructor(){this.hero=null,this.heroContent=null,this.techBadges=[],this.buttons=[],this.scrollIndicator=null,this.floatingElements=[],this.isAnimating=!1,this.observer=null,this.heroThreeEngine=null,this.textEffectsEngine=null,this.buttonParticlesEngine=null,this.badgeParticlesEngine=null,this.techBadgesParticlesEngine=null,this.init()}init(){this.setupElements(),this.setupIntersectionObserver(),this.setupEventListeners(),this.startInitialAnimations()}setupElements(){this.hero=document.querySelector(".hero"),this.heroContent=document.querySelector(".hero-content"),this.techBadges=document.querySelectorAll(".tech-badge"),this.buttons=document.querySelectorAll(".btn-hero"),this.scrollIndicator=document.querySelector(".hero-scroll-indicator"),this.floatingElements=document.querySelectorAll(".floating-element")}setupIntersectionObserver(){this.hero&&(this.observer=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&this.onHeroVisible()})},{threshold:.1,rootMargin:"0px 0px -100px 0px"}),this.observer.observe(this.hero))}setupEventListeners(){this.scrollIndicator&&this.scrollIndicator.addEventListener("click",()=>{this.scrollToNextSection()}),this.techBadges.forEach(e=>{e.addEventListener("mouseenter",()=>{this.animateTechBadge(e,"enter")}),e.addEventListener("mouseleave",()=>{this.animateTechBadge(e,"leave")})}),this.buttons.forEach(e=>{e.addEventListener("mouseenter",()=>{this.animateButton(e,"enter")}),e.addEventListener("mouseleave",()=>{this.animateButton(e,"leave")})}),window.addEventListener("scroll",()=>{this.updateParallax()}),window.addEventListener("resize",()=>{this.updateResponsiveAnimations()})}startInitialAnimations(){this.heroContent&&(this.heroContent.querySelectorAll(".animate-fade-in-up").forEach((e,t)=>{const i=parseFloat(e.dataset.delay)||t*.1;setTimeout(()=>{e.style.animationDelay=`${i}s`,e.classList.add("animate-in")},i*1e3)}),this.techBadges.forEach((e,t)=>{const i=parseFloat(e.dataset.delay)||t*.1;setTimeout(()=>{this.animateTechBadge(e,"enter")},(1.4+i)*1e3)}))}onHeroVisible(){this.isAnimating||(this.isAnimating=!0,this.animateFloatingElements(),this.scrollIndicator&&this.animateScrollIndicator(),this.textEffectsEngine||this.initTextEffects(),this.buttonParticlesEngine||this.initButtonParticles(),this.badgeParticlesEngine||this.initBadgeParticles(),this.techBadgesParticlesEngine||this.initTechBadgesParticles(),this.initThreeJSAnimations())}animateTechBadge(e,t){if(t==="enter"){e.style.transform="translateY(-8px) scale(1.05)",e.style.boxShadow="0 12px 30px rgba(100, 181, 246, 0.3)";const i=e.querySelector(".tech-icon");i&&(i.style.transform="scale(1.2) rotate(10deg)");const r=e.querySelector(".tech-glow");r&&(r.style.opacity="1")}else{e.style.transform="translateY(0) scale(1)",e.style.boxShadow="0 4px 15px rgba(100, 181, 246, 0.1)";const i=e.querySelector(".tech-icon");i&&(i.style.transform="scale(1) rotate(0deg)");const r=e.querySelector(".tech-glow");r&&(r.style.opacity="0")}}animateButton(e,t){if(t==="enter"){e.style.transform="translateY(-4px)";const i=e.querySelector(".btn-icon");if(i&&(i.style.transform="scale(1.1)"),e.classList.contains("btn-primary")){const r=e.querySelector(".btn-particles");r&&(r.style.opacity="1")}}else{e.style.transform="translateY(0)";const i=e.querySelector(".btn-icon");i&&(i.style.transform="scale(1)");const r=e.querySelector(".btn-particles");r&&(r.style.opacity="0")}}animateFloatingElements(){this.floatingElements.forEach((e,t)=>{const i=t*.5;setTimeout(()=>{e.style.animation="float 6s ease-in-out infinite",e.style.opacity="1"},i*1e3)})}animateScrollIndicator(){if(!this.scrollIndicator)return;this.scrollIndicator.querySelectorAll(".arrow-line").forEach((t,i)=>{t.style.animation=`arrowLine${i+1} 2s infinite`});const e=this.scrollIndicator.querySelector(".scroll-text");e&&(e.style.animation="fadeInOut 2s infinite")}updateParallax(){if(!this.hero)return;const e=window.pageYOffset*-.5;this.hero.querySelectorAll(".hero-particles, .hero-constellations, .hero-stars").forEach(t=>{t.style.transform=`translateY(${e}px)`}),this.floatingElements.forEach((t,i)=>{const r=e*(.1+i*.05);t.style.transform=`translateY(${r}px)`})}updateResponsiveAnimations(){var e,t;window.innerWidth<=768?(e=this.heroContent)==null||e.style.setProperty("--animation-duration","0.6s"):(t=this.heroContent)==null||t.style.setProperty("--animation-duration","0.8s")}scrollToNextSection(){var t;const e=(t=this.hero)==null?void 0:t.nextElementSibling;e&&e.scrollIntoView({behavior:"smooth",block:"start"})}initThreeJSAnimations(){try{this.heroThreeEngine=new ux,this.heroThreeEngine.init("hero-particles").then(e=>{e&&this.setupThemeIntegration()})}catch(e){console.warn("Three.js no está disponible para el hero:",e)}}initTextEffects(){this.textEffectsEngine=new dx,this.textEffectsEngine.init()}initButtonParticles(){this.buttonParticlesEngine=new px,this.buttonParticlesEngine.init()}initBadgeParticles(){try{const e=this.hero.querySelector(".hero-badge");e&&(this.badgeParticlesEngine=new ep(e))}catch(e){console.warn("❌ Error inicializando Badge Particles Engine:",e)}}initTechBadgesParticles(){try{this.techBadgesParticlesEngine=new tp}catch(e){console.warn("❌ Error inicializando Tech Badges Particles Engine:",e)}}setupThemeIntegration(){new MutationObserver(e=>{e.forEach(t=>{if(t.type==="attributes"&&t.attributeName==="data-theme"){const i=document.documentElement.getAttribute("data-theme");this.heroThreeEngine&&this.heroThreeEngine.updateTheme(i)}})}).observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]})}createHeroParticles(){const e=document.getElementById("hero-particles");if(e)for(let t=0;t<20;t++){const i=document.createElement("div");i.className="hero-particle",i.style.cssText=`
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
            `,e.appendChild(i)}}destroy(){this.observer&&this.observer.disconnect(),this.heroThreeEngine&&(this.heroThreeEngine.dispose(),this.heroThreeEngine=null),this.textEffectsEngine&&(this.textEffectsEngine.dispose(),this.textEffectsEngine=null),this.buttonParticlesEngine&&(this.buttonParticlesEngine.dispose(),this.buttonParticlesEngine=null),this.badgeParticlesEngine&&(this.badgeParticlesEngine.dispose(),this.badgeParticlesEngine=null),this.techBadgesParticlesEngine&&(this.techBadgesParticlesEngine.dispose(),this.techBadgesParticlesEngine=null),this.scrollIndicator&&this.scrollIndicator.removeEventListener("click",this.scrollToNextSection),this.hero=null,this.heroContent=null,this.techBadges=[],this.buttons=[],this.scrollIndicator=null,this.floatingElements=[]}}document.addEventListener("DOMContentLoaded",()=>{new ip});class kh{constructor(){this.scene=null,this.camera=null,this.renderer=null,this.particles=null,this.constellations=null,this.avatarParticles=null,this.statsParticles=null,this.specialtyParticles=null,this.techParticles=null,this.valuesParticles=null,this.isActive=!1,this.animationId=null,this.mouse={x:0,y:0},this.theme="dark",this.contextLostCount=0,this.maxContextLostRetries=3,this.retryDelay=2e3,this.isRetrying=!1,this.performanceMode="high",this.frameCount=0,this.lastTime=0,this.fps=60,this.cssMode=!1,console.warn("⚠️ Three.js temporalmente deshabilitado por problemas de shader"),this.fallbackToCSS()}checkWebGLCompatibility(){try{const e=document.createElement("canvas"),t=e.getContext("webgl")||e.getContext("experimental-webgl");return t?t.getSupportedExtensions().includes("OES_standard_derivatives")?t.getParameter(t.MAX_TEXTURE_SIZE)<1024?(console.warn("⚠️ WebGL tiene límites muy bajos"),!1):t.isContextLost()?(console.warn("⚠️ WebGL context ya está perdido"),!1):!0:(console.warn("⚠️ WebGL no soporta extensiones necesarias"),!1):(console.warn("⚠️ WebGL no está disponible en este navegador"),!1)}catch(e){return console.warn("⚠️ Error verificando compatibilidad WebGL:",e),!1}}fallbackToCSS(){try{document.body.classList.add("webgl-fallback"),document.querySelectorAll(".about-threejs-containers, .about-particles, .about-constellations").forEach(e=>{e&&(e.style.display="none",e.style.visibility="hidden")}),document.querySelectorAll('[id*="particles"], [id*="constellations"]').forEach(e=>{e&&(e.style.display="none",e.style.visibility="hidden")}),this.activateCSSAnimations(),this.isActive=!1,this.cssMode=!0,ß}catch(e){console.warn("⚠️ Error activando modo CSS:",e),this.activateBasicCSS()}}activateBasicCSS(){try{document.querySelectorAll(".about-card, .stat-item, .specialty-inline-item, .tech-tag-compact, .value-inline-item").forEach((e,t)=>{e.style.animationDelay=`${t*.1}s`,e.classList.add("animate-fade-in-up")})}catch(e){console.warn("⚠️ Error activando animaciones CSS básicas:",e)}}activateCSSAnimations(){try{document.querySelectorAll(".about-card, .stat-item, .specialty-inline-item, .tech-tag-compact, .value-inline-item").forEach((e,t)=>{e.style.animationDelay=`${t*.1}s`,e.classList.add("animate-fade-in-up")}),this.activateCSSCounters(),this.activateSpecialCSSEffects()}catch(e){console.warn("⚠️ Error activando animaciones CSS:",e)}}activateSpecialCSSEffects(){const e=document.querySelector(".avatar-container");e&&e.classList.add("avatar-css-mode"),document.querySelectorAll(".stat-main-item").forEach((t,i)=>{t.classList.add("stat-css-mode"),t.style.animationDelay=`${i*.2}s`}),document.querySelectorAll(".specialty-inline-item").forEach((t,i)=>{t.classList.add("specialty-css-mode"),t.style.animationDelay=`${i*.15}s`}),document.querySelectorAll(".tech-tag-compact").forEach((t,i)=>{t.classList.add("tech-css-mode"),t.style.animationDelay=`${i*.1}s`}),document.querySelectorAll(".value-inline-item").forEach((t,i)=>{t.classList.add("value-css-mode"),t.style.animationDelay=`${i*.2}s`})}activateCSSCounters(){document.querySelectorAll(".stat-main-number").forEach((e,t)=>{setTimeout(()=>{e.style.animation="counterPulse 1s ease-out",e.style.color="var(--primary-color)",e.style.textShadow="0 0 20px rgba(100, 181, 246, 0.5)"},t*200)})}init(){try{if(!this.checkWebGLCompatibility()){console.warn("⚠️ WebGL no es compatible, usando modo CSS"),this.fallbackToCSS();return}this.setupThreeJS(),this.createParticleSystems(),this.createConstellationSystem(),this.createAvatarEffects(),this.createStatsEffects(),this.createSpecialtyEffects(),this.createTechEffects(),this.createValuesEffects(),this.setupEventListeners(),this.animate(),this.isActive=!0}catch(e){console.error("❌ Error inicializando About Three.js Engine:",e),this.fallbackToCSS()}}setupThreeJS(){try{this.scene=new zi;const e=window.innerWidth/window.innerHeight;this.camera=new tr(-e,e,1,-1,.1,1e3),this.camera.position.z=5;let t=[{alpha:!0,antialias:!1,powerPreference:"default",preserveDrawingBuffer:!1,failIfMajorPerformanceCaveat:!1,stencil:!1,depth:!1},{alpha:!0,antialias:!1,powerPreference:"default",preserveDrawingBuffer:!1,failIfMajorPerformanceCaveat:!1,stencil:!1,depth:!0},{alpha:!0,antialias:!0,powerPreference:"high-performance",preserveDrawingBuffer:!1,failIfMajorPerformanceCaveat:!1,stencil:!1,depth:!0}],i=null,r=0;for(;!i&&r<t.length;)try{i=new Fi(t[r])}catch(a){console.warn(`⚠️ Configuración ${r+1} falló:`,a),r++}if(!i)throw new Error("No se pudo crear ningún renderer WebGL");this.renderer=i,this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.setPixelRatio(1),this.renderer.setClearColor(0,0),this.renderer.domElement.addEventListener("webglcontextlost",a=>{console.warn("⚠️ WebGL Context Lost - Reintentando..."),a.preventDefault(),this.handleContextLost()}),this.renderer.domElement.addEventListener("webglcontextrestored",()=>{this.handleContextRestored()});try{this.renderer.render(this.scene,this.camera)}catch(a){throw console.error("❌ Error en render inicial:",a),new Error("Renderer no funciona correctamente")}const s=document.getElementById("about-particles");s&&s.appendChild(this.renderer.domElement)}catch(e){throw console.error("❌ Error en setupThreeJS:",e),e}}createParticleSystems(){const e=new Re,t=new Float32Array(600),i=new Float32Array(600),r=new Float32Array(200),s=new Float32Array(200);for(let o=0;o<200;o++){const l=o*3,c=o/200*Math.PI*4,h=.5+o/200*2;t[l]=Math.cos(c)*h,t[l+1]=Math.sin(c)*h,t[l+2]=o/200*4-2;const d=new oe;this.theme==="dark"?d.setHSL(.6+Math.random()*.1,.8,.6+Math.random()*.4):d.setHSL(.1+Math.random()*.1,.6,.7+Math.random()*.3),i[l]=d.r,i[l+1]=d.g,i[l+2]=d.b,r[o]=.02+Math.random()*.03,s[o]=.001+Math.random()*.002}e.setAttribute("position",new Pe(t,3)),e.setAttribute("color",new Pe(i,3)),e.setAttribute("size",new Pe(r,3)),e.setAttribute("speed",new Pe(s,3));const a=new Dt({uniforms:{time:{value:0},theme:{value:this.theme==="dark"?0:1}},vertexShader:`
                attribute vec3 position;
                attribute vec3 color;
                attribute float size;
                attribute float speed;
                
                uniform mat4 modelViewMatrix;
                uniform mat4 projectionMatrix;
                
                varying float vOpacity;
                varying vec3 vColor;
                
                void main() {
                    vOpacity = 0.8;
                    vColor = color;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,fragmentShader:`
                precision mediump float;
                uniform float time;
                varying float vOpacity;
                varying vec3 vColor;
                
                void main() {
                    float twinkle = 0.7 + 0.3 * sin(time * 2.0 + gl_PointCoord.x * 10.0);
                    float breathing = 0.8 + 0.2 * sin(time * 1.5);
                    float alpha = twinkle * breathing * vOpacity;
                    
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,transparent:!0,depthWrite:!1,blending:vi});this.particles=new _i(e,a),this.scene.add(this.particles)}createConstellationSystem(){for(let e=0;e<6;e++){const t=new Pi,i=[];for(let r=0;r<4;r++){const s=new Wt(.02+Math.random()*.03,8,6),a=new At({color:this.theme==="dark"?6600182:5227511,transparent:!0,opacity:.8}),o=new at(s,a);o.position.set((Math.random()-.5)*3,(Math.random()-.5)*2,(Math.random()-.5)*2),t.add(o),i.push(o)}for(let r=0;r<i.length-1;r++)for(let s=r+1;s<i.length;s++)if(Math.random()>.5){const a=this.createConnection(i[r].position,i[s].position);t.add(a)}this.scene.add(t),this.constellations||(this.constellations=[]),this.constellations.push(t)}}createConnection(e,t){const i=[];i.push(e),i.push(t);const r=new Re().setFromPoints(i),s=new Et({color:this.theme==="dark"?6600182:5227511,transparent:!0,opacity:.3});return new oi(r,s)}createAvatarEffects(){if(!document.getElementById("avatar-particles-container"))return;const e=new Pi;for(let t=0;t<30;t++){const i=this.createOrbitalParticle(t,30);e.add(i)}for(let t=0;t<20;t++){const i=this.createAuraParticle(t,20);e.add(i)}this.avatarParticles=e,this.scene.add(e),e.position.set(0,0,0)}createOrbitalParticle(e,t){const i=new Wt(.008+Math.random()*.012,6,4),r=new At({color:this.theme==="dark"?6600182:5227511,transparent:!0,opacity:.6+Math.random()*.4}),s=new at(i,r),a=e/t*Math.PI*2,o=.8+Math.random()*.4;return s.position.set(Math.cos(a)*o,Math.sin(a)*o*.5,(Math.random()-.5)*.3),s.userData={baseAngle:a,radius:o,speed:.5+Math.random()*.1,phase:Math.random()*Math.PI*2},s}createAuraParticle(e,t){const i=new Wt(.005+Math.random()*.008,4,3),r=new At({color:this.theme==="dark"?5227511:6600182,transparent:!0,opacity:.3+Math.random()*.3}),s=new at(i,r),a=e/t*Math.PI*2,o=1.2+Math.random()*.6;return s.position.set(Math.cos(a)*o,Math.sin(a)*o*.3,(Math.random()-.5)*.2),s.userData={baseAngle:a,radius:o,speed:.3+Math.random()*.7,phase:Math.random()*Math.PI*2,pulseSpeed:1+Math.random()*2},s}createStatsEffects(){const e=document.getElementById("stat-main-exp-particles");e&&(this.statsParticles=this.createParticleContainer(e,30,.6))}createSpecialtyEffects(){document.querySelectorAll(".specialty-inline-item").forEach((e,t)=>{const i=document.createElement("div");i.className="specialty-particles-container",i.style.cssText=`
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100px;
                height: 100px;
                pointer-events: none;
                z-index: 1;
            `,e.style.position="relative",e.appendChild(i),setTimeout(()=>{this.createParticleContainer(i,20,.5)},t*200)})}createTechEffects(){document.querySelectorAll(".tech-tag-compact").forEach((e,t)=>{e.style.position="relative",setTimeout(()=>{const i=document.createElement("div");i.className="tech-particles-container",i.style.cssText=`
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 80px;
                    height: 80px;
                    pointer-events: none;
                    z-index: 1;
                `,e.appendChild(i),this.createParticleContainer(i,15,.4)},t*100)})}createValuesEffects(){document.querySelectorAll(".value-inline-item").forEach((e,t)=>{const i=document.createElement("div");i.className="value-particles-container",i.style.cssText=`
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 120px;
                height: 120px;
                pointer-events: none;
                z-index: 1;
            `,e.style.position="relative",e.appendChild(i),setTimeout(()=>{this.createParticleContainer(i,25,.6)},t*300)})}createParticleContainer(e,t,i){const r=new zi,s=new tr(-1,1,1,-1,.1,1e3),a=new Fi({alpha:!0,antialias:!0});a.setSize(100,100),a.setClearColor(0,0),e.appendChild(a.domElement);const o=new Re,l=new Float32Array(t*3),c=new Float32Array(t*3);for(let p=0;p<t;p++){const f=p*3;l[f]=(Math.random()-.5)*2,l[f+1]=(Math.random()-.5)*2,l[f+2]=0;const v=new oe;v.setHSL(.6+Math.random()*.1,.8,.6+Math.random()*.4),c[f]=v.r,c[f+1]=v.g,c[f+2]=v.b}o.setAttribute("position",new Pe(l,3)),o.setAttribute("color",new Pe(c,3));const h=new on({color:6600182,size:.03,transparent:!0,opacity:i,blending:vi}),d=new _i(o,h);r.add(d);const u=()=>{d.rotation.z+=.01,d.position.x=Math.sin(Date.now()*.001)*.1,d.position.y=Math.cos(Date.now()*.001)*.1,a.render(r,s),requestAnimationFrame(u)};return u(),{scene:r,camera:s,renderer:a,particles:d,animate:u}}setupEventListeners(){window.addEventListener("mousemove",t=>{this.mouse.x=t.clientX/window.innerWidth*2-1,this.mouse.y=-(t.clientY/window.innerHeight)*2+1}),window.addEventListener("resize",()=>{this.handleResize()});const e=document.querySelector(".theme-toggle");e&&e.addEventListener("click",()=>{this.updateTheme()})}handleResize(){if(this.camera&&this.renderer){const e=window.innerWidth/window.innerHeight;this.camera.left=-e,this.camera.right=e,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight)}}updateTheme(){this.theme=document.documentElement.getAttribute("data-theme")||"dark",this.particles&&this.particles.material&&(this.particles.material.uniforms.theme.value=this.theme==="dark"?0:1),this.constellations&&this.constellations.forEach(e=>{e.children.forEach(t=>{t.material&&t.material.color.setHex(this.theme==="dark"?6600182:5227511)})})}activateHoverEffect(e,t){try{switch(t){case"specialty":this.activateSpecialtyHover(e);break;case"tech":this.activateTechHover(e);break;case"value":this.activateValueHover(e);break}}catch(i){console.warn("⚠️ Error activando hover effect:",i)}}deactivateHoverEffect(e,t){try{switch(t){case"specialty":this.deactivateSpecialtyHover(e);break;case"tech":this.deactivateTechHover(e);break;case"value":this.deactivateValueHover(e);break}}catch(i){console.warn("⚠️ Error desactivando hover effect:",i)}}activateSpecialtyHover(e){const t=e.querySelector(".specialty-particles-container");t&&(t.style.opacity="1",t.style.transform="translate(-50%, -50%) scale(1.2)")}deactivateSpecialtyHover(e){const t=e.querySelector(".specialty-particles-container");t&&(t.style.opacity="0.5",t.style.transform="translate(-50%, -50%) scale(1)")}activateTechHover(e){const t=e.querySelector(".tech-particles-container");t&&(t.style.opacity="1",t.style.transform="translate(-50%, -50%) scale(1.3)")}deactivateTechHover(e){const t=e.querySelector(".tech-particles-container");t&&(t.style.opacity="0.5",t.style.transform="translate(-50%, -50%) scale(1)")}activateValueHover(e){const t=e.querySelector(".value-particles-container");t&&(t.style.opacity="1",t.style.transform="translate(-50%, -50%) scale(1.1)")}deactivateValueHover(e){const t=e.querySelector(".value-particles-container");t&&(t.style.opacity="0.5",t.style.transform="translate(-50%, -50%) scale(1)")}handleContextLost(){this.isActive=!1,this.contextLostCount++,this.animationId&&(cancelAnimationFrame(this.animationId),this.animationId=null),this.renderer&&this.renderer.dispose(),console.warn(`⚠️ WebGL Context Lost (${this.contextLostCount}/${this.maxContextLostRetries}) - Recursos limpiados`),this.contextLostCount<=this.maxContextLostRetries&&!this.isRetrying?this.scheduleRetry():this.contextLostCount>this.maxContextLostRetries&&(console.error("❌ Demasiados context lost, cambiando a modo CSS"),this.fallbackToCSS())}scheduleRetry(){if(this.isRetrying)return;this.isRetrying=!0;const e=this.retryDelay*this.contextLostCount;setTimeout(()=>{this.isRetrying=!1,this.attemptRecovery()},e)}attemptRecovery(){try{if(!this.checkWebGLCompatibility()){console.warn("⚠️ WebGL ya no es compatible, usando CSS"),this.fallbackToCSS();return}this.setupThreeJS(),this.createParticleSystems(),this.createConstellationSystem(),this.createAvatarEffects(),this.createStatsEffects(),this.createSpecialtyEffects(),this.createTechEffects(),this.createValuesEffects(),this.isActive=!0,this.animate(),this.contextLostCount=0}catch(e){console.error("❌ Error en recuperación:",e),this.contextLostCount++,this.contextLostCount<=this.maxContextLostRetries?this.scheduleRetry():(console.error("❌ Fallo en recuperación, usando CSS"),this.fallbackToCSS())}}handleContextRestored(){try{this.setupThreeJS(),this.createParticleSystems(),this.createConstellationSystem(),this.isActive=!0,this.animate()}catch(e){console.error("❌ Error restaurando WebGL Context:",e)}}animate(){if(this.isActive)try{this.animationId=requestAnimationFrame(()=>this.animate());const e=Date.now(),t=e-this.lastTime;this.lastTime=e,this.frameCount++,this.frameCount%60===0&&(this.fps=Math.round(1e3/t),this.fps<30&&this.performanceMode==="high"?this.setPerformanceMode("medium"):this.fps>55&&this.performanceMode==="medium"&&this.setPerformanceMode("high"));const i=e*.001;this.particles&&this.particles.material&&(this.particles.material.uniforms.time.value=i,this.particles.rotation.z+=.001,this.particles.scale.setScalar(1+Math.sin(i*.5)*.05)),this.constellations&&this.constellations.forEach((r,s)=>{r.rotation.z+=.002*(s+1),r.position.x=Math.sin(i*.3+s)*.1,r.position.y=Math.cos(i*.3+s)*.1}),this.particles&&(this.particles.position.x=this.mouse.x*.1,this.particles.position.y=this.mouse.y*.1),this.avatarParticles&&this.avatarParticles.children.forEach((r,s)=>{if(r.userData.baseAngle!==void 0){const a=r.userData.baseAngle+i*r.userData.speed;r.position.x=Math.cos(a)*r.userData.radius,r.position.y=Math.sin(a)*r.userData.radius*.5;const o=1+Math.sin(i*r.userData.pulseSpeed)*.2;r.scale.setScalar(o),r.rotation.z+=.01}}),this.renderer&&this.scene&&this.camera&&this.renderer.render(this.scene,this.camera)}catch(e){console.error("❌ Error en animate:",e),this.isActive=!1,setTimeout(()=>{this.handleContextLost()},1e3)}}setPerformanceMode(e){switch(this.performanceMode=e,e){case"high":this.renderer&&this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));break;case"medium":this.renderer&&this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));break;case"low":this.renderer&&this.renderer.setPixelRatio(1);break}}dispose(){try{this.isActive=!1,this.animationId&&(cancelAnimationFrame(this.animationId),this.animationId=null),this.particles&&(this.particles.geometry&&this.particles.geometry.dispose(),this.particles.material&&this.particles.material.dispose(),this.particles=null),this.constellations&&(this.constellations.forEach(e=>{e.children.forEach(t=>{t.geometry&&t.geometry.dispose(),t.material&&t.material.dispose()}),e.clear()}),this.constellations=null),this.renderer&&(this.renderer.dispose(),this.renderer=null),this.scene&&(this.scene.clear(),this.scene=null),this.camera&&(this.camera=null),this.contextLostCount=0,this.isRetrying=!1}catch(e){console.error("❌ Error limpiando About Three.js Engine:",e)}}}class fx{constructor(){this.aboutSection=null,this.aboutThreeEngine=null,this.observer=null,this.isInitialized=!1,this.init()}init(){try{this.setupIntersectionObserver(),this.setupScrollAnimations(),this.setupHoverEffects()}catch(e){console.error("❌ Error inicializando About Animations:",e)}}setupIntersectionObserver(){this.observer=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting?this.onAboutVisible(t.target):this.onAboutHidden(t.target)})},{threshold:.3,rootMargin:"0px 0px -100px 0px"}),this.aboutSection=document.getElementById("about"),this.aboutSection&&this.observer.observe(this.aboutSection)}onAboutVisible(e){this.isInitialized||(this.isInitialized=!0,this.initThreeJSAnimations(),this.activateCSSAnimations(),this.initParticleEffects())}onAboutHidden(e){this.aboutThreeEngine&&(this.aboutThreeEngine.dispose(),this.aboutThreeEngine=null),this.isInitialized=!1}initThreeJSAnimations(){try{if(typeof kh>"u"){console.warn("⚠️ AboutThreeEngine no está disponible, usando animaciones CSS alternativas");return}this.aboutThreeEngine=new kh}catch(e){console.error("❌ Error inicializando About Three.js Engine:",e)}}activateCSSAnimations(){this.aboutSection.querySelectorAll(".animate-fade-in-up").forEach((e,t)=>{const i=parseFloat(e.getAttribute("data-delay"))||0;setTimeout(()=>{e.style.opacity="1",e.style.transform="translateY(0)"},i*1e3)})}initParticleEffects(){this.initAvatarParticles(),this.initStatsParticles(),this.initSpecialtyParticles(),this.initTechParticles(),this.initValuesParticles(),this.initCounterAnimations(),this.initIconAnimations()}initIconAnimations(){document.querySelectorAll(".specialty-icon-inline").forEach((t,i)=>{t.style.animationDelay=`${i*.2}s`,t.classList.add("icon-float")}),document.querySelectorAll(".tech-icon").forEach((t,i)=>{t.style.animationDelay=`${i*.1}s`,t.classList.add("icon-pulse")}),document.querySelectorAll(".value-icon-inline").forEach((t,i)=>{t.style.animationDelay=`${i*.15}s`,t.classList.add("icon-rotate")});const e=document.querySelector(".avatar-icon");e&&e.classList.add("avatar-icon-float")}initAvatarParticles(){const e=document.querySelector(".avatar-container");e&&this.createFloatingParticles(e,30,{color:"var(--primary-color)",size:"2px",duration:"8s"})}initStatsParticles(){document.querySelectorAll(".stat-main-item").forEach((e,t)=>{this.createRisingParticles(e,20,{color:"var(--accent-color)",size:"1px",duration:"6s",delay:t*200})})}initSpecialtyParticles(){document.querySelectorAll(".specialty-inline-item").forEach((e,t)=>{this.createOrbitalParticles(e,15,{color:"var(--primary-color)",size:"1.5px",duration:"10s",delay:t*300})})}initTechParticles(){document.querySelectorAll(".tech-tag-compact").forEach((e,t)=>{this.createExpandingParticles(e,12,{color:"var(--accent-color)",size:"1px",duration:"5s",delay:t*100})})}initValuesParticles(){document.querySelectorAll(".value-inline-item").forEach((e,t)=>{this.createSpiralParticles(e,18,{color:"var(--primary-color)",size:"1.5px",duration:"12s",delay:t*400})})}createFloatingParticles(e,t,i){const r=document.createElement("div");r.className="floating-particles",r.style.cssText=`
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `,e.style.position="relative",e.appendChild(r);for(let s=0;s<t;s++)this.createParticle(r,i,s)}createRisingParticles(e,t,i){const r=document.createElement("div");r.className="rising-particles",r.style.cssText=`
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `,e.style.position="relative",e.appendChild(r);for(let s=0;s<t;s++)this.createRisingParticle(r,i,s)}createOrbitalParticles(e,t,i){const r=document.createElement("div");r.className="orbital-particles",r.style.cssText=`
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `,e.style.position="relative",e.appendChild(r);for(let s=0;s<t;s++)this.createOrbitalParticle(r,i,s)}createExpandingParticles(e,t,i){const r=document.createElement("div");r.className="expanding-particles",r.style.cssText=`
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `,e.style.position="relative",e.appendChild(r);for(let s=0;s<t;s++)this.createExpandingParticle(r,i,s)}createSpiralParticles(e,t,i){const r=document.createElement("div");r.className="spiral-particles",r.style.cssText=`
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `,e.style.position="relative",e.appendChild(r);for(let s=0;s<t;s++)this.createSpiralParticle(r,i,s)}createParticle(e,t,i){const r=document.createElement("div");r.className="particle";const s=i/t.count*Math.PI*2,a=60+Math.random()*40,o=Math.random()*t.duration;r.style.cssText=`
            position: absolute;
            width: ${t.size};
            height: ${t.size};
            background: ${t.color};
            border-radius: 50%;
            top: calc(50% + ${Math.sin(s)*a}px);
            left: calc(50% + ${Math.cos(s)*a}px);
            opacity: 0;
            animation: floatingParticle ${t.duration}s ease-in-out infinite;
            animation-delay: ${o}s;
        `,e.appendChild(r)}createRisingParticle(e,t,i){const r=document.createElement("div");r.className="particle";const s=t.delay+i*50;r.style.cssText=`
            position: absolute;
            width: ${t.size};
            height: ${t.size};
            background: ${t.color};
            border-radius: 50%;
            top: 50%;
            left: 50%;
            opacity: 0;
            animation: risingParticle ${t.duration}s ease-out infinite;
            animation-delay: ${s}ms;
        `,e.appendChild(r)}createOrbitalParticle(e,t,i){const r=document.createElement("div");r.className="particle";const s=i/t.count*Math.PI*2,a=40+Math.random()*20,o=t.delay+i*100;r.style.cssText=`
            position: absolute;
            width: ${t.size};
            height: ${t.size};
            background: ${t.color};
            border-radius: 50%;
            top: calc(50% + ${Math.sin(s)*a}px);
            left: calc(50% + ${Math.cos(s)*a}px);
            opacity: 0;
            animation: orbitalParticle ${t.duration}s linear infinite;
            animation-delay: ${o}ms;
        `,e.appendChild(r)}createExpandingParticle(e,t,i){const r=document.createElement("div");r.className="particle",i/t.count*Math.PI*2;const s=t.delay+i*80;r.style.cssText=`
            position: absolute;
            width: ${t.size};
            height: ${t.size};
            background: ${t.color};
            border-radius: 50%;
            top: 50%;
            left: 50%;
            opacity: 0;
            animation: expandingParticle ${t.duration}s ease-out infinite;
            animation-delay: ${s}ms;
        `,e.appendChild(r)}createSpiralParticle(e,t,i){const r=document.createElement("div");r.className="particle";const s=t.delay+i*200;r.style.cssText=`
            position: absolute;
            width: ${t.size};
            height: ${t.size};
            background: ${t.color};
            border-radius: 50%;
            top: 50%;
            left: 50%;
            opacity: 0;
            animation: spiralParticle ${t.duration}s ease-in-out infinite;
            animation-delay: ${s}ms;
        `,e.appendChild(r)}setupScrollAnimations(){window.addEventListener("scroll",()=>{if(!this.aboutSection||!this.isInitialized)return;const e=this.aboutSection.getBoundingClientRect(),t=(window.innerHeight-e.top)/(window.innerHeight+e.height);t>0&&t<1&&this.updateScrollEffects(t)})}initCounterAnimations(){document.querySelectorAll(".stat-main-number").forEach(e=>{parseInt(e.textContent);const t=e.textContent.replace(/\d/g,""),i=parseInt(e.textContent.replace(/\D/g,""));e.textContent="0"+t;const r=new IntersectionObserver(s=>{s.forEach(a=>{a.isIntersecting&&(this.animateCounter(e,0,i,t),r.unobserve(a.target))})},{threshold:.5});r.observe(e)})}animateCounter(e,t,i,r){const s=performance.now(),a=o=>{const l=o-s,c=Math.min(l/2e3,1),h=1-Math.pow(1-c,4),d=Math.floor(t+(i-t)*h);e.textContent=d+r,e.style.transform=`scale(${1+c*.1})`,e.style.color=`hsl(${200+c*60}, 70%, ${60+c*20}%)`,c<1?requestAnimationFrame(a):(e.style.transform="scale(1)",e.style.color="",this.createCelebrationEffect(e))};requestAnimationFrame(a)}createCelebrationEffect(e){const t=e.parentElement,i=document.createElement("div");i.className="celebration-particles",i.style.cssText=`
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 10;
        `,t.style.position="relative",t.appendChild(i);for(let r=0;r<8;r++){const s=document.createElement("div");s.className="celebration-particle",s.style.cssText=`
                position: absolute;
            width: 6px;
            height: 6px;
            background: linear-gradient(45deg, #64B5F6, #4FC3F7);
            border-radius: 50%;
            animation: celebrationParticle 1.5s ease-out forwards;
            animation-delay: ${r*.1}s;
        `,i.appendChild(s)}setTimeout(()=>{i.remove()},2e3)}updateScrollEffects(e){const t=document.querySelector(".avatar-container");if(t){const i=e*20;t.style.transform=`translateY(${i}px)`}document.querySelectorAll(".stat-main-item").forEach((i,r)=>{const s=Math.max(.3,1-e*.5);i.style.opacity=s})}setupHoverEffects(){document.querySelectorAll(".specialty-inline-item").forEach(e=>{e.addEventListener("mouseenter",()=>{this.activateHoverEffect(e,"specialty")}),e.addEventListener("mouseleave",()=>{this.deactivateHoverEffect(e,"specialty")})}),document.querySelectorAll(".tech-tag-compact").forEach(e=>{e.addEventListener("mouseenter",()=>{this.activateHoverEffect(e,"tech")}),e.addEventListener("mouseleave",()=>{this.deactivateHoverEffect(e,"tech")})}),document.querySelectorAll(".value-inline-item").forEach(e=>{e.addEventListener("mouseenter",()=>{this.activateHoverEffect(e,"value")}),e.addEventListener("mouseleave",()=>{this.deactivateHoverEffect(e,"value")})})}activateHoverEffect(e,t){switch(t){case"specialty":e.style.transform="translateY(-8px) scale(1.05)",e.style.boxShadow="0 20px 40px rgba(100, 181, 246, 0.15)";break;case"tech":e.style.transform="translateY(-5px) scale(1.1)",e.style.boxShadow="0 15px 30px rgba(100, 181, 246, 0.2)";break;case"value":e.style.transform="translateY(-6px) scale(1.03)",e.style.boxShadow="0 18px 35px rgba(100, 181, 246, 0.18)";break}if(this.aboutThreeEngine&&typeof this.aboutThreeEngine.activateHoverEffect=="function")try{this.aboutThreeEngine.activateHoverEffect(e,t)}catch(i){console.warn("⚠️ Error activando hover effect en Three.js:",i)}}deactivateHoverEffect(e,t){if(e.style.transform="translateY(0) scale(1)",e.style.boxShadow="none",this.aboutThreeEngine&&typeof this.aboutThreeEngine.deactivateHoverEffect=="function")try{this.aboutThreeEngine.deactivateHoverEffect(e,t)}catch(i){console.warn("⚠️ Error desactivando hover effect en Three.js:",i)}}destroy(){this.observer&&this.observer.disconnect(),this.aboutThreeEngine&&this.aboutThreeEngine.dispose()}}class gx{constructor(){this.isInitialized=!1,this.modules=new Map,this.eventListeners=new Map,this.visualEngine=null,this.deviceDetector=null,this.mobileMenuManager=null,this.heroAnimations=null,this.aboutAnimations=null}init(){return xt(this,null,function*(){try{yield this.initializeBasicModules(),this.setupBasicFeatures(),yield this.initializeAdvancedModules(),this.setupGlobalEvents(),this.isInitialized=!0,Je.info("✅ Portfolio completamente inicializado")}catch(e){console.error("❌ Error inicializando portfolio:",e)}})}validateConfiguration(){Je.info(`📋 Configuración validada: ${si.APP_NAME} v${si.VERSION}`)}initializeBasicModules(){return xt(this,null,function*(){Je.info("🔧 Inicializando módulos básicos..."),yield this.loadPageComponents(),this.deviceDetector=new cx,Je.info("📱 DeviceDetector inicializado"),this.mobileMenuManager=new hx,Je.info("📱 MobileMenuManager inicializado"),this.heroAnimations=new ip,Je.info("🎭 HeroAnimations inicializado"),this.aboutAnimations=new fx,Je.info("🎭 AboutAnimations inicializado"),yield this.simulateModuleLoad("StyleManager"),yield this.simulateModuleLoad("LanguageSystem"),yield this.simulateModuleLoad("ThemeManager")})}initializeAdvancedModules(){return xt(this,null,function*(){Je.info("🌟 Inicializando módulos avanzados...");try{this.visualEngine=new rx,Je.info("✅ Motor de efectos visuales inicializado");const e=localStorage.getItem("theme")||si.THEMES.DEFAULT;this.visualEngine.updateTheme(e)}catch(e){Je.error("❌ Error inicializando motor visual:",e)}yield this.simulateModuleLoad("UIActionsEngine"),yield this.simulateModuleLoad("NotificationSystem"),yield this.simulateModuleLoad("InteractiveParticlesSystem"),yield this.simulateModuleLoad("ScrollEffectsEngine")})}loadPageComponents(){return xt(this,null,function*(){try{Je.info("📄 Cargando componentes de la página...");const e=ox(),t=nx(),i=ax();if(e.strategy==="sequential")for(const r of t)yield zh.loadComponent(r.name,r.target,r.data),yield this.delay(e.delay);i.length>0&&(yield zh.loadComponents(i))}catch(e){console.error("❌ Error cargando componentes:",e)}})}delay(e){return new Promise(t=>setTimeout(t,e))}simulateModuleLoad(e){return xt(this,null,function*(){return new Promise(t=>{setTimeout(()=>{this.modules.set(e,{name:e,loaded:!0}),Je.info(`📦 Módulo ${e} cargado`),t()},100)})})}setupBasicFeatures(){Je.info("⚙️ Configurando funcionalidades básicas..."),this.setupThemeToggle(),this.setupMobileMenu(),this.setupSmoothScrolling(),this.setupLanguageToggle(),this.setupMobileOptimizations(),this.setupTouchInteractions(),this.setupDynamicLogging()}setupDynamicLogging(){}setupThemeToggle(){const e=st.select("#theme-toggle");if(!e){Je.warn("⚠️ Toggle de tema no encontrado");return}const t=localStorage.getItem("theme")||si.THEMES.DEFAULT;document.documentElement.setAttribute("data-theme",t),this.updateThemeIcon(t),Pt.on(e,"click",()=>{const i=document.documentElement.getAttribute("data-theme")==="light"?"dark":"light";document.documentElement.setAttribute("data-theme",i),localStorage.setItem("theme",i),this.updateThemeIcon(i),this.visualEngine&&this.visualEngine.updateTheme(i),Pt.trigger(window,"themeChanged",{theme:i}),Je.info(`🎨 Tema cambiado a ${i}`)}),Je.info("🎨 Toggle de tema configurado")}updateThemeIcon(e){const t=st.select("#theme-toggle i");t&&(t.className=e==="light"?"fas fa-moon":"fas fa-sun")}setupMobileMenu(){const e=st.select("#menu-toggle"),t=st.select(".nav-links");if(!e||!t){Je.warn("⚠️ Elementos del menú móvil no encontrados");return}e.querySelector("i")&&(e.innerHTML=`
                <span></span>
                <span></span>
                <span></span>
            `),Pt.on(e,"click",()=>{st.toggleClass(t,"active"),st.toggleClass(e,"active"),document.body.style.overflow=t.classList.contains("active")?"hidden":""}),st.selectAll(".nav-link").forEach(i=>{Pt.on(i,"click",()=>{st.removeClasses(t,"active"),st.removeClasses(e,"active"),document.body.style.overflow=""})}),Pt.on(document,"click",i=>{!e.contains(i.target)&&!t.contains(i.target)&&(st.removeClasses(t,"active"),st.removeClasses(e,"active"),document.body.style.overflow="")}),Pt.on(window,"resize",Fh.throttle(()=>{window.innerWidth>si.BREAKPOINTS.MOBILE&&(st.removeClasses(t,"active"),st.removeClasses(e,"active"),document.body.style.overflow="")},100)),Je.info("📱 Menú móvil configurado")}setupSmoothScrolling(){st.selectAll('a[href^="#"]').forEach(e=>{Pt.on(e,"click",t=>{t.preventDefault();const i=st.select(e.getAttribute("href"));if(i){i.scrollIntoView({behavior:"smooth",block:"start"});const r=e.textContent.trim();Je.info(`📍 Navegando a ${r}`)}})}),Je.info("📍 Scroll suave configurado")}setupLanguageToggle(){const e=st.select("#language-toggle");if(!e){Je.warn("⚠️ Toggle de idioma no encontrado");return}const t=localStorage.getItem("language")||si.LANGUAGES.DEFAULT;this.setLanguage(t),Pt.on(e,"click",()=>{const i=this.getCurrentLanguage()==="en"?"es":"en";this.setLanguage(i),Je.info(`🌍 Idioma cambiado a ${i}`)}),Je.info("🌍 Toggle de idioma configurado")}getCurrentLanguage(){return localStorage.getItem("language")||si.LANGUAGES.DEFAULT}setLanguage(e){localStorage.setItem("language",e),document.documentElement.setAttribute("data-language",e),Pt.trigger(window,"languageChanged",{language:e})}setupMobileOptimizations(){/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)&&(st.addClasses(document.body,"mobile-device"),Je.info("📱 Dispositivo móvil detectado, aplicando optimizaciones")),window.innerWidth<=si.BREAKPOINTS.TABLET&&window.innerWidth>si.BREAKPOINTS.MOBILE&&(st.addClasses(document.body,"tablet-device"),Je.info("📱 Tablet detectada, aplicando optimizaciones"))}setupTouchInteractions(){st.selectAll(".btn, .tech-badge, .nav-link, .card").forEach(e=>{Pt.on(e,"touchstart",()=>{e.style.transform="scale(0.95)"}),Pt.on(e,"touchend",()=>{e.style.transform=""}),Pt.on(e,"touchcancel",()=>{e.style.transform=""})}),Je.info("👆 Interacciones táctiles configuradas")}setupGlobalEvents(){let e;Pt.on(window,"scroll",()=>{clearTimeout(e),e=setTimeout(()=>{this.optimizeAfterScroll()},100)}),Pt.on(document,"visibilitychange",()=>{document.hidden?this.pauseAnimations():this.resumeAnimations()}),Pt.on(window,"resize",Fh.throttle(()=>{this.handleResize()},100)),Pt.on(document,"keydown",t=>{this.handleKeyboardEvents(t)}),Je.info("🌐 Eventos globales configurados")}optimizeAfterScroll(){Je.debug("📜 Optimizando después del scroll")}pauseAnimations(){Je.debug("⏸️ Pausando animaciones")}resumeAnimations(){Je.debug("▶️ Reanudando animaciones")}handleResize(){Je.debug("📐 Ventana redimensionada")}handleKeyboardEvents(e){var t;if(e.key==="Escape"){const i=st.select(".nav-links"),r=st.select("#menu-toggle");i&&i.classList.contains("active")&&(st.removeClasses(i,"active"),st.removeClasses(r,"active"))}e.key==="t"&&e.ctrlKey&&(e.preventDefault(),(t=st.select("#theme-toggle"))==null||t.click())}showFallbackMessage(){const e="⚠️ Algunos efectos visuales no están disponibles";Je.warn(e);const t=st.create("div",{className:"fallback-notification",textContent:e});st.addClasses(t,"error"),document.body.appendChild(t),setTimeout(()=>{t.parentNode&&t.remove()},5e3)}getModule(e){return this.modules.get(e)}isReady(){return this.isInitialized}}document.addEventListener("DOMContentLoaded",()=>xt(null,null,function*(){try{const n=new gx;yield n.init(),window.portfolio=n}catch(n){console.error("❌ Error fatal inicializando portfolio:",n)}}))});export default vx();
