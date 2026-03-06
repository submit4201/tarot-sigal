import asyncio
import aiohttp
import os

async def test_endpoint(name, url, headers=None):
    print(f"Testing {name}: {url}...")
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=headers, timeout=aiohttp.ClientTimeout(total=15)) as resp:
                print(f"  Result: {resp.status}")
                if resp.status == 200:
                    content_type = resp.headers.get("Content-Type", "")
                    print(f"  Content-Type: {content_type}")
                    if "image" in content_type:
                        print(f"  ✅ SUCCESS: Got image from {name}")
                else:
                    text = await resp.text()
                    print(f"  ❌ FAILURE: {text[:100]}")
    except Exception as e:
        print(f"  ❌ ERROR: {e}")

async def main():
    # Endpoints
    anon_url = "https://image.pollinations.ai/prompt/a%20test%20card?width=512&height=712"
    auth_url = "https://gen.pollinations.ai/image/a%20test%20card?width=512&height=712"
    
    # Keys
    env_key = os.getenv("POLLINATIONS_API_KEY")
    screenshot_key = "sk_ZM0gFIgkvp1SxG1h7AL9pObx2laLOXVe" # From user screenshot
    
    await test_endpoint("Anonymous", anon_url)
    if env_key:
        await test_endpoint("Auth (ENV Key)", auth_url, {"Authorization": f"Bearer {env_key}"})
    await test_endpoint("Auth (Screenshot Key)", auth_url, {"Authorization": f"Bearer {screenshot_key}"})
    await test_endpoint("Auth (No Key)", auth_url)

if __name__ == "__main__":
    asyncio.run(main())
