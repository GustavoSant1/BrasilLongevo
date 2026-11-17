'use strict';
const {all,one,run}=require('../db');
const {fail,required,text,int,validDateTime,requireStaff,audit}=require('../common');
const patients=require('./patients');
function list(user){
 const filters=[],args=[];
 if(user.role==='paciente'){filters.push('a.patient_id=?');args.push(user.patient_id||-1);}
 if(user.role==='cuidador'){filters.push('a.patient_id IN (SELECT patient_id FROM caregiver_links WHERE user_id=?)');args.push(user.id);}
 return all(`SELECT a.*,p.name AS patient_name FROM appointments a JOIN patients p ON p.id=a.patient_id
 WHERE p.archived=0 ${filters.length?' AND '+filters.join(' AND '):''} ORDER BY CASE a.status WHEN 'agendada' THEN 0 WHEN 'concluída' THEN 1 ELSE 2 END,
 CASE WHEN a.status='agendada' THEN a.at END ASC, CASE WHEN a.status!='agendada' THEN a.at END DESC,a.id DESC`,...args);
}
function normalize(p,status='agendada'){
 if(!validDateTime(p.at))throw fail(400,'Data e horário inválidos.');
 if(!['agendada','concluída','cancelada'].includes(status))throw fail(400,'Status inválido.');
 return [p.at,required(p.kind,'Tipo de atendimento'),text(p.professional,100),status,text(p.notes,350)];
}
function create(user,p){
 requireStaff(user);const pid=int(p.patient_id);patients.get(user,pid);
 const r=run('INSERT INTO appointments(patient_id,at,kind,professional,status,notes) VALUES(?,?,?,?,?,?)',pid,...normalize(p));
 audit(user,'criar','atendimento',r.lastInsertRowid);return {id:Number(r.lastInsertRowid)};
}
function update(user,id,p){
 requireStaff(user);const existing=one('SELECT id FROM appointments WHERE id=?',id);
 if(!existing)throw fail(404,'Atendimento não encontrado.');
 run('UPDATE appointments SET at=?,kind=?,professional=?,status=?,notes=? WHERE id=?',...normalize(p,p.status),id);
 audit(user,'editar','atendimento',id);return {ok:true};
}
module.exports={list,create,update};
