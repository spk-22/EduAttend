// ✅ Updated TeacherDashboard.jsx
import React, { useState } from 'react';
import { db } from './firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const sampleData = [
    { name: 'Aarav Kumar', usn: '1RV23IS101' },
    { name: 'Diya Sharma', usn: '1RV23CS102' },
    { name: 'Rohan Singh', usn: '1RV23ME103' },
    { name: 'Sneha Reddy', usn: '1RV23EC104' },
    { name: 'Karan Patel', usn: '1RV23EE105' },
    { name: 'Meera Joshi', usn: '1RV23CS106' }
];

const TeacherDashboard = () => {
    const [selected, setSelected] = useState([]);
    const [status, setStatus] = useState('');

    const toggleCheckbox = (usn) => {
        setSelected((prev) =>
            prev.includes(usn) ? prev.filter((u) => u !== usn) : [...prev, usn]
        );
    };

    const handleSubmit = async () => {
        setStatus('Submitting...');
        try {
            const now = Timestamp.now();
            const batchId = `batch_${Date.now()}`;
            const batchRef = collection(db, batchId);

            for (const usn of selected) {
                await addDoc(batchRef, {
                    usn: usn.toUpperCase(),
                    submittedAt: now
                });
            }

            // Track batch collection name
            await addDoc(collection(db, 'batchRefs'), {
                name: batchId,
                createdAt: now
            });

            setSelected([]);
            setStatus(`✅ Absentees submitted to ${batchId}`);
        } catch (err) {
            console.error(err);
            setStatus('❌ Failed to submit absentees');
        }
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h2>Teacher Dashboard</h2>
            <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                        <th>Serial No.</th>
                        <th>Student Name & USN</th>
                        <th>Absent?</th>
                    </tr>
                </thead>
                <tbody>
                    {sampleData.map((student, index) => (
                        <tr key={student.usn}>
                            <td>{index + 1}</td>
                            <td>{student.name} ({student.usn})</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selected.includes(student.usn)}
                                    onChange={() => toggleCheckbox(student.usn)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={handleSubmit} style={{ marginTop: '20px', padding: '10px 20px' }}>
                Submit Absentees
            </button>
            <p style={{ marginTop: '10px' }}>{status}</p>
        </div>
    );
};

export default TeacherDashboard;
