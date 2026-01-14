import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import InteractivePDFViewer from '../components/InteractivePDFViewer';
import NewsModal from '../components/NewsModal';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const NewspaperViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newspaper, setNewspaper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedArea, setSelectedArea] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchNewspaper = async () => {
            try {
                const { data } = await axios.get(`/api/user/newspaper/${id}`);
                setNewspaper(data);

                // Increment view count
                await axios.get(`/api/user/newspaper/${id}/view`);
            } catch (error) {
                console.error("Error fetching newspaper", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNewspaper();
    }, [id]);

    if (loading) return <div>Loading...</div>;

    if (!newspaper) return <div>Newspaper not found</div>;

    return (
        <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
            <div style={{ padding: '10px 20px', background: 'white', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', marginRight: '20px' }}>&larr;</button>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{newspaper.title}</h2>
                <span style={{ marginLeft: 'auto', fontSize: '0.9rem', color: '#666' }}>
                    {new Date(newspaper.date).toLocaleDateString()}
                </span>
            </div>

            <InteractivePDFViewer
                pdfUrl={newspaper.pdfUrl}
                mappedAreas={newspaper.mappedAreas}
                onAreaClick={(area) => setSelectedArea(area)}
                maxPages={user ? null : 2}
            />

            {!user && (
                <div style={{ textAlign: 'center', padding: '10px', background: '#fff3cd', color: '#856404' }}>
                    Guest Mode: Preview limited to first 2 pages. <Link to="/login">Login</Link> for full access.
                </div>
            )}

            {selectedArea && (
                <NewsModal area={selectedArea} onClose={() => setSelectedArea(null)} />
            )}
        </div>
    );
};

export default NewspaperViewer;
