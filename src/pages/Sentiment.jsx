import React, { useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const SentimentModalOnly = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalResult, setModalResult] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);
  const [sentimentCounts, setSentimentCounts] = useState({
    positive: 0,
    neutral: 0,
    negative: 0,
  });

  const COLORS = {
    positive: '#28a745',
    neutral: '#ffc107',
    negative: '#dc3545'
  };

  const openModal = () => {
    setModalText("");
    setModalResult(null);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleModalAnalyze = () => {
    if (!modalText.trim()) {
      alert("Please enter some text.");
      return;
    }

    setLoadingModal(true);

    fetch('https://elopyx-api.hf.space/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: modalText }),
    })
      .then(res => res.json())
      .then(data => {
        const sentiment = data.sentiment?.toLowerCase();
        setModalResult(sentiment);

        // Update pie chart counts
        setSentimentCounts(prev => ({
          ...prev,
          [sentiment]: prev[sentiment] + 1
        }));
      })
      .catch(err => {
        console.error(err);
        alert("Error during sentiment analysis.");
      })
      .finally(() => setLoadingModal(false));
  };

  const pieData = Object.entries(sentimentCounts).map(([key, value]) => ({
    name: key.toUpperCase(),
    value,
  }));

  return (
    <div className="container mt-5 p-3 text-light">
      <h3 className="text-center mb-4">Sentiment Analysis</h3>

      <div className="mb-4 text-center">
        <button className="btn btn-primary" onClick={openModal}>
          Add Opinion & Analyze Sentiment
        </button>
      </div>

      {/* Pie Chart */}
      <div className="d-flex justify-content-center mb-5">
        <PieChart width={400} height={300}>
          <Pie
            dataKey="value"
            isAnimationActive={true}
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase()]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content text-dark">
              <div className="modal-header">
                <h5 className="modal-title">Add Opinion</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Type your opinion here..."
                  value={modalText}
                  onChange={e => setModalText(e.target.value)}
                  disabled={loadingModal}
                />
                {loadingModal && <div className="mt-3 text-center">Analyzing sentiment...</div>}
                {modalResult && (
                  <div className="mt-3">
                    <strong>Sentiment Result:</strong>{' '}
                    <span style={{ color: COLORS[modalResult] }}>
                      {modalResult.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal} disabled={loadingModal}>Close</button>
                <button className="btn btn-primary" onClick={handleModalAnalyze} disabled={loadingModal}>
                  Analyze
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentimentModalOnly;
