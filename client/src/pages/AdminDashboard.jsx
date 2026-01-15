import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalNewspapers: 0,
        published: 0,
        totalViews: 0
    });
    const [newspapers, setNewspapers] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data } = await axios.get('/api/admin/newspapers');
            setNewspapers(data);

            // Calculate stats
            const publishedCount = data.filter(n => n.isPublished).length;
            const viewCount = data.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);

            setStats({
                totalNewspapers: data.length,
                published: publishedCount,
                totalViews: viewCount
            });
        } catch (error) {
            console.error("Error fetching admin data", error);
        }
    };

    const togglePublish = async (id) => {
        try {
            await axios.put(`/api/admin/newspaper/${id}/publish`);
            fetchData();
        } catch (error) {
            console.error("Error toggling publish", error);
        }
    };

    const deleteNewspaper = async (id) => {
        if (window.confirm('Are you sure you want to delete this newspaper?')) {
            try {
                await axios.delete(`/api/admin/newspaper/${id}`);
                fetchData();
            } catch (error) {
                console.error("Error deleting newspaper", error);
            }
        }
    };

    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.header}>
                <h1>Admin Dashboard</h1>
                <Link to="/admin/upload" className={styles.uploadBtn}>+ Upload New Newspaper</Link>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <h3>Total Newspapers</h3>
                    <p>{stats.totalNewspapers}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Published</h3>
                    <p>{stats.published}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>Total Views</h3>
                    <p>{stats.totalViews}</p>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <h2>Newspapers Management</h2>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Preview</th>
                            <th>Date</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Views</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newspapers.map(paper => (
                            <tr key={paper._id}>
                                <td>
                                    {paper.coverImageUrl ? (
                                        <img src={paper.coverImageUrl} alt="" style={{width: '60px', height: '80px', objectFit: 'cover'}} />
                                    ) : (
                                        <div style={{width: '60px', height: '80px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px'}}>No preview</div>
                                    )}
                                </td>
                                <td>{new Date(paper.date).toLocaleDateString()}</td>
                                <td>{paper.title}</td>
                                <td>
                                    <span className={paper.isPublished ? styles.badgePublished : styles.badgeDraft}>
                                        {paper.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td>{paper.viewCount}</td>
                                <td className={styles.actions}>
                                    <Link to={`/admin/map/${paper._id}`} className={styles.actionBtn}>Map Areas</Link>
                                    <button
                                        onClick={() => togglePublish(paper._id)}
                                        className={styles.actionBtn}
                                    >
                                        {paper.isPublished ? 'Unpublish' : 'Publish'}
                                    </button>
                                    <button
                                        onClick={() => deleteNewspaper(paper._id)}
                                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
