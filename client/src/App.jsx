// // import React, { useState } from "react";
// // import axios from "axios";

// // function App() {
// //   const [message, setMessage] = useState("");
// //   const [chat, setChat] = useState([]);

// //   const sendMessage = async () => {
// //     if (!message.trim()) return;

// //     const newChat = [...chat, { user: message }];
// //     setChat(newChat);
// //     setMessage("");

// //     try {
// //       const res = await axios.post("http://localhost:5000/chat", { message });
// //       setChat([...newChat, { bot: res.data.reply }]);
// //     } catch (err) {
// //       // ✅ Fixed: show error in chat instead of crashing
// //       setChat([...newChat, { bot: `Error: ${err.response?.data?.error || err.message}` }]);
// //     }
// //   };

// //   // ✅ Allow sending with Enter key
// //   const handleKeyDown = (e) => {
// //     if (e.key === "Enter") sendMessage();
// //   };

// //   return (
// //     <div style={{ padding: 20 }}>
// //       <h2>AI Chat App</h2>

// //       <div style={{ minHeight: 300 }}>
// //         {chat.map((c, i) => (
// //           <div key={i}>
// //             {c.user && <p><b>You:</b> {c.user}</p>}
// //             {c.bot && <p><b>AI:</b> {c.bot}</p>}
// //           </div>
// //         ))}
// //       </div>

// //       <input
// //         value={message}
// //         onChange={(e) => setMessage(e.target.value)}
// //         onKeyDown={handleKeyDown}
// //         placeholder="Type message..."
// //       />
// //       <button onClick={sendMessage}>Send</button>
// //     </div>
// //   );
// // }

// // export default App;

// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";

// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//   body {
//     background: #0a0a0f;
//     font-family: 'Sora', sans-serif;
//     height: 100vh;
//     overflow: hidden;
//   }

//   .app {
//     display: flex;
//     flex-direction: column;
//     height: 100vh;
//     background: #0a0a0f;
//     position: relative;
//     overflow: hidden;
//   }

//   /* Ambient background glow */
//   .app::before {
//     content: '';
//     position: fixed;
//     top: -200px;
//     left: -200px;
//     width: 600px;
//     height: 600px;
//     background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
//     pointer-events: none;
//     z-index: 0;
//   }
//   .app::after {
//     content: '';
//     position: fixed;
//     bottom: -200px;
//     right: -200px;
//     width: 600px;
//     height: 600px;
//     background: radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%);
//     pointer-events: none;
//     z-index: 0;
//   }

//   /* Header */
//   .header {
//     display: flex;
//     align-items: center;
//     gap: 12px;
//     padding: 18px 28px;
//     border-bottom: 1px solid rgba(255,255,255,0.06);
//     background: rgba(255,255,255,0.02);
//     backdrop-filter: blur(20px);
//     position: relative;
//     z-index: 10;
//   }

//   .header-icon {
//     width: 36px;
//     height: 36px;
//     border-radius: 10px;
//     background: linear-gradient(135deg, #6366f1, #8b5cf6);
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 18px;
//     box-shadow: 0 4px 15px rgba(99,102,241,0.4);
//   }

//   .header-title {
//     font-size: 16px;
//     font-weight: 600;
//     color: #f1f5f9;
//     letter-spacing: -0.3px;
//   }

//   .header-sub {
//     font-size: 11px;
//     color: #475569;
//     font-weight: 400;
//     margin-top: 1px;
//   }

//   .status-dot {
//     width: 7px;
//     height: 7px;
//     border-radius: 50%;
//     background: #10b981;
//     margin-left: auto;
//     box-shadow: 0 0 8px rgba(16,185,129,0.6);
//     animation: pulse 2s infinite;
//   }

//   @keyframes pulse {
//     0%, 100% { opacity: 1; }
//     50% { opacity: 0.4; }
//   }

//   /* Chat area */
//   .chat-area {
//     flex: 1;
//     overflow-y: auto;
//     padding: 28px 24px;
//     display: flex;
//     flex-direction: column;
//     gap: 20px;
//     position: relative;
//     z-index: 1;
//   }

