from playwright.sync_api import sync_playwright
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "img" / "og.png"
OUT.parent.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch()
    context = browser.new_context(
        viewport={"width": 1200, "height": 630},
        device_scale_factor=2,
    )
    page = context.new_page()
    page.goto("http://127.0.0.1:4321/", wait_until="networkidle")
    page.wait_for_timeout(800)
    page.screenshot(path=str(OUT), clip={"x": 0, "y": 0, "width": 1200, "height": 630})
    browser.close()

print(f"saved: {OUT}")
