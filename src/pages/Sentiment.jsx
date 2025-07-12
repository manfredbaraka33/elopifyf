
// import React, { useState } from 'react';
// import { Pie } from 'react-chartjs-2';
// import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

// Chart.register(ArcElement, Tooltip, Legend);

// const SentimentModalOnly = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [modalText, setModalText] = useState("");
//   const [modalResult, setModalResult] = useState(null);
//   const [loadingModal, setLoadingModal] = useState(false);
//   const [sentimentCounts, setSentimentCounts] = useState({
//     positive: 0,
//     neutral: 0,
//     negative: 0,
//   });

//   const COLORS = {
//     positive: '#28a745',
//     neutral: '#ffc107',
//     negative: '#dc3545'
//   };

//   const openModal = () => {
//     setModalText("");
//     setModalResult(null);
//     setShowModal(true);
//   };

//   const closeModal = () => setShowModal(false);

//   const handleModalAnalyze = () => {
//     if (!modalText.trim()) {
//       alert("Please enter some text.");
//       return;
//     }

//     setLoadingModal(true);

//     fetch('https://elopyx-hatespeech.hf.space/classify', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ text: modalText }),
//     })
//       .then(res => res.json())
//       .then(data => {
//         const sentiment = data.sentiment?.toLowerCase();
//         setModalResult(sentiment);

//         // Update counts
//         setSentimentCounts(prev => ({
//           ...prev,
//           [sentiment]: (prev[sentiment] || 0) + 1,
//         }));
//       })
//       .catch(err => {
//         console.error(err);
//         alert("Error during sentiment analysis.");
//       })
//       .finally(() => setLoadingModal(false));
//   };

//   const data = {
//     labels: Object.keys(sentimentCounts).map(k => k.toUpperCase()),
//     datasets: [
//       {
//         data: Object.values(sentimentCounts),
//         backgroundColor: [
//           COLORS.positive,
//           COLORS.neutral,
//           COLORS.negative,
//         ],
//         hoverBackgroundColor: [
//           COLORS.positive,
//           COLORS.neutral,
//           COLORS.negative,
//         ],
//       },
//     ],
//   };

//   return (
//     <div className="container mt-5 p-3 text-light">
//       <h3 className="text-center mb-4">Sentiment Analysis</h3>

//       <div className="mb-4 text-center">
//         <button className="btn btn-primary" onClick={openModal}>
//           Add Opinion & Analyze Sentiment
//         </button>
//       </div>

//       {/* Pie Chart */}
//       <div className="d-flex justify-content-center mb-5" style={{ maxWidth: 400, margin: '0 auto' }}>
//         <Pie data={data} />
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//           <div className="modal-dialog">
//             <div className="modal-content text-dark">
//               <div className="modal-header">
//                 <h5 className="modal-title">Add Opinion</h5>
//                 <button type="button" className="btn-close" onClick={closeModal}></button>
//               </div>
//               <div className="modal-body">
//                 <textarea
//                   className="form-control"
//                   rows={4}
//                   placeholder="Type your opinion here..."
//                   value={modalText}
//                   onChange={e => setModalText(e.target.value)}
//                   disabled={loadingModal}
//                 />
//                 {loadingModal && <div className="mt-3 text-center">Analyzing sentiment...</div>}
//                 {modalResult && (
//                   <div className="mt-3">
//                     <strong>Sentiment Result:</strong>{' '}
//                     <span style={{ color: COLORS[modalResult] }}>
//                       {modalResult.toUpperCase()}
//                     </span>
//                   </div>
//                 )}
//               </div>
//               <div className="modal-footer">
//                 <button className="btn btn-secondary" onClick={closeModal} disabled={loadingModal}>Close</button>
//                 <button className="btn btn-primary" onClick={handleModalAnalyze} disabled={loadingModal}>
//                   Analyze
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SentimentModalOnly;




import React, { useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const COLORS = {
  positive: '#28a745',
  neutral: '#ffc107',
  negative: '#dc3545'
};

const SentimentModalOnly = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [modalResult, setModalResult] = useState(null);
  const [loadingModal, setLoadingModal] = useState(false);
  const [sentimentCounts, setSentimentCounts] = useState({
    // initial empty object, departments will be added dynamically
  });

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

    fetch('https://elopyx-hatespeech.hf.space/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: modalText }),
    })
      .then(res => res.json())
      .then(data => {
        const sentiment = data.sentiment?.toLowerCase();
        const department = data.department;
        if (!sentiment || !department) {
          throw new Error("Missing sentiment or department in API response");
        }

        setModalResult(sentiment);

        setSentimentCounts(prev => {
          // If department does not exist, initialize counts
          const deptCounts = prev[department] || { positive: 0, neutral: 0, negative: 0 };
          return {
            ...prev,
            [department]: {
              ...deptCounts,
              [sentiment]: (deptCounts[sentiment] || 0) + 1,
            }
          };
        });
      })
      .catch(err => {
        console.error(err);
        alert("Error during sentiment analysis.");
      })
      .finally(() => setLoadingModal(false));
  };

  // Calculate totals for Pie chart across all departments
  const totalCounts = Object.values(sentimentCounts).reduce(
    (acc, dept) => ({
      positive: acc.positive + (dept.positive || 0),
      neutral: acc.neutral + (dept.neutral || 0),
      negative: acc.negative + (dept.negative || 0)
    }),
    { positive: 0, neutral: 0, negative: 0 }
  );

  const pieData = {
    labels: Object.keys(totalCounts).map(k => k.toUpperCase()),
    datasets: [
      {
        data: Object.values(totalCounts),
        backgroundColor: [COLORS.positive, COLORS.neutral, COLORS.negative],
        hoverBackgroundColor: [COLORS.positive, COLORS.neutral, COLORS.negative],
      },
    ],
  };

  // Bar chart data grouped by department (dynamic)
  const departments = Object.keys(sentimentCounts);

  const barData = {
    labels: departments,
    datasets: [
      {
        label: 'Positive',
        data: departments.map(dep => sentimentCounts[dep]?.positive || 0),
        backgroundColor: COLORS.positive,
      },
      {
        label: 'Neutral',
        data: departments.map(dep => sentimentCounts[dep]?.neutral || 0),
        backgroundColor: COLORS.neutral,
      },
      {
        label: 'Negative',
        data: departments.map(dep => sentimentCounts[dep]?.negative || 0),
        backgroundColor: COLORS.negative,
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
        <Pie data={pieData} />
      </div>

      {/* Bar Chart */}
      <div className="d-flex justify-content-center mb-5" style={{ maxWidth: 600, margin: '0 auto' }}>
        <Bar
          data={barData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top',
                      labels: {
                      color: '#ffffff', // Legend text color
                        }
                      },
              title: { display: true, text: 'Sentiment by Department' },
            },
            scales: {
              y: { beginAtZero: true }
            }
          }}
        />
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

