import HomePage from './Pages/Home/App';

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

export default function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
            </Routes>
        </Router>
    )
}