import { Link } from "react-router-dom";
import {
  ShieldCheck,
  ShieldAlert,
  Bot,
  Globe,
  Mail,
  MessageSquare,
  QrCode,
  Activity,
  ArrowUpRight,
  Fingerprint,
} from "lucide-react";
import "./Dashboard.css";

const stats = [
  {
    title: "Total Scans",
    value: "1,284",
    icon: Activity,
    description: "Sample dashboard data",
  },
  {
    title: "Threats Detected",
    value: "186",
    icon: ShieldAlert,
    description: "Sample dashboard data",
  },
  {
    title: "Safe Websites",
    value: "1,098",
    icon: ShieldCheck,
    description: "Sample dashboard data",
  },
];


const tools = [
  {
    name: "URL Scanner",
    description: "Check suspicious website links.",
    icon: Globe,
    path: "/url-scanner",
  },
  {
    name: "Email Analyzer",
    description: "Analyze suspicious emails.",
    icon: Mail,
    path: "#",
  },
  {
    name: "SMS Detector",
    description: "Identify scam messages.",
    icon: MessageSquare,
    path: "#",
  },
  {
  name: "QR Scanner",
  description: "Scan QR codes and detect suspicious links.",
  icon: QrCode,
},
{
  name: "Brand Detector",
  description: "Detect websites impersonating trusted brands.",
  icon: Fingerprint,
},
{
  name: "AI Security Copilot",
  description: "Get intelligent guidance for cybersecurity threats.",
  icon: Bot,
},
{
  name: "AI Security Copilot",
  description: "Get intelligent guidance for cybersecurity threats.",
  icon: Bot,
},
];


function Dashboard() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2><ShieldCheck size={25} /> PHISHSHIELD</h2>
        <p className="sidebar-label">MAIN MENU</p>
        <a className="active" href="/dashboard">Dashboard</a>
        <a href="/">Home</a>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Security Dashboard</h1>
            <p>Monitor your digital security activity.</p>
          </div>
          <span className="status"><span /> Protection Ready</span>
        </header>

        <section className="welcome-card">
          <div>
            <p>WELCOME TO PHISHSHIELD AI</p>
            <h2>Stay protected from online threats.</h2>
            <p>Detect. Analyze. Prevent. Stay Protected.</p>
          </div>
          <ShieldCheck size={75} />
        </section>

        <section className="stats-grid">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <article className="stat-card" key={item.title}>
                <div className="stat-icon"><Icon size={25} /></div>
                <p>{item.title}</p>
                <h2>{item.value}</h2>
                <small>{item.description}</small>
              </article>
            );
          })}
        </section>

  
<section className="tools-section">
  <h2>Security Tools</h2>

  <div className="tools-grid">
    {tools.map((tool) => {
      const Icon = tool.icon;

      return (
        <article className="tool-card" key={tool.name}>
          <Icon size={30} />

          <h3>{tool.name}</h3>
          <p>{tool.description}</p>

{tool.name === "URL Scanner" ? (
  <Link to="/url-scanner" className="tool-link">
    Open Scanner <ArrowUpRight size={15} />
  </Link>
) : tool.name === "Email Analyzer" ? (
  <Link to="/email-analyzer" className="tool-link">
    Open Analyzer <ArrowUpRight size={15} />
  </Link>
) : tool.name === "SMS Detector" ? (
  <Link to="/sms-detector" className="tool-link">
    Open Detector <ArrowUpRight size={15} />
  </Link>
) : tool.name === "QR Scanner" ? (
  <Link to="/qr-scanner" className="tool-link">
    Open Scanner <ArrowUpRight size={15} />
  </Link>
) :  tool.name === "Brand Detector" ? (
  <Link to="/brand-detector" className="tool-link">
    Open Detector <ArrowUpRight size={15} />
  </Link>):tool.name === "AI Security Copilot" ? (
  <Link to="/security-copilot" className="tool-link">
    Open Copilot <ArrowUpRight size={15} />
  </Link>) : tool.name === "AI Security Copilot" ? (
  <Link to="/security-copilot" className="tool-link">
    Open Copilot <ArrowUpRight size={15} />
  </Link>):(
  <span className="coming-soon">Coming Soon</span>
)}

        </article>
      );
    })}
  </div>
</section>

<p className="sample-note">
  Note: The displayed statistics are sample values, not actual scan results.
</p>
</main>
</div>
);
}

export default Dashboard;
