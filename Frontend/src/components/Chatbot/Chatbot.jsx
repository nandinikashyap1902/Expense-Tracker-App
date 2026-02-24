import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaTimes, FaComments } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hi! I can analyze your expenses. Ask me things like "How much did I spend on food this month?"' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // Listen for external triggers (e.g. "AI Summary" button on Dashboard)
    useEffect(() => {
        const handleTrigger = (e) => {
            const msg = e.detail?.message;
            if (msg) {
                setIsOpen(true);
                sendMessage(msg);
            }
        };
        window.addEventListener('trigger-ai-chat', handleTrigger);
        return () => window.removeEventListener('trigger-ai-chat', handleTrigger);
    }, []);

    const sendMessage = async (text) => {
        setMessages(prev => [...prev, { sender: 'user', text }]);
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text }),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
            } else {
                const errData = await response.json().catch(() => ({}));
                setMessages(prev => [...prev, {
                    sender: 'bot',
                    text: `Error (${response.status}): ${errData.error || 'Server error'}`
                }]);
            }
        } catch {
            setMessages(prev => [...prev, { sender: 'bot', text: 'Connection error. Please try again.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed) return;
        setInput('');
        await sendMessage(trimmed);
    };

    return (
        <>
            <motion.button
                className="chatbot-toggle"
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                aria-label="Open AI assistant"
            >
                <FaComments />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="chatbot-window"
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    >
                        <div className="chatbot-header">
                            <div className="chatbot-title">
                                <FaRobot />
                                <span>AI Assistant</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} aria-label="Close chat">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="chatbot-messages">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`message ${msg.sender}`}>
                                    <div className="message-content">{msg.text}</div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="message bot">
                                    <div className="typing-indicator">
                                        <span /><span /><span />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSubmit} className="chatbot-input">
                            <input
                                type="text"
                                placeholder="Ask about your spending..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                aria-label="Chat message"
                            />
                            <button type="submit" disabled={isLoading || !input.trim()} aria-label="Send">
                                <FaPaperPlane />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;
