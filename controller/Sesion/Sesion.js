//registro 
if(document.getElementById('registro')){
    document.getElementById('registro').addEventListener('click', (e) => {
        e.preventDefault(); 
        let infoError         = '';
        let mensaje           = '';
        let templateLoading   = '';

        document.getElementById('infoErrorReg').innerHTML = '';
        document.getElementById('loading').innerHTML = '';

        const tipoDocumento   = document.getElementById('tipdoc').value;
        const numeroDocumento = document.getElementById('nrodoc').value;
        const apellido        = document.getElementById('apellido').value;
        const nombres         = document.getElementById('nombres').value;
        const email           = document.getElementById('regemail').value;
        const password        = document.getElementById('regpassword').value;
        const password2       = document.getElementById('password2').value; 
        const params = 
              `p-tipoDocumento=${tipoDocumento}
               &p-numeroDocumento=${numeroDocumento}
               &p-email=${email}
               &p-apellido=${apellido}
               &p-nombres=${nombres}
               &p-password=${password}
               &p-password2=${password2}`;

        mensaje = '';
        if(!tipoDocumento || !numeroDocumento || !email || !password || !password2){
            mensaje = 'Por favor, completa todos los campos obligatorios para poder registrar tu informaci&oacute;n.';
            mensaje += ' ¡Gracias por tu colaboraci&oacute;n!';
            infoError = 
            `
            <div class="alert alert-danger" role="alert">
            <strong>ERROR! - </strong>${mensaje}
            </div>
            `
            document.getElementById('infoErrorReg').innerHTML = infoError;
            return false;
        }
        if(password !== password2){ 
            mensaje = 'Los campos de Password y Confirmar Password no coinciden.'
            mensaje += ' Por favor, asegúrate de que ambos campos contengan la misma contrase&ntilde;a para completar el registro correctamente.';
            infoError = 
            `
            <div class="alert alert-danger" role="alert">
            <strong>ERROR! - </strong>${mensaje}
            </div>
            `
            document.getElementById('infoErrorReg').innerHTML = infoError;
            return false;
        }
        
        templateLoading = `<div>
        <span class="text-primary"><strong> 
        ¡Gracias por registrarte en nuestro sitio web!</strong> 
        </span>
        </div>
        <div>
        <span class="text-primary">
        En breve, recibirás un correo electrónico para activar tu cuenta. 
        Por favor, asegúrate de revisar tu carpeta de spam o correo no deseado si no encuentras el mensaje en tu bandeja de entrada.
        </span>
        </div>`
        document.getElementById('loading').innerHTML = templateLoading
        const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `${params}`
          };

        const myRequest = new Request(`${baseUrl}Sesion/RegisterServices.p`, options);
        fetch(myRequest)
            .then( response => {
                if(!response.ok){
                    throw new Error('Problema con la respuesta del servidor');
                }
                return response.json();
            })
            .then(data => { console.log(data)
                
                document.getElementById('loading').innerHTML = '';
                if(data.error !== ''){
                    infoError = `
                    <div class="alert alert-danger" role="alert">
                    <strong>ERROR! - </strong>${data.error}
                    </div>
                    `
                    document.getElementById('infoErrorReg').innerHTML = infoError;
                    return false; 
                  }

                  /*
                window.location= `${data.ruta}`;*/
                return data;
            })
            .catch(error => console.log(error));


    })
}


// ------------------------- create sessionStorage -----------------------
if(document.getElementById("mainBlock")){
    document.getElementById("mainBlock").addEventListener('click', (e) => {
        if (e.target && e.target.id === "btnLogin") {
            
            e.preventDefault(); 
            alert("Sesión Iniciada");

            

        };

        if (e.target && e.target.id === "registro") {
            
            e.preventDefault(); 
            alert("Persona Registrado");
            
        };
    });
};


/*
if(document.getElementById('btnLogin')) {  
    document.getElementById('btnLogin').addEventListener('click', (e) => { 
        e.preventDefault(); 
        let infoError
        let userName = document.getElementById('username').value;
        let password = document.getElementById('password').value;
        var params = `userName=${userName}
                     &password=${password}`;
        
        document.getElementById('infoErrorReg').innerHTML ='';
        let obj = new XMLHttpRequest(); 
        obj.open('POST', `${baseUrl}Sesion/LoguinSession.p`, true);
        obj.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
        obj.onreadystatechange = function () {    
            if(obj.readyState == 4) { 
                if(obj.responseText.length == 0){
                    return false;
                } 
                console.log(obj.responseText)
                const jsonObj = JSON.parse(obj.responseText);  
                if(jsonObj.error != '') {
                    infoError = `
                    <div class="alert alert-danger" role="alert">
                    <strong>ERROR! - </strong>${jsonObj.error}
                    </div>
                    `
                    document.getElementById('infoErrorReg').innerHTML = infoError;
                    return false; 
                }
                let token = {username: jsonObj.username,
                             password: jsonObj.password,
                             ROL: jsonObj.rol,
                             name: jsonObj.nombre
                            }
                sessionStorage.setItem('token', JSON.stringify(token))
                
                window.location= `${jsonObj.ruta}`;
                return jsonObj;
            }
        }
        obj.send(params);
        return false;
    });
}; */


