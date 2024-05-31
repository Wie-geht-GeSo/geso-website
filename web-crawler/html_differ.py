from lxml import html
from bs4 import BeautifulSoup
import requests
import time
import difflib


def has_html_changed(html1, html2):
    """
    Compares two HTML strings.

    Args:
    - html1 (str): The first HTML string.
    - html2 (str): The second HTML string.

    Returns:
    - bool: True if the HTML strings are different, False otherwise.
    """
    tree1 = html.fromstring(html1)
    tree2 = html.fromstring(html2)

    return html.tostring(tree1) != html.tostring(tree2)


def is_content_dynamic(url, interval=10, attempts=3):
    """
    Checks if a website has dynamic content by fetching the HTML content of the page multiple times at specified
    intervals. The function compares each version of the HTML content to see if any changes occur.

    Args:
    - url (str): The URL of the website to check. Should be a full URL string including the 'http://' or 'https://'.
    - interval (int): The time interval, in seconds, between each fetch of the webpage content. Defaults to 10 seconds.
    - attempts (int): The number of times the webpage will be fetched and compared to check for dynamic
      content. Defaults to 3 attempts.

    Returns:
    - bool: True if the HTML content changes between fetches, indicating the presence of dynamic content. False if the
      content remains the same across all fetches.
    """
    prev_content = requests.get(url).text
    for _ in range(attempts):
        time.sleep(interval)
        current_content = requests.get(url).text
        if current_content != prev_content:
            return True
        prev_content = current_content
    return False


def has_javascript_content(url):
    """
    Checks if a website uses JavaScript by looking for <script> tags.

    Args:
    - url (str): The website URL, including 'http://' or 'https://'.

    Returns:
    - bool: True if <script> tags are found, False otherwise.
    """
    content = requests.get(url).text
    soup = BeautifulSoup(content, 'html.parser')
    scripts = soup.find_all('script')
    return len(scripts) > 0


def fetch_static_text(url):
    # Fetch the web page using requests
    response = requests.get(url)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the HTML content using BeautifulSoup
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract and print textual content
        for script in soup(['script', 'style']):
            # Remove script and style elements
            script.extract()

        # Get text
        text = soup.get_text()

        # Remove leading and trailing spaces on each line
        lines = (line.strip() for line in text.splitlines())

        # Remove empty lines
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))

        # Remove empty chunks and concatenate
        text_content = '\n'.join(chunk for chunk in chunks if chunk)

        return text_content
    else:
        return f"Failed to fetch the web page. Status code: {response.status_code}"


def compare_html_pages(url1, url2):
    # Fetch HTML content from URLs
    response1 = requests.get(url1)
    response2 = requests.get(url2)

    # Parse HTML using BeautifulSoup
    soup1 = BeautifulSoup(response1.text, 'html.parser')
    soup2 = BeautifulSoup(response2.text, 'html.parser')

    # Extract text from HTML
    text1 = soup1.stripped_strings
    text2 = soup2.stripped_strings

    # Convert to list of strings
    text1 = list(text1)
    text2 = list(text2)

    # Compare text using difflib
    d = difflib.Differ()
    diff = d.compare(text1, text2)

    # Output changes
    changes = [line for line in diff if line.startswith('+ ') or line.startswith('- ')]
    return changes
