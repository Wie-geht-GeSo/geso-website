from bs4 import BeautifulSoup
import requests
import time


def bsGetHtmlPayload(URL):
    try:
        response = requests.get(URL)
        soup = BeautifulSoup(response.text, features="html.parser")
        # add a wait time to prevent overloading the server
        wait_time = 1
        time.sleep(wait_time)
        return response.text
    except:
        return "Error, could not fetch URL"
    #response = requests.get(URL)
    #soup = BeautifulSoup(response.text, features="html.parser")
    #return (response.text).replace("'", "\\'") # escape the character ' as sql would see end of string
