import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

const About = () => {
  return (
    <div className="container py-5 text-light">
      <center className="mb-5">
        <h2 className="fw-bold">👋 Welcome to Elopify Healthcare AI</h2>
        <p className="lead">Turning patient feedback into actionable insights.</p>
      </center>

      <div className="row g-4">
        {/* Capabilities */}
        <div className="col-md-6">
          <div className="p-4 rounded shadow-lg bg-transparent ">
            <h4><i className="bi bi-graph-up-arrow me-2 text-success"></i>What Can Elopify Do?</h4>
            <ul className="mt-3">
              <li><strong>🧪 Sentiment Analysis:</strong> Detect positive, neutral, or negative feelings in patient feedback.</li>
              <li><strong>🏥 Department Classification:</strong> Automatically assign feedback to Reception, Emergency, Pharmacy, Lab, or Other departments.</li>
            </ul>
          </div>
        </div>

        {/* How to Use */}
        <div className="col-md-6">
          <div className="p-4 rounded shadow-lg bg-transparent ">
            <h4><i className="bi bi-play-circle me-2 text-primary"></i>How to Use</h4>
            <ol className="mt-3">
              <li>Type or paste patient feedback in the input box.</li>
              <li>Click analyze to get sentiment and department classification.</li>
              <li>Use the results to improve patient experience and route issues properly.</li>
            </ol>
          </div>
        </div>

        {/* Upload Info */}
        <div className="col-md-6">
          <div className="p-4 rounded shadow-lg bg-transparent ">
            <h4><i className="bi bi-upload me-2 text-warning"></i>What Can I Upload?</h4>
            <ul className="mt-3">
              <li>Supported file types: <code>.csv</code> and <code>.xlsx</code></li>
              <li>One text column containing patient feedback is required</li>
              <li>You’ll be guided to select the correct column for analysis</li>
            </ul>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="col-md-6">
          <div className="p-4 rounded shadow-lg bg-transparent">
            <h4><i className="bi bi-cpu me-2 text-info"></i>Under the Hood</h4>
            <ul className="mt-3">
              <li><strong>Frontend:</strong> React + Bootstrap</li>
              <li><strong>Backend:</strong> FastAPI</li>
              <li><strong>AI Models:</strong> Groq LLM (Llama 3.3), LangChain</li>
              <li><strong>Parsing:</strong> PapaParse & XLSX.js</li>
            </ul>
          </div>
        </div>

        {/* Contact */}
        <div className="col-12">
          <div className="p-4 rounded shadow-lg bg-transparent  text-center">
            <h4><i className="bi bi-headset me-2 text-warning"></i>Contact the Creator</h4>
            <p className="mt-3">
              Made with ☕ and 💻 by <strong>Manfred Baraka</strong><br /> <br />
            </p>

            <center>
              <div className="row">
                <div className="col-sm-10 col-md-3 col-lg-3">
                  <a
                    style={{ color: "white" }}
                    href="https://www.linkedin.com/in/manfredbaraka/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-decoration-none text-primary"
                  >
                    <i className="bi bi-linkedin me-2"></i><br />
                    LinkedIn
                  </a>
                </div>
                <div className="col-sm-10 col-md-3 col-lg-3">
                  <a
                    style={{ color: "white" }}
                    href="https://manfredbarakaportfolio.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-decoration-none text-info"
                  >
                    <i className="bi bi-globe me-2 text-warning"></i><br />
                    Visit portfolio
                  </a>
                </div>
                <div className="col-sm-10 col-md-3 col-lg-3">
                  <a href="mailto:elopyconnect@gmail.com" className="text-decoration-none text-light">
                    <i className="bi bi-envelope-at me-2 text-light"><br /></i>
                    elopyconnect@gmail.com
                  </a><br />
                </div>
              </div>
            </center>

          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
