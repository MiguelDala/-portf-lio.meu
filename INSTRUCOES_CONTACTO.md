# Instruções para o formulário de contacto funcionar

## Receber mensagens no Gmail (danilomanuel040@gmail.com)

O formulário de contacto usa o **Web3Forms** para enviar as mensagens automaticamente para o seu Gmail. Sem custos (até 250 mensagens/mês grátis).

### Passos para ativar:

1. **Obter a Access Key:**
   - Aceda a: https://web3forms.com
   - Clique em "Create Access Key"
   - Use o email: **danilomanuel040@gmail.com**
   - Verifique a caixa de entrada do Gmail e copie a Access Key que receber

2. **Colocar no código:**
   - Abra o ficheiro `index.html`
   - Procure: `value="COLOQUE_SUA_ACCESS_KEY_AQUI"`
   - Substitua por: `value="A_SUA_ACCESS_KEY_REAL"`

### O que acontece quando alguém envia mensagem:

- ✅ Um email é enviado automaticamente para **danilomanuel040@gmail.com**
- ✅ Os dados ficam guardados no painel Web3Forms durante 30 dias (pode exportar)
- ✅ Proteção contra spam incluída

### Base de dados / histórico:

O Web3Forms guarda as submissões no dashboard deles durante 30 dias. Se precisar de guardar os dados numa base de dados SQL própria (MySQL, etc.), terá de criar um backend (ex: Node.js, PHP) e usar um webhook ou serviço de email (SMTP). Para a maioria dos casos, o Gmail + dashboard Web3Forms basta.
