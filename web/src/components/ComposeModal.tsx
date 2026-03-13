"use client";

import { useRef, useState } from "react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");

  if (!composeOpen || !pendingCoords) return null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setUploadState("idle");
  }

  function removeImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    setUploadState("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function getImageDimensions(src: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve({ width: 0, height: 0 });
      img.src = src;
    });
  }

  async function uploadImage(pinId: string): Promise<{ id: string; s3Key: string; state: string }> {
    if (!imageFile || !imagePreview) throw new Error("No image");
    setUploadState("uploading");

    // Step 1: Get presigned URL
    const presignRes = await fetch("/api/media/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pinId,
        mimeType: imageFile.type,
        filename: imageFile.name,
      }),
    });

    if (!presignRes.ok) {
      const data = await presignRes.json().catch(() => ({}));
      throw new Error(data.error ?? "Failed to get upload URL");
    }

    const { mediaId, uploadUrl, key } = await presignRes.json();

    // Step 2: PUT directly to S3 (file bytes never go through our server)
    const putRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": imageFile.type },
      body: imageFile,
    });

    if (!putRes.ok) {
      throw new Error("Failed to upload image to storage");
    }

    // Step 3: Mark complete with dimensions
    const dimensions = await getImageDimensions(imagePreview);
    await fetch(`/api/media/${mediaId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dimensions),
    });

    setUploadState("done");
    return { id: mediaId, s3Key: key, state: "ready" };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !pendingCoords) return;
    setLoading(true);
    setError(null);
    try {
      // Step 1: Create the pin
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

      // Step 2: Upload image if selected (failure is non-blocking — pin is already created)
      if (imageFile) {
        try {
          const media = await uploadImage(pin.id);
          // Update the store pin so PinDetail can show the image immediately
          updatePin(pin.id, { media: [media] });
        } catch (imgErr) {
          console.error("Image upload failed (pin still created):", imgErr);
          setUploadState("error");
        }
      }

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
            <label className="text-[11px] uppercase tracking-widest text-white/35 mb-2 block">
              Photo <span className="text-white/20 normal-case tracking-normal">(optional)</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />

            {!imagePreview ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/30 hover:border-white/20 hover:text-white/50 hover:bg-white/[0.04] transition w-full"
              >
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                  <path fillRule="evenodd" d="M1 8a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 8.07 3h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 16.07 6H17a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8Zm13.5 3a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM10 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                </svg>
                <span>Add a photo</span>
              </button>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-white/10 bg-black/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-40 object-cover"
                />
                {uploadState === "uploading" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Uploading…
                    </div>
                  </div>
                )}
                {uploadState === "done" && (
                  <div className="absolute top-2 right-2 bg-emerald-500/80 rounded-full p-1">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white/60 hover:text-white hover:bg-black/80 transition"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 rounded-lg bg-black/60 px-2 py-1 text-[11px] text-white/60 hover:text-white hover:bg-black/80 transition"
                >
                  Change
                </button>
              </div>
            )}
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
              {loading ? "Dropping..." : "Drop it"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
