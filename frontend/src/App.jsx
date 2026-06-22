import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LandingPage from './pages/landingPage';
import Authentication from './pages/authentication.jsx';
import { AuthProvider } from './contexts/AuthContext';
import VideoMeet from './pages/VideoMeet.jsx';
import HomeComponent from './pages/home.jsx';
import History from './pages/history.jsx';

const App = () => {
  return (
    <div className='App'>

      <Router>
        <AuthProvider>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/auth' element={<Authentication />} />
            <Route path= "/home"element={<HomeComponent/>}/>
            <Route path='/:url' element={<VideoMeet />} />
            <Route path='/history' element = {<History/>}/>
          </Routes>
        </AuthProvider>
      </Router>

    </div>
  );
};

export default App;