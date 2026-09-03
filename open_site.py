from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time

url = "https://fin-set-frontend.vercel.app/"

chrome_options = Options()
chrome_options.add_argument("--start-maximized")

driver = webdriver.Chrome(
    service=Service(ChromeDriverManager().install()),
    options=chrome_options
)

driver.get(url)

time.sleep(3)

driver.fullscreen_window()

print("Website opened in fullscreen mode")

input("Press Enter to close...")
driver.quit()