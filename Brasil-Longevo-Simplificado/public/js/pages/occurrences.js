// Página isolada para facilitar manutenção.
import {escapeHtml as E,icon,formatDate,formatWhen,badge,riskBadge,appointmentBadge,occurrenceBadge,empty} from '../utils.js';
import {staff,action,link,title,stat,card,actionButton} from '../ui.js';

export function occurrencesView(state){
 const list=(state.occurrences||[]).filter(o=>(`${o.patient_name} ${o.description}`).toLowerCase().includes(state.search.toLowerCase())&&(state.filter==='todos'||o.status===state.filter));
 return title('Comunicação e acompanhamento','Ocorrências internas','Registre necessidades e acompanhe a avaliação da equipe.',action('new-occurrence',`${icon('plus',17)} Registrar ocorrência`))+
 `<div class="notice">${icon('info',22)}<div><strong>Não é um canal de emergência.</strong><p>Este registro é apenas demonstrativo e não envia solicitações a ambulâncias ou unidades externas. Em emergência real, ligue 192 (SAMU).</p></div></div>
 <section class="card table-card"><div class="card-title"><div><h2>Registro de ocorrências</h2><p>${list.length} registros</p></div></div><div class="tools"><label class="search">${icon('search',18)}<input data-search aria-label="Buscar ocorrências" placeholder="Buscar ocorrência" value="${E(state.search)}"></label><select data-filter aria-label="Filtrar situação"><option value="todos">Todas as situações</option>${[['registrada','Aguardando análise'],['em_analise','Em análise'],['concluida','Concluídas']].map(([k,l])=>`<option ${state.filter===k?'selected':''} value="${k}">${l}</option>`).join('')}</select></div>
 <div class="occurrence-list">${list.map(o=>`<article class="occurrence-card"><div class="occurrence-top"><div><b>${E(o.patient_name)}</b><small>Registrado por ${E(o.requester_name)} · ${formatDate(o.created_at)}</small></div>${occurrenceBadge(o.status)}</div><p>${E(o.description)}</p>${o.resolution?`<div class="resolution">Retorno da equipe: ${E(o.resolution)}</div>`:''}${staff(state.user)?`<div class="row-end">${action('edit-occurrence','Atualizar situação','outline',`data-id="${o.id}"`)}</div>`:''}</article>`).join('')||empty('Nenhuma ocorrência encontrada.')}</div></section>`;
}
