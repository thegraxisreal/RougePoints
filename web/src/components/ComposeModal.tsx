"use client";

import { useState, useRef } from "react";
import { usePinsStore } from "@/store/pins";

const CATEGORIES = [
  { id: "funny", label: "Funny", color: "border-amber-400/50 text-amber-300 bg-amber-400/10" },
  { id: "mystery", label: "Mystery", color: "border-purple-400/50 text-purple-300 bg-purple-400/10" },
  { id: "danger", label: "Danger", color: "border-red-400/50 text-red-300 bg-red-400/10" },
  { id: "legend", label: "Legend", color: "border-blue-400/50 text-blue-300 bg-blue-400/10" },
  { id: "wholesome", label: "Wholesome", color: "border-emerald-400/50 text-emerald-300 bg-emerald-400/10" },
  { id: "other", label: "Other", color: "border-white/20 text-white/50 bg-white/5" },
] as const;

type UploadState = "idle" | "uploading" | "done" | "error";

export function ComposeModal() {
  const { composeOpen, pendingCoords, closeCompose, addPin, updatePin } = usePinsStore();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("funny");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!composeOpen || !pendingCoords) return null;

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setUploadState("idle");
  }

  function removeImage() {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setUploadState("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function uploadImage(pinId: string, file: File) {
    setUploadState("uploading");
    try {
      // 1. Get presigned URL
      const presignRes = await fetch("/api/media/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pinId,
          mimeType: file.type,
          filename: file.name,
        }),
      });
      if (!presignRes.ok) throw new Error("Failed to get upload URL");
      const { mediaId, uploadUrl } = await presignRes.json();

      // 2. Upload to S3
      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!putRes.ok) throw new Error("Failed to upload image");

      // 3. Get image dimensions
      const dims = await getImageDimensions(file);

      // 4. Mark complete
      const completeRes = await fetch(`/api/media/${mediaId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dims),
      });
      if (!completeRes.ok) throw new Error("Failed to finalize upload");

      // 5. Refresh pin data in the store so media shows on map/detail
      const pinRes = await fetch(`/api/pins/${pinId}`);
      if (pinRes.ok) {
        const freshPin = await pinRes.json();
        updatePin(pinId, freshPin);
      }

      setUploadState("done");
    } catch {
      setUploadState("error");
      // Don't block — pin was already created
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !pendingCoords) return;
    setLoading(true);
    setError(null);
    try {
      // 1. Create the pin
      const res = await fetch("/api/pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: pendingCoords.lat,
          lng: pendingCoords.lng,
          title: title.trim(),
          category,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to drop pin");
      }
      const pin = await res.json();
      addPin(pin);

      // 2. Upload image if selected (non-blocking on failure)
      if (imageFile) {
        await uploadImage(pin.id, imageFile);
      }

      // 3. Reset and close
      setTitle("");
      setCategory("funny");
      removeImage();
      closeCompose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeCompose}
      />

      {/* Modal card */}
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#13131a] shadow-2xl shadow-black/60 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-xl text-white">Drop a Story</h2>
            <p className="text-xs text-white/35 mt-0.5 font-mono">
              {pendingCoords.lat.toFixed(5)}, {pendingCoords.lng.toFixed(5)}
            </p>
          </div>
          <button
            onClick={closeCompose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Image picker */}
          <div>
            <label className="text-[11px] uppercase tracking-widest text-white/35 mb-2 block">Photo</label>
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-24 w-24 rounded-xl object-cover border border-white/10"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#13131a] border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                  </svg>
                </button>
                {uploadState === "uploading" && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50">
                    <div className="h-5 w-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {uploadState === "error" && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50">
                    <span className="text-xs text-red-400">Failed</span>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-24 w-24 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-white/25 hover:border-white/20 hover:text-white/40 hover:bg-white/[0.04] transition"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
                </svg>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {/* Category pills */}
          <div>
            <label className="text-[11px] uppercase tracking-widest text-white/35 mb-2 block">Vibe</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    category === cat.id
                      ? cat.color
                      : "border-white/10 text-white/30 hover:border-white/20 hover:text-white/50"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-[11px] uppercase tracking-widest text-white/35 mb-2 block">
              Title <span className="text-white/20 normal-case tracking-normal">(max 60)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 60))}
              placeholder="The night everything went wrong..."
              maxLength={60}
              required
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20 transition"
            />
            <div className="text-right text-[10px] text-white/20 mt-1">{title.length}/60</div>
          </div>

{error && (
            <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={closeCompose}
              className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/50 hover:text-white hover:border-white/20 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="flex-1 rounded-xl bg-amber-400 py-2.5 text-sm font-semibold text-black hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {loading ? (uploadState === "uploading" ? "Uploading..." : "Dropping...") : "Drop it"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/** Read image dimensions from a File */
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
}
