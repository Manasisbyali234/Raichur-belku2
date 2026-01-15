import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFThumbnail = ({ pdfUrl, alt }) => {
    const [error, setError] = useState(false);

    if (error) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>{alt}</div>;
    }

    return (
        <Document
            file={pdfUrl}
            onLoadError={() => setError(true)}
            loading={<div>Loading...</div>}
        >
            <Page pageNumber={1} width={200} renderTextLayer={false} renderAnnotationLayer={false} />
        </Document>
    );
};

export default PDFThumbnail;
