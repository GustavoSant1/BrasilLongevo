import {api} from './api.js';
import {loginView,shellView,renderers,canUsePage} from './views.js';
import {patientForm,appointmentForm,occurrenceForm,occurrenceUpdateForm,detailModal,confirmDialog,closeModal} from './forms.js';
import {icon} from './utils.js';

const demo={
 admin:['admin@brasil-longevo.local','Admin@1234'],
 profissional:['enfermagem@brasil-longevo.local','Equipe@1234'],
 paciente:['paciente@brasil-longevo.local','Paciente@1234'],
 cuidador:['cuidador@brasil-longevo.local','Cuidador@1234']
};
const state={user:null,page:'inicio',dashboard:null,patients:[],units:[],appointments:[],occurrences:[],reports:null,audit:[],search:'',filter:'todos',largeFont:localStorage.getItem('bl-large-font')==='1',highContrast:localStorage.getItem('bl-high-contrast')==='1'};
let searchTimer;
let navigationVersion=0; // Ignora respostas antigas quando usuário troca rapidamente de página.
const $=selector=>document.querySelector(selector);
const isStaff=()=>['admin','profissional'].includes(state.user?.role);
function preferences(){document.body.classList.toggle('large-font',state.largeFont);document.body.classList.toggle('high-contrast',state.highContrast);}
function toast(message,error=false){
 const el=document.createElement('div');el.className='toast'+(error?' error':'');el.textContent=message;
 $('#toast-root').append(el);setTimeout(()=>el.remove(),4500);
}
document.addEventListener('bl:error',ev=>toast(ev.detail,true));
function showLogin(){navigationVersion++;state.user=null;document.title='Entrar | Brasil Longevo';$('#root').innerHTML=loginView();}
async function load(page){
 // Apenas os dados da página aberta são buscados: evita oito requisições por clique.
 const tasks=[];
 const get=(key,path)=>tasks.push(api(path).then(value=>{state[key]=value.items??value;}));
 if(page==='inicio')get('dashboard','/api/dashboard');
 if(page==='pacientes'){get('patients','/api/patients');get('units','/api/units');}
 if(page==='atendimentos'){get('appointments','/api/appointments');if(isStaff())get('patients','/api/patients');}
 if(page==='ocorrencias'){get('occurrences','/api/occurrences');get('patients','/api/patients');}
 if(page==='relatorios')get('reports','/api/reports');
 if(page==='configuracoes'&&state.user.role==='admin')get('audit','/api/audit');
 await Promise.all(tasks);
}
function renderContent(){
 document.title=`Brasil Longevo | ${state.page}`;
 const view=$('#view');if(view)view.innerHTML=renderers[state.page](state);
}
async function navigate(page){
 if(!canUsePage(state.user,page))return;
 const version=++navigationVersion;
 state.page=page;state.search='';state.filter='todos';
 $('#root').innerHTML=shellView(state);
 $('#view').innerHTML='<div class="loading" role="status">Carregando informações…</div>';
 document.body.classList.remove('sidebar-open');
 try{await load(page);if(version!==navigationVersion)return;renderContent();}catch(e){
  if(version!==navigationVersion)return;
  if(e.status===401){showLogin();return;}
  $('#view').innerHTML=`<div class="load-error"><b>Não foi possível carregar a página.</b><p>Tente novamente.</p><button class="btn btn-outline" data-action="retry">Tentar novamente</button></div>`;
  toast(e.message,true);
 }
}
async function refresh(){await navigate(state.page);}
function formData(form){return Object.fromEntries(new FormData(form));}
async function submitForm(form){
 const kind=form.dataset.kind,id=Number(form.dataset.id)||null,data=formData(form);
 if(kind==='patient'){
  data.unit_id=Number(data.unit_id);
  await api('/api/patients'+(id?'/'+id:''),{method:id?'PUT':'POST',data});
 }else if(kind==='appointment'){
  if(!id)data.patient_id=Number(data.patient_id);
  await api('/api/appointments'+(id?'/'+id:''),{method:id?'PUT':'POST',data});
 }else if(kind==='occurrence'){
  data.patient_id=Number(data.patient_id);
  await api('/api/occurrences',{method:'POST',data});
 }else if(kind==='occurrence-update'){
  await api('/api/occurrences/'+id,{method:'PATCH',data});
 }else throw new Error('Formulário desconhecido.');
 closeModal();toast('Informações salvas com sucesso.');await refresh();
}

