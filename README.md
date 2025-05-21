# Documentação da Automação com N8N

## Introdução à Automação de Leads com N8N

O N8N é uma ferramenta poderosa de automação de fluxos de trabalho que permite conectar diferentes aplicações e serviços sem necessidade de conhecimentos avançados de programação. Neste documento, explicarei detalhadamente como configurar uma automação para capturar leads do formulário da landing page RevitaLocks, enviar esses dados para uma planilha no Google Sheets e, simultaneamente, disparar um e-mail de boas-vindas para o cliente.

Esta automação atende exatamente à necessidade apresentada no teste técnico: sempre que alguém preencher o formulário da landing page, os dados serão automaticamente enviados para uma planilha no Google Sheets e um e-mail de boas-vindas será enviado ao cliente.

## Passo a Passo da Configuração no N8N

### 1. Configuração Inicial do N8N

Antes de iniciar a criação do fluxo de automação, é necessário configurar o ambiente N8N:

1. **Instalação do N8N**: Se ainda não estiver instalado, o N8N pode ser instalado via npm com o comando `npm install n8n -g` ou utilizando Docker.

2. **Inicialização do Serviço**: Execute o N8N com o comando `n8n start` para iniciar a interface web, geralmente disponível em `http://localhost:5678`.

3. **Autenticação nas Plataformas**: Antes de criar o fluxo, configure as credenciais para acesso ao Google Sheets e ao serviço de e-mail que será utilizado (como Gmail, SMTP, SendGrid, etc.).

### 2. Criação do Trigger (Webhook)

O primeiro passo é criar um ponto de entrada para receber os dados do formulário:

1. **Adicione um Nó Webhook**: Na interface do N8N, crie um novo fluxo de trabalho e adicione um nó "Webhook".

2. **Configure o Webhook**:
   - Selecione o método HTTP como "POST"
   - Mantenha a opção "Respond" ativada para retornar uma resposta ao formulário
   - Anote a URL gerada pelo webhook (será utilizada no formulário da landing page)

3. **Teste do Webhook**: O N8N fornece uma URL única para este webhook. Esta URL será o endpoint para onde o formulário da landing page enviará os dados.

### 3. Integração com o Formulário da Landing Page

Para que o formulário da landing page envie dados para o N8N, é necessário modificar o JavaScript da página:

```javascript
// Modificação no script.js da landing page
document.getElementById('lead-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Coletar dados do formulário
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        date: new Date().toISOString()
    };
    
    // Enviar dados para o webhook do N8N
    fetch('https://seu-servidor-n8n.com/webhook/xyz123...', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        // Mostrar popup de sucesso
        document.getElementById('success-popup').classList.add('active');
        // Limpar formulário
        document.getElementById('lead-form').reset();
    })
    .catch(error => {
        console.error('Erro ao enviar dados:', error);
        // Tratamento de erro
    });
});
```

### 4. Processamento dos Dados no N8N

Após receber os dados via webhook, precisamos processá-los antes de enviar para o Google Sheets:

1. **Adicione um Nó "Set"**: Este nó permite manipular os dados recebidos.
   - Configure para extrair os campos relevantes (nome, e-mail, telefone, data)
   - Formate os dados conforme necessário (por exemplo, formatação de data)

2. **Validação de Dados (Opcional)**: Adicione um nó "IF" para validar se o e-mail está em formato correto ou se todos os campos obrigatórios foram preenchidos.

### 5. Configuração da Integração com Google Sheets

Agora, vamos configurar o envio dos dados para o Google Sheets:

1. **Adicione um Nó "Google Sheets"**:
   - Selecione a operação "Append"
   - Conecte sua conta Google (se ainda não estiver conectada)
   - Selecione a planilha de destino e a aba específica

2. **Mapeamento de Colunas**:
   - Configure o mapeamento entre os campos do formulário e as colunas da planilha
   - Exemplo de mapeamento:
     - Coluna A: Nome ({{$node["Set"].json["name"]}})
     - Coluna B: E-mail ({{$node["Set"].json["email"]}})
     - Coluna C: Telefone ({{$node["Set"].json["phone"]}})
     - Coluna D: Data ({{$node["Set"].json["date"]}})

3. **Teste da Integração**: Execute um teste para verificar se os dados estão sendo corretamente enviados para a planilha.

### 6. Configuração do Envio de E-mail de Boas-Vindas

Em paralelo ao envio para o Google Sheets, configuramos o envio do e-mail de boas-vindas:

1. **Adicione um Nó "Split"**: Este nó permite que o fluxo siga dois caminhos diferentes a partir dos mesmos dados.

