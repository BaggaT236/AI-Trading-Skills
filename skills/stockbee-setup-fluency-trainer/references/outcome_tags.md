# Outcome Tags

The trainer classifies each 3-day and 5-day window into a compact outcome tag. These are learning labels, not trading signals.

## STRONG_WINNER

Conditions:

```text
MFE >= 12% OR forward close return >= 8%
AND stop was not hit
```

Interpretation: The setup produced the kind of fast follow-through Stockbee Momentum Burst is designed to find.

## WORKED

Conditions:

```text
MFE >= 6% OR forward close return >= 4%
AND stop was not hit
```

Interpretation: The setup had tradable follow-through, even if it was not exceptional.

## FAILED_STOP

Condition:

```text
Any low in the horizon <= stop_reference
```

Interpretation: The setup would have violated the planned invalidation level. This is the most important failure type for risk discipline.

## FAILED_FADE

Condition:

```text
forward close return <= -2%
AND stop was not recorded as hit
```

Interpretation: The stock faded after triggering. Review for weak close location, wide base, low volume quality, broad-market weakness, or late-stage extension.

## CHOPPY_FAILURE

Condition:

```text
MAE <= -5%
AND forward close return < 2%
AND stop was not recorded as hit
```

Interpretation: The setup may have looked strong but created too much adverse excursion for a short-term swing process.

## NEUTRAL

Condition:

```text
No decisive follow-through or failure
```

Interpretation: These examples are still useful. A neutral cluster can reveal setups that consume attention without enough reward.

## PENDING

Condition:

```text
Not enough future trading bars are available
```

Interpretation: Leave the record in the model book and update it after the 3-day or 5-day window matures.
