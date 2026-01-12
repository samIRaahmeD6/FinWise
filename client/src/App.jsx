import Login from './pages/Login'
import  Register  from './pages/Register'
import Main from './pages/Main'
import { HashRouter, Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import AllTransaction from './pages/AllTransaction';
function App() {
 

  return (
    <>
      <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mainpage" element={<Main />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alltransaction" element={<AllTransaction />} />
      </Routes>
    </HashRouter>
    </>
  )
}

export default App
