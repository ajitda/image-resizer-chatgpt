export const readFile = (file) => {
   return new Promise((resolve, reject) => {
     const reader = new FileReader();
 
     reader.onload = (e) => {
       resolve(e.target.result);
     };
 
     reader.onerror = (e) => {
       reject(e);
     };
 
     reader.readAsDataURL(file);
   });
 };
 
 export const createObjectURL = (file) => {
   return URL.createObjectURL(file);
 };
 