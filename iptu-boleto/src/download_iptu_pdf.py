from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import time
from selenium import webdriver


def download_iptu(driver: webdriver, wait):
    try:
        driver.switch_to.default_content()

        # Entrar no iframe
        wait.until(
            EC.frame_to_be_available_and_switch_to_it((By.ID, "dsf-screen"))
        )

        # Espera botão aparecer
        botao = wait.until(
            EC.element_to_be_clickable(
                (By.ID, "dsf.UCSIATEPOR002.evt.emitirGuia")
            )
        )

        # Guarda aba atual
        aba_principal = driver.current_window_handle
        time.sleep(2)
        abas_antes = driver.window_handles

        # Clica no botão
        driver.execute_script("arguments[0].click();", botao)
        time.sleep(1)

        # Espera nova aba abrir
        wait.until(lambda d: len(d.window_handles) > len(abas_antes))

        abas_depois = driver.window_handles
        nova_aba = [a for a in abas_depois if a not in abas_antes][0]

        # Muda para nova aba
        driver.switch_to.window(nova_aba)

        # Aguarda alguns segundos para garantir início do download
        time.sleep(4)

        # Fecha aba do boleto
        driver.close()

        # Volta para aba principal
        driver.switch_to.window(aba_principal)
        time.sleep(0.5)

        return True

    except Exception as e:
        return e