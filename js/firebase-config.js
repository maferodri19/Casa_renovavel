/* ==========================================================
   CONFIGURAÇÃO DO FIREBASE
   1. Acesse https://console.firebase.google.com e crie um projeto.
   2. Em "Criação > Firestore Database", crie o banco (modo produção).
   3. Em "Configurações do projeto > Seus apps > Web (</>)", registre
      um app e copie o objeto firebaseConfig para cá.
   4. Cole as regras de segurança que estão no README.md.

   Enquanto este arquivo estiver com os valores "COLE_AQUI", o site
   funciona em MODO DEMONSTRAÇÃO: comentários, avaliações e inscrições
   ficam salvos só no navegador de quem está usando (localStorage).

   Obs.: a apiKey do Firebase Web não é segredo. Quem protege os dados
   são as regras de segurança do Firestore.
   ========================================================== */

export const firebaseConfig = {
  apiKey: "COLE_AQUI",
  authDomain: "COLE_AQUI.firebaseapp.com",
  projectId: "COLE_AQUI",
  storageBucket: "COLE_AQUI.appspot.com",
  messagingSenderId: "COLE_AQUI",
  appId: "COLE_AQUI"
};
