from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium import webdriver
import time




def search_iptu_house(driver:webdriver, wait:WebDriverWait, code: str, year: str):
    try:
        ##### search ######
        driver.switch_to.default_content()

        wait.until(
            EC.frame_to_be_available_and_switch_to_it((By.ID, "dsf-screen"))
        )

        campo = wait.until(
            EC.element_to_be_clickable((By.ID, "cadastroCodigoPesquisaIMO"))
        )

        driver.execute_script("arguments[0].focus();", campo)
        time.sleep(0.2)

        campo.clear()
        campo.send_keys(Keys.CONTROL + "a")
        campo.send_keys(Keys.DELETE)

        campo.send_keys(code)
        time.sleep(0.2)

        #### year #####
        campo = wait.until(
            EC.element_to_be_clickable((By.ID, "exercicio_Arg"))
        )

        driver.execute_script("arguments[0].focus();", campo)
        time.sleep(0.2)

        campo.clear()
        campo.send_keys(Keys.CONTROL + "a")
        campo.send_keys(Keys.DELETE)

        campo.send_keys(year)
        time.sleep(0.2)

        ### click button ###
        button = wait.until(EC.element_to_be_clickable((By.ID, "botao_menu_pesquisar")))
        driver.execute_script("arguments[0].focus();", button)
        time.sleep(0.2)

        driver.execute_script("arguments[0].scrollIntoView({block:'center'});", button)
        time.sleep(0.2)

        button.click()

        time.sleep(1)

        try:
            msg_erro = driver.find_element(By.ID, "msgVermelho")

            if msg_erro.is_displayed():
                texto = msg_erro.text.strip()
                raise Exception(f"Erro retornado pelo sistema: {texto}")
        except Exception as e:
            raise

        return 

    except Exception as e:
        return e