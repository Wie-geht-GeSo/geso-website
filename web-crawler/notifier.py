import requests
import os
from dotenv import load_dotenv

# Load the environment variables from the .env file
load_dotenv()

WEBHOOK_URL = os.getenv('WEBHOOK_URL')

def post_diff_to_discord(changed_urls):

    description = "The following URLs have changed:\n" + "\n".join(f"- {url}" for url in changed_urls)

    # Create the embed
    embed = {
        "title": "Changes in URLs",
        "description": description,
        "color": 5814783
    }
    
    data = {
        "username": "DiffBot",
        "embeds": [embed]
    }
    response = requests.post(WEBHOOK_URL, json=data)
    if response.status_code == 204:
        print("Message sent successfully")
    else:
        print(f"Failed to send message: {response.status_code}, {response.text}")

# Ensure the webhook URL is set
if WEBHOOK_URL is None:
    raise ValueError("WEBHOOK_URL environment variable is not set")
