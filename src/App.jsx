import React, { useEffect, useRef, useState } from 'react'
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import japan from "./assets/image1.jpg"
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import Canva from './components/Canva';


const App = () => {
  const imageRef = useRef(null)
  const [image, setImage] = useState(null)
  const [dimension, setDimension] = useState({width: 0, height: 0})

  const ssdLiteRef = useRef(null)
  const ssdV1 = useRef(null)
  const ssdV2 = useRef(null)

  const [enaLite, setEnaLite] = useState(false)
  const [enaV1, setEnaV1] = useState(false)
  const [enaV2, setEnaV2] = useState(false)

  const [modelPromise, setModelPromise] = useState(null)
  const [ssdV1Obj, setSSDV1Obj] = useState([])
  const [ssdV2Obj, setSSDV2Obj] = useState([])
  const [ssdLiteObj, setSSDLiteObj] = useState([])



  useEffect(() => {
    setModelPromise(cocoSsd.load())
  }, [])

  const renderPicture = () => {

    setSSDLiteObj(
      renderFactory(
        cocoSsd.load({
          base: "lite_mobilenet_v2"
        }), ssdLiteRef
      )
    )
    setSSDV1Obj(
      renderFactory(
        cocoSsd.load({
          base: "mobilenet_v1"
        }), ssdV1
      )
    )

    setSSDV2Obj(
      renderFactory(
        cocoSsd.load({
          base: "mobilenet_v2"
        }), ssdV2
      )
    )
  }

  const renderFactory = async (modelProm, canvaRef) => {

    try {

      const model = await modelProm

      const result = await model.detect(imageRef.current);

      const c = canvaRef.current
      
      const context = c.getContext("2d");

      context.canvas.width = dimension.width
      context.canvas.height = dimension.height
      // Added dWidth and dHeight for proper dimension
      context.drawImage(imageRef.current, 0, 0, dimension.width, dimension.height);
      context.font = "12px Arial";
    
      console.log("number of detections: ", result.length);
      for (let i = 0; i < result.length; i++) {
        context.beginPath();
        context.rect(...result[i].bbox);
        context.lineWidth = 1;
        context.strokeStyle = "red";
        context.fillStyle = "red";
        context.stroke();
        context.fillText(
          result[i].score.toFixed(3) + " " + result[i].class,
          result[i].bbox[0],
          result[i].bbox[1] > 10 ? result[i].bbox[1] - 5 : 10
        );
      }

      return renderObject(result)
  } catch (err) {
    console.error(err)
  }
  }

  const renderObject = (res) => {
    const data = res.map(x => ({
      class: x.class,
      score: x.score.toFixed(2)
    }))

    return data
    // setObjects(data)
  }
  
  const handleImage = (e) => {
    console.log(e.target.files)
    let newImage = new Image()
    newImage.src = URL.createObjectURL(e.target.files[0])
    
    newImage.onload = () => {
      setDimension({
        width: newImage.width, 
        height: newImage.height  
      })
      console.log(`${newImage.width} - ${newImage.height}`)
    }

    setImage(URL.createObjectURL(e.target.files[0]))
  }

  return (
    <>
    <header className=' bg-blue-600 text-white font-bold text-[1.5rem] px-[2rem] py-2'>
      <h4>Detect'O</h4>
    </header>
    <main className='px-[5rem]'>
    <button onClick={renderPicture} className='border-2 p-2 rounded-lg border-black text-[1.5rem]'>Click</button>
    <div>
      <input type="file" onChange={handleImage}/>
      <img src={image ? image : ''}  alt="image" ref={imageRef}/>
    </div>
    <div className='flex gap-4 '>
      <Canva 
        ref={ssdV1} 
        title={"Mobilenet V1"} 
        objects={ssdV1Obj} 
        enableModel={(data) => setEnaV1(data)}
        />
    {enaV1}
      <Canva 
        ref={ssdV2} 
        title={"Mobilenet V2"} 
        objects={ssdV2Obj} 
        enableModel={(data) => setEnaV2(data)}
        />

        {enaV2}
      <Canva 
        ref={ssdLiteRef} 
        title={"Mobilenet Lite"} 
        objects={ssdLiteObj} 
        enableModel={(data) => setEnaLite(data)}
        />
        {enaLite}
    </div>
    </main>
    </>
  )
}

export default App