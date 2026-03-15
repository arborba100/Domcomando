
import { Image } from '@/components/ui/image';
import { useRef, useState } from "react";

export default function GameMapScreen(){

const mapRef = useRef(null)

const [zoom,setZoom] = useState(1)

const MIN_ZOOM = 0.7
const MAX_ZOOM = 2

function zoomIn(){
setZoom((z)=>Math.min(z+0.2,MAX_ZOOM))
}

function zoomOut(){
setZoom((z)=>Math.max(z-0.2,MIN_ZOOM))
}

function handleWheel(e){

e.preventDefault()

let newZoom = zoom - e.deltaY * 0.001

if(newZoom < MIN_ZOOM) newZoom = MIN_ZOOM
if(newZoom > MAX_ZOOM) newZoom = MAX_ZOOM

setZoom(newZoom)

}

return(

<div className="w-screen h-screen bg-black flex items-center justify-center">

{/* CONTAINER CENTRAL */}

<div
style={{
position:"relative",
height:"100vh",
width:"calc(100vh * 9 / 16)",
maxWidth:"100vw",
overflow:"hidden",
background:"#000"
}}
>

{/* MAPA */}

<div
ref={mapRef}
onWheel={handleWheel}
style={{
width:"100%",
height:"100%",
transform:`scale(${zoom})`,
transformOrigin:"center center",
transition:"transform 0.1s linear"
}}
>

<Image src="/mapa-cidade.png" style={{
width:"100%",
height:"100%",
objectFit:"cover",
pointerEvents:"none"
}} />

</div>

{/* BOTÕES ZOOM */}

<div
style={{
position:"absolute",
right:15,
bottom:20,
display:"flex",
flexDirection:"column",
gap:10
}}
>

<button
onClick={zoomIn}
style={{
width:45,
height:45,
background:"#111",
color:"white",
border:"1px solid #555",
borderRadius:8,
fontSize:22
}}
>
+
</button>

<button
onClick={zoomOut}
style={{
width:45,
height:45,
background:"#111",
color:"white",
border:"1px solid #555",
borderRadius:8,
fontSize:22
}}
>
−
</button>

</div>

</div>

</div>

)

}
