import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Include the https:// protocol in the URL
      const response = await axios.post("https://mindease3.azurewebsites.net/api/app", {
        user_input: input,
        conversation: messages.length === 0 ? undefined : messages,
      });

      if (response.data && Array.isArray(response.data)) {
        setMessages(response.data);
      } else {
        setMessages([...messages, { role: "assistant", content: "No response received. Please try again." }]);
      }
    } catch (error) {
      console.error(error);
      setMessages([...messages, { role: "assistant", content: "An error occurred. Please try again." }]);
    } finally {
      setInput("");
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>MindEase Pre-Consulting App</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="input">Your question:</label>
            <input
              id="input"
              type="text"
              className="form-control"
              value={input}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>
        <MessageList messages={messages} />
      </main>
    </div>
  );
}

function MessageList({ messages }) {
  return (
    <div className="message-list">
      <h2>Message History</h2>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <strong>{message.role === "user" ? "User" : "AI Assistant"}:</strong>{" "}
            {message.content.includes("```") ? (
              <pre className={message.role === "user" ? "user-code" : "chatgpt-code"}>
                <code>{message.content.replace(/```/g, "")}</code>
              </pre>
            ) : (
              <pre className={message.role === "user" ? "user-message" : "chatgpt-message"}>
                {message.content}
              </pre>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;