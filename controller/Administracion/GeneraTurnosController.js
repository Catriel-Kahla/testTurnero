const getTurnos = () => {  
  let templateLoading = '', txtHtml = '', fondoRenglon = '';
  const session = JSON.parse(sessionStorage.getItem('token'))
  if(!session){
    window.location = `../../turnero/index.html`;
    return;
  }
  let params = `?p-username=${session.username}
                &p-password=${session.password}
                &p-funcion=getAll 
                &p-codigoEmpresa=1`; 
  // muestra spinner cargando
  templateLoading = `<div class="loading"><img src="/turnero/assets/images/loader.gif" alt="loading" /><br/>Un momento, por favor...</div>`
  document.getElementById('loading').innerHTML = templateLoading
  
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
    
  const myRequest = new Request(`${baseUrl}Administracion/AdministracionTurnosServices.p${params}`, options);
  fetch(myRequest)
  .then(response => { 
    if (!response.ok) {
      throw new Error('Problema con la respuesta del servidor');
    }
    return response.json()
  })
  .then(data => { 
    document.getElementById('loading').innerHTML = '';
    if(data[0].error !== ''){
      const infoError = `
      <div class="alert alert-danger" role="alert">
      <strong>ERROR! - </strong>${data[0].mensaje}
      </div>
      `
      document.getElementById('informe').innerHTML = infoError;
      return;
    }

    data.forEach(element => {
      if(element.codigoSector == 2) fondoRenglon = 'bg-light';
      txtHtml += 
      ` <tr class="border p-3 ${fondoRenglon}">
        <td class="text-secondary font-weight-bold text-center">${element.id}</td>
        <td class="font-weight-normal text-left">${element.nombreTurno}</td>
        <td class="font-weight-normal text-left">${element.nombreTramite}</td>
        <td class="font-weight-normal text-left">${element.horaDesde}</td>
        <td class="font-weight-normal text-left">${element.horaHasta}</td>
        <td class="font-weight-normal text-right">${element.cantidadTurnos}</td>
        <td class="font-weight-normal text-center">${element.diaSemana}</td>
        <td class="text-center">
        <div class="dropdownleft">
        <button 
            class="btn btn-primary-outline text-mypage2" 
            type="button" 
            data-toggle="dropdown" 
            aria-haspopup="true" 
            aria-expanded="false"
        >
        <i class="fas fa-bars"></i>
        </button>
        <div class="dropdown-menu bg-primarysoft" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item text-center font-weight-bold text-mypage2" href="#">${element.nombreTurno}</a>
        
        <hr class="my-0 py-0">
        <a class="dropdown-item font-weight-bold text-secondary" href="./AdminTurnoEdit.html?p-id=${element.id}&p-codigoSector=${element.codigoSector}&p-tramite=${element.tramite}">Editar</a>
        <hr class="my-0 py-0">
        <a class="dropdown-item font-weight-bold text-danger" onclick="getDelete(${element.id}, '${element.nombreTurno}', ${element.codigoSector}, ${element.tramite}, '${element.nombreTramite}')">Dar de Baja</a>
        </div>
        </div>
        </td>
        </tr>`;
    });
    document.getElementById('table-result').innerHTML = txtHtml 
  })
  .catch(error => {
    // Verificar si la respuesta no fue un JSON válido
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      console.error('Error: Respuesta del servidor no válida');
    } else {
      // Manejar otros tipos de errores
      console.error('Error:', error.message);
    }
    const infoError = `
    <div class="alert alert-danger" role="alert">
    <strong>ERROR! - </strong>Error: Respuesta del servidor no v\u00E1lida
    </div>
    `
    document.getElementById('informe').innerHTML = infoError;
      return;
  });
};

