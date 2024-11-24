const getCharlaProfesional = () => { 
  let txtHtml = '';
  let session = JSON.parse(sessionStorage.getItem('token'));
  if(!session){
    window.location = `../../turnero/index.html`;
    return;
  }

  let params =  `?p-username=${session.username}
                 &p-password=${session.password}
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
  const myRequest = new Request(`${baseUrl}Administracion/CharlaProfesionalServices.p${params}`, options);
  fetch(myRequest)
    .then(response => { 
      if (!response.ok) {
        throw new Error('Problema con la respuesta del servidor');
      }
      return response.json()
    })
    .then(data => {  console.log(data)
      document.getElementById('loading').innerHTML = '';
      data.forEach(element => { 
        txtHtml += 
        ` <tr class="border p-3">
          <td class="text-secondary font-weight-bold text-left">${element.id}</td>
          <td class="font-weight-normal text-left">${element.fecha}</td>
          <td class="font-weight-normal text-left">${element.descripcion}</td>
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
                <a class="dropdown-item text-center font-weight-bold text-mypage2" href="#" style="cursor: default;">${element.fecha}</a>
                <hr class="my-0 py-0">
                <a 
                  class="dropdown-item font-weight-bold text-secondary" 
                  href="./CharlaEdit.html?p-id=${element.id}">Editar</a>
                <hr class="my-0 py-0">
                <a class="dropdown-item font-weight-bold text-danger" onclick="TramiteDelete(${element.id}, 
                  '${element.fecha}')">Dar de Baja</a>
              </div>
            </div>
          </td>
          </tr>`;
      });
      document.getElementById('table-result').innerHTML = txtHtml 
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
    const infoError = `
    <div class="alert alert-danger" role="alert">
    <strong>ERROR! - </strong>Error: Respuesta del servidor no v\u00E1lida
    </div>
    `
    document.getElementById('infoError').innerHTML = infoError;
      return;
  });
};


const getCharla = () => {  
  let session = JSON.parse(sessionStorage.getItem('token'))
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
              &p-codigoSector=1
              &p-codigoEmpresa=1`;
  }
  else{
    params = `?p-username=${session.username}
             &p-password=${session.password}
             &p-funcion=getOne
             &p-codigoSector=1
             &p-codigoEmpresa=1`;
  }
  params = params.replace(/ /g, '');
  
  console.log(params)
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
      
  const myRequest = new Request(`${baseUrl}Administracion/CharlaProfesionalServices.p${params}`, options);
  fetch(myRequest)
    .then(response => {  
      if (!response.ok) {
        throw new Error('Problema con la respuesta del servidor');
      }
      return response.json()
    })
      .then(data => { console.log("DATOS: ",data)
        
        document.getElementById('identificador').value = data[0].id
        document.getElementById('fecha').value = data[0].fecha.split('/').reverse().join('-')
        document.getElementById('descripcion').value = data[0].descripcion
        document.getElementById('tipo').value = data[0].tipo
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
        `
        document.getElementById('infoError').innerHTML = infoError;
          return;*/
      });
};

const TramiteDelete = (id, fecha) => {  
  const titulo = '<h6 class="text-secondary font-weight-bold"><b>BAJA DE DIA FERIADO</b></h6>'
  const mensaje = `<p class="text-center">
                  <span class="text-secondary font-weight">Confirma la baja del feriado del dia  
                  <span class="text-secondary font-weight-bold"> ${fecha}</span>? 
                  </span>
                  </p>
                  ` 
  alertify.defaults.transition = "slide";
  alertify.defaults.theme.ok = "btn btn-primary"
  alertify.defaults.theme.cancel = "btn btn-danger"
  alertify.defaults.theme.input = "form-control"

  var confirm = alertify.confirm(titulo,mensaje,
  function() { 
      let session = JSON.parse(sessionStorage.getItem('token'))
      if(!session){
          window.location = `${ipServer}turnero/index.html`;
          return;
      };

      const params = `p-id=${id}
                    &p-username=${session.username}
                    &p-password=${session.password}
                    &p-codigoSector=1
                    &p-codigoEmpresa=1
                    &p-funcion=getDelete`;

      const options = {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `${params}`
          };

      const myRequest = new Request(`${baseUrl}Administracion/CharlaProfesionalServices.p`, options);
      fetch(myRequest)
          .then(response => { 
              if (!response.ok) {
                throw new Error('Problema con la respuesta del servidor');
              }
              return response.json()
              })
          .then(data => { console.log(data)
            

          if(data[0].error !== ''){ 
            const infoError = `
            <div class="alert alert-danger" role="alert">
            <strong>ERROR! - </strong>${data[0].error}
            </div>
            `
            document.getElementById('infoError').innerHTML = infoError;
              return;
          }
              getFeriados();
          })
          .catch(error => {
            // Verificar si la respuesta no fue un JSON válido
            if (error instanceof SyntaxError && error.message.includes('JSON')) {
              console.error('Error: Respuesta del servidor no v\u00E1lida');
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

if(document.getElementById('btn-create')) {  
  document.getElementById('btn-create').addEventListener('click', (e) => {    
  e.preventDefault();

  let session = JSON.parse(sessionStorage.getItem('token'))
  if(!session){
      window.location = `${ipServer}turnero/index.html`;
      return;
  };

  const identificador = document.getElementById('identificador').value.replace(/ /g, '');
  const username = session.username.replace(/ /g, '');
  const password = session.password.replace(/ /g, '');
  
   

  let params = `p-id=${identificador}
                &p-username=${username}
                &p-password=${password}
                &p-fecha=${document.getElementById('fecha').value.split('-').reverse().join('/')}
                &p-descripcion=${document.getElementById('descripcion').value}
                &p-codigoSector=1
                &p-codigoEmpresa=1
                &p-funcion=getCreate`; 

  const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `${params}`
    };
    const myRequest = new Request(`${baseUrl}Administracion/CharlaProfesionalServices.p`, options);
    
    fetch(myRequest)
    .then(response => {  
      if (!response.ok) {
        throw new Error('Problema con la respuesta del servidor');
      }
      return response.json();
      })
    .then(data => { console.log("DATOS: ", data)
      if(data[0].error !== ''){
        const infoError = `
        <div class="alert alert-danger" role="alert">
        <strong>ERROR! - </strong>${data[0].error}
        </div>
        `
        document.getElementById('infoError').innerHTML = infoError;
          return;
      }

      window.location = `CharlaProfesional.html`;

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
      const infoError = `
      <div class="alert alert-danger" role="alert">
      <strong>ERROR! - </strong>Error: Respuesta del servidor no v\u00E1lida
      </div>
      `
      document.getElementById('infoError').innerHTML = infoError;
        return;
    });


  });
};

if(document.getElementById('btn-update')) {  
  document.getElementById('btn-update').addEventListener('click', (e) => {    
  e.preventDefault();

  let session = JSON.parse(sessionStorage.getItem('token'))
  if(!session){
      window.location = `${ipServer}turnero/index.html`;
      return;
  };

  const identificador = document.getElementById('identificador').value.replace(/ /g, '');
  const username = session.username.replace(/ /g, '');
  const password = session.password.replace(/ /g, '');
  
  
  let params = `p-id=${identificador}
                &p-username=${username}
                &p-password=${password}
                &p-fecha=${document.getElementById('fecha').value.split('-').reverse().join('/')}
                &p-descripcion=${document.getElementById('descripcion').value}
                &p-codigoSector=1
                &p-codigoEmpresa=1
                &p-funcion=getUpdate`; 

  const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `${params}`
    };
    const myRequest = new Request(`${baseUrl}Administracion/CharlaProfesionalServices.p`, options);
    
    fetch(myRequest)
    .then(response => {  
      if (!response.ok) {
        throw new Error('Problema con la respuesta del servidor');
      }
      return response.json();
      })
    .then(data => { console.log("DATOS: ", data)
      if(data[0].error !== ''){
        const infoError = `
        <div class="alert alert-danger" role="alert">
        <strong>ERROR! - </strong>${data[0].error}
        </div>
        `
        document.getElementById('infoError').innerHTML = infoError;
          return;
      }

      window.location = `CharlaProfesional.html`;

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
      const infoError = `
      <div class="alert alert-danger" role="alert">
      <strong>ERROR! - </strong>Error: Respuesta del servidor no v\u00E1lida
      </div>
      `
      document.getElementById('infoError').innerHTML = infoError;
        return;
    });
  });
};

