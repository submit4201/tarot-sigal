import sys
import os
from pathlib import Path
from dotenv import load_dotenv

# Add server to path
server_path = Path(__file__).resolve().parent.parent / "server"
sys.path.append(str(server_path))

# Load env from root
env_path = Path(__file__).resolve().parent.parent / ".env.local"
load_dotenv(dotenv_path=env_path)

from core.synthesis_engine import call_llm

print("Testing synthesis_engine.call_llm...")
try:
    # Use the same exact model and structure as the app
    result = call_llm("Return the word 'INTEGRATED'")
    print("-" * 20)
    print(f"Result: {result}")
    print("-" * 20)
    
    if "Error:" in result:
        print("FAIL: Still getting an error.")
    else:
        print("SUCCESS: Function returned valid content.")
except Exception as e:
    print(f"CRITICAL FAIL: {e}")
