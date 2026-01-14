import { useRef, useEffect } from 'react';
import styles from './NewsModal.module.css';

const NewsModal = ({ area, onClose }) => {
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    if (!area) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} ref={modalRef}>
                <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                <div className={styles.content}>
                    <h2>{area.headline}</h2>
                    {area.extractedImageUrl ? (
                        <img src={area.extractedImageUrl} alt={area.headline} className={styles.newsImage} />
                    ) : (
                        <p className={styles.noImage}>No image snippet available.</p>
                    )}
                    <span className={styles.category}>{area.category}</span>
                </div>
            </div>
        </div>
    );
};

export default NewsModal;
