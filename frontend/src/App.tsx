import { useState, useRef, useEffect } from 'react';
import './App.css';

type Message = {
  text: string;
  from: 'ai' | 'user';
  timestamp?: Date;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newInputValue, setNewInputValue] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
const functionUrl =
  'https://ltyj7imbj5iksnq3khysx3qvye0xkjap.lambda-url.ap-south-1.on.aws/';

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const newMessage: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError('');

    if (!newInputValue.trim()) return;

    const userMessage = newInputValue;

    setIsBusy(true);
    setNewInputValue('');

    const newMessages: Message[] = [
      ...messages,
      {
        text: userMessage,
        from: 'user',
        timestamp: new Date(),
      },
    ];

    setMessages(newMessages);

    try {
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status}. Make sure the Lambda URL is configured correctly.`
        );
      }

      const aiResponse = await response.text();

      setMessages([
        ...newMessages,
        {
          from: 'ai',
          text: aiResponse || 'Arrr, I be thinkin\' on that...',
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Arrr! Something went wrong on the high seas!';
      setError(errorMessage);

      setMessages([
        ...newMessages,
        {
          from: 'ai',
          text: '❌ ' + errorMessage,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <main>
      <div className="header">
  <div className="logo">🏴‍☠️</div>

  <div>
    <h1>Captain Blackbeard AI</h1>
    <p>Your Pirate Assistant powered by AWS Lambda</p>
  </div>
</div>

      <div className="chat-area">
        {messages.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '1.1em',
              marginTop: 'auto',
              marginBottom: 'auto',
            }}
          >
            <div className="welcome-card">
              <p>🏴‍☠️ Welcome to the Pirate ChatBot! 🏴‍☠️</p>
            <p>Start a conversation to begin yer adventure on the high seas!</p>
            </div>
            
          </div>
        )}

        {messages.map((message, index) => (
          <div
  key={index}
  className={`message-row ${message.from}`}
>
  <div className="avatar">
    {message.from === 'ai' ? '🏴‍☠️' : '🧑'}
  </div>

  <div
    className={`message ${message.from}`}
    title={message.timestamp?.toLocaleTimeString()}
  >
    {message.text}
  </div>
</div>
        ))}

        {isBusy && (
          <div
            className="message ai"
            style={{
              opacity: 0.7,
              fontStyle: 'italic',
              alignSelf: 'flex-start',
            }}
          >
            ⚓ The pirate be thinkin'...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div
          style={{
            padding: '12px 16px',
            background: 'rgba(255, 107, 0, 0.3)',
            border: '1px solid rgba(255, 107, 0, 0.6)',
            borderRadius: '8px',
            color: '#ffb380',
            marginBottom: '10px',
            fontSize: '0.95em',
          }}
        >
          {error}
        </div>
      )}

      <form
        className="vertical"
        onSubmit={newMessage}
      >
        <input
          type="text"
          value={newInputValue}
          onChange={(e) => setNewInputValue(e.currentTarget.value)}
          placeholder="Speak to the pirate..."
          disabled={isBusy}
          autoFocus
          aria-label="Message input"
        />

        <button
          type="submit"
          disabled={isBusy || !newInputValue.trim()}
          aria-label={isBusy ? 'Waiting for response' : 'Send message'}
        >
          {isBusy ? 'Sending...' : 'Send'}
        </button>
      </form>
    </main>
  );
}

export default App;