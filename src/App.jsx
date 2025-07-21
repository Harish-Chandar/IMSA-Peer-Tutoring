import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import ScheduleForm from "./pages/ScheduleForm.jsx";


function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/scheduleform" element={<ScheduleForm />} />

                </Routes>
            </div>
        </Router>
    );
}

export default App;
