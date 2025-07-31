import { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Point to the correct API root (defaulting to serverless Netlify path)
  const apiRoot = import.meta.env.VITE_API_URL || "/.netlify/functions/api";

  useEffect(() => {
    axios
      .get(`${apiRoot}/chat`)
      .then((res) => setMessages(res.data))
      .catch(console.error);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${apiRoot}/chat`, {
        text: input,
      });
      setMessages((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        from: "bot",
        text: "Sorry, something went wrong.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="w-[88%] max-w-md h-[30rem] shadow-xl rounded-xl bg-base-100 p-4 flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center mb-2">ChatBot</h1>
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat ${
                msg.from === "user" ? "chat-end" : "chat-start"
              }`}
            >
              <div
                className={`chat-bubble ${
                  msg.from === "user"
                    ? "chat-bubble-primary"
                    : "chat-bubble-secondary"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat chat-start">
              <div className="chat-bubble chat-bubble-secondary">
                <span className="loading loading-dots loading-md"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2">
          <input
            className="input input-bordered flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
            placeholder="Type your message..."
            disabled={loading}
          />
          <button
            className="btn btn-primary"
            onClick={sendMessage}
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
