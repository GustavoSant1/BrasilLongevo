// Página isolada para facilitar manutenção.
import {escapeHtml as E,icon,formatDate,formatWhen,badge,riskBadge,appointmentBadge,occurrenceBadge,empty} from '../utils.js';
import {staff,action,link,title,stat,card,actionButton} from '../ui.js';

export function settingsView(state){
 const logs=state.audit||[];
 return title('Preferências','Configurações','Ajustes de leitura e informações do protótipo.')+`<div class="home-grid">${card('Acessibilidade','Ajuste a leitura conforme sua preferência',`<div class="setting"><div><b>Texto ampliado</b><small>Maior legibilidade em todas as telas</small></div>${action('font',state.largeFont?'Desativar':'Ativar','outline')}</div><div class="setting"><div><b>Alto contraste</b><small>Reforça a distinção entre texto e fundo</small></div>${action('contrast',state.highContrast?'Desativar':'Ativar','outline')}</div>`)}${card('Sobre o projeto','Informações técnicas',`<div class="setting"><span>Frontend</span><b>HTML, CSS e JavaScript</b></div><div class="setting"><span>Backend</span><b>Node.js · HTTP nativo</b></div><div class="setting"><span>Banco local</span><b>SQLite</b></div><div class="notice normal">${icon('info')}<span>Somente demonstração acadêmica. Não utilizar dados clínicos reais.</span></div>`)}</div>`+
 (state.user.role==='admin'?`<section class="card log-card"><div class="card-title"><div><h2>Histórico de auditoria</h2><p>Últimas ações do sistema</p></div></div><div class="card-body">${logs.length?logs.slice(0,30).map(a=>`<div class="audit-item"><div>${icon('shield',18)} <span><b>${E(a.user_name||'Sistema')}</b> · ${E(a.action)} · ${E(a.resource)}</span></div><small>${E(a.created_at)}</small></div>`).join(''):empty('Nenhuma ação registrada.')}</div></section>`:'');
}
