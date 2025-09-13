"use client";
import { useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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

  // Set camera stream to video element
  useEffect(() => {
    if (recording && cameraVideoRef.current && mediaStream) {
      cameraVideoRef.current.srcObject = mediaStream;
    }
    if (!recording && cameraVideoRef.current) {
      cameraVideoRef.current.srcObject = null;
    }
  }, [recording, mediaStream]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="flex items-center px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dance" className="text-orange-400 hover:text-orange-300 transition-colors">
              ← Back to Problems
            </Link>
            <span className="text-gray-500">|</span>
            <span className="text-white font-medium text-lg">{problemData.title}</span>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-60px)]">
        {/* Left Panel - Reference & Controls */}
        <div className="w-1/3 border-r border-gray-700 flex flex-col bg-gray-900">
          <div className="border-b border-gray-700 p-6 bg-gray-800/50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">{problemData.title}</h2>
              <Badge variant={problemData.difficulty === 'Easy' ? 'default' : 'destructive'} className="text-sm px-3 py-1">
                {problemData.difficulty}
              </Badge>
            </div>
          </div>

          {/* Reference Video Placeholder - Vertical TikTok Style */}
          <div className="p-6 flex justify-center items-center flex-1">
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
          <div className="p-6 space-y-6 bg-gray-800/20">
            <div className="space-y-4">
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

            <div className="space-y-4">
              {!recording && !recordedVideo && !isCountingDown && (
                <Button
                  onClick={startCountdownAndRecording}
                  className="w-full h-14 text-base font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                  size="lg"
                >
                  🎵 Start Dance Challenge
                </Button>
              )}

              {isCountingDown && (
                <Button
                  disabled
                  className="w-full h-14 text-base font-semibold bg-gradient-to-r from-orange-600 to-yellow-600 text-white cursor-not-allowed"
                  size="lg"
                >
                  Get Ready... {countdown}
                </Button>
              )}

              {recording && (
                <Button
                  onClick={handleStopRecording}
                  className="w-full h-14 font-semibold bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white animate-pulse shadow-lg"
                  size="lg"
                >
                  ● Stop Recording
                </Button>
              )}

              {recordedVideo && !recording && (
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setRecordedVideo(null);
                      setMediaStream(null);
                    }}
                    variant="outline"
                    className="w-full h-12 border-gray-600 text-gray-200 hover:bg-gray-700 hover:border-gray-500 transition-all duration-200"
                  >
                    Try Again
                  </Button>
                  <Button className="w-full h-14 font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg transform hover:scale-[1.02] transition-all duration-200" size="lg">
                    Submit for Analysis
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Camera */}
        <div className="w-2/3 flex flex-col bg-black relative">
          {/* Countdown Overlay */}
          {isCountingDown && countdown && (
            <div className="absolute inset-0 bg-black/75 flex items-center justify-center z-10">
              <div className="text-white text-9xl font-bold animate-pulse">
                {countdown}
              </div>
            </div>
          )}

          {/* Camera Area */}
          <div className="flex-1 flex items-center justify-center">
            {recording && (
              <video
                ref={cameraVideoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
              />
            )}

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
        </div>
      </div>
    </div>
  );
}