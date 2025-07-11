import React from 'react'
import { Link } from 'react-router-dom'
const Topbar = () => {
  return (
<nav  className="navbar fixed-top navbar-expand-sm  navbar-dark">
  <div style={{backgroundColor:"#35374B"}} className="container-fluid">
    <Link to="/" style={{color:"white",fontFamily:"monospace",textDecoration:"none",fontWeight:"bolder",fontSize:"larger"}} classNameName="navbar-brand mx-4" >Elopify</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div  className="collapse navbar-collapse" id="collapsibleNavbar">
      <ul style={{fontFamily:"monospace"}} className="navbar-nav">
        <li className="nav-item mx-3">
          <Link className="nav-link" to="/sentiment" >Sentiment</Link>
        </li>
{/*         <li className="nav-item mx-3">
          <Link className="nav-link" to="/speech">Speech</Link>
        </li> */}
        <li className="nav-item mx-3">
          <Link className="nav-link" to="/about">About</Link>
        </li>    
      </ul>
    </div>
  </div>
</nav>
  )
}

export default Topbar
