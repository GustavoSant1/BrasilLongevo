'use strict';
const {one,run}=require('./db');
const STAFF=['admin','profissional'];
const fail=(status,message)=>Object.assign(new Error(message),{status});
const text=(v,max=240)=>String(v??'').trim().slice(0,max);
const required=(v,label,max=160)=>{const s=text(v,max);if(!s)throw fail(400,`${label} é obrigatório.`);return s;};
const int=v=>v!==''&&v!==null&&v!==undefined&&Number.isSafeInteger(Number(v))?Number(v):NaN;
function validDate(s){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(s))return false;
 const dt=new Date(`${s}T12:00:00Z`);
 return !Number.isNaN(dt.getTime())&&dt.toISOString().slice(0,10)===s;
}
const validDateTime=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d$/.test(s)&&validDate(s.slice(0,10));
const staff=user=>STAFF.includes(user?.role);
const requireStaff=user=>{if(!staff(user))throw fail(403,'Ação restrita à equipe.');};
const requireAdmin=user=>{if(user?.role!=='admin')throw fail(403,'Ação restrita à coordenação.');};
const canAccessPatient=(user,id)=>staff(user)||user.role==='paciente'&&user.patient_id===id||user.role==='cuidador'&&!!one('SELECT 1 FROM caregiver_links WHERE user_id=? AND patient_id=?',user.id,id);
const audit=(user,action,resource,id)=>run('INSERT INTO audit(user_id,action,resource,resource_id) VALUES(?,?,?,?)',user?.id||null,action,resource,String(id??''));
const csvCell=v=>{let s=String(v??'');if(/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
module.exports={fail,text,required,int,validDate,validDateTime,staff,requireStaff,requireAdmin,canAccessPatient,audit,csvCell};