// User Logued
const getSesionUser = () => {  
    // Obtiene usuario en session
    let session = JSON.parse(sessionStorage.getItem('token'))

    // sessionStorage vacio
    if(!session){
        window.location = `../../turnero/index.html`;
        return;
    }
    let params = `username=${session.username}
                  &password=${session.password}`; 

    let obj = new XMLHttpRequest();
    obj.open('POST', `${baseUrl}Sesion/SessionParameter.p`, true);
    obj.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
    obj.onreadystatechange = function () { 
        
        if(obj.readyState == 4) {  
            if(obj.responseText.length == 0){
                return false;
            } 
            const jsonObj = JSON.parse(obj.responseText); 

            if(jsonObj.valido === 'false') {
                window.location= `index.html`;
                return false; 
            } 

            window.location = jsonObj.locationpage;
            return jsonObj;
        }
    }
    obj.send(params);
    return false;
};


// ------------------------- Activar Cuenta -----------------------
if(document.getElementById('btn-activar')) {  
    document.getElementById('btn-activar').addEventListener('click', (e) => { 
        e.preventDefault(); 
        var searchParams = new URLSearchParams(location.search);
        const userName = searchParams.get('p-userName');
        const password = searchParams.get('p-password');
        let infoError
        var params = `p-userName=${userName}
                      &p-password=${password}`;
        
        const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `${params}`
        };

        const myRequest = new Request(`${baseUrl}Sesion/ActivaCuenta.p`, options);
        fetch(myRequest)
            .then( response => {
                if(!response.ok){
                    throw new Error('Problema con la respuesta del servidor');
                }
                return response.json();
            })
        .then(data => { 
            if(data.error !== ''){
                infoError = `
                <div class="alert alert-danger" role="alert">
                <strong>ERROR! - </strong>${data.error}
                </div>
                `
                document.getElementById('infoError').innerHTML = infoError;
                return false; 
                }

                infoError = `
                <div class="alert alert-success" role="alert">
                La cuenta se ha activado con \u00E9xito. Puedes <a href="../index.html">iniciar sesi\u00F3n</a>
                </div>
                `
                document.getElementById('infoError').innerHTML = infoError;
               
            return data;
        })
        .catch(error => console.log(error));
    });
}; 


//----------------------------New Functions-----------------------


if(document.getElementById("mainBlock")){
    document.getElementById("mainBlock").addEventListener('click', (e) => {
        if (e.target && e.target.id === "indexBackBut") {
            document.getElementById("mainBlock").innerHTML = `
                <button type="button" class="btn btn-primary btn-idx" id="openLogInBut">Iniciar Sesión</button>
                <button type="button" class="btn btn-primary btn-idx" id="openRegBut">Registrarse</button>
            `;
        } else if (e.target && e.target.id === "openLogInBut") {
            document.getElementById("mainBlock").innerHTML = `
                <div class="container principalBox">
                    <form role="form" autocomplete="off">
                        <fieldset>							
                            <p class="text-uppercase font-weight-bold text-muted">INICIA SESIÓN CON TU CUENTA:</p>	
                            <div class="form-group">
                                <input type="email" name="username" id="username" class="form-control input-lg" placeholder="Email" autofocus>
                            </div>
                            <div class="form-group">
                                <input type="password" name="password" id="password" class="form-control input-lg" placeholder="Password">
                            </div>
                            <div>
                                <input type="submit" id="btnLogin" class="btn btn-primary mt-2 btn-idx" value="Iniciar Sesión">
                                <button type="button" class="btn btn-secondary btn-idx" id="indexBackBut">Volver</button>
                                <a href="#" class="btn btn-link mt-2">¿Olvidaste tu contraseña?</a>
                            </div>			 
                        </fieldset>
                    </form>	
                </div>
            `;
        } else if (e.target && e.target.id === "openRegBut") {

            document.getElementById("mainBlock").innerHTML = `
                <div class="col-md-5">
                    <form role="form" autocomplete="off" id="myFormReg">
                        <fieldset>							
                            <p class="text-uppercase pull-center font-weight-bold text-muted">REGISTRARSE.</p>	
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <label class="input-group-text" for="inputGroupSelect01">Tipo Documento</label>
                                </div>
                                <select class="custom-select" id="tipdoc">
                                    <option selected>Seleccione...</option>
                                    <option value="1">DNI</option>
                                    <option value="2">L.E.</option>
                                    <option value="3">L.C.</option>
                                    <option value="4">CUIT</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <input type="text" name="nrodoc" id="nrodoc" class="form-control input-lg" placeholder="Número documento">
                            </div>
                            <div class="form-group">
                                <input type="text" name="apellido" id="apellido" class="form-control input-lg" placeholder="Apellido">
                            </div>
                            <div class="form-group">
                                <input type="text" name="nombres" id="nombres" class="form-control input-lg" placeholder="Nombres">
                            </div>
                            <div class="form-group">
                                <input type="email" autocomplete="email" name="regemail" id="regemail" class="form-control input-lg" placeholder="Email">
                            </div>
                            <div class="form-group">
                                <input type="password" autocomplete="new-password" name="regpassword" id="regpassword" class="form-control input-lg" placeholder="Password">
                            </div>
                            <div class="form-group">
                                <input type="password" autocomplete="new-password" name="password2" id="password2" class="form-control input-lg" placeholder="Confirmar Password">
                            </div>
                            <div class="divAlign">
                                <input type="submit" class="btn btn-lg btn-primary mt-2 btn-idx" id="registro" value="Registrarse">
                                <button type="button" class="btn btn-secondary btn-idx" id="indexBackBut">Volver</button>
                            </div>
                        </fieldset>
                    </form>
                </div>
            `;
        }
    });    
};
