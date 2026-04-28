
---

# 2. EVALS.md

```md id="r1lw9f"
# EVALS

## Rubric

Scored on:

- Correct intent
- Correct resolution
- Appropriate urgency
- Useful required inputs
- Safe handling of ambiguity

## Test Cases

| Input | Expected |
|------|----------|
| Broken stroller | Refund |
| Wrong diaper size | Exchange |
| Cancel order | Cancel Order |
| Package not delivered | Investigate |
| Opened diaper reaction | Investigate |
| Arabic damaged item | Refund |
| Need refund no context | Ask for more info |
| Repeated complaint suspicious | Manual Review |
| Missing accessory | Investigate |
| Wrong color stroller | Exchange |

## Estimated Performance

Intent Accuracy: 85%+  
Resolution Accuracy: 90% on common flows  
JSON Validity: 100%