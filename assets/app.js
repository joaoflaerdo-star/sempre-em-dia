(() => {
const CATS = ['Moradia','Contas da casa','Alimentação','Transporte','Educação','Saúde','Filhos','Seguros','Assinaturas e telefonia','Lazer e viagens','Cuidados pessoais','Casa e funcionários','Impostos e taxas','Doações','Pets','Outros'];
const TIPOS_FIN = ['Imóvel','Veículo','Consórcio','Empréstimo','Outro'];
const TIPOS_INV = ['Reserva de emergência','Renda fixa (CDB, Tesouro)','Ações e FIIs','Previdência privada','Cripto','Outro'];
const ORIGENS = ['Pró-labore','Distribuição de lucros','Aluguéis','Outra'];
const FORMAS = [['pix','Pix / boleto'],['debito','Débito automático'],['dinheiro','Dinheiro']];
const CFG = window.APP_CONFIG || {};
const AREAS = ['Pessoal','Família','Trabalho','Casa','Saúde','Finanças','Estudos','Outros'];
const PRIOS = ['Alta','Média','Baixa'];
const WD = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const WD_ORDER = [1,2,3,4,5,6,0];

const MODS = {
  fin: { label:'Finanças', tabs:[['resumo','Visão geral','Resumo'],['despesas','Despesas','Despesas'],['cartoes','Cartões','Cartões'],['financiamentos','Financiamentos','Dívidas'],['investimentos','Investimentos','Investir'],['receitas','Receitas','Receitas']] },
  saude: { label:'Saúde', tabs:[['hoje','Hoje','Hoje'],['remedios','Remédios','Remédios'],['alimentacao','Alimentação','Comida'],['treinos','Treinos','Treinos']] },
  rotina: { label:'Rotina', tabs:[['pendencias','Pendências','Pendências'],['diaria','Rotina diária','Diária'],['mes','Relatório do mês','Mês']] },
  conta: { label:'Conta', tabs:[['conta','Minha conta','Conta']] }
};
const ICONS = {
  resumo:'<path d="M4 13h4v7H4zM10 8h4v12h-4zM16 4h4v16h-4z"/>',
  despesas:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h4"/>',
  cartoes:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h4"/>',
  financiamentos:'<path d="M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6"/>',
  investimentos:'<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>',
  receitas:'<path d="M12 4v12M7 11l5 5 5-5M5 20h14"/>',
  hoje:'<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  remedios:'<path d="M10.5 3.5a4.95 4.95 0 0 1 7 7l-7 7a4.95 4.95 0 0 1-7-7z"/><path d="M7 7l7 7"/>',
  alimentacao:'<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 0-3 3-3 6s1 4 3 4v8"/>',
  treinos:'<path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12"/>',
  pendencias:'<path d="M4 6l2 2 3-3M11 7h9M4 13l2 2 3-3M11 14h9M11 20h9"/>',
  diaria:'<path d="M4 12a8 8 0 0 1 14-5l2 2M20 4v5h-5M20 12a8 8 0 0 1-14 5l-2-2M4 20v-5h5"/>',
  conta:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
  mes:'<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17M8 15h2M12 15h2M16 15h.01M8 18h2"/>'
};
const DROP = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11z"/></svg>';

const SCHEMA = {
  despesas: { label:'despesa', g:'f', fields:[
    {k:'nome',l:'Descrição',t:'text',full:1,req:1},
    {k:'categoria',l:'Categoria',t:'select',opts:CATS},
    {k:'valor',l:'Valor mensal (R$)',t:'money'},
    {k:'dia',l:'Dia do vencimento',t:'day'},
    {k:'forma',l:'Como paga',t:'forma'},
    {k:'obs',l:'Observação',t:'text',full:1}]},
  cartoes: { label:'cartão', g:'m', fields:[
    {k:'nome',l:'Nome do cartão',t:'text',req:1},
    {k:'banco',l:'Banco / bandeira',t:'text'},
    {k:'limite',l:'Limite (R$)',t:'money'},
    {k:'fatura',l:'Fatura do mês (R$)',t:'money',hint:'Deixe 0 para somar as despesas lançadas neste cartão.'},
    {k:'fechamento',l:'Dia de fechamento',t:'day'},
    {k:'dia',l:'Dia do vencimento',t:'day'}]},
  financiamentos: { label:'financiamento', g:'m', fields:[
    {k:'nome',l:'Descrição',t:'text',full:1,req:1},
    {k:'tipo',l:'Tipo',t:'select',opts:TIPOS_FIN},
    {k:'instituicao',l:'Banco / instituição',t:'text'},
    {k:'valor',l:'Parcela mensal (R$)',t:'money'},
    {k:'dia',l:'Dia do vencimento',t:'day'},
    {k:'parcelasPagas',l:'Parcelas pagas',t:'int'},
    {k:'parcelasTotal',l:'Total de parcelas',t:'int'},
    {k:'saldo',l:'Saldo devedor (R$)',t:'money'},
    {k:'taxa',l:'Taxa / indexador',t:'text',hint:'Ex.: TR + 9,5% a.a., SAC'}]},
  investimentos: { label:'investimento', g:'m', fields:[
    {k:'nome',l:'Descrição',t:'text',full:1,req:1},
    {k:'tipo',l:'Tipo',t:'select',opts:TIPOS_INV},
    {k:'instituicao',l:'Corretora / banco',t:'text'},
    {k:'saldo',l:'Saldo atual (R$)',t:'money'},
    {k:'valor',l:'Aporte mensal (R$)',t:'money'},
    {k:'dia',l:'Dia do aporte',t:'day'},
    {k:'obs',l:'Observação',t:'text',full:1}]},
  receitas: { label:'receita', g:'f', fields:[
    {k:'nome',l:'Descrição',t:'text',full:1,req:1},
    {k:'origem',l:'Origem',t:'select',opts:ORIGENS},
    {k:'valor',l:'Valor mensal (R$)',t:'money'},
    {k:'dia',l:'Dia do recebimento',t:'day'}]},
  remedios: { label:'remédio', g:'m', fields:[
    {k:'nome',l:'Remédio ou suplemento',t:'text',full:1,req:1},
    {k:'dose',l:'Dose',t:'text',hint:'Ex.: 1 comprimido'},
    {k:'horarios',l:'Horários',t:'text',hint:'Separe por vírgula. Ex.: 08:00, 20:00'},
    {k:'obs',l:'Observação',t:'text',full:1,hint:'Ex.: tomar em jejum'}]},
  refeicoes: { label:'refeição', g:'f', fields:[
    {k:'nome',l:'Refeição',t:'text',req:1},
    {k:'horario',l:'Horário',t:'time'},
    {k:'plano',l:'O que comer',t:'text',full:1,hint:'Ex.: ovos, fruta e café sem açúcar'}]},
  treinos: { label:'treino', g:'m', fields:[
    {k:'nome',l:'Treino',t:'text',full:1,req:1,hint:'Ex.: Musculação – peito e tríceps'},
    {k:'dias',l:'Dias da semana',t:'weekdays',full:1},
    {k:'horario',l:'Horário',t:'time'},
    {k:'duracao',l:'Duração (min)',t:'int'},
    {k:'obs',l:'Observação',t:'text',full:1}]},
  tarefas: { label:'pendência', g:'f', fields:[
    {k:'nome',l:'O que precisa ser feito',t:'text',full:1,req:1},
    {k:'area',l:'Área',t:'select',opts:AREAS},
    {k:'prioridade',l:'Prioridade',t:'select',opts:PRIOS,def:'Média'},
    {k:'prazo',l:'Prazo',t:'date'},
    {k:'obs',l:'Observação',t:'text',full:1}]},
  rotinas: { label:'atividade', g:'f', fields:[
    {k:'nome',l:'Atividade',t:'text',full:1,req:1,hint:'Ex.: Revisar agenda do dia'},
    {k:'horario',l:'Horário',t:'time'},
    {k:'dias',l:'Dias da semana',t:'weekdays',full:1}]}
};
const COLS = Object.keys(SCHEMA);

const BRL = new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'});
const money = v => BRL.format(v||0);
const num = v => { const n = typeof v === 'number' ? v : parseFloat(v); return isFinite(n) ? n : 0; };
const int = v => Math.max(0, Math.round(num(v)));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const parseMoney = s => { s = String(s||'').replace(/[R$\s]/g,''); if (!s) return 0; if (s.includes(',')) s = s.replace(/\./g,'').replace(',', '.'); const n = parseFloat(s); return isFinite(n) ? Math.round(n*100)/100 : 0; };
const moneyInput = v => num(v) ? num(v).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}) : '';
const pad = n => String(n).padStart(2,'0');
const ymOf = d => d.getFullYear() + '-' + pad(d.getMonth()+1);
const dayOf = d => d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate());
const parseDay = s => { const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d); };
function normTime(s){ const m = String(s||'').trim().match(/^(\d{1,2})(?:[:hH](\d{2})?)?[hH]?$/); if (!m) return null; const h = +m[1], mi = +(m[2]||0); if (h > 23 || mi > 59) return null; return pad(h)+':'+pad(mi); }
const parseTimes = s => String(s||'').split(/[,;\s]+/).map(normTime).filter(Boolean).sort();
const tmin = t => { if (!t) return 9999; const [h,m] = t.split(':').map(Number); return h*60+m; };
const nowMin = () => { const n = new Date(); return n.getHours()*60 + n.getMinutes(); };
const todayStr = () => dayOf(new Date());
const fmtDM = s => { const d = parseDay(s); return pad(d.getDate()) + '/' + pad(d.getMonth()+1); };

const state = { despesas:[], cartoes:[], financiamentos:[], investimentos:[], receitas:[], remedios:[], refeicoes:[], treinos:[], tarefas:[], rotinas:[], pagos:{}, dia:{ feitos:{}, agua:0 } };
let mode = 'loading', canWrite = true;
let ym = ymOf(new Date());
let day = todayStr();

function lsGet(k, d){ try { return localStorage.getItem(k) || d; } catch { return d; } }
function lsSet(k, v){ try { localStorage.setItem(k, v); } catch {} }
let mod = 'fin';
const tabs = { fin: lsGet('pf-tab-fin', lsGet('pf-tab','resumo')), saude: lsGet('pf-tab-saude','hoje'), rotina: lsGet('pf-tab-rotina','pendencias'), conta:'conta' };
(() => {
  const h = location.hash.slice(1);
  if (MODS[h]) mod = h;
  else { const found = Object.entries(MODS).find(([,m]) => m.tabs.some(t => t[0] === h)); if (found){ mod = found[0]; tabs[mod] = h; } else mod = lsGet('pf-mod','fin'); }
  if (!MODS[mod]) mod = 'fin';
  Object.keys(tabs).forEach(m => { if (!MODS[m].tabs.some(t => t[0] === tabs[m])) tabs[m] = MODS[m].tabs[0][0]; });
})();

/* ---------- armazenamento: nuvem (Supabase) ou demonstração (navegador) ---------- */
let sb = null, uid = null, perfil = { nome:'' }, assin = null, userEmail = '';
const DEMO = new URLSearchParams(location.search).has('demo') || !CFG.supabaseUrl || /COLE_AQUI/.test(CFG.supabaseUrl);
const DKEY = 'demo-painel-v1';

function temAcesso(){
  if (DEMO) return true;
  if (!assin) return false;
  const now = Date.now(), t = s => s ? new Date(s).getTime() : 0;
  const fim = t(assin.proxima_cobranca) || t(assin.teste_ate);
  if (assin.status === 'ativa') return true;
  if (assin.status === 'teste' || assin.status === 'pendente') return t(assin.teste_ate) > now;
  if (assin.status === 'cancelada') return fim > now;
  if (assin.status === 'atrasada') return fim + 5 * 864e5 > now;
  return false;
}
function refreshAccess(){ canWrite = temAcesso(); }

