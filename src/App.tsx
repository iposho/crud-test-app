import { Route, Routes } from 'react-router-dom';

import Home from './pages/Home.tsx';
import Navigation from './components/layout/Navigation.tsx';
import Record from './pages/Record.tsx';

const App = () => {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/records/add" element={<Record />} />
        <Route path="/records/:id" element={<Record />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  )
}

export default App
