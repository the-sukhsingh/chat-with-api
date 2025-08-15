import React, { useState, useEffect, ReactNode, useMemo, useRef } from 'react';

interface TypewriterProps {
    children: ReactNode;
    speed?: 'slow' | 'medium' | 'fast';
    variance?: number; // Random variance in typing speed (0-1)
    backspace?: 'none' | 'char' | 'word'; // Backspace simulation
    showCursor?: boolean; // Show blinking cursor
}

const Typewriter = ({
    children,
    speed = 'medium',
    variance = 0.3,
    backspace = 'none',
    showCursor = true
}: TypewriterProps) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showBlinkingCursor, setShowBlinkingCursor] = useState(true);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const currentIndexRef = useRef(0);

    // Extract and memoize text content to prevent unnecessary re-renders
    const textContent = useMemo(() => {
        const extractTextContent = (node: ReactNode): string => {
            if (typeof node === 'string') return node;
            if (typeof node === 'number') return node.toString();
            if (React.isValidElement(node)) {
                // Handle ReactMarkdown and other components by extracting their props.children
                const props = node.props as any;
                if (props && props.children) {
                    return extractTextContent(props.children);
                }
                return '';
            }
            if (Array.isArray(node)) {
                return node.map(extractTextContent).join('');
            }
            return '';
        };
        
        return extractTextContent(children);
    }, [children]);

    useEffect(() => {
        // Clear any existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // If we have new content to type
        if (textContent && textContent.length > currentIndexRef.current) {
            if (!isTyping) {
                setIsTyping(true);
            }
            
            // Convert speed setting to milliseconds with variance
            const baseSpeed = speed === 'slow' ? 120 : speed === 'medium' ? 60 : 5;
            
            const typeNextCharacter = () => {
                const index = currentIndexRef.current;
                
                if (index >= textContent.length) {
                    setIsTyping(false);
                    return;
                }
                
                // Add random variance to typing speed for more natural feel
                const varianceAmount = variance * baseSpeed * (Math.random() - 0.5);
                const charSpeed = Math.max(5, baseSpeed + varianceAmount);
                
                // Special handling for punctuation (slower)
                const char = textContent[index];
                const isPunctuation = /[.!?,:;]/.test(char);
                const finalSpeed = isPunctuation ? charSpeed * 1.5 : charSpeed;
                
                // Update displayed text
                setDisplayedText(textContent.substring(0, index + 1));
                currentIndexRef.current = index + 1;
                
                // Schedule next character
                if (index + 1 < textContent.length) {
                    typingTimeoutRef.current = setTimeout(typeNextCharacter, finalSpeed);
                } else {
                    setIsTyping(false);
                }
            };
            
            // Start typing the next character
            typeNextCharacter();
        }
        
        // Reset if the content is completely new (e.g., new conversation)
        if (textContent.length === 0 || 
            (displayedText.length > 0 && !textContent.startsWith(displayedText))) {
            currentIndexRef.current = 0;
            setDisplayedText('');
        }
        
    }, [textContent, speed, variance]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, []);

    // Cursor blinking effect
    useEffect(() => {
        if (!showCursor) return;
        
        const cursorInterval = setInterval(() => {
            setShowBlinkingCursor(prev => !prev);
        }, 530);
        
        return () => clearInterval(cursorInterval);
    }, [showCursor]);

    return (
        <div className="typewriter-container">
            <style jsx>{`
                .typewriter-container {
                    position: relative;
                    display: inline-block;
                    width: 100%;
                }
                
                .typewriter-text {
                    opacity: 1;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }
                
                .typewriter-cursor {
                    display: inline-block;
                    width: 2px;
                    height: 1.2em;
                    background-color: #9333ea;
                    margin-left: 2px;
                    animation: cursorBlink 1.06s infinite;
                }
                
                @keyframes textGlow {
                    0% {
                        text-shadow: 0 0 5px rgba(147, 51, 234, 0.5);
                    }
                    100% {
                        text-shadow: 0 0 0px rgba(147, 51, 234, 0);
                    }
                }
                
                @keyframes cursorBlink {
                    0%, 50% {
                        opacity: 1;
                    }
                    51%, 100% {
                        opacity: 0;
                    }
                }
                
                .typewriter-char {
                    display: inline;
                    animation: charAppear 0.3s ease-out;
                }
                
                @keyframes charAppear {
                    0% {
                        opacity: 0;
                        transform: translateY(-2px);
                        text-shadow: 0 0 10px rgba(147, 51, 234, 0.8);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                        text-shadow: 0 0 0px rgba(147, 51, 234, 0);
                    }
                }
            `}</style>

            <div className="typewriter-text">
                {displayedText.split('').map((char, index) => (
                    <span 
                        key={`${index}-${char}-${textContent.length}`}
                        className="typewriter-char"
                    >
                        {char}
                    </span>
                ))}
            </div>
            
            {showCursor && (
                <span 
                    className="typewriter-cursor"
                    style={{
                        opacity: isTyping ? 1 : (showBlinkingCursor ? 1 : 0)
                    }}
                />
            )}
        </div>
    );
}

export default Typewriter;