// busca turnos del dia
const getNoticias = (origen) => { 
  let card = '';
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
   
  const myRequest = new Request(`${baseUrl}Noticias/NoticiasServices.p${params}`, options);
  
  fetch(myRequest)
    .then(response => { 
      if (!response.ok) {
        throw new Error('Problema con la respuesta del servidor');
      }
      return response.json()
    })
    .then(data => {  
      document.getElementById('loading').innerHTML = '';

      data.forEach(data => {
        card += `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${data.titulo}</h5>
                    <p class="card-text">${data.noticia}</p>
                    <p class="card-text"><small class="text-muted">${data.fechaNoticia}</small></p>`; 
                  if(origen === "Admin"){
                    card += ` 
                    <a href="NovedadEdit.html?p-id=${data.id}">
                      <button class="btn btn-success mt-2"  style="width: 8rem;" id="btn-update">Editar</button>
                    </a>
                    <button class="btn btn-danger mt-2" style="width: 8rem;" type="button" onclick="NoticiaDelete(${data.id})" >Eliminar</button>
            
                    `;
                  }
                  card += `  
                </div>
            </div>
        `;
        });
        document.getElementById('noticias').innerHTML = card;

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

const getNoticia = () => { 
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
      
  const myRequest = new Request(`${baseUrl}Noticias/NoticiasServices.p${params}`, options);
  fetch(myRequest)
    .then(response => {  
      if (!response.ok) {
        throw new Error('Problema con la respuesta del servidor');
      }
      return response.json()
    })
      .then(data => { 
        
        document.getElementById('identificador').value = data[0].id
        document.getElementById('fecha').value = data[0].fechaNoticia.split('/').reverse().join('-')
        document.getElementById('titulo').value = data[0].titulo
        document.getElementById('descripcion').value = data[0].noticia
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


if(document.getElementById('btn-create')) {  
  document.getElementById('btn-create').addEventListener('click', (e) => {    
  e.preventDefault();

  const fecha = document.getElementById('fecha').value.split('-').reverse().join('/');
  // Obtiene usuario en session
  let session = JSON.parse(sessionStorage.getItem('token'))
  // sessionStorage vacio
  if(!session){
      window.location = `${ipServer}turnero/index.html`;
      return;
  };

  const identificador = document.getElementById('identificador').value
  const titulo = document.getElementById('titulo').value
  const noticia = document.getElementById('descripcion').value
  
  let params = `p-id=${identificador}
                &p-username=${session.username}
                &p-password= ${session.password}
                &p-fecha=${fecha}
                &p-titulo=${titulo}
                &p-noticia=${noticia}
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

    const myRequest = new Request(`${baseUrl}Noticias/NoticiasServices.p`, options);
    
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

      window.location = `novedades.html`;

  }
    )
    .catch(error => console.error(error));


  });
};


// GENERA/ACTUALIZA DATOS DEL TURNO
if(document.getElementById('btn-update')) {  
  document.getElementById('btn-update').addEventListener('click', (e) => {    
  e.preventDefault();

  const fecha = document.getElementById('fecha').value.split('-').reverse().join('/');
  // Obtiene usuario en session
  let session = JSON.parse(sessionStorage.getItem('token'))
  // sessionStorage vacio
  if(!session){
      window.location = `${ipServer}turnero/index.html`;
      return;
  };

  const identificador = document.getElementById('identificador').value
  const titulo = document.getElementById('titulo').value
  const noticia = document.getElementById('descripcion').value
  
  let params = `p-id=${identificador}
                &p-username=${session.username}
                &p-password= ${session.password}
                &p-fecha=${fecha}
                &p-titulo=${titulo}
                &p-noticia=${noticia}
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

    const myRequest = new Request(`${baseUrl}Noticias/NoticiasServices.p`, options);
    
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

      window.location = `novedades.html`;

  }
    )
    .catch(error => console.error(error));


  });
}; 

const NoticiaDelete = (identificador) => {  
  let params = '';
  // diseño boton de alerta
  const titulo = '<h6 class="text-secondary font-weight-bold"><b>BAJA DE TURNO</b></h6>'
  const mensaje = `<p class="text-center">
                  <span class="text-secondary font-weight">Confirma la baja de la noticia identificada con el nro.:   
                  <span class="text-secondary font-weight-bold"> ${identificador}</span>? 
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
                &p-codigoSector=1
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

          const myRequest = new Request(`${baseUrl}Noticias/NoticiasServices.p`, options);
    
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
              getNoticias('Admin');
          })
          .catch(error => console.error(error));
  },
  function() {
      alertify.error('Cancelado')
  }).set('labels', {ok:'Confirmar Baja', cancel:'Cancelar'})
  return
}

