from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium import webdriver
import time





def click_checkbox(driver:webdriver, wait:WebDriverWait):
    try:
        driver.switch_to.default_content()
        wait.until(
            EC.frame_to_be_available_and_switch_to_it((By.ID, "dsf-screen"))
        )

        wait.until(
            EC.presence_of_element_located(
                (By.XPATH, "//div[@id='sel1']//tr")
            )
        )

        rows = driver.find_elements(
            By.XPATH,
            "//div[@id='sel1']//tr[td[4][normalize-space()='A VISTA']]"
        )

        print(f"Encontradas {len(rows)} linhas A VISTA")

        for i, row in enumerate(rows):
            checkbox = row.find_element(By.XPATH, "./td[1]//input[@type='checkbox']")

            if not checkbox.is_selected():
                driver.execute_script("arguments[0].click();", checkbox)

                # Aguarda pequeno processamento JS
                wait.until(lambda d: checkbox.is_selected())

                # # Trata possível alert
                # try:
                #     wait.until(EC.alert_is_present())
                #     alert = driver.switch_to.alert
                #     print(f"⚠ Alert detectado após clique {i+1}: {alert.text}")
                #     alert.accept()
                # except:
                #     pass


        return True

    except Exception as e:
        return e