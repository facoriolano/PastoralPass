<div align="center">

<a href="https://github.com/facoriolano">
<img src="https://readme-typing-svg.herokuapp.com?font=Press+Start+2P&weight=400&size=65&duration=4000&pause=1000&color=C084FC&background=00000000&center=true&vCenter=true&width=1200&height=150&lines=%40FACORIOLANO&v=1" alt="Typing SVG" />
</a>

[![Database](https://img.shields.io/badge/Database-Firestore-7C3AED?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com/)
[![Style](https://img.shields.io/badge/Style-Tailwind-4338ca?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Status](https://img.shields.io/badge/Status-Online-3b82f6?style=for-the-badge&logo=pwa&logoColor=white)](https://github.com/facoriolano)

</div>

<br>

### ☁️ PastoralPass Cloud

Versão **Serverless** conectada diretamente ao **Google Firebase**. 
Isso significa que você tem sincronização em tempo real entre todos os celulares dos catequistas, sem precisar configurar servidores complexos.

---

### 🚀 Configuração Inicial (Obrigatório)

Ao abrir o App pela primeira vez, ele pedirá a **Configuração JSON** do Firebase. 

1. Acesse [console.firebase.google.com](https://console.firebase.google.com).
2. Crie um projeto novo.
3. No menu lateral, vá em **Criação > Firestore Database** e crie um banco (pode começar em modo de teste).
4. Volte à **Visão Geral do Projeto** (ícone de engrenagem > Configurações do projeto).
5. Role até o fim e clique no ícone `</>` (Web) para criar um app web.
6. Copie o objeto `const firebaseConfig = { ... }` (apenas o conteúdo entre as chaves `{ ... }`).
7. Cole no PastoralPass quando solicitado.

---

### 📦 Instalação

Como este projeto usa a arquitetura "Single File", você só precisa do arquivo `index.html`.

1. Clone o repositório.
2. Suba para o GitHub.
3. Ative o GitHub Pages.
4. Pronto!

```bash
git init
git add .
git commit -m "Versão Cloud Firebase"
git branch -M main
git remote add origin https://github.com/SEU_USER/REPO.git
git push -u origin main
```

---
<sub>Desenvolvido com 💜 por @facoriolano</sub>
