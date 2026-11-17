export const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export const formatDate=value=>{const s=String(value||'').slice(0,10);return /^\d{4}-\d{2}-\d{2}$/.test(s)?`${s.slice(8,10)}/${s.slice(5,7)}/${s.slice(0,4)}`:'—';};
export const formatWhen=value=>`${formatDate(value)} · ${escapeHtml(String(value||'').slice(11,16))}`;
export const badge=(label,color='muted')=>`<span class="badge badge-${color}">${escapeHtml(label)}</span>`;
export const riskBadge=value=>({alto:badge('Alta','red'),moderado:badge('Moderada','amber'),baixo:badge('Baixa','green')}[value]||badge('Não definida'));
export const appointmentBadge=value=>({agendada:badge('Agendado','blue'),concluída:badge('Concluído','green'),cancelada:badge('Cancelado','muted')}[value]||badge(value));
export const occurrenceBadge=value=>({registrada:badge('Aguardando análise','amber'),em_analise:badge('Em análise','blue'),concluida:badge('Concluída','green')}[value]||badge(value));
const icons={
 heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
 pulse:'<path d="M2 12h4l2.4-6 4 12 2.5-6H22"/>',
 users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
 clipboard:'<rect x="5" y="4" width="14" height="18" rx="2"/><path d="M9 4a2 2 0 0 1 4 0h2v4H9V4Zm0 9h6m-6 4h6"/>',
 chart:'<path d="M4 20V9m6 11V4m6 16v-8m5 8H3"/>',
 settings:'<circle cx="12" cy="12" r="3"/><path d="m19.5 13.5 1.5 1-2 3.5-1.7-.8a8 8 0 0 1-2.3 1.3L14.7 21h-4l-.3-2.5a8 8 0 0 1-2.2-1.3l-1.8.8-2-3.5 1.6-1a9 9 0 0 1 0-3l-1.6-1 2-3.5 1.8.8a8 8 0 0 1 2.2-1.3L10.7 3h4l.3 2.5a8 8 0 0 1 2.3 1.3l1.7-.8 2 3.5-1.5 1a9 9 0 0 1 0 3Z"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
 alert:'<path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v5m0 3h.01"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 edit:'<path d="M4 20h4l12-12-4-4L4 16v4ZM14 6l4 4"/>',
 eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
 trash:'<path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 10v7m4-7v7"/>',
 exit:'<path d="M9 20H4V4h5M14 7l5 5-5 5m5-5H9"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
 close:'<path d="M5 5l14 14M19 5 5 19"/>',
 shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
 download:'<path d="M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4"/>',
 phone:'<path d="M22 17v4a2 2 0 0 1-2 2C10 22 2 14 2 4a2 2 0 0 1 2-2h4l2 5-3 2a17 17 0 0 0 8 8l2-3 5 3Z"/>',
 info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7h.01"/>',
 home:'<path d="M3 11 12 3l9 8v10h-7v-7h-4v7H3V11Z"/>'
};
export const icon=(name,size=20)=>`<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.info}</svg>`;
export const empty=(message,sub='')=>`<div class="empty">${icon('info',28)}<strong>${escapeHtml(message)}</strong>${sub?`<p>${escapeHtml(sub)}</p>`:''}</div>`;
export const dateNow=()=>new Date().toLocaleDateString('sv-SE',{timeZone:'America/Sao_Paulo'});