2. **Adicione um Nó de E-mail** (Gmail, SMTP, SendGrid, etc.):
   - Configure as credenciais do serviço de e-mail
   - Configure o assunto: "Bem-vindo(a) à RevitaLocks! Seu e-book está aqui"
   - Configure o destinatário usando o e-mail do formulário: {{$node["Set"].json["email"]}}
   - Configure o nome do destinatário: {{$node["Set"].json["name"]}}

3. **Crie o Conteúdo do E-mail**:
   - Utilize HTML para criar um e-mail visualmente atraente
   - Inclua o logotipo da RevitaLocks
   - Personalize a mensagem com o nome do cliente
   - Inclua um link para download do e-book prometido
   - Adicione links para redes sociais e informações de contato

Exemplo de template HTML para o e-mail:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
    <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #8e44ad;">RevitaLocks</h1>
    </div>
    
    <p>Olá {{$node["Set"].json["name"]}},</p>
    
    <p>Muito obrigado por se inscrever na nossa newsletter! Estamos entusiasmados por você fazer parte da comunidade RevitaLocks.</p>
    
    <p>Conforme prometido, aqui está seu e-book gratuito com 10 receitas caseiras para cabelos deslumbrantes:</p>
    
    <div style="text-align: center; margin: 30px 0;">
        <a href="https://revitalocks.com/ebook-receitas" style="background-color: #8e44ad; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold;">BAIXAR E-BOOK AGORA</a>
    </div>
    
    <p>Esperamos que você aproveite as dicas e receitas! Se tiver alguma dúvida, não hesite em responder a este e-mail ou entrar em contato conosco através das nossas redes sociais.</p>
    
    <p>Atenciosamente,<br>Equipe RevitaLocks</p>
    
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #777; font-size: 12px;">
        <p>Siga-nos nas redes sociais:</p>
        <p>
            <a href="https://facebook.com/revitalocks" style="color: #8e44ad; margin: 0 10px;">Facebook</a>
            <a href="https://instagram.com/revitalocks" style="color: #8e44ad; margin: 0 10px;">Instagram</a>
            <a href="https://tiktok.com/revitalocks" style="color: #8e44ad; margin: 0 10px;">TikTok</a>
        </p>
        <p>© 2025 RevitaLocks. Todos os direitos reservados.</p>
    </div>
</div>
```

### 7. Configuração de Resposta ao Cliente

Para finalizar o fluxo, configuramos a resposta que será enviada de volta ao formulário:

1. **Retorne ao Nó Webhook**: Configure a resposta que será enviada ao cliente.
   - Status: 200
   - Corpo da resposta: JSON com mensagem de sucesso e status

```json
{
  "success": true,
  "message": "Dados recebidos com sucesso. E-mail de boas-vindas enviado."
}
```

### 8. Teste e Ativação do Fluxo

Após configurar todo o fluxo, é hora de testá-lo e ativá-lo:

1. **Teste Completo**: Utilize a função de teste do N8N para simular o recebimento de dados e verificar se todas as etapas estão funcionando corretamente.

2. **Ativação do Fluxo**: Após os testes, ative o fluxo para que ele comece a processar dados reais.

3. **Monitoramento**: Configure alertas para ser notificado em caso de falhas no fluxo.

## Diagrama do Fluxo de Automação

```
[Formulário Landing Page] → [Webhook N8N] → [Set/Processamento] → [Split]
                                                                   ↙       ↘
                                              [Google Sheets Append]       [E-mail de Boas-Vindas]
                                                                   ↘       ↙
                                                                [Resposta ao Cliente]
```

## Considerações de Segurança e Boas Práticas

1. **Proteção de Dados**: Certifique-se de que o fluxo está em conformidade com as leis de proteção de dados (como LGPD no Brasil ou GDPR na Europa).

2. **Limitação de Taxa**: Configure limites de taxa para evitar sobrecarga em caso de muitos envios simultâneos.

3. **Tratamento de Erros**: Implemente tratamento adequado de erros em cada etapa do fluxo.

4. **Backup e Redundância**: Configure backups regulares da configuração do N8N e considere redundância para casos críticos.

5. **Monitoramento**: Implemente monitoramento para detectar falhas no fluxo e ser alertado quando ocorrerem.

## Conclusão

A automação configurada no N8N permite um fluxo eficiente e sem intervenção manual para captura de leads da landing page RevitaLocks. Cada vez que um visitante preenche o formulário, seus dados são automaticamente registrados na planilha do Google Sheets e um e-mail personalizado de boas-vindas é enviado, proporcionando uma experiência positiva para o cliente e facilitando o acompanhamento pela equipe de marketing.

Esta solução é escalável e pode ser facilmente adaptada para incluir etapas adicionais no futuro, como segmentação de leads, integração com CRM, ou campanhas de e-mail sequenciais.
