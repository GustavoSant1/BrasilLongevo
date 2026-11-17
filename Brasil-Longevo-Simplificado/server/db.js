'use strict';
// Único ponto de acesso ao SQLite. Nenhuma dependência externa.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'brasil-longevo.sqlite');
if (DB_PATH !== ':memory:') fs.mkdirSync(path.dirname(DB_PATH), {recursive:true});
const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA foreign_keys=ON; PRAGMA busy_timeout=4000;');
if (DB_PATH !== ':memory:') db.exec('PRAGMA journal_mode=WAL;');

// Instalações novas NÃO criam tabelas de medicamentos, prescrições ou doses.
// Bancos 1.x existentes podem manter tabelas históricas: não são utilizadas nem removidas.
db.exec(`
CREATE TABLE IF NOT EXISTS units (
 id INTEGER PRIMARY KEY, name TEXT NOT NULL, city TEXT NOT NULL, phone TEXT
);
CREATE TABLE IF NOT EXISTS patients (
 id INTEGER PRIMARY KEY, name TEXT NOT NULL, birth_date TEXT, phone TEXT,
 conditions TEXT NOT NULL DEFAULT '', caregiver_name TEXT NOT NULL DEFAULT '',
 unit_id INTEGER NOT NULL REFERENCES units(id),
 risk TEXT NOT NULL DEFAULT 'moderado' CHECK(risk IN ('baixo','moderado','alto')),
 archived INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS users (
 id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
 role TEXT NOT NULL CHECK(role IN ('admin','profissional','paciente','cuidador')),
 pass_hash TEXT NOT NULL, patient_id INTEGER REFERENCES patients(id),
 active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS caregiver_links (
 user_id INTEGER NOT NULL REFERENCES users(id),
 patient_id INTEGER NOT NULL REFERENCES patients(id),
 PRIMARY KEY (user_id,patient_id)
);
CREATE TABLE IF NOT EXISTS appointments (
 id INTEGER PRIMARY KEY, patient_id INTEGER NOT NULL REFERENCES patients(id),
 at TEXT NOT NULL, kind TEXT NOT NULL, professional TEXT NOT NULL DEFAULT '',
 status TEXT NOT NULL DEFAULT 'agendada', notes TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS emergency_requests (
 id INTEGER PRIMARY KEY, patient_id INTEGER NOT NULL REFERENCES patients(id),
 requested_by INTEGER NOT NULL REFERENCES users(id), description TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'registrada', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS audit (
 id INTEGER PRIMARY KEY, user_id INTEGER REFERENCES users(id),
 action TEXT NOT NULL, resource TEXT NOT NULL, resource_id TEXT,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS sessions (
 token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id),
 expires_at INTEGER NOT NULL
);
CREATE TRIGGER IF NOT EXISTS audit_no_update BEFORE UPDATE ON audit
 BEGIN SELECT RAISE(ABORT,'Auditoria somente de inclusão.'); END;
CREATE TRIGGER IF NOT EXISTS audit_no_delete BEFORE DELETE ON audit
 BEGIN SELECT RAISE(ABORT,'Auditoria somente de inclusão.'); END;
CREATE INDEX IF NOT EXISTS idx_patient_name ON patients(name);
CREATE INDEX IF NOT EXISTS idx_appointment_at ON appointments(at);
CREATE INDEX IF NOT EXISTS idx_appointment_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_occurrence_patient ON emergency_requests(patient_id);
`);

// Migração aditiva compatível com o banco 1.0.2, preservando registros já existentes.
const existingColumns = db.prepare('PRAGMA table_info(emergency_requests)').all().map(col=>col.name);
for (const [name,type] of [
 ['severity',"TEXT NOT NULL DEFAULT 'normal'"],
 ['resolution',"TEXT NOT NULL DEFAULT ''"],
 ['resolved_by','INTEGER'],
 ['resolved_at','TEXT']
]) {
 if(!existingColumns.includes(name)) db.exec(`ALTER TABLE emergency_requests ADD COLUMN ${name} ${type}`);
}

