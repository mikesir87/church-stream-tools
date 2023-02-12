import './App.sass';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StreamControlRoute } from './components/StreamControlRoute';

function App() {
  return (
    <div className="App">
      <BrowserRouter basename='/controller'>
        <Routes>
          <Route path="/" element={<StreamControlRoute />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
