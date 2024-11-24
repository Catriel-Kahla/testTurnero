// User Logued
const getIndividuos = () => {  
    // Obtiene usuario en session
    let session = JSON.parse(sessionStorage.getItem('token'))

    // sessionStorage vacio
    if(!session){
        window.location = `../../turnero/index.html`;
        return;
    }
    let params = `username=${session.username}
                  &password=${session.password}`; 

    let obj = new XMLHttpRequest();
    obj.open('POST', `${baseUrl}Individuos/IndividuosServices.p`, true);
    obj.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    obj.onreadystatechange = function () { 
        
        if(obj.readyState == 4) {  
            if(obj.responseText.length == 0){
                return false;
            } 
            const jsonObj = JSON.parse(obj.responseText); 

            if(jsonObj.valido === 'false') {
               // window.location= `../../turnero/index.html`;
                return false; 
            } 

            
            // document.getElementById('nombreUsuario').innerHTML = jsonObj.nombre;
            //document.getElementById('nombreSector').innerHTML = jsonObj.sector; 
            //return jsonObj;

            
            document.getElementById('numeroDocumento').value = jsonObj.nroDoc;
            document.getElementById('nombreIndividuo').value = jsonObj.nombreIndividuo;
            document.getElementById('fechaNacimiento').value = jsonObj.fechaNacimiento.split('/').reverse().join('-');
            document.getElementById('calle').value = jsonObj.domicilioCalle;
            document.getElementById('numeroCalle').value = jsonObj.domicilioNumero;
            document.getElementById('pisoCalle').value = jsonObj.domicilioPiso;
            document.getElementById('departamento').value = jsonObj.domicilioDepartamento;
            document.getElementById('email').value = jsonObj.mail;
            document.getElementById('celu').value = jsonObj.celular; 
            document.getElementById('fijo').value = jsonObj.fijo; 

            getTiposDocumentos(jsonObj.tipDoc)
            getLocalidades(jsonObj.codigoPostal)
            getPaises(jsonObj.pais);
            getEstadoCivil(jsonObj.estadoCivil);


            return jsonObj;
        }
    }
    obj.send(params);
    return false;
};

const getTiposDocumentos = (tipoDocumento) => {
    let txtHtml = '';
    let params = '';
    if(tipoDocumento && parseInt(tipoDocumento) !== 0){
        params = `?tipoDocumento=${tipoDocumento}`;  
    }

    let obj = new XMLHttpRequest();
    obj.open('GET', `${baseUrl}TiposDocumentos/TiposDocumentosServices.p${params}`, true);
    obj.onreadystatechange = function () {
        if (obj.readyState === 4 && obj.status === 200) {
           
            if(obj.responseText.length === 0){
                return false;
            } 
            const jsonObj = JSON.parse(obj.responseText);
            jsonObj.forEach(element => {
                txtHtml += `<option value="${element.tipdoc}">${element.descripcion}</option>`;
            });
            document.getElementById('tipoDocumento').innerHTML = txtHtml;
            return jsonObj;
        }
    };
    obj.send();
    return false;
};

const getLocalidades = (codigoPostal) => { 
    let params = '';
    if(codigoPostal && parseInt(codigoPostal) !== 0){
        params = `?codigoPostal=${codigoPostal}`;  
    }
    
    
    let txtHtml = '';
    let obj = new XMLHttpRequest();
    obj.open('GET', `${baseUrl}Localidades/LocalidadesServices.p${params}`, true);
    obj.onreadystatechange = function () {
        if (obj.readyState === 4 && obj.status === 200) {
           
            if(obj.responseText.length === 0){
                return false;
            }  
            const jsonObj = JSON.parse(obj.responseText);
            jsonObj.forEach(element => {
                txtHtml += `<option value="${element.codigoPostal}">${element.localidad}</option>`;
            });
            document.getElementById('codigoPostal').innerHTML = txtHtml;
            return jsonObj;
        }
    };
    obj.send();
    return false;
};

const getPaises = (codigoPais) => { 
    let params = '';
    let txtHtml = '';
    if(codigoPais && parseInt(codigoPais) !== 0){
        params = `?codigoPais=${codigoPais}`;  
    }
    
    let obj = new XMLHttpRequest();
    obj.open('GET', `${baseUrl}Paises/PaisesServices.p${params}`, true);
    obj.onreadystatechange = function () {
        if (obj.readyState === 4 && obj.status === 200) {
           
            if(obj.responseText.length === 0){
                return false;
            } 
            const jsonObj = JSON.parse(obj.responseText);
            
            jsonObj.forEach(element => {
                txtHtml += `<option value="${element.codigoPais}">${element.nombrePais}</option>`;
            });
            document.getElementById('codigoPais').innerHTML = txtHtml;
            return jsonObj;
        }
    };
    obj.send();
    return false;
};

const getEstadoCivil = (codigoCivil) => {
    let txtHtml = '';
    let params = '';
    if(codigoCivil && parseInt(codigoCivil) !== 0){
        params = `?codigoCivil=${codigoCivil}`;  
    }
    let obj = new XMLHttpRequest();
    obj.open('GET', `${baseUrl}EstadosCivil/EstadosCivilServices.p${params}`, true);
    obj.onreadystatechange = function () {
        if (obj.readyState === 4 && obj.status === 200) {
           
            if(obj.responseText.length === 0){
                return false;
            } 
            const jsonObj = JSON.parse(obj.responseText);
            jsonObj.forEach(element => {
                txtHtml += `<option value="${element.codigoCivil}">${element.nombreCivil}</option>`;
            });
            document.getElementById('codigoCivil').innerHTML = txtHtml;
            return jsonObj;
        }
    };
    obj.send();
    return false;
};

