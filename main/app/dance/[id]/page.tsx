"use client";
import { useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

export default function ProblemPage() {
  const params = useParams();
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
  const [currentHighlightedMove, setCurrentHighlightedMove] = useState<number | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(0);

  // Parse timestamp to seconds
  const parseTimestamp = (timestamp: string): number => {
    const parts = timestamp.split(':');
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

    if (!video || !container || !analysisData?.parsed_data?.dance_analysis) return;

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
    if (currentMoveIndex !== -1 && currentMoveIndex !== currentHighlightedMove) {
      setCurrentHighlightedMove(currentMoveIndex);

      // Scroll to the highlighted move
      const moveElement = container.querySelector(`[data-move-index="${currentMoveIndex}"]`);
      if (moveElement) {
        moveElement.scrollIntoView({
          behavior: 'auto',
          block: 'center'
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

      // Reference video will be handled separately

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

  // Reset reference video when recording state changes
  useEffect(() => {
    const refVideo = referenceVideoRef.current;
    if (!recording && refVideo && !refVideo.paused) {
      refVideo.pause();
      refVideo.currentTime = 0;
    }
  }, [recording]);

  // Auto-analysis when recording is complete and flag is set
  useEffect(() => {
    if (recordedVideo && shouldAutoAnalyze && !recording && !isAnalyzing) {
      setShouldAutoAnalyze(false); // Reset flag
      handleSubmitForAnalysis();
    }
  }, [recordedVideo, shouldAutoAnalyze, recording, isAnalyzing]);

  return (
    <div className="h-screen bg-gray-900 text-white overflow-hidden">
      <div className="flex h-full">
        {/* Left Panel - Reference & Controls */}
        <div className="w-1/3 border-r border-gray-700 flex flex-col bg-gray-900 min-h-0">
          <div className="border-b border-gray-700 p-6 bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link
                  href="/dances"
                  className="text-orange-400 hover:text-orange-300 transition-colors text-xl"
                >
                  ←
                </Link>
                <h2 className="text-xl font-semibold text-white">
                  {problemData.title}
                </h2>
              </div>
              <Badge
                variant={
                  problemData.difficulty === "Easy" ? "default" : "destructive"
                }
                className="text-sm px-3 py-1"
              >
                {problemData.difficulty}
              </Badge>
            </div>
          </div>

          {/* Reference Video - Vertical TikTok Style */}
          <div className="p-4 flex justify-center items-center flex-1 min-h-0 overflow-hidden">
            <div className="relative w-full h-full flex justify-center items-center">
              <video
                src={`/videos/${danceData.video}`}
                controls
                className="rounded-2xl shadow-2xl border border-gray-600/30 max-w-full max-h-full object-contain"
                ref={referenceVideoRef}
                onEnded={handleReferenceVideoEnd}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="p-4 space-y-4 bg-gray-800/20 flex-shrink-0">
            <div className="space-y-3">
              <p className="text-gray-200 text-sm leading-relaxed font-medium">
                Follow the reference dance and record your performance
              </p>
              <div className="flex flex-wrap gap-2">
                {problemData.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs px-3 py-1 bg-gray-700 text-gray-200 border-0"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {!recording && !recordedVideo && !isCountingDown && (
                <Button
                  onClick={startCountdownAndRecording}
                  className="w-full h-12 text-sm font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                  size="lg"
                >
                  🎵 Start Dance Challenge
                </Button>
              )}

              {isCountingDown && (
                <Button
                  disabled
                  className="w-full h-12 text-sm font-semibold bg-gradient-to-r from-orange-600 to-yellow-600 text-white cursor-not-allowed"
                  size="lg"
                >
                  Get Ready... {countdown}
                </Button>
              )}

              {recording && (
                <Button
                  onClick={handleStopRecording}
                  className="w-full h-12 font-semibold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white animate-pulse shadow-lg"
                  size="lg"
                >
                  ● Stop Recording
                </Button>
              )}

              {recordedVideo && !recording && (
                <Button
                  onClick={() => {
                    window.location.reload();
                  }}
                  variant="outline"
                  className="w-full h-10 bg-gray-300 border-gray-500 text-gray-200 hover:bg-gray-700 hover:border-gray-500 transition-all duration-200"
                >
                  Try Again
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-2/3 flex flex-col bg-black relative min-h-0 overflow-hidden">
          {/* Always-mounted video element */}
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
            <div className="absolute inset-0 bg-black/75 flex items-center justify-center z-20">
              <div className="text-white text-9xl font-bold animate-pulse">
                {countdown}
              </div>
            </div>
          )}

          {/* Top Section - Processed Video */}
          <div className="flex-1 flex items-center justify-center relative z-10">
            {processedVideoUrl && (
              <video
                ref={processedVideoRef}
                src={processedVideoUrl}
                controls
                className="w-full h-full object-cover"
                onTimeUpdate={handleVideoTimeUpdate}
                onLoadedMetadata={handleVideoLoadedMetadata}
                onPlay={handleAnalyzedVideoPlay}
                onPause={handleAnalyzedVideoPause}
              />
            )}

            {!processedVideoUrl && !recording && !isCountingDown && !isAnalyzing && (
              <div className="text-center text-gray-400">
                <div className="text-8xl mb-6">📹</div>
                <CardTitle className="text-3xl mb-4">Ready to Dance</CardTitle>
                <p className="text-lg">
                  Start the challenge to begin recording
                </p>
              </div>
            )}

            {!processedVideoUrl && !recording && !isCountingDown && isAnalyzing && (
              <div className="text-center text-gray-400 max-w-md mx-auto">
                <div className="text-8xl mb-6 animate-pulse">🤖</div>
                <CardTitle className="text-3xl mb-4">Analyzing Your Dance</CardTitle>
                <p className="text-lg mb-6">
                  AI is reviewing your performance...
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                  <div
                    className="bg-gradient-to-r from-tiktok-red to-pink-500 h-3 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>

                {/* Progress Text */}
                <p className="text-sm text-gray-300 mb-4">
                  {analysisStep || "Initializing..."}
                </p>
                <p className="text-xs text-gray-500">
                  {analysisProgress}% Complete
                </p>

                <div className="mt-4">
                  <div className="animate-spin w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full mx-auto"></div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Section - Compact Analysis */}
          <div className="h-36 border-t border-gray-700 bg-gray-900/50 relative z-10 flex flex-col flex-shrink-0">
            {/* Sticky Header */}
            <div className="sticky top-0 px-4 py-3 bg-gradient-to-b from-gray-900/95 via-gray-900/80 to-transparent backdrop-blur-md flex items-center justify-between border-b border-gray-700 flex-shrink-0">
              <h3 className="text-sm font-semibold text-white">
                Dance Analysis
              </h3>
              <div className="flex items-center space-x-3">
                {analysisData && analysisData.parsed_data?.dance_analysis && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-xs text-gray-300">
                      Score:{" "}
                      {getValidMoves().reduce(
                        (sum: number, move: any) => {
                          const baseScore = 100;
                          const penalty = Math.max(0, -move.score * 5);
                          return Math.max(0, baseScore - penalty);
                        },
                        0
                      )}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-xs text-gray-300">
                    {videoDuration > 0 ? `${videoDuration.toFixed(1)}s` : '0.0s'}
                  </span>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-auto min-h-0" ref={analysisContainerRef}>
              <div className="p-4 space-y-2">
                {isAnalyzing && (
                  <div className="text-center text-gray-400 py-4">
                    <div className="animate-spin w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm">Analyzing your dance...</p>
                  </div>
                )}

                {analysisError && (
                  <div className="bg-red-900/50 rounded border border-red-700 p-3">
                    <p className="text-red-200 text-sm">
                      Error: {analysisError}
                    </p>
                  </div>
                )}

                {analysisData &&
                  analysisData.parsed_data?.dance_analysis &&
                  getValidMoves().map((move: any, index: number) => {
                      const isBlunder = move.score <= -15;
                      const isMistake = move.score === -8;
                      const isInaccuracy = move.score >= -4;

                      return (
                        <div
                          key={index}
                          data-move-index={index}
                          className={`rounded border transition-all duration-300 cursor-pointer ${
                            currentHighlightedMove === index
                              ? 'bg-blue-900/60 border-blue-500 shadow-lg scale-[1.02]'
                              : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                          }`}
                          onClick={() => handleMoveClick(move.timestamp_of_outcome)}
                        >
                          <div className="p-2">
                            {/* Move Header */}
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-mono text-blue-400 bg-gray-900 px-1 py-0.5 rounded hover:bg-blue-900/50 transition-colors">
                                  🎯 {move.timestamp_of_outcome}
                                </span>
                                <span className="text-white text-sm font-medium capitalize">
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
                              <span className="text-xs text-gray-400">
                                #{index + 1}
                              </span>
                            </div>

                            {/* Feedback - Compact */}
                            <div className="bg-gray-900/50 rounded p-1.5 border-l-2 border-gray-600">
                              <p className="text-gray-200 text-xs leading-relaxed line-clamp-2">
                                {move.feedback}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}

                {!analysisData && !isAnalyzing && !analysisError && (
                  <div className="text-center text-gray-400 py-4">
                    <p className="text-sm">
                      Record and submit your dance for analysis
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
