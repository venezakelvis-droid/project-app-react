import os
from datetime import datetime


class FileTxt():

    def __init__(self, success_path="mensagens_sucesso_repasse.txt", error_path="mensagens_erro_repasse.txt"):
        self.success_path = success_path
        self.error_path = error_path

    def save_success(self, mensagem: str):
        with open(self.success_path, "a", encoding="utf-8") as f:
            f.write(f"[{self._timestamp()}] ✅ {mensagem}\n")

    def save_error(self, mensagem: str, erro: str):
        with open(self.error_path, "a", encoding="utf-8") as f:
            f.write(f"[{self._timestamp()}] ❌ {mensagem}\nMotivo: {erro}\n")

    def _timestamp(self) -> str:
        return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

