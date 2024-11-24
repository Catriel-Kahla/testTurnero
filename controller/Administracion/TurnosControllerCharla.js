// Obtén referencias a los elementos de entrada y botón
const fechaInput = document.getElementById("fechaInput");
const botonCalendario = document.getElementById("botonCalendario");

// Agrega un controlador de eventos para el cambio en el campo de fecha
if(fechaInput){
 fechaInput.addEventListener("change", function () {
   // Simula un clic en el botón cuando cambia la fecha
   botonCalendario.click();
 });
}

// busca turnos del dia
const getTurnos = (fecha) => { 
  let templateBoton = '', templateLoading = '', txtHtml = '';
  
  var searchParams = new URLSearchParams(location.search);
  const tipoCharla = searchParams.get('p-tipoCharla');

  if(fecha===undefined){
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
                  &p-tipoCharla=${tipoCharla}
                  &p-fecha=${fecha.split('-').reverse().join('/')}
                  &p-codigoSector=2`; //carnet de conducir 

  
  params = params.replace(/ /g, '');
  
  // muestra spinner cargando
  templateLoading = `<div class="loading"><img src="/turnero/assets/images/loader.gif" alt="loading" /><br/>Un momento, por favor...</div>`
  document.getElementById('loading').innerHTML = templateLoading
  document.getElementById('infoError').innerHTML = '';
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
    .then(data => { 
      document.getElementById('loading').innerHTML = '';
      
      // leo posibles errores
      if(data.error){
        let infoError = `
        <div class="container mb-2">
        <div class="text-center">
            <h3 class="display-6 text-secondary">${data.error}</h3>
        </div>
        </div>`
        document.getElementById('infoError').innerHTML = infoError;
      }
      // muestro el titulo de la charla
      if(!data.error){
        let nombreCharla = "";
        if(tipoCharla==="1") nombreCharla = "Charla General";
        if(tipoCharla==="2") nombreCharla = "Charla Motos";
        if(tipoCharla==="3") nombreCharla = "Charla Profesional";
        let infoError = `
        <div class="container mb-2">
        <div class="text-center">
            <h3 class="display-6 text-secondary">${nombreCharla}</h3>
        </div>
        </div>`
        document.getElementById('infoError').innerHTML = infoError;
      }

      //

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

      const queryString = location.search;
      // Crear un objeto URLSearchParams
      const parametros = new URLSearchParams(queryString);
      const fecha      = parametros.get('p-fecha');
      
      const fechaParam = document.getElementById("fechaInput").value;
      
      templateBoton = 
      `<div class="col-md-12  text-right">
        <a href="TurnoCreateCharla.html?p-fecha=${fechaParam}&p-funcion=getOne&p-id=0&p-codigoEmpresa=1&p-codigoSector=2&p-tipdoc=0&p-nrodoc=0&p-tipoCharla=${tipoCharla}">
        <button class="btn btn-primary mt-0"  style="width: 10rem;" type="button">Sobreturno</button>
        </a>
      </div>`;

      let contador = 1; // Inicializa el contador
      data.sort((a, b) => {
        const nombreA = a.nombres.toUpperCase();
        const nombreB = b.nombres.toUpperCase();
      
        if (nombreA > nombreB) {
          return -1;
        }
        if (nombreA < nombreB) {
          return 1;
        }
        return 0; // nombres iguales
      });
      
      data.forEach(element => { 
        txtHtml += 
        ` <tr class="border p-3">
          <td class="font-weight-normal text-center">${contador}</td>
          <td class="font-weight-normal text-left">${element.nombres}</td>
          <td class="font-weight-normal text-left">${element.celular}</td>
          <td class="font-weight-normal text-left">${element.mail}</td>
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
                txtHtml += `<a class="dropdown-item font-weight-bold text-secondary" href="./TurnoCreateCharla.html${params}&identificador=${element.idTurno}&hora=${element.horaTurno}&p-tipdoc=${element.tipoDocumento}&p-nrodoc=${element.numeroDocumento}">Tomar Turno</a>`
              }
              else{
                txtHtml += `<a class="dropdown-item font-weight-bold text-secondary" href="./TurnoEditCharla.html${params}&identificador=${element.idTurno}&hora=${element.horaTurno}&p-tipdoc=${element.tipoDocumento}&p-nrodoc=${element.numeroDocumento}">Editar</a>
                <hr class="my-0 py-0">
                <a class="dropdown-item font-weight-bold text-danger" onclick="TurnoDelete(${element.idTurno}, 
                  '${element.nombres}', '${element.fechaTurno}', ${element.codigoEmpresa}, ${element.codigoSector}, ${element.tipoDocumento}, ${element.numeroDocumento}, ${tipoCharla})">Dar de Baja</a>`
              }
              txtHtml += `  
                
              </div>
            </div>
          </td>
          </tr>`;
          contador++; // Incrementa el contador
      });
      document.getElementById('table-result').innerHTML = txtHtml 
      document.getElementById('botonCreate').innerHTML = templateBoton; 
           
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


