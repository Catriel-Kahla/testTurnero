// busca turnos del dia
const getTurnos = () => { 
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
   console.log(params)
  const myRequest = new Request(`${baseUrl}Consultas/ConsultaTurnosServices.p${params}`, options);
   
  fetch(myRequest)
    .then(response => { 
      if (!response.ok) {
        throw new Error('Problema con la respuesta del servidor');
      }
      return response.json()
    })
    .then(data => {   console.log(data)
      document.getElementById('loading').innerHTML = '';

      data.forEach(data => {

        if(data.estado === 'PASADO'){
            card += `
            <tr class="border p-3" disabled>`
        }
        
        card += `
        <tr class="border p-3">
        <td class="text-secondary font-weight-bold text-left">${data.numeroDocumento}</td>
        <td class="text-secondary font-weight-bold text-left">${data.nombre}</td>  
        <td class="text-secondary font-weight-bold text-left">${data.nombreTramite}</td>  
        <td class="text-secondary font-weight-bold text-left">${data.turno}</td>
        <td class="font-weight-normal text-left">${data.fecha}</td>
        <td class="font-weight-normal text-left">${data.hora}</td>
        </tr>
        `;
        });
        document.getElementById('table-result').innerHTML = card;

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


if(document.getElementById('btn-search')) {  
    document.getElementById('btn-search').addEventListener('click', (e) => {    
    e.preventDefault();

    let txtHtml;
    let estado;
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
                  &p-numeroDocumento=${documento}
                  &p-funcion=getOne
                  &p-codigoSector=1
                  &p-codigoEmpresa=1`; //carnet de conducir
  
    document.getElementById('table-result').innerHTML = '';            
    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `${params}`
      };
      const myRequest = new Request(`${baseUrl}Consultas/ConsultaTurnosServices.p`, options);
      
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
        data.forEach(data => { 
            console.log(data.estado)
            if(data.estado === 'PASADO'){ 
                estado = 'text-pasado';
            }
            else{
                estado ='text-secondary'
            }
          txtHtml === undefined ? txtHtml = `<tr class="border p-3 ${estado}">` : txtHtml += `<tr class="border p-3 ${estado}">`;
          
          txtHtml += 
          ` <td class="${estado} font-weight-bold text-left">${data.numeroDocumento}</td>
            <td class="${estado} font-weight-bold text-left">${data.nombre}</td>  
            <td class="${estado} font-weight-bold text-left">${data.nombreTramite}</td>  
            <td class="${estado} font-weight-bold text-left">${data.turno}</td>
            <td class="${estado} font-weight-normal text-left">${data.fecha}</td>
            <td class="${estado} font-weight-normal text-left">${data.hora}</td>
            </tr>`;
        });
        document.getElementById('table-result').innerHTML = txtHtml;
  
        
  
    }
      )
      .catch(error => console.error(error));
  
  
    });
  };