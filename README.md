<div align="center">

<a href="https://github.com/facoriolano">
<img src="https://readme-typing-svg.herokuapp.com?font=Press+Start+2P&weight=400&size=50&duration=4000&pause=1000&color=C084FC&background=00000000&center=true&vCenter=true&width=1000&height=100&lines=%40FACORIOLANO" alt="Typing SVG" />
</a>

<div style="display: flex; justify-content: center; gap: 10px;">
<a href="https://firebase.google.com/">
  <img src="https://img.shields.io/badge/Database-Firestore-7C3AED?style=for-the-badge&logo=firebase&logoColor=white" height="28" />
</a>
<a href="https://tailwindcss.com/">
  <img src="https://img.shields.io/badge/Style-Tailwind-4338ca?style=for-the-badge&logo=tailwindcss&logoColor=white" height="28" />
</a>
<a href="https://github.com/facoriolano">
  <img src="https://img.shields.io/badge/Status-Online-3b82f6?style=for-the-badge&logo=pwa&logoColor=white" height="28" />
</a>
<a href="https://instagram.com/facoriolano">
  <img src="https://img.shields.io/badge/Instagram-%40facoriolano-E4405F?style=for-the-badge&logo=instagram&logoColor=white" height="28" />
</a>
</div>

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

<img src="https://readme-typing-svg.herokuapp.com?font=Press+Start+2P&weight=400&size=20&duration=4000&pause=1000&color=F59E0B&background=00000000&center=true&vCenter=true&width=800&height=60&lines=DEDICAT%C3%93RIA+ESPECIAL" alt="Dedicatória Especial" />

<br>

<img src="https://readme-typing-svg.herokuapp.com?font=Press+Start+2P&weight=400&size=12&duration=5000&pause=2000&color=E5E7EB&background=00000000&center=true&vCenter=true&width=900&height=50&lines=%22A+Eucaristia+%C3%A9+a+minha+autoestrada+para+o+C%C3%A9u.%22" alt="Frase de São Carlo Acutis" />

<br>

<p style="color: #9CA3AF; font-style: italic;">
Dedicado a <strong>São Carlo Acutis</strong> (Canonizado em 12/10/2025), padroeiro da Internet,<br>
e à <strong>Turma de Crisma 26</strong>.
</p>

<code>#SaoCarloAcutis</code> &nbsp; <code>#Crisma26</code>

</div>

---

<div align="center">
<sub>Desenvolvido com 💜 por <a href="https://github.com/facoriolano">@facoriolano</a></sub>
</div>
