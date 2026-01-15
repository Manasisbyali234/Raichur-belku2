import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './NewsAPIFeed.module.css';

const NewsAPIFeed = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('general');

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                // In a real app, this call should go through your backend to hide the API KEY
                // or use a free public endpoint for demo.
                // Using a placeholder response for now as I don't have a valid API Key.
                // const { data } = await axios.get(`https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=YOUR_API_KEY`);

                // MOCK DATA
                const mockData = [
                    {
                        title: "Local Development Projects Announced",
                        description: "The city council has approved a new series of infrastructure projects starting next month.",
                        urlToImage: "https://placehold.co/300x200/4A90E2/ffffff?text=Development",
                        url: "#",
                        source: { name: "Raichur Times" }
                    },
                    {
                        title: "Farmers Expect Record Harvest",
                        description: "Favorable monsoon rains have led to predictions of record crop yields in the district.",
                        urlToImage: "https://placehold.co/300x200/4A90E2/ffffff?text=Agriculture",
                        url: "#",
                        source: { name: "State News" }
                    },
                    {
                        title: "Tech Park to Open New Wing",
                        description: "The local technology park is expanding with a new wing dedicated to AI startups.",
                        urlToImage: "https://placehold.co/300x200/4A90E2/ffffff?text=Tech+Park",
                        url: "#",
                        source: { name: "Tech Daily" }
                    }
                ];

                setTimeout(() => {
                    setArticles(mockData);
                    setLoading(false);
                }, 1000);

            } catch (error) {
                console.error("Error fetching news", error);
                setLoading(false);
            }
        };

        fetchNews();
    }, [category]);

    return (
        <div className={styles.feedContainer}>
            <div className={styles.header}>
                <h2>Latest Updates</h2>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={styles.select}>
                    <option value="general">General</option>
                    <option value="business">Business</option>
                    <option value="technology">Technology</option>
                    <option value="sports">Sports</option>
                </select>
            </div>

            {loading ? (
                <div>Loading updates...</div>
            ) : (
                <div className={styles.grid}>
                    {articles.map((article, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <img src={article.urlToImage || 'https://placehold.co/300x200/4A90E2/ffffff?text=No+Image'} alt={article.title} />
                            </div>
                            <div className={styles.content}>
                                <span className={styles.source}>{article.source.name}</span>
                                <h3>{article.title}</h3>
                                <p>{article.description}</p>
                                <a href={article.url} target="_blank" rel="noopener noreferrer" className={styles.readMore}>Read More</a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NewsAPIFeed;
