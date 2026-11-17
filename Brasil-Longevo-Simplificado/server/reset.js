'use strict';
// Reset SOMENTE do banco demo padrão, mediante confirmação explícita.
const fs=require('node:fs');
const path=require('node:path');
const defaultDb=path.resolve(__dirname,'../data/brasil-longevo.sqlite');
if(process.argv[2]!=='--confirm'){
 console.error('Este comando apaga o banco demo. Para confirmar: npm run reset:demo -- --confirm');
 process.exit(1);
}
if(process.env.DB_PATH&&path.resolve(process.env.DB_PATH)!==defaultDb){
 console.error('Reset bloqueado: DB_PATH aponta para outro banco.');
 process.exit(1);
}
console.log('ATENÇÃO: somente dados locais de demonstração serão apagados.');
for(const suffix of ['','-wal','-shm']){
 try{fs.rmSync(defaultDb+suffix,{force:true});}catch(e){
  console.error('Feche o servidor e tente novamente:',e.message);process.exit(1);
 }
}
console.log('Reset concluído. Execute npm start para recriar dados fictícios.');
