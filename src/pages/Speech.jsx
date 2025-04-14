import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Speech = () => {
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [parsedData, setParsedData] = useState([]);
  const [percentages, setPercentages] = useState(null);
  const speechChartRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);

    const fileExtension = uploadedFile.name.split('.').pop().toLowerCase();

    if (fileExtension === 'csv') {
      Papa.parse(uploadedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          const data = result.data;
          if (data.length > 0) {
            const headers = Object.keys(data[0]);
            setColumns(headers);
            setParsedData(data);
          }
        },
      });
    } else if (fileExtension === 'xlsx') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        if (jsonData.length > 0) {
          const headers = Object.keys(jsonData[0]);
          setColumns(headers);
          setParsedData(jsonData);
        }
      };
      reader.readAsArrayBuffer(uploadedFile);
    }
  }, []);

  const handleColumnSelect = (e) => {
    setSelectedColumn(e.target.value);
  };

  const handleAnalyze = () => {
    if (selectedColumn) {
      setLoading(true);
      const textData = parsedData.map((row) => row[selectedColumn]).filter(Boolean);
      const payload = { texts: textData };

      fetch('http://localhost:8000/predict/speech/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(response => response.json())
      .then(data => {
        const parsed = Papa.parse(data.result_csv, { header: true, skipEmptyLines: true });
        const parsedResults = parsed.data;
        setParsedData(parsedResults);
        const labelCounts = parsedResults.reduce((acc, row) => {
          const label = row.label;
          acc[label] = (acc[label] || 0) + 1;
          return acc;
        }, {});
        const total = Object.values(labelCounts).reduce((acc, count) => acc + count, 0);
       
        const labelPercentages = {
          Hate: (labelCounts['Hate'] || 0) / total * 100,
          Offensive: (labelCounts['Offensive'] || 0) / total * 100,
          Neither: (labelCounts['Neither'] || 0) / total * 100,
        };
        setPercentages(labelPercentages);

        const donutData = {
          labels: Object.keys(labelCounts),
          datasets: [{
            data: Object.values(labelCounts),
            backgroundColor: ['#f44336', '#ff9800', '#4caf50'], // Red, Yellow, Green
          }]
        };

        if (speechChartRef.current) {
          speechChartRef.current.destroy();
        }

        const ctx = document.getElementById('speechChart').getContext('2d');
        speechChartRef.current = new Chart(ctx, {
          type: 'doughnut',
          data: donutData,
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const label = context.label || '';
                    const value = context.parsed;
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${label}: ${percentage}%`;
                  }
                }
              }
            }
          }
        });
      })
      .catch(error => console.error('Error:', error))
      .finally(() => {
        setLoading(false);
        setFile(null);
        setSelectedColumn(null);
        setColumns([]);
      });
    } else {
      alert("Please upload the file and select a column for analysis");
      window.location.reload();
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    onDrop,
  });

  const [singleText, setSingleText] = useState("");
  const [singleResult, setSingleResult] = useState(null);
  const [loadingSingle, setLoadingSingle] = useState(false);

  const handleSingleAnalyze = () => {
    if (!singleText.trim()) {
      alert("Please enter some text.");
      return;
    }
    setLoadingSingle(true);
    fetch("http://localhost:8000/predict/speech", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: singleText })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        const label = data.sentiment;
        setSingleResult({ label });
      })
      .catch(error => {
        console.error("Error analyzing single text:", error);
      })
      .finally(() => setLoadingSingle(false));
  };

  return (
    <div className="container mt-5 p-3 text-light">
      <center><h4>Hate Speech Detection</h4></center>

      <ul className="nav nav-tabs mb-3" id="inputTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button className="nav-link active" id="single-tab" data-bs-toggle="tab" data-bs-target="#single" type="button" role="tab">
            Single Text
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="batch-tab" data-bs-toggle="tab" data-bs-target="#batch" type="button" role="tab">
            Batch Upload
          </button>
        </li>
      </ul>

      <div className="tab-content" id="inputTabContent">
        {/* Single Text Tab */}
        <div className="tab-pane fade show active" id="single" role="tabpanel" aria-labelledby="single-tab">
          <textarea className="form-control mb-3"
           placeholder="Type your text here..." 
           rows="5"
           value={singleText}
           onChange={(e) => setSingleText(e.target.value)}
          ></textarea>
          <button className="btn btn-primary" onClick={handleSingleAnalyze}>Analyze</button>
          {loadingSingle && (
            <div className="mt-3 text-center">
              <div className="spinner-grow text-primary" role="status"></div>
              <p>Analyzing text, please wait...</p>
            </div>
          )}
          <br />
          {singleResult && (
            <div className="mt-4">
              <h5>Detection Result:</h5>
              <div style={{ fontSize: "1.2rem", color: "#fff" }}>
                <div className="row">
                  <div className="col-sm-10 col-md-6 col-lg-6">
                    <h3 className='bg-secondary rounded p-3'>{singleResult?.label?.toUpperCase()}</h3>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Batch Upload Tab */}
        <div className="tab-pane fade" id="batch" role="tabpanel" aria-labelledby="batch-tab">
          <div {...getRootProps({ className: 'dropzone p-5 border border-primary text-center rounded bg-light text-dark' })}>
            <input {...getInputProps()} />
            <div className="fs-1 text-primary mb-2"><i className="bi bi-file-earmark-arrow-up"></i></div>
            <p className="mb-0">Drag & drop a <span className="text-warning fw-bold">.csv</span> or <span className="text-warning fw-bold">.xlsx</span> file here, or click to select</p>
          </div>

          {file && <div className="mt-3"><h5>Uploaded File: <span className="text-info">{file.name}</span></h5></div>}
          {columns.length > 0 && (
            <div className="mt-3">
              <label>Select the column with text to analyze:</label>
              <select className="form-select" onChange={handleColumnSelect}>
                <option value="">-- Choose Column --</option>
                {columns.map((col, index) => (
                  <option key={index} value={col}>{col}</option>
                ))}
              </select>
            </div>
          )}
          {!loading && (<button className="btn btn-success mt-4" onClick={handleAnalyze}>Upload & Analyze</button>)}
          {loading && (
            <div className="mt-3 text-center">
              <div className="spinner-grow text-danger" role="status"></div>
              <div className="spinner-grow text-info" role="status"></div>
              <div className="spinner-grow text-sucess" role="status"></div>
              <div className="spinner-grow text-primary" role="status"></div>
              <p>Analyzing hate speech, please wait...</p>
            </div>
          )}
          <center>
            <div className="col-sm-10 col-md-8 col-lg-5">
              {percentages && (<div>
                <h5>Hate Speech Detection Results</h5>
                <div className="row">
                  <div className="col">Hate<h3>{Math.round(percentages?.Hate || 0)}</h3></div>
                  <div className="col">Offensive<h3>{Math.round(percentages?.Offensive || 0)}</h3></div>
                  <div className="col">Neither<h3>{Math.round(percentages?.Neither || 0)}</h3></div>
                </div>
              </div>)}
              <canvas id="speechChart"></canvas>
            </div>
          </center>
        </div>
      </div>
    </div>
  );
};

export default Speech;
