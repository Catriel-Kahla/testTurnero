/* -------------------------------------------------------------------------------- */

const getUsuarios = () => { 
    let txtHtml = '';
    let session = JSON.parse(sessionStorage.getItem('token'));
    if(!session){
      window.location = `../../turnero/index.html`;
      return;
    }
  
    let params =  `?p-username=${session.username}
                   &p-password=${session.password}
                   &p-funcion=getAll
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
    const myRequest = new Request(`${baseUrl}Administracion/UsuariosServices.p${params}`, options);
    fetch(myRequest)
      .then(response => { 
        if (!response.ok) {
          throw new Error('Problema con la respuesta del servidor');
        }
        return response.json()
      })
      .then(data => {   
        document.getElementById('loading').innerHTML = '';
        document.getElementById('table-result').innerHTML = ''; 
        if(data.error){
            return;
        }
        data.forEach(element => { 
          txtHtml += 
          ` <tr class="border p-3">
            <td class="text-secondary font-weight-bold text-left">${element.id}</td>
            <td class="text-secondary font-weight-bold text-left">${element.numeroDocumento}</td>  
            <td class="text-secondary font-weight-bold text-left">${element.mail}</td>
            <td class="font-weight-normal text-left">${element.nombre}</td>`

            if (element.estado === 'Activo') {
                txtHtml += `
                <td class="text-left">
                  <span class="bg-success  small text-white rounded p-1">${element.estado}</span>
                </td>
                <td class="text-center">
                  <button class="btn btn-danger" style="width: 6rem;" onclick="cambiaEstado('DESACTIVAR', ${element.id}, '${element.mail}')">Desactivar</button>
                </td>`;
            }
            else {
              txtHtml += `
              <td class="text-left">
                <span class="bg-warning  small text-white rounded p-1">${element.estado}</span>
              </td>
              <td class="text-center">
                <button class="btn btn-success" style="width: 6rem;" onclick="cambiaEstado('ACTIVAR', ${element.id}, '${element.mail}')">Activar</button>
              </td>`;
            }
            txtHtml += 
            `
            </tr>`;
        });
        document.getElementById('table-result').innerHTML = txtHtml; 
        
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
      return;
    });
  
    
  };
  
  
  const cambiaEstado = (Accion, identificador, mail) => {  
    let params = '';
    // diseño boton de alerta
    const titulo = `<h6 class="text-secondary font-weight-bold"><b>${Accion} CUENTA</b></h6>`
    const mensaje = `<p class="text-center">
                    <span class="text-secondary font-weight">Confirma ${Accion} la cuenta del Usuario:  
                    <span class="text-secondary font-weight-bold"> ${mail}</span>? 
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
                  &p-codigoEmpresa=1
                  &p-mail=${mail}
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
  
            const myRequest = new Request(`${baseUrl}Administracion/UsuariosServices.p`, options);
      
        fetch(myRequest)
            .then(response => { 
                if (!response.ok) {
                  throw new Error('Problema con la respuesta del servidor');
                }
                return response.json()
                })
            .then(data => {  
              getUsuarios();
            })
            .catch(error => console.error(error));
    },
    function() {
        alertify.error('Cancelado')
    }).set('labels', {ok:'Confirmar', cancel:'Cancelar'})
    return
  };


  if(document.getElementById('btn-search')) {  
    document.getElementById('btn-search').addEventListener('click', (e) => {    
    e.preventDefault();

    let txtHtml;
    const documento = document.getElementById('documento').value;
    // Obtiene usuario en session
    let session = JSON.parse(sessionStorage.getItem('token'))
    // sessionStorage vacio
    if(!session){
        window.location = `${ipServer}turnero/index.html`;
        return;
    };
  
    let params = `p-username=${session.username}
                  &p-password= ${session.password}
                  &p-nrodoc=${documento}
                  &p-funcion=getOne
                  &p-codigoEmpresa=1`; //carnet de conducir
  
    document.getElementById('table-result').innerHTML = '';            
    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `${params}`
      };
      const myRequest = new Request(`${baseUrl}Administracion/UsuariosServices.p`, options);
      
      fetch(myRequest)
      .then(response => {  
        if (!response.ok) {
          throw new Error('Problema con la respuesta del servidor');
        }
        return response.json();
        })
      .then(data => {   
        if(data.length === 0){
          getUsuarios()
          return
        }
        data.forEach(element => { 

          txtHtml === undefined ? txtHtml = `<tr class="border p-3">` : txtHtml += `<tr class="border p-3">`;
          
          txtHtml += 
          ` <td class="text-secondary font-weight-bold text-left">${element.id}</td>
            <td class="text-secondary font-weight-bold text-left">${element.numeroDocumento}</td>  
            <td class="text-secondary font-weight-bold text-left">${element.mail}</td>
            <td class="font-weight-normal text-left">${element.nombre}</td>`

            if (element.estado === 'Activo') {
                txtHtml += `
                <td class="text-left">
                  <span class="bg-success  small text-white rounded p-1">${element.estado}</span>
                </td>
                <td class="text-center">
                  <button class="btn btn-danger" style="width: 6rem;" onclick="cambiaEstado('DESACTIVAR', ${element.id}, '${element.mail}')">Desactivar</button>
                </td>`;
            }
            else {
              txtHtml += `
              <td class="text-left">
                <span class="bg-warning  small text-white rounded p-1">${element.estado}</span>
              </td>
              <td class="text-center">
                <button class="btn btn-success" style="width: 6rem;" onclick="cambiaEstado('ACTIVAR', ${element.id}, '${element.mail}')">Activar</button>
              </td>`;
            }
            txtHtml += 
            `
            </tr>`;
        });
        document.getElementById('table-result').innerHTML = txtHtml;
  
        
  
    }
      )
      .catch(error => console.error(error));
  
  
    });
  };
  