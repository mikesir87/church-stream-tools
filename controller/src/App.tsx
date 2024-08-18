import './App.sass';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StreamControlRoute } from './components/StreamControlRoute';
import { StreamSetupRoute } from './components/setup/StreamSetupRoute';
import { StreamContextProvider } from './components/stream/StreamContext';

function App() {
  return (
    <div className="App">
      <BrowserRouter basename='/controller'>
        <StreamContextProvider>
          <Routes>
            <Route index element={<StreamControlRoute />} />
            <Route path="/setup" element={<StreamSetupRoute />} />
          </Routes>
        </StreamContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
