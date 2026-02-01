"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Play, Link as LinkIcon, Loader2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MatchEvidence } from "@/lib/api";

interface EvidenceSectionProps {
  evidence: MatchEvidence[];
  currentUserId: number;
  onUpload: (file: File, type: "image" | "video", description?: string) => Promise<void>;
  onAddVideoLink: (url: string, description?: string) => Promise<void>;
  onDelete: (evidenceId: number) => Promise<void>;
  isLoading?: boolean;
}

type UploadMode = "image" | "video_link" | null;

export function EvidenceSection({
  evidence,
  currentUserId,
  onUpload,
  onAddVideoLink,
  onDelete,
  isLoading = false,
}: EvidenceSectionProps) {
  const [uploadMode, setUploadMode] = useState<UploadMode>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilePreview, setSelectedFilePreview] = useState<string | null>(null);
  const [videoLinkUrl, setVideoLinkUrl] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB max for images)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image size must be less than 10MB");
      return;
    }

    // Validate file type - images only
    if (!file.type.startsWith("image/")) {
      setUploadError("Only image files are allowed. Use video link for videos.");
      return;
    }

    setSelectedFile(file);
    setSelectedFilePreview(URL.createObjectURL(file));
    setUploadError(null);
  };

  const handleUploadImage = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      await onUpload(selectedFile, "image", description || undefined);
      resetForm();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddVideoLink = async () => {
    if (!videoLinkUrl.trim()) {
      setUploadError("Please enter a video URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(videoLinkUrl);
    } catch {
      setUploadError("Please enter a valid URL");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      await onAddVideoLink(videoLinkUrl.trim(), description || undefined);
      resetForm();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Failed to add video link");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setUploadMode(null);
    setSelectedFile(null);
    setSelectedFilePreview(null);
    setDescription("");
    setVideoLinkUrl("");
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isVideoUrl = (url: string) => {
    const videoHosts = ["youtube.com", "youtu.be", "vimeo.com", "tiktok.com", "twitter.com", "x.com"];
    try {
      const urlObj = new URL(url);
      return videoHosts.some(host => urlObj.hostname.includes(host));
    } catch {
      return false;
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border/50 p-4">
      <h3 className="text-sm font-semibold mb-4">Evidence</h3>

      {/* Upload section */}
      <div className="mb-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading || isLoading}
        />

        {!uploadMode ? (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setUploadMode("image");
                fileInputRef.current?.click();
              }}
              disabled={isUploading || isLoading}
              className={cn(
                "flex-1 py-4 rounded-lg border-2 border-dashed border-border",
                "flex flex-col items-center justify-center gap-2",
                "text-muted-foreground hover:text-foreground hover:border-primary/50",
                "transition-colors disabled:opacity-50"
              )}
            >
              <ImageIcon className="h-5 w-5" />
              <span className="text-xs">Upload Image</span>
            </button>
            <button
              onClick={() => setUploadMode("video_link")}
              disabled={isUploading || isLoading}
              className={cn(
                "flex-1 py-4 rounded-lg border-2 border-dashed border-border",
                "flex flex-col items-center justify-center gap-2",
                "text-muted-foreground hover:text-foreground hover:border-primary/50",
                "transition-colors disabled:opacity-50"
              )}
            >
              <LinkIcon className="h-5 w-5" />
              <span className="text-xs">Add Video Link</span>
            </button>
          </div>
        ) : uploadMode === "image" && selectedFile ? (
          <div className="space-y-3">
            {/* Image Preview */}
            <div className="relative rounded-lg overflow-hidden bg-muted">
              <Image
                src={selectedFilePreview!}
                alt="Preview"
                width={300}
                height={200}
                className="w-full h-40 object-cover"
              />
              <button
                onClick={resetForm}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Description */}
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)"
              className={cn(
                "w-full px-3 py-2 rounded-lg border border-border bg-background",
                "text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              )}
              disabled={isUploading}
            />

            {/* Upload button */}
            <button
              onClick={handleUploadImage}
              disabled={isUploading}
              className={cn(
                "w-full py-2 rounded-lg font-medium text-sm",
                "bg-primary text-primary-foreground",
                "disabled:opacity-50 flex items-center justify-center gap-2"
              )}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Image
                </>
              )}
            </button>
          </div>
        ) : uploadMode === "video_link" ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">Add Video Link</span>
              <button
                onClick={resetForm}
                className="ml-auto text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Video URL input */}
            <input
              type="url"
              value={videoLinkUrl}
              onChange={(e) => setVideoLinkUrl(e.target.value)}
              placeholder="Paste YouTube, TikTok, or video URL"
              className={cn(
                "w-full px-3 py-2 rounded-lg border border-border bg-background",
                "text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              )}
              disabled={isUploading}
            />

            {/* Description */}
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)"
              className={cn(
                "w-full px-3 py-2 rounded-lg border border-border bg-background",
                "text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              )}
              disabled={isUploading}
            />

            {/* Add link button */}
            <button
              onClick={handleAddVideoLink}
              disabled={isUploading || !videoLinkUrl.trim()}
              className={cn(
                "w-full py-2 rounded-lg font-medium text-sm",
                "bg-primary text-primary-foreground",
                "disabled:opacity-50 flex items-center justify-center gap-2"
              )}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <LinkIcon className="h-4 w-4" />
                  Add Video Link
                </>
              )}
            </button>
          </div>
        ) : (
          // Fallback - show buttons if mode is set but no file selected
          <div className="flex gap-2">
            <button
              onClick={() => {
                setUploadMode("image");
                fileInputRef.current?.click();
              }}
              disabled={isUploading || isLoading}
              className={cn(
                "flex-1 py-4 rounded-lg border-2 border-dashed border-border",
                "flex flex-col items-center justify-center gap-2",
                "text-muted-foreground hover:text-foreground hover:border-primary/50",
                "transition-colors disabled:opacity-50"
              )}
            >
              <ImageIcon className="h-5 w-5" />
              <span className="text-xs">Upload Image</span>
            </button>
            <button
              onClick={() => setUploadMode("video_link")}
              disabled={isUploading || isLoading}
              className={cn(
                "flex-1 py-4 rounded-lg border-2 border-dashed border-border",
                "flex flex-col items-center justify-center gap-2",
                "text-muted-foreground hover:text-foreground hover:border-primary/50",
                "transition-colors disabled:opacity-50"
              )}
            >
              <LinkIcon className="h-5 w-5" />
              <span className="text-xs">Add Video Link</span>
            </button>
          </div>
        )}

        {uploadError && (
          <p className="text-sm text-red-500 mt-2">{uploadError}</p>
        )}
      </div>

      {/* Evidence gallery */}
      {evidence.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {evidence.map((item) => (
            <div
              key={item.id}
              className="relative rounded-lg overflow-hidden bg-muted group"
            >
              {item.type === "video" || isVideoUrl(item.url) ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-video flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors"
                >
                  <Play className="h-8 w-8 text-primary drop-shadow-lg" />
                </a>
              ) : (
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={item.url}
                    alt={item.description || "Evidence"}
                    width={200}
                    height={150}
                    className="aspect-video object-cover"
                  />
                </a>
              )}

              {/* Delete button for own evidence */}
              {item.uploaded_by.id === currentUserId && (
                <button
                  onClick={() => onDelete(item.id)}
                  disabled={isLoading}
                  className={cn(
                    "absolute top-1 right-1 w-6 h-6 rounded-full",
                    "bg-red-500 text-white flex items-center justify-center",
                    "opacity-0 group-hover:opacity-100 transition-opacity",
                    "disabled:opacity-50"
                  )}
                >
                  <X className="h-3 w-3" />
                </button>
              )}

              {/* Info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-[10px] text-white truncate">
                  {item.uploaded_by.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          No evidence uploaded yet
        </p>
      )}
    </div>
  );
}
