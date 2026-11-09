/* Métricas de intenção: sem cookies, identificadores ou envio externo.
   Integre a um provedor analítico somente após consentimento e revisão LGPD. */
(function(){
  var links=document.querySelectorAll('a[href*="entrar"],a[href*="demo=1"]');
  links.forEach(function(link){
    link.addEventListener('click',function(){
      var type=link.href.indexOf('demo=1')>=0?'demo_click':'signup_click';
      window.dispatchEvent(new CustomEvent('sed:conversion',{detail:{event:type,location:location.pathname}}));
    });
  });
})();
