import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import styles from './InteractivePDFViewer.module.css';

// Worker src should be set once in the app, but safe to set here if needed, or in App.jsx
// 'pdfjs-dist/build/pdf.worker.min.mjs'

const InteractivePDFViewer = ({ pdfUrl, mappedAreas, onAreaClick, maxPages }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const pdfWrapperRef = useRef(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(maxPages ? Math.min(numPages, maxPages) : numPages);
    }

    // Filter areas for current page
    const currentAreas = mappedAreas.filter(area => area.pageNumber === pageNumber);

    return (
        <div className={styles.viewerContainer}>
            <div className={styles.controls}>
                <button disabled={pageNumber <= 1} onClick={() => setPageNumber(prev => prev - 1)}>Prev</button>
                <span>Page {pageNumber} of {numPages}</span>
                <button disabled={pageNumber >= numPages} onClick={() => setPageNumber(prev => prev + 1)}>Next</button>
                <div className={styles.zoomControls}>
                    <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))}>-</button>
                    <span>{Math.round(scale * 100)}%</span>
                    <button onClick={() => setScale(s => Math.min(2.0, s + 0.1))}>+</button>
                </div>
            </div>

            <div className={styles.pdfWrapper} ref={pdfWrapperRef}>
                <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className={styles.document}
                >
                    <div className={styles.pageContainer}>
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                        {/* Overlay Mapped Areas */}
                        {currentAreas.map((area, index) => (
                            <div
                                key={index}
                                className={styles.mappedArea}
                                style={{
                                    left: `${area.coordinates.x}%`,
                                    top: `${area.coordinates.y}%`,
                                    width: `${area.coordinates.width}%`,
                                    height: `${area.coordinates.height}%`
                                }}
                                onClick={() => onAreaClick(area)}
                                title={area.headline}
                            />
                        ))}
                    </div>
                </Document>
            </div>
        </div>
    );
};

export default InteractivePDFViewer;
