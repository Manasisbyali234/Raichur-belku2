import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout, PrivateRoute, AdminRoute } from './components/RouteGuards';
import { pdfjs } from 'react-pdf';
import { useEffect, useState } from 'react';
import axios from './axiosConfig';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Pages
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register'; // Need to create
import NewspaperViewer from './pages/NewspaperViewer';
import AdminDashboard from './pages/AdminDashboard';
import UploadNewspaper from './pages/UploadNewspaper';
import PDFMapper from './pages/PDFMapper';

const NewspaperRedirect = () => {
  const [latestId, setLatestId] = useState(null);
  
  useEffect(() => {
    axios.get('/api/user/newspapers').then(({ data }) => {
      if (data.newspapers?.length > 0) {
        setLatestId(data.newspapers[0]._id);
      }
    });
  }, []);
  
  return latestId ? <Navigate to={`/newspaper/${latestId}`} replace /> : <div>Loading...</div>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/newspaper" element={<NewspaperRedirect />} />
            <Route path="/newspaper/:id" element={<NewspaperViewer />} />

            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/upload" element={<UploadNewspaper />} />
              <Route path="/admin/map/:id" element={<PDFMapper />} />
            </Route>
          </Route>

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