//   .chat-area::-webkit-scrollbar { width: 4px; }
//   .chat-area::-webkit-scrollbar-track { background: transparent; }
//   .chat-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

//   /* Empty state */
//   .empty-state {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     flex: 1;
//     gap: 12px;
//     opacity: 0.35;
//     padding-bottom: 60px;
//   }

//   .empty-icon {
//     font-size: 42px;
//     filter: grayscale(0.3);
//   }

//   .empty-text {
//     font-size: 14px;
//     color: #64748b;
//     font-weight: 500;
//     letter-spacing: 0.5px;
//   }

//   /* Message row */
//   .msg-row {
//     display: flex;
//     align-items: flex-end;
//     gap: 10px;
//     animation: fadeSlide 0.3s ease forwards;
//     opacity: 0;
//   }

//   @keyframes fadeSlide {
//     from { opacity: 0; transform: translateY(10px); }
//     to { opacity: 1; transform: translateY(0); }
//   }

//   .msg-row.user { flex-direction: row-reverse; }
//   .msg-row.ai { flex-direction: row; }

//   /* Avatar */
//   .avatar {
//     width: 30px;
//     height: 30px;
//     border-radius: 50%;
//     flex-shrink: 0;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 13px;
//     font-weight: 600;
//   }

//   .avatar.ai {
//     background: linear-gradient(135deg, #6366f1, #8b5cf6);
//     color: white;
//     box-shadow: 0 2px 10px rgba(99,102,241,0.35);
//   }

//   .avatar.user {
//     background: linear-gradient(135deg, #0ea5e9, #06b6d4);
//     color: white;
//     box-shadow: 0 2px 10px rgba(14,165,233,0.35);
//   }

//   /* Bubble */
//   .bubble {
//     max-width: 65%;
//     padding: 13px 17px;
//     border-radius: 18px;
//     font-size: 14px;
//     line-height: 1.6;
//     font-weight: 400;
//     position: relative;
//     word-break: break-word;
//   }

//   .bubble.user {
//     background: linear-gradient(135deg, #6366f1, #4f46e5);
//     color: #f0f0ff;
//     border-bottom-right-radius: 4px;
//     box-shadow: 0 4px 20px rgba(99,102,241,0.25);
//   }

//   .bubble.ai {
//     background: rgba(255,255,255,0.05);
//     border: 1px solid rgba(255,255,255,0.08);
//     color: #cbd5e1;
//     border-bottom-left-radius: 4px;
//     backdrop-filter: blur(10px);
//   }

//   .bubble.error {
//     background: rgba(239,68,68,0.1);
//     border: 1px solid rgba(239,68,68,0.2);
//     color: #fca5a5;
//   }

//   .timestamp {
//     font-size: 10px;
//     color: #334155;
//     margin-top: 4px;
//     text-align: right;
//     font-family: 'JetBrains Mono', monospace;
//   }

//   .msg-row.ai .timestamp { text-align: left; }

//   /* Thinking dots */
//   .thinking-bubble {
//     background: rgba(255,255,255,0.04);
//     border: 1px solid rgba(255,255,255,0.08);
//     border-bottom-left-radius: 4px;
//     padding: 14px 20px;
//     border-radius: 18px;
//     display: flex;
//     align-items: center;
//     gap: 6px;
//   }

//   .thinking-label {
//     font-size: 11px;
//     color: #475569;
//     font-family: 'JetBrains Mono', monospace;
//     letter-spacing: 0.5px;
//     margin-right: 4px;
//   }

//   .dot {
//     width: 6px;
//     height: 6px;
//     border-radius: 50%;
//     background: #6366f1;
//     animation: bounce 1.2s infinite;
//   }

//   .dot:nth-child(2) { animation-delay: 0.2s; background: #8b5cf6; }
//   .dot:nth-child(3) { animation-delay: 0.4s; background: #a78bfa; }

//   @keyframes bounce {
//     0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
//     40% { transform: translateY(-6px); opacity: 1; }
//   }

//   /* Input area */
//   .input-area {
//     padding: 16px 20px 20px;
//     border-top: 1px solid rgba(255,255,255,0.05);
//     background: rgba(255,255,255,0.02);
//     backdrop-filter: blur(20px);
//     position: relative;
//     z-index: 10;
//   }

