// Entrada única das telas. Cada página pode ser mantida separadamente.
import {escapeHtml as E, icon} from './utils.js';
import {labels,menu,staff} from './ui.js';
import {dashboardView} from './pages/dashboard.js';
import {patientsView} from './pages/patients.js';
import {appointmentsView} from './pages/appointments.js';
import {occurrencesView} from './pages/occurrences.js';
import {reportsView} from './pages/reports.js';
import {settingsView} from './pages/settings.js';

export function loginView(){return `<div class="login-layout">
 <div class="login-hero"><div class="brand brand-light"><span class="brand-symbol">${icon('pulse',27)}</span><span>Brasil Longevo</span></div>
 <div class="login-callout"><p class="eyebrow">Tecnologia que aproxima o cuidado</p><h1>O cuidado acontece<br>onde a vida está.</h1><p>Mais organização para pacientes, famílias e equipes responsáveis pelo acompanhamento domiciliar.</p><div class="callout-card">${icon('heart',39)}<div><strong>Mais presença, menos distância.</strong><span>Informações essenciais em um só lugar.</span></div></div></div>
 <small class="login-foot">Protótipo acadêmico · Dados fictícios · Não utilizar para atendimento real</small></div>
 <main class="login-right" id="content"><section class="login-panel"><div class="eyebrow">Bem-vindo de volta</div><h2>Entre na sua conta</h2><p>Gerencie o cuidado com segurança e simplicidade.</p>
 <div class="login-error" id="login-error" role="alert"></div><form id="login-form"><label>E-mail<input name="email" type="email" autocomplete="username" placeholder="email@exemplo.com" required></label><label>Senha<input name="password" type="password" autocomplete="current-password" required></label><button class="btn btn-primary full" type="submit">Entrar no sistema ${icon('arrow',17)}</button></form>
 <div class="demo-users"><strong>Entrar como perfil de demonstração</strong><div class="demo-grid"><button data-demo="admin"><b>Coordenação</b><small>Gestão e relatórios</small></button><button data-demo="profissional"><b>Equipe de saúde</b><small>Acompanhamentos</small></button><button data-demo="paciente"><b>Paciente</b><small>Meus atendimentos</small></button><button data-demo="cuidador"><b>Cuidador</b><small>Apoio familiar</small></button></div></div><p class="fineprint">Use somente dados fictícios. Não há integração com serviços públicos de saúde.</p></section></main></div>`;}
export function shellView(state){
 const restricted=!staff(state.user);
 const visible=menu.filter(([id])=>!restricted||!['pacientes','relatorios'].includes(id));
 const role={admin:'Coordenação',profissional:'Equipe de saúde',paciente:'Paciente',cuidador:'Cuidador'}[state.user.role];
 return `<div class="app-shell"><div class="sidebar-overlay" data-action="sidebar"></div><aside class="sidebar" aria-label="Navegação principal"><div class="brand"><span class="brand-symbol">${icon('pulse',24)}</span><span><strong>Brasil Longevo</strong><small>Gestão de cuidado</small></span></div><div class="nav-label">MENU PRINCIPAL</div><nav class="nav">${visible.map(([id,ico])=>`<button type="button" class="nav-item ${state.page===id?'active':''}" data-page="${id}" ${state.page===id?'aria-current="page"':''}>${icon(ico,20)}<span>${labels[id]}</span></button>`).join('')}</nav><div class="sidebar-bottom"><div class="sidebar-help">${icon('shield',22)}<strong>Cuidado em primeiro lugar</strong><p>Registros internos não substituem atendimento profissional.</p></div><small>Brasil Longevo · Demonstração acadêmica</small></div></aside>
 <div class="main-wrap"><header class="topbar"><div class="top-left"><button class="btn-icon mobile-menu" aria-label="Abrir menu" data-action="sidebar">${icon('menu')}</button><div class="breadcrumb">Brasil Longevo <span>/</span> <b>${labels[state.page]}</b></div></div><div class="top-right"><span class="demo-tag"><span class="live-dot"></span>AMBIENTE DEMO</span><div class="user-info"><span class="avatar small">${E(state.user.name.split(' ').slice(0,2).map(x=>x[0]).join(''))}</span><div><b>${E(state.user.name)}</b><small>${E(role)}</small></div></div><button class="btn-icon" data-action="logout" title="Sair" aria-label="Sair">${icon('exit')}</button></div></header><main id="content" class="content"><div id="view"></div></main></div></div>`;
}

export const renderers={inicio:dashboardView,pacientes:patientsView,atendimentos:appointmentsView,ocorrencias:occurrencesView,relatorios:reportsView,configuracoes:settingsView};
export const canUsePage=(user,page)=>labels[page]&& (staff(user)||!['pacientes','relatorios'].includes(page));
