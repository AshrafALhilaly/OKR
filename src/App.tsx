import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Objectives from './pages/Objectives';
import KeyResults from './pages/KeyResults';
import Teams from './pages/Teams';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="objectives" element={<Objectives />} />
        <Route path="key-results" element={<KeyResults />} />
        <Route path="teams" element={<Teams />} />
      </Route>
    </Routes>
  );
}

export default App;