'use strict';
// Testes reais da API. SQLite em memória: seguro em Windows/OneDrive (sem rmSync).
process.env.DB_PATH = ':memory:';
const {test} = require('node:test');
const assert = require('node:assert/strict');
const {server} = require('../server/index');
const {db, DB_PATH, one} = require('../server/db');

let base;
async function request(route,{method='GET',body,cookie,origin}={}){
 const headers={};
 if(body!==undefined)headers['content-type']='application/json';
 if(cookie)headers.cookie=cookie;
 if(origin)headers.origin=origin;
 const response=await fetch(base+route,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
 const contentType=response.headers.get('content-type')||'';
 const value=contentType.includes('application/json')?await response.json():await response.text();
 return {status:response.status,value,cookie:response.headers.get('set-cookie')};
}
async function login(email,password){
 const r=await request('/api/auth/login',{method:'POST',body:{email,password}});
 assert.equal(r.status,200);
 assert.ok(r.cookie?.includes('HttpOnly'));
 return r.cookie.split(';')[0];
}

test('Brasil Longevo v2: API, permissões e fluxos sem medicamentos',async t=>{
 assert.equal(DB_PATH,':memory:');
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 base=`http://127.0.0.1:${server.address().port}`;
 t.after(async()=>{
  await new Promise((resolve,reject)=>server.close(err=>err?reject(err):resolve()));
  db.close();
 });
 let admin,team,patient,caregiver,newPatientId,apptId,occId;
 await t.test('site, CSS, módulos JS e saúde HTTP',async()=>{
  assert.equal((await request('/api/health')).status,200);
  const html=await request('/'); assert.equal(html.status,200);
  assert.match(html.value,/Brasil Longevo/);
  assert.doesNotMatch(html.value,/medicamento|prescri(?:ç|c)[aã]o|dosagem/i);
  for(const route of ['/styles.css','/js/app.js','/js/views.js','/js/api.js','/js/forms.js','/favicon.svg'])
   assert.equal((await request(route)).status,200,route);
  assert.equal((await request('/.env')).status,404);
  assert.equal((await request('/api/medications')).status,401); // endpoint não autorizado: nenhuma sessão
 });
 await t.test('login, senha incorreta e sessões',async()=>{
  assert.equal((await request('/api/auth/me')).status,401);
  assert.equal((await request('/api/auth/login',{method:'POST',body:{email:'admin@brasil-longevo.local',password:'incorreta'}})).status,401);
  admin=await login('admin@brasil-longevo.local','Admin@1234');
  team=await login('enfermagem@brasil-longevo.local','Equipe@1234');
  patient=await login('paciente@brasil-longevo.local','Paciente@1234');
  caregiver=await login('cuidador@brasil-longevo.local','Cuidador@1234');
  const me=await request('/api/auth/me',{cookie:patient});
  assert.equal(me.value.user.role,'paciente');
 });
 await t.test('permissões e isolamento de dados sensíveis',async()=>{
  const teamList=await request('/api/patients',{cookie:team});assert.equal(teamList.status,200);assert.ok(teamList.value.items.length>=8);
  const patientList=await request('/api/patients',{cookie:patient});assert.equal(patientList.value.items.length,1);
  const caregiverList=await request('/api/patients',{cookie:caregiver});assert.equal(caregiverList.value.items.length,1);
  assert.equal(patientList.value.items[0].id,caregiverList.value.items[0].id);
  assert.equal((await request('/api/patients/2',{cookie:patient})).status,403);
  assert.equal((await request('/api/reports',{cookie:patient})).status,403);
  assert.equal((await request('/api/audit',{cookie:team})).status,403);
  assert.equal((await request('/api/patients',{method:'POST',cookie:patient,body:{}})).status,403);
  assert.equal((await request('/api/patients/1',{method:'DELETE',cookie:team})).status,403);
  assert.equal((await request('/api/medications',{cookie:admin})).status,404);
  assert.equal((await request('/api/prescriptions',{cookie:admin})).status,404);
  assert.equal((await request('/api/doses',{cookie:admin})).status,404);
 });
 await t.test('cadastro, atualização e validação de pacientes',async()=>{
  const units=await request('/api/units',{cookie:team});assert.ok(units.value.items.length>0);
  const patientInput={name:'Paciente de Teste',birth_date:'1965-10-12',phone:'(14) 3333-0000',conditions:'Acompanhamento fictício',caregiver_name:'Cuidador de Teste',risk:'moderado',unit_id:units.value.items[0].id};
  const bad=await request('/api/patients',{method:'POST',cookie:team,body:{...patientInput,birth_date:'2026-02-31'}});
  assert.equal(bad.status,400);
  assert.equal((await request('/api/patients',{method:'POST',cookie:team,body:{...patientInput,birth_date:'2099-01-01'}})).status,400);
  const created=await request('/api/patients',{method:'POST',cookie:team,body:patientInput});assert.equal(created.status,201);
  newPatientId=created.value.id;
  assert.equal((await request(`/api/patients/${newPatientId}`,{cookie:team})).value.item.name,'Paciente de Teste');
  assert.equal((await request(`/api/patients/${newPatientId}`,{method:'PUT',cookie:team,body:{...patientInput,name:'Paciente Atualizado',risk:'alto'}})).status,200);
  assert.equal((await request(`/api/patients/${newPatientId}`,{cookie:admin})).value.item.risk,'alto');
 });
 await t.test('agendamento, atualização e visibilidade por perfil',async()=>{
  const input={patient_id:newPatientId,at:'2027-04-07T09:30',kind:'Visita domiciliar',professional:'Enf. Teste',notes:'Atendimento fictício'};
  const created=await request('/api/appointments',{method:'POST',cookie:team,body:input});assert.equal(created.status,201);apptId=created.value.id;
  assert.equal((await request('/api/appointments',{cookie:patient})).value.items.some(a=>a.patient_id===newPatientId),false);
  assert.equal((await request(`/api/appointments/${apptId}`,{method:'PUT',cookie:team,body:{...input,status:'concluída'}})).status,200);
  const list=await request('/api/appointments',{cookie:admin});assert.equal(list.value.items.find(a=>a.id===apptId).status,'concluída');
  assert.equal((await request('/api/appointments',{method:'POST',cookie:caregiver,body:input})).status,403);
 });
 await t.test('ocorrência interna, sem falsa chamada externa',async()=>{
  const created=await request('/api/occurrences',{method:'POST',cookie:patient,body:{patient_id:1,severity:'alta',description:'Registro fictício de acompanhamento'}});
  assert.equal(created.status,201);assert.match(created.value.notice,/Nenhum serviço externo/);occId=created.value.id;
  assert.equal((await request(`/api/occurrences/${occId}`,{method:'PATCH',cookie:patient,body:{status:'concluida'}})).status,403);
  assert.equal((await request(`/api/occurrences/${occId}`,{method:'PATCH',cookie:team,body:{status:'em_analise',resolution:'Contato registrado'}})).status,200);
  assert.equal((await request(`/api/occurrences/${occId}`,{method:'PATCH',cookie:admin,body:{status:'concluida',resolution:''}})).status,400);
  assert.equal((await request(`/api/occurrences/${occId}`,{method:'PATCH',cookie:admin,body:{status:'concluida',resolution:'Encaminhado internamente'}})).status,200);
  assert.equal((await request(`/api/occurrences/${occId}`,{method:'PATCH',cookie:team,body:{status:'registrada'}})).status,409);
 });
 await t.test('indicadores, exportação e auditoria',async()=>{
  const dash=await request('/api/dashboard',{cookie:admin});assert.equal(dash.status,200);assert.ok(dash.value.stats.patients>=9);
  const reports=await request('/api/reports',{cookie:team});assert.equal(reports.status,200);assert.ok(reports.value.byRisk.alto>=1);
  const csv=await request('/api/reports/patients.csv',{cookie:team});assert.equal(csv.status,200);assert.match(csv.value,/Paciente Atualizado/);
  const audit=await request('/api/audit',{cookie:admin});assert.equal(audit.status,200);assert.ok(audit.value.items.some(a=>a.action==='exportar'));
 });
 await t.test('proteções: origem, JSON, autenticação e arquivamento sem apagar',async()=>{
  const foreign=await request('/api/patients',{method:'POST',cookie:team,origin:'https://example.org',body:{}});assert.equal(foreign.status,403);
  const archived=await request(`/api/patients/${newPatientId}`,{method:'DELETE',cookie:admin});assert.equal(archived.status,200);
  assert.equal((await request(`/api/patients/${newPatientId}`,{cookie:team})).status,404);
  assert.equal(one('SELECT archived FROM patients WHERE id=?',newPatientId).archived,1);
  assert.equal((await request('/api/auth/logout',{method:'POST',cookie:admin})).status,200);
  assert.equal((await request('/api/auth/me',{cookie:admin})).status,401);
 });
});
