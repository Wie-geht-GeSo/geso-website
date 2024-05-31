import pandas as pd


def get_domain(url):
    idx1 = url.index('//')
    url_sub = url[idx1 + 2:len(url)]
    idx2 = url_sub.index('/')
    domain = url_sub[0:idx2]

    return domain


def load_urls(fname):
    urls = pd.read_csv(fname)
    return urls

