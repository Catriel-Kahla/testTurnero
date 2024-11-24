// USUARIOS: Controller para Turnos administrativos

const getTurnos = (fecha) => {  
  let templateCard = '', templateLoading = '', templateBtnFecha = '', templateRequisitos = '';
  var searchParams = new URLSearchParams(location.search);
  
  if(fecha===undefined || fecha === null){
    fecha = searchParams.get('p-fecha');
    if(fecha){
      document.getElementById('fechaInput').value=fecha.split('/').reverse().join('-');
    }
  }
  else{
    document.getElementById('fechaInput').value=fecha.split('/').reverse().join('-');
  }
  document.getElementById('fechaInput').min = new Date().toISOString().slice(0, 10);
  // Obtiene usuario en session
  let session = JSON.parse(sessionStorage.getItem('token'));
  // sessionStorage vacio
  if(!session){
    window.location = `../../turnero/index.html`;
    return;
  }
  let params = `?p-username=${session.username}
                &p-password=${session.password}
                &p-funcion=getAll
                &p-codigoEmpresa=1
                &p-codigoSector=1`; //carnet de conducir 

  if(fecha){
    params += `&p-fecha=${fecha.split('-').reverse().join('/')}`;
  }
    // muestra spinner cargando
    templateLoading = `<div class="loading"><img src="/turnero/assets/images/loader.gif" alt="loading" /><br/>Un momento, por favor...</div>`
    document.getElementById('loading').innerHTML = templateLoading

    document.getElementById('infoError').innerHTML = '';
    document.getElementById('requisitos').innerHTML = '';
    document.getElementById('muestraFecha').style.display = "";

    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const myRequest = new Request(`${baseUrl}turnos/ConstruyeTurnos.p${params}`, options);
    fetch(myRequest)
      .then(response => {  
        if (!response.ok) {
          throw new Error('Problema con la respuesta del servidor');
        }
        return response.json()
      })
        .then(data => { 
            document.getElementById('loading').innerHTML = '';
            if(data.error){  
              const identificador = data.identificador
              const hora = data.hora
              const fecha = data.fecha
              const tipoDocumento = data.tipdoc
              const numeroDocumento = data.numeroDocumento

              let infoError = `
              <div class="alert alert-info d-flex justify-content-between" role="alert">
              <div>
              <strong>INFO! - </strong>${data.error}<span>`
              if(data.estado === 'pendiente'){
                infoError += `
                
                <a href="tramitesturnos.html?p-fecha=${fecha}&p-id=${identificador}&p-hora=${hora}&p-tipdoc=${tipoDocumento}&p-nrodoc=${numeroDocumento}">
                <button class="btn btn-link text-left"><strong class="text-success">CONTINUAR CON EL TRAMITE</strong></button>
                </a>
                `
              }

              infoError += `
               <span> - &nbsp;&nbsp;</span>
               <a href="#" onclick="TurnoDelete(${identificador}, '${fecha}')">
               <button class="btn btn-link text-left"><strong class="text-danger">DAR DE BAJA TURNO</strong></button>
               </a>
               </span>
                </div>
              </div>
              `
               if(data.estado === 'finalizado') {
                templateRequisitos += 
            ` 
            <h6 class="ml-2 mb-4 mt-5"><b>Documentaci\u00F3n que debes traer el d\u00EDa del turno:</b></h6>
            <h6 class="ml-5">* Documento Nacional de Identidad y Fotocopia</h6>
            <h6 class="ml-5">* Carnet de Conducir y Fotocopia<span class="text-muted"> (solo para <b>RENOVACION</b>)</span></h6>
            <h6 class="ml-5">* Imprimir informe del Ce.N.A.T. en la siguiente p\u00E1gina: 
                <a href="https://santafe.gov.ar/cenat" target="_blank">santafe.gov.ar/cenat</a>
                <span class="text-muted"> (centro emisor: <b>PEREZ</b>)</span></h6>
            <h6 class="ml-5">* Grupo Sangu\u00EDneo<span class="text-muted"> (solo Carnet <b>NUEVO</b> - saberlo)</span></h6> 
            <h6 class="ml-5">* Antecedentes Penales<span class="text-muted"> (solo Clase D1)</span></h6> 
            <h6 class="ml-5">* Libre Multa Municipal</h6> 
            <h6 class="ml-5">* Constancia del Curso<span class="text-muted"> (solo Carnet <b>NUEVO</b> y <b>RENOVACION</b> vencidas m\u00E1s de 1 a\u00F1o)</span></h6> 
            <br>
            <p class="alert alert-info"><b>INFORMACION IMPORTANTE:</b> Todo solicitante de Licencia de Conducir, con antecedentes o enfermedad 
            actual de patolog\u00EDa card\u00EDaca, cl\u00EDnica, neur\u00F3logica, psiqui\u00E1trica, oftalmol\u00F3gica o de otorrinolaringolog\u00EDa; o aquel solicitante
            mayor de 65 a\u00F1os, con o sin patolog\u00EDas previas, deber\u00E1n retirar las planillas de interconsultas m\u00E9dicas, uno o dos meses antes 
            por la oficina de tr\u00E1nsito, esas interconsultas deber\u00E1n estar completas al momento del ex\u00E1men m\u00E9dico en el Gabinete Psicof\u00EDsico.
            (Area M\u00E9dica de la Oficina de Tr\u00E1nsito de Licencia de Conducir)
       
            </p>`;
               }
              
              document.getElementById('infoError').innerHTML = infoError;
              document.getElementById('requisitos').innerHTML = templateRequisitos;
              document.getElementById('muestraFecha').style.display = "none";

              
              return;
            }
            else document.getElementById('infoError').innerHTML = '';

            document.getElementById('fechaInput').value=data[0].fechaTurno.split('/').reverse().join('-');

            // fecha de inicio en calendario
            document.getElementById('fechaInput').min = data[0].fechaInicio.split('/').reverse().join('-');

            
            if(fecha <= data[0].fechaInicio){
              templateBtnFecha = `
              <button class="btn btn-light" id="restar-dia" disabled> <<< Anterior </button>
              </div>
              <div class="input-group-append">
              <button class="btn btn-light ml-2" id="sumar-dia"> Siguiente >>> </button>`;
            }
            else{  
              templateBtnFecha = `
              <button class="btn btn-light" id="restar-dia"> <<< Anterior </button>
              </div>
              <div class="input-group-append">
              <button class="btn btn-light ml-2" id="sumar-dia"> Siguiente >>> </button>`;
            } 
            document.getElementById('botonesFecha').innerHTML = templateBtnFecha; 
            // Manejadores de eventos de clic
            if(document.getElementById('sumar-dia')){ 
              document.getElementById('sumar-dia').addEventListener('click', (e) => { 
                sumarDia();
              })
            };
            if(document.getElementById('restar-dia')){ 
              document.getElementById('restar-dia').addEventListener('click', (e) => { 
                restarDia(data[0].fechaInicio.split('/').reverse().join('-'));
              })
            };

      if(data.length > 18){
        const informacion = `
        <div class="alert alert-warning" role="alert">
        <strong>ADVERTENCIA! - </strong>Los Turnos #19 en adelante deber&aacute;n concurrir en el horario del turnos para hacer la 
        parte administrativa. Por la tarde se realizar&aacute la parte m&eacute;dica
        </div>
        `
        document.getElementById('informacion').innerHTML = informacion;
        
      }
      else{
        document.getElementById('informacion').innerHTML = '';
      }
      // VER tipo de charla porquer guarda siempre el mismo

            data.forEach(element => { 
                if(element.estado === "disponible"){
                    templateCard += `
                    <div class="col-md-2">
                            <div class="card mb-4">
                                <div class="card-body">
                                    <h5 class="card-title">Turno #${element.numeroTurno}</h5>
                                    <p class="card-text">Fecha: ${element.fechaTurno}</p>
                                    <p class="card-text">Hora: ${element.horaTurno}</p> 
                                    <a href="turnonuevo.html?identificador=${element.numeroTurno}&tipdoc=${element.tipoDocumento}&nrodoc=${element.numeroDocumento}&p-fecha=${element.fechaTurno}&p-hora=${element.horaTurno}" class="btn btn-secondary btn-block">Tomar Turno</a>
                                    </div>
                            </div>
                        </div>
                    `;
                }
            });
            document.getElementById('tarjetas').innerHTML = templateCard;
        }
        )
        .catch(error => { 
          // Verificar si la respuesta no fue un JSON válido
          if (error instanceof SyntaxError && error.message.includes('JSON')) {
            console.error('Error: Respuesta del servidor no válida');
            
      
          } else {
            // Manejar otros tipos de errores
            console.error('Error:', error.message);
          }
          document.getElementById('loading').innerHTML = '';
            return;
        });
      };


  if(document.getElementById('botonCalendario')) {
    document.getElementById('botonCalendario').addEventListener('click', function() {
      
      const fecha = document.getElementById('fechaInput').value.split('-').reverse().join('/');
      getTurnos(fecha);
    })
   };

   
