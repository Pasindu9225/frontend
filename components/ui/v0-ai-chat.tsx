"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowUpIcon } from "lucide-react";
import { ImageCard } from "../imagecard";

type ChatMessage = {
  role: "user" | "bot";
  content: string;
  type?: "text" | "image";
};

interface UseAutoResizeTextareaProps {
  minHeight: number;
  maxHeight?: number;
}

function useAutoResizeTextarea({
  minHeight,
  maxHeight,
}: UseAutoResizeTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${minHeight}px`;
    }
  }, [minHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}

export function VercelV0Chat() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    const prompt = value.trim();
    if (!prompt) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: prompt,
      type: "text",
    };
    setMessages((prev) => [...prev, userMessage]);
    setValue("");
    adjustHeight(true);

    try {
      const res = await fetch("http://localhost:5000/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error("Image generation failed.");
      }

      const data = await res.json();
      console.log(data);

      const botMessage: ChatMessage = {
        role: "bot",
        content: data.imageUrl,
        type: "image",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        role: "bot",
        content: "⚠️ Error generating image.",
        type: "text",
      };
      console.log(error);
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen w-full max-w-4xl mx-auto">
      {messages.length === 0 && (
        <div className="text-4xl font-bold text-center mt-10 text-black dark:text-white py-10">
          What&apos;s on your mind?
        </div>
      )}

      <div className="flex-1 overflow-y-scroll px-4 py-2 space-y-3 chat-area">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              "px-4 py-2 rounded-lg max-w-[75%] whitespace-pre-wrap",
              msg.role === "user"
                ? "self-end bg-[rgba(55,65,81,0.4)] text-white ml-auto"
                : "self-start text-black"
            )}
          >
            {msg.type === "image" ? (
              msg.content ? (
                <ImageCard src={msg.content} />
              ) : (
                <div className="text-center text-red-500">
                  Image generation failed.
                </div>
              )
            ) : (
              msg.content
            )}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="w-full bg-transparent rounded-4 border-t mb-9 border-neutral-800 px-4 py-3">
        <div className="relative rounded-xl border border-neutral-800">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              adjustHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type your image prompt..."
            className={cn(
              "w-full px-4 py-3 resize-none bg-neutral-800 border-none text-white text-sm",
              "focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-neutral-500 placeholder:text-sm min-h-[60px]"
            )}
            style={{ overflow: "hidden" }}
          />

          <div className="absolute bottom-2 right-3">
            <button
              type="button"
              onClick={handleSend}
              className={cn(
                "px-2 py-2 rounded-lg text-sm transition-colors border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 flex items-center",
                value.trim() ? "bg-white text-black" : "text-zinc-400"
              )}
            >
              <ArrowUpIcon
                className={cn(
                  "w-4 h-4",
                  value.trim() ? "text-black" : "text-zinc-400"
                )}
              />
              <span className="sr-only">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