//   .input-row {
//     display: flex;
//     align-items: center;
//     gap: 10px;
//     background: rgba(255,255,255,0.05);
//     border: 1px solid rgba(255,255,255,0.09);
//     border-radius: 14px;
//     padding: 10px 14px;
//     transition: border-color 0.2s;
//   }

//   .input-row:focus-within {
//     border-color: rgba(99,102,241,0.5);
//     box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
//   }

//   .chat-input {
//     flex: 1;
//     background: transparent;
//     border: none;
//     outline: none;
//     color: #e2e8f0;
//     font-size: 14px;
//     font-family: 'Sora', sans-serif;
//     font-weight: 400;
//     resize: none;
//     line-height: 1.5;
//     max-height: 100px;
//     overflow-y: auto;
//   }

//   .chat-input::placeholder { color: #334155; }

//   .send-btn {
//     width: 36px;
//     height: 36px;
//     border-radius: 10px;
//     border: none;
//     background: linear-gradient(135deg, #6366f1, #4f46e5);
//     color: white;
//     cursor: pointer;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     transition: all 0.2s;
//     flex-shrink: 0;
//     box-shadow: 0 2px 10px rgba(99,102,241,0.3);
//   }

//   .send-btn:hover:not(:disabled) {
//     transform: scale(1.07);
//     box-shadow: 0 4px 16px rgba(99,102,241,0.5);
//   }

//   .send-btn:disabled {
//     opacity: 0.4;
//     cursor: not-allowed;
//     transform: none;
//   }

//   .hint {
//     text-align: center;
//     font-size: 10px;
//     color: #1e293b;
//     margin-top: 10px;
//     letter-spacing: 0.3px;
//   }
// `;

// function getTime() {
//   return new Date().toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

// export default function App() {
//   const [message, setMessage] = useState("");
//   const [chat, setChat] = useState([]);
//   const [thinking, setThinking] = useState(false);
//   const bottomRef = useRef(null);
//   const textareaRef = useRef(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chat, thinking]);

//   const sendMessage = async () => {
//     const trimmed = message.trim();
//     if (!trimmed || thinking) return;

//     const userMsg = { role: "user", text: trimmed, time: getTime() };
//     setChat((prev) => [...prev, userMsg]);
//     setMessage("");
//     setThinking(true);

//     // Reset textarea height
//     if (textareaRef.current) textareaRef.current.style.height = "auto";

//     try {
//       const res = await axios.post("http://localhost:5000/chat", {
//         message: trimmed,
//       });
//       setChat((prev) => [
//         ...prev,
//         { role: "ai", text: res.data.reply, time: getTime() },
//       ]);
//     } catch (err) {
//       const errMsg = err.response?.data?.error || err.message;
//       setChat((prev) => [
//         ...prev,
//         { role: "ai", text: `⚠️ ${errMsg}`, time: getTime(), error: true },
//       ]);
//     } finally {
//       setThinking(false);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const handleInput = (e) => {
//     setMessage(e.target.value);
//     e.target.style.height = "auto";
//     e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
//   };

//   return (
//     <>
//       <style>{styles}</style>
//       <div className="app">
//         {/* Header */}
//         <div className="header">
//           <div className="header-icon">✦</div>
//           <div>
//             <div className="header-title">Gemini AI</div>
//             <div className="header-sub">Powered by Gemini 2.5 Flash</div>
//           </div>
//           <div className="status-dot" />
//         </div>

//         {/* Chat */}
//         <div className="chat-area">
//           {chat.length === 0 && !thinking && (
//             <div className="empty-state">
//               <div className="empty-icon">✦</div>
//               <div className="empty-text">Start a conversation</div>
//             </div>
//           )}

//           {chat.map((msg, i) => (
//             <div key={i} className={`msg-row ${msg.role}`}>
//               <div className={`avatar ${msg.role}`}>
//                 {msg.role === "ai" ? "G" : "U"}
//               </div>
//               <div>
//                 <div
//                   className={`bubble ${msg.role}${msg.error ? " error" : ""}`}
//                 >
//                   {msg.text}
//                 </div>
//                 <div className="timestamp">{msg.time}</div>
//               </div>
//             </div>
//           ))}