// search one turno
const getTurno = () => {  
  let codigoPostal = '', estadoCivil = '', pais = '';

  const queryString = location.search;
  // Crear un objeto URLSearchParams
  const parametros = new URLSearchParams(queryString);
  
  // Obtener el valor de los parámetros deseados
  const identificador   = parametros.get('identificador');
  const fecha           = parametros.get('p-fecha');
  const tipoDocumento   = parametros.get('p-tipdoc');
  const numeroDocumento = parametros.get('p-nrodoc');
  const tipoCharla      = parametros.get('p-tipoCharla');
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
             &p-tipdoc=${tipoDocumento}
             &p-nrodoc=${numeroDocumento}
             &p-tipoCharla=${tipoCharla}
             &p-fecha=${fecha.split('-').reverse().join('/')}
             &p-funcion=getOne
             &p-codigoSector=2
             &p-codigoEmpresa=1`;
  
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
      .then(data => { 
         
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
const TurnoDelete = (identificador, contribuyente, fecha, codigoEmpresa, codigoSector, tipoDocumento, numeroDocumento, tipoCharla) => {  
  let params = '';
  // diseño boton de alerta
  const titulo = '<h6 class="text-secondary font-weight-bold"><b>BAJA DE TURNO</b></h6>'
  const mensaje = `<p class="text-center">
                  <span class="text-secondary font-weight">¿Confirma la baja del turno a nombre de  
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
                &p-tipdoc=${tipoDocumento}
                &p-nrodoc=${numeroDocumento}
                &p-tipoCharla=${tipoCharla}
                &p-username=${session.username}
                &p-password=${session.password}
                &p-funcion=getDelete`;
               

      params = params.replace(/ /g, '');

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
  if (!validarHora(horaIngresada)) {
    const infoError = `
        <div class="alert alert-danger" role="alert">
        <strong>ERROR! - </strong>La hora ingresada es inv\u00E1lida - Formato v\u00E1lido "HH:MM"
        </div>
        `
        document.getElementById('infoError').innerHTML = infoError;
    return;
  }

  const queryString = location.search;
  // Crear un objeto URLSearchParams
  const parametros = new URLSearchParams(queryString);

  // Obtener el valor de los parámetros deseados
  const tipoCharla   = parametros.get('p-tipoCharla');

  const fecha = document.getElementById('fecha').value.split('-').reverse().join('/');
  // Obtiene usuario en session
  let session = JSON.parse(sessionStorage.getItem('token'))
  // sessionStorage vacio
  if(!session){
      window.location = `${ipServer}turnero/index.html`;
      return;
  };

  const identificador = document.getElementById('identificador').value
  
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
                &p-tipoCharla=${tipoCharla}
                &p-funcion=getCreate
                &p-codigoSector=2
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

      window.location = `cargaturnoscharla.html?p-fecha=${fecha}&p-tipoCharla=${tipoCharla}`;

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
                &p-codigoSector=2
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

      window.location = `cargaturnoscharla.html?p-fecha=${fecha}&p-tipoCharla=${tipoCharla}`;

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


// Función para sumar un día a la fecha
function sumarDia() { 
  var fecha = new Date(document.getElementById('fechaInput').value);
  fecha.setDate(fecha.getDate() + 1);
  document.getElementById('fechaInput').value = fecha.toISOString().slice(0, 10);
  getTurnos(document.getElementById('fechaInput').value.split('-').reverse().join('/'));
}

// Función para restar un día a la fecha
function restarDia() {
  var fecha = new Date(document.getElementById('fechaInput').value);
  fecha.setDate(fecha.getDate() - 1);
  document.getElementById('fechaInput').value = fecha.toISOString().slice(0, 10);
  getTurnos(document.getElementById('fechaInput').value.split('-').reverse().join('/'));
}
