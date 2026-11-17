// Elementos comuns das páginas: botões, indicadores, cartões e navegação.
import {escapeHtml as E,icon} from './utils.js';
export const labels={inicio:'Visão geral',pacientes:'Pacientes',atendimentos:'Atendimentos',ocorrencias:'Ocorrências',relatorios:'Relatórios',configuracoes:'Configurações'};
export const menu=[['inicio','home'],['pacientes','users'],['atendimentos','calendar'],['ocorrencias','clipboard'],['relatorios','chart'],['configuracoes','settings']];
export const staff=u=>['admin','profissional'].includes(u?.role);
export const action=(name,label,style='primary',data='')=>`<button class="btn btn-${style}" data-action="${name}" ${data}>${label}</button>`;
export const link=(page,label)=>`<button type="button" class="link" data-page="${page}">${E(label)} ${icon('arrow',15)}</button>`;
export const title=(eyebrow,name,description,buttons='')=>`<div class="page-head"><div><div class="eyebrow">${E(eyebrow)}</div><h1>${E(name)}</h1><p>${E(description)}</p></div><div class="head-buttons">${buttons}</div></div>`;
export const stat=(label,value,iconName,variant='blue',description='')=>`<div class="stat"><div class="stat-icon ${variant}">${icon(iconName,24)}</div><div><small>${E(label)}</small><strong>${E(value)}</strong>${description?`<span>${E(description)}</span>`:''}</div></div>`;
export const card=(header,description,content,extra='')=>`<section class="card"><div class="card-title"><div><h2>${E(header)}</h2>${description?`<p>${E(description)}</p>`:''}</div>${extra}</div><div class="card-body">${content}</div></section>`;
export const actionButton=(name,id,ico,label)=>`<button class="btn-icon" aria-label="${E(label)}" title="${E(label)}" data-action="${name}" data-id="${id}">${icon(ico,17)}</button>`;

