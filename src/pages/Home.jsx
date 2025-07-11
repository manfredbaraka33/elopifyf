import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='text-light container p-3 mt-5'>
      <center>
        <h2>Welcome to Elopify Healthcare AI!</h2>
        <h4>Analyze patient feedback instantly and route it to the right department.</h4>
        <div className="row mt-5 p-3">

          <div className="col-sm-10 col-md-5 col-lg-5 bg-transparent shadow-lg rounded p-3 my-2">
            <h2 className='text-info'>Check Patient Sentiment</h2>
            <p>Is the patient feedback positive, neutral, or negative? Get instant sentiment insights.</p>
            <Link to="/sentiment" className='btn btn-primary mt-3 border border-info border-3'>
              Analyze Sentiment
            </Link>
          </div>

{/*           <div className="col"></div>

          <div className="col-sm-10 col-md-5 col-lg-5 bg-transparent shadow-lg rounded p-3 my-2">
            <h2 className='text-info'>Assign to Department</h2>
            <p>Automatically classify feedback into Reception, Emergency, Pharmacy, Lab, or Other.</p>
            <Link to="/sentiment" className='btn btn-primary mt-3 border border-info border-3'>
              Classify Department
            </Link>
          </div> */}

        </div>
      </center>
    </div>
  )
}

export default Home
