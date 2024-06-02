from helper_functions import *
from bs_interface import *

import mysql.connector
import json
import os
from hashlib import md5


def readSecrets():
    filename = os.path.join('secrets.json')
    try:
        with open(filename, mode='r') as f:
            return json.loads(f.read())
    except FileNotFoundError:
        return {}


def mydbConnection():
    secrets = readSecrets()

    HOST = secrets['DB_HOST']
    DATABASE = secrets['DB_NAME']
    USER = secrets['DB_USER']
    PASSWORD = secrets['DB_PW']

    connection = None
    try:
        connection = mysql.connector.connect(
            host=HOST,
            database=DATABASE,
            user=USER,
            password=PASSWORD
            )
        # print("Connection to MySQL DB successful")
    except OSError as e:
        print(f"The error '{e}' occurred")

    return connection


def myDbParameterizedExecuteCommit(connection, query, values):
    cursor = connection.cursor()
    try:
        cursor.execute(query, values)
        connection.commit()
        cursor.close()
    except OSError as e:
        print(f"The error '{e}' occurred")
    finally:
        cursor.close()


def myDbInsertIntoWebsites(Domain, https):
    query = '''INSERT INTO crawler.websites (Domain,URL,DateAdded) 
                VALUES (%s, %s, NOW())'''
    values = (Domain, https)
    myDbParameterizedExecuteCommit(mydbConnection(), query, values)

"""
def myDbTruncateTableWebsites():
    connection = mydbConnection()
    cursor = connection.cursor()
    # query = "TRUNCATE TABLE crawler.websites"
    query = "DELETE FROM crawler.websites WHERE ID_websites >= 1; ALTER TABLE crawler.websites AUTO_INCREMENT = 1;"
    try:
        cursor.execute(query)
        connection.commit()
        cursor.close()
        print("Table websites truncated")
    except OSError as e:
        cursor.close()
        print(f"The error '{e}' occurred")
"""

def myDbWriteUrlsToWebsites(fname):
    # truncateTableWebsites()
    df_urls = load_urls(fname)

    for url in df_urls.URL:
        myDbInsertIntoWebsites(get_domain(url), url)


def myDbGetUrls():
    """
    Retrieves URLs and corresponding website IDs from the database.

    Returns:
        pandas.DataFrame: A DataFrame containing the URLs and IDs.
    """
    connection = mydbConnection()  # Establish database connection
    cursor = connection.cursor()  # Create a cursor object
    cursor.execute("SELECT URL, ID_websites FROM websites")  # Execute SQL query

    myresult = cursor.fetchall()  # Fetch all rows from the result set
    cursor.close()  # Close the cursor

    url_list = []  # List to store URLs
    ID_websites_list = []  # List to store the DB IDs for the websites

    for x in myresult:
        url_list.append(x[0])  # Append URL to the url_list
        ID_websites_list.append(x[1])  # Append the ID to the ID_websites_list
    
    return pd.DataFrame(list(zip(url_list, ID_websites_list)), columns=["URL", "ID"])


def myDbInitChangelog():
    # initialize the changelog table, only called if the table is empty
    # both the HTMLPayloadOld and HTMLPayloadNew are set to the first payload fetched from the respective website
    websites_df = myDbGetUrls()
    for _, row in websites_df.iterrows():
        ID_websites_FK = row["ID"]
        ModNumber = 1
        htmlPayload = bsGetHtmlPayload(row["URL"])
        htmlPayloadHash = md5(htmlPayload.encode()).hexdigest()
        
        # Define the query with placeholders and the values to be inserted
        query = '''INSERT INTO crawler.changelog 
                (ID_websites_FK, ModNumber, LastVisited, LastChanged, HTMLPayloadOld, HTMLPayloadNew, HTMLHasChanged, HTMLChanges) 
                VALUES (%s, %s, NOW(), NOW(), %s, %s, %s, %s)'''
        values = (int(ID_websites_FK), int(ModNumber), htmlPayloadHash, htmlPayloadHash, False, None)
        myDbParameterizedExecuteCommit(mydbConnection(), query, values)
        

