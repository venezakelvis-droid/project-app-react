from selenium import webdriver
import time



def access(url:str, driver:webdriver):
    driver.get(url)
    time.sleep(5)