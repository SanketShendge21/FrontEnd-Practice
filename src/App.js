import React, { useState } from 'react'
import './App.css';
import Navbar from './components/Navbar';
import HomeImage from './components/HomeImage';
import Articles from './components/Articles';
import LoadingBar from 'react-top-loading-bar';


function App() {
  const [progress, setProgress] = useState(0)
  return (
    <div>

      <LoadingBar
        height={3}
        color='#f11946'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <Navbar></Navbar>
      <HomeImage></HomeImage>
      <Articles setProgress={setProgress}></Articles>

    </div>
  );
}

export default App;
