"use client";
import { useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaChevronLeft,
  FaChevronRight,
  FaRandom,
  FaUpload,
  FaVideo,
  FaCamera,
  FaInfoCircle,
  FaChartLine,
  FaList,
  FaRobot,
  FaRedo,
  FaPlaneDeparture,
  FaCog,
  FaTh,
  FaStickyNote,
} from "react-icons/fa";
import { Button } from "@/shadcn-components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shadcn-components/ui/card";
import { Badge } from "@/shadcn-components/ui/badge";
import ProfileSection from "../../components/ProfileSection";

export default function ProblemPage() {
  const params = useParams();
  const router = useRouter();
  const problemId = params.id;

  // Camera recording state
  const [recording, setRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);

  // Countdown and sync state
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const referenceVideoRef = useRef<HTMLVideoElement>(null);

  // Auto-analysis flag
  const [shouldAutoAnalyze, setShouldAutoAnalyze] = useState(false);

  // Progress tracking
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState("");

  // Handle reference video end event
  const handleReferenceVideoEnd = () => {
    if (recording) {
      setShouldAutoAnalyze(true); // Flag for auto-analysis
      handleStopRecording();
    }
  };

  // Simple dance mapping based on number ID
  const danceData = {
    "1": { title: "Adderall", video: "Adderall.mp4" },
    "2": { title: "Apple", video: "Apple.mp4" },
    "3": { title: "Blinding Lights", video: "Blinding-Lights.mp4" },
    "4": { title: "Cannibal", video: "Cannibal.mp4" },
    "5": { title: "Chicken Banana Dance", video: "Chicken-Banana-Dance.mp4" },
    "6": { title: "Don't Start Now", video: "Don't-Start-Now.mp4" },
    "7": { title: "Emergency Budots", video: "Emergency-Budots.mp4" },
    "8": { title: "Git Up Challenge", video: "Git-Up-Challenge.mp4" },
    "9": { title: "Give It To Me", video: "Give-it-to-Me.mp4" },
    "10": { title: "I'm Moving Too Fast", video: "I'm-Moving-Too-Fast.mp4" },
    "11": { title: "Illit Jellyous", video: "Illit-Jellyous.mp4" },
    "12": { title: "Last Christmas", video: "Last-Christmas.mp4" },
    "13": { title: "Laxed", video: "Laxed.mp4" },
    "14": { title: "Man Child", video: "Man-Child.mp4" },
    "15": { title: "Maps", video: "Maps.mp4" },
    "16": { title: "Number One Baby", video: "Number-One-Baby.mp4" },
    "17": { title: "Out West", video: "Out-West.mp4" },
    "18": { title: "Renegade", video: "Renegade.mp4" },
    "19": { title: "Supalonely", video: "Supalonely.mp4" },
    "20": { title: "Vibe", video: "Vibe.mp4" },
    "21": { title: "Wednesday", video: "Wednesday.mp4" },
    "22": { title: "Slide", video: "Slide.mp4" },
  }[problemId as string] || { title: "Unknown Dance", video: "Adderall.mp4" };

  const problemData = {
    id: problemId,
    title: danceData.title,
    difficulty: "Easy" as "Easy" | "Medium" | "Hard",
    tags: ["Dance", "Viral"],
  };

  // Analysis data from API
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(
    null
  );

  // Auto-scroll functionality
  const processedVideoRef = useRef<HTMLVideoElement>(null);
  const analysisContainerRef = useRef<HTMLDivElement>(null);
  const [currentHighlightedMove, setCurrentHighlightedMove] = useState<
    number | null
  >(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);

  // Parse timestamp to seconds
  const parseTimestamp = (timestamp: string): number => {
    const parts = timestamp.split(":");
    if (parts.length === 2) {
      const [minutes, seconds] = parts.map(parseFloat);
      return minutes * 60 + seconds;
    } else if (parts.length === 1) {
      return parseFloat(parts[0]);
    }
    return 0;
  };

  // Auto-scroll handler for video time updates
  const handleVideoTimeUpdate = () => {
    const video = processedVideoRef.current;
    const container = analysisContainerRef.current;
    const refVideo = referenceVideoRef.current;

    if (!video || !container || !analysisData?.parsed_data?.dance_analysis)
      return;

    const currentTime = video.currentTime;

    // Sync reference video with analyzed video (only sync time, not playback state)
    if (
      refVideo &&
      !recording &&
      Math.abs(refVideo.currentTime - currentTime) > 0.5
    ) {
      refVideo.currentTime = currentTime;
    }

    const validMoves = getValidMoves();

    // Find the current move based on video time
    let currentMoveIndex = -1;
    for (let i = 0; i < validMoves.length; i++) {
      const moveTime = parseTimestamp(validMoves[i].timestamp_of_outcome);
      if (currentTime >= moveTime - 1 && currentTime <= moveTime + 2) {
        currentMoveIndex = i;
        break;
      }
    }

    // Update highlighted move and scroll if necessary
    if (
      currentMoveIndex !== -1 &&
      currentMoveIndex !== currentHighlightedMove
    ) {
      setCurrentHighlightedMove(currentMoveIndex);

      // Scroll to the highlighted move
      const moveElement = container.querySelector(
        `[data-move-index="${currentMoveIndex}"]`
      );
      if (moveElement) {
        moveElement.scrollIntoView({
          behavior: "auto",
          block: "center",
        });
      }
    } else if (currentMoveIndex === -1) {
      setCurrentHighlightedMove(null);
    }
  };

  // Handle clicking on move to seek video
  const handleMoveClick = (timestamp: string) => {
    const video = processedVideoRef.current;
    const refVideo = referenceVideoRef.current;

    if (video) {
      const seekTime = parseTimestamp(timestamp);
      video.currentTime = seekTime;

      // Also sync reference video when seeking (with slight delay to avoid conflicts)
      if (refVideo && !recording) {
        setTimeout(() => {
          refVideo.currentTime = seekTime;
        }, 100);
      }
    }
  };

  // Handle video duration loaded
  const handleVideoLoadedMetadata = () => {
    const video = processedVideoRef.current;
    if (video) {
      setVideoDuration(video.duration);
    }
  };

  // Handle analyzed video play/pause to sync reference video
  const handleAnalyzedVideoPlay = () => {
    const refVideo = referenceVideoRef.current;
    if (refVideo && !recording && refVideo.paused) {
      refVideo.play().catch(console.error);
    }
  };

  const handleAnalyzedVideoPause = () => {
    const refVideo = referenceVideoRef.current;
    if (refVideo && !recording && !refVideo.paused) {
      refVideo.pause();
    }
  };

  // Filter moves that are within video duration
  const getValidMoves = () => {
    if (!analysisData?.parsed_data?.dance_analysis || videoDuration === 0) {
      return analysisData?.parsed_data?.dance_analysis || [];
    }

    return analysisData.parsed_data.dance_analysis.filter((move: any) => {
      const moveTime = parseTimestamp(move.timestamp_of_outcome);
      return moveTime <= videoDuration;
    });
  };

  const startCountdownAndRecording = async () => {
    try {
      // Get camera access first
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMediaStream(stream);
      recordedChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });
        const videoUrl = URL.createObjectURL(blob);
        setRecordedVideo(videoUrl);

        if (mediaStream) {
          mediaStream.getTracks().forEach((track) => track.stop());
          setMediaStream(null);
        }
      };

      // Start countdown
      setIsCountingDown(true);
      setCountdown(5);
      setShouldAutoAnalyze(false); // Reset auto-analyze flag

      // Countdown sequence: 5, 6, 7, 8, then start recording
      const countdownSequence = [5, 6, 7, 8];
      let currentIndex = 0;

      const countdownInterval = setInterval(() => {
        currentIndex++;
        if (currentIndex < countdownSequence.length) {
          setCountdown(countdownSequence[currentIndex]);
        } else {
          // Countdown finished, start recording and reference video
          setCountdown(null);
          setIsCountingDown(false);
          setRecording(true);
          mediaRecorder.start();

          // Start playing the reference video synchronized with recording
          const refVideo = referenceVideoRef.current;
          if (refVideo) {
            refVideo.currentTime = 0; // Reset to start
            refVideo.play().catch(console.error);
          }

          clearInterval(countdownInterval);
        }
      }, 500); // 500ms between each count (adjust to match beat)
    } catch (err) {
      console.error("Could not access camera:", err);
    }
  };

  const handleStopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setRecording(false);

      // Stop the reference video when recording stops
      const refVideo = referenceVideoRef.current;
      if (refVideo) {
        refVideo.pause();
      }
    }
  };

  const handleSubmitForAnalysis = async () => {
    if (!recordedVideo) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisProgress(0);
    setAnalysisStep("Preparing videos for analysis...");

    try {
      // Convert recorded video URL to File
      setAnalysisProgress(10);
      setAnalysisStep("Processing recorded video...");
      const response = await fetch(recordedVideo);
      const blob = await response.blob();
      const recordedVideoFile = new File([blob], "recorded-video.webm", {
        type: "video/webm",
      });

      // Get the reference video based on dance ID
      setAnalysisProgress(20);
      setAnalysisStep("Loading reference video...");
      const referenceVideoUrl = `/videos/${danceData.video}`;
      const referenceVideoResponse = await fetch(referenceVideoUrl);
      const referenceVideoBlob = await referenceVideoResponse.blob();
      const referenceVideoFile = new File(
        [referenceVideoBlob],
        danceData.video,
        {
          type: "video/mp4",
        }
      );

      // Step 1: Analyze videos - EXACT COPY FROM HOME
      setAnalysisProgress(30);
      setAnalysisStep("Comparing dance movements...");
      const formData1 = new FormData();
      formData1.append("video1", referenceVideoFile); // Reference video
      formData1.append("video2", recordedVideoFile); // User's recorded video

      console.log("Analyzing videos...");
      const analyzeResponse = await fetch(
        "http://localhost:8000/upload-and-analyze",
        {
          method: "POST",
          body: formData1,
        }
      );

      if (!analyzeResponse.ok) {
        throw new Error(`Analysis failed: ${analyzeResponse.status}`);
      }

      setAnalysisProgress(60);
      setAnalysisStep("Generating feedback...");
      const analyzeResult = await analyzeResponse.json();
      console.log("Analysis result:", analyzeResult);

      // Step 2: Process video directly with analysis - EXACT COPY FROM HOME
      setAnalysisProgress(70);
      setAnalysisStep("Creating analysis video...");
      const formData2 = new FormData();
      // Try to extract the actual analysis text, not the object
      let analysisText = "";
      if (typeof analyzeResult.response === "string") {
        analysisText = analyzeResult.response;
      } else if (analyzeResult.response) {
        analysisText = JSON.stringify(analyzeResult.response);
      } else {
        analysisText = JSON.stringify(analyzeResult);
      }

      formData2.append("dance_analysis", analysisText);
      formData2.append("video_file", recordedVideoFile);

      setAnalysisProgress(85);
      setAnalysisStep("Finalizing results...");
      console.log("Processing video with analysis...");
      const processResponse = await fetch(
        "http://localhost:8000/process-dance-video",
        {
          method: "POST",
          body: formData2,
        }
      );

      if (!processResponse.ok) {
        const errorText = await processResponse.text();
        console.error("Process response error:", errorText);
        throw new Error(
          `Processing failed: ${processResponse.status} - ${errorText}`
        );
      }

      // Get the processed video
      const videoBlob = await processResponse.blob();
      console.log("Video blob size:", videoBlob.size, "type:", videoBlob.type);

      const videoUrl = URL.createObjectURL(videoBlob);
      console.log("Created blob URL:", videoUrl);

      // Set the processed video URL and analysis data
      setAnalysisProgress(100);
      setAnalysisStep("Complete!");
      setProcessedVideoUrl(videoUrl);
      setAnalysisData(analyzeResult);
    } catch (err: any) {
      console.error("Analysis error:", err);
      setAnalysisError(err.message);
    } finally {
      setIsAnalyzing(false);
      // Reset progress after a short delay to show completion
      setTimeout(() => {
        setAnalysisProgress(0);
        setAnalysisStep("");
      }, 2000);
    }
  };

  // Set camera stream to video element
  useEffect(() => {
    const videoElement = cameraVideoRef.current;
    if (!videoElement) return;

    if (recording && mediaStream) {
      videoElement.srcObject = mediaStream;
    } else if (!recording) {
      videoElement.srcObject = null;
    }
  }, [recording, mediaStream]);

  const navigateToDance = (direction: "prev" | "next" | "random") => {
    const currentId = parseInt(problemId as string);
    const maxId = 21; // Total number of dances

    if (direction === "prev") {
      const prevId = currentId <= 1 ? maxId : currentId - 1;
      router.push(`/dance/${prevId}`);
    } else if (direction === "next") {
      const nextId = currentId >= maxId ? 1 : currentId + 1;
      router.push(`/dance/${nextId}`);
    } else if (direction === "random") {
      let randomId;
      do {
        randomId = Math.floor(Math.random() * maxId) + 1;
      } while (randomId === currentId);
      router.push(`/dance/${randomId}`);
    }
  };

  return (
    <div className="h-screen bg-zinc-50 flex flex-col overflow-hidden">
      {/* Header - Modern clean design */}
      <nav className="bg-white border-b border-zinc-200/50 w-full flex-shrink-0 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4 w-full">
          {/* Left: Logo and navigation */}
          <div className="flex items-center space-x-4">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => router.push("/")}
            />
            <span
              className="text-zinc-800 font-medium flex items-center space-x-2 cursor-pointer hover:text-tiktok-red transition-colors"
              onClick={() => router.push("/dances")}
            >
              <FaList className="w-4 h-4" />
              <span>Dances</span>
            </span>
            <div className="flex items-center space-x-1 border border-zinc-200 rounded-lg p-1">
              <button
                onClick={() => navigateToDance("prev")}
                className="text-zinc-600 hover:text-tiktok-red hover:bg-zinc-50 transition-colors p-2 rounded"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateToDance("next")}
                className="text-zinc-600 hover:text-tiktok-red hover:bg-zinc-50 transition-colors p-2 rounded"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateToDance("random")}
                className="text-zinc-600 hover:text-tiktok-red hover:bg-zinc-50 transition-colors p-2 rounded"
              >
                <FaRandom className="w-4 h-4" />
              </button>
            </div>
          </div>{" "}
          {/* Center: Record Button and Note */}
          <div className="flex items-center space-x-4">
            <div>
              {!recording && !recordedVideo && !isCountingDown && (
                <Button
                  onClick={startCountdownAndRecording}
                  className="bg-tiktok-red hover:bg-red-600 text-white font-medium px-8 py-2.5 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                >
                  <FaCamera className="w-4 h-4" />
                  <span>Record Dance</span>
                </Button>
              )}

              {isCountingDown && (
                <Button
                  disabled
                  className="bg-orange-500 text-white font-medium px-8 py-2.5 rounded-lg cursor-not-allowed"
                >
                  Get Ready... {countdown}
                </Button>
              )}

              {recording && (
                <Button
                  onClick={handleStopRecording}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium px-8 py-2.5 rounded-lg animate-pulse transition-all duration-200 flex items-center space-x-2 shadow-md"
                >
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Stop Recording</span>
                </Button>
              )}

              {recordedVideo && !recording && (
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => {
                      setRecordedVideo(null);
                      setMediaStream(null);
                    }}
                    variant="outline"
                    className="border-zinc-300 text-zinc-700 hover:bg-zinc-50 font-medium px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center space-x-2"
                  >
                    <FaRedo className="w-4 h-4" />
                    <span>Try Again</span>
                  </Button>
                  <Button
                    onClick={handleSubmitForAnalysis}
                    disabled={isAnalyzing}
                    className="bg-tiktok-red hover:bg-red-600 text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                  >
                    {isAnalyzing ? (
                      <>
                        <FaRobot className="w-4 h-4 animate-pulse" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <FaPlaneDeparture className="w-4 h-4" />
                        <span>Submit</span>
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            <button className="text-zinc-600 hover:text-tiktok-red hover:bg-zinc-50 transition-all duration-200 p-2.5 rounded-lg">
              <FaStickyNote className="w-5 h-5" />
            </button>
          </div>
          {/* Right: Timing, Layout, Settings, and Profile */}
          <div className="flex items-center space-x-3">
            <div className="bg-tiktok-red text-white px-3 py-1.5 rounded-lg text-sm font-medium">
              0.0s
            </div>
            <div className="flex items-center space-x-1 border border-zinc-200 rounded-lg p-1">
              <button className="text-zinc-600 hover:text-tiktok-red hover:bg-zinc-50 transition-all duration-200 p-2 rounded">
                <FaTh className="w-4 h-4" />
              </button>
              <button className="text-zinc-600 hover:text-tiktok-red hover:bg-zinc-50 transition-all duration-200 p-2 rounded">
                <FaCog className="w-4 h-4" />
              </button>
            </div>
            <ProfileSection />
          </div>
        </div>
      </nav>

      {/* Main Content - Modern grid layout */}
      <div className="flex-1 grid grid-cols-3 gap-6 p-6 overflow-hidden bg-zinc-50">
        {/* Left Column - Description and Reference */}
        <div className="flex flex-col gap-6 overflow-hidden">
          {/* Description Box */}
          <div className="flex-[0.25] bg-white rounded-xl shadow-sm border border-zinc-200/50 flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 flex-shrink-0">
              <h3 className="text-zinc-800 font-semibold flex items-center space-x-2">
                <FaInfoCircle className="w-4 h-4 text-zinc-500" />
                <span>{problemData.title}</span>
              </h3>
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Badge
                    className={`text-xs font-medium px-3 py-1 rounded-lg ${
                      problemData.difficulty === "Easy"
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                        : problemData.difficulty === "Medium"
                        ? "bg-amber-100 text-amber-700 border-amber-200"
                        : "bg-red-100 text-red-700 border-red-200"
                    }`}
                  >
                    {problemData.difficulty}
                  </Badge>
                  {problemData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-zinc-100 text-zinc-600 border-zinc-200 px-3 py-1 text-xs rounded-lg"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <p className="text-zinc-600 text-sm leading-relaxed">
                Follow the reference dance and record your performance. Use the video guide to learn the moves.
              </p>
            </div>
          </div>

          {/* Reference Video */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-zinc-200/50 flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 flex-shrink-0">
              <h3 className="text-zinc-800 font-semibold flex items-center space-x-2">
                <FaVideo className="w-4 h-4 text-zinc-500" />
                <span>Reference Video</span>
              </h3>
            </div>
            <div className="flex-1 p-6 flex items-center justify-center bg-zinc-50">
              <video
                src={`/videos/${danceData.video}`}
                controls
                className="rounded-lg max-h-full w-auto object-cover shadow-sm"
                ref={referenceVideoRef}
                onEnded={handleReferenceVideoEnd}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Camera and Analysis */}
        <div className="col-span-2 flex flex-col gap-6 overflow-hidden">
          {/* Camera Section */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-zinc-200/50 flex flex-col overflow-hidden relative">
            <div className="px-6 py-4 border-b border-zinc-100 flex-shrink-0">
              <h3 className="text-zinc-800 font-semibold flex items-center space-x-2">
                <FaCamera className="w-4 h-4 text-zinc-500" />
                <span>Your Performance</span>
              </h3>
            </div>

            <div className="flex-1 flex items-center justify-center bg-zinc-50/50 relative">
              {/* Always-mounted video element for camera feed */}
              <video
                ref={cameraVideoRef}
                autoPlay
                muted
                className={`absolute inset-0 w-full h-full object-cover z-0 transform scale-x-[-1] ${
                  recording ? "block" : "hidden"
                }`}
              />

              {/* Countdown Overlay */}
              {isCountingDown && countdown && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                  <div className="text-white text-8xl font-bold animate-pulse">
                    {countdown}
                  </div>
                </div>
              )}

              {/* Processed Video */}
              {processedVideoUrl && !recording && (
                <div className="w-full h-full flex items-center justify-center p-4">
                  <video
                    ref={processedVideoRef}
                    src={processedVideoUrl}
                    controls
                    className="max-w-full max-h-full object-contain rounded-lg"
                    onTimeUpdate={handleVideoTimeUpdate}
                    onLoadedMetadata={handleVideoLoadedMetadata}
                    onPlay={handleAnalyzedVideoPlay}
                    onPause={handleAnalyzedVideoPause}
                  />
                </div>
              )}

              {/* Ready State */}
              {!processedVideoUrl &&
                !recording &&
                !isCountingDown &&
                !isAnalyzing && (
                  <div className="text-center text-zinc-500">
                    <FaCamera className="text-5xl mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-zinc-800 mb-1">
                      Ready to Dance
                    </h2>
                    <p className="text-sm">
                      Click "Record Dance" to begin.
                    </p>
                  </div>
                )}

              {/* Analyzing State */}
              {!processedVideoUrl &&
                !recording &&
                !isCountingDown &&
                isAnalyzing && (
                  <div className="text-center text-zinc-500">
                    <FaRobot className="text-5xl mx-auto mb-4 animate-pulse" />
                    <h2 className="text-xl font-semibold text-zinc-800 mb-2">
                      Analyzing Your Moves
                    </h2>
                    <div className="w-48 bg-zinc-200 rounded-full h-2 mx-auto mb-2">
                      <div
                        className="bg-tiktok-red h-2 rounded-full transition-all duration-500"
                        style={{ width: `${analysisProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs">{analysisStep}</p>
                  </div>
                )}
            </div>
          </div>

          {/* Analysis Section */}
          <div className="flex-[0.4] bg-white rounded-xl shadow-sm border border-zinc-200/50 flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 flex-shrink-0">
              <h3 className="text-zinc-800 font-semibold flex items-center space-x-2">
                <FaChartLine className="w-4 h-4 text-zinc-500" />
                <span>Dance Analysis</span>
              </h3>
            </div>
            <div
              className="flex-1 p-6 overflow-auto"
              ref={analysisContainerRef}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {analysisData && analysisData.parsed_data?.dance_analysis && (
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-semibold text-zinc-800">Score:</span>
                      <span className="text-tiktok-red font-bold">
                        {getValidMoves().reduce((sum: number, move: any) => {
                          const baseScore = 100;
                          const penalty = Math.max(0, -move.score * 5);
                          return Math.max(0, baseScore - penalty);
                        }, 0)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-semibold text-zinc-800">Duration:</span>
                    <span className="text-zinc-600">
                      {videoDuration > 0
                        ? `${videoDuration.toFixed(1)}s`
                        : "0.0s"}
                    </span>
                  </div>
                </div>
              </div>

              {isAnalyzing && !analysisData && (
                <div className="text-center text-zinc-500 py-8">
                  <div className="animate-spin w-6 h-6 border-2 border-tiktok-red border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p className="text-sm">Analyzing your dance...</p>
                </div>
              )}

              {analysisError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 text-sm font-medium">
                    Analysis Error: {analysisError}
                  </p>
                </div>
              )}

              {analysisData &&
                analysisData.parsed_data?.dance_analysis &&
                getValidMoves().map((move: any, index: number) => {
                  const isBlunder = move.score <= -4;
                  const isMistake = move.score === -3;
                  const isInaccuracy = move.score >= -2;

                  return (
                    <div
                      key={index}
                      data-move-index={index}
                      className={`rounded-lg border p-3 mb-2 cursor-pointer transition-all duration-300 ${
                        currentHighlightedMove === index
                          ? "bg-blue-50 border-blue-400 shadow-lg scale-[1.02]"
                          : "bg-zinc-50/80 border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-100"
                      }`}
                      onClick={() => handleMoveClick(move.timestamp_of_outcome)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-xs font-mono px-2 py-1 rounded-md transition-colors ${
                              currentHighlightedMove === index
                                ? "text-blue-800 bg-blue-200"
                                : "text-zinc-600 bg-zinc-200"
                            }`}
                          >
                            {move.timestamp_of_outcome}
                          </span>
                          <span className="text-zinc-800 text-sm font-semibold capitalize">
                            {move.problem_type}
                          </span>
                          {isBlunder && (
                            <div className="w-2 h-2 bg-red-500 rounded-full" title="Blunder"></div>
                          )}
                          {isMistake && (
                            <div className="w-2 h-2 bg-orange-400 rounded-full" title="Mistake"></div>
                          )}
                          {isInaccuracy && (
                            <div className="w-2 h-2 bg-yellow-400 rounded-full" title="Inaccuracy"></div>
                          )}
                        </div>
                        <span className="text-xs text-zinc-400 font-medium">
                          #{index + 1}
                        </span>
                      </div>
                      <div
                        className={`rounded-md p-2 border-l-4 ${
                          currentHighlightedMove === index
                            ? "bg-blue-50/50 border-blue-500"
                            : "bg-white border-zinc-300"
                        }`}
                      >
                        <p className="text-zinc-700 text-sm leading-relaxed">
                          {move.feedback}
                        </p>
                      </div>
                    </div>
                  );
                })}

              {!analysisData && !isAnalyzing && !analysisError && (
                <div className="text-center text-zinc-400 py-8">
                  <FaChartLine className="text-4xl mx-auto mb-3" />
                  <h4 className="font-semibold text-zinc-600 mb-1">
                    Awaiting Analysis
                  </h4>
                  <p className="text-sm">
                    Your dance feedback will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
