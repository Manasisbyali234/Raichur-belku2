import { useState, useRef, useEffect, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import styles from './InteractivePDFViewer.module.css';

// Ensure PDF worker is configured
if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

const InteractivePDFViewer = ({
    pdfUrl,
    mappedAreas,
    onAreaClick,
    pageNumber = 1,
    scale = 1.0,
    onDocumentLoadSuccess
}) => {
    const [pdfData, setPdfData] = useState(null);
    const [error, setError] = useState(null);

    const pdfOptions = useMemo(() => ({
        cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
        cMapPacked: true,
        standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    }), []);

    useEffect(() => {
        if (!pdfUrl) {
            setError('No PDF URL provided');
            return;
        }

        // Handle Base64 data URLs
        if (pdfUrl.startsWith('data:')) {
            setPdfData(pdfUrl);
        } else {
            setPdfData(pdfUrl);
        }
    }, [pdfUrl]);

    function internalOnLoadSuccess({ numPages }) {
        console.log('PDF loaded successfully with', numPages, 'pages');
        setError(null);
        if (onDocumentLoadSuccess) {
            onDocumentLoadSuccess({ numPages });
        }
    }

    function handleLoadError(error) {
        console.error('PDF Load Error:', error);
        setError(error.message || 'Failed to load PDF');
    }

    // Filter areas for current page
    const currentAreas = mappedAreas ? mappedAreas.filter(area => Number(area.pageNumber) === Number(pageNumber)) : [];

    if (error) {
        return (
            <div className={styles.viewerContainer}>
                <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
                    Error loading PDF: {error}
                </div>
            </div>
        );
    }

    if (!pdfData) {
        return (
            <div className={styles.viewerContainer}>
                <div style={{ color: 'white', padding: '20px', textAlign: 'center' }}>Loading PDF data...</div>
            </div>
        );
    }

    return (
        <div className={styles.viewerContainer}>
            {/* Controls moved to parent */}

            <div className={styles.pdfWrapper}>
                <Document
                    file={pdfData}
                    onLoadSuccess={internalOnLoadSuccess}
                    onLoadError={handleLoadError}
                    className={styles.document}
                    loading={<div style={{ color: 'white' }}>Loading PDF...</div>}
                    error={<div style={{ color: 'red' }}>Failed to load PDF. Please check the file.</div>}
                    options={pdfOptions}
                >
                    <div className={styles.pageContainer}>
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                            renderMode="canvas"
                            className={styles.pdfPage}
                        />
                        {/* Overlay Mapped Areas */}
                        {currentAreas.map((area, index) => {
                            if (area.extractedImageUrl) {
                                console.log(`Applying area "${area.headline}" at ${area.coordinates.x}% , ${area.coordinates.y}%`);
                            }
                            return (
                                <div
                                    key={index}
                                    className={styles.mappedArea}
                                    style={{
                                        width: `${area.coordinates.width}%`,
                                        height: `${area.coordinates.height}%`,
                                        left: `${Number(area.coordinates.x).toFixed(4)}%`,
                                        top: `${Number(area.coordinates.y).toFixed(4)}%`,
                                        zIndex: 100 + index
                                    }}
                                    onClick={() => onAreaClick(area)}
                                    title={area.headline}
                                >
                                    {area.extractedImageUrl && (
                                        <img
                                            src={area.extractedImageUrl}
                                            alt=""
                                            className={styles.areaSnippet}
                                            style={{ width: '100%', height: '100%', objectFit: 'fill' }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </Document>
            </div>
        </div>
    );
};

export default InteractivePDFViewer;
