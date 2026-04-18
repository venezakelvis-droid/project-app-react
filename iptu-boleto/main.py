from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

from src.access_site import access
from src.fill_input import search_iptu_house
from src.click import click_checkbox
from src.download_iptu_pdf import download_iptu
from src.logs import FileTxt
from src.excel_read import ler_excel_iptu
from src.rename_pdf import renomear_pdf





# confs google chrome selenium

chrome_options = Options()
folder_down = r"C:\Users\Desktop\Pictures\Nova pasta\iptu-boleto\pdf"

prefs = {
    "download.default_directory": folder_down,
    "download.prompt_for_download": False,
    "plugins.always_open_pdf_externally": True
}

#chrome_options.add_argument("--headless=new")
chrome_options.add_experimental_option("prefs", prefs)
chrome_options.add_argument("--no-sandbox")
driver = webdriver.Chrome(service=Service(), options=chrome_options)
wait = WebDriverWait(driver, 20)

url = "https://portal.teresina.pi.gov.br/dsf_the_portal/inicial.do?evento=montaMenu&acronym=EXTRATOIMOVEL"

# init program
logTXT = FileTxt()
array_imoveis = ler_excel_iptu(r"IMOVEIS-COMPLETO.xlsx")

#access site first 
access(url=url,driver=driver)

for value in sorted(array_imoveis, key=lambda x: x["codigo"]):

    print(f"Codigo:{value['codigo']}")
    if(len(value["matriculas"]) > 1):
        for matricula in value["matriculas"]:
            response = search_iptu_house(driver=driver, wait=wait, code=matricula, year=2026)
            if(type(response) == Exception):
                logTXT.save_error(f"Error searching for property:{value['codigo']} {matricula}", response)
                continue

            response = click_checkbox(driver=driver, wait=wait)
            if(type(response) == Exception):
                logTXT.save_error(f"Error searching for property payment slips:{value['codigo']} {matricula}", response)
                continue

            response = download_iptu(driver=driver, wait=wait)
            if(type(response) == Exception):
                logTXT.save_error(f"Error downloading property payment slips:{value['codigo']} {matricula}", response)
                continue
            
            name_file = f"{value['codigo']}-{matricula}"
            response = renomear_pdf(pasta=folder_down, novo_nome=name_file.replace("/", "-"))
            if(type(response) == Exception):
                logTXT.save_error(f"Error rename file pdf:{value['codigo']} {matricula}", response)
                continue

            logTXT.save_success(f"Successfull downloading property payment slips:{value['codigo']} {matricula}")
        continue

    response = search_iptu_house(driver=driver, wait=wait, code=value["matriculas"], year=2026)
    if(type(response) == Exception):
        logTXT.save_error(f"Error searching for property:{value['codigo']}", response)
        continue

    response = click_checkbox(driver=driver, wait=wait)
    if(type(response) == Exception):
        logTXT.save_error(f"Error searching for property payment slips:{value['codigo']}", response)
        continue

    response = download_iptu(driver=driver, wait=wait)
    if(type(response) == Exception):
        logTXT.save_error(f"Error downloading property payment slips:{value['codigo']}", response)
        continue

    response = renomear_pdf(pasta=folder_down, novo_nome=value["codigo"].replace("/", "-"))
    if(type(response) == Exception):
        logTXT.save_error(f"Error rename file pdf:{value['codigo']}", response)
        continue

    logTXT.save_success(f"Successfull downloading property payment slips:{value['codigo']} {value['matriculas'][0]}")