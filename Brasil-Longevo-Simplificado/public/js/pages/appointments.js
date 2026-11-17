// Página isolada para facilitar manutenção.
import {escapeHtml as E,icon,formatDate,formatWhen,badge,riskBadge,appointmentBadge,occurrenceBadge,empty} from '../utils.js';
import {staff,action,link,title,stat,card,actionButton} from '../ui.js';

export function appointmentsView(state){
 const list=(state.appointments||[]).filter(a=>(`${a.patient_name} ${a.kind} ${a.professional}`).toLowerCase().includes(state.search.toLowerCase())&&(state.filter==='todos'||a.status===state.filter));
 return title('Agenda da unidade','Atendimentos','Consultas e visitas domiciliares em uma única agenda.',staff(state.user)?action('new-appointment',`${icon('plus',17)} Agendar atendimento`):'')+
 `<section class="card table-card"><div class="card-title"><div><h2>Agenda de atendimentos</h2><p>${list.length} registros</p></div></div><div class="tools"><label class="search">${icon('search',18)}<input data-search value="${E(state.search)}" placeholder="Buscar atendimento" aria-label="Buscar atendimentos"></label><select aria-label="Filtrar situação" data-filter><option value="todos">Todas as situações</option>${[['agendada','Agendados'],['concluída','Concluídos'],['cancelada','Cancelados']].map(([id,t])=>`<option ${state.filter===id?'selected':''} value="${id}">${t}</option>`).join('')}</select></div>
 <div class="table-scroll"><table><thead><tr><th>Data / horário</th><th>Paciente</th><th>Tipo</th><th>Profissional</th><th>Situação</th>${staff(state.user)?'<th class="end">Ação</th>':''}</tr></thead><tbody>${list.map(a=>`<tr><td class="nowrap">${formatWhen(a.at)}</td><td><b>${E(a.patient_name)}</b></td><td>${E(a.kind)}</td><td>${E(a.professional||'Não definido')}</td><td>${appointmentBadge(a.status)}</td>${staff(state.user)?`<td class="end">${actionButton('edit-appointment',a.id,'edit','Editar atendimento')}</td>`:''}</tr>`).join('')||`<tr><td colspan="6">${empty('Nenhum atendimento encontrado.')}</td></tr>`}</tbody></table></div></section>`;
}
