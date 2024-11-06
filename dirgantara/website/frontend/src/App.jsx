import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Contact from "./pages/Contact"
import Home from "./pages/Home"

const App = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dirgantara" element={<Login />} />
        <Route path="/dirgantara/monitoring" element={<Home />} />
        <Route path="/dirgantara/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