// create form 
if(document.getElementById('btn-create')) {  
    document.getElementById('btn-create').addEventListener('click', (e) => { 
    e.preventDefault();
    let validate = true;
    const tipoDocumento = document.getElementById('tipoDocumento').value; 
    const numeroDocumento = document.getElementById('numeroDocumento').value;
    const nombreIndividuo = document.getElementById('nombreIndividuo').value;
    const calle = document.getElementById('calle').value;
    const numeroCalle = document.getElementById('numeroCalle').value;
    const pisoCalle = document.getElementById('pisoCalle').value;
    const departamento = document.getElementById('departamento').value;
    const codigoPostal = document.getElementById('codigoPostal').value;
    const codigoPais = document.getElementById('codigoPais').value;
    const fechaNacimiento = document.getElementById('fechaNacimiento').value.split('-').reverse().join('/');
    const codigoCivil = document.getElementById('codigoCivil').value;
    const email = document.getElementById('email').value;
    const celu = document.getElementById('celu').value;
    const fijo = document.getElementById('fijo').value;
    var params = `tipoDocumento=${tipoDocumento}
                  &numeroDocumento=${numeroDocumento}
                  &nombreIndividuo=${nombreIndividuo}
                  &calle=${calle}
                  &numeroCalle=${numeroCalle}
                  &pisoCalle=${pisoCalle}
                  &departamento=${departamento}
                  &codigoPostal=${codigoPostal}
                  &codigoPais=${codigoPais}
                  &fechaNacimiento=${fechaNacimiento}
                  &codigoCivil=${codigoCivil}
                  &email=${email}
                  &celu=${celu}
                  &fijo=${fijo}
                 `;
    // Valido campos requeridos 
    if(tipoDocumento.length === 0 || parseInt(tipoDocumento) === 0) {
        document.getElementById('requiredTipoDocumento').innerHTML = `<p class="text-danger">Campo Obligatorio</p>`
        validate = false;
    } 
    else {
        document.getElementById('requiredTipoDocumento').innerHTML = `<p class="text-danger"></p>` 
    } 
    if(numeroDocumento.length === 0 || parseInt(numeroDocumento) === 0) {
        document.getElementById('requiredNumeroDocumento').innerHTML = `<p class="text-danger">Campo Obligatorio</p>`
        validate = false;
    } 
    else {
        document.getElementById('requiredNumeroDocumento').innerHTML = `<p class="text-danger"></p>`  
    } 
    if(nombreIndividuo.length === 0) { 
        document.getElementById('requiredNombreIndividuo').innerHTML = `<p class="text-danger">Campo Obligatorio</p>`
        validate = false;
    } 
    else {
        document.getElementById('requiredNombreIndividuo').innerHTML = `<p class="text-danger"></p>`  
    }

    if(calle.length === 0) {
        document.getElementById('requiredCalle').innerHTML = `<p class="text-danger">Campo Obligatorio</p>`
        validate = false;
    } 
    else {
        document.getElementById('requiredCalle').innerHTML = `<p class="text-danger"></p>`  
    }

    if(numeroCalle.length === 0 || parseInt(numeroCalle) === 0) {
        document.getElementById('requiredNumeroCalle').innerHTML = `<p class="text-danger">Campo Obligatorio</p>`
        validate = false;
    } 
    else {
        document.getElementById('requiredNumeroCalle').innerHTML = `<p class="text-danger"></p>`  
    }

    if(codigoPostal.length === 0 || parseInt(codigoPostal) === 0) {
        document.getElementById('requiredCodigoPostal').innerHTML = `<p class="text-danger">Campo Obligatorio</p>`
        validate = false;
    } 
    else {
        document.getElementById('requiredCodigoPostal').innerHTML = `<p class="text-danger"></p>`  
    }

    if(fechaNacimiento.length === 0) {
        document.getElementById('requiredFechaNacimiento').innerHTML = `<p class="text-danger">Campo Obligatorio</p>`
        validate = false;
    } 
    else {
        document.getElementById('requiredFechaNacimiento').innerHTML = `<p class="text-danger"></p>`  
    }

    if(email.length === 0) {
        document.getElementById('requiredEmail').innerHTML = `<p class="text-danger">Campo Obligatorio</p>`
        validate = false;
    } 
    else {
        document.getElementById('requiredEmail').innerHTML = `<p class="text-danger"></p>`  
    }

    if(celu.length === 0) {
        document.getElementById('requiredCelu').innerHTML = `<p class="text-danger">Campo Obligatorio</p>`
        validate = false;
    } 
    else {
        document.getElementById('requiredCelu').innerHTML = `<p class="text-danger"></p>`  
    }

    //  si no pasa la validacion, no envia datos al back
    if (validate === false ){
        return false;
    }

    
    let obj = new XMLHttpRequest();
    let counter = 0;
    obj.open('POST', `${baseUrl}/Individuos/IndividuoCreateServices.p`, true);
    obj.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    obj.onreadystatechange = function () {
        if (obj.readyState ===4  && obj.status === 200) { 
            if(obj.responseText.length === 0){
                return false;
            }  
            const jsonObj = JSON.parse(obj.responseText); 
            if (jsonObj.error !== '') { 
                infoError = `
                <div class="alert alert-danger" role="alert">
                <strong>ERROR! - </strong>${jsonObj.error}
                </div>
                `
                document.getElementById('infoError').innerHTML = infoError;
                return false;
            }
            window.location = '../inicio.html';
            return jsonObj;
        }
    }
    obj.send(params);
    return false;
});
};