/* ------------------------- Busca un registro ------------------------- */  
const getTurno = () => { 
  let codigoSector = '';
  const session = JSON.parse(sessionStorage.getItem('token'))
  if(!session){
      window.location = `${ipServer}turnero/index.html`;
      return;
  };
  let params=location.search;
  if(params){
    params =  `${params}
              &p-username=${session.username}
              &p-password=${session.password}
              &p-funcion=getOne
              &p-codigoEmpresa=1`;
  }
  else{
    params = `?p-username=${session.username}
             &p-password=${session.password}
             &p-funcion=getOne
             &p-codigoEmpresa=1`;
  }
  params = params.replace(/ /g, '');
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  const myRequest = new Request(`${baseUrl}Administracion/AdministracionTurnosServices.p${params}`, options);
  fetch(myRequest)
  .then(response => {  
    if (!response.ok) {
    throw new Error('Problema con la respuesta del servidor');
    }
    return response.json()
  })
  .then(data => {  
    document.getElementById('identificador').value = data[0].id
    document.getElementById('nombreTurno').value = data[0].nombreTurno
    document.getElementById('horaDesde').value = data[0].horaDesde
    document.getElementById('horaHasta').value = data[0].horaHasta
    document.getElementById('cantidadTurnos').value = data[0].cantidadTurnos
    if(data[0].tramite == '1') document.getElementById('general').checked = true; 
    if(data[0].tramite == '2') document.getElementById('moto').checked = true;
    if(data[0].tramite == '3') document.getElementById('profesional').checked = true;
    if(data[0].codigoSector) codigoSector = data[0].codigoSector; 
    getDias(data[0].dia)
    getSectores(codigoSector)
  })
  .catch(error => {
    // Verificar si la respuesta no fue un JSON válido
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      console.error('Error: Respuesta del servidor no válida');
    } else {
      // Manejar otros tipos de errores
      console.error('Error:', error.message);
    }
    const infoError = `
    <div class="alert alert-danger" role="alert">
    <strong>ERROR! - </strong>Error: Respuesta del servidor no v\u00E1lida
    </div>
    `
    
      return;
  });
};

/* --------------------- borrado de registro --------------------- */
const getDelete = (id, nombreTurno, codigoSector, tramite, nombreTramite) => {  
  const titulo = '<h6 class="text-secondary font-weight-bold"><b>BAJA DE TURNO</b></h6>'
  const mensaje = `<p class="text-center">
                  <span class="text-secondary font-weight">Confirma la baja de 
                  <span class="text-secondary font-weight-bold"> ${nombreTurno} - ${nombreTramite}</span>? 
                  </span>
                  </p>`;
  alertify.defaults.transition = "slide";
  alertify.defaults.theme.ok = "btn btn-primary"
  alertify.defaults.theme.cancel = "btn btn-danger"
  alertify.defaults.theme.input = "form-control"

  let confirm = alertify.confirm(titulo,mensaje,
  function() { 
      const session = JSON.parse(sessionStorage.getItem('token'))
      if(!session){
        window.location = `${ipServer}turnero/index.html`;
        return;
      };
      let params = `p-id=${id}
                    &p-username=${session.username}
                    &p-password=${session.password}
                    &p-nombreTramite=${nombreTurno}
                    &p-codigoSector=${codigoSector}
                    &p-tramite=${tramite}
                    &p-codigoEmpresa=1
                    &p-funcion=getDelete`;

      const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `${params}`
      };
      const myRequest = new Request(`${baseUrl}Administracion/AdministracionTurnosServices.p`, options);
      fetch(myRequest)
      .then(response => { 
        if (!response.ok) {
          throw new Error('Problema con la respuesta del servidor');
        }
        return response.json()
      })
      .then(data => { 
        if(data[0].error !== ''){ 
          const infoError = `
          <div class="alert alert-danger" role="alert">
          <strong>ERROR! - </strong>${data.error}
          </div>`;
          document.getElementById('informe').innerHTML = infoError;
          return;
        }
        getTurnos();
      })
      .catch(error => {
        // Verificar si la respuesta no fue un JSON válido
        if (error instanceof SyntaxError && error.message.includes('JSON')) {
          console.error('Error: Respuesta del servidor no válida');
        } else {
          // Manejar otros tipos de errores
          console.error('Error:', error.message);
        }
        const infoError = `
        <div class="alert alert-danger" role="alert">
        <strong>ERROR! - </strong>Error: Respuesta del servidor no v\u00E1lida
        </div>
        `
        document.getElementById('infoError').innerHTML = infoError;
          return;
      });
    },
    function() {
      alertify.error('Cancelado')
    }).set('labels', {ok:'Confirmar Baja', cancel:'Cancelar'})
    return
}

