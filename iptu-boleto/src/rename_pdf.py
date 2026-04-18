from pathlib import Path


def renomear_pdf(pasta: str, novo_nome: str, sobrescrever: bool = False) -> str:
    """
    Procura na pasta o PDF mais recente que começa com 'GuiaDam'
    e renomeia para novo_nome.pdf
    """

    pasta_path = Path(pasta)

    if not pasta_path.exists() or not pasta_path.is_dir():
        return FileNotFoundError(f"Pasta não encontrada: {pasta}")

    # Filtra PDFs que começam com GuiaDam
    pdfs = list(pasta_path.glob("GuiaDam*.pdf"))

    if not pdfs:
        return FileNotFoundError("Nenhum arquivo GuiaDam*.pdf encontrado na pasta")

    # Ordena por data de modificação (mais recente primeiro)
    pdfs.sort(key=lambda x: x.stat().st_mtime, reverse=True)

    arquivo_mais_recente = pdfs[0]

    novo_arquivo = arquivo_mais_recente.with_name(f"{novo_nome}.pdf")

    if novo_arquivo.exists() and not sobrescrever:
        return FileExistsError(f"Já existe um arquivo com o nome: {novo_arquivo}")

    arquivo_mais_recente.rename(novo_arquivo)

    return str(novo_arquivo)