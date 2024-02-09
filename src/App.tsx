import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import StoryList from './pages/StoryList';
import ViewPlanSM from './pages/ViewPlanSM';

const App = () => {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/story-list" element={<StoryList />} />
            <Route path="/view-plan-sm" element={<ViewPlanSM />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
