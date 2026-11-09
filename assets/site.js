// A demonstração é o próprio aplicativo, aberto exclusivamente em modo local.
(function () {
  if (new URLSearchParams(location.search).get('conta') === 'excluida') {
    var notice = document.getElementById('excluida');
    if (notice) notice.hidden = false;
  }
  var frame = document.getElementById('liveDemo');
  var full = document.getElementById('demoFull');
  document.querySelectorAll('[data-demo]').forEach(function (button) {
    button.addEventListener('click', function () {
      var area = button.dataset.demo;
      if (!['fin', 'saude', 'rotina'].includes(area)) return;
      var target = './app.html?demo=1&area=' + area + '#' + area;
      // Recarregar é necessário: a navegação inicial do aplicativo lê o fragmento.
      frame.src = target;
      full.href = target;
      document.querySelectorAll('[data-demo]').forEach(function (other) {
        var selected = other === button;
        other.classList.toggle('is-active', selected);
        other.setAttribute('aria-pressed', String(selected));
      });
    });
  });
  var contact = window.APP_CONFIG && window.APP_CONFIG.emailSuporte;
  if (contact && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
    document.querySelectorAll('[data-support-link]').forEach(function (a) {
      a.href = 'mailto:' + contact;
    });
  }
})();
