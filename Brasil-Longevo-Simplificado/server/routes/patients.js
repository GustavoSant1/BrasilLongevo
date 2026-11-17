'use strict';
const {all,one,run}=require('../db');
const {fail,required,text,int,validDate,requireStaff,requireAdmin,canAccessPatient,audit}=require('../common');
function age(birth){
 if(!birth)return null;
 const today=new Date().toLocaleDateString('sv-SE',{timeZone:'America/Sao_Paulo'});
 const years=Number(today.slice(0,4))-Number(birth.slice(0,4));
 return years-(today.slice(5)<birth.slice(5)?1:0);
}
function list(user,search=''){
 const filter=['p.archived=0'],args=[];
 if(user.role==='paciente'){filter.push('p.id=?');args.push(user.patient_id||-1);}
 if(user.role==='cuidador'){filter.push('p.id IN (SELECT patient_id FROM caregiver_links WHERE user_id=?)');args.push(user.id);}
 if(search){filter.push('(p.name LIKE ? OR p.conditions LIKE ?)');args.push('%'+search+'%','%'+search+'%');}
 return all(`SELECT p.*,u.name AS unit_name FROM patients p JOIN units u ON u.id=p.unit_id WHERE ${filter.join(' AND ')} ORDER BY p.name COLLATE NOCASE`,...args).map(p=>({...p,age:age(p.birth_date)}));
}
function get(user,id){
 if(!canAccessPatient(user,id))throw fail(403,'Acesso negado.');
 const record=one(`SELECT p.*,u.name AS unit_name FROM patients p JOIN units u ON u.id=p.unit_id
 WHERE p.id=? AND p.archived=0`,id);
 if(!record)throw fail(404,'Paciente não encontrado.');
 return {...record,age:age(record.birth_date)};
}
function normalize(input){
 const p=input||{},unit=int(p.unit_id),birth=text(p.birth_date,10);
 if(birth&&!validDate(birth))throw fail(400,'Data de nascimento inválida.');
 const today=new Date().toLocaleDateString('sv-SE',{timeZone:'America/Sao_Paulo'});
 if(birth&&birth>today)throw fail(400,'Data de nascimento não pode estar no futuro.');
 if(!one('SELECT id FROM units WHERE id=?',unit))throw fail(400,'Unidade inválida.');
 if(!['baixo','moderado','alto'].includes(p.risk))throw fail(400,'Prioridade inválida.');
 return [required(p.name,'Nome'),birth,text(p.phone,30),text(p.conditions,300),text(p.caregiver_name,120),p.risk,unit];
}
function create(user,p){requireStaff(user);const r=run('INSERT INTO patients(name,birth_date,phone,conditions,caregiver_name,risk,unit_id) VALUES(?,?,?,?,?,?,?)',...normalize(p));audit(user,'criar','paciente',r.lastInsertRowid);return {id:Number(r.lastInsertRowid)};}
function update(user,id,p){requireStaff(user);get(user,id);run('UPDATE patients SET name=?,birth_date=?,phone=?,conditions=?,caregiver_name=?,risk=?,unit_id=? WHERE id=?',...normalize(p),id);audit(user,'editar','paciente',id);return {ok:true};}
function archive(user,id){requireAdmin(user);get(user,id);run('UPDATE patients SET archived=1 WHERE id=?',id);audit(user,'arquivar','paciente',id);return {ok:true};}
module.exports={list,get,create,update,archive};
