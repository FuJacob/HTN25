"use client";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/shadcn-components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shadcn-components/ui/card";
import { Label } from "@/shadcn-components/ui/label";
import { Input } from "@/shadcn-components/ui/input";

export default function Home() {
  const [video1, setVideo1] = useState<File | null>(null);
  const [video2, setVideo2] = useState<File | null>(null);
  const [preview1, setPreview1] = useState<string | null>(null);
  const [preview2, setPreview2] = useState<string | null>(null);
  const inputRef1 = useRef<HTMLInputElement>(null);
  const [recording, setRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setVideo: (file: File | null) => void,
    setPreview: (url: string | null) => void
  ) => {
    const file = e.target.files?.[0] || null;
    setVideo(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!video1 || !video2) {
      alert("Please upload both videos.");
      return;
    }

    const formData = new FormData();
    formData.append("video1", video1);
    formData.append("video2", video2);

    try {
      const response = await fetch("http://localhost:8000/upload-and-analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      alert("Upload successful! Result: " + JSON.stringify(result));
    } catch (err: any) {
      alert("Error uploading videos: " + err.message);
    }
  };

  // --- Video Recording Logic for Video 2 ---
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMediaStream(stream);
      recordedChunksRef.current = [];
      const mediaRecorder = new window.MediaRecorder(stream);
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
        const file = new File([blob], "recorded-video.webm", {
          type: "video/webm",
        });
        setVideo2(file);
        setPreview2(URL.createObjectURL(blob));
        if (mediaStream) {
          mediaStream.getTracks().forEach((track) => track.stop());
          setMediaStream(null);
        }
      };
      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      alert("Could not access camera: " + err);
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

  // Set video.srcObject directly when recording
  useEffect(() => {
    if (recording && videoPreviewRef.current && mediaStream) {
      (videoPreviewRef.current as any).srcObject = mediaStream;
    }
    // Clean up srcObject when not recording
    if (!recording && videoPreviewRef.current) {
      (videoPreviewRef.current as any).srcObject = null;
    }
  }, [recording, mediaStream]);

  return (
    <div className="max-w-lg mx-auto mt-8 p-8">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-slate-800">
            Upload Two Dance Videos
          </CardTitle>
          <CardDescription>
            Upload one video and record another to compare dance moves
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Video 1 Upload Section */}
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="p-4">
                <Label
                  htmlFor="video1"
                  className="text-sm font-medium text-slate-700 mb-2 block"
                >
                  Video 1:
                </Label>
                <Input
                  id="video1"
                  type="file"
                  accept="video/*"
                  ref={inputRef1}
                  onChange={(e) => handleFileChange(e, setVideo1, setPreview1)}
                  className="mb-3"
                />
                {preview1 && (
                  <video
                    src={preview1}
                    controls
                    className="w-full max-w-xs rounded-lg border border-slate-200 bg-white shadow-sm"
                  />
                )}
              </CardContent>
            </Card>

            {/* Video 2 Recording Section */}
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="p-4">
                <Label className="text-sm font-medium text-slate-700 mb-3 block">
                  Video 2 (Record):
                </Label>

                {!preview2 && !recording && (
                  <Button
                    type="button"
                    onClick={handleStartRecording}
                    className="bg-green-600 hover:bg-green-700 text-white mb-3"
                  >
                    Start Recording
                  </Button>
                )}

                {recording && (
                  <div className="mb-3">
                    <video
                      ref={videoPreviewRef}
                      autoPlay
                      muted
                      className="w-full max-w-xs rounded-lg border border-slate-200 bg-white shadow-sm mb-3"
                    />
                    <Button
                      type="button"
                      onClick={handleStopRecording}
                      variant="destructive"
                    >
                      Stop Recording
                    </Button>
                  </div>
                )}

                {preview2 && !recording && (
                  <video
                    src={preview2}
                    controls
                    className="w-full max-w-xs rounded-lg border border-slate-200 bg-white shadow-sm"
                  />
                )}
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={!video1 || !video2}
              className="w-full text-lg py-3"
            >
              Upload Videos
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
