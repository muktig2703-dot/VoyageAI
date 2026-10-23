"use client";

import { useState } from "react";
import {
  MessageCircle,
  PhoneCall,
  X,
  ArrowLeft,
  Send,
  Clock,
  Headphones,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

type SupportView = "menu" | "chat" | "callback";
export default function SupportWidget() {
  const { token } = useAuth();
  const [chatSubmitting, setChatSubmitting] = useState(false);
const [chatError, setChatError] = useState("");
const [conversationId, setConversationId] = useState<string | null>(null);
const [callbackSubmitting, setCallbackSubmitting] = useState(false);
const [callbackRequestId, setCallbackRequestId] = useState("");
const [callbackConsent, setCallbackConsent] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<SupportView>("menu");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
  { role: "user" | "support"; text: string; time: string }[]
>([]);

  const [callbackName, setCallbackName] = useState("");
  const [callbackPhone, setCallbackPhone] = useState("");
  const [callbackTime, setCallbackTime] = useState("Anytime");
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);
  const [callbackError, setCallbackError] = useState("");

  async function sendMessage(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  const trimmed = message.trim();

  if (!trimmed || chatSubmitting) return;

  if (!token) {
    setChatError("Please log in again to use support chat.");
    return;
  }

  setChatSubmitting(true);
  setChatError("");

  try {
    const response = await fetch(`${API_URL}/support-chat/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: trimmed,
        ...(conversationId
          ? { conversation_id: conversationId }
          : {}),
      }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setChatError(
        typeof result?.detail === "string"
          ? result.detail
          : response.status === 401
            ? "Your session may have expired. Please log in again."
            : "The assistant couldn't reply. Please try again."
      );
      return;
    }

    setConversationId(result.conversation_id);

    const userTime = new Date(
      result.created_at
    ).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const assistantTime = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((current) => [
      ...current,
      {
        role: "user",
        text: result.user_message,
        time: userTime,
      },
      {
        role: "support",
        text: result.assistant_reply,
        time: assistantTime,
      },
    ]);

    setMessage("");
  } catch {
    setChatError(
      "Unable to reach VoyageAI. Check your connection and try again."
    );
  } finally {
    setChatSubmitting(false);
  }
}

  
async function submitCallback(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  if (callbackSubmitting) return;

  const normalizedPhone = callbackPhone.replace(/[\s()-]/g, "");

  if (!callbackName.trim()) {
    setCallbackError("Please enter your name.");
    return;
  }

  if (!/^\+?[0-9]{7,15}$/.test(normalizedPhone)) {
    setCallbackError("Enter a valid phone number with 7–15 digits.");
    return;
  }

  if (!callbackConsent) {
    setCallbackError("Please confirm your consent before submitting.");
    return;
  }

  if (!token) {
    setCallbackError("Please log in again to submit your request.");
    return;
  }

  setCallbackError("");
  setCallbackSubmitting(true);

  try {
    const response = await fetch(`${API_URL}/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: callbackName.trim(),
        phone: normalizedPhone,
        preferred_time: callbackTime,
        consent_given: callbackConsent,
      }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const detail = result?.detail;

      setCallbackError(
        typeof detail === "string"
          ? detail
          : response.status === 401
            ? "Your session may have expired. Please log in again."
            : "We couldn't save your request. Please try again."
      );
      return;
    }

    setCallbackRequestId(result.id);
    setCallbackSubmitted(true);
  } catch {
    setCallbackError(
      "Unable to reach VoyageAI. Check your connection and try again."
    );
  } finally {
    setCallbackSubmitting(false);
  }
}

  function changeView(nextView: SupportView) {
    setView(nextView);
    setCallbackSubmitted(false);
  }

  return (
    <div className="fixed bottom-5 right-5 z-[100] font-sans">
      {isOpen && (
        <section className="mb-4 flex max-h-[min(620px,calc(100dvh-110px))] w-[min(370px,calc(100vw-32px))] flex-col overflow-hidden rounded-3xl border border-indigo-100 bg-white shadow-2xl shadow-indigo-950/20">
          <header className="bg-gradient-to-r from-indigo-700 to-purple-700 p-5 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                  <Headphones size={23} />
                </div>
                <div>
                  <h2 className="font-semibold">VoyageAI Support</h2>
                  <p className="mt-1 text-xs text-white/75">
                    We're here to help with your journey
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close support widget"
                className="rounded-xl p-2 transition hover:bg-white/15"
              >
                <X size={19} />
              </button>
            </div>
          </header>
          {view !== "menu" && (
            <button
              type="button"
              onClick={() => changeView("menu")}
              className="flex items-center gap-2 border-b border-indigo-50 px-5 py-3 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
            >
              <ArrowLeft size={16} />
              Back to support options
            </button>
          )}
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            {view === "menu" && (
              <div>
                <p className="text-sm text-slate-600">
                  Hi there! 👋 What can we help you with today?
                </p>
                <button
                  type="button"
                  onClick={() => changeView("chat")}
                  className="mt-5 flex w-full items-center gap-3 rounded-2xl border border-indigo-100 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                    <MessageCircle size={21} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-slate-900">
                      Live Chat
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      Send us a message about your trip.
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => changeView("callback")}
                  className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-indigo-100 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                    <PhoneCall size={21} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold text-slate-900">
                      Get a Call Back
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      Request a call at a convenient time.
                    </span>
                  </span>
                </button>
                <p className="mt-5 text-center text-xs text-slate-400">
                  Callback requests and AI-powered support are available here.
                </p>
              </div>
            )}
            {view === "chat" && (
              <div className="flex min-h-[300px] flex-col">
                <div className="mb-4 rounded-2xl bg-indigo-50 p-3 text-sm leading-6 text-indigo-900">
                  Welcome to VoyageAI! Tell us what you need help with.
                  <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
  <span className="h-2 w-2 rounded-full bg-indigo-500" />
  AI Support Assistant · Powered by VoyageAI
</div>
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  {messages.map((item, index) => (
                    <div
                      key={`${index}-${item.role}`}
                      className={`max-w-[88%] rounded-2xl px-3.5 py-3 text-sm leading-5 ${
                        item.role === "user"
                          ? "ml-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                          : "mr-auto bg-slate-100 text-slate-700"
                      }`}
                    >
                      <span>{item.text}</span>
<span
  className={`mt-1 block text-[10px] ${
    item.role === "user" ? "text-white/70" : "text-slate-400"
  }`}
>
  {item.time}
</span>
                    </div>
                  ))}
                </div>
                              {chatSubmitting && (
                <div className="mt-3 mr-auto max-w-[88%] rounded-2xl bg-slate-100 px-3.5 py-3 text-sm text-slate-600">
                  <span className="animate-pulse">
                    VoyageAI is thinking...
                  </span>
                </div>
              )}

              {chatError && (
                <p
                  role="alert"
                  className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600"
                >
                  {chatError}
                </p>
              )}
                <form onSubmit={sendMessage} className="mt-5 flex gap-2">
                  <input
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Ask VoyageAI..."
                    maxLength={2000}
                    className="min-w-0 flex-1 rounded-xl border border-indigo-100 px-3 py-3 text-sm outline-none focus:border-indigo-400"
                    aria-label="Your message"
                    required
                  />
                  <button
  type="submit"
  aria-label="Send message"
  disabled={chatSubmitting || !message.trim()}
  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
>
                    <Send size={17} />
                  </button>
                </form>

                <p className="mt-2 text-xs leading-5 text-slate-400">
  AI responses may occasionally be inaccurate. Don't share sensitive information.
</p>
              </div>
            )}
            {view === "callback" && (
              callbackSubmitted ? (
                <div className="py-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
                    <Clock size={27} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    Callback request saved!
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
  Your request has been saved successfully. A call has not yet
  been scheduled or assigned to a support representative.
</p>
                  <div className="mt-4 rounded-2xl bg-indigo-50 p-4 text-left">
  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
    Request preview
  </p>
  <p className="mt-2 text-sm font-semibold text-slate-900">
    {callbackName}
  </p>
  <p className="mt-1 text-sm text-slate-600">
    Preferred time: {callbackTime}
  </p>
  <p className="mt-2 text-xs text-slate-500">
  Request ID
</p>
<p className="break-all text-sm font-medium text-slate-700">
  {callbackRequestId}
</p>
</div>
                  <button
                    type="button"
                    onClick={() => {
  setCallbackSubmitted(false);
  setCallbackName("");
  setCallbackPhone("");
  setCallbackTime("Anytime");
  setCallbackError("");
  setCallbackConsent(false);
  setCallbackRequestId("");
}}
                    className="mt-5 rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={submitCallback} className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Request a call back
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Tell us how to reach you and when you'd prefer a call.
                    </p>
                  </div>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                      YOUR NAME
                    </span>
                    <input
                      value={callbackName}
                      onChange={(event) => setCallbackName(event.target.value)}
                      placeholder="Enter your name"
                      maxLength={100}
                      autoComplete="name"
                      required
                      className="w-full rounded-xl border border-indigo-100 px-3.5 py-3 text-sm outline-none focus:border-indigo-400"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                      PHONE NUMBER
                    </span>
                    <input
                      type="tel"
                      value={callbackPhone}
                      onChange={(event) => {
  setCallbackPhone(event.target.value);
  setCallbackError("");
}}
                      placeholder="Enter your phone number"
                      maxLength={20}
                      autoComplete="tel"
                      required
                      className="w-full rounded-xl border border-indigo-100 px-3.5 py-3 text-sm outline-none focus:border-indigo-400"
                    />
                    {callbackError && (
  <p role="alert" className="mt-1.5 text-xs text-red-600">
    {callbackError}
  </p>
)}
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                      PREFERRED TIME
                    </span>
                    <select
                      value={callbackTime}
                      onChange={(event) => setCallbackTime(event.target.value)}
                      className="w-full rounded-xl border border-indigo-100 bg-white px-3.5 py-3 text-sm outline-none focus:border-indigo-400"
                    >
                      <option>Anytime</option>
                      <option>Morning (9 AM – 12 PM)</option>
                      <option>Afternoon (12 PM – 4 PM)</option>
                      <option>Evening (4 PM – 7 PM)</option>
                    </select>
                  </label>
                  <label className="flex items-start gap-2.5 text-xs leading-5 text-slate-600">
  <input
    type="checkbox"
    checked={callbackConsent}
    onChange={(event) => {
      setCallbackConsent(event.target.checked);
      setCallbackError("");
    }}
    required
    className="mt-1 accent-indigo-600"
  />
  <span>
    I consent to VoyageAI using my name and phone number to respond
    to this callback request. I understand that submitting a request
    does not guarantee a scheduled call.
  </span>
</label>
                  
<button
  type="submit"
  disabled={callbackSubmitting}
  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
>
  {callbackSubmitting ? (
    <>
      <span className="animate-spin">⏳</span>
      Saving request...
    </>
  ) : (
    <>
      <PhoneCall size={17} />
      Submit callback request
    </>
  )}
</button>
                  <p className="text-xs leading-5 text-slate-400">
  Your request will be stored securely by VoyageAI. Submitting does
  not guarantee a scheduled callback.
</p>
                </form>
              )
            )}
          </div>
        </section>
      )}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Close support" : "Open VoyageAI support"}
        className="ml-auto flex h-14 items-center gap-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-5 text-white shadow-xl shadow-indigo-900/20 transition hover:-translate-y-0.5 hover:shadow-2xl"
      >
        {isOpen ? <X size={21} /> : <MessageCircle size={21} />}
        <span className="text-sm font-semibold">
          {isOpen ? "Close" : "Need help?"}
        </span>
      </button>
    </div>
  );
}