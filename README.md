<p align="center">
  <img src="assets/mumzworld-logo.svg" alt="Mumzworld" width="220" />
</p>

<h1 align="center">Returns Intelligence Console</h1>

<p align="center">
AI-powered multilingual returns triage system for ecommerce support teams.
</p>

<p align="center">
Track A Submission — AI Engineering Intern
</p>

> Brand assets used solely for internship prototype demonstration purposes.

---

# Overview

Returns are one of the highest-friction workflows in ecommerce operations.

Customer requests often arrive as messy free-text messages in English or Arabic. Agents must manually interpret the issue, determine the correct policy path, request missing information, and respond quickly.

I built a prototype internal tool that converts unstructured return requests into structured operational decisions.

The system returns:

- Intent classification  
- Recommended resolution  
- Urgency level  
- Confidence score  
- Queue routing  
- Missing information required  
- Suggested reply in English  
- Suggested reply in Arabic

---

# Why This Problem

For Mumzworld, faster and more accurate returns triage can improve:

- Support response times  
- Customer satisfaction  
- Agent productivity  
- Operational consistency  
- Escalation handling

This is a high-frequency workflow with clear business value.

---

# Demo Examples

## Example 1 — Wrong Item / Size

Input:

```text
Ordered size 4 diapers but got size 3.
```

Output:

```text
Intent: Wrong Item Sent
Resolution: Exchange
Urgency: Low
Confidence: 92%
```

## Example 2 — Damaged Product

Input:

```text
Received stroller with broken wheel.
```

Output:

```text
Intent: Damaged Item
Resolution: Refund
Urgency: High
Confidence: 94%
```

## Example 3 — Safety Case

Input:

```text
My baby reacted badly after using this opened diaper pack.
```

Output:

```text
Intent: Product Issue
Resolution: Investigate
Urgency: High
Confidence: 90%
```

---

# Architecture

```text
Next.js Frontend
      ↓
FastAPI Backend
      ↓
Hybrid Decision Engine
 ├── Rules Engine
 └── OpenRouter LLM
      ↓
Structured JSON Response
```

---

# Setup

## Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# OpenRouter Setup

Windows PowerShell:

```powershell
$env:OPENROUTER_API_KEY="your_key_here"
```

---

# Evaluation Summary

- Broken stroller → Refund
- Wrong diaper size → Exchange
- Cancel order → Cancel Order
- Arabic damaged item → Refund
- Safety concern → Investigate

---

# Tradeoffs

Prioritized:
- real business workflow
- reliable outputs
- clean UI
- fast prototype velocity

Deferred:
- CRM integrations
- auth
- analytics
- database persistence

---

# Time Log

- Problem selection: 45 min
- Frontend UI: 90 min
- Backend API: 75 min
- AI integration: 60 min
- Testing + docs: 45 min

Total: ~4 hours
