import React, { useEffect, useRef, useState } from 'react'
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import japan from "./assets/image1.jpg"
import * as cocoSsd from "@tensorflow-models/coco-ssd";



const App = () => {
  const imageRef = useRef(null)
  const resRef = useRef(null)
  const [modelPromise, setModelPromise] = useState(null)

  useEffect(() => {

    setModelPromise(cocoSsd.load())
  }, [])

  const seeRef = () => {
    console.log(imageRef.current.src)
  }

  const changeModel = async (e) => {

    const model = await modelPromise
    model.dispose();


    setModelPromise(
      cocoSsd.load({
        base: e.target.value,
        })
    )
  }


  const renderDetection = async () => {
  const model = await modelPromise;

  console.log("model loaded");
  console.time("predict1");

  const result = await model.detect(imageRef.current);
  console.timeEnd("predict1");

  const c = resRef.current;
  // const c = document.getElementById("canvas");
  const context = c.getContext("2d");

  // Added dWidth and dHeight for proper dimension
  context.drawImage(imageRef.current, 0, 0, 600, 399);
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
  }
  
  return (
    <>
    <div>
      <select id="base_model" onChange={changeModel}>
        <option value="lite_mobilenet_v2">SSD Lite Mobilenet V2</option>
        <option value="mobilenet_v1">SSD Mobilenet v1</option>
        <option value="mobilenet_v2">SSD Mobilenet v2</option>
      </select>
    </div>
    <div className='text-[4rem]'>Hello world</div>
    <img src={japan} alt="japan" ref={imageRef}/>
    <canvas id="canvas" width="600" height="399" ref={resRef}></canvas>

    <button onClick={renderDetection}>Click</button>
    </>
  )
}

export default App