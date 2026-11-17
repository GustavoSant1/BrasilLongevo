// Página isolada para facilitar manutenção.
import {escapeHtml as E,icon,formatDate,formatWhen,badge,riskBadge,appointmentBadge,occurrenceBadge,empty} from '../utils.js';
import {staff,action,link,title,stat,card,actionButton} from '../ui.js';

export function reportsView(state){const r=state.reports||{patients:0,highRisk:0,scheduled:0,completed:0,openOccurrences:0,byRisk:{baixo:0,moderado:0,alto:0}};
 return title('Indicadores de gestão','Relatórios','Acompanhe os registros da unidade e exporte dados fictícios.',`<a class="btn btn-primary" href="/api/reports/patients.csv">${icon('download',17)} Exportar CSV</a>`)+
 `<div class="stats-grid">${stat('Pacientes',r.patients,'users')}${stat('Atendimentos agendados',r.scheduled,'calendar','green')}${stat('Concluídos',r.completed,'check','blue')}${stat('Ocorrências abertas',r.openOccurrences,'clipboard','amber')}</div>`+
 `<div class="home-grid">${card('Prioridade de acompanhamento','Distribuição dos pacientes',[['baixo','Baixa','green'],['moderado','Moderada','amber'],['alto','Alta','red']].map(([key,label,color])=>`<div class="progress-row"><div><b>${label}</b><span>${r.byRisk[key]||0}</span></div><progress class="progress-native ${color}" value="${r.byRisk[key]||0}" max="${Math.max(r.patients,1)}" aria-label="${label}"></progress></div>`).join(''))}${card('Sobre os relatórios','Interpretação dos dados',`<div class="notice normal">${icon('shield')}<div>Todos os registros desta instalação são fictícios. Os indicadores representam cadastros do sistema local, não métricas clínicas ou dados oficiais de unidades públicas.</div></div>`)}</div>`;
}
