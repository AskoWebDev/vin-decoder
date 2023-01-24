import { useState, useEffect } from 'react'
import { Link, Route, Routes, Outlet } from 'react-router-dom'
import './App.css'

import List from './List.jsx'

function App() {
  const [vin, setVin] = useState('')
  const [list, setList] = useState([])
  const [storage, setStorage] = useState([])

  // splits VIN-code by character for validation
  const lengthOfVin = vin.split('')
  
  // getting data from database
  function getData(e) {
    e.preventDefault()
    
      // validation of input
      if (lengthOfVin.length < 17 || vin.match(/[!@#$%^&*(),.?":{}|<>]/g) || vin == '') {
        return alert('Enter a valid VIN-code')
      }
      fetch('https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/' + vin + '?format=json')
          .then(
              function (response) {
                  if (response.status !== 200) {
                      console.log('Looks like there was a problem. Status Code: ' + response.status);
                      return;
                  }
                  // Format the response data.
                  response.json().then(function (data) {
                      setStorage(arr => [...arr, vin])
                      return setList(data.Results)
                      
                  });
              }
          )
  }


 
  return (
    <div className="App">
      <div className='headerDiv'>
        <h1><em>Vin-decoder</em></h1>
      </div>
      <div className='linkDiv'>
        <Link to='/list'>List of all posible characteristics of a vehicle</Link>
      </div>
      <div className='formDiv'>
        <form method='GET'>
          <label htmlFor='vin'>VIN:</label>
          <input id='vin' placeholder='Enter VIN code' name='vin_code' onChange={e => setVin(e.target.value)} />
          <button type='submit' onClick={getData}>Submit</button>
        </form>
      </div>
      
      {/* Show the most recent searched VINs */}
      <div className='searchedVins'>
        {storage.length !== 0 && <hr />}
        {storage.length !== 0 && <h1>Recently searched VINs</h1>}
        {storage.slice(-5).map((item, index) => {
          
            return(
              <ul key={index}>
                <li>{item}</li>
              </ul>
            )
        })}
        {storage.length !== 0 && <hr />}
      </div>
      
      {/* Shows the results of decoding of a VIN */}
      <div className="resultList">
        {list.length > 0 && <h1>Results</h1>}
        {list.map((item, index) => {
          if (item.Value !== '' && item.Value !== null && item.Value !== '0' && item.Variable !== 'Error Text') {
            return(
              <table>
                <tbody>
                  <tr key={index}>
                    <td>{item.Variable}</td>
                    <td>{item.Value}</td>
                  </tr>
                </tbody>
              </table>
            )
          }  
        })}
        
      </div>
      
    </div>
  )
}

export default App