let chain = Promise.resolve();
function enqueue(fn){ chain = chain.then(fn).catch(onWriteErr); return chain; }
const must = r => { if (r && r.error) throw r.error; return r; };
function onWriteErr(e){
  console.error(e);
  const code = e && e.code, msg = String((e && e.message) || '');
  if (code === '42501' || /row-level security/i.test(msg)){ canWrite = false; toast('Seu acesso está suspenso. Assine para voltar a editar.'); render(); }
  else if (/jwt|session/i.test(msg)) toast('Sua sessão expirou. Entre novamente.');
  else toast('Não foi possível salvar. Verifique a conexão e tente de novo.');
  if (!DEMO) reloadAll();
}
const normDia = d => ({ feitos: { ...((d && d.feitos) || {}) }, agua: int(d && d.agua) });
function applyReg(chave, dados){
  if (chave === 'mes:' + ym) state.pagos = { ...((dados && dados.pagos) || {}) };
  if (chave === 'dia:' + day) state.dia = normDia(dados);
  if (chave.startsWith('dia:' + ym + '-') && mesLoadedFor === ym) state.mesDias[chave.slice(4)] = normDia(dados);
}
let mesLoadedFor = '', mesLoading = false;
state.mesDias = {};
async function loadMonthDays(){
  if (mesLoading) return; mesLoading = true;
  const alvo = ym, pre = 'dia:' + alvo + '-', out = {};
  try {
    if (DEMO) Object.entries(demoData.reg).forEach(([k, v]) => { if (k.startsWith(pre)) out[k.slice(4)] = normDia(v); });
    else {
      const r = must(await sb.from('registros').select('chave,dados').gte('chave', pre + '01').lte('chave', pre + '31'));
      r.data.forEach(x => { out[x.chave.slice(4)] = normDia(x.dados); });
    }
    if (alvo === ym){ state.mesDias = out; mesLoadedFor = alvo; }
  } catch (e){ console.error(e); toast('Não foi possível carregar o relatório. Tente de novo.'); }
  mesLoading = false; render();
}

/* demonstração */
let demoData = null;
function demoSave(){ try { localStorage.setItem(DKEY, JSON.stringify(demoData)); } catch {} }
function demoInit(){
  try { demoData = JSON.parse(localStorage.getItem(DKEY)); } catch { demoData = null; }
  if (!demoData || !demoData.cols){
    demoData = { cols:{}, reg:{} };
    modeloDemo().forEach(([c, d, id]) => { (demoData.cols[c] = demoData.cols[c] || {})[id || ('d' + Math.random().toString(36).slice(2,9))] = d; });
    demoSave();
  }
  COLS.forEach(c => state[c] = Object.entries(demoData.cols[c] || {}).map(([id, d]) => ({ id, ...d })));
  perfil = { nome:'' };
  // Primeira visita do mês/dia: contas vencidas já pagas e cuidados da manhã já feitos, para a demonstração parecer um mês real.
  if (!demoData.reg['mes:' + ym]){
    const d = new Date().getDate(), pagos = {};
    flow().forEach(i => { if (i.dia && i.dia < d) pagos[i.key] = true; });
    demoData.reg['mes:' + ym] = { pagos };
  }
  if (!demoData.reg['dia:' + day]){
    const feitos = {}, n = nowMin();
    healthItems().concat(routineItems()).forEach((i, k) => { if (i.t && tmin(i.t) < n - 30){ const m = Math.min(n, tmin(i.t) + (k * 13) % 40); feitos[i.key] = pad(Math.floor(m / 60)) + ':' + pad(m % 60); } });
    demoData.reg['dia:' + day] = { feitos, agua: Math.min(8, Math.max(2, Math.floor((n - 7*60) / 90))) };
  }
  // Histórico dos dias anteriores do mês, para o relatório da demonstração.
  const hoje = new Date(), rnd = s => { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return ((h >>> 0) % 1000) / 1000; };
  for (let d = 1; d < hoje.getDate(); d++){
    const dt = ym + '-' + pad(d); if (demoData.reg['dia:' + dt]) continue;
    const feitos = {};
    healthItems(dt).concat(routineItems(dt)).forEach(i => {
      const r = rnd(dt + i.key); if (r > 0.88) return;
      if (!i.t){ feitos[i.key] = true; return; }
      const atraso = Math.round((rnd(i.key + dt + 'x') ** 2) * 95 - 12), m = Math.max(0, Math.min(1439, tmin(i.t) + atraso));
      feitos[i.key] = pad(Math.floor(m / 60)) + ':' + pad(m % 60);
    });
    demoData.reg['dia:' + dt] = { feitos, agua: 4 + Math.round(rnd(dt + 'agua') * 4) };
  }
  demoSave();
  applyReg('mes:' + ym, demoData.reg['mes:' + ym]); applyReg('dia:' + day, demoData.reg['dia:' + day]);
}

/* nuvem */
async function fetchAll(){
  const rows = [];
  for (let from = 0; ; from += 1000){
    const r = must(await sb.from('itens').select('id,colecao,dados').order('criado_em').range(from, from + 999));
    rows.push(...r.data); if (r.data.length < 1000) break;
  }
  COLS.forEach(c => state[c] = []);
  rows.forEach(r => { if (state[r.colecao]) state[r.colecao].push({ id:r.id, ...r.dados }); });
  return rows.length;
}
async function loadReg(chave){
  if (DEMO){ applyReg(chave, demoData.reg[chave]); return; }
  const r = await sb.from('registros').select('dados').eq('chave', chave).maybeSingle();
  applyReg(chave, r.data ? r.data.dados : null);
}
async function reloadAll(){
  if (DEMO || !sb) return;
  try {
    await fetchAll();
    const a = await sb.from('assinaturas').select('*').maybeSingle(); assin = a.data; refreshAccess();
    await loadReg('mes:' + ym); await loadReg('dia:' + day); render();
  } catch (e){ console.error(e); }
}
function saveItem(col, id, data, msg = 'Salvo'){
  if (id){ state[col] = state[col].map(x => x.id === id ? { id, ...data } : x); render(); }
  return enqueue(async () => {
    if (DEMO){
      const nid = id || ('d' + Math.random().toString(36).slice(2,9));
      (demoData.cols[col] = demoData.cols[col] || {})[nid] = data; demoSave();
      if (!id){ state[col].push({ id:nid, ...data }); render(); }
    } else if (id) must(await sb.from('itens').update({ dados:data }).eq('id', id));
    else {
      const r = must(await sb.from('itens').insert({ colecao:col, dados:data }).select('id').single());
      if (!state[col].some(x => x.id === r.data.id)){ state[col].push({ id:r.data.id, ...data }); render(); }
    }
    if (msg) toast(msg);
  });
}
function deleteItem(col, id){
  state[col] = state[col].filter(x => x.id !== id); render();
  return enqueue(async () => {
    if (DEMO){ delete (demoData.cols[col] || {})[id]; demoSave(); }
    else must(await sb.from('itens').delete().eq('id', id));
    toast('Excluído');
  });
}
function writeReg(chave, dados){
  return enqueue(async () => {
    if (DEMO){ demoData.reg[chave] = dados; demoSave(); return; }
    must(await sb.from('registros').upsert({ user_id:uid, chave, dados }, { onConflict:'user_id,chave' }));
  });
}
function setPaid(key, val){
  const pagos = { ...state.pagos }; if (val) pagos[key] = true; else delete pagos[key];
  state.pagos = pagos; render(); writeReg('mes:' + ym, { pagos });
}
function writeDia(next){ state.dia = next; if (day.startsWith(ym + '-') && mesLoadedFor === ym) state.mesDias[day] = next; render(); writeReg('dia:' + day, { feitos: next.feitos, agua: next.agua }); }
const nowHM = () => { const n = new Date(); return pad(n.getHours()) + ':' + pad(n.getMinutes()); };
function setDone(key, val, t){
  const f = { ...state.dia.feitos };
  if (val){ f[key] = day === todayStr() ? nowHM() : (normTime(t) || true); if (typeof f[key] === 'string') toast('Registrado às ' + f[key]); }
  else delete f[key];
  writeDia({ feitos:f, agua: state.dia.agua });
}
function setDoneTime(key, hm){ const v = normTime(hm); if (!v || !state.dia.feitos[key]) return; writeDia({ feitos:{ ...state.dia.feitos, [key]: v }, agua: state.dia.agua }); }
const fmtDelta = m => { const a = Math.abs(m); return (m < 0 ? '−' : '+') + (a >= 60 ? Math.floor(a/60) + 'h' + pad(a%60) : a + 'min'); };
function deltaPill(real, t){
  if (typeof real !== 'string' || !t) return '';
  const d = tmin(real) - tmin(t);
  return Math.abs(d) <= 30 ? '<span class="pill good">no horário</span>' : `<span class="pill ${d > 0 ? 'warn' : 'mute'}" title="${d > 0 ? 'depois' : 'antes'} do previsto">${fmtDelta(d)}</span>`;
}
const doneTime = i => { const v = state.dia.feitos[i.key]; if (!v) return '<span></span>';
  return `<input class="tdone num" type="time" data-act="donetime" data-key="${i.key}" value="${typeof v === 'string' ? v : ''}" aria-label="Horário em que fez: ${esc(i.nome)}" title="Horário registrado. Toque para corrigir." ${canWrite ? '' : 'disabled'}>`; };
function setAgua(n){ writeDia({ feitos: { ...state.dia.feitos }, agua: Math.max(0, Math.min(20, n)) }); }
function subscribeMonth(){ state.pagos = {}; loadReg('mes:' + ym).then(render); }
function subscribeDay(){ state.dia = normDia(null); loadReg('dia:' + day).then(render); }

function realtime(){
  sb.channel('painel-' + uid)
    .on('postgres_changes', { event:'*', schema:'public', table:'itens', filter:`user_id=eq.${uid}` }, p => {
      if (p.eventType === 'DELETE'){ const id = p.old && p.old.id; if (id) COLS.forEach(c => { state[c] = state[c].filter(x => x.id !== id); }); }
      else { const r = p.new, list = state[r.colecao]; if (!list) return; const v = { id:r.id, ...r.dados }; const i = list.findIndex(x => x.id === r.id); if (i >= 0) list[i] = v; else list.push(v); }
      render();
    })
    .on('postgres_changes', { event:'*', schema:'public', table:'registros', filter:`user_id=eq.${uid}` }, p => { if (p.new && p.new.chave){ applyReg(p.new.chave, p.new.dados); render(); } })
    .on('postgres_changes', { event:'*', schema:'public', table:'assinaturas', filter:`user_id=eq.${uid}` }, p => { if (p.new){ assin = p.new; refreshAccess(); render(); } })
    .subscribe();
}

async function criarModelo(){
  must(await sb.from('itens').insert(modeloInicial().map(([colecao, dados]) => ({ colecao, dados }))));
  await sb.from('perfis').update({ modelo_criado:true }).eq('user_id', uid);
  perfil.modelo_criado = true;
  await fetchAll();
}

async function init(){
  renderChrome();
  if (DEMO){ demoInit(); refreshAccess(); mode = 'demo'; render(); return; }
  if (!window.supabase){ document.getElementById('app').innerHTML = '<div class="empty">Não foi possível carregar o sistema. Verifique a internet e recarregue a página.</div>'; return; }
  sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey);
  const { data:{ session } } = await sb.auth.getSession();
  if (!session){ location.replace('entrar'); return; }
  uid = session.user.id; userEmail = session.user.email || '';
  sb.auth.onAuthStateChange(ev => { if (ev === 'SIGNED_OUT') location.replace('entrar'); });
  try {
    const [p, a] = await Promise.all([ sb.from('perfis').select('*').maybeSingle(), sb.from('assinaturas').select('*').maybeSingle() ]);
    perfil = p.data || { nome:'' }; assin = a.data; refreshAccess();
    const n = await fetchAll();
    if (!perfil.modelo_criado && n === 0 && canWrite) await criarModelo();
    await loadReg('mes:' + ym); await loadReg('dia:' + day);
  } catch (e){ console.error(e); toast('Não foi possível carregar seus dados. Recarregue a página.'); }
  mode = 'cloud'; render(); realtime();
  const qs = new URLSearchParams(location.search);
  if (qs.get('assinatura') === 'retorno'){
    history.replaceState(null, '', location.pathname);
    mod = 'conta'; render();
    toast('Pagamento em processamento. O acesso é liberado assim que o Mercado Pago confirmar.');
    setTimeout(reloadAll, 8000);
  }
}

