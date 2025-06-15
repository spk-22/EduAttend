// src/AdminDashboard.jsx
import React, { useState } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const AdminDashboard = () => {
    const [status, setStatus] = useState('');

    const generateStyledPDF = async () => {
        try {
            setStatus('📡 Fetching batch data...');

            const batchRefSnap = await getDocs(collection(db, 'batchRefs'));
            if (batchRefSnap.empty) {
                setStatus('⚠️ No batch references found.');
                return;
            }

            const latestBatch = batchRefSnap.docs
                .map(doc => doc.data())
                .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)[0];

            const batchName = latestBatch.name;
            const batchSnap = await getDocs(collection(db, batchName));

            if (batchSnap.empty) {
                setStatus('⚠️ Selected batch has no absentees.');
                return;
            }

            const grouped = {};

            batchSnap.docs.forEach((doc) => {
                const data = doc.data();
                const usn = data.usn?.toUpperCase().trim();
                if (!usn || usn.length < 10) return;
                const courseMatch = usn.match(/^\w{5}(\w{2})/);
                const course = courseMatch ? courseMatch[1] : 'UNKNOWN';
                if (!grouped[course]) grouped[course] = [];
                grouped[course].push(usn);
            });

            setStatus('📄 Generating Form A PDF...');

            const pdfDoc = await PDFDocument.create();
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            let page = pdfDoc.addPage([595, 842]);
            let y = 800;

            const drawLine = (yPos) => {
                page.drawLine({
                    start: { x: 50, y: yPos },
                    end: { x: 545, y: yPos },
                    thickness: 1,
                    color: rgb(0, 0, 0),
                });
            };

            page.drawText('R.V COLLEGE OF ENGINEERING, BENGALURU – 59', { x: 100, y, size: 14, font });
            y -= 30;
            page.drawText('FORM A', { x: 260, y, size: 12, font });
            y -= 25;

            page.drawText(`Batch: ${batchName}`, { x: 50, y, size: 11, font });
            y -= 20;

            for (const course of Object.keys(grouped).sort()) {
                const sortedUSNs = grouped[course].sort();

                if (y < 100) {
                    page = pdfDoc.addPage([595, 842]);
                    y = 800;
                }

                page.drawText(`Absentees in Course ${course}:`, { x: 50, y, size: 11, font });
                y -= 20;

                sortedUSNs.forEach((usn, index) => {
                    if (y < 60) {
                        page = pdfDoc.addPage([595, 842]);
                        y = 800;
                    }
                    page.drawText(`${index + 1}. ${usn}`, { x: 70, y, size: 10, font });
                    y -= 15;
                });

                y -= 10;
                page.drawText(`Total: ${sortedUSNs.length}`, { x: 450, y, size: 11, font });
                y -= 25;
                drawLine(y);
                y -= 15;
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `FormA-${batchName}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setStatus('✅ PDF downloaded from latest batch!');
        } catch (error) {
            console.error(error);
            setStatus('❌ Error generating PDF');
        }
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h2>Admin Dashboard</h2>
            <button onClick={generateStyledPDF} style={{ padding: '10px 20px' }}>
                Download Latest Form A PDF
            </button>
            <p style={{ marginTop: '1rem' }}>{status}</p>
        </div>
    );
};

export default AdminDashboard;
