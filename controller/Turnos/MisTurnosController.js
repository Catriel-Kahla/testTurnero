// busca turnos del dia
const getMisTurnos = () => { 
  let card = '', templateRequisitos;
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
                  &p-codigoEmpresa=1`; //carnet de conducir 

  
 
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
   
  const myRequest = new Request(`${baseUrl}Turnos/MisTurnosServices.p${params}`, options);
  
  fetch(myRequest)
    .then(response => { 
      if (!response.ok) {
        throw new Error('Problema con la respuesta del servidor');
      }
      return response.json()
    })
    .then(data => {   console.log(data)
      document.getElementById('loading').innerHTML = '';
      if(data.error !== undefined){
        const infoError = `
        <div class="container mt-5">
        <div class="text-center">
            <h1 class="display-4 text-secondary">${data.error}</h1>
        </div>
        </div>
        `
        document.getElementById('infoError').innerHTML = infoError;
          return;
      }


      data.forEach(data => {
        
            card += `
            <div class="col-md-2">
            <div class="card mb-3">
            <div class="card-body">
            <h5 class="card-title">${data.nombreTramite}</h5>
            <p class="card-text">${data.fechaTurno} - ${data.horaTurno} Hs.</p>
            
            </div>`;

            if(data.estado === 'pendiente' && data.tramite === '0'){
                card += `
                <a href="tramitesturnos.html?p-fecha=${data.fechaTurno}&p-id=${data.id}&p-hora=${data.horaTurno}&p-tipdoc=${data.tipoDocumento}&p-nrodoc=${data.numeroDocumento}">
                <button class="btn btn-link text-left"><strong class="text-success">CONTINUAR CON EL TRAMITE</strong></button>
                </a>
                `  
            }

            card += `
            <p class="text-right mb-0">
               <a href="#" onclick="TurnoDelete(${data.id}, '${data.fechaTurno}', ${data.tramite}, ${data.codigoSector}, '${data.nombreTramite}')">
               <button class="btn btn-link text-left">
                <strong class="text-danger">CANCELAR TURNO</strong>
                </button>
               </a>
               </p>
            </div>
            </div>`;
               
        });

        // muestra informacion sobre documentacion a presentar 
        templateRequisitos = 
            ` 
            <h6 class="ml-2 mb-4 mt-3"><b>Documentaci\u00F3n que debes traer el d\u00EDa del turno:</b></h6>
            <h6 class="ml-5">* Documento Nacional de Identidad y Fotocopia</h6>
            <h6 class="ml-5">* Carnet de Conducir y Fotocopia<span class="text-muted"> (solo para <b>RENOVACION</b>)</span></h6>
            <h6 class="ml-5">* Imprimir informe del Ce.N.A.T. en la siguiente p\u00E1gina: 
                <a href="https://santafe.gov.ar/cenat" target="_blank">santafe.gov.ar/cenat</a>
                <span class="text-muted"> (centro emisor: <b>PEREZ</b>)</span></h6>
            <h6 class="ml-5">* Grupo Sangu\u00EDneo<span class="text-muted"> (solo Carnet <b>NUEVO</b> - saberlo)</span></h6> 
            <h6 class="ml-5">* Antecedentes Penales<span class="text-muted"> (solo Clase D1)</span></h6> 
            <h6 class="ml-5">* Libre Multa Municipal</h6> 
            <h6 class="ml-5">* Constancia del Curso<span class="text-muted"> (solo Carnet <b>NUEVO</b> y <b>RENOVACION</b> vencidas m\u00E1s de 1 a\u00F1o)</span></h6> 
            `;
            //
        document.getElementById('misturnos').innerHTML = card;
        document.getElementById('requisitos').innerHTML = templateRequisitos;

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


const TurnoDelete = (identificador, fecha, tipoCharla, codigoSector, tramite) => {  
    let params = '';
    // diseño boton de alerta
    const titulo = '<h6 class="text-secondary font-weight-bold"><b>BAJA DE TURNO</b></h6>'
    const mensaje = `<p class="text-center">
                    <span class="text-secondary font-weight">Confirma la baja del turno del dia  
                    <span class="text-secondary font-weight-bold"> ${fecha} - <b> ${tramite}</b></span>? 
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
                  &p-codigoSector=${codigoSector}
                  &p-tipoCharla=${tipoCharla}
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
            window.location = `misturnos.html`;
            })
            .catch(error => console.error(error));
    },
    function() {
        alertify.error('Cancelado')
    }).set('labels', {ok:'Confirmar Baja', cancel:'Cancelar'})
    return
  }


