# Auditoria comercial e de assinaturas — Sempre em Dia

Data: 2026-11-08. Escopo: código frontend disponível no repositório; **não** inclui acesso ao painel Supabase, funções implantadas, Mercado Pago ou banco de produção.

## Confirmado por inspeção de código
- `entrar.html`: autenticação por Supabase, cadastro com nome/e-mail/senha, recuperação de senha, aceite de termos e redirecionamento pós-cadastro.
- `assets/app.js`: leitura da tabela `assinaturas`, estados `teste`, `pendente`, `ativa`, `atrasada` e `cancelada`.
- `assets/app.js`: invocação das Edge Functions `criar-assinatura`, `cancelar-assinatura` e `excluir-conta`.
- `config.js`: preço mensal R$ 19,90 e teste de 7 dias.
- `config.js`: dados jurídicos ainda são placeholders (`Sua Empresa Ltda.`, CNPJ `00.000.000/0001-00`). **Bloqueador comercial.**

## Riscos e verificações obrigatórias
1. **RLS/isolamento:** confirmar políticas de SELECT, INSERT, UPDATE e DELETE em todas as tabelas pessoais, com testes cruzados entre duas contas. Não confiar em `canWrite` no navegador como proteção de backend.
2. **Teste gratuito:** garantir criação da assinatura de teste no backend, expiração pelo horário do servidor e prevenção de reinício indevido por recriação de conta.
3. **Mercado Pago:** confirmar existência e implantação das funções, credenciais apenas no servidor, associação segura usuário-assinatura e URL de checkout validada.
4. **Webhook:** verificar assinatura/autenticidade, consulta à API do provedor quando aplicável, idempotência, repetição de eventos, pagamentos atrasados, estornos e cancelamentos.
5. **Autorização:** validar JWT e usuário em cada Edge Function, sem confiar em IDs enviados pelo cliente.
6. **Cancelamento:** validar efeitos no Mercado Pago e no banco, inclusive falha parcial e período pago restante.
7. **Exclusão de conta:** validar cancelamento da cobrança antes da exclusão e tratamento de falhas; retenção de dados segundo requisitos legais.
8. **LGPD:** confirmar base legal, tratamento de dados sensíveis de saúde, retenção, solicitações de titulares, política de privacidade e consentimento para marketing.
9. **E-mail:** verificar confirmação, recuperação de senha, URLs permitidas e entregabilidade.
10. **Observabilidade:** logs sem informações sensíveis, alertas de falhas e reconciliação de cobranças.

## Matriz de homologação (ambiente de testes)
| Cenário | Resultado esperado |
|---|---|
| Novo cadastro | Usuário autenticado, perfil e teste criados corretamente |
| Usuário A tenta ler dados de B | Negado no banco |
| Teste expira | Escritas negadas no servidor, leitura conforme política do produto |
| Checkout aprovado | Assinatura ativada somente após confirmação confiável |
| Webhook duplicado | Nenhuma duplicação de benefício/cobrança |
| Pagamento recusado | Estado consistente e comunicação apropriada |
| Cancelamento | Cobrança futura interrompida, acesso até data contratada |
| Exclusão | Cobrança interrompida, dados tratados segundo política |

## Critérios para liberar comercialização
- [ ] Dados jurídicos reais e canal de suporte confirmados
- [ ] Funções implantadas e testadas em ambiente isolado
- [ ] RLS testado com duas contas distintas
- [ ] Webhooks, estornos, atrasos e cancelamento homologados
- [ ] Política de privacidade revisada para dados financeiros e de saúde
- [ ] Testes de regressão desktop/mobile aprovados
- [ ] Métricas de conversão implantadas com conformidade LGPD

**Status: NÃO HOMOLOGADO.** Não usar este documento como atestado de segurança ou aprovação de cobrança.
