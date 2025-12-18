"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Mic, MicOff, Upload, FileText, Volume2, VolumeX, Sparkles, CheckCircle2, ArrowRight, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

interface VoiceAssistantClientProps {
  user: any
  profile: any
}

interface VoiceCommand {
  pattern: RegExp
  action: string
  description: string
}

const voiceCommands: VoiceCommand[] = [
  { pattern: /upload|file|document/i, action: "upload", description: "Upload a document" },
  { pattern: /file.*w-?2|w-?2.*form/i, action: "w2-filing", description: "Start W-2 filing" },
  { pattern: /file.*1099|1099.*form/i, action: "1099-filing", description: "Start 1099-NEC filing" },
  { pattern: /dashboard|home/i, action: "dashboard", description: "Go to dashboard" },
  { pattern: /status|progress/i, action: "status", description: "Check filing status" },
  { pattern: /help|assist/i, action: "help", description: "Get help" },
]

export function VoiceAssistantClient({ user, profile }: VoiceAssistantClientProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [recognizedCommand, setRecognizedCommand] = useState<string | null>(null)
  const [audioLevel, setAudioLevel] = useState(0)
  const [enableTextToSpeech, setEnableTextToSpeech] = useState(true)
  const [showCommandHistory, setShowCommandHistory] = useState(false)
  const [commandHistory, setCommandHistory] = useState<string[]>([])

  const recognitionRef = useRef<any>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)
  const router = useRouter()

  const { messages, input, setInput, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: {
      agent: "Sophie",
      model: "openai/gpt-4o",
      context: `Voice Assistant Mode: User can give voice commands for navigation and actions. ${user ? `User: ${profile?.full_name}` : "Demo mode"}`,
    },
  })

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === "undefined") return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.log("[v0] Speech recognition not supported")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onstart = () => {
      console.log("[v0] Voice assistant started listening")
      setIsListening(true)
      initializeAudioVisualization()
    }

    recognition.onresult = (event: any) => {
      const current = event.resultIndex
      const transcriptResult = event.results[current]
      const transcriptText = transcriptResult[0].transcript
      const confidenceScore = transcriptResult[0].confidence

      console.log("[v0] Transcript:", transcriptText, "Confidence:", confidenceScore)

      setTranscript(transcriptText)
      setConfidence(confidenceScore * 100)

      if (transcriptResult.isFinal) {
        processVoiceCommand(transcriptText)
      }
    }

    recognition.onerror = (event: any) => {
      console.error("[v0] Speech recognition error:", event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      console.log("[v0] Voice assistant stopped")
      setIsListening(false)
      stopAudioVisualization()
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      stopAudioVisualization()
    }
  }, [])

  // Audio Visualization
  const initializeAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      const microphone = audioContext.createMediaStreamSource(stream)

      analyser.fftSize = 256
      microphone.connect(analyser)

      audioContextRef.current = audioContext
      analyserRef.current = analyser

      updateAudioLevel()
    } catch (error) {
      console.error("[v0] Microphone access error:", error)
    }
  }

  const updateAudioLevel = () => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)

    const average = dataArray.reduce((a, b) => a + b) / dataArray.length
    setAudioLevel(average)

    animationFrameRef.current = requestAnimationFrame(updateAudioLevel)
  }

  const stopAudioVisualization = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }
  }

  // Voice Command Processing
  const processVoiceCommand = (text: string) => {
    console.log("[v0] Processing command:", text)

    for (const command of voiceCommands) {
      if (command.pattern.test(text)) {
        setRecognizedCommand(command.action)
        executeCommand(command.action, text)
        setCommandHistory((prev) => [...prev, `${command.description} - "${text}"`])
        return
      }
    }

    // If no command matched, treat as chat message
    setInput(text)
    setTranscript("")
  }

  const executeCommand = (action: string, originalText: string) => {
    console.log("[v0] Executing command:", action)

    switch (action) {
      case "upload":
        speak("Opening document upload. Please select your tax documents.")
        setTimeout(() => router.push("/dashboard/documents/upload"), 1000)
        break
      case "w2-filing":
        speak("Starting W-2 filing process. I'll guide you through each step.")
        setTimeout(() => router.push("/dashboard/file/w2"), 1000)
        break
      case "1099-filing":
        speak("Starting 1099-NEC filing for contractors. Let's get started.")
        setTimeout(() => router.push("/dashboard/file/1099-nec"), 1000)
        break
      case "dashboard":
        speak("Taking you to your dashboard.")
        setTimeout(() => router.push("/dashboard"), 1000)
        break
      case "status":
        speak("Let me check your filing status.")
        setInput("What's my current filing status?")
        break
      case "help":
        speak("I can help you file taxes, upload documents, check status, and answer questions. What do you need?")
        break
      default:
        setInput(originalText)
    }

    setTimeout(() => setRecognizedCommand(null), 3000)
  }

  // Text-to-Speech
  const speak = (text: string) => {
    if (!enableTextToSpeech) return

    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      synthRef.current = utterance
      window.speechSynthesis.speak(utterance)

      console.log("[v0] Speaking:", text)
    }
  }

  // Toggle Listening
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in your browser. Please use Chrome or Edge.")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      setTranscript("")
      setConfidence(0)
      recognitionRef.current.start()
    }
  }

  // Speak last assistant message
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === "assistant" && !isLoading) {
        speak(lastMessage.content)
      }
    }
  }, [messages, isLoading])

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50">
              <Mic className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                AI Voice Assistant
                <Sparkles className="h-6 w-6 text-yellow-400" />
              </h1>
              <p className="text-purple-200">Hands-free tax filing with voice commands</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEnableTextToSpeech(!enableTextToSpeech)}
              className="border-purple-500/50 bg-purple-900/30 text-white hover:bg-purple-800/50"
            >
              {enableTextToSpeech ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
              {enableTextToSpeech ? "Voice On" : "Voice Off"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCommandHistory(!showCommandHistory)}
              className="border-purple-500/50 bg-purple-900/30 text-white hover:bg-purple-800/50"
            >
              <FileText className="h-4 w-4 mr-2" />
              History
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Voice Interface */}
        <div className="lg:col-span-2 space-y-6">
          {/* Voice Control Card */}
          <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-xl border-purple-500/30 shadow-2xl shadow-purple-500/20">
            <div className="p-8">
              {/* Audio Waveform Visualization */}
              <div className="mb-8 relative">
                <div className="flex items-center justify-center gap-1 h-32">
                  {[...Array(50)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full transition-all duration-100"
                      style={{
                        height: isListening
                          ? `${Math.max(8, audioLevel * (0.5 + Math.sin(Date.now() / 100 + i) * 0.5))}px`
                          : "8px",
                        opacity: isListening ? 0.8 : 0.3,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Microphone Button */}
              <div className="flex flex-col items-center gap-6">
                <button
                  onClick={toggleListening}
                  className={`relative group transition-all duration-300 ${
                    isListening ? "scale-110" : "scale-100 hover:scale-105"
                  }`}
                >
                  <div
                    className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isListening
                        ? "bg-gradient-to-br from-red-500 to-pink-600 shadow-2xl shadow-red-500/50 animate-pulse"
                        : "bg-gradient-to-br from-purple-500 to-pink-500 shadow-xl shadow-purple-500/50"
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="h-16 w-16 text-white" />
                    ) : (
                      <Mic className="h-16 w-16 text-white" />
                    )}
                  </div>
                  {isListening && (
                    <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping" />
                  )}
                </button>

                <div className="text-center">
                  <p className="text-2xl font-bold text-white mb-2">{isListening ? "Listening..." : "Tap to Speak"}</p>
                  <p className="text-purple-200 text-sm">
                    {isListening ? "Say a command or ask a question" : 'Try saying "Upload W-2" or "Check my status"'}
                  </p>
                </div>

                {/* Transcript Display */}
                {transcript && (
                  <div className="w-full">
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4">
                      <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <p className="text-white font-medium mb-1">You said:</p>
                          <p className="text-purple-100 text-lg">{transcript}</p>
                          {confidence > 0 && (
                            <div className="mt-2">
                              <div className="flex items-center justify-between text-xs text-purple-200 mb-1">
                                <span>Confidence</span>
                                <span>{confidence.toFixed(0)}%</span>
                              </div>
                              <Progress value={confidence} className="h-1" />
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Recognized Command */}
                {recognizedCommand && (
                  <div className="w-full">
                    <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border-green-500/30 p-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-6 w-6 text-green-400" />
                        <div>
                          <p className="text-white font-semibold">Command Recognized</p>
                          <p className="text-green-100 text-sm">Executing: {recognizedCommand}</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Speaking Indicator */}
                {isSpeaking && (
                  <Badge className="bg-blue-500 text-white">
                    <Volume2 className="h-3 w-3 mr-1 animate-pulse" />
                    Speaking...
                  </Badge>
                )}
              </div>
            </div>
          </Card>

          {/* Chat Messages */}
          {messages.length > 1 && (
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <div className="p-6 max-h-96 overflow-y-auto space-y-4">
                {messages.slice(1).map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                          : "bg-white/20 text-white border border-white/30"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Available Commands */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <div className="p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                Voice Commands
              </h3>
              <div className="space-y-3">
                {voiceCommands.map((cmd, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm">
                    <ArrowRight className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-medium">{cmd.description}</p>
                      <p className="text-purple-200 text-xs">"{cmd.pattern.source.replace(/\\/g, "")}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <div className="p-6">
              <h3 className="text-white font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  onClick={() => router.push("/dashboard/file/w2")}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  File W-2
                </Button>
                <Button
                  onClick={() => router.push("/dashboard/file/1099-nec")}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  File 1099-NEC
                </Button>
                <Button
                  onClick={() => router.push("/dashboard/documents/upload")}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </div>
          </Card>

          {/* Command History */}
          {showCommandHistory && commandHistory.length > 0 && (
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <div className="p-6">
                <h3 className="text-white font-bold mb-4">Recent Commands</h3>
                <div className="space-y-2">
                  {commandHistory
                    .slice(-5)
                    .reverse()
                    .map((cmd, idx) => (
                      <div key={idx} className="text-xs text-purple-200 flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{cmd}</span>
                      </div>
                    ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
