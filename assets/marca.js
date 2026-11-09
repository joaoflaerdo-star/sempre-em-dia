// Preenche nome, preço, empresa e contato a partir do config.js nas páginas públicas.
(function () {
  var c = window.APP_CONFIG || {};
  var nome = c.nome || 'Sempre em Dia';
  var ini = nome.trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
  var preco = Number(c.precoMensal || 19.9).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  var emp = c.empresa || {};
  var set = function (sel, v) { document.querySelectorAll(sel).forEach(function (e) { e.textContent = v; }); };
  set('[data-brand]', nome);
  document.querySelectorAll('[data-brand-ini]').forEach(function (e) { e.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M8 3v4M16 3v4M3.5 10h17"/><path d="M8.5 15l2.5 2.5 4.5-5"/></svg>'; });
  set('[data-preco]', preco);
  set('[data-dias]', String(c.diasTeste || 7));
  set('[data-empresa]', [emp.razaoSocial, emp.cnpj ? 'CNPJ ' + emp.cnpj : ''].filter(Boolean).join(' · '));
  set('[data-suporte]', c.emailSuporte || '');
  set('#ano', String(new Date().getFullYear()));
  if (document.title && document.title.toLocaleLowerCase().indexOf(nome.toLocaleLowerCase()) < 0) document.title = nome + ' · ' + document.title;
})();
