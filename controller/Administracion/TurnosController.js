// busca turnos del dia
const getTurnos = (fecha) => { 
  let templateBoton = '', templateLoading = '', txtHtml = '', template = '', templateBtnFecha = '';
  if(fecha===undefined || fecha === null){
    var searchParams = new URLSearchParams(location.search);
    fecha = searchParams.get('p-fecha');
    document.getElementById('fechaInput').value=fecha.split('/').reverse().join('-');
    
  }
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
                  &p-fecha=${fecha.split('-').reverse().join('/')}
                  &p-codigoSector=1`; //carnet de conducir 

  params = params.replace(/ /g, '');
  // muestra spinner cargando
  templateLoading = `<div class="loading"><img src="/turnero/assets/images/loader.gif" alt="loading" /><br/>Un momento, por favor...</div>`
  document.getElementById('loading').innerHTML = templateLoading
  // vacio busqueda anterior
   
  // envio consulta al back 
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const myRequest = new Request(`${baseUrl}Administracion/TurnosServices.p${params}`, options);
  fetch(myRequest)
    .then(response => { 
      if (!response.ok) {
        throw new Error('Problema con la respuesta del servidor');
      }
      return response.json()
    })
    .then(data => { console.log(data)
      document.getElementById('loading').innerHTML = '';
      document.getElementById('table-result').innerHTML = ''
      document.getElementById('botonCreate').innerHTML = ''
      document.getElementById('botonPrinter').innerHTML = ''; 
      document.getElementById('infoError').innerHTML = '';
      
        templateBtnFecha = `
        <button class="btn btn-light" id="restar-dia"> <<< Anterior </button>
        </div>
        <div class="input-group-append">
        <button class="btn btn-light ml-2" id="sumar-dia"> Siguiente >>> </button>`;
      document.getElementById('botonesFecha').innerHTML = templateBtnFecha; 
      // Manejadores de eventos de clic
      if(document.getElementById('sumar-dia')){ 
        document.getElementById('sumar-dia').addEventListener('click', (e) => { 
          sumarDia();
        })
      };
      if(document.getElementById('restar-dia')){ 
        document.getElementById('restar-dia').addEventListener('click', (e) => { 
          restarDia();
        })
      };
      
      if(data.error && data.error !== ''){
        const infoError = `
        <div class="container mb-2">
        <div class="text-center">
            <h3 class="display-6 text-secondary">${data.error}</h3>
        </div>
        </div>
        `
        document.getElementById('infoError').innerHTML = infoError;
          return;
      }

      
      const queryString = location.search;
      // Crear un objeto URLSearchParams
      const parametros = new URLSearchParams(queryString);
      const fecha      = parametros.get('p-fecha');
      const username   = parametros.get('p-username');
      const password   = parametros.get('p-password');

      templateBoton = 
      `<div class="col-md-12  text-right">
        <a href="TurnoCreate.html?p-fecha=${fecha}&p-funcion=getOne&p-id=0&p-codigoEmpresa=1&p-codigoSector=1&p-tipdoc=0&p-nrodoc=0&p-tipoCharla=0">
        <button class="btn btn-primary mt-0"  style="width: 10rem;" type="button">Sobreturno</button>
        </a>
      </div>`;

      // Botón de impresión
      
      template = 
      `<div class="col-md-12  text-left">
      <a href="./printTurnos.html?p-fecha=${data[0].fechaTurno}&p-codigoEmpresa=1&p-codigoSector=${data[0].codigoSector}&p-funcion=getPDF&p-username=${session.username}&p-password=${session.password}" target="_blank">
      <button class="btn btn-secondary mt-0"  style="width: 10rem;" type="button">Imprimir Turnos</button>
      </a>
      </div>`;

      data.forEach(element => { 

        var valor = element.tramite;

      // Divide el valor en dos partes si contiene un guión "-"
      var partes = valor.split("-");
      if (partes.length > 1) {
        valorCelda = partes.join("<br>");
      } else {
        valorCelda = valor;
      }
        txtHtml += 
        ` <tr class="border p-3">
          <td class="text-secondary font-weight-bold text-center">${element.horaTurno}</td>
          <td class="font-weight-normal text-left">${element.idTurno}</td>
          <td class="font-weight-normal text-left">${element.nombres}</td>
          <td class="font-weight-normal text-left">${element.celular}</td>
          <td class="font-weight-normal text-left">${element.mail}</td>
          <td class="text-secondary font-weight-bold text-left">${valorCelda}</td>`

          if (element.estado === 'Completo') {
            txtHtml += `<td class="text-center"><span class="bg-success  small text-white rounded p-1">${element.estado}</span></td>`;
          }
          else if (element.estado === 'Pendiente') {
            txtHtml += `<td class="text-center"><span class="bg-warning  small text-white rounded p-1">${element.estado}</span></td>`;
          }
          else{
            txtHtml += `<td class="text-center"><span class="p-1"></span></td>`;
          }

          txtHtml += `
          <td class="text-center">
            <div class="dropdownleft">
              <button 
                class="btn btn-primary-outline text-primary" 
                type="button" 
                data-toggle="dropdown" 
                aria-haspopup="true" 
                aria-expanded="false"
              >
              <i class="fas fa-bars"></i>
              </button>
              <div class="dropdown-menu bg-primarysoft" aria-labelledby="dropdownMenuButton">`
              if(element.nombres){
                txtHtml += `<a class="dropdown-item text-center font-weight-bold text-mypage2" href="#">${element.nombres}</a>`
              }
              else{
                txtHtml += `<a class="dropdown-item text-center font-weight-bold text-mypage1" href="#">DISPONIBLE</a>`
              }
              txtHtml += `<hr class="my-0 py-0">`
              if(element.estado==='Pendiente'){
                txtHtml += `<a class="dropdown-item font-weight-bold text-secondary" href="./tramitesturnos.html?p-fecha=${element.fechaTurno}&p-id=${element.idTurno}&p-hora=${element.horaTurno}&p-tipdoc=${element.tipoDocumento}&p-nrodoc=${element.numeroDocumento}">Continuar</a>`
              }
              if(! element.nombres){
                txtHtml += `<a class="dropdown-item font-weight-bold text-secondary" href="./TurnoCreate.html${params}&identificador=${element.idTurno}&hora=${element.horaTurno}&p-tipdoc=${element.tipoDocumento}&p-nrodoc=${element.numeroDocumento}">Tomar Turno</a>`
              }
              else{
                txtHtml += `<a class="dropdown-item font-weight-bold text-secondary" href="./TurnoEdit.html${params}&identificador=${element.idTurno}&hora=${element.horaTurno}&p-tipdoc=${element.tipoDocumento}&p-nrodoc=${element.numeroDocumento}">Editar</a>
                <hr class="my-0 py-0">
                <a class="dropdown-item font-weight-bold text-danger" onclick="TurnoDelete(${element.idTurno}, 
                  '${element.nombres}', '${element.fechaTurno}', ${element.codigoEmpresa}, ${element.codigoSector}, ${element.tipoDocumento}, ${element.numeroDocumento})">Dar de Baja</a>`
              }
              txtHtml += `  
                
              </div>
            </div>
          </td>
          </tr>`;
      });
      document.getElementById('table-result').innerHTML = txtHtml 
      document.getElementById('botonCreate').innerHTML = templateBoton
      document.getElementById('botonPrinter').innerHTML = template; 
           
    }
  )
  .catch(error => { 
    document.getElementById('table-result').innerHTML = ''
    templateBtnFecha = `
      <button class="btn btn-light" id="restar-dia"> <<< Anterior </button>
      </div>
      <div class="input-group-append">
      <button class="btn btn-light ml-2" id="sumar-dia"> Siguiente >>> </button>`;
    document.getElementById('botonesFecha').innerHTML = templateBtnFecha; 
    // Manejadores de eventos de clic
    if(document.getElementById('sumar-dia')){ 
      document.getElementById('sumar-dia').addEventListener('click', (e) => { 
        sumarDia();
      })
    };
    if(document.getElementById('restar-dia')){ 
      document.getElementById('restar-dia').addEventListener('click', (e) => { 
        restarDia();
      })
    };

      templateBoton = 
      `<div class="col-md-12  text-right">
        <a href="TurnoCreate.html${params}">
        <button class="btn btn-primary mt-0 font-weight-bold"  style="width: 10rem;" type="button">Agregar</button>
        </a>
      </div>`;
      document.getElementById('botonCreate').innerHTML = templateBoton; 

    // Verificar si la respuesta no fue un JSON válido
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      console.error('Error: Respuesta del servidor no válida');

    } else {
      // Manejar otros tipos de errores
      console.error('Error:', error.message);
    }
    /*const infoError = `
    <div class="alert alert-danger" role="alert">
    <strong>ERROR! - </strong>Error: Respuesta del servidor no v\u00E1lida
    </div>
    `
    document.getElementById('infoError').innerHTML = infoError;*/
    document.getElementById('loading').innerHTML = '';
      return;
  });
};


 // Función para sumar un día a la fecha
 function sumarDia() { 
  var fecha = new Date(document.getElementById('fechaInput').value);
  fecha.setDate(fecha.getDate() + 1);
  document.getElementById('fechaInput').value = fecha.toISOString().slice(0, 10);
  document.getElementById('fechaInput').min = new Date().toISOString().slice(0, 10);
  getTurnos(document.getElementById('fechaInput').value.split('-').reverse().join('/'));
  
}