/* ---------- conta e assinatura ---------- */
const precoTxt = () => num(CFG.precoMensal || 19.9).toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
const fmtData = s => s ? new Date(s).toLocaleDateString('pt-BR') : '—';
function planoInfo(){
  if (DEMO) return ['Demonstração', 'mute', 'Crie sua conta para guardar seus dados com segurança e usar em todos os aparelhos.'];
  if (!assin) return ['Sem assinatura', 'crit', 'Assine para usar o sistema.'];
  const dias = Math.ceil((new Date(assin.teste_ate) - Date.now()) / 864e5);
  switch (assin.status){
    case 'ativa': return ['Assinatura ativa', 'good', assin.proxima_cobranca ? `Próxima cobrança em ${fmtData(assin.proxima_cobranca)}.` : 'Cobrança mensal pelo Mercado Pago.'];
    case 'teste':
    case 'pendente':
      return dias > 0
        ? [`Teste grátis · ${dias} dia${dias > 1 ? 's' : ''}`, 'warn', `Seu teste vai até ${fmtData(assin.teste_ate)}. ${assin.status === 'pendente' ? 'Pagamento em análise pelo Mercado Pago.' : 'Assine antes para continuar sem interrupção.'}`]
        : ['Teste encerrado', 'crit', 'Seu teste grátis terminou. Assine para voltar a editar; seus dados continuam guardados.'];
    case 'atrasada': return ['Pagamento pendente', 'crit', 'O Mercado Pago não conseguiu cobrar. Atualize o cartão no Mercado Pago para manter o acesso.'];
    case 'cancelada': return temAcesso() ? ['Cancelada', 'warn', `Você pode usar até ${fmtData(assin.proxima_cobranca || assin.teste_ate)}.`] : ['Cancelada', 'crit', 'Assine de novo para voltar a editar. Seus dados continuam guardados.'];
  }
  return ['—', 'mute', ''];
}
function topBanner(){
  if (DEMO) return `<div class="banner demo" role="status"><span>Demonstração com dados de exemplo. Nada aqui é salvo na nuvem.</span><a href="entrar#criar">Criar minha conta grátis</a></div>`;
  if (mode !== 'cloud' || mod === 'conta') return '';
  if (!canWrite) return `<div class="banner crit" role="status"><span>${planoInfo()[2]}</span><button type="button" data-act="assinar">Assinar por ${precoTxt()}/mês</button></div>`;
  if (assin && assin.status === 'teste'){
    const dias = Math.ceil((new Date(assin.teste_ate) - Date.now()) / 864e5);
    if (dias > 0 && dias <= 3) return `<div class="banner" role="status"><span>Seu teste grátis termina em ${dias} dia${dias > 1 ? 's' : ''}.</span><button type="button" data-act="assinar">Assinar agora</button></div>`;
  }
  if (assin && assin.status === 'atrasada') return `<div class="banner crit" role="status"><span>${planoInfo()[2]}</span></div>`;
  return '';
}
async function callFn(name){
  const { data, error } = await sb.functions.invoke(name, { body:{} });
  if (error){
    let m = 'Não foi possível concluir agora. Tente de novo em alguns minutos.';
    try { const j = await error.context.json(); if (j && j.erro) m = j.erro; } catch {}
    throw new Error(m);
  }
  return data;
}
async function acaoConta(a, btn){
  if (a === 'assinar'){
    if (DEMO){ location.href = 'entrar#criar'; return; }
    const txt = btn.textContent; btn.disabled = true; btn.textContent = 'Abrindo o Mercado Pago…';
    try { const d = await callFn('criar-assinatura'); location.href = d.url; }
    catch (e){ toast(e.message); btn.disabled = false; btn.textContent = txt; }
  }
  if (a === 'cancelar' || a === 'excluir'){
    if (!btn.classList.contains('armed')){ btn.classList.add('armed'); btn.textContent = a === 'cancelar' ? 'Confirmar cancelamento' : 'Confirmar exclusão definitiva'; return; }
    btn.disabled = true; btn.textContent = 'Aguarde…';
    try {
      if (a === 'cancelar'){ await callFn('cancelar-assinatura'); toast('Assinatura cancelada. Você pode usar até o fim do período pago.'); await reloadAll(); }
      else { await callFn('excluir-conta'); await sb.auth.signOut(); location.replace('./?conta=excluida'); }
    } catch (e){ toast(e.message); render(); }
  }
  if (a === 'sair'){ await sb.auth.signOut(); location.replace('./'); }
  if (a === 'senha'){
    const { error } = await sb.auth.resetPasswordForEmail(userEmail, { redirectTo: new URL('entrar#nova-senha', location.href).href });
    toast(error ? 'Não foi possível enviar o e-mail agora. Tente de novo.' : 'Enviamos um link para trocar a senha no seu e-mail.');
  }
}
function vConta(){
  const [st, cl, desc] = planoInfo();
  const ativa = assin && ['ativa','atrasada'].includes(assin.status);
  return `
  <div class="sec-head"><div><h2>Minha conta</h2><p>${DEMO ? 'Você está usando a demonstração.' : esc(userEmail)}</p></div>${statusLine()}</div>
  <section class="panel"><h3>Plano</h3>
    <div class="planrow"><div class="plantxt"><span class="pill ${cl}">${st}</span><p class="note">${desc}</p></div>
      <div class="planprice"><b class="num">${precoTxt()}</b><span class="note">por mês</span></div></div>
    <div class="actions">${DEMO ? `<a class="btn primary" href="entrar#criar">Criar conta grátis</a>` : ativa ? `<button class="btn danger" type="button" data-act="cancelar">Cancelar assinatura</button>` : `<button class="btn primary" type="button" data-act="assinar">Assinar agora</button>`}</div>
    ${DEMO ? '' : '<p class="note">Pagamento processado pelo Mercado Pago. Cancele quando quiser; o acesso continua até o fim do período pago.</p>'}
  </section>
  ${DEMO ? '' : `<section class="panel"><h3>Seus dados</h3>
    <form class="quick" id="nomeForm" autocomplete="off"><input id="nomeInput" value="${esc(perfil.nome || '')}" placeholder="Como quer ser chamado" aria-label="Seu nome"><button class="btn" type="submit">Salvar nome</button></form>
    <div class="actions"><button class="btn" type="button" data-act="senha">Trocar senha</button><button class="btn" type="button" data-act="sair">Sair</button></div>
  </section>
  <section class="panel"><h3>Excluir conta</h3><p class="note">Apaga sua conta e todos os seus dados de forma definitiva e cancela a assinatura.</p>
    <div class="actions"><button class="btn danger" type="button" data-act="excluir">Excluir minha conta</button></div></section>`}
  ${CFG.emailSuporte ? `<p class="note">Precisa de ajuda? Escreva para <span class="sel">${esc(CFG.emailSuporte)}</span></p>` : ''}`;
}

/* ---------- modelos de cadastro ---------- */
const D = (nome, categoria, dia, forma = 'pix', valor = 0) => ['despesas', { nome, categoria, valor, dia, forma, obs:'' }];
function modeloInicial(){
  return [
    D('Aluguel ou condomínio','Moradia',10), D('IPTU (parcela)','Moradia',10),
    D('Energia elétrica','Contas da casa',15,'debito'), D('Água e esgoto','Contas da casa',15,'debito'), D('Gás de cozinha','Contas da casa',20), D('Internet residencial','Contas da casa',10,'debito'),
    D('Supermercado','Alimentação',5), D('Feira e hortifrúti','Alimentação',5), D('Padaria e açougue','Alimentação',5), D('Restaurantes e delivery','Alimentação',25),
    D('Combustível','Transporte',5), D('IPVA e licenciamento (parcela)','Transporte',20), D('Seguro do carro','Transporte',15), D('Manutenção do carro','Transporte',25),
    D('Mensalidade escolar','Educação',5), D('Material escolar e uniforme','Educação',10), D('Cursos e idiomas','Educação',10),
    D('Plano de saúde','Saúde',10,'debito'), D('Farmácia','Saúde',20), D('Academia','Saúde',10), D('Consultas e dentista','Saúde',20),
    D('Mesada','Filhos',1), D('Roupas e calçados das crianças','Filhos',20), D('Passeios das crianças','Filhos',25),
    D('Seguro de vida','Seguros',10,'debito'), D('Seguro residencial','Seguros',10),
    D('Plano de celular','Assinaturas e telefonia',10,'debito'), D('Streaming','Assinaturas e telefonia',15), D('Aplicativos e assinaturas','Assinaturas e telefonia',15),
    D('Lazer da família','Lazer e viagens',25), D('Reserva para viagens','Lazer e viagens',5),
    D('Cabeleireiro e cuidados pessoais','Cuidados pessoais',20), D('Roupas e calçados','Cuidados pessoais',20),
    D('Diarista ou empregada doméstica','Casa e funcionários',5), D('Encargos do eSocial doméstico','Casa e funcionários',7), D('Manutenção da casa','Casa e funcionários',25),
    D('Tarifas bancárias','Impostos e taxas',5,'debito'), D('Imposto de renda (parcela)','Impostos e taxas',30),
    D('Doações','Doações',10), D('Ração e veterinário','Pets',15),
    ['cartoes', { nome:'Cartão principal', banco:'', limite:0, fatura:0, fechamento:null, dia:null }],
    ['financiamentos', { nome:'Financiamento do imóvel', tipo:'Imóvel', instituicao:'', valor:0, dia:null, parcelasPagas:null, parcelasTotal:null, saldo:0, taxa:'' }],
    ['financiamentos', { nome:'Financiamento do carro', tipo:'Veículo', instituicao:'', valor:0, dia:null, parcelasPagas:null, parcelasTotal:null, saldo:0, taxa:'' }],
    ['investimentos', { nome:'Reserva de emergência', tipo:'Reserva de emergência', instituicao:'', saldo:0, valor:0, dia:null, obs:'Meta comum: 6 meses de despesas' }],
    ['investimentos', { nome:'Previdência privada', tipo:'Previdência privada', instituicao:'', saldo:0, valor:0, dia:null, obs:'' }],
    ['receitas', { nome:'Salário ou pró-labore', origem:'Pró-labore', valor:0, dia:5 }],
    ['receitas', { nome:'Renda extra', origem:'Outra', valor:0, dia:20 }],
    ['refeicoes', { nome:'Café da manhã', horario:'07:00', plano:'' }], ['refeicoes', { nome:'Lanche da manhã', horario:'10:00', plano:'' }],
    ['refeicoes', { nome:'Almoço', horario:'12:30', plano:'' }], ['refeicoes', { nome:'Lanche da tarde', horario:'16:00', plano:'' }],
    ['refeicoes', { nome:'Jantar', horario:'19:30', plano:'' }],
    ['rotinas', { nome:'Revisar agenda e pendências do dia', horario:'07:30', dias:[0,1,2,3,4,5,6] }],
    ['rotinas', { nome:'Conferir contas a pagar', horario:'08:00', dias:[1,2,3,4,5] }]
  ];
}
function modeloDemo(){
  const plus = n => { const d = new Date(); d.setDate(d.getDate() + n); return dayOf(d); };
  return [
    ['receitas', { nome:'Salário', origem:'Pró-labore', valor:11800, dia:5 }], ['receitas', { nome:'Aluguel de imóvel', origem:'Aluguéis', valor:2200, dia:10 }],
    D('Condomínio','Moradia',10,'pix',780), D('Energia elétrica','Contas da casa',15,'debito',340), D('Água e esgoto','Contas da casa',15,'debito',120),
    D('Internet residencial','Contas da casa',10,'debito',129.9), D('Supermercado','Alimentação',5,'pix',1650), D('Feira e hortifrúti','Alimentação',8,'pix',320),
    D('Restaurantes e delivery','Alimentação',10,'cartao:cdemo',450), D('Combustível','Transporte',5,'cartao:cdemo',520), D('Mensalidade escolar','Educação',5,'pix',1380),
    D('Plano de saúde','Saúde',10,'debito',890), D('Academia','Saúde',10,'cartao:cdemo',129), D('Streaming','Assinaturas e telefonia',15,'cartao:cdemo',79.9),
    D('Plano de celular','Assinaturas e telefonia',12,'debito',119), D('Lazer da família','Lazer e viagens',25,'pix',400),
    ['cartoes', { nome:'Cartão principal', banco:'Visa', limite:8000, fatura:0, fechamento:3, dia:10 }, 'cdemo'],
    ['financiamentos', { nome:'Financiamento do apartamento', tipo:'Imóvel', instituicao:'Banco', valor:2850, dia:15, parcelasPagas:46, parcelasTotal:360, saldo:312000, taxa:'TR + 9,5% a.a.' }],
    ['financiamentos', { nome:'Financiamento do carro', tipo:'Veículo', instituicao:'Banco', valor:1290, dia:20, parcelasPagas:22, parcelasTotal:48, saldo:29500, taxa:'1,39% a.m.' }],
    ['investimentos', { nome:'Reserva de emergência', tipo:'Reserva de emergência', instituicao:'Banco', saldo:18000, valor:500, dia:6, obs:'' }],
    ['investimentos', { nome:'Previdência privada', tipo:'Previdência privada', instituicao:'Seguradora', saldo:42000, valor:300, dia:10, obs:'' }],
    ['remedios', { nome:'Vitamina D', dose:'1 cápsula', horarios:'08:00', obs:'' }], ['remedios', { nome:'Ômega 3', dose:'2 cápsulas', horarios:'12:30', obs:'após o almoço' }],
    ['refeicoes', { nome:'Café da manhã', horario:'07:00', plano:'ovos, fruta e café sem açúcar' }], ['refeicoes', { nome:'Almoço', horario:'12:30', plano:'arroz, feijão, frango e salada' }],
    ['refeicoes', { nome:'Lanche da tarde', horario:'16:00', plano:'iogurte e castanhas' }], ['refeicoes', { nome:'Jantar', horario:'19:30', plano:'sopa ou omelete' }],
    ['treinos', { nome:'Musculação – superiores', dias:[1,3,5], horario:'06:30', duracao:60, obs:'' }], ['treinos', { nome:'Corrida leve', dias:[2,4], horario:'06:30', duracao:40, obs:'' }],
    ['tarefas', { nome:'Reunião na escola', area:'Família', prioridade:'Média', prazo:plus(0), obs:'', feita:false, feitaEm:null }],
    ['tarefas', { nome:'Renovar seguro do carro', area:'Finanças', prioridade:'Alta', prazo:plus(2), obs:'', feita:false, feitaEm:null }],
    ['tarefas', { nome:'Agendar check-up anual', area:'Saúde', prioridade:'Média', prazo:plus(6), obs:'', feita:false, feitaEm:null }],
    ['tarefas', { nome:'Organizar documentos do imposto de renda', area:'Finanças', prioridade:'Baixa', prazo:'', obs:'', feita:false, feitaEm:null }],
    ['rotinas', { nome:'Revisar agenda do dia', horario:'07:30', dias:[0,1,2,3,4,5,6] }], ['rotinas', { nome:'Conferir contas a pagar', horario:'08:00', dias:[1,2,3,4,5] }],
    ['rotinas', { nome:'Ler 20 minutos', horario:'21:30', dias:[0,1,2,3,4,5,6] }]
  ];
}

