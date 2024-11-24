/* -------------------------------------------------------------------------------- */

const getTramitesTurno = () => { 
    let txtHtml = '', templateBoton = '';
    let session = JSON.parse(sessionStorage.getItem('token'));
    if(!session){
      window.location = `../../turnero/index.html`;
      return;
    }
  
    var searchParams = new URLSearchParams(location.search);
    const fecha = searchParams.get('p-fecha');
    const hora = searchParams.get('p-hora');
    const id = searchParams.get('p-id');
    const tipdoc = searchParams.get('p-tipdoc');
    const nrodoc = searchParams.get('p-nrodoc');
  
    let params =  `?p-username=${session.username}
                   &p-password=${session.password}
                   &p-fecha=${fecha}
                   &p-hora=${hora}
                   &p-id=${id}
                   &p-tipdoc=${tipdoc}
                   &p-nrodoc=${nrodoc}
                   &p-funcion=getAll
                   &p-codigoSector=1
                   &p-codigoEmpresa=1`; 
    params = params.replace(/ /g, '');
   
    
    templateLoading = `<div class="loading"><img src="/turnero/assets/images/loader.gif" alt="loading" /><br/>Un momento, por favor...</div>`
    document.getElementById('loading').innerHTML = templateLoading
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const myRequest = new Request(`${baseUrl}Administracion/TramitesTurnoServices.p${params}`, options);
    fetch(myRequest)
      .then(response => { 
        if (!response.ok) {
          throw new Error('Problema con la respuesta del servidor');
        }
        return response.json()
      })
      .then(data => {   console.log("datos: ", data)
        document.getElementById('loading').innerHTML = '';
        document.getElementById('table-result').innerHTML = ''; 
        if(data.error){
            return;
        }
        data.forEach(element => { 
          txtHtml += 
          ` <tr class="border p-3">
            <td class="text-secondary font-weight-bold text-left">${element.nombreTramite}</td>
            <td class="text-secondary font-weight-bold text-left">${element.nombreClase}</td>
            <td class="font-weight-normal text-left">${element.requisitos}</td>
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
                  <a class="dropdown-item text-center font-weight-bold text-mypage2" href="#" style="cursor: default;">${element.nombreTramite}</a>
                  <hr class="my-0 py-0">
                  <a 
                    class="dropdown-item font-weight-bold text-secondary" 
                    href="./TipoTramiteEdit.html?p-id=${element.codigoTramite}">Editar</a>
                  <hr class="my-0 py-0">
                  <a class="dropdown-item font-weight-bold text-danger" onclick="TramiteDelete(${element.codigoTramite}, 
                    '${element.nombreTramite}', '${element.fechaTurno}', '${element.horaTurno}', ${element.idTurno},  '${element.codigoClase}',
                    ${element.codigoEmpresa}, ${element.codigoSector})">Dar de Baja</a>
                </div>
              </div>
            </td>
            </tr>`;
        });
  
        if(data[0].error === ''){
          templateBoton = `
          <a href="CargaTurnos.html?p-fecha=${fecha}">
          <button class="btn btn-primary mt-2"  style="width: 10rem;" id="btn-create">Aceptar</button>
          </a>
          <button class="btn btn-danger mt-2" style="width: 6rem;" type="button" onclick="location.href='javascript:history.back()'" target="_blank">Cancelar</button>
          `
        }
        else{
          templateBoton = '';
        }
  
        document.getElementById('table-result').innerHTML = txtHtml; 
        document.getElementById('btn-aceptar').innerHTML = templateBoton;
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
      /*const infoError = `
      <div class="alert alert-danger" role="alert">
      <strong>ERROR! - </strong>Error: Respuesta del servidor no v\u00E1lida
      </div>
      `*/
      //document.getElementById('infoError').innerHTML = infoError;
        return;
    });
  
    getTramites(codigoTramite)
    getClases(codigoClase)
  };
  
  
  const TramiteDelete = (codigoTramite, nombreTramite, fecha, hora, identificador, codigoClase, codigoEmpresa, codigoSector) => {  
    console.log('in the function')
    let params = '';
    // diseño boton de alerta
    const titulo = '<h6 class="text-secondary font-weight-bold"><b>BAJA DE TRAMITE</b></h6>'
    const mensaje = `<p class="text-center">
                    <span class="text-secondary font-weight">Confirma la baja del tramite:  
                    <span class="text-secondary font-weight-bold"> ${nombreTramite}, Clase: ${codigoClase}</span>? 
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
                  &p-tramite=${codigoTramite}
                  &p-clase=${codigoClase}
                  &p-hora=${hora}
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
  
            const myRequest = new Request(`${baseUrl}Administracion/TramitesTurnoServices.p`, options);
      
        fetch(myRequest)
            .then(response => { 
                if (!response.ok) {
                  throw new Error('Problema con la respuesta del servidor');
                }
                return response.json()
                })
            .then(data => {  console.log("borrado: ",data)
            /*if(data.error !== ''){
              const infoError = `
              <div class="alert alert-danger" role="alert">
              <strong>ERROR! - </strong>${data.error}
              </div>
              `
              document.getElementById('infoError').innerHTML = infoError;
                return;
            }*/
                getTramitesTurno();
            })
            .catch(error => console.error(error));
    },
    function() {
        alertify.error('Cancelado')
    }).set('labels', {ok:'Confirmar Baja', cancel:'Cancelar'})
    return
  }
  
  // Agrega tramite
  if(document.getElementById('btnAgregar')) {  
    document.getElementById('btnAgregar').addEventListener('click', (e) => {    
    e.preventDefault();
  
    // Obtiene usuario en session
    let session = JSON.parse(sessionStorage.getItem('token'))
    // sessionStorage vacio
    if(!session){
        window.location = `${ipServer}turnero/index.html`;
        return;
    };
  
    const searchParams = new URLSearchParams(location.search);
    const fecha        = searchParams.get('p-fecha');
    const hora         = searchParams.get('p-hora');
    const id           = searchParams.get('p-id');
    const tipdoc       = searchParams.get('p-tipdoc');
    const nrodoc       = searchParams.get('p-nrodoc');
    const tramite      = document.getElementById('codigoTramite').value;
    const clase        = document.getElementById('codigoClase').value;
    
    let params = `p-id=${id}
                  &p-username=${session.username}
                  &p-password= ${session.password}
                  &p-fecha=${fecha}
                  &p-tipdoc=${tipdoc}
                  &p-nrodoc=${nrodoc}
                  &p-hora=${hora}
                  &p-tramite=${tramite}
                  &p-clase=${clase}
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
      const myRequest = new Request(`${baseUrl}Administracion/TramitesTurnoServices.p`, options);
      
      fetch(myRequest)
      .then(response => {  
        if (!response.ok) {
          throw new Error('Problema con la respuesta del servidor');
        }
        return response.json();
        })
      .then(data => {  console.log(data)     
        /*if(data.error !== ''){
          const infoError = `
          <div class="alert alert-danger" role="alert">
          <strong>ERROR! - </strong>${data.error}
          </div>
          `
          document.getElementById('infoError').innerHTML = infoError;
            return;
        }*/
  
        
        getTramitesTurno()
        //window.location = `tramitesturnos.html?p-fecha=${fecha}&p-id=${identificador}&p-hora=${hora}&p-tipdoc=${tipoDocumento}&p-nrodoc=${numeroDocumento}`;
  
    }
      )
      .catch(error => console.error(error));
  
  
    });
  };
  
  
  const getTramites = (codigoTramite) => {
    let txtHtml = '';
    let params = '';
    if(codigoTramite && parseInt(codigoTramite) !== 0){
        params = `?codigoTramite=${codigoTramite}`;  
    }
  
    let session = JSON.parse(sessionStorage.getItem('token'));
    if(!session){
      window.location = `../../turnero/index.html`;
      return;
    }
  
    params += `&p-username=${session.username}
               &p-password=${session.password}
               &p-codigoEmpresa=1
               &p-codigoSector=1
               &p-funcion=getAll`
  
    let obj = new XMLHttpRequest();
    obj.open('GET', `${baseUrl}Administracion/TramitesServices.p${params}`, true);
    obj.onreadystatechange = function () { 
        if (obj.readyState === 4 && obj.status === 200) {
           
            if(obj.responseText.length === 0){
                return false;
            } 
            const jsonObj = JSON.parse(obj.responseText);
            txtHtml += `<option value="0">-- Seleccione Tramite --</option>`;
            jsonObj.forEach(element => {
                txtHtml += `<option value="${element.codigoTramite}">${element.nombreTramite}</option>`;
            });
            document.getElementById('codigoTramite').innerHTML = txtHtml;
            return jsonObj;
        }
    };
    obj.send();
    return false;
  };
  
  const getClases = (codigoClase) => {
    let txtHtml = '';
    let params = '';
    if(codigoClase && parseInt(codigoClase) !== 0){
        params = `?codigoClase=${codigoClase}`;  
    }
  
    let obj = new XMLHttpRequest();
    obj.open('GET', `${baseUrl}Administracion/ClasesCarnetServices.p${params}`, true);
    obj.onreadystatechange = function () { 
        if (obj.readyState === 4 && obj.status === 200) {
           
            if(obj.responseText.length === 0){
                return false;
            } 
            const jsonObj = JSON.parse(obj.responseText);
            txtHtml += `<option value="0">-- Seleccione Clase --</option>`;
            jsonObj.forEach(element => {
                if(element.habilitado === 'yes'){
                  txtHtml += `
                    <option value="${element.identificador}">${element.clase}</option>`;
                }
            });
            document.getElementById('codigoClase').innerHTML = txtHtml;
            return jsonObj;
        }
    };
    obj.send();
    return false;
  };
  
  
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
  
  
  