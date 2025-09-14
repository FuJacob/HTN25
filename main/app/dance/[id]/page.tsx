"use client";
import { useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
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
  

  // Problem data (would come from API in real app)
  const problemData = {
    id: problemId,
    title: "Two Sum Dance",
    difficulty: "Easy" as const,
    tags: ["Array", "Hash Table", "Dance"]
  };

  // Analysis data from API
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

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

      // Countdown sequence: 5, 6, 7, 8, then start recording
      const countdownSequence = [5, 6, 7, 8];
      let currentIndex = 0;

      const countdownInterval = setInterval(() => {
        currentIndex++;
        if (currentIndex < countdownSequence.length) {
          setCountdown(countdownSequence[currentIndex]);
        } else {
          // Countdown finished, start recording
          setCountdown(null);
          setIsCountingDown(false);
          setRecording(true);
          mediaRecorder.start();
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
    }
  };

  const handleSubmitForAnalysis = async () => {
    if (!recordedVideo) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      // Convert recorded video URL to File
      const response = await fetch(recordedVideo);
      const blob = await response.blob();
      const videoFile = new File([blob], "recorded-video.webm", {
        type: "video/webm",
      });

      // Create FormData for API call
      const formData = new FormData();
      formData.append("video1", videoFile);
      formData.append("video2", videoFile);

      // Make API call to analyze the video
      console.log("Sending request to API with formData:", formData);
      console.log("Video file details:", {
        name: videoFile.name,
        size: videoFile.size,
        type: videoFile.type
      });

      const analyzeResponse = await fetch(
        "http://localhost:8000/upload-and-analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      console.log("API response status:", analyzeResponse.status);
      console.log("API response ok:", analyzeResponse.ok);

      if (!analyzeResponse.ok) {
        const errorText = await analyzeResponse.text();
        console.error("API error response:", errorText);
        throw new Error(`Analysis failed: ${analyzeResponse.status} - ${errorText}`);
      }

      const result = await analyzeResponse.json();
      console.log("Analysis result:", result);
      
      setAnalysisData(result);
    } catch (err: any) {
      console.error("Analysis error:", err);
      setAnalysisError(err.message);
    } finally {
      setIsAnalyzing(false);
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

  return (
    <div className="h-full bg-gray-900 text-white">
      <div className="flex h-full">
        {/* Left Panel - Reference & Controls */}
        <div className="w-1/3 border-r border-gray-700 flex flex-col bg-gray-900 min-h-0">
          <div className="border-b border-gray-700 p-6 bg-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link href="/dance" className="text-orange-400 hover:text-orange-300 transition-colors text-xl">
                  ←
                </Link>
                <h2 className="text-xl font-semibold text-white">{problemData.title}</h2>
              </div>
              <Badge variant={problemData.difficulty === 'Easy' ? 'default' : 'destructive'} className="text-sm px-3 py-1">
                {problemData.difficulty}
              </Badge>
            </div>
          </div>

          {/* Reference Video Placeholder - Vertical TikTok Style */}
          <div className="p-6 flex justify-center items-center flex-1 min-h-0 overflow-hidden">
            <div className="relative">
              <div
                className="bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 rounded-2xl flex items-center justify-center shadow-2xl border border-gray-600/30 w-64"
                style={{ height: '400px' }}
              >
                <div className="text-center text-white space-y-3">
                  <div className="text-5xl mb-4">🎵</div>
                  <p className="text-xl font-bold mb-1">TikTok</p>
                  <p className="text-xl font-bold mb-3">Dance</p>
                  <div className="space-y-1 opacity-75">
                    <p className="text-sm">Vertical video</p>
                    <p className="text-sm">will appear here</p>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-white/5 pointer-events-none"></div>
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
                  <Badge key={tag} variant="secondary" className="text-xs px-3 py-1 bg-gray-700 text-gray-200 border-0">
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
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      setRecordedVideo(null);
                      setMediaStream(null);
                    }}
                    variant="outline"
                    className="w-full h-10 border-gray-600 text-gray-200 hover:bg-gray-700 hover:border-gray-500 transition-all duration-200"
                  >
                    Try Again
                  </Button>
                  <Button 
                    onClick={handleSubmitForAnalysis}
                    disabled={isAnalyzing}
                    className="w-full h-12 font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:t
                    o-emerald-700 shadow-lg transform hover:scale-[1.02] transition-all duration-200" 
                    size="lg"
                  >
                    {isAnalyzing ? "🔄 Analyzing..." : "Submit for Analysis"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-2/3 flex flex-col bg-black relative">
          {/* Always-mounted video element */}
          <video
            ref={cameraVideoRef}
            autoPlay
            muted
            className={`absolute inset-0 w-full h-full object-cover z-0 ${recording ? 'block' : 'hidden'}`}
          />
          
              {/* Countdown Overlay */}
              {isCountingDown && countdown && (
                <div className="absolute inset-0 bg-black/75 flex items-center justify-center z-20">
                  <div className="text-white text-9xl font-bold animate-pulse">
                    {countdown}
                  </div>
                </div>
              )}

          {/* Top Section - Blank for now */}
          <div className="flex-1 flex items-center justify-center relative z-10">
                {recordedVideo && !recording && (
                  <video
                    src={recordedVideo}
                    controls
                    className="w-full h-full object-cover"
                  />
                )}

                {!recording && !recordedVideo && !isCountingDown && (
                  <div className="text-center text-gray-400">
                    <div className="text-8xl mb-6">📹</div>
                    <CardTitle className="text-3xl mb-4">Ready to Dance</CardTitle>
                    <p className="text-lg">Start the challenge to begin recording</p>
                  </div>
                )}
              </div>

          {/* Bottom Section - Compact Analysis */}
          <div className="h-36 border-t border-gray-700 bg-gray-900/50 relative z-10 flex flex-col">
            {/* Sticky Header */}
            <div className="sticky top-0 px-4 py-3 bg-gradient-to-b from-gray-900/95 via-gray-900/80 to-transparent backdrop-blur-md flex items-center justify-between border-b border-gray-700 flex-shrink-0">
              <h3 className="text-sm font-semibold text-white">Dance Analysis</h3>
              <div className="flex items-center space-x-3">
                {analysisData && analysisData.parsed_data?.dance_analysis && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-xs text-gray-300">Score: {analysisData.parsed_data.dance_analysis.reduce((sum: number, move: any) => sum + move.score, 0)}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-xs text-gray-300">10.0s</span>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-auto">
              <div className="p-4 space-y-2">
                {isAnalyzing && (
                  <div className="text-center text-gray-400 py-4">
                    <div className="animate-spin w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm">Analyzing your dance...</p>
                  </div>
                )}

                {analysisError && (
                  <div className="bg-red-900/50 rounded border border-red-700 p-3">
                    <p className="text-red-200 text-sm">Error: {analysisError}</p>
                  </div>
                )}

                {analysisData && analysisData.parsed_data?.dance_analysis && (
                  analysisData.parsed_data.dance_analysis.map((move: any, index: number) => {
                    const isBlunder = move.score <= -4;
                    const isMistake = move.score === -3;
                    const isInaccuracy = move.score >= -2;
                    
                    return (
                      <div key={index} className="bg-gray-800/50 rounded border border-gray-700 hover:border-gray-600 transition-colors">
                        <div className="p-2">
                          {/* Move Header */}
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-mono text-gray-400 bg-gray-900 px-1 py-0.5 rounded">
                                {move.timestamp_of_outcome}
                              </span>
                              <span className="text-white text-sm font-medium capitalize">{move.problem_type}</span>
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
                            <span className="text-xs text-gray-400">#{index + 1}</span>
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
                  })
                )}

                {!analysisData && !isAnalyzing && !analysisError && (
                  <div className="text-center text-gray-400 py-4">
                    <p className="text-sm">Record and submit your dance for analysis</p>
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