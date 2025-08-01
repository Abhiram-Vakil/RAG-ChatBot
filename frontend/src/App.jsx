import ChatBot from "./pages/ChatBot";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router";
import PdfExtract from "./pages/PdfExtract";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

function App() {
  return (
    <div>
      <NavBar />

        <Routes>
          <Route path="/" element={<ChatBot />} />
          <Route path="/pdf-chunking" element={<PdfExtract />} />
        </Routes>
        <Footer />
    </div>
  );
}

export default App;
