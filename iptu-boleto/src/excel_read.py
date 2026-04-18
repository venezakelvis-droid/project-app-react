import re
import pandas as pd
from typing import List, Dict


def normalizar_matricula(valor: str) -> List[str]:
    """
    Extrai todas as matrículas numéricas válidas de um texto usando regex.

    Exemplos tratados:
    - 030281-3
    - 0318353 DIV. P/ 10
    - 3064531/2271974
    - 051398-9 div 06
    - 1603817 /1603825
    - 3596826 SL 1413 TO 1
    """

    if pd.isna(valor):
        return []

    # Garante que virou string
    texto = str(valor).upper().strip()

    # Regex:
    # - números com possível hífen (030281-3)
    # - múltiplos números separados por /
    # - ignora textos como DIV, SL, TO etc
    #padrao = r'\d+(?:-\d+)?' pega qualquer numero
    padrao = r'\d{4,}(?:-\d+)?'

    encontrados = re.findall(padrao, texto)

    return encontrados


def ler_excel_iptu(caminho_arquivo: str) -> List[Dict]:
    """
    Lê um arquivo Excel e retorna lista estruturada com:
    - codigo
    - endereco
    - matriculas (lista limpa via regex)
    """

    df = pd.read_excel(
        caminho_arquivo,
        dtype=str  # MUITO IMPORTANTE -> evita Excel converter matrícula
    )

    colunas_necessarias = ["COD CONTRATO", "ENDEREÇO", "MATRÍCULA IPTU"]

    for col in colunas_necessarias:
        if col not in df.columns:
            raise ValueError(f"Coluna obrigatória não encontrada: {col}")

    registros = []

    for _, row in df.iterrows():
        codigo = str(row["COD CONTRATO"]).strip() if pd.notna(row["COD CONTRATO"]) else None
        endereco = str(row["ENDEREÇO"]).strip() if pd.notna(row["ENDEREÇO"]) else None
        matriculas_extraidas = normalizar_matricula(row["MATRÍCULA IPTU"])

        registros.append({
            "codigo": codigo,
            "endereco": endereco,
            "matriculas": matriculas_extraidas
        })

    return registros


