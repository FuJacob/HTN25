"use client";
import { useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
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
  
  // Tab state
  const [activeTab, setActiveTab] = useState("code");

  // Problem data (would come from API in real app)
  const problemData = {
    id: problemId,
    title: "Two Sum Dance",
    difficulty: "Easy" as const,
    tags: ["Array", "Hash Table", "Dance"]
  };

  // Hardcoded analysis data (will be replaced with API call)
  const analysisData = {
    "response": "{\n  \"dance_analysis\": [\n    {\n      \"timestamp_of_outcome\": \"0:01.0\",\n      \"result\": \"recording\",\n      \"move_type\": \"Clapping\",\n      \"feedback\": \"Your timing is off. Try to match the beat more closely. Hand placement is inconsistent - keep them together and clap at the center. Work on a more focused look in the recording (dancing closer to the camera). Your score is -3 because you are late in timing and technique. You were facing away from the camera at the beginning of the video (make sure you face the camera while dancing). You also did not clap in the recording.. Your overall score is -6 for this move.. Keep practicing and focus on matching each clap to the beat in the reference video. Consider reducing distractions in your recording environment, too, so you can concentrate better on the dance steps. The wrist movement and timing need to be accurate.. Pay close attention to each motion and try to mirror the reference video as precisely as possible. You're doing a great job learning a new dance, so keep improving with consistent practice. Work harder and you'll be able to see the improvement.\"\n    },\n    {\n      \"timestamp_of_outcome\": \"0:03.5\",\n      \"result\": \"recording\",\n      \"move_type\": \"Arm extension and retraction\",\n      \"feedback\": \"The timing does not quite match and looks slow, extend arm in the direction of the beat to add extra appeal. There is also no hand gesture, extend the hand out like the reference to fully perform the gesture (also, practice). Your score is -6 since you seem too slow to match and do not have the proper hand extension. In future recordings, remember to focus on the music and synchronize your movements to the beat. It might also help to record in a quieter place so you can focus more on the choreography. Consider adding some personal style to each dance, while still doing the core steps correctly, it would be great to see your personal touches coming out. This will help enhance the performance when recording.\"\n    },\n    {\n      \"timestamp_of_outcome\": \"0:06.0\",\n      \"result\": \"recording\",\n      \"move_type\": \"Hand wave\",\n      \"feedback\": \"Good initial attempt but the waving and hand movement needs to be more dynamic and expressive.. Follow the reference video to fully grasp the gesture (also, practice). There is also no hand motion so your score is -6 since you seem too slow to match and do not have the proper hand extension. In future recordings, remember to focus on the music and synchronize your movements to the beat. It might also help to record in a quieter place so you can focus more on the choreography. Consider adding some personal style to each dance, while still doing the core steps correctly, it would be great to see your personal touches coming out. This will help enhance the performance when recording. Please attempt to do more expressive motion for the gesture to appear natural and to fully grasp it.\"\n    },\n    {\n      \"timestamp_of_outcome\": \"0:09.0\",\n      \"result\": \"recording\",\n      \"move_type\": \"Hand wave and cover face\",\n      \"feedback\": \"Your timing is off. Try to match the beat more closely. Hand placement is inconsistent. Hand wave also needs to be more dynamic and expressive.. Follow the reference video to fully grasp the gesture (also, practice). There is also no hand motion so your score is -6 since you seem too slow to match and do not have the proper hand extension. In future recordings, remember to focus on the music and synchronize your movements to the beat. It might also help to record in a quieter place so you can focus more on the choreography. Consider adding some personal style to each dance, while still doing the core steps correctly, it would be great to see your personal touches coming out. This will help enhance the performance when recording. Please attempt to do more expressive motion for the gesture to appear natural and to fully grasp it. The wrist movement and timing need to be accurate.. Pay close attention to each motion and try to mirror the reference video as precisely as possible. You're doing a great job learning a new dance, so keep improving with consistent practice. Work harder and you'll be able to see the improvement. You can also ask friends and other instructors for help on improving your gesture as this will add more expressiveness.\"\n    },\n    {\n      \"timestamp_of_outcome\": \"0:10.0\",\n      \"result\": \"recording\",\n      \"move_type\": \"Final Pose\",\n      \"feedback\": \"The final pose appears very serious and intense, try to be more happy! Follow the reference video to fully grasp the gesture (also, practice). There is also no hand motion so your score is -6 since you seem too slow to match and do not have the proper hand extension. In future recordings, remember to focus on the music and synchronize your movements to the beat. It might also help to record in a quieter place so you can focus more on the choreography. Consider adding some personal style to each dance, while still doing the core steps correctly, it would be great to see your personal touches coming out. This will help enhance the performance when recording. Please attempt to do more expressive motion for the gesture to appear natural and to fully grasp it. The wrist movement and timing need to be accurate.. Pay close attention to each motion and try to mirror the reference video as precisely as possible. You're doing a great job learning a new dance, so keep improving with consistent practice. Work harder and you'll be able to see the improvement. Your final pose looks a little unnatural so be aware of the final steps and transition to the ending.\"\n    },\n    {\n      \"timestamp_of_outcome\": \"0:10.0\",\n      \"result\": \"recording\",\n      \"move_type\": \"final_overall_score\",\n      \"feedback\": \"You are very serious during the recording, let loose and try to enjoy the process. This can greatly enhance your steps! The score is -5, please keep practicing and remember to smile for a better result :) ! Also consider using a different area with more space so you can move around, and get other people to help improve your moves (feedback). You are great overall. The gesture and transition could be improved for this dancing session and remember to smile for the camera.\"\n    }\n  ]\n}",
    "parsed_data": {
        "dance_analysis": [
            {
                "timestamp_of_outcome": "0:01.0",
                "result": "recording",
                "move_type": "Clapping",
                "feedback": "Your timing is off. Try to match the beat more closely. Hand placement is inconsistent - keep them together and clap at the center. Work on a more focused look in the recording (dancing closer to the camera). Your score is -3 because you are late in timing and technique. You were facing away from the camera at the beginning of the video (make sure you face the camera while dancing). You also did not clap in the recording.. Your overall score is -6 for this move.. Keep practicing and focus on matching each clap to the beat in the reference video. Consider reducing distractions in your recording environment, too, so you can concentrate better on the dance steps. The wrist movement and timing need to be accurate.. Pay close attention to each motion and try to mirror the reference video as precisely as possible. You're doing a great job learning a new dance, so keep improving with consistent practice. Work harder and you'll be able to see the improvement."
            },
            {
                "timestamp_of_outcome": "0:03.5",
                "result": "recording",
                "move_type": "Arm extension and retraction",
                "feedback": "The timing does not quite match and looks slow, extend arm in the direction of the beat to add extra appeal. There is also no hand gesture, extend the hand out like the reference to fully perform the gesture (also, practice). Your score is -6 since you seem too slow to match and do not have the proper hand extension. In future recordings, remember to focus on the music and synchronize your movements to the beat. It might also help to record in a quieter place so you can focus more on the choreography. Consider adding some personal style to each dance, while still doing the core steps correctly, it would be great to see your personal touches coming out. This will help enhance the performance when recording."
            },
            {
                "timestamp_of_outcome": "0:06.0",
                "result": "recording",
                "move_type": "Hand wave",
                "feedback": "Good initial attempt but the waving and hand movement needs to be more dynamic and expressive.. Follow the reference video to fully grasp the gesture (also, practice). There is also no hand motion so your score is -6 since you seem too slow to match and do not have the proper hand extension. In future recordings, remember to focus on the music and synchronize your movements to the beat. It might also help to record in a quieter place so you can focus more on the choreography. Consider adding some personal style to each dance, while still doing the core steps correctly, it would be great to see your personal touches coming out. This will help enhance the performance when recording. Please attempt to do more expressive motion for the gesture to appear natural and to fully grasp it."
            },
            {
                "timestamp_of_outcome": "0:09.0",
                "result": "recording",
                "move_type": "Hand wave and cover face",
                "feedback": "Your timing is off. Try to match the beat more closely. Hand placement is inconsistent. Hand wave also needs to be more dynamic and expressive.. Follow the reference video to fully grasp the gesture (also, practice). There is also no hand motion so your score is -6 since you seem too slow to match and do not have the proper hand extension. In future recordings, remember to focus on the music and synchronize your movements to the beat. It might also help to record in a quieter place so you can focus more on the choreography. Consider adding some personal style to each dance, while still doing the core steps correctly, it would be great to see your personal touches coming out. This will help enhance the performance when recording. Please attempt to do more expressive motion for the gesture to appear natural and to fully grasp it. The wrist movement and timing need to be accurate.. Pay close attention to each motion and try to mirror the reference video as precisely as possible. You're doing a great job learning a new dance, so keep improving with consistent practice. Work harder and you'll be able to see the improvement. You can also ask friends and other instructors for help on improving your gesture as this will add more expressiveness."
            },
            {
                "timestamp_of_outcome": "0:10.0",
                "result": "recording",
                "move_type": "Final Pose",
                "feedback": "The final pose appears very serious and intense, try to be more happy! Follow the reference video to fully grasp the gesture (also, practice). There is also no hand motion so your score is -6 since you seem too slow to match and do not have the proper hand extension. In future recordings, remember to focus on the music and synchronize your movements to the beat. It might also help to record in a quieter place so you can focus more on the choreography. Consider adding some personal style to each dance, while still doing the core steps correctly, it would be great to see your personal touches coming out. This will help enhance the performance when recording. Please attempt to do more expressive motion for the gesture to appear natural and to fully grasp it. The wrist movement and timing need to be accurate.. Pay close attention to each motion and try to mirror the reference video as precisely as possible. You're doing a great job learning a new dance, so keep improving with consistent practice. Work harder and you'll be able to see the improvement. Your final pose looks a little unnatural so be aware of the final steps and transition to the ending."
            },
            {
                "timestamp_of_outcome": "0:10.0",
                "result": "recording",
                "move_type": "final_overall_score",
                "feedback": "You are very serious during the recording, let loose and try to enjoy the process. This can greatly enhance your steps! The score is -5, please keep practicing and remember to smile for a better result :) ! Also consider using a different area with more space so you can move around, and get other people to help improve your moves (feedback). You are great overall. The gesture and transition could be improved for this dancing session and remember to smile for the camera."
            }
        ]
    }
  };

  const startCountdownAndRecording = async () => {
    try {
      // Switch to recording tab first
      setActiveTab("code");
      
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
    const videoElement = cameraVideoRef.current;
    if (!videoElement) return;

    if (recording && mediaStream) {
      videoElement.srcObject = mediaStream;
    } else if (!recording) {
      videoElement.srcObject = null;
    }
  }, [recording, mediaStream]);

  return (
    <div className="h-full bg-gray-900 text-white overflow-hidden">
      <div className="flex h-full overflow-hidden">
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
                  <Button className="w-full h-12 font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg transform hover:scale-[1.02] transition-all duration-200" size="lg">
                    Submit for Analysis
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Tabs */}
        <div className="w-2/3 flex flex-col bg-black relative min-h-0">
          {/* Always-mounted video element */}
          <video
            ref={cameraVideoRef}
            autoPlay
            muted
            className={`absolute inset-0 w-full h-full object-cover z-0 ${recording && activeTab === 'code' ? 'block' : 'hidden'}`}
          />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full min-h-0">
            {/* Tab Headers */}
            <TabsList className="flex border-b border-gray-700 bg-gray-900 flex-shrink-0 relative z-10">
              <TabsTrigger value="code" className="px-6 py-3 text-white data-[state=active]:border-b-2 data-[state=active]:border-orange-500">
                Recording
              </TabsTrigger>
              <TabsTrigger value="description" className="px-6 py-3 text-white data-[state=active]:border-b-2 data-[state=active]:border-orange-500">
                Analysis
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Recording (camera area) */}
            <TabsContent value="code" className="flex-1 relative min-h-0 overflow-hidden">
              {/* Countdown Overlay */}
              {isCountingDown && countdown && (
                <div className="absolute inset-0 bg-black/75 flex items-center justify-center z-20">
                  <div className="text-white text-9xl font-bold animate-pulse">
                    {countdown}
                  </div>
                </div>
              )}

              {/* Camera Area */}
              <div className="flex-1 flex items-center justify-center min-h-0 relative z-10">
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
            </TabsContent>

            {/* Tab 2: Analysis */}
            <TabsContent value="description" className="flex-1 p-6 overflow-auto text-white min-h-0">
              <div className="space-y-4 h-full overflow-auto">
                {/* Header */}
                <div className="border-b border-gray-700 pb-3 flex-shrink-0">
                  <h2 className="text-xl font-bold text-white mb-1">Dance Analysis</h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-gray-300">Overall Score: -5</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-xs text-gray-300">Duration: 10.0s</span>
                    </div>
                  </div>
                </div>

                {/* Move Analysis List */}
                <div className="space-y-2 flex-1 min-h-0">
                  {analysisData.parsed_data.dance_analysis.map((move, index) => {
                    if (move.move_type === "final_overall_score") return null;
                    
                    const isBlunder = move.feedback.includes("score is -6");
                    const isMistake = move.feedback.includes("score is -3");
                    const isInaccuracy = move.feedback.includes("Good initial attempt");
                    
                    return (
                      <div key={index} className="bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                        <div className="p-3">
                          {/* Move Header */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-mono text-gray-400 bg-gray-900 px-2 py-1 rounded">
                                  {move.timestamp_of_outcome}
                                </span>
                                <span className="text-white font-semibold">{move.move_type}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                {isBlunder && (
                                  <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-xs text-red-400 font-medium">Blunder</span>
                                  </div>
                                )}
                                {isMistake && (
                                  <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    <span className="text-xs text-orange-400 font-medium">Mistake</span>
                                  </div>
                                )}
                                {isInaccuracy && (
                                  <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                    <span className="text-xs text-yellow-400 font-medium">Inaccuracy</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-400">Move {index + 1}</div>
                            </div>
                          </div>

                          {/* Feedback */}
                          <div className="bg-gray-900/50 rounded-md p-2 border-l-4 border-gray-600">
                            <p className="text-gray-200 text-xs leading-relaxed line-clamp-3">
                              {move.feedback}
                            </p>
                          </div>

                          {/* Key Points */}
                          <div className="mt-2 flex flex-wrap gap-1">
                            {move.feedback.includes("timing") && (
                              <Badge variant="destructive" className="text-xs bg-red-900/30 text-red-300 border-red-700">
                                Timing Issue
                              </Badge>
                            )}
                            {move.feedback.includes("hand") && (
                              <Badge variant="secondary" className="text-xs bg-orange-900/30 text-orange-300 border-orange-700">
                                Hand Position
                              </Badge>
                            )}
                            {move.feedback.includes("camera") && (
                              <Badge variant="outline" className="text-xs bg-blue-900/30 text-blue-300 border-blue-700">
                                Camera Angle
                              </Badge>
                            )}
                            {move.feedback.includes("expressive") && (
                              <Badge variant="outline" className="text-xs bg-purple-900/30 text-purple-300 border-purple-700">
                                Expression
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Overall Summary */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-gray-700 p-4 flex-shrink-0">
                  <h3 className="text-base font-semibold text-white mb-3 flex items-center">
                    <span className="text-lg mr-2">📊</span>
                    Overall Performance
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-red-400">-5</div>
                      <div className="text-xs text-gray-400">Final Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-orange-400">5</div>
                      <div className="text-xs text-gray-400">Moves Analyzed</div>
                    </div>
                  </div>
                  <div className="bg-gray-900/50 rounded-md p-3">
                    <p className="text-gray-200 text-xs leading-relaxed line-clamp-2">
                      {analysisData.parsed_data.dance_analysis.find(m => m.move_type === "final_overall_score")?.feedback}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}