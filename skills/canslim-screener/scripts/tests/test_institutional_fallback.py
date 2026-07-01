"""Regression test for institutional 'I' component Finviz fallback.

Without this fix, FMP free-tier users (no /stable institutional-ownership
access, and /api/v3 deprecated since 2025-08-31) get score=0 from the
'I' component for every stock, even when Finviz can supply real data.

The bug had two layers:

1. Early-return on falsy `institutional_holders` skipped the Finviz path.
2. When the holder list was empty but a profile existed, the formula
   `0 / shares_outstanding * 100 = 0.0` produced a non-None ownership_pct
   that blocked the `ownership_pct is None` Finviz gate.

This test exercises both paths with a mocked Finviz client so it doesn't
need network access.
"""

import sys
from pathlib import Path
from unittest.mock import patch

import pytest

# Ensure imports work in the test runner.
HERE = Path(__file__).parent
sys.path.insert(0, str(HERE.parent))
sys.path.insert(0, str(HERE.parent / "calculators"))

from institutional_calculator import calculate_institutional_sponsorship  # noqa: E402


def _fake_finviz(_self, _symbol):
    return {"inst_own_pct": 67.5, "inst_trans_pct": 0.0, "error": None}


def test_finviz_fallback_runs_when_fmp_holders_none():
    """holders=None should not short-circuit to score=0 — Finviz should fill in."""
    profile = {"sharesOutstanding": 15_000_000_000, "mktCap": 3_000_000_000_000, "price": 200.0}
    with (
        patch("institutional_calculator.FINVIZ_AVAILABLE", True),
        patch("finviz_stock_client.FinvizStockClient.get_institutional_ownership", _fake_finviz),
    ):
        result = calculate_institutional_sponsorship(None, profile, symbol="AAPL")
    assert result["score"] > 0, "score should not be 0 — Finviz fallback should fire"
    assert result["ownership_pct"] == 67.5
    assert "Finviz" in (result.get("quality_warning") or "")


def test_finviz_fallback_runs_when_fmp_holders_empty_list():
    """holders=[] (empty list, not None) should also let Finviz fill in."""
    profile = {"sharesOutstanding": 1_000_000_000, "mktCap": 200_000_000_000, "price": 200.0}
    with (
        patch("institutional_calculator.FINVIZ_AVAILABLE", True),
        patch("finviz_stock_client.FinvizStockClient.get_institutional_ownership", _fake_finviz),
    ):
        result = calculate_institutional_sponsorship([], profile, symbol="NVDA")
    assert result["score"] > 0
    assert result["ownership_pct"] == 67.5


@pytest.mark.parametrize("holders", [None, []])
def test_no_finviz_available_preserves_zero_score_for_true_no_data(holders):
    """When FMP and Finviz both have no data, true no-data inputs score 0."""
    profile = {"sharesOutstanding": 1_000_000_000, "mktCap": 200_000_000_000, "price": 200.0}
    with patch("institutional_calculator.FINVIZ_AVAILABLE", False):
        result = calculate_institutional_sponsorship(holders, profile, symbol="AMD")
    assert "score" in result
    assert "num_holders" in result
    assert result["score"] == 0
    # ownership_pct must remain None so callers can detect the gap.
    assert result["ownership_pct"] is None


def test_no_finviz_available_does_not_zero_partial_fmp_aggregate():
    """Valid FMP aggregate holder counts still use reduced holder-count scoring."""
    holders = {"num_holders": 40, "ownership_pct": None, "top_holders": []}
    profile = {"sharesOutstanding": 1_000_000_000, "mktCap": 200_000_000_000, "price": 200.0}
    with patch("institutional_calculator.FINVIZ_AVAILABLE", False):
        result = calculate_institutional_sponsorship(holders, profile, symbol="AMD")
    assert result["score"] == 40
    assert result["ownership_pct"] is None


def test_with_valid_fmp_holders_finviz_not_called():
    """When FMP gives real data, the Finviz path must NOT run (no wasted scraping)."""
    holders = {
        "num_holders": 80,
        "ownership_pct": 65.0,
        "top_holders": [{"holder": "VANGUARD GROUP", "shares": 1_000_000, "change": 0}],
    }
    profile = {"sharesOutstanding": 1_000_000_000}
    finviz_called = {"hit": False}

    def _spy_finviz(_self, _symbol):
        finviz_called["hit"] = True
        return {"inst_own_pct": 99.9, "error": None}

    with (
        patch("institutional_calculator.FINVIZ_AVAILABLE", True),
        patch("finviz_stock_client.FinvizStockClient.get_institutional_ownership", _spy_finviz),
    ):
        result = calculate_institutional_sponsorship(holders, profile, symbol="AAPL")
    assert finviz_called["hit"] is False, "Finviz path must not run when FMP data is present"
    assert result["ownership_pct"] == 65.0