/* ---------- finance calculations ---------- */
const isCardForma = f => String(f||'').startsWith('cartao:');
function cardInfo(c){
  const itens = state.despesas.filter(d => d.forma === 'cartao:' + c.id);
  const lanc = itens.reduce((s,d) => s + num(d.valor), 0);
  const inf = num(c.fatura);
  return { itens, lanc, total: inf > 0 ? inf : lanc, informada: inf > 0 };
}
function finActive(f){ const t = int(f.parcelasTotal), p = int(f.parcelasPagas); return !(t > 0 && p >= t); }
function flow(){
  const out = [];
  state.receitas.forEach(r => out.push({ key:'receitas_'+r.id, nome:r.nome, sub:r.origem||'Receita', valor:num(r.valor), dia:int(r.dia)||null, tipo:'in' }));
  state.despesas.forEach(d => { if (!isCardForma(d.forma)) out.push({ key:'despesas_'+d.id, nome:d.nome, sub:d.categoria||'Outros', valor:num(d.valor), dia:int(d.dia)||null, tipo:'out' }); });
  state.cartoes.forEach(c => { const i = cardInfo(c); out.push({ key:'cartoes_'+c.id, nome:'Fatura ' + c.nome, sub:'Cartão de crédito', valor:i.total, dia:int(c.dia)||null, tipo:'out' }); });
  state.financiamentos.forEach(f => { if (finActive(f)) out.push({ key:'financiamentos_'+f.id, nome:f.nome, sub:'Financiamento · ' + (f.tipo||''), valor:num(f.valor), dia:int(f.dia)||null, tipo:'out', debt:true }); });
  state.investimentos.forEach(v => { if (num(v.valor) > 0) out.push({ key:'investimentos_'+v.id, nome:'Aporte · ' + v.nome, sub:'Investimento', valor:num(v.valor), dia:int(v.dia)||null, tipo:'out' }); });
  return out.sort((a,b) => (a.dia||99) - (b.dia||99) || String(a.nome).localeCompare(String(b.nome),'pt-BR'));
}
function categories(){
  const m = new Map(); const add = (k,v) => { if (v > 0) m.set(k, (m.get(k)||0) + v); };
  state.despesas.forEach(d => add(d.categoria || 'Outros', num(d.valor)));
  state.cartoes.forEach(c => { const i = cardInfo(c); if (i.informada) add('Cartões (sem detalhar)', i.total - i.lanc); });
  state.financiamentos.forEach(f => { if (finActive(f)) add('Financiamentos', num(f.valor)); });
  state.investimentos.forEach(v => add('Aportes em investimentos', num(v.valor)));
  return [...m.entries()].sort((a,b) => b[1]-a[1]);
}
function itemStatus(it){
  if (state.pagos[it.key]) return ['Pago','good'];
  const today = new Date(), cur = ymOf(today);
  if (ym < cur) return ['Atrasado','crit'];
  if (ym > cur || !it.dia) return ['Previsto','mute'];
  const d = today.getDate();
  if (it.dia < d) return ['Atrasado','crit'];
  if (it.dia - d <= 3) return [it.dia === d ? 'Vence hoje' : 'Vence em breve','warn'];
  return ['Previsto','mute'];
}
function alertItems(){
  return flow().filter(i => i.tipo === 'out' && i.valor > 0 && !state.pagos[i.key] && ['crit','warn'].includes(itemStatus(i)[1]))
    .sort((a,b) => (itemStatus(a)[1]==='crit'?0:1) - (itemStatus(b)[1]==='crit'?0:1) || (a.dia||99) - (b.dia||99));
}

/* ---------- health & routine calculations ---------- */
function healthItems(dt = day){
  const wd = parseDay(dt).getDay(); const items = [];
  state.remedios.forEach(r => { const hs = parseTimes(r.horarios); (hs.length ? hs : [null]).forEach(h => items.push({ key:'rem_'+r.id+'_'+(h ? h.replace(':','') : 'x'), tipo:'Remédio', nome:r.nome, sub:[r.dose, r.obs].filter(Boolean).join(' · '), t:h })); });
  state.refeicoes.forEach(r => items.push({ key:'ref_'+r.id, tipo:'Refeição', nome:r.nome, sub:r.plano||'', t:normTime(r.horario) }));
  state.treinos.forEach(t => { if ((t.dias||[]).includes(wd)) items.push({ key:'tre_'+t.id, tipo:'Treino', nome:t.nome, sub:[int(t.duracao) ? int(t.duracao)+' min' : '', t.obs].filter(Boolean).join(' · '), t:normTime(t.horario) }); });
  return items.sort((a,b) => tmin(a.t) - tmin(b.t) || a.nome.localeCompare(b.nome,'pt-BR'));
}
function timedStatus(key, t){
  if (state.dia.feitos[key]) return ['Feito','good'];
  const td = todayStr();
  if (day < td) return ['Não feito','crit'];
  if (day > td || !t) return ['',''];
  const diff = nowMin() - tmin(t);
  if (diff > 30) return ['Atrasado','crit'];
  if (diff >= -30) return ['Agora','warn'];
  return ['',''];
}
function routineItems(dt = day){ const wd = parseDay(dt).getDay(); return state.rotinas.filter(r => (r.dias||[]).includes(wd)).map(r => ({ key:'rot_'+r.id, nome:r.nome, t:normTime(r.horario), id:r.id })).sort((a,b) => tmin(a.t) - tmin(b.t)); }
function healthAlerts(){ if (day !== todayStr()) return 0; return healthItems().filter(i => timedStatus(i.key, i.t)[1] === 'crit').length; }
function taskAlerts(){ const td = todayStr(); return state.tarefas.filter(t => !t.feita && t.prazo && t.prazo <= td).length; }
const modBadge = m => mode === 'loading' || m === 'conta' ? 0 : m === 'fin' ? alertItems().length : m === 'saude' ? healthAlerts() : taskAlerts();

/* ---------- render ---------- */
const app = document.getElementById('app');
function renderChrome(){
  const tab = tabs[mod];
  document.getElementById('modules').innerHTML = Object.entries(MODS).map(([k,m]) => { const n = modBadge(k); return `<button type="button" data-mod="${k}" aria-current="${k===mod}">${m.label}${n && k!==mod ? `<span class="badge">${n}</span>` : ''}</button>`; }).join('');
  document.querySelector('.month').hidden = mod === 'conta';
  const lab = document.getElementById('monthLabel');
  if (isMonthView()){
    const [y,m] = ym.split('-').map(Number);
    const t = new Date(y, m-1, 1).toLocaleDateString('pt-BR',{month:'long',year:'numeric'}); lab.textContent = t.charAt(0).toUpperCase() + t.slice(1);
    document.getElementById('prevBtn').setAttribute('aria-label','Mês anterior'); document.getElementById('nextBtn').setAttribute('aria-label','Próximo mês');
  } else {
    const d = parseDay(day);
    lab.textContent = (day === todayStr() ? 'Hoje, ' : '') + d.toLocaleDateString('pt-BR',{weekday: day === todayStr() ? undefined : 'short', day:'numeric', month:'short'});
    document.getElementById('prevBtn').setAttribute('aria-label','Dia anterior'); document.getElementById('nextBtn').setAttribute('aria-label','Próximo dia');
  }
  const tabLabel = (MODS[mod].tabs.find(t => t[0] === tab) || MODS[mod].tabs[0])[1];
  document.getElementById('crumb').innerHTML = `<span>${MODS[mod].label}</span><span aria-hidden="true">/</span><b>${tabLabel}</b>`;
  renderSide();
  const n = modBadge(mod), firstTab = MODS[mod].tabs[0][0];
  document.getElementById('tabs').innerHTML = MODS[mod].tabs.map(([k,l,s]) => `<button role="tab" type="button" data-tab="${k}" aria-selected="${k===tab}" aria-label="${l}${k===firstTab&&n?` (${n} alertas)`:''}"><svg class="ti" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg><span class="tl">${l}</span><span class="ts">${s}</span>${k===firstTab&&n?`<span class="badge">${n}</span>`:''}</button>`).join('');
}
const svgIcon = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[k]}</svg>`;
function renderSide(){
  const side = document.getElementById('side'); if (!side) return;
  side.innerHTML = `
    <div class="logo"><div class="mark" aria-hidden="true"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/><path d="M8.5 15l2.5 2.5 4.5-5"/></svg></div><div><b>${esc(BRAND)}</b><small>${esc(CFG.slogan || 'Gestão pessoal')}</small></div></div>
    ${Object.entries(MODS).filter(([m]) => m !== 'conta').map(([m, M]) => { const n = modBadge(m); return `<nav class="navsec" aria-label="${M.label}"><h5><span>${M.label}</span></h5>
      ${M.tabs.map(([k,l], i) => `<button type="button" class="navitem" data-nav="${m}:${k}" ${m===mod && k===tabs[mod] ? 'aria-current="page"' : ''}>${svgIcon(k)}<span>${l}</span>${i===0 && n ? `<span class="badge">${n}</span>` : ''}</button>`).join('')}
    </nav>`; }).join('')}
    <button type="button" class="sidefoot" data-nav="conta:conta" ${mod === 'conta' ? 'aria-current="page"' : ''}><div class="avatar" aria-hidden="true">${iniciais(perfil.nome || (DEMO ? 'Visitante' : userEmail))}</div><div><b>${esc(perfil.nome || (DEMO ? 'Visitante' : 'Minha conta'))}</b><span class="pill ${planoInfo()[1]}">${mode === 'loading' ? 'Conectando…' : planoInfo()[0]}</span></div></button>`;
}
const BRAND = CFG.nome || 'Sempre em Dia';
const iniciais = t => String(t || '?').trim().split(/[\s@.]+/).filter(Boolean).slice(0,2).map(w => w[0]).join('').toUpperCase() || '?';
const BRAND_INI = iniciais(BRAND);
function greet(){ const h = new Date().getHours(); const first = String(perfil.nome || '').trim().split(/\s+/)[0]; return (h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite') + (first ? ', ' + esc(first) : ''); }
function ring(p, label, sz = 92){
  const r = (sz - 10) / 2, c = 2 * Math.PI * r, v = Math.max(0, Math.min(1, p || 0));
  return `<svg class="ring" width="${sz}" height="${sz}" viewBox="0 0 ${sz} ${sz}" role="img" aria-label="${label}: ${Math.round(v*100)}%"><circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke-width="8" class="rt"/><circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke-width="8" stroke-linecap="round" class="rv" stroke-dasharray="${(c*v).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 ${sz/2} ${sz/2})"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" class="rx">${Math.round(v*100)}%</text></svg>`;
}
const heroHtml = o => `<section class="hero"><div class="hmain"><div class="hi">${greet()}</div><div class="hl">${o.label}</div><div class="hv ${o.valueCls||''}">${o.value}</div><div class="hs">${o.subs.map(([k,v]) => `<span>${k}<b>${v}</b></span>`).join('')}</div></div><div class="hring">${ring(o.pct, o.ringCap)}<span>${o.ringCap}</span></div></section>`;
const monthName = () => { const [y,m] = ym.split('-').map(Number); return new Date(y, m-1, 1).toLocaleDateString('pt-BR',{month:'long'}); };
function bannerHtml(){
  const al = alertItems(); if (!al.length) return '';
  const late = al.filter(i => itemStatus(i)[1]==='crit').length;
  const msg = late ? `${late} conta${late>1?'s':''} atrasada${late>1?'s':''}${al.length>late?` e ${al.length-late} vencendo`:''}` : `${al.length} conta${al.length>1?'s':''} vencendo nos próximos dias`;
  return `<div class="banner ${late?'crit':''}" role="status"><span>${msg}</span><button type="button" data-tab="resumo">Ver alertas</button></div>`;
}
const VIEWS = {
  fin: { resumo:()=>vResumo(), despesas:()=>vDespesas(), cartoes:()=>vCartoes(), financiamentos:()=>vFin(), investimentos:()=>vInv(), receitas:()=>vReceitas() },
  saude: { hoje:()=>vSaudeHoje(), remedios:()=>vRemedios(), alimentacao:()=>vRefeicoes(), treinos:()=>vTreinos() },
  rotina: { pendencias:()=>vPendencias(), diaria:()=>vDiaria(), mes:()=>vMes() },
  conta: { conta:()=>vConta() }
};
function render(){
  renderChrome();
  if (mode === 'loading'){ app.innerHTML = '<div class="loading">Carregando seu painel…</div>'; return; }
  const q = document.getElementById('quickTask'); const qv = q ? q.value : ''; const qf = q && document.activeElement === q;
  const tab = tabs[mod];
  const y = window.scrollY;
  app.innerHTML = topBanner() + (mod === 'fin' && tab !== 'resumo' ? bannerHtml() : '') + (VIEWS[mod][tab] || Object.values(VIEWS[mod])[0])();
  const q2 = document.getElementById('quickTask'); if (q2){ q2.value = qv; if (qf) q2.focus(); }
  window.scrollTo(0, y);
}
const statusLine = () => DEMO
  ? `<span class="status local"><span class="dot"></span>Demonstração · dados só neste navegador</span>`
  : `<span class="status ok"><span class="dot"></span>Sincronizado${canWrite ? '' : ' · somente leitura'}</span>`;
