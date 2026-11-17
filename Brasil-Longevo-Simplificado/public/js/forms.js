import {escapeHtml as E,icon,formatWhen,riskBadge,appointmentBadge,occurrenceBadge,empty,dateNow} from './utils.js';
const field=(name,label,value='',type='text',attrs='')=>`<label class="field">${E(label)}<input name="${E(name)}" type="${type}" value="${E(value)}" ${attrs}></label>`;
const options=(name,label,items,current)=>`<label class="field">${E(label)}<select name="${E(name)}" required>${items.map(([value,text])=>`<option value="${E(value)}" ${String(current)===String(value)?'selected':''}>${E(text)}</option>`).join('')}</select></label>`;
const textarea=(name,label,value='',attrs='')=>`<label class="field">${E(label)}<textarea name="${E(name)}" ${attrs}>${E(value)}</textarea></label>`;
const patientOpts=s=>(s.patients||[]).map(p=>[p.id,p.name]);
const unitOpts=s=>(s.units||[]).map(u=>[u.id,`${u.name} · ${u.city}`]);
export function showModal(title,subtitle,content,footer=''){
 const el=document.querySelector('#modal-root');
 el.innerHTML=`<div class="modal-backdrop" data-overlay><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header class="modal-head"><div><h2 id="modal-title">${E(title)}</h2><p>${E(subtitle)}</p></div><button class="btn-icon" type="button" aria-label="Fechar" data-action="close-modal">${icon('close')}</button></header><div class="modal-body">${content}</div>${footer}</section></div>`;
 el.querySelector('input:not([type=hidden]),select,textarea,button')?.focus();
}
export function closeModal(){document.querySelector('#modal-root').innerHTML='';}
function form(title,subtitle,kind,fields,id=''){
 showModal(title,subtitle,`<form id="data-form" data-kind="${kind}" data-id="${id}">${fields}<div class="form-footer"><button type="button" class="btn btn-outline" data-action="close-modal">Cancelar</button><button class="btn btn-primary" type="submit">${icon('check',17)} Salvar</button></div></form>`);
}
export function patientForm(state,id){
 const p=(state.patients||[]).find(x=>x.id===id)||{};
 form(id?'Editar paciente':'Novo paciente','Cadastro realizado pela equipe de saúde.','patient',
 `<div class="form-grid">${field('name','Nome completo',p.name||'','text','required maxlength="160"')}${field('birth_date','Data de nascimento',p.birth_date||'','date')}${field('phone','Telefone',p.phone||'','tel')}${field('caregiver_name','Cuidador responsável',p.caregiver_name||'','text','maxlength="120"')}</div>${options('unit_id','Unidade de referência',unitOpts(state),p.unit_id||state.units?.[0]?.id)}${textarea('conditions','Informações de acompanhamento',p.conditions||'','maxlength="300" rows="3"')}${options('risk','Prioridade de acompanhamento',[['baixo','Baixa'],['moderado','Moderada'],['alto','Alta']],p.risk||'moderado')}`,id||'');
}
export function appointmentForm(state,id){
 const a=(state.appointments||[]).find(x=>x.id===id)||{};
 if(!id&&!state.patients?.length)throw new Error('Cadastre um paciente primeiro.');
 form(id?'Editar atendimento':'Novo atendimento','Consultas e visitas domiciliares agendadas pela equipe.','appointment',
 `${id?`<div class="field"><span>Paciente</span><strong>${E(a.patient_name)}</strong></div>`:options('patient_id','Paciente',patientOpts(state),state.patients?.[0]?.id)}<div class="form-grid">${field('at','Data e hora',a.at||`${dateNow()}T09:00`,'datetime-local','required')}${field('kind','Tipo de atendimento',a.kind||'Visita domiciliar','text','required maxlength="160"')}${field('professional','Profissional responsável',a.professional||'','text','maxlength="100"')}${id?options('status','Situação',[['agendada','Agendada'],['concluída','Concluída'],['cancelada','Cancelada']],a.status):''}</div>${textarea('notes','Observações internas',a.notes||'','rows="3" maxlength="350"')}`,id||'');
}
export function occurrenceForm(state){
 if(!state.patients?.length)throw new Error('Não há pacientes vinculados a este usuário.');
 form('Registrar ocorrência','Comunicação interna para a equipe responsável.','occurrence',
 `${options('patient_id','Paciente',patientOpts(state),state.patients?.[0]?.id)}${options('severity','Prioridade do registro',[['normal','Normal'],['alta','Alta']],'normal')}${textarea('description','Descreva brevemente a situação','','required rows="4" maxlength="400"')}<div class="notice">${icon('phone',20)}<span><b>Em emergência real, ligue 192.</b> Este registro não faz acionamentos externos.</span></div>`);
}
export function occurrenceUpdateForm(state,id){
 const o=(state.occurrences||[]).find(x=>x.id===id);
 if(!o)throw new Error('Ocorrência não encontrada.');
 form('Atualizar ocorrência',`${o.patient_name} · Registro #${id}`,'occurrence-update',
 `<div class="readonly-description">${E(o.description)}</div>${options('status','Situação',[['registrada','Aguardando análise'],['em_analise','Em análise'],['concluida','Concluída']],o.status)}${textarea('resolution','Retorno da equipe',o.resolution||'','rows="4" maxlength="400"')}`,id);
}
export function detailModal(item,appointments,occurrences){
 showModal('Ficha de '+item.name,'Dados fictícios de acompanhamento',`<div class="detail-grid"><div><small>Idade</small><strong>${item.age??'—'} anos</strong></div><div><small>Prioridade</small>${riskBadge(item.risk)}</div><div><small>Condições</small><strong>${E(item.conditions||'Não informado')}</strong></div><div><small>Cuidador</small><strong>${E(item.caregiver_name||'Não informado')}</strong></div><div><small>Unidade</small><strong>${E(item.unit_name)}</strong></div><div><small>Telefone</small><strong>${E(item.phone||'Não informado')}</strong></div></div>
 <h3 class="detail-title">Atendimentos</h3>${appointments.length?appointments.slice(0,8).map(a=>`<div class="detail-item"><div><strong>${E(a.kind)}</strong><small>${formatWhen(a.at)}</small></div>${appointmentBadge(a.status)}</div>`).join(''):empty('Nenhum atendimento cadastrado.')}
 <h3 class="detail-title">Ocorrências internas</h3>${occurrences.length?occurrences.slice(0,8).map(o=>`<div class="detail-item"><div><strong>${E(o.description)}</strong><small>${E(o.created_at)}</small></div>${occurrenceBadge(o.status)}</div>`).join(''):empty('Nenhuma ocorrência registrada.')}`);
}
export function confirmDialog(title,message,onConfirm){
 showModal(title,'Confirmação de ação',`<p>${E(message)}</p>`,`<div class="modal-footer"><button class="btn btn-outline" data-action="close-modal">Cancelar</button><button class="btn btn-danger" id="confirm-yes">Confirmar</button></div>`);
 document.querySelector('#confirm-yes').addEventListener('click',async()=>{const button=document.querySelector('#confirm-yes');button.disabled=true;try{await onConfirm();}catch(e){button.disabled=false;document.dispatchEvent(new CustomEvent('bl:error',{detail:e.message}));}});
}