const all=(sql,...args)=>db.prepare(sql).all(...args).map(row=>({...row}));
const one=(sql,...args)=>{const row=db.prepare(sql).get(...args);return row?{...row}:null;};
const run=(sql,...args)=>db.prepare(sql).run(...args);
const passwordHash=password=>{
 const salt=crypto.randomBytes(16).toString('hex');
 return `${salt}:${crypto.scryptSync(password,salt,64).toString('hex')}`;
};
const verifyPassword=(password,stored)=>{
 if(typeof stored!=='string'||!stored.includes(':'))return false;
 const [salt,hex]=stored.split(':');
 if(!/^[a-f0-9]{32}$/i.test(salt)||!/^[a-f0-9]{128}$/i.test(hex))return false;
 const candidate=crypto.scryptSync(password,salt,64),actual=Buffer.from(hex,'hex');
 return crypto.timingSafeEqual(candidate,actual);
};
function seedDemo(){
 if(one('SELECT COUNT(*) AS n FROM users').n) return;
 const u1=Number(run('INSERT INTO units(name,city,phone) VALUES(?,?,?)','UBS Jardim Primavera (demonstração)','Ourinhos - SP','(14) 0000-0000').lastInsertRowid);
 const u2=Number(run('INSERT INTO units(name,city,phone) VALUES(?,?,?)','UBS Centro (demonstração)','Santa Cruz do Rio Pardo - SP','(14) 0000-0000').lastInsertRowid);
 const people=[
 ['João Silva','1948-05-10','Hipertensão, Diabetes','Ana Silva','alto',u1],
 ['Maria Souza','1954-09-23','Acompanhamento pós-alta','Carlos Souza','moderado',u1],
 ['Carlos Lima','1961-03-17','Mobilidade reduzida','Rita Lima','moderado',u1],
 ['Ana Pereira','1946-11-01','Acompanhamento contínuo','Juliana Pereira','alto',u1],
 ['José Martins','1951-07-12','Suporte domiciliar','Marcos Martins','alto',u1],
 ['Helena Costa','1958-01-26','Reabilitação','Laura Costa','baixo',u2],
 ['Pedro Almeida','1950-12-05','Acompanhamento respiratório','Isabela Almeida','alto',u2],
 ['Rosa Oliveira','1949-08-13','Acompanhamento periódico','Beatriz Oliveira','moderado',u2]
 ];
 people.forEach(([name,birth,conditions,caregiver,risk,unit])=>run(
  'INSERT INTO patients(name,birth_date,conditions,caregiver_name,risk,unit_id) VALUES(?,?,?,?,?,?)',name,birth,conditions,caregiver,risk,unit
 ));
 const tomorrow=new Date(Date.now()+86400000).toLocaleDateString('sv-SE',{timeZone:'America/Sao_Paulo'});
 const today=new Date().toLocaleDateString('sv-SE',{timeZone:'America/Sao_Paulo'});
 [
 [1,`${today}T14:30`,'Visita domiciliar','Enf. Carolina','agendada','Acompanhamento programado'],
 [2,`${tomorrow}T09:00`,'Consulta clínica','Dr. Rafael','agendada','Avaliação periódica'],
 [4,`${tomorrow}T10:30`,'Visita domiciliar','Enf. Carolina','agendada','Acompanhamento pós-alta'],
 [6,`${tomorrow}T15:00`,'Avaliação de rotina','Dr. Rafael','agendada',''],
 [3,`${today}T11:00`,'Consulta clínica','Dr. Rafael','concluída','']
 ].forEach(row=>run('INSERT INTO appointments(patient_id,at,kind,professional,status,notes) VALUES(?,?,?,?,?,?)',...row));
 [
 ['Coordenação Brasil Longevo','admin@brasil-longevo.local','admin','Admin@1234',null],
 ['Carolina Ferreira','enfermagem@brasil-longevo.local','profissional','Equipe@1234',null],
 ['João Silva','paciente@brasil-longevo.local','paciente','Paciente@1234',1],
 ['Ana Silva','cuidador@brasil-longevo.local','cuidador','Cuidador@1234',null]
 ].forEach(([name,email,role,password,patientId])=>run('INSERT INTO users(name,email,role,pass_hash,patient_id) VALUES(?,?,?,?,?)',name,email,role,passwordHash(password),patientId));
 run('INSERT INTO caregiver_links(user_id,patient_id) VALUES(?,?)',4,1);
 run('INSERT INTO audit(user_id,action,resource,resource_id) VALUES(?,?,?,?)',1,'seed_demo','sistema','2');
}
seedDemo();
module.exports={db,DB_PATH,all,one,run,verifyPassword};
