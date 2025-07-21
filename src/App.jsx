import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from "./pages/Home.jsx";
import Navbar from "./components/Navbar.jsx";
import ScheduleForm from "./pages/ScheduleForm.jsx";
import CheckInTutors from "./pages/CheckInTutors.jsx";


function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Homepage />} />
                    <Route path="/scheduleform" element={<ScheduleForm />} />
                    <Route path="/checkin" element={<CheckInTutors />} />

                </Routes>
            </div>
        </Router>
    );
}

export default App;
