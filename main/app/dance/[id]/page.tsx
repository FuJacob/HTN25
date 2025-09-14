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

    // Sync reference video with analyzed video
    if (refVideo && !recording) {
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

      // Also sync reference video when seeking
      if (refVideo && !recording) {
        refVideo.currentTime = seekTime;
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
    if (refVideo && !recording) {
      refVideo.play().catch(console.error);
    }
  };

  const handleAnalyzedVideoPause = () => {
    const refVideo = referenceVideoRef.current;
    if (refVideo && !recording) {
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
    <div className="h-screen bg-tiktok-black flex flex-col overflow-hidden">
      {/* Header - Fixed height */}
      <nav className="bg-tiktok-white border-b border-tiktok-black/10 w-full flex-shrink-0">
        <div className="flex items-center justify-between px-8 py-3 w-full">
          {/* Left: Logo and navigation */}
          <div className="flex items-center space-x-4">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => router.push("/")}
            />
            <span
              className="text-tiktok-black font-medium flex items-center space-x-2 cursor-pointer hover:text-tiktok-red transition-colors"
              onClick={() => router.push("/dances")}
            >
              <FaList className="w-4 h-4" />
              <span>Dance List</span>
            </span>
            <button
              onClick={() => navigateToDance("prev")}
              className="text-tiktok-red hover:text-tiktok-red/80 transition-colors p-2 rounded-lg hover:bg-tiktok-black/5"
            >
              <FaChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateToDance("next")}
              className="text-tiktok-red hover:text-tiktok-red/80 transition-colors p-2 rounded-lg hover:bg-tiktok-black/5"
            >
              <FaChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateToDance("random")}
              className="text-tiktok-red hover:text-tiktok-red/80 transition-colors p-2 rounded-lg hover:bg-tiktok-black/5"
            >
              <FaRandom className="w-5 h-5" />
            </button>
            </div>

          {/* Center: Submit Button */}
          <div>
              {!recording && !recordedVideo && !isCountingDown && (
                <Button
                  onClick={startCountdownAndRecording}
                className="bg-tiktok-red hover:bg-tiktok-red/80 text-tiktok-white font-bold px-6 py-2 text-sm rounded-full transition-colors flex items-center space-x-2"
                >
                <FaUpload className="w-4 h-4" />
                <span>Submit</span>
                </Button>
              )}

              {isCountingDown && (
                <Button
                  disabled
                className="bg-orange-500 text-tiktok-white font-bold px-6 py-2 text-sm rounded-full cursor-not-allowed"
                >
                  Get Ready... {countdown}
                </Button>
              )}

              {recording && (
                <Button
                  onClick={handleStopRecording}
                className="bg-tiktok-red hover:bg-tiktok-red/80 text-tiktok-white font-bold px-6 py-2 text-sm rounded-full animate-pulse"
                >
                  ● Stop Recording
                </Button>
              )}

              {recordedVideo && !recording && (
              <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => {
                      setRecordedVideo(null);
                      setMediaStream(null);
                    }}
                    variant="outline"
                  size="sm"
                  className="border-tiktok-black/20 text-tiktok-black hover:bg-tiktok-black/5"
                  >
                    Try Again
                  </Button>
                  <Button
                    onClick={handleSubmitForAnalysis}
                    disabled={isAnalyzing}
                  size="sm"
                  className="bg-tiktok-red hover:bg-tiktok-red/80 text-tiktok-white font-bold rounded-full"
                  >
                    {isAnalyzing ? "🔄 Analyzing..." : "Submit for Analysis"}
                  </Button>
                </div>
              )}
          </div>

          {/* Right: Profile Section */}
          <div>
            <ProfileSection />
          </div>
        </div>
      </nav>

      {/* Main Content Grid - Takes remaining height */}
      <div className="flex-1 grid grid-cols-3 gap-4 p-4 overflow-hidden">
        {/* Left Column - Description and Reference */}
        <div className="flex flex-col gap-4 overflow-hidden">
          {/* Description Box - Takes 15% of left column */}
          <div className="flex-[0.15] bg-tiktok-white rounded-xl shadow-lg flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-tiktok-black font-semibold text-sm flex items-center space-x-2">
                <FaInfoCircle className="w-4 h-4" />
                <span>Description</span>
              </h3>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-bold text-tiktok-black">
                  {problemData.title}
                </h4>
                <div className="flex items-center gap-2">
                  <Badge
                    className={`text-xs font-medium px-2 py-1 ${
                      problemData.difficulty === "Easy"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : problemData.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }`}
                  >
                    {problemData.difficulty}
                  </Badge>
                  {problemData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-tiktok-black/5 text-tiktok-black border-tiktok-black/10 px-2 py-1 text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <p className="text-tiktok-black/70 text-sm leading-relaxed">
                Follow the reference dance and record your performance
              </p>
            </div>
          </div>

          {/* Reference Video - Takes 85% of left column */}
          <div className="flex-[0.85] bg-tiktok-white rounded-xl shadow-lg flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-tiktok-black font-semibold text-sm flex items-center space-x-2">
                <FaVideo className="w-4 h-4" />
                <span>Dance Reference</span>
              </h3>
            </div>
            <div className="flex-1 p-4 flex items-center justify-center">
              <video
                src={`/videos/${danceData.video}`}
                controls
                className="rounded-lg max-w-full max-h-full object-contain"
                ref={referenceVideoRef}
                onEnded={handleReferenceVideoEnd}
              />
            </div>
          </div>
        </div>

        {/* Right Column - Camera and Analysis */}
        <div className="col-span-2 flex flex-col gap-4 overflow-hidden">
          {/* Camera Section - Takes 70% of right column */}
          <div className="flex-[0.7] bg-tiktok-white rounded-xl shadow-lg flex flex-col overflow-hidden relative">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-tiktok-black font-semibold text-sm flex items-center space-x-2">
                <FaCamera className="w-4 h-4" />
                <span>Camera</span>
              </h3>
            </div>

          {/* Always-mounted video element */}
          <video
            ref={cameraVideoRef}
            autoPlay
            muted
              className={`absolute inset-0 w-full h-full object-cover rounded-b-xl ${
              recording ? "block" : "hidden"
            }`}
              style={{ top: "40px" }} // Account for header height
          />

          {/* Countdown Overlay */}
          {isCountingDown && countdown && (
              <div
                className="absolute inset-0 bg-tiktok-black/75 flex items-center justify-center"
                style={{ top: "40px" }}
              >
                <div className="text-tiktok-white text-6xl font-bold animate-pulse">
                {countdown}
              </div>
            </div>
          )}

            {/* Processed Video */}
            {processedVideoUrl && !recording && (
              <div className="flex-1 p-4">
              <video
                  ref={processedVideoRef}
                src={processedVideoUrl}
                controls
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            )}

            {/* Ready State */}
            {!processedVideoUrl &&
              !recording &&
              !isCountingDown &&
              !isAnalyzing && (
                <div className="flex-1 flex items-center justify-center p-4">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <FaCamera className="text-4xl text-tiktok-black/30" />
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-tiktok-black">
                      Ready to Dance
                    </h2>
                    <p className="text-sm text-tiktok-black/70">
                  Start the challenge to begin recording
                </p>
                  </div>
                </div>
              )}

            {/* Analyzing State */}
            {!processedVideoUrl &&
              !recording &&
              !isCountingDown &&
              isAnalyzing && (
                <div className="flex-1 flex items-center justify-center p-4">
                  <div className="text-center">
                    <div className="text-4xl mb-4 animate-pulse">🤖</div>
                    <h3 className="text-lg font-bold mb-2 text-tiktok-black">
                      Analyzing Your Dance
                    </h3>
                    <p className="text-sm mb-4 text-tiktok-black/70">
                      AI is reviewing your performance...
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-gradient-to-r from-tiktok-red to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${analysisProgress}%` }}
                      ></div>
                    </div>

                    {/* Progress Text */}
                    <p className="text-xs text-tiktok-black/70 mb-2">
                      {analysisStep || "Initializing..."}
                    </p>
                    <p className="text-xs text-tiktok-black/50">
                      {analysisProgress}% Complete
                    </p>
                  </div>
              </div>
            )}
          </div>

          {/* Analysis Section - Takes 30% of right column */}
          <div className="flex-[0.3] bg-tiktok-white rounded-xl shadow-lg flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-tiktok-black font-semibold text-sm flex items-center space-x-2">
                <FaChartLine className="w-4 h-4" />
                <span>Analysis Cases</span>
              </h3>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                {analysisData && analysisData.parsed_data?.dance_analysis && (
                  <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-tiktok-red rounded-full"></div>
                      <span className="text-xs text-tiktok-black/70">
                      Score:{" "}
                      {analysisData.parsed_data.dance_analysis.reduce(
                        (sum: number, move: any) => sum + move.score,
                        0
                      )}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                    <span className="text-xs text-tiktok-black/70">10.0s</span>
                </div>
              </div>
            </div>

                {isAnalyzing && (
                <div className="text-center text-tiktok-black/70 py-4">
                  <div className="animate-spin w-4 h-4 border-2 border-tiktok-red border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-xs">Analyzing your dance...</p>
                  </div>
                )}

                {analysisError && (
                <div className="bg-red-50 border border-red-200 rounded p-2">
                  <p className="text-red-800 text-xs">Error: {analysisError}</p>
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
                      className="bg-tiktok-black/5 rounded border border-tiktok-black/10 p-2 mb-2"
                        >
                            <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-1">
                          <span className="text-xs font-mono text-tiktok-black/70 bg-tiktok-black/10 px-1 py-0.5 rounded">
                                  {move.timestamp_of_outcome}
                                </span>
                          <span className="text-tiktok-black text-xs font-medium capitalize">
                                  {move.problem_type}
                                </span>
                                {isBlunder && (
                                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                )}
                                {isMistake && (
                                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                )}
                                {isInaccuracy && (
                                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                                )}
                              </div>
                        <span className="text-xs text-tiktok-black/50">
                                #{index + 1}
                              </span>
                            </div>
                      <div className="bg-tiktok-white rounded p-1.5 border-l-2 border-tiktok-red/30">
                        <p className="text-tiktok-black/80 text-xs leading-relaxed">
                                {move.feedback}
                              </p>
                          </div>
                        </div>
                      );
                })}

                {!analysisData && !isAnalyzing && !analysisError && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <FaChartLine className="text-3xl text-tiktok-black/30" />
                    </div>
                    <h4 className="text-xl font-bold mb-2 text-tiktok-black">
                      Ready to Analyze
                    </h4>
                    <p className="text-sm text-tiktok-black/70">
                      Record and submit your dance for analysis
                    </p>
                  </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
