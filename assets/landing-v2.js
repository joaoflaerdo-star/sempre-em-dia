/* UTM-aware anchor navigation. No tracking or data collection. */
(() => {
  const allowed = new Set(['financas','saude','rotina']);
  const params = new URLSearchParams(location.search);
  const section = (params.get('area') || '').toLowerCase();
  if (!location.hash && allowed.has(section)) {
    window.addEventListener('load', () => {
      const target = document.getElementById(section);
      if (target) target.scrollIntoView({behavior:'smooth',block:'start'});
    }, {once:true});
  }
})();