// ------------------------- Función para sumar un día a la fecha -------------------------------
function sumarDia() { 
    var fecha = new Date(document.getElementById('fechaInput').value);
    fecha.setDate(fecha.getDate() + 1);
    document.getElementById('fechaInput').value = fecha.toISOString().slice(0, 10);
    document.getElementById('fechaInput').min = new Date().toISOString().slice(0, 10);
    getTurnos(document.getElementById('fechaInput').value.split('-').reverse().join('/'));
    
  }
  
// ------------------------ Función para restar un día a la fecha -------------------------------
function restarDia(inicio) { 
  var fecha = new Date(document.getElementById('fechaInput').value);
  fecha.setDate(fecha.getDate() - 1);
  document.getElementById('fechaInput').min = inicio;
  document.getElementById('fechaInput').value = fecha.toISOString().slice(0, 10);
  getTurnos(document.getElementById('fechaInput').value.split('-').reverse().join('/'));
}

  
  
  const getTurno = () => {  
    let codigoPostal = '', estadoCivil = '', pais = '';
  
    const queryString = location.search;
    // Crear un objeto URLSearchParams
    const parametros = new URLSearchParams(queryString);
  
    // Obtener el valor de los parámetros deseados
    const identificador = parametros.get('identificador');
    const fecha = parametros.get('p-fecha');
    const tipdoc = parametros.get('tipdoc');
    const nrodoc = parametros.get('nrodoc');
    const hora = parametros.get('p-hora');
    
    // Obtiene usuario en session
    let session = JSON.parse(sessionStorage.getItem('token'))
    // sessionStorage vacio
    if(!session){
      window.location = `${ipServer}turnero/index.html`;
      return;
    };
    
    
    let  params=`?p-username=${session.username}
               &p-password=${session.password}
               &p-id=${identificador}
               &p-fecha=${fecha.split('-').reverse().join('/')}
               &p-funcion=getOne
               &p-tipdoc=${tipdoc}
               &p-nrodoc=${nrodoc}
               &p-hora=${hora}
               &p-codigoSector=1
               &p-codigoEmpresa=1`;
    
    
    
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
        
    const myRequest = new Request(`${baseUrl}Turnos/TurnosContribServices.p${params}`, options);
    fetch(myRequest)
      .then(response => {  
        if (!response.ok) {
          throw new Error('Problema con la respuesta del servidor');
        }
        return response.json()
      })
        .then(data => { console.log(data)
          
          document.getElementById('identificador').value = data[0].idTurno
          document.getElementById('fecha').value = data[0].fechaTurno.split('/').reverse().join('-')
          document.getElementById('tipoDocumento').value = data[0].tipoDocumento
          document.getElementById('documento').value = data[0].numeroDocumento
          document.getElementById('apellido').value = data[0].nombres
          document.getElementById('calle').value = data[0].domicilioCalle
          document.getElementById('numeroCalle').value = data[0].domicilioNumero
          document.getElementById('pisoCalle').value = data[0].piso
          document.getElementById('departamento').value = data[0].depto
          document.getElementById('codigoPostal').value = data[0].codigoPostal
          document.getElementById('codigoPais').value = data[0].pais
          document.getElementById('codigoCivil').value = data[0].estadoCivil
          document.getElementById('hora').value = data[0].horaTurno
          document.getElementById('email').value = data[0].mail
          document.getElementById('celu').value = data[0].celular
          document.getElementById('fijo').value = data[0].fijo
          document.getElementById('descripcion').value = data[0].descripcion
          document.getElementById('fechaNacimiento').value = data[0].fechaNacimiento.split('/').reverse().join('-')
  
          getTiposDocumentos(data[0].tipoDocumento)
          if(data[0].codigoPostal) codigoPostal = data[0].codigoPostal; 
          if(data[0].pais) pais = data[0].pais; 
          if(data[0].estadoCivil) estadoCivil = data[0].estadoCivil; 
  
          getLocalidades(codigoPostal)
          getPaises(pais);
          getEstadoCivil(estadoCivil);
          getIndividuo(data[0].tipoDocumento, data[0].numeroDocumento)
          
  
      }
        )
        .catch(error => console.error(error));
  };


  const TurnoDelete = (identificador, fecha) => {  
  let params = '';
  // diseño boton de alerta
  const titulo = '<h6 class="text-secondary font-weight-bold"><b>BAJA DE TURNO</b></h6>'
  const mensaje = `<p class="text-center">
                  <span class="text-secondary font-weight">Confirma la baja del turno del dia  
                  <span class="text-secondary font-weight-bold"> ${fecha}</span>? 
                  </span>
                  </p>
                  ` 
  alertify.defaults.transition = "slide";
  alertify.defaults.theme.ok = "btn btn-primary"
  alertify.defaults.theme.cancel = "btn btn-danger"
  alertify.defaults.theme.input = "form-control"

  // despliego notificación
  var confirm = alertify.confirm(titulo,mensaje,
  function() { 
      // Obtiene usuario en session
      let session = JSON.parse(sessionStorage.getItem('token'))
      // sessionStorage vacio
      if(!session){
          window.location = `${ipServer}turnero/index.html`;
          return;
      };

      params = `p-id=${identificador}
                &p-fecha=${fecha.split('-').reverse().join('/')}
                &p-codigoEmpresa=1
                &p-codigoSector=1
                &p-username=${session.username}
                &p-password=${session.password}
                &p-funcion=getDelete`;
                
      console.log(params)
      const options = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `${params}`
          };

          const myRequest = new Request(`${baseUrl}Turnos/TurnosContribServices.p`, options);
    
      fetch(myRequest)
          .then(response => { 
              if (!response.ok) {
                throw new Error('Problema con la respuesta del servidor');
              }
              return response.json()
              })
          .then(data => {  
          if(data.error !== ''){
            const infoError = `
            <div class="alert alert-danger" role="alert">
            <strong>ERROR! - </strong>${data.error}
            </div>
            `
            document.getElementById('infoError').innerHTML = infoError;
              return;
          }
              getTurnos(fecha);
          })
          .catch(error => console.error(error));
  },
  function() {
      alertify.error('Cancelado')
  }).set('labels', {ok:'Confirmar Baja', cancel:'Cancelar'})
  return
}


