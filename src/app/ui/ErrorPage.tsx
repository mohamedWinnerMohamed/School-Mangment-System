"use client";
import React from "react";
import { motion } from "framer-motion";

type ErrorPageProps = {
  code?: string | number;
  title?: string;
  message?: string;
  homeLabel?: string;
  homeHref?: string;
};

export default function ErrorPage({
  code ,
  title,
  message,
  homeLabel = "Back to home",
  homeHref = "/",
}: ErrorPageProps) {
  const defaultTitle =
    code === 404
      ? "This is not the web page you are looking for"
      : "This page could not be found";
  const defaultMessage =
    "There was an unexpected problem, please try again later";

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="max-w-4xl w-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg rounded-2xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center"
        aria-live="polite"
        role="region"
      >
        {/* LEFT */}
        <div className="flex-shrink-0 flex items-center justify-center w-full md:w-1/2">
          <div className="text-center">
            <div className="mx-auto w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-tr from-rose-100 to-amber-100 flex items-center justify-center shadow-inner">
              <svg
                width="140"
                height="140"
                viewBox="0 0 140 140"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-hidden
              >
                <rect
                  x="10"
                  y="10"
                  width="120"
                  height="120"
                  rx="20"
                  fill="white"
                />
                <g transform="translate(30,30)">
                  <circle
                    cx="40"
                    cy="40"
                    r="28"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="6"
                  />
                  <path
                    d="M30 30 L50 50"
                    stroke="#EF4444"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M50 30 L30 50"
                    stroke="#EF4444"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </g>
              </svg>
            </div>
            {/* <div className="mt-4 text-4xl font-extrabold text-slate-700">
              {code}
            </div> */}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 w-full md:w-1/2">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            {title ?? defaultTitle}
          </h1>
          <p className="mt-3 text-slate-600 leading-relaxed">
            {message ?? defaultMessage}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href={homeHref}
              className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow-sm ring-1 ring-slate-200 hover:shadow-md transition"
            >
              {homeLabel}
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 transition"
            >
              Contact Support
            </a>
          </div>

          <div className="mt-6 text-xs text-slate-400">
            If the problem persists, please try reloading the page or contact
            our support team(Error Code:
            <span className="font-medium text-slate-600"> {code}</span>).
          </div>
        </div>
      </motion.div>
    </main>
  );
}