def myDbInsertIntoChangeLog(ID_websites_FK, ModNumber, HTMLPayloadOld, HTMLPayloadNew, HTMLHasChanged, HTMLChanges=None):
    # Define the query with placeholders and the values to be inserted
    query = '''INSERT INTO crawler.changelog 
               (ID_websites_FK, ModNumber, LastVisited, LastChanged, HTMLPayloadOld, HTMLPayloadNew, HTMLHasChanged, HTMLChanges) 
               VALUES (%s, %s, NOW(), NOW(), %s, %s, %s, %s)'''
    values = (int(ID_websites_FK), int(ModNumber), HTMLPayloadOld, HTMLPayloadNew, HTMLHasChanged, HTMLChanges)

    # Pass the connection, query, and values to the execute function
    myDbParameterizedExecuteCommit(mydbConnection(), query, values)


def myDbUpdateChangeLog(ID_websites_FK, ModNumber, HTMLPayloadOld, HTMLPayloadNew, HTMLHasChanged, HTMLChanges=None):
    # Define the query with placeholders and the values to be inserted
    query = '''UPDATE crawler.changelog 
               SET LastVisited = NOW(), LastChanged = NOW(), HTMLPayloadOld = %s, HTMLPayloadNew = %s, HTMLHasChanged = %s, HTMLChanges = %s 
               WHERE ID_websites_FK = %s AND ModNumber = %s'''
    values = (HTMLPayloadOld, HTMLPayloadNew, HTMLHasChanged, HTMLChanges, ID_websites_FK, ModNumber)

    # Pass the connection, query, and values to the execute function
    myDbParameterizedExecuteCommit(mydbConnection(), query, values)


def myDbGetModNumber(ID):
    connection = mydbConnection()
    cursor = connection.cursor()
    cursor.execute(f'SELECT MAX(ModNumber) FROM crawler.changelog WHERE ID_websites_FK = {ID}')

    max_ID = cursor.fetchall()
    cursor.close()

    return max_ID[0][0]


def myDbFetchPayloads(id):
    # create database connection and cursor
    connection = mydbConnection()
    cursor = connection.cursor()

    # fetch the max modNumber for the current website
    cursor.execute(f'SELECT MAX(ModNumber) \
                   FROM crawler.changelog \
                   WHERE ID_websites_FK = {id}')
    maxModNumber = cursor.fetchall()[0][0]

    # fetch the old and new payload for the current website
    cursor.execute(f'SELECT HTMLPayloadOld, HTMLPayloadNew, HTMLHasChanged \
                   FROM crawler.changelog \
                   WHERE ID_websites_FK = {id} AND ModNumber = {maxModNumber}')
    
    payload = cursor.fetchall()[0]

    # close the cursor and return the payload and the max modNumber
    cursor.close()
    return maxModNumber, payload


def myDbGetLastPayload(ID):
    if myDbGetModNumber(ID) is not None:
        subquery = f'SELECT MAX(ModNumber) FROM crawler.changelog WHERE ID_websites_FK = {ID}'
        query = f'SELECT HTMLPayloadNew \
        FROM crawler.changelog \
        WHERE ID_websites_FK = {ID} AND ModNumber = ({subquery})'

        connection = mydbConnection()
        cursor = connection.cursor()
        cursor.execute(query)

        lastPayload = cursor.fetchall()[0][0]
        cursor.close()
    else:
        lastPayload = None

    return lastPayload


def myDbInit():
    try:
        connection = mydbConnection()
        print("Connection to MySQL DB successful")
    except OSError as e:
        print(f"The error '{e}' occurred")

    # check if website table is filled
    query = "SELECT COUNT(*) FROM crawler.websites"
    cursor = connection.cursor()
    cursor.execute(query)
    websitesEntries = cursor.fetchall()[0][0]
    cursor.close()

    # check if changelog table is filled
    query = "SELECT COUNT(*) FROM crawler.changelog"
    cursor = connection.cursor()
    cursor.execute(query)
    changelogEntries = cursor.fetchall()[0][0]
    cursor.close()

    if websitesEntries == 0:
        myDbWriteUrlsToWebsites("assets/link_list.csv")
        #myDbWriteUrlsToWebsites("assets/link_list_test.csv")
        #myDbWriteUrlsToWebsites("assets/link_list_test_rpi.csv")
        print("Table websites initialized")
    else:
        print("Table websites already exists")

    if changelogEntries == 0:
        myDbInitChangelog()
        print("Table changelog initialized")
    else:
        print("Table changelog already exists")

    # return websitesEntries

