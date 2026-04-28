# TRADEOFFS

## Why This Problem

Returns triage is frequent, costly, and operationally painful.

## Why Hybrid Architecture

Pure LLM systems are inconsistent for policy decisions.  
Pure rules systems fail on messy natural language.

I combined:

- Rules for deterministic obvious cases
- LLM reasoning for ambiguous cases

## What I Cut

- CRM integrations
- Agent login/auth
- Database persistence
- Analytics dashboard

## What I Would Build Next

- Zendesk integration
- Learning from historical tickets
- Fraud scoring model
- Auto-resolution for low-risk cases