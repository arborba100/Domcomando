import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function CinematicIntro() {

const mountRef = useRef<HTMLDivElement>(null);

useEffect(()=>{

if(!mountRef.current) return;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
2000
);

camera.position.set(0,15,200);

const renderer = new THREE.WebGLRenderer({antialias:true});

renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

mountRef.current.appendChild(renderer.domElement);

const ambient = new THREE.AmbientLight(0xffffff,1);
scene.add(ambient);

const loader = new THREE.TextureLoader();

//
// BACKGROUND CIDADE
//

const bgTexture = loader.load(
"https://static.wixstatic.com/media/50f4bf_f00fd8f0db544aff8e225b236ad4eee1~mv2.png"
);

const bgMaterial = new THREE.MeshBasicMaterial({
map:bgTexture
});

const bgPlane = new THREE.Mesh(
new THREE.PlaneGeometry(700,350),
bgMaterial
);

bgPlane.position.z = -200;

scene.add(bgPlane);

//
// LETREIRO
//

const signTexture = loader.load(
"https://static.wixstatic.com/media/50f4bf_da5491b446c6486a8a26d7d3a300d4d3~mv2.png"
);

const signMaterial = new THREE.MeshBasicMaterial({
map:signTexture,
transparent:true
});

const sign = new THREE.Mesh(
new THREE.PlaneGeometry(120,35),
signMaterial
);

sign.position.y = 8;

scene.add(sign);

//
// PARTÍCULAS (CHUVA / POEIRA)
//

const rainGeometry = new THREE.BufferGeometry();
const rainCount = 2000;

const rainPositions = new Float32Array(rainCount*3);

for(let i=0;i<rainCount;i++){

rainPositions[i*3] = (Math.random()-0.5)*800;
rainPositions[i*3+1] = Math.random()*400;
rainPositions[i*3+2] = (Math.random()-0.5)*600;

}

rainGeometry.setAttribute(
"position",
new THREE.BufferAttribute(rainPositions,3)
);

const rainMaterial = new THREE.PointsMaterial({
color:0xffffff,
size:1,
opacity:0.7,
transparent:true
});

const rain = new THREE.Points(
rainGeometry,
rainMaterial
);

scene.add(rain);

//
// LUZ POLICIAL
//

const policeRed = new THREE.PointLight(0xff0000,3,200);
policeRed.position.set(-60,10,20);
scene.add(policeRed);

const policeBlue = new THREE.PointLight(0x0040ff,3,200);
policeBlue.position.set(60,10,20);
scene.add(policeBlue);

//
// HELICÓPTERO (simulação luz passando)
//

const heliLight = new THREE.SpotLight(0xffffff,6,500,0.5,0.5,1);
heliLight.position.set(-200,120,80);
scene.add(heliLight);

//
// ANIMAÇÃO
//

const startTime = Date.now();

function animate(){

requestAnimationFrame(animate);

const elapsed = Date.now()-startTime;

//
// ZOOM CINEMATOGRÁFICO
//

const progress = Math.min(elapsed/7000,1);
const ease = 1-Math.pow(1-progress,3);

camera.position.z = 200-(ease*160);
camera.position.y = 15-(ease*10);

//
// LETREIRO MOVIMENTO
//

sign.rotation.y = Math.sin(elapsed*0.001)*0.05;

//
// CHUVA CAINDO
//

const positions = rain.geometry.attributes.position.array;

for(let i=0;i<rainCount;i++){

positions[i*3+1]-=1.5;

if(positions[i*3+1]<-50){

positions[i*3+1]=200;

}

}

rain.geometry.attributes.position.needsUpdate=true;

//
// LUZ POLICIAL PISCANDO
//

policeRed.intensity = 2 + Math.sin(elapsed*0.01)*2;
policeBlue.intensity = 2 + Math.cos(elapsed*0.01)*2;

//
// HELICÓPTERO PASSANDO
//

heliLight.position.x = Math.sin(elapsed*0.0004)*250;

renderer.render(scene,camera);

//
// ENTRAR NO JOGO
//

if(elapsed>10000){

document.body.style.transition="opacity 2s";
document.body.style.opacity="0";

setTimeout(()=>{

window.location.href="/game";

},2000);

}

}

animate();

//
// RESPONSIVO
//

function resize(){

camera.aspect = window.innerWidth/window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(window.innerWidth,window.innerHeight);

}

window.addEventListener("resize",resize);

return ()=>{

window.removeEventListener("resize",resize);

renderer.dispose();

};

},[]);

return(

<div
ref={mountRef}
style={{
width:"100vw",
height:"100vh",
background:"#000",
overflow:"hidden"
}}
/>

);

}
