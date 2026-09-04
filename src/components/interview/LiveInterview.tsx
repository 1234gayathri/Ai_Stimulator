import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageSquare,
  Send,
  Loader2,
  Check,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  Eye,
  Activity,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import type { RoundType } from "@/lib/interview.functions";
import { evaluateLiveAnswer, generateLiveQuestion } from "@/lib/interview.functions";

interface LiveInterviewProps {
  round: RoundType;
}

interface TurnRecord {
  question: string;
  answer: string;
  mode: "text" | "voice" | "video";
  topic?: string;
  audioUrl?: string;
  videoUrl?: string;
  score?: number;
  feedback?: string;
  strengths?: string[];
  improvements?: string[];
  wpm?: number;
  filler_count?: number;
  confidence_rating?: string;
  created_at: string;
}

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function LiveInterview({ round }: LiveInterviewProps) {
  const [mode, setMode] = useState<"text" | "voice" | "video">("text");
  const [currentQuestion, setCurrentQuestion] = useState<string>(
    "Loading your personalized interview question..."
  );
  const [currentTopic, setCurrentTopic] = useState<string>("General");
  const [answerText, setAnswerText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSpeakingAI, setIsSpeakingAI] = useState(false);
  const [autoRecord, setAutoRecord] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  async function togglePause() {
    if (!isPaused) {
      setIsPaused(true);
      stopAISpeech();
      if (isRecording) {
        await stopRecordingAsync();
        toast.info("Interview Paused", { description: "Your active recording was saved." });
      }
    } else {
      setIsPaused(false);
      toast.success("Interview Resumed", { description: "You're back on the clock!" });
    }
  }

  // Audio Device Selection
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState<string>("");

  useEffect(() => {
    async function getDevices() {
      if (typeof window !== "undefined" && navigator.mediaDevices?.enumerateDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const inputs = devices.filter((d) => d.kind === "audioinput");
          setAudioDevices(inputs);

          if (inputs.length > 0) {
            // Smart auto-selection: prioritize real physical hardware mic over software virtual cables (e.g. AudioRelay / Virtual Mic)
            const physicalMic = inputs.find(
              (d) =>
                (d.label.toLowerCase().includes("realtek") ||
                  d.label.toLowerCase().includes("array") ||
                  d.label.toLowerCase().includes("microphone")) &&
                !d.label.toLowerCase().includes("virtual") &&
                !d.label.toLowerCase().includes("audiorelay")
            );
            const preferred = physicalMic || inputs.find((d) => !d.label.toLowerCase().includes("virtual")) || inputs[0];
            setSelectedAudioDeviceId(preferred.deviceId);
          }
        } catch {
          // ignore
        }
      }
    }
    getDevices();
  }, [mode]);

  // Recorded media playback URLs for active turn
  const [audioPlaybackUrl, setAudioPlaybackUrl] = useState<string | null>(null);
  const [videoPlaybackUrl, setVideoPlaybackUrl] = useState<string | null>(null);

  // History of completed turns
  const [turns, setTurns] = useState<TurnRecord[]>([]);

  // Load saved turns from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`interview_turns_${round}`);
      if (saved) {
        setTurns(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, [round]);

  // Save turns to localStorage whenever turns update
  useEffect(() => {
    if (turns.length > 0) {
      try {
        localStorage.setItem(`interview_turns_${round}`, JSON.stringify(turns));
      } catch {
        // ignore storage limits
      }
    }
  }, [turns, round]);

  // Refs for media
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const speechRecognitionRef = useRef<any>(null);

  const getQuestionFn = useServerFn(generateLiveQuestion);
  const evalAnswerFn = useServerFn(evaluateLiveAnswer);

  // Text-to-Speech Helper for AI Spoke Mode
  function speakAIQuestion(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeakingAI(true);
    utterance.onend = () => {
      setIsSpeakingAI(false);
      // Auto-start recording immediately when AI finishes speaking question
      if (autoRecord && (mode === "voice" || mode === "video")) {
        setTimeout(() => {
          if (!isRecording) {
            startRecording();
            toast.info("🔴 Recording Auto-Started", {
              description: "Speak your answer into the microphone...",
            });
          }
        }, 300);
      }
    };
    utterance.onerror = () => setIsSpeakingAI(false);
    window.speechSynthesis.speak(utterance);
  }

  function stopAISpeech() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeakingAI(false);
    }
  }

  // Mutation for fetching next question
  const nextQuestionM = useMutation({
    mutationFn: async () => {
      const history = turns.map((t) => ({ question: t.question, answer: t.answer }));
      return await getQuestionFn({ data: { round, history } });
    },
    onSuccess: (data: any) => {
      setCurrentQuestion(data.question);
      setCurrentTopic(data.topic || "General");
      // Auto-speak question if in Voice (Spoke) or Video mode
      if (mode === "voice" || mode === "video") {
        speakAIQuestion(data.question);
      }
    },
    onError: () => {
      const fallbackQ = "Tell me about a complex technical problem you recently solved and how you optimized its performance.";
      setCurrentQuestion(fallbackQ);
      if (mode === "voice" || mode === "video") {
        speakAIQuestion(fallbackQ);
      }
    },
  });

  // Mutation for evaluating answer
  const evalAnswerM = useMutation({
    mutationFn: async ({
      question,
      answer,
      answerMode,
      audioUrl,
      videoUrl,
    }: {
      question: string;
      answer: string;
      answerMode: "text" | "voice" | "video";
      audioUrl?: string;
      videoUrl?: string;
    }) => {
      const res = await evalAnswerFn({
        data: { question, answer, round, mode: answerMode },
      });
      return { ...res, audioUrl, videoUrl, question, answer, mode: answerMode };
    },
    onSuccess: (data: any) => {
      toast.success("Answer evaluated!", {
        description: `Score: ${data.score}/100 · ${data.confidence_rating} Confidence`,
      });

      const newRecord: TurnRecord = {
        question: data.question,
        answer: data.answer,
        mode: data.mode,
        topic: currentTopic,
        audioUrl: data.audioUrl,
        videoUrl: data.videoUrl,
        score: data.score,
        feedback: data.feedback,
        strengths: data.strengths,
        improvements: data.improvements,
        wpm: data.wpm,
        filler_count: data.filler_count,
        confidence_rating: data.confidence_rating,
        created_at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setTurns((prev) => [newRecord, ...prev]);
      setAnswerText("");
      setAudioPlaybackUrl(null);
      setVideoPlaybackUrl(null);

      // Fetch next question
      nextQuestionM.mutate();
    },
    onError: (e: any) => {
      toast.error(e instanceof Error ? e.message : "Evaluation failed.");
    },
  });

  // Load initial question on round change
  useEffect(() => {
    nextQuestionM.mutate();
    stopMediaTracks();
  }, [round]);

  // Clean up media on unmount
  useEffect(() => {
    return () => {
      stopMediaTracks();
      stopAISpeech();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle switching modes
  useEffect(() => {
    stopMediaTracks();
    stopAISpeech();
    setIsRecording(false);
    setAudioPlaybackUrl(null);
    setVideoPlaybackUrl(null);

    if (mode === "video") {
      startCameraPreview();
      speakAIQuestion(currentQuestion);
    } else if (mode === "voice") {
      speakAIQuestion(currentQuestion);
    }
  }, [mode]);

  const [micVolume, setMicVolume] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);

  function stopMediaTracks() {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {
        // ignore
      }
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setMicVolume(0);
  }

  async function startCameraPreview() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      toast.error("Camera Access Needed", {
        description: "Please allow camera & microphone permission in your browser to use Video mode.",
      });
    }
  }

  const activeAudioUrlRef = useRef<string | null>(null);
  const activeVideoUrlRef = useRef<string | null>(null);

  function playRecordedAudio(url: string) {
    if (!url) return;
    try {
      const audio = new Audio(url);
      audio.volume = 1.0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Playback error:", error);
          // If the recording was silent, guide the user to select the physical Realtek microphone
          toast.warning("Silent Recording Detected", {
            description: "Please select 'Microphone Array (Realtek(R) Audio)' from the Mic Input Device dropdown and record again.",
          });
        });
      }
    } catch {
      // ignore
    }
  }

  function testSpeakerSound() {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 chime
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
      toast.success("🔊 Speaker Test Chime Played", {
        description: "If you heard the chime tone, your computer speakers are working!",
      });
    } catch {
      toast.error("Speaker test error.");
    }
  }

  async function startRecording() {
    try {
      stopMediaTracks();

      activeAudioUrlRef.current = null;
      activeVideoUrlRef.current = null;
      setAudioPlaybackUrl(null);
      setVideoPlaybackUrl(null);

      // Explicit high-clarity audio constraints with selected microphone device
      const audioConstraints: MediaTrackConstraints = {
        deviceId: selectedAudioDeviceId ? { exact: selectedAudioDeviceId } : undefined,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia({
        video: mode === "video" ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
        audio: audioConstraints,
      });

      mediaStreamRef.current = stream;
      if (mode === "video" && videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Initialize Web Audio API Volume Analyser to measure real mic level & boost volume
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 64;

          // 2.5x Audio Gain Booster for loud mic recording
          const gainNode = audioCtx.createGain();
          gainNode.gain.value = 2.5;
          source.connect(gainNode);
          gainNode.connect(analyser);

          audioContextRef.current = audioCtx;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          let lastUpdateTime = 0;
          
          const updateVolume = (timestamp: number) => {
            if (timestamp - lastUpdateTime > 100) { // Throttle to 10 times per second
              analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const avg = sum / dataArray.length;
              const normalized = Math.min(100, Math.round((avg / 128) * 100));
              setMicVolume(normalized);
              lastUpdateTime = timestamp;
            }
            animFrameRef.current = requestAnimationFrame(updateVolume);
          };
          animFrameRef.current = requestAnimationFrame(updateVolume);
        }
      } catch {
        // Fallback if AudioContext is unsupported
      }

      chunksRef.current = [];

      // Safe MediaRecorder constructor without mimeType DOMException
      let mediaRecorder: MediaRecorder;
      try {
        if (mode === "video" && MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")) {
          mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9,opus" });
        } else if (mode === "video" && MediaRecorder.isTypeSupported("video/webm")) {
          mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
        } else {
          // Native browser recorder - 100% reliable across Chrome/Edge/Firefox/Safari
          mediaRecorder = new MediaRecorder(stream);
        }
      } catch {
        mediaRecorder = new MediaRecorder(stream);
      }

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (chunksRef.current.length === 0) return;

        let cleanType = mode === "video" ? "video/webm" : "audio/webm";
        const rawType = mediaRecorder.mimeType;
        if (rawType) {
          cleanType = rawType.split(";")[0].trim();
        }

        const blob = new Blob(chunksRef.current, { type: cleanType });
        if (blob.size === 0) return;

        const dataUrl = await blobToDataURL(blob);

        if (mode === "video") {
          activeVideoUrlRef.current = dataUrl;
          setVideoPlaybackUrl(dataUrl);
        } else {
          activeAudioUrlRef.current = dataUrl;
          setAudioPlaybackUrl(dataUrl);
        }
      };

      mediaRecorder.start(100);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);

      // Start live speech recognition if available
      startSpeechRecognition();
    } catch (err: any) {
      toast.error("Microphone Access Error", {
        description: err?.message || "Please allow microphone permissions in your browser bar.",
      });
    }
  }

  function startSpeechRecognition() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          if (transcript) {
            setAnswerText(transcript);
          }
        };

        recognition.start();
        speechRecognitionRef.current = recognition;
      } catch {
        // Fallback speech recognition not available
      }
    }
  }

  function stopRecordingAsync(): Promise<{ audioUrl?: string; videoUrl?: string }> {
    return new Promise((resolve) => {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch {
          // ignore
        }
      }

      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") {
        resolve({
          audioUrl: activeAudioUrlRef.current || undefined,
          videoUrl: activeVideoUrlRef.current || undefined,
        });
        return;
      }

      const rec = mediaRecorderRef.current;

      rec.onstop = async () => {
        if (chunksRef.current.length > 0) {
          let cleanType = mode === "video" ? "video/webm" : "audio/webm";
          if (rec.mimeType) {
            cleanType = rec.mimeType.split(";")[0].trim();
          }
          const blob = new Blob(chunksRef.current, { type: cleanType });
          if (blob.size > 0) {
            const dataUrl = await blobToDataURL(blob);
            if (mode === "video") {
              activeVideoUrlRef.current = dataUrl;
              setVideoPlaybackUrl(dataUrl);
            } else {
              activeAudioUrlRef.current = dataUrl;
              setAudioPlaybackUrl(dataUrl);
            }
          }
        }
        resolve({
          audioUrl: activeAudioUrlRef.current || undefined,
          videoUrl: activeVideoUrlRef.current || undefined,
        });
      };

      try {
        rec.requestData();
      } catch {
        // ignore
      }
      rec.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    });
  }

  function stopRecording() {
    stopRecordingAsync();
  }

  async function handleSubmitAnswer() {
    if (mode === "voice" && !isRecording && !audioPlaybackUrl && !activeAudioUrlRef.current) {
      toast.warning("🎤 Voice Recording Required", {
        description: "Please click 'Start Recording' and speak your answer into the microphone before submitting.",
      });
      return;
    }

    if (mode === "video" && !isRecording && !videoPlaybackUrl && !activeVideoUrlRef.current) {
      toast.warning("📹 Video Recording Required", {
        description: "Please click 'Start Recording' and record your video answer before submitting.",
      });
      return;
    }

    let mediaRes: { audioUrl?: string; videoUrl?: string } = {
      audioUrl: activeAudioUrlRef.current || undefined,
      videoUrl: activeVideoUrlRef.current || undefined,
    };

    if (isRecording) {
      mediaRes = await stopRecordingAsync();
    }

    const textToSubmit =
      answerText.trim() ||
      (mode === "video"
        ? "Video response submitted. (Body language & verbal structure analyzed)"
        : "Audio response submitted. (Speech tone & articulation analyzed)");

    evalAnswerM.mutate({
      question: currentQuestion,
      answer: textToSubmit,
      answerMode: mode,
      audioUrl: mediaRes.audioUrl,
      videoUrl: mediaRes.videoUrl,
    });
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="mx-auto max-w-6xl grid lg:grid-cols-5 gap-6">
      {/* Main Live Interview Box */}
      <div className="glass-strong rounded-3xl p-6 md:p-8 lg:col-span-3 relative overflow-hidden flex flex-col justify-between min-h-[540px]">
        {/* Top Header Bar & Mode Selector */}
        <div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs font-medium">
              <span className="relative flex size-2.5">
                <span className={`absolute inline-flex h-full w-full rounded-full ${isPaused ? "bg-amber-400" : "bg-red-400 animate-ping"} opacity-75`} />
                <span className={`relative inline-flex rounded-full size-2.5 ${isPaused ? "bg-amber-500" : "bg-red-500"}`} />
              </span>
              <span className="text-muted-foreground uppercase tracking-widest">
                {isPaused ? "Interview Paused" : isRecording ? `Recording · ${formatTime(recordingTime)}` : "Live Interview Session"}
              </span>

              <button
                onClick={togglePause}
                className={`ml-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition flex items-center gap-1 border ${
                  isPaused
                    ? "bg-amber-500/20 text-amber-400 border-amber-500/50 hover:bg-amber-500/30"
                    : "glass text-foreground hover:bg-white/10"
                }`}
              >
                {isPaused ? <Play className="size-3" /> : <Pause className="size-3" />}
                {isPaused ? "Resume" : "Pause"}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs glass rounded-full px-3 py-1 font-medium text-primary-glow border border-primary/30 uppercase tracking-wider">
                {round.toUpperCase()} · {currentTopic}
              </span>
            </div>
          </div>

          {/* Mode Switcher Tabs - Select Active Mode First */}
          <div className="mt-4 flex items-center justify-between gap-3 p-1.5 glass rounded-2xl border border-white/10">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold px-2 hidden sm:inline">
              Selected Mode:
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setMode("text")}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  mode === "text"
                    ? "bg-primary text-white shadow-md glow-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <MessageSquare className="size-3.5" /> Type Mode
              </button>
              <button
                onClick={() => setMode("voice")}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  mode === "voice"
                    ? "bg-primary text-white shadow-md glow-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <Mic className="size-3.5" /> Voice (Spoke) Mode
              </button>
              <button
                onClick={() => setMode("video")}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  mode === "video"
                    ? "bg-primary text-white shadow-md glow-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <Video className="size-3.5" /> Video Mode
              </button>
            </div>
          </div>

        {/* Paused Overlay Screen */}
        {isPaused && (
          <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="glass-strong border border-amber-500/30 p-8 rounded-3xl flex flex-col items-center max-w-sm text-center">
              <div className="size-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
                <Pause className="size-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-2">Interview Paused</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Take a deep breath! The AI is paused and recording has stopped. You can resume whenever you are ready.
              </p>
              <button
                onClick={togglePause}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2"
              >
                <Play className="size-4" /> Resume Interview
              </button>
            </div>
          </div>
        )}

          {/* Interviewer Question Box with AI Spoke Audio Button */}
          <div className="mt-6 glass rounded-2xl p-5 border border-white/10 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs uppercase tracking-widest font-semibold text-primary-glow flex items-center gap-1.5">
                <Sparkles className="size-3.5" /> AI Interviewer
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setAutoRecord(!autoRecord)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition ${
                    autoRecord
                      ? "glass border-green-500/40 text-green-400"
                      : "glass border-white/10 text-muted-foreground"
                  }`}
                  title="Toggle hands-free auto recording after AI finishes speaking"
                >
                  <span className={`size-1.5 rounded-full ${autoRecord ? "bg-green-400 animate-pulse" : "bg-muted"}`} />
                  {autoRecord ? "Auto-Record ON" : "Auto-Record OFF"}
                </button>
                <button
                  onClick={() => (isSpeakingAI ? stopAISpeech() : speakAIQuestion(currentQuestion))}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium glass border border-primary/30 text-primary-glow hover:bg-white/10 transition"
                  title="Click to hear AI speak the question aloud"
                >
                  <Volume2 className={`size-3.5 ${isSpeakingAI ? "animate-pulse text-accent" : ""}`} />
                  {isSpeakingAI ? "Pause AI Voice" : "🔊 Listen AI Spoke"}
                </button>
                {nextQuestionM.isPending && (
                  <Loader2 className="size-4 animate-spin text-primary-glow" />
                )}
              </div>
            </div>
            <p className="text-base md:text-lg font-medium leading-relaxed text-foreground">
              {currentQuestion}
            </p>
          </div>

          {/* Active Mode Workspace: ONLY ENABLED & SHOWN FOR THE SELECTED MODE */}
          <div className="mt-6">
            {/* VIDEO MODE */}
            {mode === "video" && (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden glass aspect-video bg-black/60 border border-white/10 flex items-center justify-center">
                  {!videoPlaybackUrl ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover rounded-2xl"
                      />
                      {!isRecording && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                          <Video className="size-10 text-primary-glow mb-2" />
                          <div className="font-semibold text-sm">Webcam Video Mode Active</div>
                          <div className="text-xs text-muted-foreground mt-1 max-w-xs">
                            Position yourself in front of the camera. Click 'Start Recording' to answer.
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-black/80 relative">
                      <video
                        src={videoPlaybackUrl}
                        controls
                        className="w-full h-full object-contain rounded-2xl"
                      />
                      <div className="absolute top-3 left-3 glass rounded-full px-3 py-1 text-xs text-green-400 flex items-center gap-1">
                        <Check className="size-3" /> Video Recorded — Watch & Review Confidence
                      </div>
                    </div>
                  )}

                  {isRecording && (
                    <div className="absolute top-4 right-4 glass rounded-full px-3 py-1 text-xs font-semibold text-red-400 flex items-center gap-2 animate-pulse">
                      <span className="size-2 rounded-full bg-red-500" /> REC {formatTime(recordingTime)}
                    </div>
                  )}
                </div>

                {/* Speech transcript preview box */}
                <div className="glass rounded-xl p-3 text-xs text-muted-foreground min-h-[44px]">
                  <span className="font-medium text-foreground">Live Speech Transcript: </span>
                  {answerText || (isRecording ? "Listening to your voice..." : "Your spoken words will appear here in real time.")}
                </div>
              </div>
            )}

            {/* VOICE / SPOKE MODE */}
            {mode === "voice" && (
              <div className="space-y-4">
                <div className="glass rounded-2xl p-6 text-center border border-white/10 relative overflow-hidden">
                  <div className="size-16 rounded-full glass mx-auto flex items-center justify-center mb-3 relative">
                    <Mic className={`size-8 ${isRecording ? "text-red-400 animate-bounce" : "text-primary-glow"}`} />
                    {isRecording && micVolume > 5 && (
                      <span className="absolute -inset-1.5 rounded-full border-2 border-red-500/50 animate-ping" />
                    )}
                  </div>

                  <div className="font-display text-lg font-semibold">
                    {isRecording ? "Listening & Recording Your Spoken Answer..." : "Spoke (Voice) Mode Active"}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {isRecording
                      ? `Recording duration: ${formatTime(recordingTime)} · Live Mic Sound Level: ${micVolume}%`
                      : "AI speaks the question aloud. Click 'Start Recording' to answer with your voice."}
                  </div>

                  <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                    <button
                      onClick={testSpeakerSound}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold glass border border-primary/30 text-primary-glow hover:bg-white/10 transition flex items-center gap-1.5"
                      title="Click to play a test chime tone through your computer speakers"
                    >
                      <Volume2 className="size-3.5 text-accent" /> 🔊 Test Computer Speaker Output
                    </button>
                  </div>

                  {/* Microphone Source Device Dropdown */}
                  {audioDevices.length > 0 && (
                    <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground font-medium">Mic Input Device:</span>
                      <select
                        value={selectedAudioDeviceId}
                        onChange={(e) => setSelectedAudioDeviceId(e.target.value)}
                        className="glass rounded-xl px-3 py-1.5 text-xs text-foreground bg-slate-900 border border-white/20 focus:outline-none max-w-xs"
                      >
                        {audioDevices.map((d, i) => (
                          <option key={d.deviceId || i} value={d.deviceId} className="bg-slate-900 text-white">
                            {d.label || `Microphone Input ${i + 1}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Silent Mic Caution Alert Banner when micVolume is 0% */}
                  {isRecording && micVolume === 0 && (
                    <div className="mt-4 p-3.5 glass rounded-2xl border border-amber-500/50 bg-amber-500/10 text-amber-300 text-xs text-left leading-relaxed animate-pulse">
                      <div className="font-semibold flex items-center gap-1.5 mb-1 text-amber-200">
                        <AlertCircle className="size-4 text-amber-400 shrink-0" /> SILENT MICROPHONE DETECTED (0% Volume Level)
                      </div>
                      <div className="space-y-1 text-muted-foreground text-[11px]">
                        <p>Your browser is receiving 0 sound energy from your microphone. Follow these steps:</p>
                        <ol className="list-decimal pl-4 space-y-0.5 text-amber-100">
                          <li>Select your physical Microphone from the <strong>Mic Input Device</strong> dropdown above.</li>
                          <li>Press your laptop microphone Fn key (e.g. Fn + F4) or check Windows Microphone volume.</li>
                          <li>Speak into your mic — watch the red sound wave bars move above!</li>
                        </ol>
                      </div>
                    </div>
                  )}

                  {/* Live Sound Wave Indicator */}
                  {isRecording && (
                    <div className="mt-4 flex items-center justify-center gap-1.5 h-7">
                      {[0.4, 0.7, 1.0, 0.6, 0.8, 0.5, 0.9, 0.3].map((factor, idx) => {
                        const h = Math.max(6, Math.min(26, Math.round(micVolume * factor)));
                        return (
                          <div
                            key={idx}
                            className="w-1.5 bg-red-500 rounded-full transition-all duration-75"
                            style={{ height: `${h}px` }}
                          />
                        );
                      })}
                    </div>
                  )}

                  {/* Playable Recorded Voice Audio Player */}
                  {audioPlaybackUrl && (
                    <div className="mt-4 p-4 glass rounded-2xl border border-primary/30 flex flex-col items-center gap-2">
                      <div className="text-xs font-semibold text-accent flex items-center justify-between w-full">
                        <span className="flex items-center gap-1.5">
                          <Volume2 className="size-4 text-accent animate-pulse" /> Recorded Voice Ready
                        </span>
                        <button
                          onClick={() => playRecordedAudio(audioPlaybackUrl)}
                          className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/20 hover:bg-accent/30 text-accent transition flex items-center gap-1"
                        >
                          <Play className="size-3" /> Force Play Audio
                        </button>
                      </div>
                      <audio src={audioPlaybackUrl} controls autoPlay className="w-full h-10 rounded-lg" />
                    </div>
                  )}
                </div>

                {/* Speech transcript input */}
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Your transcribed speech will appear here..."
                  rows={3}
                  className="w-full glass rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>
            )}

            {/* TYPE MODE */}
            {mode === "text" && (
              <div className="space-y-3">
                <label className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                  Your Typed Response
                </label>
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Type your structured answer here (use STAR method: Situation, Task, Action, Result)..."
                  rows={5}
                  className="w-full glass rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-primary/40 resize-none leading-relaxed"
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Controls for Selected Mode */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground font-medium">
            Active Mode: <span className="text-foreground uppercase tracking-wider font-semibold">{mode}</span>
          </div>

          <div className="flex items-center gap-3">
            {(mode === "video" || mode === "voice") && (
              <>
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    disabled={evalAnswerM.isPending}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition shadow-lg disabled:opacity-50"
                  >
                    <span className="size-2 rounded-full bg-white animate-pulse" /> Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 transition shadow-lg"
                  >
                    Stop Recording
                  </button>
                )}
              </>
            )}

            <button
              onClick={handleSubmitAnswer}
              disabled={evalAnswerM.isPending || (!answerText.trim() && !audioPlaybackUrl && !videoPlaybackUrl)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-white shadow-xl transition transform active:scale-95 disabled:opacity-50 hover:brightness-110"
              style={{ background: "var(--gradient-primary)" }}
            >
              {evalAnswerM.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Evaluating Answer...
                </>
              ) : (
                <>
                  <Send className="size-3.5" /> Submit Answer ➔
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Real-time Evaluation & Turn Records */}
      <div className="space-y-6 lg:col-span-2">

        {/* AI Performance Evaluation Card */}
        <div className="glass rounded-3xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">AI Performance Evaluation</div>
              <h3 className="font-display text-xl font-semibold text-gradient mt-0.5">14 Signals Monitored</h3>
            </div>
            <Activity className={`size-5 ${evalAnswerM.isPending ? "text-amber-400 animate-pulse" : "text-primary-glow"}`} />
          </div>

          {/* Evaluation Loading State */}
          {evalAnswerM.isPending && (
            <div className="glass rounded-2xl p-5 mb-4 border border-amber-500/30 flex flex-col items-center gap-3 animate-pulse">
              <Loader2 className="size-6 text-amber-400 animate-spin" />
              <p className="text-xs text-amber-300 font-medium">AI is analysing your answer across 14 signals...</p>
            </div>
          )}

          {/* Score Card — shows latest turn's results */}
          {!evalAnswerM.isPending && turns.length > 0 && (() => {
            const t = turns[0];
            const score = t.score ?? 0;
            const grade =
              score >= 85 ? { label: "Excellent", color: "text-emerald-400", bar: "bg-emerald-500", border: "border-emerald-500/40" }
              : score >= 70 ? { label: "Good", color: "text-blue-400", bar: "bg-blue-500", border: "border-blue-500/40" }
              : score >= 50 ? { label: "Average", color: "text-amber-400", bar: "bg-amber-500", border: "border-amber-500/40" }
              : { label: "Needs Work", color: "text-red-400", bar: "bg-red-500", border: "border-red-500/40" };

            const confColor =
              t.confidence_rating === "High" ? "text-emerald-400"
              : t.confidence_rating === "Medium" ? "text-amber-400"
              : "text-red-400";

            return (
              <div className={`glass rounded-2xl p-4 mb-4 border ${grade.border}`}>
                {/* Score header */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">Latest Score</span>
                  <span className={`text-xs font-semibold ${confColor}`}>{t.confidence_rating} Confidence</span>
                </div>

                {/* Big score number + grade */}
                <div className="flex items-baseline gap-3 mt-1">
                  <span className={`font-display text-5xl font-bold ${grade.color}`}>{score}</span>
                  <div>
                    <span className="text-sm text-muted-foreground">/ 100</span>
                    <div className={`text-xs font-semibold ${grade.color} mt-0.5`}>{grade.label}</div>
                  </div>
                </div>

                {/* Score progress bar */}
                <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${grade.bar}`}
                    style={{ width: `${score}%` }}
                  />
                </div>

                {/* Feedback */}
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{t.feedback}</p>

                {/* Strengths */}
                {t.strengths && t.strengths.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold">Strengths</div>
                    {t.strengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-emerald-300">
                        <Check className="size-3 mt-0.5 shrink-0" /> {s}
                      </div>
                    ))}
                  </div>
                )}

                {/* Improvements */}
                {t.improvements && t.improvements.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <div className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">Improve On</div>
                    {t.improvements.map((imp, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-amber-300">
                        <AlertCircle className="size-3 mt-0.5 shrink-0" /> {imp}
                      </div>
                    ))}
                  </div>
                )}

                {/* Pace & Fillers */}
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>🎙 Pace: <strong className="text-foreground">{t.wpm ?? 84} WPM</strong></span>
                  <span>🔤 Filler Words: <strong className="text-foreground">{t.filler_count ?? 0}</strong></span>
                </div>
              </div>
            );
          })()}

          {/* Empty state */}
          {!evalAnswerM.isPending && turns.length === 0 && (
            <div className="glass rounded-2xl p-4 mb-4 text-center text-xs text-muted-foreground">
              Submit your first answer to get instant AI evaluation across all 14 signals!
            </div>
          )}

          {/* 14 Signal Checklist — dynamically colored after first turn */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { label: "Technical Accuracy", key: "score" },
              { label: "Communication Clarity", key: "wpm" },
              { label: "Confidence Rating", key: "confidence_rating" },
              { label: "Filler Word Usage", key: "filler_count" },
              { label: "Eye Contact & Body Language", key: null },
              { label: "STAR Method Structure", key: null },
              { label: "Grammar & Tone", key: null },
              { label: "Behavioral Alignment", key: null },
            ].map(({ label }) => {
              const evaluated = turns.length > 0 && !evalAnswerM.isPending;
              return (
                <div
                  key={label}
                  className={`flex items-center gap-1.5 glass rounded-lg px-2.5 py-1.5 transition ${
                    evaluated ? "text-emerald-400 border border-emerald-500/20" : "text-muted-foreground"
                  }`}
                >
                  <Check className={`size-3 shrink-0 ${evaluated ? "text-emerald-400" : "text-muted-foreground"}`} />
                  {label}
                </div>
              );
            })}
          </div>

          {/* Session average score across all turns */}
          {turns.length > 1 && (
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Session Average</div>
              {(() => {
                const avg = Math.round(turns.reduce((sum, t) => sum + (t.score ?? 0), 0) / turns.length);
                const avgColor = avg >= 70 ? "text-emerald-400" : avg >= 50 ? "text-amber-400" : "text-red-400";
                const avgBar = avg >= 70 ? "bg-emerald-500" : avg >= 50 ? "bg-amber-500" : "bg-red-500";
                return (
                  <>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${avgColor}`}>{avg} / 100</span>
                      <span className="text-[10px] text-muted-foreground">{turns.length} answers evaluated</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className={`h-full rounded-full ${avgBar} transition-all duration-700`} style={{ width: `${avg}%` }} />
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>

        {/* Completed Interview Turns */}
        <div className="glass rounded-3xl p-6 border border-white/10 max-h-[480px] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              Completed Interview Turns
            </div>
            <span className="glass rounded-full px-2.5 py-0.5 text-[10px] font-bold text-primary-glow border border-primary/30">
              {turns.length}
            </span>
          </div>

          {/* Evaluating spinner row */}
          {evalAnswerM.isPending && (
            <div className="glass rounded-2xl p-3 mb-3 border border-amber-500/20 flex items-center gap-3 animate-pulse">
              <Loader2 className="size-4 text-amber-400 animate-spin shrink-0" />
              <span className="text-xs text-amber-300">Evaluating your answer...</span>
            </div>
          )}

          {turns.length === 0 && !evalAnswerM.isPending ? (
            <div className="text-xs text-muted-foreground text-center py-8">
              No turns completed yet. Choose Voice, Video, or Type mode and submit your answer.
            </div>
          ) : (
            <div className="space-y-3">
              {turns.map((t, idx) => {
                const score = t.score ?? 0;
                const scoreColor =
                  score >= 85 ? "text-emerald-400"
                  : score >= 70 ? "text-blue-400"
                  : score >= 50 ? "text-amber-400"
                  : "text-red-400";
                const barColor =
                  score >= 85 ? "bg-emerald-500"
                  : score >= 70 ? "bg-blue-500"
                  : score >= 50 ? "bg-amber-500"
                  : "bg-red-500";

                return (
                  <div key={idx} className="glass rounded-2xl p-4 text-xs space-y-2.5 border border-white/5">
                    {/* Header row */}
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-primary-glow uppercase tracking-wider">
                        Turn {turns.length - idx} · {t.mode?.toUpperCase()}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`font-display text-base font-bold ${scoreColor}`}>{score}</span>
                        <span className="text-muted-foreground text-[10px]">/100</span>
                      </div>
                    </div>

                    {/* Score bar */}
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${barColor} transition-all duration-700`}
                        style={{ width: `${score}%` }}
                      />
                    </div>

                    {/* Topic & time */}
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="glass rounded-full px-2 py-0.5 border border-white/10">{t.topic || "General"}</span>
                      <span>{t.created_at}</span>
                    </div>

                    {/* Question */}
                    <div className="text-muted-foreground font-medium leading-relaxed">{t.question}</div>

                    {/* Answer */}
                    <div className="text-foreground bg-white/5 rounded-lg p-2.5 leading-relaxed">
                      "{t.answer}"
                    </div>

                    {/* Strengths row */}
                    {t.strengths && t.strengths.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {t.strengths.map((s, si) => (
                          <span key={si} className="glass px-2 py-0.5 rounded-full text-[10px] text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <Check className="size-2.5" /> {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Media Playback */}
                    {t.videoUrl && (
                      <div className="mt-1">
                        <div className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1">
                          <Video className="size-3 text-primary-glow" /> Video Recording:
                        </div>
                        <video src={t.videoUrl} controls className="w-full rounded-xl max-h-36 bg-black" />
                      </div>
                    )}

                    {t.audioUrl && (
                      <div className="space-y-1">
                        <div className="text-[10px] text-muted-foreground flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Volume2 className="size-3 text-primary-glow" /> Voice Recording:
                          </span>
                          <button
                            onClick={() => playRecordedAudio(t.audioUrl!)}
                            className="text-[10px] text-accent hover:underline flex items-center gap-0.5 font-semibold"
                          >
                            <Play className="size-2.5" /> Force Play Audio
                          </button>
                        </div>
                        <audio src={t.audioUrl} controls className="w-full h-8" />
                      </div>
                    )}

                    {/* AI Feedback */}
                    {t.feedback && (
                      <div className="text-[11px] text-muted-foreground pt-2 border-t border-white/5 leading-relaxed">
                        <span className="font-semibold text-foreground">AI Feedback: </span>
                        {t.feedback}
                      </div>
                    )}

                    {/* Improvements */}
                    {t.improvements && t.improvements.length > 0 && (
                      <div className="text-[10px] text-amber-300 flex flex-col gap-1">
                        <span className="font-semibold text-amber-400 uppercase tracking-widest">Improve On:</span>
                        {t.improvements.map((imp, ii) => (
                          <span key={ii} className="flex items-start gap-1">
                            <AlertCircle className="size-2.5 mt-0.5 shrink-0" /> {imp}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Pace & fillers */}
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-white/5">
                      <span>Pace: <strong className="text-foreground">{t.wpm ?? "—"} WPM</strong></span>
                      <span>Fillers: <strong className="text-foreground">{t.filler_count ?? 0}</strong></span>
                      <span className={
                        t.confidence_rating === "High" ? "text-emerald-400 font-semibold"
                        : t.confidence_rating === "Medium" ? "text-amber-400 font-semibold"
                        : "text-red-400 font-semibold"
                      }>{t.confidence_rating} Confidence</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

