import pytest
import os
import sys
from pathlib import Path

# Add server to path
sys.path.append(str(Path(__file__).resolve().parent.parent / "server"))

from core.logger import setup_logger

# Create a specific logger for tests
test_logger = setup_logger("TestRunner")

@pytest.hookimpl(tryfirst=True)
def pytest_runtest_logstart(nodeid, location):
    test_logger.info(f"STARTING_TEST: {nodeid}")

@pytest.hookimpl(tryfirst=True)
def pytest_runtest_logreport(report):
    if report.when == 'call':
        if report.passed:
            test_logger.info(f"TEST_PASSED: {report.nodeid}")
        elif report.failed:
            test_logger.error(f"TEST_FAILED: {report.nodeid} - {report.longreprtext}")
        elif report.skipped:
            test_logger.warning(f"TEST_SKIPPED: {report.nodeid}")
