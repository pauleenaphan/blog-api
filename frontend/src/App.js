import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Login } from './pages/login';
import { CreateAccount } from './pages/signup';
import { Homepage } from './pages/home';
import { BlogPost } from './pages/blogPost';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<CreateAccount/>}/>
        <Route path="/blogpost/:postId" element={<BlogPost/>}/>
      </Routes>
    </Router>
  );
}

export default App;
