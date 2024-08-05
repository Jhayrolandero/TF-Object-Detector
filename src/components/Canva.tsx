import React from 'react'

const Canva = ({ref, title, objects, enableModel}) => {


  const checkModel = (e) => {
    enableModel(e.target.checked)
  }

  return (
    <div className='flex-1'>
      <div>
        <h4>{title}</h4>
        <input type="checkbox" onChange={checkModel}/>
      </div>
        <canvas ref={ref}></canvas>
        <div>
      { objects && objects.length ? 
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
    </div>

    </div>
  )
}

export default Canva