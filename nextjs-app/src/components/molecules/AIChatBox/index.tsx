import React, { useState, useRef, useEffect } from 'react'
import MessageBubble from './components/MessageBubble'
import TypingIndicator from './components/TypingIndicator'
import ChatHeader from './components/ChatHeader'
import ChatInput from './components/ChatInput'

const AIChat = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm Claude, an AI assistant created by Anthropic. How can I help you today?",
            sender: 'ai',
            timestamp: new Date(),
        },
    ])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const simulateAIResponse = (userMessage) => {
        const responses = [
            "That's an interesting question! Let me think about that for a moment...",
            "I'd be happy to help you with that. Here's what I think...",
            "Great question! Based on what you've asked, I can provide some insights...",
            "I understand what you're looking for. Let me break this down for you...",
            "That's a thoughtful inquiry. Here's my perspective on this topic...",
        ]

        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        return `${randomResponse} You asked about: "${userMessage}". This is a simulated response to demonstrate the chat interface functionality.`
    }

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isTyping) return

        const userMessage = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        const currentInput = inputValue
        setInputValue('')
        setIsTyping(true)

        // Simulate AI thinking time
        setTimeout(
            () => {
                const aiResponse = {
                    id: Date.now() + 1,
                    text: simulateAIResponse(currentInput),
                    sender: 'ai',
                    timestamp: new Date(),
                }
                setMessages((prev) => [...prev, aiResponse])
                setIsTyping(false)
            },
            1500 + Math.random() * 1500,
        )
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const handleNewChat = () => {
        setMessages([
            {
                id: 1,
                text: "Hello! I'm Claude, an AI assistant created by Anthropic. How can I help you today?",
                sender: 'ai',
                timestamp: new Date(),
            },
        ])
        setInputValue('')
        setIsTyping(false)
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <ChatHeader handleNewChat={handleNewChat} />
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-4">
                    {messages.map((msg) => (
                        <MessageBubble
                            key={msg.id}
                            message={{
                                ...msg,
                                sender: msg.sender === 'ai' ? 'ai' : 'user',
                                timestamp:
                                    msg.timestamp instanceof Date
                                        ? msg.timestamp
                                        : new Date(msg.timestamp),
                            }}
                        />
                    ))}

                    {isTyping && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
                <div className="max-w-4xl mx-auto">
                    <ChatInput
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        handleSendMessage={handleSendMessage}
                        handleKeyPress={handleKeyPress}
                        isTyping={isTyping}
                    />

                    <div className="text-center mt-3">
                        <p className="text-xs text-gray-500">
                            Claude can make mistakes. Please verify important information.
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </div>
    )
}

export default AIChat