const newLabel = col => (SCHEMA[col].g === 'm' ? 'Novo ' : 'Nova ') + SCHEMA[col].label;
const addBtn = col => canWrite ? `<button class="btn primary" type="button" data-act="add" data-col="${col}">+ ${newLabel(col)}</button>` : '';
const amt = v => num(v) ? `<span class="num">${money(v)}</span>` : `<span class="zero">a preencher</span>`;
const chk = (key, label) => `<input class="chk" type="checkbox" data-act="paid" data-key="${key}" ${state.pagos[key]?'checked':''} ${canWrite?'':'disabled'} aria-label="Marcar ${esc(label)} como pago">`;
const dchk = (key, label, t) => `<input class="chk" type="checkbox" data-act="done" data-key="${key}" data-t="${t||''}" ${state.dia.feitos[key]?'checked':''} ${canWrite?'':'disabled'} aria-label="Marcar ${esc(label)} como feito">`;
const editBtn = (col,id) => canWrite ? `<button class="edit" type="button" data-act="edit" data-col="${col}" data-id="${id}" aria-label="Editar">✎</button>` : '<span></span>';
const wdChips = dias => { const s = (dias||[]); if (s.length === 7) return '<span class="chip">Todos os dias</span>'; if (!s.length) return '<span class="chip">Sem dia definido</span>'; return WD_ORDER.filter(d => s.includes(d)).map(d => `<span class="chip">${WD[d]}</span>`).join(' '); };

function vResumo(){
  const f = flow();
  const ent = f.filter(i=>i.tipo==='in').reduce((s,i)=>s+i.valor,0);
  const outs = f.filter(i=>i.tipo==='out');
  const sai = outs.reduce((s,i)=>s+i.valor,0);
  const saldo = ent - sai;
  const divida = outs.filter(i=>i.debt).reduce((s,i)=>s+i.valor,0);
  const pct = ent > 0 ? divida/ent*100 : null;
  const pctPill = pct === null ? '<span class="pill mute">informe a renda</span>' : pct < 30 ? '<span class="pill good">saudável</span>' : pct < 40 ? '<span class="pill warn">atenção</span>' : '<span class="pill crit">alto</span>';
  const pagoV = outs.filter(i=>state.pagos[i.key]).reduce((s,i)=>s+i.valor,0);
  const pagoN = outs.filter(i=>state.pagos[i.key]).length;
  const recebido = f.filter(i=>i.tipo==='in' && state.pagos[i.key]).reduce((s,i)=>s+i.valor,0);
  const cats = categories(); const catTot = cats.reduce((s,c)=>s+c[1],0); const catMax = cats.length ? cats[0][1] : 1;
  const invest = state.investimentos.reduce((s,v)=>s+num(v.saldo),0);
  const dev = state.financiamentos.filter(finActive).reduce((s,x)=>s+num(x.saldo),0);
  const preencher = f.filter(i => !i.valor).length;
  const atrasados = outs.filter(i => itemStatus(i)[0]==='Atrasado' && i.valor > 0).length;
  const al = alertItems();
  const alHtml = al.length ? `<section class="alerts" aria-label="Alertas de pagamento">
    <div class="alerts-h ${al.some(i=>itemStatus(i)[1]==='crit')?'':'warn'}"><span>${al.length} conta${al.length>1?'s':''} pedindo atenção</span><span class="num">${money(al.reduce((s,i)=>s+i.valor,0))}</span></div>
    ${al.map(i => { const [st,cl] = itemStatus(i); return `<div class="arow"><span class="day">${i.dia?pad(i.dia):'—'}</span><span class="name"><div>${esc(i.nome)}</div><span class="subl"><span class="pill ${cl}">${st}</span></span></span><span class="amt num">${money(i.valor)}</span>${canWrite?`<button class="minibtn" type="button" data-act="pay" data-key="${i.key}">Paguei</button>`:''}</div>`; }).join('')}
  </section>` : '';

  const aportes = state.investimentos.reduce((s,v)=>s+num(v.valor),0);
  return `
  ${heroHtml({ label:'Saldo previsto de ' + monthName(), value:money(saldo), valueCls: saldo < 0 ? 'neg-h' : '', pct: sai ? pagoV/sai : 0, ringCap:`${pagoN} de ${outs.length} pagas`,
    subs:[['Entradas', money(ent)], ['Saídas', money(sai)], ['Já pago', money(pagoV)], ['Recebido', money(recebido)]] })}
  ${alHtml}
  ${preencher ? `<div class="paybar"><div class="row"><span><b>${preencher} ${preencher===1?'item está':'itens estão'} sem valor.</b> Preencha os valores nas abas para o painel refletir sua realidade.</span><span class="pill warn">a preencher</span></div></div>` : ''}
  <section class="kpis" aria-label="Indicadores do mês">
    <div class="kpi"><label>Contas no mês</label><span class="v num">${outs.length}</span><span class="sub">${atrasados ? `<b class="neg">${atrasados} atrasada${atrasados>1?'s':''}</b>` : 'Nenhuma atrasada'}</span></div>
    <div class="kpi"><label>Renda em financiamentos</label><span class="v num">${pct===null?'—':pct.toFixed(1).replace('.',',')+'%'}</span><span class="sub">${pctPill} <span class="num">${money(divida)}</span>/mês</span></div>
    <div class="kpi"><label>Investido</label><span class="v num pos">${money(invest)}</span><span class="sub">Aportes: <span class="num">${money(aportes)}</span>/mês</span></div>
    <div class="kpi"><label>Saldo devedor</label><span class="v num">${money(dev)}</span><span class="sub">Posição líquida: <span class="num">${money(invest - dev)}</span></span></div>
  </section>
  <div class="grid2">
    <section class="panel"><h3>Agenda de vencimentos</h3>
      ${f.length ? `<div class="ledger">${f.map(i => { const [st,cl] = itemStatus(i); return `
        <div class="lrow ${state.pagos[i.key]?'paid':''}">
          ${chk(i.key, i.nome)}
          <span class="day">${i.dia ? pad(i.dia) : '—'}</span>
          <span class="name"><div>${esc(i.nome)}</div><span class="subl"><small>${esc(i.sub)}</small>${st==='Previsto' ? '' : `<span class="pill ${cl}">${i.tipo==='in' && st==='Pago' ? 'Recebido' : i.tipo==='in' && st==='Atrasado' ? 'A receber' : st}</span>`}</span></span>
          <span class="amt ${i.tipo==='in'?'in':''}">${i.tipo==='in' && i.valor ? '+' : ''}${amt(i.valor)}</span>
        </div>`; }).join('')}</div>` : '<div class="empty">Nenhuma conta cadastrada ainda. Comece pela aba Despesas.</div>'}
    </section>
    <section class="panel"><h3>Para onde vai o dinheiro</h3>
      ${cats.length ? `<div class="bars">${cats.map(([k,v]) => `
        <div class="bar"><span class="lab" title="${esc(k)}">${esc(k)}</span><span class="track"><i style="width:${(v/catMax*100).toFixed(1)}%"></i></span><span class="val num">${money(v)}<small>${(v/catTot*100).toFixed(0)}%</small></span></div>`).join('')}</div>`
        : '<p class="note">Os gastos por categoria aparecem aqui assim que você preencher os valores das despesas.</p>'}
      <p class="note">A posição líquida soma aplicações e desconta dívidas; não inclui o valor de mercado de imóveis e veículos.</p>
    </section>
  </div>
  <div class="statusbar">${statusLine()}</div>`;
}

function formaLabel(f){
  if (isCardForma(f)){ const c = state.cartoes.find(x => 'cartao:'+x.id === f); return `<span class="chip card">${esc(c ? c.nome : 'Cartão')}</span>`; }
  const m = FORMAS.find(x => x[0]===f); return `<span class="chip">${m ? m[1] : 'Pix / boleto'}</span>`;
}
function vDespesas(){
  const groups = new Map(); CATS.forEach(c => groups.set(c, []));
  state.despesas.forEach(d => { const c = CATS.includes(d.categoria) ? d.categoria : 'Outros'; groups.get(c).push(d); });
  const total = state.despesas.reduce((s,d)=>s+num(d.valor),0);
  const filled = [...groups.entries()].filter(([,l]) => l.length);
  return `
  <div class="sec-head"><div><h2>Despesas da família</h2><p>Contas mensais por categoria. Despesas pagas no cartão entram na fatura do cartão escolhido e não são somadas duas vezes. Total mensal: <b class="num">${money(total)}</b></p></div>${addBtn('despesas')}</div>
  ${filled.length ? filled.map(([cat, list]) => { list.sort((a,b)=>(int(a.dia)||99)-(int(b.dia)||99)); const sub = list.reduce((s,d)=>s+num(d.valor),0); return `
    <section class="tbl"><div class="group-h"><span>${esc(cat)}</span><span class="num">${money(sub)}</span></div>
    ${list.map(d => { const key = 'despesas_'+d.id; const onCard = isCardForma(d.forma); return `
      <div class="trow ${!onCard && state.pagos[key]?'paid':''}">
        ${onCard ? '<span title="Paga na fatura do cartão" class="note">—</span>' : chk(key, d.nome)}
        <span class="nm">${esc(d.nome)}${d.obs ? `<div class="meta">${esc(d.obs)}</div>` : ''}</span>
        <span class="meta c-day">${int(d.dia) ? 'dia ' + int(d.dia) : 'sem dia'}</span>
        <span class="c-meta">${formaLabel(d.forma)}</span>
        <span class="amt">${amt(d.valor)}</span>
        ${editBtn('despesas', d.id)}
      </div>`; }).join('')}
    </section>`; }).join('') : '<div class="empty">Nenhuma despesa cadastrada. Use “+ Nova despesa” para começar.</div>'}`;
}

