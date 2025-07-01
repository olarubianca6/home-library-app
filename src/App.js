import Library from "./pages/Library";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Stats from './pages/Stats';
import AddBook from "./pages/AddBook";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Library />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/add" element={<AddBook />} />
      </Routes>
    </Router>
  );
}

export default App;