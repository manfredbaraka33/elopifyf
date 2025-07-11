
import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

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

    fetch('https://elopyx-hatespeech.hf.space', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: modalText }),
    })
      .then(res => res.json())
      .then(data => {
        const sentiment = data.sentiment?.toLowerCase();
        setModalResult(sentiment);

        // Update counts
        setSentimentCounts(prev => ({
          ...prev,
          [sentiment]: (prev[sentiment] || 0) + 1,
        }));
      })
      .catch(err => {
        console.error(err);
        alert("Error during sentiment analysis.");
      })
      .finally(() => setLoadingModal(false));
  };

  const data = {
    labels: Object.keys(sentimentCounts).map(k => k.toUpperCase()),
    datasets: [
      {
        data: Object.values(sentimentCounts),
        backgroundColor: [
          COLORS.positive,
          COLORS.neutral,
          COLORS.negative,
        ],
        hoverBackgroundColor: [
          COLORS.positive,
          COLORS.neutral,
          COLORS.negative,
        ],
      },
    ],
  };

  return (
    <div className="container mt-5 p-3 text-light">
      <h3 className="text-center mb-4">Sentiment Analysis</h3>

      <div className="mb-4 text-center">
        <button className="btn btn-primary" onClick={openModal}>
          Add Opinion & Analyze Sentiment
        </button>
      </div>

      {/* Pie Chart */}
      <div className="d-flex justify-content-center mb-5" style={{ maxWidth: 400, margin: '0 auto' }}>
        <Pie data={data} />
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