function vCartoes(){
  const totLim = state.cartoes.reduce((s,c)=>s+num(c.limite),0);
  const totFat = state.cartoes.reduce((s,c)=>s+cardInfo(c).total,0);
  return `
  <div class="sec-head"><div><h2>Cartões de crédito</h2><p>Faturas do mês: <b class="num">${money(totFat)}</b> · Limite total: <span class="num">${money(totLim)}</span>. Para lançar uma compra recorrente no cartão, crie a despesa e escolha o cartão em “Como paga”.</p></div>${addBtn('cartoes')}</div>
  ${state.cartoes.length ? `<div class="cards">${state.cartoes.map(c => { const i = cardInfo(c); const lim = num(c.limite); const uso = lim ? i.total/lim*100 : 0; const key='cartoes_'+c.id; return `
    <article class="ccard">
      <div class="top"><div><b>${esc(c.nome)}</b><small>${esc(c.banco||'')}</small></div>${editBtn('cartoes', c.id)}</div>
      <div><span class="note">Fatura de ${esc(document.getElementById('monthLabel').textContent)}</span><div class="big">${amt(i.total)}</div><span class="note">${i.informada ? 'Valor informado manualmente' : 'Soma das despesas lançadas'}</span></div>
      ${lim ? `<div style="display:grid;gap:4px"><div class="progress"><i style="width:${Math.min(100,uso)}%;${uso>80?'background:var(--crit)':uso>50?'background:var(--warn)':''}"></i></div><span class="note">${uso.toFixed(0)}% do limite de <span class="num">${money(lim)}</span></span></div>` : ''}
      <dl class="kv"><dt>Fechamento</dt><dd>${int(c.fechamento) ? 'dia ' + int(c.fechamento) : '—'}</dd><dt>Vencimento</dt><dd>${int(c.dia) ? 'dia ' + int(c.dia) : '—'}</dd>
      <dt>Status</dt><dd><label style="display:inline-flex;gap:6px;align-items:center">${chk(key, 'fatura '+c.nome)} ${state.pagos[key] ? 'Paga' : 'Em aberto'}</label></dd></dl>
      ${i.itens.length ? `<div class="sublist">${i.itens.map(d => `<div><span>${esc(d.nome)}</span><span class="num">${money(d.valor)}</span></div>`).join('')}</div>` : ''}
    </article>`; }).join('')}</div>` : '<div class="empty">Nenhum cartão cadastrado. Use “+ Novo cartão”.</div>'}`;
}

function vFin(){
  const act = state.financiamentos.filter(finActive);
  const parc = act.reduce((s,f)=>s+num(f.valor),0), dev = act.reduce((s,f)=>s+num(f.saldo),0);
  return `
  <div class="sec-head"><div><h2>Financiamentos</h2><p>Imóvel, carro, consórcios e empréstimos. Parcelas ativas: <b class="num">${money(parc)}</b>/mês · Saldo devedor: <span class="num">${money(dev)}</span></p></div>${addBtn('financiamentos')}</div>
  ${state.financiamentos.length ? `<div class="cards">${state.financiamentos.map(f => { const t=int(f.parcelasTotal), p=int(f.parcelasPagas); const pr = t ? p/t*100 : 0; const key='financiamentos_'+f.id; const done = !finActive(f); return `
    <article class="ccard">
      <div class="top"><div><b>${esc(f.nome)}</b><small>${esc([f.tipo, f.instituicao].filter(Boolean).join(' · '))}</small></div>${editBtn('financiamentos', f.id)}</div>
      <div><span class="note">Parcela mensal</span><div class="big">${amt(f.valor)}</div></div>
      ${t ? `<div style="display:grid;gap:4px"><div class="progress"><i style="width:${pr}%"></i></div><span class="note">${p} de ${t} parcelas pagas · faltam ${Math.max(0,t-p)}</span></div>` : '<span class="note">Informe o total de parcelas para acompanhar o progresso.</span>'}
      <dl class="kv"><dt>Saldo devedor</dt><dd>${amt(f.saldo)}</dd><dt>Vencimento</dt><dd>${int(f.dia) ? 'dia ' + int(f.dia) : '—'}</dd>${f.taxa ? `<dt>Taxa</dt><dd>${esc(f.taxa)}</dd>` : ''}
      <dt>Este mês</dt><dd>${done ? '<span class="pill good">quitado</span>' : `<label style="display:inline-flex;gap:6px;align-items:center">${chk(key, f.nome)} ${state.pagos[key] ? 'Paga' : 'Em aberto'}</label>`}</dd></dl>
    </article>`; }).join('')}</div>` : '<div class="empty">Nenhum financiamento cadastrado.</div>'}`;
}

function vInv(){
  const tot = state.investimentos.reduce((s,v)=>s+num(v.saldo),0), ap = state.investimentos.reduce((s,v)=>s+num(v.valor),0);
  const byType = new Map(); state.investimentos.forEach(v => byType.set(v.tipo||'Outro', (byType.get(v.tipo||'Outro')||0) + num(v.saldo)));
  return `
  <div class="sec-head"><div><h2>Investimentos</h2><p>Saldo investido: <b class="num">${money(tot)}</b> · Aportes programados: <span class="num">${money(ap)}</span>/mês</p></div>${addBtn('investimentos')}</div>
  ${tot ? `<section class="panel"><h3>Distribuição por tipo</h3><div class="bars">${[...byType.entries()].filter(e=>e[1]>0).sort((a,b)=>b[1]-a[1]).map(([k,v]) => `<div class="bar"><span class="lab">${esc(k)}</span><span class="track"><i style="width:${(v/tot*100).toFixed(1)}%"></i></span><span class="val num">${money(v)}<small>${(v/tot*100).toFixed(0)}%</small></span></div>`).join('')}</div></section>` : ''}
  ${state.investimentos.length ? `<section class="tbl">${state.investimentos.map(v => `
    <div class="trow">
      <span></span>
      <span class="nm">${esc(v.nome)}<div class="meta">${esc([v.tipo, v.instituicao].filter(Boolean).join(' · '))}</div></span>
      <span class="meta c-day">${num(v.valor) ? 'aporte' : ''}</span>
      <span class="c-meta meta">${num(v.valor) ? `<span class="num">${money(v.valor)}</span>/mês` : 'sem aporte mensal'}</span>
      <span class="amt">${amt(v.saldo)}</span>
      ${editBtn('investimentos', v.id)}
    </div>`).join('')}</section>` : '<div class="empty">Nenhum investimento cadastrado.</div>'}`;
}

function vReceitas(){
  const tot = state.receitas.reduce((s,r)=>s+num(r.valor),0);
  return `
  <div class="sec-head"><div><h2>Receitas</h2><p>Sua renda mensal como pessoa física. Total previsto: <b class="num">${money(tot)}</b></p></div>${addBtn('receitas')}</div>
  ${state.receitas.length ? `<section class="tbl">${state.receitas.slice().sort((a,b)=>(int(a.dia)||99)-(int(b.dia)||99)).map(r => { const key='receitas_'+r.id; return `
    <div class="trow ${state.pagos[key]?'paid':''}">
      ${chk(key, r.nome)}
      <span class="nm">${esc(r.nome)}</span>
      <span class="meta c-day">${int(r.dia) ? 'dia ' + int(r.dia) : 'sem dia'}</span>
      <span class="c-meta"><span class="chip">${esc(r.origem||'Outra')}</span></span>
      <span class="amt pos">${amt(r.valor)}</span>
      ${editBtn('receitas', r.id)}
    </div>`; }).join('')}</section>` : '<div class="empty">Nenhuma receita cadastrada.</div>'}
  <p class="note">Marque a caixa quando o valor cair na conta.</p>`;
}

/* ---------- saúde ---------- */
function vSaudeHoje(){
  const items = healthItems();
  const done = items.filter(i => state.dia.feitos[i.key]).length;
  const late = items.filter(i => timedStatus(i.key, i.t)[1] === 'crit');
  const agua = state.dia.agua, meta = 8;
  const isToday = day === todayStr();
  const next = items.find(i => !state.dia.feitos[i.key] && i.t && (!isToday || tmin(i.t) >= nowMin() - 30));
  return `
  ${heroHtml({ label: isToday ? 'Cuidados de hoje' : 'Cuidados do dia', value:`${done} de ${items.length}`, pct: items.length ? done/items.length : 0, ringCap:'concluído',
    subs:[['Água', `${agua}/${meta} copos`], ...(next ? [['Próximo', `${next.t} · ${esc(next.nome)}`]] : []), ...(late.length ? [['Em atraso', String(late.length)]] : [])] })}
  ${late.length ? `<div class="banner crit" role="status"><span>${late.length} ${late.length>1?'itens':'item'} em atraso: ${late.slice(0,3).map(i => esc(i.nome)).join(', ')}${late.length>3?'…':''}</span></div>` : ''}
  <section class="panel"><div class="sec-head"><h3>Água</h3><span class="note num">${agua * 250} ml de ${meta * 250} ml</span></div>
    <div class="water" role="group" aria-label="Copos de água">${Array.from({length:meta},(_,i)=>`<button type="button" class="drop ${i<agua?'on':''}" data-act="agua" data-n="${i+1}" aria-label="${i+1} copo${i?'s':''}" ${canWrite?'':'disabled'}>${DROP}</button>`).join('')}</div>
  </section>
  <section class="panel"><h3>Linha do dia</h3>
    ${items.length ? `<div class="ledger">${items.map(i => { const [st,cl] = timedStatus(i.key, i.t); return `
      <div class="lrow ${state.dia.feitos[i.key]?'paid':''}">
        ${dchk(i.key, i.nome, i.t)}
        <span class="day">${i.t || '—'}</span>
        <span class="name"><div>${esc(i.nome)}</div><span class="subl"><span class="chip">${i.tipo}</span>${i.sub ? `<small>${esc(i.sub)}</small>` : ''}${st && st!=='Feito' ? `<span class="pill ${cl}">${st}</span>` : deltaPill(state.dia.feitos[i.key], i.t)}</span></span>
        ${doneTime(i)}
      </div>`; }).join('')}</div>` : '<div class="empty">Nada programado para este dia. Cadastre remédios, refeições e treinos nas outras abas.</div>'}
  </section>`;
}
function vRemedios(){
  const list = state.remedios.slice().sort((a,b) => tmin(parseTimes(a.horarios)[0]) - tmin(parseTimes(b.horarios)[0]));
  const doses = list.reduce((s,r) => s + Math.max(1, parseTimes(r.horarios).length), 0);
  return `
  <div class="sec-head"><div><h2>Remédios e suplementos</h2><p>Uso diário. Cada horário vira um item na linha do dia. ${list.length ? `<b>${doses}</b> tomada${doses>1?'s':''} por dia.` : ''}</p></div>${addBtn('remedios')}</div>
  ${list.length ? `<section class="tbl">${list.map(r => { const hs = parseTimes(r.horarios); return `
    <div class="prow">
      <span></span>
      <span class="nm"><div>${esc(r.nome)}</div><span class="subl">${r.dose ? `<small>${esc(r.dose)}</small>` : ''}${hs.length ? hs.map(h => `<span class="chip num">${h}</span>`).join('') : '<span class="pill warn">sem horário</span>'}${r.obs ? `<small>${esc(r.obs)}</small>` : ''}</span></span>
      <span></span>
      ${editBtn('remedios', r.id)}
    </div>`; }).join('')}</section>` : '<div class="empty">Nenhum remédio cadastrado. Use “+ Novo remédio” e informe os horários, por exemplo 08:00, 20:00.</div>'}`;
}
function vRefeicoes(){
  const list = state.refeicoes.slice().sort((a,b) => tmin(normTime(a.horario)) - tmin(normTime(b.horario)));
  return `
  <div class="sec-head"><div><h2>Alimentação</h2><p>Seu plano de refeições do dia. Escreva o que comer em cada uma para usar como lembrete.</p></div>${addBtn('refeicoes')}</div>
  ${list.length ? `<section class="tbl">${list.map(r => `
    <div class="prow">
      <span class="day">${normTime(r.horario) || '—'}</span>
      <span class="nm"><div>${esc(r.nome)}</div>${r.plano ? `<small class="note">${esc(r.plano)}</small>` : '<small class="zero">plano a preencher</small>'}</span>
      <span></span>
      ${editBtn('refeicoes', r.id)}
    </div>`).join('')}</section>` : '<div class="empty">Nenhuma refeição cadastrada.</div>'}`;
}
function vTreinos(){
  const tw = parseDay(day).getDay();
  const mins = state.treinos.reduce((s,t) => s + int(t.duracao) * (t.dias||[]).length, 0);
  const sessions = state.treinos.reduce((s,t) => s + (t.dias||[]).length, 0);
  return `
  <div class="sec-head"><div><h2>Treinos da semana</h2><p>${sessions ? `<b>${sessions}</b> sessões por semana${mins ? ` · <b class="num">${Math.floor(mins/60)}h${pad(mins%60)}</b> de treino` : ''}. ` : ''}Toque num treino para editar.</p></div>${addBtn('treinos')}</div>
  ${state.treinos.length ? `<div class="week">${WD_ORDER.map(d => { const list = state.treinos.filter(t => (t.dias||[]).includes(d)).sort((a,b) => tmin(normTime(a.horario)) - tmin(normTime(b.horario))); return `
    <section class="wcol ${d===tw?'today':''}"><h4><span>${WD[d]}</span>${d===tw?'<span class="pill good">dia selecionado</span>':''}</h4>
      ${list.length ? list.map(t => `<button type="button" class="witem" data-act="edit" data-col="treinos" data-id="${t.id}" ${canWrite?'':'disabled'}><b>${esc(t.nome)}</b><small>${[normTime(t.horario), int(t.duracao) ? int(t.duracao)+' min' : ''].filter(Boolean).join(' · ') || 'sem horário'}</small></button>`).join('') : '<span class="note">Descanso</span>'}
    </section>`; }).join('')}</div>` : '<div class="empty">Nenhum treino cadastrado. Use “+ Novo treino” e marque os dias da semana.</div>'}`;
}

