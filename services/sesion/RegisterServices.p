{src/web2/wrap-cgi.i}

DEF VAR wRequestPost    AS CHAR             NO-UNDO.
DEF VAR w-tipDoc        AS CHAR             NO-UNDO.
DEF VAR w-nroDoc        AS CHAR             NO-UNDO.
DEF VAR w-email         AS CHAR             NO-UNDO.
DEF VAR w-apellido      AS CHAR             NO-UNDO.
DEF VAR w-nombre        AS CHAR             NO-UNDO.
DEF VAR w-password      AS CHAR             NO-UNDO.
DEF VAR w-password2     AS CHAR             NO-UNDO.
DEF VAR todoOk          AS LOG INIT FALSE   NO-UNDO.
DEF VAR ruta            AS CHAR             NO-UNDO.
DEF VAR incorrecto      AS LOG INIT FALSE   NO-UNDO.
DEF VAR w-ident         AS INT              NO-UNDO.
DEF VAR w-body          AS CHAR             NO-UNDO.
DEF VAR w-salida AS LOG NO-UNDO.

DEF BUFFER bf FOR Users.
 
ASSIGN  w-tipDoc    = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(GET-VALUE("p-tipoDocumento"), '"', '') , "\", "/"), CHR(9),""), CHR(10)," "), "'", ""))
        w-nroDoc    = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(GET-VALUE("p-numeroDocumento"), '"', '') , "\", "/"), CHR(9),""), CHR(10)," "), "'", ""))
        w-email     = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(GET-VALUE("p-email"), '"', '') , "\", "/"), CHR(9),""), CHR(10)," "), "'", ""))
        w-apellido  = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(GET-VALUE("p-apellido"), '"', '') , "\", "/"), CHR(9),""), CHR(10)," "), "'", ""))
        w-nombre    = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(GET-VALUE("p-nombres"), '"', '') , "\", "/"), CHR(9),""), CHR(10)," "), "'", ""))
        w-password  = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(GET-VALUE("p-password"), '"', '') , "\", "/"), CHR(9),""), CHR(10)," "), "'", ""))
        w-password2 = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(GET-VALUE("p-password2"), '"', '') , "\", "/"), CHR(9),""), CHR(10)," "), "'", "")).

procedure output-header:
    output-content-type("text/text").
    wRequestPost = REQUEST_METHOD.
end.

run output-header.    

IF INT(w-tipdoc) = 0  OR DEC(w-nrodoc) = 0 OR TRIM(w-email) = '' OR TRIM(w-password) = '' OR TRIM(w-password2) = ''  then do: 
    {&out} 
    chr(123) + '"id":"' + "" + 
    '","password":"' + "" + 
    '","nombre":"' + "" + 
    '","error":"' + "Por favor, completa todos los campos obligatorios para poder registrar tu información. ¡Gracias por tu colaboración!."  + '"}'.
    RETURN NO-APPLY.
END.


FIND FIRST Users WHERE Users.mail = w-email NO-LOCK NO-ERROR.
IF AVAIL Users THEN DO: 
    {&out} 
    chr(123) + '"id":"' + "" + 
    '","password":"' + "" + 
    '","nombre":"' + "" + 
    '","error":"' + "La dirección de correo electrónico que has proporcionado 
    ya está registrada en nuestro sistema. 
    Si olvidaste tu contraseña, puedes utilizar la opción de recuperación de contraseña. 
    Si necesitas asistencia adicional, no dudes en ponerte en contacto con nuestro equipo de soporte. Gracias. "  + '"}'.
    RETURN NO-APPLY.
END.
ELSE DO:
    DO TRANSACTION:
    FIND LAST bf NO-LOCK NO-ERROR. 
    IF AVAIL bf 
        THEN ASSIGN w-ident = bf.id + 1. 
        ELSE ASSIGN w-ident = 1. 

    RELEASE bf.
    CREATE Users. 
    ASSIGN Users.mail            = w-email 
           Users.id              = w-ident
           Users.password        = ENCODE(w-password)
           Users.apellido        = w-apellido
           Users.nombre          = w-nombre
           Users.codigoRol       = 73
           Users.codigoEmpresa   = 1
           Users.codigoSector    = 1
           Users.tipoDocumento   = INT(w-tipdoc)
           Users.numeroDocumento = DEC(w-nrodoc). 

           
    ASSIGN w-body = "Estamos emocionados de tenerte como parte de nuestra comunidad. 
                     Para completar el proceso de registro y activar tu cuenta, por favor sigue estos pasos: " + chr(10) 
                                                                                                               + chr(10) 
                                                                                                               + chr(10) 
                                                                                                               + chr(10) +
                        "1. Haz clic en el siguiente enlace de activacion:  http://192.168.0.7/turnero/view/activacion.html?p-userName=" + w-email + "&p-password=" + ENCODE(w-password) +  chr(10) + chr(10) +
                        "2. Si el enlace no funciona, copia y pega la siguiente URL en tu navegador web: http://192.168.0.7/turnero/view/activacion.html" + CHR(10) + 
                        "3. Una vez que hayas activado tu cuenta, podrás acceder a todas las funciones y características de nuestro sitio." + chr(10) 
                                                                                                                                            + chr(10) +
                        "Si no has intentado registrarte en http://192.168.0.7/turnero/view/activacion.html, por favor ignora este mensaje." + chr(10) + chr(10) + chr(10) +

                        "¡Gracias por unirte a nosotros!" + chr(10) + chr(10) + 
                        "Atentamente,
                        El Equipo de Municipalidad e Pérez".
            
            RUN EnvioMailAdj_CDO.p(INPUT "SoporteMunicipalidadDePerez@gmail.com",
                                    INPUT w-email, 
                                    INPUT "clgomez@msn.com",
                                    INPUT "",
                                    INPUT "MUNICIPALIDAD DE PEREZ - Activa tu cuenta",
                                    INPUT w-body,
                                    INPUT "",
                                    INPUT false,
                                    OUTPUT w-salida).  

    end.
END.


ASSIGN ruta = '/turnero/view/confirmacion.html'. 

    
    {&out} 
    chr(123) + 
    '"username":"' + w-email + 
    '","ruta":"' + ruta + 
    '","valido":"' + STRING(w-salida) + 
    '","error":"' + ""  + '"}'.



return no-apply.
 

