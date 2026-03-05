"use client";

import { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { usePinsStore, Pin } from "@/store/pins";

const CATEGORY_STYLES: Record<string, string> = {
  funny: "border-amber-400/40 text-amber-300",
  mystery: "border-purple-400/40 text-purple-300",
  danger: "border-red-400/40 text-red-300",
  legend: "border-blue-400/40 text-blue-300",
  wholesome: "border-emerald-400/40 text-emerald-300",
  other: "border-white/20 text-white/40",
};

const REACTIONS = [
  { key: "fireCount", emoji: "🔥", label: "fire" },
  { key: "laughCount", emoji: "😂", label: "laugh" },
  { key: "heartCount", emoji: "❤️", label: "heart" },
  { key: "skullCount", emoji: "💀", label: "skull" },
  { key: "wowCount", emoji: "😮", label: "wow" },
] as const;

type Comment = {
  id: string;
  createdAt: string;
  text: string;
  authorId: string;
  author: { handle: string; avatarUrl: string | null };
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function PinDetail() {
  const { selectedPin, selectPin, removePin } = usePinsStore();
  const { isSignedIn } = useUser();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/me")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => setCurrentUserId(data?.id ?? null))
      .catch(() => setCurrentUserId(null));
  }, [isSignedIn]);

  // Reset state and load comments when pin changes
  useEffect(() => {
    setDeleteError(null);
    setCommentText("");
    setComments([]);
    if (!selectedPin) return;

    setCommentsLoading(true);
    fetch(`/api/pins/${selectedPin.id}/comments`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setComments(data))
      .catch(() => {})
      .finally(() => setCommentsLoading(false));
  }, [selectedPin?.id]);

  // Scroll to bottom when new comments arrive
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments.length]);

  if (!selectedPin) return null;

  const catStyle = CATEGORY_STYLES[selectedPin.category] ?? CATEGORY_STYLES.other;
  const isAuthor = currentUserId !== null && currentUserId === selectedPin.authorId;

  async function handleDelete() {
    if (!selectedPin) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/pins/${selectedPin.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to delete pin");
      }
      removePin(selectedPin.id);
      selectPin(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setDeleting(false);
    }
  }

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!commentText.trim() || !selectedPin) return;
    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/pins/${selectedPin.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText.trim() }),
      });
      if (!res.ok) return;
      const comment: Comment = await res.json();
      setComments((prev) => [...prev, comment]);
      setCommentText("");
    } catch {
      // silently fail
    } finally {
      setSubmittingComment(false);
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (!selectedPin) return;
    try {
      await fetch(`/api/pins/${selectedPin.id}/comments/${commentId}`, { method: "DELETE" });
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      // silently fail
    }
  }

  return (
    <>
      {/* Backdrop (mobile) */}
      <div
        className="fixed inset-0 z-40 sm:hidden"
        onClick={() => selectPin(null)}
      />

      {/* Panel */}
      <div className="fixed z-40 bottom-0 left-0 right-0 sm:bottom-6 sm:left-auto sm:right-6 sm:w-96 animate-slide-up">
        <div className="rounded-t-2xl sm:rounded-2xl border border-white/[0.08] bg-[#13131a] shadow-2xl shadow-black/60 flex flex-col max-h-[85vh]">
          <div className="p-6 flex flex-col gap-0 overflow-y-auto flex-1">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs ${catStyle}`}>
                    {selectedPin.category}
                  </span>
                  <span className="text-[11px] text-white/25">{timeAgo(selectedPin.createdAt)}</span>
                </div>
                <h3 className="font-display text-xl text-white leading-tight">{selectedPin.title}</h3>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {isAuthor && (
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    title="Delete your pin"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition disabled:opacity-40"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => selectPin(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Author row */}
            <div className="flex items-center gap-2 mb-4">
              {selectedPin.author?.avatarUrl ? (
                <img
                  src={selectedPin.author.avatarUrl}
                  alt={selectedPin.author.handle}
                  className="h-7 w-7 rounded-full object-cover ring-1 ring-white/10"
                />
              ) : (
                <div className="h-7 w-7 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300 text-xs font-bold">
                  {selectedPin.author?.handle?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              <span className="text-sm text-white/50">@{selectedPin.author?.handle ?? "unknown"}</span>
              <span className="text-[11px] text-white/20 font-mono ml-auto">
                {selectedPin.lat.toFixed(4)}, {selectedPin.lng.toFixed(4)}
              </span>
            </div>

            {deleteError && (
              <p className="text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2 mb-4">{deleteError}</p>
            )}

            {/* Reactions */}
            <div className="flex gap-2 flex-wrap mb-5">
              {REACTIONS.map((r) => {
                const count = selectedPin[r.key as keyof Pin] as number;
                return (
                  <button
                    key={r.key}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/[0.06] px-3 py-1.5 text-sm text-white/50 hover:bg-white/10 hover:text-white/80 transition"
                  >
                    {r.emoji}
                    {count > 0 && <span className="text-xs text-white/35">{count}</span>}
                  </button>
                );
              })}
            </div>

            {/* Comments */}
            <div className="border-t border-white/[0.06] pt-4">
              <p className="text-[11px] uppercase tracking-widest text-white/25 mb-3">
                Comments {comments.length > 0 && <span className="normal-case tracking-normal">({comments.length})</span>}
              </p>

              {/* Comment list */}
              <div className="flex flex-col gap-3 max-h-52 overflow-y-auto pr-1 mb-3">
                {commentsLoading ? (
                  <p className="text-xs text-white/25 py-2">Loading...</p>
                ) : comments.length === 0 ? (
                  <p className="text-xs text-white/20 py-2">No comments yet. Be the first!</p>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="flex gap-2.5 group">
                      {/* Avatar */}
                      {c.author.avatarUrl ? (
                        <img
                          src={c.author.avatarUrl}
                          alt={c.author.handle}
                          className="h-6 w-6 rounded-full object-cover ring-1 ring-white/10 flex-shrink-0 mt-0.5"
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300 text-[10px] font-bold flex-shrink-0 mt-0.5">
                          {c.author.handle[0]?.toUpperCase() ?? "?"}
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-1.5 mb-0.5">
                          <span className="text-xs font-semibold text-white/60">@{c.author.handle}</span>
                          <span className="text-[10px] text-white/20">{timeAgo(c.createdAt)}</span>
                          {currentUserId === c.authorId && (
                            <button
                              onClick={() => handleDeleteComment(c.id)}
                              className="ml-auto text-[10px] text-white/20 hover:text-red-400/60 opacity-0 group-hover:opacity-100 transition"
                            >
                              delete
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-white/70 leading-snug break-words">{c.text}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={commentsEndRef} />
              </div>

              {/* Comment input */}
              {isSignedIn ? (
                <form onSubmit={handleSubmitComment} className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value.slice(0, 280))}
                    placeholder="Add a comment..."
                    className="flex-1 min-w-0 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-amber-400/40 focus:ring-1 focus:ring-amber-400/20 transition"
                  />
                  <button
                    type="submit"
                    disabled={submittingComment || !commentText.trim()}
                    className="flex-shrink-0 rounded-xl bg-amber-400/10 border border-amber-400/20 px-3 py-2 text-sm text-amber-300 hover:bg-amber-400/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {submittingComment ? "…" : "Send"}
                  </button>
                </form>
              ) : (
                <p className="text-xs text-white/25 text-center py-1">Sign in to comment</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
