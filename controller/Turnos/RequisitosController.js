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
                </tr>`;
            
            });
            document.getElementById('table-result').innerHTML = txtHtml
            return jsonObj
        }
    }
    obj.send()
    return
}