/* ---------- rotina ---------- */
function vPendencias(){
  const td = todayStr(); const lim = new Date(); lim.setDate(lim.getDate()+7); const in7 = dayOf(lim);
  const open = state.tarefas.filter(t => !t.feita);
  const pr = t => PRIOS.indexOf(t.prioridade) < 0 ? 1 : PRIOS.indexOf(t.prioridade);
  const sort = l => l.sort((a,b) => (a.prazo||'9999') < (b.prazo||'9999') ? -1 : (a.prazo||'9999') > (b.prazo||'9999') ? 1 : pr(a) - pr(b));
  const groups = [
    ['Atrasadas','crit', sort(open.filter(t => t.prazo && t.prazo < td))],
    ['Para hoje','warn', sort(open.filter(t => t.prazo === td))],
    ['Próximos 7 dias','', sort(open.filter(t => t.prazo > td && t.prazo <= in7))],
    ['Mais adiante','', sort(open.filter(t => t.prazo > in7))],
    ['Sem prazo','', sort(open.filter(t => !t.prazo))]
  ].filter(g => g[2].length);
  const done = state.tarefas.filter(t => t.feita).sort((a,b) => String(b.feitaEm||'').localeCompare(String(a.feitaEm||''))).slice(0,20);
  const row = t => { const late = t.prazo && t.prazo < td && !t.feita; return `
    <div class="prow ${t.feita?'done':''}">
      <input class="chk" type="checkbox" data-act="task" data-id="${t.id}" ${t.feita?'checked':''} ${canWrite?'':'disabled'} aria-label="Concluir ${esc(t.nome)}">
      <span class="nm"><div>${esc(t.nome)}</div><span class="subl"><span class="chip">${esc(t.area||'Pessoal')}</span>${t.prioridade==='Alta' ? '<span class="pill crit">Alta</span>' : t.prioridade==='Baixa' ? '<span class="pill mute">Baixa</span>' : ''}${t.obs ? `<small>${esc(t.obs)}</small>` : ''}</span></span>
      <span class="when ${late?'crit':''}">${t.prazo ? (t.prazo === td ? 'hoje' : fmtDM(t.prazo)) : ''}</span>
      ${editBtn('tarefas', t.id)}
    </div>`; };
  const weekAgo = dayOf(new Date(Date.now() - 7*864e5));
  const doneWeek = state.tarefas.filter(t => t.feita && t.feitaEm && String(t.feitaEm).slice(0,10) >= weekAgo).length;
  const lateN = open.filter(t => t.prazo && t.prazo < td).length, todayN = open.filter(t => t.prazo === td).length;
  const ri = routineItems(), riDone = ri.filter(i => state.dia.feitos[i.key]).length;
  return `
  ${heroHtml({ label:'Pendências em aberto', value:String(open.length), pct: ri.length ? riDone/ri.length : 0, ringCap:'rotina do dia',
    subs:[['Atrasadas', String(lateN)], ['Para hoje', String(todayN)], ['Concluídas em 7 dias', String(doneWeek)]] })}
  <div class="sec-head"><div><h2>Pendências</h2><p>${open.length} em aberto${taskAlerts() ? ` · <b class="neg">${taskAlerts()} para hoje ou atrasadas</b>` : ''}. Escreva abaixo e tecle Enter para anotar rápido; toque no lápis para pôr prazo, área e prioridade.</p></div>${addBtn('tarefas')}</div>
  ${canWrite ? `<form class="quick" id="quickForm" autocomplete="off"><input id="quickTask" placeholder="Nova pendência…" aria-label="Nova pendência"><button class="btn" type="submit">Anotar</button></form>` : ''}
  ${groups.length ? groups.map(([lab, cl, list]) => `<section class="tbl"><div class="group-h ${cl}"><span>${lab}</span><span>${list.length}</span></div>${list.map(row).join('')}</section>`).join('') : '<div class="empty">Nenhuma pendência em aberto.</div>'}
  ${done.length ? `<details class="tbl"><summary class="group-h"><span>Concluídas recentemente</span><span>${done.length} ▾</span></summary>${done.map(row).join('')}</details>` : ''}`;
}
function vDiaria(){
  const items = routineItems();
  const doneN = items.filter(i => state.dia.feitos[i.key]).length;
  const all = state.rotinas.slice().sort((a,b) => tmin(normTime(a.horario)) - tmin(normTime(b.horario)));
  return `
  <div class="sec-head"><div><h2>Rotina diária</h2><p>Responsabilidades que se repetem. ${items.length ? `<b>${doneN} de ${items.length}</b> feitas ${day===todayStr()?'hoje':'neste dia'}.` : ''}</p></div>${addBtn('rotinas')}</div>
  <section class="panel"><h3>${day===todayStr() ? 'Hoje' : esc(document.getElementById('monthLabel').textContent)}</h3>
    ${items.length ? `<div class="progress"><i style="width:${doneN/items.length*100}%"></i></div><div class="ledger">${items.map(i => { const [st,cl] = timedStatus(i.key, i.t); return `
      <div class="lrow ${state.dia.feitos[i.key]?'paid':''}">
        ${dchk(i.key, i.nome, i.t)}
        <span class="day">${i.t || '—'}</span>
        <span class="name"><div>${esc(i.nome)}</div>${st && st!=='Feito' ? `<span class="subl"><span class="pill ${cl}">${st}</span></span>` : state.dia.feitos[i.key] ? `<span class="subl">${deltaPill(state.dia.feitos[i.key], i.t)}</span>` : ''}</span>
        ${doneTime(i)}
      </div>`; }).join('')}</div>` : '<p class="note">Nenhuma atividade programada para este dia da semana.</p>'}
  </section>
  ${all.length ? `<section class="tbl"><div class="group-h"><span>Todas as atividades</span><span>${all.length}</span></div>${all.map(r => `
    <div class="prow">
      <span class="day">${normTime(r.horario) || '—'}</span>
      <span class="nm"><div>${esc(r.nome)}</div><span class="subl">${wdChips(r.dias)}</span></span>
      <span></span>
      ${editBtn('rotinas', r.id)}
    </div>`).join('')}</section>` : ''}`;
}

/* ---------- relatório do mês ---------- */
function monthStats(){
  const [y, m] = ym.split('-').map(Number), dim = new Date(y, m, 0).getDate();
  const hoje = new Date(), cur = ymOf(hoje), td = todayStr();
  const ultimo = ym < cur ? dim : ym === cur ? hoje.getDate() : 0;
  const dias = [], itens = new Map(); let prev = 0, feitos = 0, comHora = 0, noHorario = 0, aguaSoma = 0, aguaDias = 0;
  const por = { 'Remédio':[0,0], 'Refeição':[0,0], 'Treino':[0,0], 'Rotina':[0,0] };
  for (let d = 1; d <= dim; d++){
    const dt = ym + '-' + pad(d);
    if (d > ultimo){ dias.push({ d, dt, futuro:true }); continue; }
    const rec = dt === day ? state.dia : (state.mesDias[dt] || { feitos:{}, agua:0 });
    const lista = healthItems(dt).concat(routineItems(dt).map(r => ({ ...r, tipo:'Rotina' })))
      .filter(i => dt < td || rec.feitos[i.key] || !i.t || tmin(i.t) <= nowMin() - 30);
    let f = 0;
    lista.forEach(i => {
      const v = rec.feitos[i.key], base = i.key;
      const st = itens.get(base) || itens.set(base, { nome:i.nome, tipo:i.tipo, t:i.t, prev:0, feitos:0, reais:[], noHorario:0 }).get(base);
      st.prev++; prev++; por[i.tipo][1]++;
      if (v){
        st.feitos++; feitos++; f++; por[i.tipo][0]++;
        if (typeof v === 'string' && i.t){ const dif = tmin(v) - tmin(i.t); st.reais.push(tmin(v)); comHora++; if (Math.abs(dif) <= 30){ st.noHorario++; noHorario++; } }
      }
    });
    if (rec.agua){ aguaSoma += rec.agua; } aguaDias++;
    dias.push({ d, dt, prev:lista.length, feitos:f, agua:rec.agua || 0 });
  }
  const pagosN = flow().filter(i => i.tipo === 'out' && state.pagos[i.key]);
  const contasOut = flow().filter(i => i.tipo === 'out');
  const tarefasMes = state.tarefas.filter(t => t.feita && String(t.feitaEm || '').startsWith(ym));
  return { dim, ultimo, dias, itens:[...itens.values()], prev, feitos, comHora, noHorario, por, aguaMedia: aguaDias ? aguaSoma / aguaDias : 0,
    contasPagas: pagosN.length, contasTotal: contasOut.length, valorPago: pagosN.reduce((s, i) => s + i.valor, 0), tarefasFeitas: tarefasMes.length };
}
const hmOf = m => pad(Math.floor(m / 60)) + ':' + pad(Math.round(m % 60));
const pctTxt = (a, b) => b ? Math.round(a / b * 100) + '%' : '—';
function vMes(){
  if (mesLoadedFor !== ym){ setTimeout(loadMonthDays, 0); return '<div class="loading">Montando o relatório do mês…</div>'; }
  const S = monthStats(), nomeMes = monthName();
  if (!S.ultimo) return `<div class="empty">O relatório de ${nomeMes} aparece a partir do primeiro dia do mês.</div>`;
  const nivel = p => p === null ? 0 : p >= .9 ? 4 : p >= .7 ? 3 : p >= .4 ? 2 : p > 0 ? 1 : 0;
  const [y, m] = ym.split('-').map(Number), primeiroDow = (new Date(y, m - 1, 1).getDay() + 6) % 7;
  const cal = Array.from({ length: primeiroDow }, () => '<span class="cal-x"></span>').join('') + S.dias.map(x => {
    if (x.futuro) return `<span class="cal-d fut"><b>${x.d}</b></span>`;
    const p = x.prev ? x.feitos / x.prev : null;
    return `<span class="cal-d h${nivel(p)} ${x.dt === todayStr() ? 'hoje' : ''}" title="${pad(x.d)}/${pad(m)}: ${x.feitos} de ${x.prev} itens · ${x.agua} copos de água"><b>${x.d}</b><small>${p === null ? '' : Math.round(p * 100) + '%'}</small></span>`;
  }).join('');
  const tipos = ['Remédio', 'Refeição', 'Treino', 'Rotina'];
  const tabela = tipos.map(tp => {
    const l = S.itens.filter(i => i.tipo === tp).sort((a, b) => tmin(a.t) - tmin(b.t)); if (!l.length) return '';
    return `<section class="tbl"><div class="group-h"><span>${tp === 'Remédio' ? 'Remédios' : tp === 'Refeição' ? 'Refeições' : tp === 'Treino' ? 'Treinos' : 'Rotina diária'}</span><span>${pctTxt(S.por[tp][0], S.por[tp][1])} cumprido</span></div>
      <div class="mrow mhead"><span>Item</span><span>Previsto</span><span>Média real</span><span>Feito</span><span>No horário</span></div>
      ${l.map(i => { const media = i.reais.length ? i.reais.reduce((a, b) => a + b, 0) / i.reais.length : null; const dif = media !== null && i.t ? Math.round(media - tmin(i.t)) : null; return `
      <div class="mrow"><span class="nm">${esc(i.nome)}</span><span class="num">${i.t || '—'}</span>
        <span class="num">${media === null ? '—' : hmOf(media)}${dif !== null && Math.abs(dif) > 30 ? ` <small class="${dif > 0 ? 'neg' : ''}">${fmtDelta(dif)}</small>` : ''}</span>
        <span class="mbar"><span class="progress"><i style="width:${i.prev ? i.feitos / i.prev * 100 : 0}%"></i></span><small class="num">${i.feitos}/${i.prev}</small></span>
        <span class="num">${i.reais.length ? pctTxt(i.noHorario, i.reais.length) : '—'}</span></div>`; }).join('')}
    </section>`;
  }).join('');
  const aguaMax = 8, ate = S.dias.filter(x => !x.futuro);
  const agua = ate.map(x => `<span class="wbar" title="${pad(x.d)}/${pad(m)}: ${x.agua} copos"><i style="height:${Math.min(100, x.agua / aguaMax * 100)}%" class="${x.agua >= aguaMax ? 'ok' : ''}"></i></span>`).join('');
  return `
  ${heroHtml({ label:'Rotina de ' + nomeMes, value:`${S.feitos} de ${S.prev}`, pct: S.prev ? S.feitos / S.prev : 0, ringCap:'cumprido',
    subs:[['No horário', pctTxt(S.noHorario, S.comHora)], ['Treinos', `${S.por['Treino'][0]}/${S.por['Treino'][1]}`], ['Remédios', pctTxt(S.por['Remédio'][0], S.por['Remédio'][1])], ['Água', S.aguaMedia.toFixed(1).replace('.', ',') + ' copos/dia']] })}
  <section class="kpis" aria-label="Resumo do mês">
    <div class="kpi"><label>Refeições</label><span class="v num">${pctTxt(S.por['Refeição'][0], S.por['Refeição'][1])}</span><span class="sub">${S.por['Refeição'][0]} de ${S.por['Refeição'][1]} registradas</span></div>
    <div class="kpi"><label>Rotina diária</label><span class="v num">${pctTxt(S.por['Rotina'][0], S.por['Rotina'][1])}</span><span class="sub">${S.por['Rotina'][0]} de ${S.por['Rotina'][1]} atividades</span></div>
    <div class="kpi"><label>Pendências concluídas</label><span class="v num">${S.tarefasFeitas}</span><span class="sub">em ${nomeMes}</span></div>
    <div class="kpi"><label>Contas pagas</label><span class="v num">${S.contasPagas} de ${S.contasTotal}</span><span class="sub num">${money(S.valorPago)}</span></div>
  </section>
  <div class="grid2">
    <section class="panel"><div class="sec-head"><h3>Dia a dia</h3><span class="legend"><span class="cal-d h1"></span><span class="cal-d h2"></span><span class="cal-d h3"></span><span class="cal-d h4"></span> mais cumprido</span></div>
      <div class="cal">${['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map(w => `<span class="cal-w">${w}</span>`).join('')}${cal}</div>
    </section>
    <section class="panel"><div class="sec-head"><h3>Água por dia</h3><span class="note">meta de ${aguaMax} copos</span></div>
      <div class="wchart" style="--n:${ate.length}">${agua}</div>
      <div class="wscale note"><span>dia 1</span><span>dia ${S.ultimo}</span></div>
    </section>
  </div>
  <div class="sec-head"><div><h2>Item por item</h2><p>Horário médio em que você fez cada item, comparado com o previsto. "No horário" é até 30 minutos de diferença.</p></div></div>
  ${tabela || '<div class="empty">Cadastre remédios, refeições, treinos e rotina para o relatório aparecer.</div>'}
  <p class="note">O relatório usa a lista atual de remédios, refeições, treinos e rotina para calcular o que estava previsto em cada dia.</p>`;
}

