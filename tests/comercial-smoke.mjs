// Verificação estática do funil comercial. Execute: node tests/comercial-smoke.mjs
import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const index=read('index.html'),auth=read('entrar.html'),config=read('config.js'),css=read('assets/comercial-v1.css');
for(const path of ['app.html','assets/comercial-v1.js','assets/site.css','privacidade.html','termos.html']) assert.ok(existsSync(new URL('../'+path,import.meta.url)),path+' ausente');
for(const path of ['./entrar#criar','./app?demo=1','./config.js','./assets/comercial-v1.css']) assert.ok(index.includes(path),'Landing sem '+path);
assert.ok(index.includes('id="como-funciona"'),'Onboarding comercial ausente');
assert.ok(index.includes('sed-mobile-cta')&&css.includes('.sed-mobile-cta'),'CTA móvel ausente');
assert.ok(auth.includes('id="v-criar"')&&auth.includes('id="ct"'),'Cadastro ou aceite dos termos ausente');
assert.ok(/precoMensal:\s*19\.90/.test(config),'Preço atual mudou sem validação');
assert.ok(/diasTeste:\s*7\b/.test(config),'Período de teste mudou sem validação');
console.log('OK: arquivos, CTA, demonstração, cadastro, termos, preço e teste preservados.');