document.addEventListener('submit',async event=>{
 const form=event.target;
 if(form.id==='login-form'){
  event.preventDefault();const button=form.querySelector('[type=submit]');button.disabled=true;
  try{state.user=(await api('/api/auth/login',{method:'POST',data:formData(form)})).user;await navigate('inicio');}
  catch(e){const el=$('#login-error');if(el){el.textContent=e.message;el.style.display='block';}}
  finally{if(button.isConnected)button.disabled=false;}
  return;
 }
 if(form.id!=='data-form')return;
 event.preventDefault();const button=form.querySelector('[type=submit]');button.disabled=true;
 try{await submitForm(form);}catch(e){toast(e.message,true);if(button.isConnected)button.disabled=false;}
});
document.addEventListener('click',async event=>{
 const demoButton=event.target.closest('[data-demo]');
 if(demoButton){const [email,password]=demo[demoButton.dataset.demo];const f=$('#login-form');f.elements.email.value=email;f.elements.password.value=password;f.elements.email.focus();return;}
 const pageButton=event.target.closest('[data-page]');
 if(pageButton){await navigate(pageButton.dataset.page);return;}
 if(event.target.matches('[data-overlay]')){closeModal();return;}
 const btn=event.target.closest('[data-action]');if(!btn)return;
 const action=btn.dataset.action,id=Number(btn.dataset.id);
 try{
  switch(action){
   case 'sidebar':document.body.classList.toggle('sidebar-open');break;
   case 'logout':await api('/api/auth/logout',{method:'POST'});showLogin();break;
   case 'close-modal':closeModal();break;
   case 'retry':await navigate(state.page);break;
   case 'go-appointments':await navigate('atendimentos');break;
   case 'new-patient':
    if(!state.units.length)state.units=(await api('/api/units')).items;
    patientForm(state);break;
   case 'edit-patient':patientForm(state,id);break;
   case 'view-patient':{
    const data=await api(`/api/patients/${id}`);
    detailModal(data.item,data.appointments,data.occurrences);break;
   }
   case 'archive-patient':confirmDialog('Arquivar paciente','O cadastro deixará de aparecer nas listas, mas será preservado no banco para histórico.',async()=>{await api('/api/patients/'+id,{method:'DELETE'});closeModal();toast('Paciente arquivado.');await refresh();});break;
   case 'new-appointment':appointmentForm(state);break;
   case 'edit-appointment':appointmentForm(state,id);break;
   case 'new-occurrence':
    if(!state.patients.length)state.patients=(await api('/api/patients')).items;
    occurrenceForm(state);break;
   case 'edit-occurrence':occurrenceUpdateForm(state,id);break;
   case 'font':state.largeFont=!state.largeFont;localStorage.setItem('bl-large-font',state.largeFont?'1':'0');preferences();renderContent();break;
   case 'contrast':state.highContrast=!state.highContrast;localStorage.setItem('bl-high-contrast',state.highContrast?'1':'0');preferences();renderContent();break;
  }
 }catch(e){toast(e.message,true);}
});
document.addEventListener('input',event=>{
 const input=event.target;if(!input.matches('[data-search]'))return;
 clearTimeout(searchTimer);
 const text=input.value,caret=input.selectionStart;
 searchTimer=setTimeout(()=>{
  state.search=text;renderContent();
  const next=$('[data-search]');if(next){next.focus();next.setSelectionRange(Math.min(caret,next.value.length),Math.min(caret,next.value.length));}
 },140);
});
document.addEventListener('change',event=>{if(event.target.matches('[data-filter]')){state.filter=event.target.value;renderContent();}});
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeModal();});
(async()=>{
 preferences();
 try{state.user=(await api('/api/auth/me')).user;await navigate('inicio');}
 catch{showLogin();}
})();
