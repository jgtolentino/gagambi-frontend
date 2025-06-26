import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Enrichments from './pages/Enrichments';
import ScrapedPosts from './pages/ScrapedPosts';
import JudgeResults from './pages/JudgeResults';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="enrichments" element={<Enrichments />} />
          <Route path="posts" element={<ScrapedPosts />} />
          <Route path="judge-results" element={<JudgeResults />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;