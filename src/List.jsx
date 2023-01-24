import { useState, useEffect, useRef } from 'react'
import { Link, Outlet } from 'react-router-dom'
import './List.css'

export default function List() {
	const [data, setData] = useState([])


	// fetching data from database
	useEffect(() => {
		fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getvehiclevariablelist?format=json')
		  .then(response => {
		  	if (response.status === 200) {
		  		response.json().then(function (data) {
		  			return setData(data.Results)

		  		})
		  	}
		  })
	}, [])

	return(
		<div className='List'>

			<div className='headerDiv'>
		    	<h1><em>Vin-decoder</em></h1>
		    </div>

		    <div className='linkDiv'>
		       <Link to='/'>Back to results</Link>
		    </div>


			<div className="resultList">
				{data.length > 0 && <h1>List of all posible characteristics of a vehicle</h1>}
				{data.map((item, index) => {
					const strippedText = item.Description.replace(/(<([^>]+)>)/gi, "")
					return(
						<table>
							<tbody>
								<tr key={index}>
									<td>{item.Name}</td>
									<td>{strippedText}</td>
								</tr>
							</tbody>
						</table>
					)
				})}

			</div>
			
		</div>
	)
}