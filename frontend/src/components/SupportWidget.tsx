
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

type SupportView = "menu" | "chat" | "callback";

export default function SupportWidget() {
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

  function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = message.trim();
    if (!trimmed) return;

    setMessages((current) => [
  ...current,
  {
    role: "user",
    text: trimmed,
    time: new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
]);
    setMessage("");
  }

  function submitCallback(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedPhone = callbackPhone.replace(/[\s()-]/g, "");

if (!/^\+?[0-9]{7,15}$/.test(normalizedPhone)) {
  setCallbackError("Enter a valid phone number with 7–15 digits.");
  return;
}

setCallbackError("");
setCallbackSubmitted(true);
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
                  Support requests aren't sent yet. Service connection coming soon.
                </p>
              </div>
            )}

            {view === "chat" && (
              <div className="flex min-h-[300px] flex-col">
                <div className="mb-4 rounded-2xl bg-indigo-50 p-3 text-sm leading-6 text-indigo-900">
                  Welcome to VoyageAI! Tell us what you need help with.
                  <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
  <span className="h-2 w-2 rounded-full bg-amber-400" />
  Demo chat · No live agent connected
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

                <form onSubmit={sendMessage} className="mt-5 flex gap-2">
                  <input
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Type your message..."
                    maxLength={1000}
                    className="min-w-0 flex-1 rounded-xl border border-indigo-100 px-3 py-3 text-sm outline-none focus:border-indigo-400"
                    aria-label="Your message"
                    required
                  />
                  <button
                    type="submit"
                    aria-label="Send message"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white transition hover:opacity-90"
                  >
                    <Send size={17} />
                  </button>
                </form>

                <p className="mt-2 text-xs text-slate-400">
                  Demo mode — messages stay in this widget.
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
                    Request preview ready!
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    The form worked, but no call has been scheduled because
                    callback services aren't connected yet.
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
  <p className="mt-1 text-sm text-slate-600">
    Phone: {callbackPhone}
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

                  <button
                    type="submit"
                    disabled={callbackSubmitted}            
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <PhoneCall size={17} />
                    Preview callback request
                  </button>

                  <p className="text-xs leading-5 text-slate-400">
                    Demo only. Your details aren't sent or stored.
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