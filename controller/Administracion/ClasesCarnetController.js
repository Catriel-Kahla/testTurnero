// GetAll
const getClases = () => { 
    let session = JSON.parse(sessionStorage.getItem('token'))
    if(!session){
        window.location = `${ipServer}turnero/index.html`;
        return;
    }
    let params = `username=${session.username}
                  &password=${session.password}`; 

    let templateLoading = ''
    let txtHtml = ''
    templateLoading = `<div class="loading"><img src="/turnero/assets/images/loader.gif" alt="loading" /><br/>Un momento, por favor...</div>`
    document.getElementById('loading').innerHTML = templateLoading
    
    let obj = new XMLHttpRequest()
    obj.open('GET', `${baseUrl}Administracion/ClasesCarnetServices.p`, true)
    obj.setRequestHeader('content-type', 'application/x-www-form-urlencoded')
    obj.onreadystatechange = function () { 
        if (obj.readyState === 4 && obj.status === 200) {  
            document.getElementById('loading').innerHTML = '' 
            if(obj.responseText.length === 0){
                return
            };  
            const jsonObj = JSON.parse(obj.responseText);  
            jsonObj.forEach(element => {
                txtHtml += 
                ` <tr class="border p-5">
                    <td class="p-3 text-secondary font-weight-bold text-left">${element.identificador}</td>
                    <td class="p-3 font-weight-normal text-left">${element.clase}</td>
                    <td class="p-3 font-weight-normal text-left">${element.vehiculo}</td>
                    <td class="p-3 font-weight-normal text-left">${element.descripcion}</td>
                    <td class="p-3 font-weight-normal text-left">${element.requisitos}</td>
                    <td class="p-3 text-center">
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
                            <a class="dropdown-item text-center font-weight-bold text-mypage2" href="#">${element.clase}</a>
                            
                            <hr class="my-0 py-0">
                            <a class="dropdown-item font-weight-bold text-secondary" href="./ClaseEdit.html?identificador=${element.identificador}">Editar</a>
                            <hr class="my-0 py-0">
                            <a class="dropdown-item font-weight-bold text-danger" onclick="ClaseDelete(${element.identificador}, '${element.clase}')">Dar de Baja</a>
                            </div>
                        </div>
                    </td>
                </tr>`;
            
            });
            document.getElementById('table-result').innerHTML = txtHtml
            return jsonObj
        }
    }
    obj.send()
    return
}

// GetDelete
const ClaseDelete = (identificador, clase) => {  
    let params = '';
    const titulo = '<h6 class="text-secondary font-weight-bold"><b>BAJA DE CLASE</b></h6>'
    const mensaje = `<p class="text-center">
                    <span class="text-secondary font-weight">Confirma la baja de la 
                    <span class="text-secondary font-weight-bold"> ${clase}</span>? 
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
        params = `identificador=${identificador}`;
        
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `${params}`
            };

            const myRequest = new Request(`${baseUrl}Administracion/ClaseDelete.p`, options);
      
        fetch(myRequest)
            .then(response => { 
                if (!response.ok) {
                  throw new Error('Problema con la respuesta del servidor');
                }
                return response.json()
                })
            .then(data => {
                if(data.error === ''){
                    window.location = 'clasescarnet.html';
                    return;
                }
                getClases();
            })
            .catch(error => console.error(error));
    },
    function() {
        alertify.error('Cancelado')
    }).set('labels', {ok:'Confirmar Baja', cancel:'Cancelar'})
    return
}

// GetOne
  const getClase = () => { 
    let session = JSON.parse(sessionStorage.getItem('token'))
    if(!session){
        window.location = `${ipServer}turnero/index.html`;
        return;
    };

    let params = '';
    let habilitadoChecked;
    if(location.search.length > 0) {
        params = location.search;
    }

    params = params.replace(/ /g, '');
    
    const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
    const myRequest = new Request(`${baseUrl}Administracion/ClaseCarnetOne.p${params}`, options);
      
    fetch(myRequest)
    .then(response => response.json())
    .then(data => {
        document.getElementById('identificador').value = data.identificador
        document.getElementById('clase').value = data.nombreClase
        document.getElementById('edad').value = data.edadMinima
        document.getElementById('descripcion').value = data.detalle
        document.getElementById('requisitos').value = data.requisitos
        document.getElementById('vehiculo').value = data.vehiculo

        if(data.habilitado == 'yes') { 
            habilitadoChecked = true;
        }
        document.getElementById('habilitado').checked = habilitadoChecked; 
    }
    )
    .catch(error => console.error(error));
};

if(document.getElementById('update')) { 
    document.getElementById('update').addEventListener('click', (e) => {   
    e.preventDefault();

    // Obtiene usuario en session
    let session = JSON.parse(sessionStorage.getItem('token'))
    // sessionStorage vacio
    if(!session){
        window.location = `${ipServer}turnero/index.html`;
        return;
    };
 
    let params = `identificador=${document.getElementById('identificador').value}
                    &clase=${document.getElementById('clase').value}
                    &edad=${document.getElementById('edad').value}
                    &habilitado=${document.getElementById('habilitado').checked}
                    &vehiculo=${document.getElementById('vehiculo').value}
                    &requisitos=${document.getElementById('requisitos').value}
                    &descripcion=${document.getElementById('descripcion').value}`;

    const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `${params}`
      };
      
      const myRequest = new Request(`${baseUrl}Administracion/ClaseCarnetUpdate.p`, options);
      
      fetch(myRequest)
      .then(response => { 
        if (!response.ok) {
          throw new Error('Problema con la respuesta del servidor');
        }
        return response.json()
        })
      .then(data => {
        if(data.error === ''){
            window.location = 'clasescarnet.html';
            return;
        }
    }
      )
      .catch(error => console.error(error));


    });
};
