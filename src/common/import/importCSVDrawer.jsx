// src/components/common/import/ImportCSVDrawer.jsx
import React from 'react';
import Papa from 'papaparse';

const importCSVDrawer = () => {
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            Papa.parse(file, {
                complete: (result) => {
                    console.log("Parsed Data:", result.data);
                    alert("CSV data loaded. Check console for output!");
                },
                header: true,
            });
        }
    };

    return (
        <div style={{ padding: '1rem', border: '1px solid #ddd', width: '300px' }}>
            <h2>Upload CSV</h2>
            <input type="file" accept=".csv" onChange={handleFileUpload} />
            <p>Select a CSV file to upload and parse its content.</p>
        </div>
    );
};

export default importCSVDrawer;