// ---------------------------------- Confirmacion de Datos ---------------------------------------------
if(document.getElementById('btn-create')) {  
  document.getElementById('btn-create').addEventListener('click', (e) => {     
  e.preventDefault();

  
  const identificador = document.getElementById('identificador').value
  const hora = document.getElementById('hora').value
  const tipoDocumento = document.getElementById('tipoDocumento').value
  const numeroDocumento = document.getElementById('documento').value
  const horaIngresada = document.getElementById('hora').value;

  if (!validarHora(horaIngresada)) {
    const infoError = `
        <div class="alert alert-danger" role="alert">
        <strong>ERROR! - </strong>La hora ingresada es inv\u00E1lida - Formato v\u00E1lido "HH:MM"
        </div>
        `
        document.getElementById('infoError').innerHTML = infoError;
    return;
  }

  const fecha = document.getElementById('fecha').value.split('-').reverse().join('/');
  // Obtiene usuario en session
  let session = JSON.parse(sessionStorage.getItem('token'))
  // sessionStorage vacio
  if(!session){
      window.location = `${ipServer}turnero/index.html`;
      return; 
  };

  let params = `p-id=${identificador}
                &p-username=${session.username}
                &p-password= ${session.password}
                &p-fecha=${document.getElementById('fecha').value.split('-').reverse().join('/')}
                &p-tipdoc=${document.getElementById('tipoDocumento').value}
                &p-nrodoc=${document.getElementById('documento').value}
                &p-apellido=${document.getElementById('apellido').value}
                &p-calle=${document.getElementById('calle').value}
                &p-numeroCalle=${document.getElementById('numeroCalle').value}
                &p-pisoCalle=${document.getElementById('pisoCalle').value}
                &p-departamento=${document.getElementById('departamento').value}
                &p-codigoPostal=${document.getElementById('codigoPostal').value}
                &p-codigoPais=${document.getElementById('codigoPais').value}
                &p-fechaNacimiento=${document.getElementById('fechaNacimiento').value.split('-').reverse().join('/')}
                &p-codigoCivil=${document.getElementById('codigoCivil').value}
                &p-mail=${document.getElementById('email').value}
                &p-celular=${document.getElementById('celu').value}
                &p-fijo=${document.getElementById('fijo').value}
                &p-descripcion=${document.getElementById('descripcion').value}
                &p-hora=${document.getElementById('hora').value}
                &p-funcion=getCreate
                &p-codigoSector=1
                &p-codigoEmpresa=1
                `; //carnet de conducir

  console.log(params)              

  const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `${params}`
    };
    const myRequest = new Request(`${baseUrl}Turnos/TurnosContribServices.p`, options);
    
    fetch(myRequest)
    .then(response => {  
      if (!response.ok) {
        throw new Error('Problema con la respuesta del servidor');
      }
      return response.json();
      })
    .then(data => { 
      if(data.error !== ''){
        const infoError = `
        <div class="alert alert-danger" role="alert">
        <strong>ERROR! - </strong>${data.error}
        </div>
        `
        document.getElementById('infoError').innerHTML = infoError;
          return;
      }

      //window.location = `turnos.html?p-fecha=${fecha}`;
      window.location = `tramitesturnos.html?p-fecha=${fecha}&p-id=${identificador}&p-hora=${hora}&p-tipdoc=${tipoDocumento}&p-nrodoc=${numeroDocumento}`;

  }
    )
    .catch(error => console.error(error));


  });
};


  const getIndividuo = (tipdoc, nrodoc) => {  
    // Obtiene usuario en session
    let session = JSON.parse(sessionStorage.getItem('token'))
    if(nrodoc){
      const tipdoc = document.getElementById('tipoDocumento').value;
      const nrodoc = document.getElementById('documento').value;
    }
  
    // sessionStorage vacio
    if(!session){
        window.location = `../../turnero/index.html`;
        return;
    }
    let params = `?username=${session.username}
                  &tipdoc=${tipdoc}
                  &nrodoc=${nrodoc}`; 
  
    // elimino espacios en blanco               
    params = params.replace(/ /g, '');
    
  
    let obj = new XMLHttpRequest();
    obj.open('GET', `${baseUrl}Individuos/IndividuoServices.p${params}`, true);
    obj.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    obj.onreadystatechange = function () {  console.log(obj.responseText)
        
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
  
            
            document.getElementById('apellido').value = jsonObj.nombreIndividuo;
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
    obj.send();
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

  

function validarHora(hora) {
  var regex = /^(?:[01]\d|2[0-3]):(?:[0-5]\d)$/; // Expresión regular para el formato HH:MM

  if (regex.test(hora)) {
    // La hora es válida
    console.log("Hora válida: " + hora);
    return true;
  } else {
    // La hora es inválida
    console.log("Hora inválida: " + hora);
    return false;
  }
}