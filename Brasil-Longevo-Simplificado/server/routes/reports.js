'use strict';
const {all}=require('../db');
const {requireStaff,csvCell}=require('../common');
const patients=require('./patients');
const appointments=require('./appointments');
const occurrences=require('./occurrences');
function summary(user){
 requireStaff(user);
 const p=patients.list(user),a=appointments.list(user),o=occurrences.list(user);
 return {
  patients:p.length,highRisk:p.filter(x=>x.risk==='alto').length,
  scheduled:a.filter(x=>x.status==='agendada').length,completed:a.filter(x=>x.status==='concluída').length,
  openOccurrences:o.filter(x=>x.status!=='concluida').length,
  byRisk:{baixo:p.filter(x=>x.risk==='baixo').length,moderado:p.filter(x=>x.risk==='moderado').length,alto:p.filter(x=>x.risk==='alto').length}
 };
}
function patientsCsv(user){
 requireStaff(user);
 const header=['Paciente','Idade','Condições','Unidade','Prioridade'];
 const rows=patients.list(user).map(p=>[p.name,p.age,p.conditions,p.unit_name,p.risk]);
 return '\uFEFF'+[header,...rows].map(row=>row.map(csvCell).join(';')).join('\r\n');
}
function auditLog(user){
 if(user.role!=='admin')return [];
 return all('SELECT a.*,u.name AS user_name FROM audit a LEFT JOIN users u ON u.id=a.user_id ORDER BY a.id DESC LIMIT 80');
}
module.exports={summary,patientsCsv,auditLog};