// Función para restar un día a la fecha
function restarDia() {
  var fecha = new Date(document.getElementById('fechaInput').value);
  fecha.setDate(fecha.getDate() - 1);
  document.getElementById('fechaInput').min = new Date().toISOString().slice(0, 10);
  document.getElementById('fechaInput').value = fecha.toISOString().slice(0, 10);
  getTurnos(document.getElementById('fechaInput').value.split('-').reverse().join('/'));
}


// Imprime la ficha de resumen del comercio
const getPrint = () => {
  let templateLoading = '';
  let params = '';
  if (location.search.length > 0) {
      params = location.search;
  }

  if (document.getElementById('loading')) {
      // Loading 
      templateLoading = `<div class="loading"><img src="/municipio2.0/assets/images/loader.gif" alt="loading" /><br/>Un momento, por favor...</div>`;
      document.getElementById('loading').innerHTML = templateLoading;
  }
  let obj = new XMLHttpRequest();
  obj.open('GET', `${baseUrl}Administracion/TurnosServices.p${params}`, true);
  obj.onreadystatechange = function () {
      templateLoading = '';
      if (obj.readyState == 4) { 
          
          // si viene sin datos para que no tire el error de parseo
          if(obj.responseText.length == 0){
              return false;
          } 
          const jsonObj = JSON.parse(obj.responseText);
          window.location = `${ipServer}Turnero/Documents/Impresiones/${jsonObj.file}`
          
          return jsonObj;
      }
      if (document.getElementById('loading')) {
          document.getElementById('loading').innerHTML = templateLoading;
      }
  };
  obj.send();
  return false;
};


