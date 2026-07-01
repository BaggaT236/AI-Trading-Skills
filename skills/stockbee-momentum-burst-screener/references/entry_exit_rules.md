# Entry and Exit Rules

## Entry Reference

The default entry reference is the latest close because the script is primarily an end-of-day / near-close screener.

If used intraday with current OHLCV bars, treat the entry reference as an indicative planning price. Manual review should confirm that the breakout is still valid near the intended order time.

## Stop Reference

The default stop reference is the trigger-day low.

```text
risk_per_share = entry_reference - stop_reference
risk_pct_to_stop = risk_per_share / entry_reference * 100
```

Reject candidates where the stop is too far away for the account's risk policy.

## Position Sizing Handoff

Send only validated candidates to `position-sizer`.

```text
position_size = account_risk_dollars / (entry_reference - stop_reference)
```

The screener should not decide final share count. It only provides the fields needed by a position-sizing skill.

## Exit Template

Default template:

- Stop out if the trigger-day low fails
- Review after 3-5 sessions
- Protect gains if the stock advances abnormally fast, especially a 10%+ move in one session
- Treat a full signal reversal or no follow-through after several sessions as a failed burst

## Practical Notes

- A 4% trigger is not enough by itself. Require setup quality and manageable risk.
- Avoid using the screener as a standalone buy list.
- Keep rejected names for model-book review because failures help calibrate pattern recognition.