/* -------------------- actualiza registro ---------------- */
if(document.getElementById('btn-update')) {  
  document.getElementById('btn-update').addEventListener('click', (e) => {   
  e.preventDefault();
  let tramite;

  document.getElementById('informe').innerHTML = '';
  let horaDesde = document.getElementById('horaDesde').value;
  let horaHasta = document.getElementById('horaHasta').value;
  if (!validarHora(horaDesde)) {
    const infoError = `
        <div class="alert alert-danger" role="alert">
        <strong>ERROR! - </strong>La hora ingresada es inv\u00E1lida - Formato v\u00E1lido "HH:MM"
        </div>
        `
        document.getElementById('informe').innerHTML = infoError;
    return;
  }

  if (!validarHora(horaHasta)) {
    const infoError = `
        <div class="alert alert-danger" role="alert">
        <strong>ERROR! - </strong>La hora ingresada es inv\u00E1lida - Formato v\u00E1lido "HH:MM"
        </div>
        `
        document.getElementById('informe').innerHTML = infoError;
    return;
  }

  // Obtiene usuario en session
  let session = JSON.parse(sessionStorage.getItem('token'))
  // sessionStorage vacio
  if(!session){
      window.location = `${ipServer}turnero/index.html`;
      return;
  };

  if(document.getElementById('general').checked) tramite = '1';
  else if(document.getElementById('moto').checked) tramite = '2';
  else if(document.getElementById('profesional').checked) tramite = '3';
  else tramite = '0';

  let params = `p-id=${document.getElementById('identificador').value}
                &p-dia=${document.getElementById('dia').value}
                &p-nombreTurno=${document.getElementById('nombreTurno').value}
                &p-horaDesde=${document.getElementById('horaDesde').value}
                &p-horaHasta=${document.getElementById('horaHasta').value}
                &p-tramite=${tramite}
                &p-cantidadTurnos=${document.getElementById('cantidadTurnos').value}
                &p-username=${session.username}
                &p-password=${session.password}
                &p-codigoSector=${document.getElementById('codigoSector').value}
                &p-codigoEmpresa=1
                &p-funcion=getUpdate`;

  const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `${params}`
    };
    
    const myRequest = new Request(`${baseUrl}Administracion/AdministracionTurnosServices.p`, options);
    
    fetch(myRequest)
    .then(response => {  
      if (!response.ok) {
        throw new Error('Problema con la respuesta del servidor');
      }
      return response.json()
      })
    .then(data => { 
      if(data[0].error !== ''){
        const infoError = `
        <div class="alert alert-danger" role="alert">
        <strong>ERROR! - </strong>${data.error}
        </div>
        `
        document.getElementById('informe').innerHTML = infoError;
          return;
      }

      window.location = `GeneraTurnos.html`;
  }
    )
    .catch(error => console.error(error));


  });
};

if(document.getElementById('btn-create')) {  
  document.getElementById('btn-create').addEventListener('click', (e) => {   
  e.preventDefault();
    let tramite;
  let horaDesde = document.getElementById('horaDesde').value;
  let horaHasta = document.getElementById('horaHasta').value;
  if (!validarHora(horaDesde)) {
    const infoError = `
        <div class="alert alert-danger" role="alert">
        <strong>ERROR! - </strong>La hora ingresada es inv\u00E1lida - Formato v\u00E1lido "HH:MM"
        </div>
        `
        document.getElementById('informe').innerHTML = infoError;
    return;
  }

  if (!validarHora(horaHasta)) {
    const infoError = `
        <div class="alert alert-danger" role="alert">
        <strong>ERROR! - </strong>La hora ingresada es inv\u00E1lida - Formato v\u00E1lido "HH:MM"
        </div>
        `
        document.getElementById('informe').innerHTML = infoError;
    return;
  }

  // Obtiene usuario en session
  let session = JSON.parse(sessionStorage.getItem('token'))
  // sessionStorage vacio
  if(!session){
      window.location = `${ipServer}turnero/index.html`;
      return;
  };

  if(document.getElementById('general').checked) tramite = '1';
  else if(document.getElementById('moto').checked) tramite = '2';
  else if(document.getElementById('profesional').checked) tramite = '3';
  else tramite = '0';
  
  let params = `p-id=${document.getElementById('identificador').value}
                &p-dia=${document.getElementById('dia').value}
                &p-nombreTurno=${document.getElementById('nombreTurno').value}
                &p-horaDesde=${document.getElementById('horaDesde').value}
                &p-horaHasta=${document.getElementById('horaHasta').value}
                &p-cantidadTurnos=${document.getElementById('cantidadTurnos').value}
                &p-tramite=${tramite}
                &p-username=${session.username}
                &p-password=${session.password}
                &p-codigoSector=${document.getElementById('codigoSector').value}
                &p-codigoEmpresa=1
                &p-funcion=getCreate`;

  const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `${params}`
    };
    
    const myRequest = new Request(`${baseUrl}Administracion/AdministracionTurnosServices.p`, options);
    
    fetch(myRequest)
    .then(response => {  
      if (!response.ok) {
        throw new Error('Problema con la respuesta del servidor');
      }
      return response.json()
      })
    .then(data => { 
      if(data[0].error !== ''){
        const infoError = `
        <div class="alert alert-danger" role="alert">
        <strong>ERROR! - </strong>${data[0].error}
        </div>
        `
        document.getElementById('informe').innerHTML = infoError;
          return;
      }

      window.location = `GeneraTurnos.html`;
  }
    )
    .catch(error => console.error(error));


  });
};


