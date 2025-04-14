import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='text-light container p-3 mt-5'>
       <center> 
        <h2>Hello, genius!</h2>
        <h4>Ready to see what Elopify can do with your text?</h4>
        <div className="row mt-5 p-3">
            
        <div className="col-sm-10 col-md-5 col-lg-5  bg-transparent shadow-lg rounded p-3 my-2">
                <h2 className='text-warning'>What’s the Mood?</h2>
                <p>Is your text feeling good or bad? Let’s figure out if it’s all sunshine or storm clouds</p>
                <Link to="/sentiment" className='btn btn-primary mt-3 border border-warning border-3'>Check the Sentiment!</Link>
            </div>
            <div className="col"></div>
           
            <div className="col-sm-10 col-md-5 col-lg-5 bg-transparent shadow-lg shadow-light rounded p-3 my-2">
                <h2 className='text-warning'>Time to Call Out the Hate!</h2>
                <p>Let's find out if your text is spreading good vibes or causing a stir</p>
                <Link to="/speech" className='btn btn-primary mt-3 border-warning border-3'>Spot the Trouble!</Link>
            </div>
        </div>
       </center>
    </div>
  )
}

export default Home