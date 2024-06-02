from mydb_cnx import *
from bs_interface import *
from notifier import post_diff_to_discord

from datetime import datetime
#import difflib
#import sys
from hashlib import md5
import re

# load the data and write to the db
# myDbWriteUrlsToWebsites("link_list_test.csv")

def truncateDB():
    connection = mydbConnection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM crawler.changelog")
    cursor.execute("DELETE FROM crawler.websites")
    connection.commit()
    cursor.close()
    print("DB truncated")


def updateChangeLog():
    urls_df = myDbGetUrls()
    
    for _, row in urls_df.iterrows():
        ID = row["ID"]
        URL = row["URL"]

        maxModNumber = myDbGetModNumber(ID)

        cncnt = mydbConnection()
        cursor = cncnt.cursor()
        query = '''SELECT LastChanged, HTMLPayloadOld, HTMLPayloadNew 
                    FROM crawler.changelog 
                    WHERE ID_websites_FK = %s AND ModNumber = %s'''
        values = (ID, maxModNumber)
        cursor.execute(query, values)
        lastChanged, payloadOld, payloadNew = cursor.fetchall()[0]
        cursor.close()
        cncnt.close()

        # fetch the payload and hash it
        payloadFetched = md5(bsGetHtmlPayload(URL).encode()).hexdigest()

        # compare the payloadNew with the payloadFetched, set the HtmlHasChanged to True if there are changes
        if payloadFetched == payloadNew:
            htmlHasChanged = False
        else:
            lastChanged = datetime.now() # update the lastChanged timestamp
            payloadOld = payloadNew
            payloadNew = payloadFetched
            htmlHasChanged = True

        # insert a new row into the changelog table
        cncnt = mydbConnection()
        cursor = cncnt.cursor()
        query = '''INSERT INTO crawler.changelog 
                    (ID_websites_FK, ModNumber, LastVisited, LastChanged, HTMLPayloadOld, HTMLPayloadNew, HTMLHasChanged) 
                    VALUES (%s, %s, NOW(), %s, %s, %s, %s)'''
        values = (ID, maxModNumber+1, lastChanged, payloadOld, payloadNew, htmlHasChanged)
        cursor.execute(query, values)
        cncnt.commit()
        cursor.close()
        cncnt.close()


def compareHTMLChanges(payloadOld, payloadNew):
    # if the payload is the same, return False (no changes detected)
    if payloadOld == payloadNew:
        return False
    # if the payload is different, return the changes (diff)
    else:
        #changes = (list(difflib.ndiff(payloadOld.splitlines(), payloadNew.splitlines())))
        #print(changes)
        #return changes
        return True

cncnt = mydbConnection()
cursor = cncnt.cursor()
query = '''
        SELECT
            c.ID_websites_FK,
            c.ModNumber,
            c.LastVisited,
            c.LastChanged,
            c.HTMLHasChanged,
            websites.URL
        FROM
            crawler.changelog c
        INNER JOIN (
            SELECT
                ID_websites_FK,
                MAX(ModNumber) AS HighestModNumber
            FROM
                crawler.changelog
            GROUP BY
                ID_websites_FK
        ) max_c ON c.ID_websites_FK = max_c.ID_websites_FK AND c.ModNumber = max_c.HighestModNumber
        LEFT JOIN crawler.websites websites ON c.ID_websites_FK = websites.ID_websites;
        '''
cursor.execute(query)
test = cursor.fetchall()
cursor.close()
cncnt.close()

test_df = pd.DataFrame(test)
# rename the columns
test_df.columns = ["ID", "ModNumber", "LastVisited", "LastChanged", "HTMLHasChanged", "URL"]


def is_top_level_domain(url):
    """
    Check if the given URL is at the top-level domain (i.e., landing page) using a regular expression.
    
    Parameters:
    url (str): The URL to check.
    
    Returns:
    bool: True if the URL is the landing page of the domain, False otherwise.
    """
    # Define a regex pattern to match a top-level domain with an optional trailing slash
    pattern = re.compile(r'^https?://[^/]+(\.[a-z]{2,})/?$')
    
    # Use the regex to match the URL
    match = pattern.match(url)
    
    return match is not None

updateChangeLog()
changed_urls = [] 


# for LastVisited in test_df["LastVisited"]:
for index, row in test_df.iterrows():
    lastVisited = row["LastVisited"]
    hasChanged = row["HTMLHasChanged"]
    url = row["URL"]
    # if last visited is older than 1 day, update the changelog table
    if (datetime.now() - lastVisited).days >= 1:
        print("Updated changelog")
    else:
        print(f"No updates needed {(datetime.now() - lastVisited)=}")
    
    if hasChanged and not is_top_level_domain(url):
        print("Changes detected")
        changed_urls.append(url)

if len(changed_urls) > 0:
    post_diff_to_discord(changed_urls)

