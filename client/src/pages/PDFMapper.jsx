import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import * as fabric from 'fabric'; // v6 import, or 'fabric' for v5. Let's assume v5 for stability or check package.json usually. 
// Standard fabric.js usage often requires 'fabric' default export.
// React-pdf worker setup
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

import axios from 'axios';
import styles from './PDFMapper.module.css';

// We might need to handle fabric import differently depending on version installed.
// Assuming "fabric": "^5.x" which is common for React apps currently suitable for this.
// If v6, 'fabric' export is different. I'll stick to 'fabric' global-like import or commonjs style if needed, but ES import is standard.
// Actually, for broad compatibility in Vite:
import { Canvas, Rect } from 'fabric';

const PDFMapper = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newspaper, setNewspaper] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [loading, setLoading] = useState(true);

    const canvasRef = useRef(null);
    const fabricCanvasRef = useRef(null);
    const [activeRect, setActiveRect] = useState(null);

    // Form state
    const [headline, setHeadline] = useState('');
    const [category, setCategory] = useState('other');
    const [newsImage, setNewsImage] = useState(null);

    useEffect(() => {
        const fetchNewspaper = async () => {
            try {
                const { data } = await axios.get(`/api/user/newspaper/${id}`);
                setNewspaper(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching newspaper:", error);
                setLoading(false);
            }
        };
        fetchNewspaper();
    }, [id]);

    // Initialize Fabric Canvas on Page Change
    useEffect(() => {
        if (!canvasRef.current || !newspaper) return;

        // Dispose old canvas if exists
        if (fabricCanvasRef.current) {
            fabricCanvasRef.current.dispose();
        }

        const canvas = new Canvas(canvasRef.current, {
            width: 800 * scale, // Approximate A4 ratio or dynamic
            height: 1100 * scale,
            selection: false
        });

        fabricCanvasRef.current = canvas;

        // Add Drawing Mode logic
        let isDown, origX, origY, rect;

        canvas.on('mouse:down', function (o) {
            if (activeRect) return; // If already editing a rect, don't draw new one

            isDown = true;
            var pointer = canvas.getPointer(o.e);
            origX = pointer.x;
            origY = pointer.y;

            rect = new Rect({
                left: origX,
                top: origY,
                originX: 'left',
                originY: 'top',
                width: pointer.x - origX,
                height: pointer.y - origY,
                angle: 0,
                fill: 'rgba(74, 144, 226, 0.3)',
                stroke: '#4a90e2',
                strokeWidth: 2,
                transparentCorners: false
            });
            canvas.add(rect);
        });

        canvas.on('mouse:move', function (o) {
            if (!isDown) return;
            var pointer = canvas.getPointer(o.e);

            if (origX > pointer.x) {
                rect.set({ left: Math.abs(pointer.x) });
            }
            if (origY > pointer.y) {
                rect.set({ top: Math.abs(pointer.y) });
            }

            rect.set({ width: Math.abs(origX - pointer.x) });
            rect.set({ height: Math.abs(origY - pointer.y) });

            canvas.renderAll();
        });

        canvas.on('mouse:up', function (o) {
            isDown = false;
            if (rect) {
                rect.setCoords();
                setActiveRect(rect);
                // Disable drawing new rects until this one is saved/cancelled? 
                // Alternatively, allow multiple but select the active one.
                // For simplicity, let's treat the last drawn as active.

                // We should also allow modifiying existing mapped areas from DB?
                // For now, let's just focus on adding new ones.
            }
        });

        return () => {
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.dispose();
            }
        };
    }, [pageNumber, scale, newspaper]);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const saveMappedArea = async () => {
        if (!activeRect) return;

        // Calculate percentage coordinates
        const canvasWidth = fabricCanvasRef.current.width;
        const canvasHeight = fabricCanvasRef.current.height;

        const coords = {
            x: (activeRect.left / canvasWidth) * 100,
            y: (activeRect.top / canvasHeight) * 100,
            width: (activeRect.getScaledWidth() / canvasWidth) * 100,
            height: (activeRect.getScaledHeight() / canvasHeight) * 100
        };

        const formData = new FormData();
        formData.append('pageNumber', pageNumber);
        formData.append('x', coords.x);
        formData.append('y', coords.y);
        formData.append('width', coords.width);
        formData.append('height', coords.height);
        formData.append('headline', headline);
        formData.append('category', category);
        if (newsImage) {
            formData.append('file', newsImage);
        }

        try {
            await axios.post(`/api/admin/newspaper/${id}/map-area`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('Area mapped successfully!');
            // Reset form
            setHeadline('');
            setCategory('other');
            setNewsImage(null);
            fabricCanvasRef.current.remove(activeRect);
            setActiveRect(null);

            // Optionally, refresh/Draw existing areas
        } catch (error) {
            console.error(error);
            alert('Failed to map area');
        }
    };

    const cancelMapping = () => {
        if (activeRect && fabricCanvasRef.current) {
            fabricCanvasRef.current.remove(activeRect);
            setActiveRect(null);
        }
    };

    if (loading) return <div>Loading PDF...</div>;

    return (
        <div className={styles.mapperContainer}>
            <div className={styles.controls}>
                <button onClick={() => navigate('/admin/dashboard')}>&larr; Back</button>
                <div className={styles.pageNav}>
                    <button disabled={pageNumber <= 1} onClick={() => setPageNumber(prev => prev - 1)}>Prev</button>
                    <span>Page {pageNumber} of {numPages}</span>
                    <button disabled={pageNumber >= numPages} onClick={() => setPageNumber(prev => prev + 1)}>Next</button>
                </div>
            </div>

            <div className={styles.workspace}>
                <div className={styles.pdfArea}>
                    <Document
                        file={newspaper?.pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        className={styles.pdfDocument}
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            className={styles.pdfPage}
                            onLoadSuccess={(page) => {
                                // Update canvas dimensions to match PDF page render
                                const viewport = page.getViewport({ scale });
                                if (fabricCanvasRef.current) {
                                    fabricCanvasRef.current.setDimensions({
                                        width: viewport.width,
                                        height: viewport.height
                                    });
                                }
                            }}
                        />
                        {/* Canvas overlay */}
                        <div className={styles.canvasOverlay}>
                            <canvas ref={canvasRef} />
                        </div>
                    </Document>
                </div>

                <div className={styles.sidebar}>
                    <h3>Map News Area</h3>
                    <p className={styles.instruction}>Draw a rectangle on the news article.</p>

                    {activeRect ? (
                        <div className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>Headline</label>
                                <input
                                    type="text"
                                    value={headline}
                                    onChange={e => setHeadline(e.target.value)}
                                    placeholder="Enter headline"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Category</label>
                                <select value={category} onChange={e => setCategory(e.target.value)}>
                                    <option value="other">Select...</option>
                                    <option value="politics">Politics</option>
                                    <option value="sports">Sports</option>
                                    <option value="business">Business</option>
                                    <option value="entertainment">Entertainment</option>
                                    <option value="local">Local</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Extracted Image (Optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setNewsImage(e.target.files[0])}
                                />
                                <small>Upload cropped image of the article</small>
                            </div>

                            <div className={styles.actions}>
                                <button className={styles.saveBtn} onClick={saveMappedArea}>Save Area</button>
                                <button className={styles.cancelBtn} onClick={cancelMapping}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.placeholder}>
                            Start drawing on the PDF to map an area.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PDFMapper;