const getDias = (numeroDia) => { 

if(numeroDia === undefined || numeroDia == 0){ 
  var fechaActual = new Date();
  var diaSemana = fechaActual.getDay();
  numeroDia = diaSemana + 1
}



    const diasDeLaSemana = [
        { "numero": 2, "nombre": "lunes", "abreviacion": "Lun" },
        { "numero": 3, "nombre": "martes", "abreviacion": "Mar" },
        { "numero": 4, "nombre": "mi\u00E9rcoles", "abreviacion": "Mi\u00E9" },
        { "numero": 5, "nombre": "jueves", "abreviacion": "Jue" },
        { "numero": 6, "nombre": "viernes", "abreviacion": "Vie" },
        { "numero": 7, "nombre": "s\u00E1bado", "abreviacion": "S\u00E1b" },
        { "numero": 1, "nombre": "domingo", "abreviacion": "Dom" }
      ];

      const selectDias = document.getElementById("dia");

      const numeroDiaParametro = parseInt(numeroDia); // supongamos que recibimos el número 5 como parámetro

      // Buscamos el objeto del día de la semana correspondiente al número recibido por parámetro
      const diaParametro = diasDeLaSemana.find(dia => dia.numero === numeroDiaParametro);
      
      // Creamos una opción con el valor recibido por parámetro y la agregamos al inicio del elemento select
      const opcionParametro = document.createElement("option");
      opcionParametro.value = diaParametro.numero;
      opcionParametro.text = `${diaParametro.nombre} (${diaParametro.abreviacion})`;
      selectDias.appendChild(opcionParametro);

      // Recorremos los objetos de los días de la semana y creamos una opción para cada uno, excepto el que ya agregamos
      Object.values(diasDeLaSemana).forEach(dia => {
        if (dia.numero !== numeroDiaParametro) { // omitimos el día recibido por parámetro, ya lo agregamos al inicio
          const opcion = document.createElement("option");
          opcion.value = dia.numero;
          opcion.text = `${dia.nombre} (${dia.abreviacion})`;
          selectDias.appendChild(opcion);
        }
      });
};

const getSectores = (codigoSector) => { 
  let params = '';
  if(codigoSector && parseInt(codigoSector) !== 0){
      params = `?p-codigoSector=${codigoSector}`;  
  }
  
  
  let txtHtml = '';
  let obj = new XMLHttpRequest();
  obj.open('GET', `${baseUrl}Sectores/SectoresServices.p${params}`, true);
  obj.onreadystatechange = function () {
      if (obj.readyState === 4 && obj.status === 200) {
         
          if(obj.responseText.length === 0){
              return false;
          }  
          const jsonObj = JSON.parse(obj.responseText);
          jsonObj.forEach(element => {
              txtHtml += `<option value="${element.codigoSector}">${element.nombreSector}</option>`;
          });
          document.getElementById('codigoSector').innerHTML = txtHtml;
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