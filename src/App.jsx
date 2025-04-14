import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Routes,Route } from 'react-router-dom';
import Home from './pages/Home';
import Topbar from './components/Topbar';
import Speech from './pages/Speech';
import Sentiment from './pages/Sentiment';
import About from './pages/About';

function App() {

  return (
    <>
      <Topbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/speech' element={<Speech />}/>
        <Route path='/sentiment' element={<Sentiment />}/>
        <Route path='/about' element={<About />}/>
      </Routes>
        
    </>
  )
}

export default App
