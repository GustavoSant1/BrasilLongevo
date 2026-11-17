'use strict';
const {all,one,run}=require('../db');
const {fail,required,text,int,requireStaff,canAccessPatient,audit}=require('../common');
const patients=require('./patients');
const STATES=['registrada','em_analise','concluida'];
function list(user){
 const filters=[],args=[];
 if(user.role==='paciente'){filters.push('o.patient_id=?');args.push(user.patient_id||-1);}
 if(user.role==='cuidador'){filters.push('o.patient_id IN (SELECT patient_id FROM caregiver_links WHERE user_id=?)');args.push(user.id);}
 return all(`SELECT o.*,p.name AS patient_name,u.name AS requester_name FROM emergency_requests o
 JOIN patients p ON p.id=o.patient_id JOIN users u ON u.id=o.requested_by
 WHERE p.archived=0 ${filters.length?' AND '+filters.join(' AND '):''}
 ORDER BY CASE o.status WHEN 'registrada' THEN 0 WHEN 'em_analise' THEN 1 ELSE 2 END,o.id DESC`,...args);
}
function create(user,p){
 const pid=int(p.patient_id);patients.get(user,pid);
 if(!canAccessPatient(user,pid))throw fail(403,'Acesso negado.');
 const severity=['normal','alta'].includes(p.severity)?p.severity:'normal';
 const r=run('INSERT INTO emergency_requests(patient_id,requested_by,description,severity) VALUES(?,?,?,?)',pid,user.id,required(p.description,'Descrição',400),severity);
 audit(user,'registrar','ocorrencia',r.lastInsertRowid);
 return {id:Number(r.lastInsertRowid),notice:'Registro interno de demonstração. Nenhum serviço externo foi acionado.'};
}
function update(user,id,p){
 requireStaff(user);
 const existing=one('SELECT * FROM emergency_requests WHERE id=?',id);
 if(!existing)throw fail(404,'Ocorrência não encontrada.');
 if(!STATES.includes(p.status))throw fail(400,'Situação inválida.');
 if(p.status==='concluida'&&!text(p.resolution,400))throw fail(400,'Informe o retorno da equipe para concluir a ocorrência.');
 if(existing.status==='concluida'&&p.status!=='concluida')throw fail(409,'Ocorrência concluída não pode ser reaberta nesta demonstração.');
 run('UPDATE emergency_requests SET status=?,resolution=?,resolved_by=?,resolved_at=? WHERE id=?',p.status,text(p.resolution,400),p.status==='concluida'?user.id:null,p.status==='concluida'?new Date().toISOString():null,id);
 audit(user,'atualizar','ocorrencia',id);return {ok:true};
}
module.exports={list,create,update};