// search one turno
const getTurno = () => {  
  let codigoPostal = '', estadoCivil = '', pais = '';

  const queryString = location.search;
  // Crear un objeto URLSearchParams
  const parametros = new URLSearchParams(queryString);

  // Obtener el valor de los parámetros deseados
  const identificador = parametros.get('identificador');
  const fecha = parametros.get('p-fecha');
  const hora = parametros.get('hora');
  const tipoDocumento = parametros.get('p-tipdoc')
  const numeroDocumento = parametros.get('p-nrodoc')
  // Obtiene usuario en session
  let session = JSON.parse(sessionStorage.getItem('token'))
  // sessionStorage vacio
  if(!session){
    window.location = `${ipServer}turnero/index.html`;
    return;
  };
  
  
  let  params=`?p-username=${session.username.replace(/ /g, '')}
             &p-password=${session.password}
             &p-id=${identificador}
             &p-hora=${hora}
             &p-tipdoc=${tipoDocumento}
             &p-nrodoc=${numeroDocumento}
             &p-fecha=${fecha.split('-').reverse().join('/')}
             &p-funcion=getOne
             &p-codigoSector=1
             &p-codigoEmpresa=1`;
  
  params = params.replace(/ /g, '');
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
      
  const myRequest = new Request(`${baseUrl}Administracion/TurnosServices.p${params}`, options);
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

        

    }
      )
      .catch(error => console.error(error));
};

