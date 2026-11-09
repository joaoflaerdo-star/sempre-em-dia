# Plano de endurecimento — webhook Mercado Pago

**Status: revisão de código por capturas de tela; não homologado e não implantado.**

## Evidências observadas
- O webhook lê `MP_WEBHOOK_SECRET`, mas só valida a assinatura quando o segredo existe. **Falha crítica: comportamento fail-open.**
- `MP_ACCESS_TOKEN` é utilizado para consultar a API do Mercado Pago; sua presença não foi confirmada.
- O webhook consulta o recurso de assinatura no provedor antes de alterar a tabela local.
- `admin.from('assinaturas').update(...).eq('user_id', userId)` não verifica `error` nem quantidade de linhas afetadas.
- A condição que ignora IDs divergentes possui exceção para o estado `ativa`; assinaturas antigas podem disputar o estado atual.
- O estado é atualizado por notificações sem mecanismo explícito de ordenação/versão ou reconciliação.
- O HMAC é comparado por igualdade de strings.

## Correções exigidas antes de publicar
1. **Falhar fechado**: verificar `MP_WEBHOOK_SECRET`, `MP_ACCESS_TOKEN`, URL e chave de serviço antes de processar eventos. Nunca publicar valores em logs.
2. **Autenticidade**: exigir `x-signature`, `x-request-id`, `data.id`; validar o manifesto exatamente conforme a documentação atual do Mercado Pago. Usar comparação em tempo constante, rejeitar assinaturas inválidas e limitar janela temporal se compatível com a política do provedor.
3. **Tipo e origem**: aceitar apenas tópicos esperados, IDs bem formados e eventos recuperáveis na API oficial. Não confiar em `external_reference` sem checar o vínculo da assinatura com o usuário.
4. **Persistência**: inspecionar `error` e o número de linhas atualizadas; responder 5xx a falhas transitórias para permitir nova entrega.
5. **Assinaturas concorrentes**: estabelecer uma única assinatura vigente por usuário, com transição explícita e atômica entre IDs. Nunca aceitar uma assinatura antiga somente por estar `authorized`.
6. **Idempotência**: usar identificador de evento e/ou atualização transacional condicionada; reconciliar estado diretamente com Mercado Pago, sem aplicar cegamente eventos atrasados.
7. **Estado financeiro**: definir regras para teste, cobrança inicial, aprovação, recusa, atraso, cancelamento, reembolso e chargeback; separar estado da assinatura de estado de cada pagamento.
8. **Operação**: configurar alertas, logs sem PII, política de retries, limites de taxa e plano de rollback.
9. **Homologação**: testar em ambiente isolado com credenciais de teste; nunca fazer POSTs manuais na função de produção para simular aprovação.

## Matriz mínima de testes
| Cenário | Esperado |
|---|---|
| Segredo ausente | Rejeição sem qualquer escrita |
| Assinatura HMAC inválida | HTTP 401 e nenhuma escrita |
| Token Mercado Pago ausente | Nenhuma escrita; falha operacional visível |
| Evento legítimo duplicado | Estado final único e consistente |
| Evento antigo após cancelamento | Não reativar indevidamente |
| Assinatura anterior ativa | Não substituir assinatura vigente sem transição autorizada |
| Erro de atualização no Supabase | Não responder sucesso silenciosamente |
| Evento de tipo inesperado | Ignorar com registro mínimo |
| Pagamento recusado / estorno | Estado e acesso consistentes com política definida |

## Pendências de configuração
- [ ] Confirmar **existência**, não valor, de `MP_WEBHOOK_SECRET` em Supabase → Edge Functions → Secrets
- [ ] Confirmar **existência**, não valor, de `MP_ACCESS_TOKEN`
- [ ] Confirmar no Mercado Pago a URL de notificação e o segredo correspondente
- [ ] Obter código-fonte integral das funções do backend em repositório privado ou exportação segura
- [ ] Auditar políticas RLS, funções de criação/cancelamento e integridade da tabela `assinaturas`

**Regra de implantação:** nenhuma mudança em produção sem revisão, testes e plano de rollback.
