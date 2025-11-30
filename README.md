<div align="center">

<a href="https://github.com/facoriolano">
<img src="https://readme-typing-svg.herokuapp.com?font=Press+Start+2P&weight=400&size=65&duration=4000&pause=1000&color=C084FC&background=00000000&center=true&vCenter=true&width=1200&height=150&lines=%40FACORIOLANO" alt="Typing SVG" />
</a>

[![Database](https://img.shields.io/badge/Database-Firestore-7C3AED?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com/)
[![Style](https://img.shields.io/badge/Style-Tailwind-4338ca?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Status](https://img.shields.io/badge/Status-Online-3b82f6?style=for-the-badge&logo=pwa&logoColor=white)](https://github.com/facoriolano)

</div>

<br />

# ☁️ PastoralPass Cloud

Versão **Serverless** conectada diretamente ao **Google Firebase**. 
Todo o aplicativo funciona através do arquivo `index.html`, o que garante compatibilidade total com o GitHub Pages e fácil instalação.

---

### 🚀 Configuração (Primeiro Acesso)

Ao abrir o aplicativo pela primeira vez, ele pedirá o código do Firebase.

1. Acesse o [Console Firebase](https://console.firebase.google.com/).
2. Vá em **Configurações do Projeto** (Engrenagem).
3. Role até **Seus aplicativos** > **PastoralPass**.
4. Copie o código que aparece dentro de:

```javascript
const firebaseConfig = {
  // COPIE O QUE ESTIVER AQUI DENTRO
  apiKey: "AIzaSy...",
  authDomain: "pastoralpass.firebaseapp.com",
  projectId: "pastoralpass",
  storageBucket: "pastoralpass.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
```

5. Cole no app e clique em salvar.

> **⚠️ Importante:** Certifique-se de ter criado o **Firestore Database** no modo de teste, caso contrário o app não terá permissão para salvar os dados.

---

### 📦 Estrutura do Projeto

Para simplificar o deploy, este projeto usa a arquitetura **Single File Component**.
O único arquivo necessário para o site funcionar é o `index.html`. Os arquivos `.tsx` antigos foram removidos para evitar conflitos.

---

<div align="center">
<sub>Desenvolvido com 💜 por <a href="https://github.com/facoriolano">@facoriolano</a></sub>
</div>