// ------------------------------ BAJA DE ARTICULO DEL INVENTARIO -------------------------------------
const TurnoDelete = (identificador, contribuyente, fecha, codigoEmpresa, codigoSector, tipdoc, nrodoc) => { 
  let params = '';
  // diseño boton de alerta
  const titulo = '<h6 class="text-secondary font-weight-bold"><b>BAJA DE TURNO</b></h6>'
  const mensaje = `<p class="text-center">
                  <span class="text-secondary font-weight">Confirma la baja del turno a nombre de  
                  <span class="text-secondary font-weight-bold"> ${contribuyente}</span>? 
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
                &p-codigoEmpresa=${codigoEmpresa}
                &p-codigoSector=${codigoSector}
                &p-tipdoc=${tipdoc}
                &p-nrodoc=${nrodoc}
                &p-username=${session.username}
                &p-password=${session.password}
                &p-funcion=getDelete`;
                

      const options = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `${params}`
          };

          const myRequest = new Request(`${baseUrl}Administracion/TurnosServices.p`, options);
    
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

// ---------------------------------- CREATE ---------------------------------------------
if(document.getElementById('btn-create')) {  
  document.getElementById('btn-create').addEventListener('click', (e) => {    
  e.preventDefault();

  var horaIngresada = document.getElementById('hora').value;
  let infoError = '';
  let validate  = true;
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

  const identificador = document.getElementById('identificador').value
  const hora = document.getElementById('hora').value
  const tipoDocumento = document.getElementById('tipoDocumento').value
  const numeroDocumento = document.getElementById('documento').value
  
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
                &p-codigoEmpresa=1`; //carnet de conducir

                
  const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `${params}`
    };
    const myRequest = new Request(`${baseUrl}Administracion/TurnosServices.p`, options);
    
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

      window.location = `tramitesturnos.html?p-fecha=${fecha}&p-id=${identificador}&p-hora=${hora}&p-tipdoc=${tipoDocumento}&p-nrodoc=${numeroDocumento}`;

  }
    )
    .catch(error => console.error(error));


  });
};

// GENERA/ACTUALIZA DATOS DEL TURNO
if(document.getElementById('btn-update')) {  
  document.getElementById('btn-update').addEventListener('click', (e) => {    
  e.preventDefault();

  var horaIngresada = document.getElementById('hora').value;
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

  const identificador = document.getElementById('identificador').value
  const hora = document.getElementById('hora').value
  const tipoDocumento = document.getElementById('tipoDocumento').value
  const numeroDocumento = document.getElementById('documento').value
  
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
                &p-funcion=getUpdate
                &p-codigoSector=1
                &p-codigoEmpresa=1`; //carnet de conducir

  const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `${params}`
    };

    const myRequest = new Request(`${baseUrl}Administracion/TurnosServices.p`, options);
    
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

      window.location = `tramitesturnos.html?p-fecha=${fecha}&p-id=${identificador}&p-hora=${hora}&p-tipdoc=${tipoDocumento}&p-nrodoc=${numeroDocumento}`;

  }
    )
    .catch(error => console.error(error));


  });
};

if(document.getElementById('botonCalendario')) {
 document.getElementById('botonCalendario').addEventListener('click', function() {
   
   const fecha = document.getElementById('fechaInput').value.split('-').reverse().join('/');
   getTurnos(fecha);
 })
};

const getIndividuo = () => {  
  // Obtiene usuario en session
  let session = JSON.parse(sessionStorage.getItem('token'))
  const tipdoc = document.getElementById('tipoDocumento').value;
  const nrodoc = document.getElementById('documento').value;

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


