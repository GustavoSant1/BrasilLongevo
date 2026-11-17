'use strict';
const crypto=require('node:crypto');
const {one,run,verifyPassword}=require('./db');
const {audit,text,fail}=require('./common');
const attempts=new Map();
const SESSION_COOKIE='bl_session';
const tokenHash=token=>crypto.createHash('sha256').update(token).digest('hex');
const publicUser=u=>({id:u.id,name:u.name,email:u.email,role:u.role,patientId:u.patient_id});
function currentUser(req){
 const cookie=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(SESSION_COOKIE+'='));
 const token=cookie?.slice((SESSION_COOKIE+'=').length);
 if(!token||!/^[a-f0-9]{64}$/.test(token))return null;
 return one(`SELECT u.id,u.name,u.email,u.role,u.patient_id FROM sessions s JOIN users u ON u.id=s.user_id
 WHERE s.token_hash=? AND s.expires_at>? AND u.active=1`,tokenHash(token),Date.now());
}
function login(req,p){
 const ip=req.socket.remoteAddress||'local';
 const track=attempts.get(ip)||{count:0,until:0};
 if(track.until<Date.now())track.count=0;
 if(track.count>=8)throw fail(429,'Muitas tentativas. Aguarde 15 minutos.');
 const email=text(p.email,160).toLowerCase();
 const user=one('SELECT * FROM users WHERE lower(email)=? AND active=1',email);
 if(!user||typeof p.password!=='string'||!verifyPassword(p.password,user.pass_hash)){
  attempts.set(ip,{count:track.count+1,until:Date.now()+15*60*1000});
  throw fail(401,'E-mail ou senha inválidos.');
 }
 attempts.delete(ip);
 const token=crypto.randomBytes(32).toString('hex');
 run('DELETE FROM sessions WHERE expires_at<?',Date.now());
 run('INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)',tokenHash(token),user.id,Date.now()+28800000);
 audit(user,'login','sessao',user.id);
 return {user:publicUser(user),cookie:`${SESSION_COOKIE}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800`};
}
function logout(req){
 const token=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(SESSION_COOKIE+'='))?.split('=')[1];
 if(token&&/^[a-f0-9]{64}$/.test(token))run('DELETE FROM sessions WHERE token_hash=?',tokenHash(token));
 return `${SESSION_COOKIE}=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0`;
}
module.exports={currentUser,publicUser,login,logout};