//           {/* Thinking indicator */}
//           {thinking && (
//             <div
//               className="msg-row ai"
//               style={{ animation: "fadeSlide 0.3s ease forwards" }}
//             >
//               <div className="avatar ai">G</div>
//               <div className="thinking-bubble">
//                 <span className="thinking-label">thinking</span>
//                 <div className="dot" />
//                 <div className="dot" />
//                 <div className="dot" />
//               </div>
//             </div>
//           )}

//           <div ref={bottomRef} />
//         </div>

//         {/* Input */}
//         <div className="input-area">
//           <div className="input-row">
//             <textarea
//               ref={textareaRef}
//               className="chat-input"
//               rows={1}
//               value={message}
//               onChange={handleInput}
//               onKeyDown={handleKeyDown}
//               placeholder="Ask me anything..."
//               disabled={thinking}
//             />
//             <button
//               className="send-btn"
//               onClick={sendMessage}
//               disabled={!message.trim() || thinking}
//             >
//               <svg
//                 width="16"
//                 height="16"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               >
//                 <line x1="22" y1="2" x2="11" y2="13" />
//                 <polygon points="22 2 15 22 11 13 2 9 22 2" />
//               </svg>
//             </button>
//           </div>
//           <div className="hint">Enter to send · Shift+Enter for new line</div>
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0a0a0f;
    font-family: 'Sora', sans-serif;
    height: 100vh;
    overflow: hidden;
  }

  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #0a0a0f;
    position: relative;
    overflow: hidden;
  }

  .app::before {
    content: '';
    position: fixed;
    top: -200px;
    left: -200px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .app::after {
    content: '';
    position: fixed;
    bottom: -200px;
    right: -200px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* Header */
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 18px 28px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    background: rgba(255,255,255,0.02);
    backdrop-filter: blur(20px);
    position: relative;
    z-index: 10;
  }

  .header-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    box-shadow: 0 4px 15px rgba(99,102,241,0.4);
  }

  .header-title {
    font-size: 16px;
    font-weight: 600;
    color: #f1f5f9;
    letter-spacing: -0.3px;
  }

  .header-sub {
    font-size: 11px;
    color: #475569;
    font-weight: 400;
    margin-top: 1px;
  }

  .status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #10b981;
    margin-left: auto;
    box-shadow: 0 0 8px rgba(16,185,129,0.6);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  /* Chat area */
  .chat-area {
    flex: 1;
    overflow-y: auto;
    padding: 28px 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
    z-index: 1;
  }

  .chat-area::-webkit-scrollbar { width: 4px; }
  .chat-area::-webkit-scrollbar-track { background: transparent; }
  .chat-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

  /* Empty state */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    gap: 12px;
    opacity: 0.35;
    padding-bottom: 60px;
  }

  .empty-icon { font-size: 42px; }

  .empty-text {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  /* Message row */
  .msg-row {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    animation: fadeSlide 0.3s ease forwards;
    opacity: 0;
  }

  @keyframes fadeSlide {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .msg-row.user { flex-direction: row-reverse; }
  .msg-row.ai   { flex-direction: row; }

  /* Avatar */
  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 600;
  }

  .avatar.ai {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    box-shadow: 0 2px 10px rgba(99,102,241,0.35);
  }

  .avatar.user {
    background: linear-gradient(135deg, #0ea5e9, #06b6d4);
    color: white;
    box-shadow: 0 2px 10px rgba(14,165,233,0.35);
  }

  /* ✅ FIXED BUBBLE — min-width stops single letters stacking */
  .bubble {
    max-width: 65%;
    min-width: 60px;
    padding: 13px 17px;
    border-radius: 18px;
    font-size: 14px;
    line-height: 1.6;
    font-weight: 400;
    position: relative;
    word-break: break-word;
    white-space: pre-wrap;
  }

  .bubble.user {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: #f0f0ff;
    border-bottom-right-radius: 4px;
    box-shadow: 0 4px 20px rgba(99,102,241,0.25);
  }

  .bubble.ai {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    color: #cbd5e1;
    border-bottom-left-radius: 4px;
    backdrop-filter: blur(10px);
  }

  .bubble.error {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.2);
    color: #fca5a5;
  }

  .timestamp {
    font-size: 10px;
    color: #334155;
    margin-top: 4px;
    text-align: right;
    font-family: 'JetBrains Mono', monospace;
  }

  .msg-row.ai .timestamp { text-align: left; }

  /* Thinking dots */
  .thinking-bubble {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    border-bottom-left-radius: 4px;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .thinking-label {
    font-size: 11px;
    color: #475569;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.5px;
    margin-right: 4px;
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #6366f1;
    animation: bounce 1.2s infinite;
  }

  .dot:nth-child(2) { animation-delay: 0.2s; background: #8b5cf6; }
  .dot:nth-child(3) { animation-delay: 0.4s; background: #a78bfa; }

  @keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
    40% { transform: translateY(-6px); opacity: 1; }
  }

  /* Input area */
  .input-area {
    padding: 16px 20px 20px;
    border-top: 1px solid rgba(255,255,255,0.05);
    background: rgba(255,255,255,0.02);
    backdrop-filter: blur(20px);
    position: relative;
    z-index: 10;
  }

  .input-row {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 14px;
    padding: 10px 14px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .input-row:focus-within {
    border-color: rgba(99,102,241,0.5);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
  }

  .chat-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #e2e8f0;
    font-size: 14px;
    font-family: 'Sora', sans-serif;
    font-weight: 400;
    resize: none;
    line-height: 1.5;
    max-height: 100px;
    overflow-y: auto;
  }

  .chat-input::placeholder { color: #334155; }

  .send-btn {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: none;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
    box-shadow: 0 2px 10px rgba(99,102,241,0.3);
  }

  .send-btn:hover:not(:disabled) {
    transform: scale(1.07);
    box-shadow: 0 4px 16px rgba(99,102,241,0.5);
  }

  .send-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  .hint {
    text-align: center;
    font-size: 10px;
    color: #1e293b;
    margin-top: 10px;
    letter-spacing: 0.3px;
  }
`;

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, thinking]);

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed || thinking) return;

    const userMsg = { role: "user", text: trimmed, time: getTime() };
    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setThinking(true);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        message: trimmed,
      });
      setChat((prev) => [
        ...prev,
        { role: "ai", text: res.data.reply, time: getTime() },
      ]);
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message;
      setChat((prev) => [
        ...prev,
        { role: "ai", text: `⚠️ ${errMsg}`, time: getTime(), error: true },
      ]);
    } finally {
      setThinking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInput = (e) => {
    setMessage(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* Header */}
        <div className="header">
          <div className="header-icon">✦</div>
          <div>
            <div className="header-title">Gemini AI</div>
            <div className="header-sub">Powered by Gemini 2.5 Flash</div>
          </div>
          <div className="status-dot" />
        </div>

        {/* Chat */}
        <div className="chat-area">
          {chat.length === 0 && !thinking && (
            <div className="empty-state">
              <div className="empty-icon">✦</div>
              <div className="empty-text">Start a conversation</div>
            </div>
          )}

          {chat.map((msg, i) => (
            <div key={i} className={`msg-row ${msg.role}`}>
              <div className={`avatar ${msg.role}`}>
                {msg.role === "ai" ? "G" : "U"}
              </div>
              <div>
                <div
                  className={`bubble ${msg.role}${msg.error ? " error" : ""}`}
                >
                  {msg.text}
                </div>
                <div className="timestamp">{msg.time}</div>
              </div>
            </div>
          ))}

          {/* Thinking indicator */}
          {thinking && (
            <div className="msg-row ai">
              <div className="avatar ai">G</div>
              <div className="thinking-bubble">
                <span className="thinking-label">thinking</span>
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="input-area">
          <div className="input-row">
            <textarea
              ref={textareaRef}
              className="chat-input"
              rows={1}
              value={message}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              disabled={thinking}
            />
            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={!message.trim() || thinking}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <div className="hint">Enter to send · Shift+Enter for new line</div>
        </div>
      </div>
    </>
  );
}
