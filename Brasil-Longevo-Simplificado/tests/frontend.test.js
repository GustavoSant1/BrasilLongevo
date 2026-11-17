'use strict';
// Valida os módulos do navegador sem instalar ferramentas de build.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const {spawnSync}=require('node:child_process');
const DIR=join(__dirname,'../public/js');

test('frontend: sintaxe de todos os módulos ES',()=>{
 for(const file of ['app.js','views.js','forms.js','api.js','utils.js','ui.js',
  'pages/dashboard.js','pages/patients.js','pages/appointments.js',
  'pages/occurrences.js','pages/reports.js','pages/settings.js']){
  const source=readFileSync(join(DIR,file),'utf8');
  const check=spawnSync(process.execPath,['--check','--input-type=module'],{input:source,encoding:'utf8'});
  assert.equal(check.status,0,`${file}: ${check.stderr}`);
 }
});

test('frontend: seis telas renderizam, sem medicamentos',async()=>{
 const {loginView,shellView,renderers,canUsePage}=await import('../public/js/views.js');
 const {escapeHtml}=await import('../public/js/utils.js');
 const user={id:1,name:'Usuário Demo',role:'admin'};
 const patient={id:1,name:'Teste <script>alert(1)</script>',age:70,conditions:'Acompanhamento',caregiver_name:'Família',unit_name:'UBS Demo',risk:'baixo'};
 const state={user,page:'inicio',dashboard:{stats:{patients:1,highRisk:0,scheduled:1,openOccurrences:0},patients:[patient],appointments:[],occurrences:[]},
  patients:[patient],appointments:[],occurrences:[],reports:{patients:1,highRisk:0,scheduled:1,completed:0,openOccurrences:0,byRisk:{baixo:1,moderado:0,alto:0}},
  audit:[],search:'',filter:'todos',largeFont:false,highContrast:false};
 assert.match(loginView(),/login-form/);
 assert.match(shellView(state),/data-page="pacientes"/);
 for(const [page,render] of Object.entries(renderers)){
  state.page=page;
  const html=render(state);
  assert.ok(html.length>300,`Tela ${page} vazia`);
  assert.doesNotMatch(html,/medicamentos|prescriç(?:ão|ões)|dosagem|estoque/i,`Conteúdo removido em ${page}`);
 }
 assert.equal(canUsePage({...user,role:'paciente'},'pacientes'),false);
 assert.equal(canUsePage({...user,role:'profissional'},'relatorios'),true);
 assert.equal(escapeHtml('<script>'), '&lt;script&gt;');
 assert.match(renderers.pacientes({...state,page:'pacientes'}),/&lt;script&gt;/);
});
