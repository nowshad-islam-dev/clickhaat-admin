// import Layout from './components/Layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import PrivateRoute from './HOC/PrivateRoute';
function App() {
  return (
    <>
      <div className="App">
        <Router>
          <Routes>
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
            </Route>

            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
