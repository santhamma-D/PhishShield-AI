
import { useState, useRef, useEffect } from "react";
import {
  ShieldCheck,
  Sparkles,
  Send,
  Bot,
  User,
  Trash2,
  ArrowLeft,
  LockKeyhole,
  Zap,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./SecurityCopilot.css";
import API_BASE_URL from "../api";

interface Message {
  role: "assistant" | "user";
  content: string;
}

const suggestions = [
  "How can I identify a phishing website?",
  "What should I do after clicking a suspicious link?",
  "How can I protect my passwords?",
  "How do I recognize fake emails?",
];

function SecurityCopilot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your PhishShield Security Copilot. I can help you understand online threats, identify suspicious activity, and improve your digital security. What would you like to know?",
    },
  ]);

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text = question) => {
    const trimmedQuestion = text.trim();

    if (!trimmedQuestion || loading) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", content: trimmedQuestion },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/security-copilot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: trimmedQuestion,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.answer || "Unable to get a response.");
      }

      setMessages((previous) => [
        ...previous,
        { role: "assistant", content: data.answer },
      ]);
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "I couldn't connect to the security service. Please check that your PhishShield backend is running and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Conversation cleared. I'm ready to help with your cybersecurity questions.",
      },
    ]);
  };

  return (
    <main className="copilot-page">
      <header className="copilot-topbar">
        <Link to="/dashboard" className="copilot-back">
          <ArrowLeft size={18} />
          Dashboard
        </Link>

        <div className="copilot-brand">
          <div className="copilot-brand-icon">
            <ShieldCheck size={22} />
          </div>
          <span>PHISHSHIELD <strong>AI</strong></span>
        </div>

        <div className="copilot-secure-status">
          <span className="status-dot"></span>
          Security Assistant
        </div>
      </header>

      <div className="copilot-layout">
        <aside className="copilot-sidebar">
          <div className="copilot-sidebar-heading">
            <span className="sidebar-icon">
              <Sparkles size={22} />
            </span>
            <div>
              <h2>AI Copilot</h2>
              <p>Your security companion</p>
            </div>
          </div>

          <div className="copilot-feature-card">
            <div className="feature-icon">
              <LockKeyhole size={23} />
            </div>
            <h3>Stay protected.</h3>
            <p>
              Get practical guidance to recognize digital threats and protect
              your online identity.
            </p>
          </div>

          <div className="copilot-sidebar-label">
            AVAILABLE TOPICS
          </div>

          <div className="copilot-topic">
            <ShieldCheck size={17} />
            Phishing protection
          </div>
          <div className="copilot-topic">
            <LockKeyhole size={17} />
            Password security
          </div>
          <div className="copilot-topic">
            <MessageCircle size={17} />
            Email and SMS scams
          </div>
          <div className="copilot-topic">
            <Zap size={17} />
            Online safety
          </div>

          <div className="copilot-sidebar-note">
            <ShieldCheck size={17} />
            <span>Security awareness starts with knowledge.</span>
          </div>
        </aside>

        <section className="copilot-chat">
          <div className="copilot-chat-header">
            <div className="chat-title-icon">
              <Bot size={23} />
            </div>
            <div className="chat-title">
              <h2>Security Assistant</h2>
              <p><span className="status-dot"></span> Ready to assist</p>
            </div>

            <button
              className="clear-chat-btn"
              onClick={clearChat}
              disabled={loading}
              title="Clear conversation"
            >
              <Trash2 size={17} />
              <span>Clear chat</span>
            </button>
          </div>

          <div className="copilot-messages">
            {messages.map((message, index) => (
              <div
                className={`chat-message ${message.role}`}
                key={index}
              >
                <div className="message-avatar">
                  {message.role === "assistant" ? (
                    <Bot size={19} />
                  ) : (
                    <User size={19} />
                  )}
                </div>

                <div className="message-content">
                  <span className="message-sender">
                    {message.role === "assistant"
                      ? "PHISHSHIELD AI"
                      : "YOU"}
                  </span>
                  <p>{message.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-message assistant">
                <div className="message-avatar">
                  <Bot size={19} />
                </div>
                <div className="message-content">
                  <span className="message-sender">PHISHSHIELD AI</span>
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {messages.length <= 1 && (
            <div className="copilot-suggestions">
              <span className="suggestion-label">
                <Sparkles size={15} />
                SUGGESTED QUESTIONS
              </span>

              <div className="suggestion-grid">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    disabled={loading}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form
            className="copilot-input-area"
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <div className="copilot-input-wrap">
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask anything about cybersecurity..."
                disabled={loading}
              />

              <button
                type="submit"
                className="copilot-send-btn"
                disabled={!question.trim() || loading}
                aria-label="Send message"
              >
                <Send size={19} />
              </button>
            </div>

            <p className="copilot-disclaimer">
              <LockKeyhole size={13} />
              Security guidance assistant · Verify critical advice with
              official security sources.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}

export default SecurityCopilot;
