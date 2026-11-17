'use strict';
// Router HTTP pequeno e explícito. Regras de cada domínio ficam em server/routes/.
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {all}=require('./db');
const {fail,text,requireAdmin,audit}=require('./common');
const auth=require('./auth');
const patients=require('./routes/patients');
const appointments=require('./routes/appointments');
const occurrences=require('./routes/occurrences');
const reports=require('./routes/reports');

const ROOT=path.resolve(__dirname,'../public');
const MIMES={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon'};
function json(res,status,data,extra={}){
 res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...extra});
 res.end(JSON.stringify(data));
}
async function parseBody(req){
 if(!/^application\/json(?:;|$)/i.test(req.headers['content-type']||''))throw fail(415,'Envie JSON.');
 const chunks=[];let size=0;
 for await(const part of req){size+=part.length;if(size>65536)throw fail(413,'Requisição muito grande.');chunks.push(part);}
 try{
  const result=JSON.parse(Buffer.concat(chunks).toString()||'{}');
  if(!result||typeof result!=='object'||Array.isArray(result))throw new Error();
  return result;
 }catch{throw fail(400,'JSON inválido.');}
}
function checkOrigin(req){
 if(!['POST','PUT','PATCH','DELETE'].includes(req.method))return;
 // Para navegadores: não aceitar requisições de outro site usando a sessão por cookie.
 if(req.headers['sec-fetch-site']==='cross-site')throw fail(403,'Origem não permitida.');
 const origin=req.headers.origin;
 if(!origin)return; // CLI e testes Node sem cabeçalho Origin.
 let parsed;try{parsed=new URL(origin);}catch{throw fail(403,'Origem inválida.');}
 if(parsed.host!==req.headers.host)throw fail(403,'Origem não permitida.');
}
function dashboard(user){
 const p=patients.list(user),a=appointments.list(user),o=occurrences.list(user);
 return {
  stats:{patients:p.length,highRisk:p.filter(x=>x.risk==='alto').length,
   scheduled:a.filter(x=>x.status==='agendada').length,openOccurrences:o.filter(x=>x.status!=='concluida').length},
  appointments:a.filter(x=>x.status==='agendada').sort((x,y)=>x.at.localeCompare(y.at)).slice(0,5),
  occurrences:o.filter(x=>x.status!=='concluida').slice(0,4),
  patients:p.slice(0,5)
 };
}
async function api(req,res,url){
 const {pathname}=url,method=req.method;
 if(pathname==='/api/health'&&method==='GET')return json(res,200,{ok:true,mode:'demonstracao'});
 if(pathname==='/api/auth/login'&&method==='POST'){
  const result=auth.login(req,await parseBody(req));
  return json(res,200,{user:result.user},{'Set-Cookie':result.cookie});
 }
 const user=auth.currentUser(req);
 if(!user)throw fail(401,'Sessão expirada. Entre novamente.');
 if(pathname==='/api/auth/me'&&method==='GET')return json(res,200,{user:auth.publicUser(user)});
 if(pathname==='/api/auth/logout'&&method==='POST')return json(res,200,{ok:true},{'Set-Cookie':auth.logout(req)});
 if(pathname==='/api/dashboard'&&method==='GET')return json(res,200,dashboard(user));
 if(pathname==='/api/units'&&method==='GET')return json(res,200,{items:all('SELECT * FROM units ORDER BY name')});
 if(pathname==='/api/patients'){
  if(method==='GET')return json(res,200,{items:patients.list(user,text(url.searchParams.get('q'),100))});
  if(method==='POST')return json(res,201,patients.create(user,await parseBody(req)));
 }
 const p=pathname.match(/^\/api\/patients\/(\d+)$/);
 if(p){
  const id=Number(p[1]);
  if(method==='GET')return json(res,200,{item:patients.get(user,id),appointments:appointments.list(user).filter(a=>a.patient_id===id),occurrences:occurrences.list(user).filter(o=>o.patient_id===id)});
  if(method==='PUT')return json(res,200,patients.update(user,id,await parseBody(req)));
  if(method==='DELETE')return json(res,200,patients.archive(user,id));
 }
 if(pathname==='/api/appointments'){
  if(method==='GET')return json(res,200,{items:appointments.list(user)});
  if(method==='POST')return json(res,201,appointments.create(user,await parseBody(req)));
 }
 const a=pathname.match(/^\/api\/appointments\/(\d+)$/);
 if(a&&method==='PUT')return json(res,200,appointments.update(user,Number(a[1]),await parseBody(req)));
 if(pathname==='/api/occurrences'){
  if(method==='GET')return json(res,200,{items:occurrences.list(user)});
  if(method==='POST')return json(res,201,occurrences.create(user,await parseBody(req)));
 }
 const o=pathname.match(/^\/api\/occurrences\/(\d+)$/);
 if(o&&method==='PATCH')return json(res,200,occurrences.update(user,Number(o[1]),await parseBody(req)));
 if(pathname==='/api/reports'&&method==='GET')return json(res,200,reports.summary(user));
 if(pathname==='/api/reports/patients.csv'&&method==='GET'){
  const csv=reports.patientsCsv(user);audit(user,'exportar','relatorio','pacientes');
  res.writeHead(200,{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="pacientes-demo.csv"','Cache-Control':'no-store'});
  return res.end(csv);
 }
 if(pathname==='/api/audit'&&method==='GET'){
  requireAdmin(user);return json(res,200,{items:reports.auditLog(user)});
 }
 throw fail(404,'Rota não encontrada.');
}
function staticFile(req,res,url){
 let decoded;try{decoded=decodeURIComponent(url.pathname);}catch{throw fail(400,'Endereço inválido.');}
 const file=path.resolve(ROOT,'.'+(decoded==='/'?'/index.html':decoded));
 if(!file.startsWith(ROOT+path.sep))throw fail(403,'Acesso negado.');
 if(!Object.hasOwn(MIMES,path.extname(file)))throw fail(404,'Página não encontrada.');
 let stat;try{stat=fs.statSync(file);}catch{throw fail(404,'Página não encontrada.');}
 if(!stat.isFile())throw fail(404,'Página não encontrada.');
 res.writeHead(200,{'Content-Type':MIMES[path.extname(file)]||'application/octet-stream','Content-Length':stat.size,'Cache-Control':path.extname(file)==='.html'?'no-store':'public, max-age=120'});
 fs.createReadStream(file).pipe(res);
}
function handler(req,res){
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('X-Frame-Options','DENY');
 res.setHeader('Referrer-Policy','no-referrer');
 res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'");
 try{
  checkOrigin(req);
  const url=new URL(req.url,'http://localhost');
  if(url.pathname.startsWith('/api/'))return Promise.resolve(api(req,res,url)).catch(e=>handleError(e,res));
  if(req.method!=='GET')throw fail(405,'Método não permitido.');
  return staticFile(req,res,url);
 }catch(e){handleError(e,res);}
}
function handleError(e,res){
 if(!e.status)console.error('[Brasil Longevo]',e);
 if(!res.headersSent)json(res,e.status||500,{error:e.status?e.message:'Falha interna no servidor.'});
}
const server=http.createServer(handler);
if(require.main===module){
 if(process.env.NODE_ENV==='production'&&process.env.ALLOW_DEMO_PRODUCTION!=='1'){
  console.error('Não publique este protótipo com credenciais demonstrativas.');process.exit(1);
 }
 const port=Number(process.env.PORT)||3000;
 server.listen(port,'127.0.0.1',()=>console.log(`Brasil Longevo v2 (demonstração) → http://localhost:${port}`));
}
module.exports={server,handler};
