/* =========================================================================
   CONFIGURAÇÃO DO PRODUTO — o único arquivo que você precisa editar.
   Depois de criar o projeto no Supabase, cole aqui a URL e a chave "anon".
   Enquanto estiver "COLE_AQUI", o sistema abre em modo demonstração.
   ========================================================================= */
window.APP_CONFIG = {
  nome: 'Sempre em Dia',                    // nome do produto (aparece no site e no app)
  slogan: 'Finanças, saúde e rotina da família', // frase curta abaixo do nome
  supabaseUrl: 'https://wotzzthgxiygpwjyexwk.supabase.co',                 // ex.: https://abcdefgh.supabase.co
  supabaseAnonKey: 'sb_publishable_4L9unmX1u9AsB4p8qVKOFw_sv1gkiNC',             // Project Settings > API > anon public
  precoMensal: 19.90,                       // precisa ser igual ao PRECO_MENSAL das funções
  diasTeste: 7,
  emailSuporte: 'suporte@sempreemdia.com.br',
  empresa: {
    razaoSocial: 'Sua Empresa Ltda.',
    cnpj: '00.000.000/0001-00',
    cidade: 'Fortaleza/CE'
  }
};