/* ---------- modal ---------- */
const modalRoot = document.getElementById('modalRoot');
let modalCtx = null;
function openForm(col, id){
  if (!canWrite){ toast('Seu acesso está suspenso. Assine para voltar a editar.'); return; }
  const sc = SCHEMA[col]; const item = id ? state[col].find(x => x.id === id) || {} : {};
  modalCtx = { col, id };
  const fieldHtml = f => {
    const v = item[f.k]; const fid = 'f-' + f.k;
    let input;
    if (f.t === 'select') input = `<select id="${fid}">${f.opts.map(o => `<option ${o===(v||f.def)?'selected':''}>${esc(o)}</option>`).join('')}</select>`;
    else if (f.t === 'forma') input = `<select id="${fid}">${FORMAS.map(([k,l]) => `<option value="${k}" ${k===(v||'pix')?'selected':''}>${l}</option>`).join('')}${state.cartoes.map(c => `<option value="cartao:${c.id}" ${v==='cartao:'+c.id?'selected':''}>Cartão: ${esc(c.nome)}</option>`).join('')}</select>`;
    else if (f.t === 'money') input = `<input id="${fid}" inputmode="decimal" placeholder="0,00" value="${moneyInput(v)}">`;
    else if (f.t === 'day') input = `<input id="${fid}" type="number" min="1" max="31" inputmode="numeric" value="${int(v)||''}">`;
    else if (f.t === 'int') input = `<input id="${fid}" type="number" min="0" inputmode="numeric" value="${v===undefined||v===null||v===''?'':int(v)}">`;
    else if (f.t === 'time') input = `<input id="${fid}" type="time" value="${normTime(v)||''}">`;
    else if (f.t === 'date') input = `<input id="${fid}" type="date" value="${esc(v||'')}">`;
    else if (f.t === 'weekdays'){ const sel = Array.isArray(v) ? v : [0,1,2,3,4,5,6]; input = `<div class="wdpick" id="${fid}" role="group" aria-label="${f.l}">${WD_ORDER.map(d => `<label><input type="checkbox" id="${fid}-${d}" value="${d}" ${sel.includes(d)?'checked':''}><span>${WD[d]}</span></label>`).join('')}</div>`; }
    else input = `<input id="${fid}" value="${esc(v||'')}" ${f.req?'required':''} autocomplete="off">`;
    const lbl = f.t === 'weekdays' ? `<label>${f.l}</label>` : `<label for="${fid}">${f.l}</label>`;
    return `<div class="field ${f.full?'full':''}">${lbl}${input}${f.hint?`<span class="hint">${f.hint}</span>`:''}</div>`;
  };
  const title = id ? 'Editar ' + sc.label : newLabel(col);
  modalRoot.innerHTML = `<div class="overlay" data-act="close-bg"><form class="modal" id="mform" aria-label="${title}">
    <h2>${title.charAt(0).toUpperCase() + title.slice(1)}</h2>
    <div class="form">${sc.fields.map(fieldHtml).join('')}</div>
    <div class="mfoot">${id ? '<button type="button" class="btn danger spacer" data-act="del">Excluir</button>' : ''}<button type="button" class="btn" data-act="close">Cancelar</button><button type="submit" class="btn primary">Salvar</button></div>
  </form></div>`;
  const first = modalRoot.querySelector('input:not([type=checkbox]),select'); if (first && window.matchMedia('(min-width: 641px)').matches) first.focus();
}
function closeModal(){ modalRoot.innerHTML = ''; modalCtx = null; }
modalRoot.addEventListener('submit', e => {
  e.preventDefault(); if (!modalCtx) return;
  const { col, id } = modalCtx;
  const prev = id ? (state[col].find(x => x.id === id) || {}) : {};
  const data = {}; Object.keys(prev).forEach(k => { if (k !== 'id') data[k] = prev[k]; });
  for (const f of SCHEMA[col].fields){
    const el = document.getElementById('f-' + f.k);
    if (f.t === 'weekdays'){ data[f.k] = [...el.querySelectorAll('input:checked')].map(i => +i.value).sort(); continue; }
    const raw = el.value;
    if (f.t === 'money') data[f.k] = parseMoney(raw);
    else if (f.t === 'day'){ const n = int(raw); data[f.k] = n >= 1 && n <= 31 ? n : null; }
    else if (f.t === 'int') data[f.k] = raw === '' ? null : int(raw);
    else if (f.t === 'time') data[f.k] = normTime(raw) || '';
    else data[f.k] = raw.trim();
  }
  if (col === 'tarefas' && !id){ data.feita = false; data.feitaEm = null; }
  if (!data.nome){ toast('Dê um nome ao item antes de salvar.'); return; }
  closeModal(); saveItem(col, id, data);
});
modalRoot.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  const a = t.dataset.act;
  if (a === 'close' || (a === 'close-bg' && e.target === t)) closeModal();
  if (a === 'del'){
    if (!t.classList.contains('armed')){ t.classList.add('armed'); t.textContent = 'Confirmar exclusão'; return; }
    const { col, id } = modalCtx; closeModal(); deleteItem(col, id);
  }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modalCtx) closeModal(); });

/* ---------- events ---------- */
const isMonthView = () => mod === 'fin' || (mod === 'rotina' && tabs.rotina === 'mes');
function shiftDate(dir){
  if (isMonthView()){ const [y,m] = ym.split('-').map(Number); ym = ymOf(new Date(y, m-1 + dir, 1)); subscribeMonth(); mesLoadedFor = ''; state.mesDias = {}; }
  else { const d = parseDay(day); d.setDate(d.getDate() + dir); day = dayOf(d); subscribeDay(); }
  render();
}
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act],[data-tab],[data-mod],[data-nav]'); if (!t || modalRoot.contains(t)) return;
  if (t.dataset.nav){ const [m,k] = t.dataset.nav.split(':'); mod = m; tabs[m] = k; lsSet('pf-mod', m); lsSet('pf-tab-' + m, k); render(); window.scrollTo(0,0); return; }
  if (t.dataset.mod){ mod = t.dataset.mod; lsSet('pf-mod', mod); render(); window.scrollTo(0,0); return; }
  if (t.dataset.tab){ tabs[mod] = t.dataset.tab; lsSet('pf-tab-' + mod, t.dataset.tab); render(); window.scrollTo(0,0); return; }
  const a = t.dataset.act;
  if (a === 'prev') shiftDate(-1);
  if (a === 'next') shiftDate(1);
  if (a === 'today'){ const n = new Date(); if (isMonthView()){ if (ym !== ymOf(n)){ ym = ymOf(n); subscribeMonth(); mesLoadedFor = ''; state.mesDias = {}; } } else if (day !== todayStr()){ day = todayStr(); subscribeDay(); } render(); }
  if (['assinar','cancelar','excluir','sair','senha'].includes(a)){ acaoConta(a, t); return; }
  if (a === 'pay'){ setPaid(t.dataset.key, true); toast('Marcado como pago'); }
  if (a === 'agua'){ const n = +t.dataset.n; setAgua(n === state.dia.agua ? n - 1 : n); }
  if (a === 'add') openForm(t.dataset.col);
  if (a === 'edit') openForm(t.dataset.col, t.dataset.id);
});
document.addEventListener('change', e => {
  const t = e.target; if (!t.dataset || modalRoot.contains(t)) return;
  if (t.dataset.act === 'paid') setPaid(t.dataset.key, t.checked);
  if (t.dataset.act === 'done') setDone(t.dataset.key, t.checked, t.dataset.t);
  if (t.dataset.act === 'donetime') setDoneTime(t.dataset.key, t.value);
  if (t.dataset.act === 'task'){
    const it = state.tarefas.find(x => x.id === t.dataset.id); if (!it) return;
    const data = {}; Object.keys(it).forEach(k => { if (k !== 'id') data[k] = it[k]; });
    data.feita = t.checked; data.feitaEm = t.checked ? new Date().toISOString() : null;
    if (mode === 'db'){ state.tarefas = state.tarefas.map(x => x.id === it.id ? { ...x, feita:data.feita, feitaEm:data.feitaEm } : x); render(); }
    saveItem('tarefas', it.id, data, t.checked ? 'Concluída' : 'Reaberta');
  }
});
document.addEventListener('submit', async e => {
  if (e.target.id === 'nomeForm'){
    e.preventDefault(); const v = document.getElementById('nomeInput').value.trim().slice(0, 80);
    const r = await sb.from('perfis').update({ nome:v }).eq('user_id', uid);
    if (r.error) toast('Não foi possível salvar o nome.'); else { perfil.nome = v; toast('Nome salvo'); render(); }
    return;
  }
  if (e.target.id !== 'quickForm') return;
  e.preventDefault();
  const inp = document.getElementById('quickTask'); const v = inp.value.trim(); if (!v) return;
  inp.value = '';
  saveItem('tarefas', null, { nome:v, area:'Pessoal', prioridade:'Média', prazo:'', obs:'', feita:false, feitaEm:null }, 'Anotada');
});

let toastTimer;
function toast(msg){
  const r = document.getElementById('toastRoot'); r.innerHTML = `<div class="toast" role="status">${esc(msg)}</div>`;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { r.innerHTML = ''; }, 2600);
}

setInterval(() => {
  const ae = document.activeElement;
  if (modalCtx || (ae && ['INPUT','SELECT','TEXTAREA'].includes(ae.tagName) && ae.type !== 'checkbox')) return;
  render();
}, 60000);

init();
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
