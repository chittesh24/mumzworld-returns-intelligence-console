"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type ResultType = {
  language: string;
  intent: string;
  resolution: string;
  eligibility: string;
  urgency: string;
  confidence: number;
  fraudRisk: string;
  queue: string;
  requiredInputs: string[];
  replyEn: string;
  replyAr: string;
};

const brand = {
  navy: "#16006d",
  pink: "#ff0a78",
  bg: "#f7f7fb",
  border: "#e8e8f0",
  text: "#151515",
};

const demoCases = [
  {
    title: "Damaged stroller",
    text: "Received stroller with broken wheel",
    category: "Strollers",
  },
  {
    title: "Wrong diaper size",
    text: "Ordered size 4 diapers but got size 3",
    category: "Diapers",
  },
  {
    title: "Arabic case",
    text: "وصلني المنتج مكسور وأريد استرجاع المبلغ",
    category: "General",
  },
];

export default function Page() {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("General");
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<ResultType>({
    language: "English",
    intent: "Awaiting Analysis",
    resolution: "—",
    eligibility: "—",
    urgency: "—",
    confidence: 0,
    fraudRisk: "—",
    queue: "—",
    requiredInputs: [],
    replyEn: "Run an analysis to generate an agent response.",
    replyAr: "قم بإجراء تحليل لإنشاء رد.",
  });

  const confidencePct = useMemo(
    () => Math.round(result.confidence * 100),
    [result]
  );

  const confidenceColor =
    confidencePct >= 85
      ? "#16a34a"
      : confidencePct >= 65
      ? "#f59e0b"
      : "#ef4444";

  async function analyze() {
    if (!message.trim()) return;

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          category,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: brand.bg, color: brand.text }}
    >
      {/* Top Bar */}
      <div
        className="px-6 py-2 text-center text-sm font-medium text-white"
        style={{ backgroundColor: brand.navy }}
      >
        Internal Operations Tool • Returns Intelligence Console
      </div>

      {/* Header */}
      <header
        className="border-b bg-white"
        style={{ borderColor: brand.border }}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-5">
          <Image
            src="/mumzworld-logo.svg"
            alt="Mumzworld"
            width={170}
            height={42}
            priority
          />

          <div className="hidden md:flex flex-1">
            <input
              placeholder="Search orders, IDs, cases..."
              className="h-11 w-full rounded-full border px-5 outline-none"
              style={{ borderColor: brand.border }}
            />
          </div>

          <button
            className="rounded-xl px-5 py-3 font-medium text-white transition"
            style={{ backgroundColor: brand.pink }}
          >
            New Case
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-3">
          {[
            "Dashboard",
            "Returns Queue",
            "Manual Review",
            "Agents",
            "Analytics",
            "Policies",
          ].map((item, idx) => (
            <div
              key={item}
              className="rounded-2xl px-4 py-3 text-sm font-medium"
              style={{
                backgroundColor: idx === 1 ? "white" : "transparent",
                border:
                  idx === 1
                    ? `1px solid ${brand.border}`
                    : "1px solid transparent",
                color: idx === 1 ? brand.navy : "#555",
              }}
            >
              {item}
            </div>
          ))}
        </aside>

        {/* Content */}
        <div className="space-y-6">
          {/* KPI */}
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard label="Auto Resolution Rate" value="68%" />
            <StatCard label="Avg Triage Time" value="42 sec" />
            <StatCard label="Manual Review" value="11%" />
            <StatCard label="CSAT Lift" value="+14%" />
          </div>

          {/* Input + Summary */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Input */}
            <div className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-sm">
              <h2
                className="text-xl font-semibold"
                style={{ color: brand.navy }}
              >
                Analyze Return Request
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Paste customer message in English or Arabic.
              </p>

              <textarea
                rows={8}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Customer message..."
                className="mt-5 w-full rounded-2xl border p-4 outline-none"
                style={{ borderColor: brand.border }}
              />

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-xl border p-3"
                  style={{ borderColor: brand.border }}
                >
                  <option>General</option>
                  <option>Strollers</option>
                  <option>Diapers</option>
                  <option>Furniture</option>
                  <option>Feeding</option>
                </select>

                <button
                  onClick={analyze}
                  disabled={loading}
                  className="rounded-xl px-4 py-3 font-medium text-white"
                  style={{ backgroundColor: brand.pink }}
                >
                  {loading ? "Analyzing..." : "Analyze Case"}
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {demoCases.map((item) => (
                  <button
                    key={item.title}
                    onClick={() => {
                      setMessage(item.text);
                      setCategory(item.category);
                    }}
                    className="rounded-full border px-4 py-2 text-sm"
                    style={{ borderColor: brand.border }}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3
                className="text-lg font-semibold"
                style={{ color: brand.navy }}
              >
                Decision Summary
              </h3>

              <Badge label="Resolution" value={result.resolution} />
              <Badge label="Urgency" value={result.urgency} />
              <Badge label="Risk" value={result.fraudRisk} />

              <div className="mt-6">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Confidence
                </p>

                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${confidencePct}%`,
                      backgroundColor: confidenceColor,
                    }}
                  />
                </div>

                <p className="mt-2 text-sm font-semibold">
                  {confidencePct}%
                </p>
              </div>
            </div>
          </div>

          {/* Output Cards */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Operational Output">
              <Row label="Language" value={result.language} />
              <Row label="Intent" value={result.intent} />
              <Row label="Eligibility" value={result.eligibility} />
              <Row label="Queue" value={result.queue} />
            </Card>

            <Card title="Required Inputs">
              <ul className="space-y-2 text-sm">
                {result.requiredInputs.length ? (
                  result.requiredInputs.map((item) => (
                    <li
                      key={item}
                      className="rounded-xl bg-slate-50 px-4 py-3"
                    >
                      {item}
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400">No inputs required.</li>
                )}
              </ul>
            </Card>

            <Card title="Suggested Reply (EN)">
              <p className="text-sm leading-7 text-slate-600">
                {result.replyEn}
              </p>
            </Card>

            <Card title="Suggested Reply (AR)">
              <p
                dir="rtl"
                className="text-sm leading-8 text-slate-600"
              >
                {result.replyAr}
              </p>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

function Badge({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="mt-5">
      <p className="text-xs uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <div className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium">
        {value}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between border-b py-3 text-sm last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="max-w-[60%] text-right">{value}</span>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}