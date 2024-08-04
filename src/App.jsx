import React, { useEffect, useRef, useState } from 'react'
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import japan from "./assets/image1.jpg"
import * as cocoSsd from "@tensorflow-models/coco-ssd";



const App = () => {
  const imageRef = useRef(null)
  const resRef = useRef(null)
  const [modelPromise, setModelPromise] = useState(null)
  const [objects, setObjects] = useState([])
  const [image, setImage] = useState(null)
  const [dimension, setDimension] = useState({width: 0, height: 0})

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

  context.canvas.width = dimension.width
  context.canvas.height = dimension.height
  // Added dWidth and dHeight for proper dimension
  context.drawImage(imageRef.current, 0, 0);
  context.font = "12px Arial";



  renderObject(result)
  // console.log(result)

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

  const renderObject = (res) => {
    const data = res.map(x => ({
      class: x.class,
      score: x.score.toFixed(2)
    }))


    setObjects(data)
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
    <div>
      <select id="base_model" onChange={changeModel}>
        <option value="lite_mobilenet_v2">SSD Lite Mobilenet V2</option>
        <option value="mobilenet_v1">SSD Mobilenet v1</option>
        <option value="mobilenet_v2">SSD Mobilenet v2</option>
      </select>
    </div>
    <div className='text-[4rem]'>Hello world</div>
    <button onClick={renderDetection} className='border-2 p-2 rounded-lg border-black text-[1.5rem]'>Click</button>
    <div>
      <input type="file" onChange={handleImage}/>
      <img src={image ? image : ''}  alt="image" ref={imageRef}/>
    </div>
    <div className='flex gap-4 max-w-[480px]'>
      <canvas id="canvas" className='max-w-[480px]'  ref={resRef}></canvas>
    </div>
    <li>
      { objects.length ? 
      
      <table className='border-2 border-black w-[480px]'>
        <tr className=' border-2 border-black'>
          <th>Class</th>
          <th>Score</th>
        </tr>
        {
          objects.map((x, idx) => 
          <tr key={idx} className=' border-2 border-black'>
            <td>
              {x.class}
            </td>
            <td>
              {x.score}
            </td>
          </tr>  
          )
        }
      </table>
        :
          <h4>None is detected</h4>
      }
      <ul>

      </ul>
    </li>
    </>
  )
}

export default App