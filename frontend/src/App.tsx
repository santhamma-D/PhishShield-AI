import BrandDetector from "./pages/BrandDetector";
import EmailAnalyzer from "./pages/EmailAnalyzer";
import SMSDetector from "./pages/SMSDetector";
import QRScanner from "./pages/QRScanner";
import SecurityCopilot from "./pages/SecurityCopilot";
import ScanHistory from "./pages/ScanHistory";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import {
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Globe,
  Mail,
  MessageSquare,
  QrCode,
  BrainCircuit,
  Lock,
  Activity,
  CheckCircle2,

} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import URLScanner from "./pages/URLScanner";
import "./App.css";

const features = [
  {
    icon: Globe,
    title: "AI URL Scanner",
    description: "Identify malicious links, suspicious domains and phishing websites.",
    path: "/url-scanner",
  },
  {
    icon: Mail,
    title: "Email Protection",
    description: "Analyze suspicious emails and detect fraudulent messages.",
    path: "/email-analyzer",
  },
  {
    icon: MessageSquare,
    title: "SMS Scam Detector",
    description: "Discover dangerous messages, scam attempts and fake offers.",
    path: "/sms-detector",
  },
  {
    icon: QrCode,
    title: "QR Code Security",
    description: "Inspect QR code destinations before opening unknown links.",
    path: "/qr-scanner",
  },
  {
    icon: BrainCircuit,
    title: "AI Security Copilot",
    description: "Understand threats with clear, explainable AI assistance.",
    path: "/security-copilot",
  },
  {
    icon: Activity,
    title: "Threat Intelligence",
    description: "Explore security insights and monitor suspicious activity.",
    path: "/threat-intelligence",
  },
];

function HomePage() {
  return (
    <div className="landing-page">

      <nav className="navbar">
        <Link to="/" className="brand">
          <span className="brand-icon">
            <ShieldCheck size={25} />
          </span>
          <span>PHISH<span className="brand-highlight">SHIELD</span> AI</span>
        </Link>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">
          <Link to="/dashboard" className="nav-login">
            Dashboard
          </Link>
          <Link to="/dashboard" className="nav-button">
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      <main>
        <section className="hero-section" id="home">
          <div className="hero-content">

            <div className="hero-badge">
              <span className="live-dot"></span>
              INTELLIGENT CYBERSECURITY PLATFORM
            </div>

            <h1>
              Your Digital World.
              <br />
              <span>Protected by Intelligence.</span>
            </h1>

            <p className="hero-description">
              Stay ahead of phishing attacks, fraudulent emails and
              digital scams with intelligent AI-powered threat detection.
              Security that helps you browse with confidence.
            </p>

            <div className="hero-buttons">
              <Link to="/dashboard" className="primary-button">
                Explore Dashboard <ArrowRight size={19} />
              </Link>

              <a href="#features" className="secondary-button">
                Explore Features
              </a>
            </div>

            <div className="hero-trust">
              <div className="trust-icon">
                <Lock size={17} />
              </div>
              <span>Smarter protection. Safer decisions. Greater confidence.</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="glow-circle"></div>

            <div className="security-card">
              <div className="security-card-header">
                <div>
                  <span className="small-label">SECURITY OVERVIEW</span>
                  <h3>Threat Protection</h3>
                </div>
                <span className="shield-status">
                  <ShieldCheck size={20} />
                </span>
              </div>

              <div className="shield-illustration">
                <div className="shield-ring ring-one"></div>
                <div className="shield-ring ring-two"></div>
                <div className="main-shield">
                  <ShieldCheck size={76} strokeWidth={1.5} />
                </div>
                <span className="orbit-dot dot-one"></span>
                <span className="orbit-dot dot-two"></span>
                <span className="orbit-dot dot-three"></span>
              </div>

              <div className="protection-message">
                <CheckCircle2 size={19} />
                <span>Security workspace ready</span>
              </div>

              <div className="security-divider"></div>

              <div className="security-bottom">
                <div>
                  <span className="small-label">PLATFORM</span>
                  <strong>PHISHSHIELD AI</strong>
                </div>
                <div>
                  <span className="small-label">ENGINE</span>
                  <strong>AI Powered</strong>
                </div>
              </div>
            </div>

            <div className="floating-card floating-top">
              <span className="floating-icon safe-icon">
                <ShieldCheck size={20} />
              </span>
              <div>
                <strong>Smart Detection</strong>
                <small>AI security analysis</small>
              </div>
            </div>

            <div className="floating-card floating-bottom">
              <span className="floating-icon threat-icon">
                <ShieldAlert size={20} />
              </span>
              <div>
                <strong>Threat Awareness</strong>
                <small>Stay one step ahead</small>
              </div>
            </div>
          </div>
        </section>

        <section className="trust-strip">
          <p>ONE PLATFORM. MULTIPLE LAYERS OF PROTECTION.</p>
          <div className="trust-items">
            <span><ShieldCheck size={17} /> Intelligent Detection</span>
            <span><BrainCircuit size={17} /> AI-Powered Analysis</span>
            <span><Lock size={17} /> Security Awareness</span>
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="section-heading">
            <span className="section-eyebrow">OUR CAPABILITIES</span>
            <h2>Everything you need to <span>stay protected.</span></h2>
            <p>
              Powerful security tools designed to help identify,
              understand and prevent digital threats.
            </p>
          </div>

         <div className="feature-grid">
  {features.map((feature) => {
    const Icon = feature.icon;

    return (
      <Link
        to={feature.path}
        className="feature-card"
        key={feature.title}
      >
        <div className="feature-icon">
          <Icon size={25} />
        </div>

        <h3>{feature.title}</h3>

        <p>{feature.description}</p>

        <span className="feature-arrow">
          <ArrowRight size={18} />
        </span>
      </Link>
    );
  })}
</div>
        </section>

        <section className="about-section" id="about">
          <div className="about-icon">
            <ShieldCheck size={35} />
          </div>
          <div>
            <span className="section-eyebrow">ABOUT PHISHSHIELD AI</span>
            <h2>Security starts with awareness.</h2>
            <p>
              PHISHSHIELD AI aims to make digital security easier to
              understand through intelligent threat analysis and
              explainable security insights.
            </p>
          </div>
          <Link to="/dashboard" className="about-button">
            Enter Platform <ArrowRight size={17} />
          </Link>
        </section>
      </main>

      <footer className="footer">
        <Link to="/" className="brand">
          <ShieldCheck size={22} />
          PHISH<span className="brand-highlight">SHIELD</span> AI
        </Link>
        <p>Detect. Analyze. Prevent. Stay Protected.</p>
        <span>© 2026 PHISHSHIELD AI. All rights reserved.</span>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/url-scanner" element={<URLScanner />} />
        <Route
  path="/email-analyzer" element={<EmailAnalyzer />}/>
  <Route path="/sms-detector" element={<SMSDetector />} />
   <Route path="/qr-scanner" element={<QRScanner />} />
   <Route path="/brand-detector" element={<BrandDetector />} />
   <Route
  path="/security-copilot"
  element={<SecurityCopilot />}
/>
<Route path="/scan-history" element={<ScanHistory />} />
   </Routes>
    </BrowserRouter>
  );
}

export default App;