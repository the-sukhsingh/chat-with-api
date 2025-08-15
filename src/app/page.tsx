"use client"

import { Copy, LoaderIcon, Send, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Typewriter from "@/components/TypeWriter";
import Link from "next/link";

import ReactMarkdown from 'react-markdown';
import { Chat } from "@/utils/chat";

export default function Home() {
  const [inputData, SetInputData] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiKeySet, setApiKeySet] = useState(false);
  const [hasEverHadResponse, setHasEverHadResponse] = useState(false);

  useEffect(() => {
    const localApiKey = localStorage.getItem("api-key")
    if (localApiKey) {
      setApiKey(localApiKey)
      setApiKeySet(true)
    }
  }, [])

  const setLocalApiKey = async () => {
    const res = await fetch("/api/checkapikey", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ apiKey })
    });

    if (res.ok) {
      localStorage.setItem("api-key", apiKey);
      setApiKey(apiKey);
      setApiKeySet(true);
    }
  }

  const setApiKeyy = async () => {
    if (apiKey.trim() === "") {
      alert("Please enter a valid API key.");
      return;
    }
    setLoading(true);
    try {
      await setLocalApiKey();
    } catch (error) {
      console.error("Error setting API key:", error);
      alert("Failed to set API key. Please try again.");
    } finally {
      setLoading(false);
    }
  }


  const handleStreamChat = async () => {
    if (!inputData.trim()) return;

    setLoading(true);
    const currentInput = inputData;
    SetInputData(""); // Clear input immediately for better UX

    // Set that we've had a response to maintain the 
    if (!hasEverHadResponse) {
      setHasEverHadResponse(true);
    }

    // Only clear response if this is a new conversation
    setResponse("");

    try {

      const res = await Chat(apiKey, currentInput)

      if ('error' in res) {
        setResponse(res.error);
        return;
      }

      const reader = res?.getReader();

      if (!reader) {
        throw new Error("Failed to get reader");
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader?.read();
        if (done) break;
        const chunk = decoder.decode(value);

        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            setResponse((prev) => prev + data.content);
          }
        }
      }

    } catch (error) {
      setResponse("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  }






  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Header - only show when there's a response */}
      <AnimatePresence>
        {apiKeySet && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Change API Key"
            className="p-2 text-sm border border-gray-600 absolute top-2 right-2 cursor-pointer 
                       text-gray-300 hover:bg-gray-700 hover:text-white z-50
                       rounded-xl transition-all duration-200"
            onClick={() => {
              setApiKeySet(false);
              // setApiKey("");
              setResponse("");
              setHasEverHadResponse(false);
              // localStorage.removeItem("api-key");
            }}
          >
            <Settings />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="relative min-h-screen flex flex-col">
        {/* API Key Configuration */}

        {!apiKeySet && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
              delay: 0.4,
            }}
            className="flex-1 flex items-center justify-center px-4"
          >
            <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 p-8">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-center mb-2">
                  Welcome to AI Chat
                </h2>
                <p className="text-gray-400 text-center mb-2">
                  Enter your Gemini API key to get started
                </p>
                <p className="text-gray-400 text-center mb-6">
                  Get Your Gemini API Key from {" "}
                  <Link href={"https://aistudio.google.com/"} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium underline-offset-2 hover:underline">
                    Here
                  </Link>
                </p>
                <div className="space-y-4">
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="password"
                    className="w-full px-4 py-3 border border-gray-600 rounded-xl 
                             bg-gray-700/50 text-white placeholder-gray-400
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-all duration-200 backdrop-blur-sm"
                    placeholder="Enter your API key..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                             disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                             text-white font-medium py-3 px-4 rounded-xl
                             transition-all duration-200 shadow-lg"
                    onClick={setApiKeyy}
                    disabled={loading || !apiKey.trim()}
                  >
                    {loading ? "Validating..." : "Set API Key"}
                  </motion.button>
                  {
                    apiKey && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                             disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                             text-white font-medium py-3 px-4 rounded-xl
                             transition-all duration-200 shadow-lg"
                        onClick={() => {
                          setApiKey("");
                          setApiKeySet(false);
                          localStorage.removeItem("api-key");
                        }}
                        disabled={loading}
                      >
                        {"Remove API Key"}
                      </motion.button>
                    )
                  }
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
        <AnimatePresence>

          {/* Main Chat Interface */}
          {apiKeySet && (
            <>
              {/* Welcome State - Centered Input */}

              {!hasEverHadResponse && (
                <motion.div
                  className="flex-1 flex flex-col items-center justify-center px-4"
                  layout
                  layoutId="input-box"
                  exit={{
                    opacity: 0,
                    transition: {
                      duration: 0.3,
                      ease: "easeInOut",
                    }
                  }}
                >
                  <motion.div
                    className="text-center mb-8"
                  >
                    <h1 className="text-5xl font-bold mb-4 text-white">
                      What are you working on?
                    </h1>
                    <p className="text-gray-400 text-lg">
                      Ask me anything and I'll help you out
                    </p>
                  </motion.div>

                  <motion.div
                    key="bottom-input"
                    className="w-full max-w-4xl"
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                  >
                    <motion.div
                      className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-600/50 shadow-2xl hover:ring-2 hover:ring-blue-500/50"
                      whileHover={{ scale: 1.01, }}
                      transition={{ duration: 0.2 }}
                    >
                      <textarea
                        className="w-full px-6 py-4 pr-16 text-white placeholder-gray-400
                               focus:outline-none rounded-2xl
                               resize-none min-h-[60px] max-h-32"
                        placeholder="Ask anything..."
                        autoFocus
                        value={inputData}
                        onChange={(e) => SetInputData(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (inputData.trim() && !loading) {
                              handleStreamChat();
                            }
                          }
                        }}
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 
                               hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700
                               text-white font-medium cursor-pointer
                               transition-all duration-200 disabled:cursor-not-allowed
                               flex justify-center items-center shadow-lg"
                        onClick={handleStreamChat}
                        disabled={loading || !inputData.trim()}
                      >
                        {loading ? (
                          <LoaderIcon className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
              {/* Response State - Input at bottom, response in main area */}

              {hasEverHadResponse && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col min-h-0 pt-6"
                  style={{ minHeight: 'calc(100vh - 80px)' }}
                >
                  {/* Response Section */}
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 px-4 py-6 overflow-hidden"
                    style={{ paddingBottom: '100px' }}
                  >
                    <div className="max-w-4xl mx-auto h-full">
                      <motion.div
                        className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 h-full flex flex-col"
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                      >
                        <motion.h2
                          className="text-lg font-semibold text-white mb-4 flex items-center gap-2"
                          initial={{ x: -20 }}
                          animate={{ x: 0 }}
                        >
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          AI Response
                        </motion.h2>
                        <div className="flex-1 bg-gray-900/50 rounded-xl p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                          {response ? (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.3 }}
                              className="prose prose-invert prose-blue max-w-none"
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  navigator.clipboard.writeText(response);
                                }}
                                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-gray-800 flex justify-center items-center hover:scale-105 active:scale-95">
                                <Copy className="w-4 h-4 text-gray-400" />
                              </button>
                              <Typewriter
                                speed="fast"
                                variance={0.1}
                                backspace="word"
                                showCursor={false}
                              >
                                <div>{response}</div>
                              </Typewriter>
                            </motion.div>
                          ) : (
                            <motion.p
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="text-gray-400 italic"
                            >
                              Generating response...
                            </motion.p>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Bottom Input */}
                  <motion.div
                    key="input-box"
                    layout
                    className="fixed bottom-6 left-0 right-0 px-4 z-20"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", damping: 20, stiffness: 100 }}
                  >
                    <div className="max-w-2xl mx-auto">
                      <motion.div
                        className="relative bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-600/50 shadow-2xl hover:ring-2 hover:ring-blue-500/50"
                        whileHover={{ scale: 1.01, borderColor: "rgb(59 130 246 / 0.5)", transition: { duration: 0.05 } }}
                        transition={{ duration: 0.2 }}
                      >
                        <textarea
                          className="w-full px-6 py-4 pr-16 bg-transparent text-white placeholder-gray-400
                                 focus:outline-none rounded-2xl
                                 resize-none min-h-[50px] max-h-32"
                          placeholder="Ask a follow-up question..."
                          value={inputData}
                          onChange={(e) => SetInputData(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              if (inputData.trim() && !loading) {
                                handleStreamChat();
                              }
                            }
                          }}
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 
                                 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700
                                 text-white font-medium cursor-pointer
                                 transition-all duration-200 disabled:cursor-not-allowed
                                 flex justify-center items-center shadow-lg"
                          onClick={handleStreamChat}
                          disabled={loading || !inputData.trim()}
                        >
                          {loading ? (
                            <LoaderIcon className="w-5 h-5 animate-spin" />
                          ) : (
                            <Send className="w-5 h-5" />
                          )}
                        </motion.button>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
