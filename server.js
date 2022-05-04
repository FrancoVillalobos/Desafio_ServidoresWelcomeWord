const http = require('http');
const url = require('url');
const fs = require('fs');

http.createServer(function (req, res) {
    //recibios los parametros que nos envia el cliente
    const params = url.parse(req.url, true).query
    const archivo = params.archivo 
    const contenido = params.contenido      
    const nombreViejo = params.nombre       
    const nombreNuevo = params.nuevoNombre  
    
    // Fecha Actual en variables para cocatenar en formato dd/mm/aaaa
    let fecha = new Date();
    let anio = fecha.getFullYear();
    let mes = fecha.getMonth() + 1;
    let dia = fecha.getDate();
    // En caso de ser menor a diez concatenar un cero antes
    if (mes < 10) {
        mes = `0${mes}`
    }
    if (dia < 10) {
        dia = `0${dia}`
    }
    // ordenando segun requerimiento
    let fechaActual = `${dia}/${mes}/${anio}`;

    //crear las rutas
    if (req.url.includes('/crear')) {
        fs.writeFile('archivos/'+ archivo, `${fechaActual} - ${contenido}`,"utf-8", (error) => {
            if(error){
                res.write(`<h1>${fechaActual} - Ha ocurrido un error al crear "${archivo}".</h1>`)
            }
            else{
                res.write(`<h1>${fechaActual} - "${archivo}" ha sido creado correctamente.</h1>`)
            }            
            res.end()
        })
    }
    
    if (req.url.includes('/leer')) {
        fs.readFile('archivos/'+ archivo, (error, data) => {
            if (error) {
                res.write(`<h1>Ha ocurrido un error al leer "${archivo}"</h1>`)
                res.end()
            } else {
                res.write(`<h1>"${archivo}" contiene: ${data}</h1>`)
                res.end()
            }
        })
    }

    if (req.url.includes('/renombrar')){
        fs.rename('archivos/'+ nombreViejo, 'archivos/'+ nombreNuevo, (error) => {
            if (error) {
                res.write(`<h1>Error al renombrar: + "${nombreViejo}"</h1>`)                
            } else {
                res.write(`<h1>"${nombreViejo}" ha sido renombrado a "${nombreNuevo}"</h1>`)
                res.write(`<a href="index.html"><center>VOLVER</center></a>`)                     
            }
            res.end()
        })
    }

    if (req.url.includes('/eliminar')) {
        res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"})
        fs.unlink('archivos/'+ archivo, (error) => {
            if (error) {
                res.write(`<h1>No se pudo eliminar "${archivo}"</h1>`)
            }else{
                res.write(`<h1> Procesando petición para eliminar: "${archivo}" </h1>`)
                setTimeout(() => {
                    res.write(`<h1> "${archivo}" fue eliminado correctamente </h1>`, 'UTF-8', ()=>{
                        res.end();
                    });                    
                }, 3000);                  
            }

        })
    }
}).listen(8080, () => console.log("Servidor funcionando en puerto 8080."));