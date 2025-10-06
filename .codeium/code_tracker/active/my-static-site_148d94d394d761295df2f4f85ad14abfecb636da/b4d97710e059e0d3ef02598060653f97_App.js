Ôimport React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import About from './About';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
Ô"(148d94d394d761295df2f4f85ad14abfecb636da2_file:///c:/Users/BisaiSantoshKumar%28Qu/Desktop/Static%20React%20Site/my-static-site/src/App.js:Tfile:///c:/Users/BisaiSantoshKumar%28Qu/Desktop/Static%20React%20Site/my-static-site