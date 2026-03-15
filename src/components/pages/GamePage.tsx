import { useState, useRef } from "react";

export default function GameMapScreen(){

const mapRef = useRef(null);

const [coords,setCoords] = useState({x:0,y:0});
const [zoom,setZoom] = useState(1);
const [position,setPosition] = useState({x:0,y:0});
const [dragging,setDragging] = useState(false);
const [startDrag,setStartDrag] = useState({x:0,y:0});

const buildings = [
{ name:"Barraco", x:300, y:600 },
{ name:"Cassino", x:800, y:420 },
{ name:"Delegacia", x:600, y:250 },
{ name:"Arsenal", x:1000, y:500 },
{ name:"Prefeitura", x:500, y:350 },
{ name:"Lavanderia", x:900, y:650 }
];

function getCoords(e){

const rect = mapRef.current.getBoundingClientRect();

const clientX = e.touches ? e.touches[0].clientX : e.clientX;
const clientY = e.touches ? e.touches[0].clientY : e.clientY;

const x = Math.round((clientX - rect.left - position.x)/zoom);
const y = Math.round((clientY - rect.top - position.y)/zoom);

setCoords({x,y});

}

function startDragHandler(e){

const clientX = e.touches ? e.touches[0].clientX : e.clientX;
const clientY = e.touches ? e.touches[0].clientY : e.clientY;

setDragging(true);

setStartDrag({
x:clientX - position.x,
y:clientY - position.y
});

}

function dragHandler(e){

if(!dragging) return;

const clientX = e.touches ? e.touches[0].clientX : e.clientX;
const clientY = e.touches ? e.touches[0].clientY : e.clientY;

setPosition({
x:clientX - startDrag.x,
y:clientY - startDrag.y
});

}

function stopDrag(){

setDragging(false);

}

function handleZoom(e){

let newZoom = zoom - e.deltaY * 0.001;

if(newZoom < 0.6) newZoom = 0.6;
if(newZoom > 2) newZoom = 2;

setZoom(newZoom);

}

return(

<div
className="w-screen h-screen overflow-hidden bg-black"
onMouseMove={dragHandler}
onMouseUp={stopDrag}
onTouchMove={dragHandler}
onTouchEnd={stopDrag}
onWheel={handleZoom}
>

<div
ref={mapRef}
onMouseDown={startDragHandler}
onTouchStart={startDragHandler}
onClick={getCoords}
style={{
position:"relative",
width:"1500px",
height:"1500px",
transform:`translate(${position.x}px,${position.y}px) scale(${zoom})`,
transformOrigin:"top left"
}}
>

{/* MAPA */}

<img
src="/mapa-cidade.png"
style={{
width:"100%",
height:"100%",
position:"absolute",
objectFit:"cover"
}}
/>

{/* MARCADOR */}

<div
style={{
position:"absolute",
left:coords.x,
top:coords.y,
width:18,
height:18,
background:"red",
borderRadius:"50%",
transform:"translate(-50%,-50%)",
pointerEvents:"none"
}}
/>

{/* PRÉDIOS */}

{buildings.map((b,i)=>(
<div
key={i}
style={{
position:"absolute",
left:b.x,
top:b.y,
transform:"translate(-50%,-50%)",
textAlign:"center"
}}
>

<img
src="/icons/building.png"
style={{width:36}}
/>

<div style={{color:"white",fontSize:12}}>
{b.name}
</div>

</div>
))}

</div>

{/* HUD COORDENADAS */}

<div
style={{
position:"fixed",
top:15,
left:15,
background:"rgba(0,0,0,0.7)",
color:"white",
padding:"8px 12px",
borderRadius:6,
fontSize:13
}}
>

X: {coords.x}
<br/>
Y: {coords.y}
<br/>
Zoom: {zoom.toFixed(2)}

</div>

</div>

);

}
