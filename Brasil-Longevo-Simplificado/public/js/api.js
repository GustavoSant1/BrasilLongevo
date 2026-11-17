// Um único cliente HTTP para todas as telas.
export async function api(path,{method='GET',data}={}){
 const response=await fetch(path,{
  method,credentials:'same-origin',
  headers:data===undefined?{}:{'Content-Type':'application/json'},
  ...(data===undefined?{}:{body:JSON.stringify(data)})
 });
 let result;
 try{result=await response.json();}catch{result={error:'Resposta inválida do servidor.'};}
 if(!response.ok){const error=new Error(result.error||`Erro HTTP ${response.status}`);error.status=response.status;throw error;}
 return result;
}
