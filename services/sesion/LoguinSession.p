{src/web2/wrap-cgi.i}

DEF VAR wRequestPost    AS CHAR             NO-UNDO.
DEF VAR userName        AS CHAR             NO-UNDO.
DEF VAR password        AS CHAR             NO-UNDO.
DEF VAR sinSector       AS LOG INIT FALSE   NO-UNDO.
DEF VAR todoOk          AS LOG INIT FALSE   NO-UNDO.
DEF VAR ruta            AS CHAR             NO-UNDO.
DEF VAR incorrecto      AS LOG INIT FALSE   NO-UNDO.
 
ASSIGN  userName = REPLACE(TRIM(GET-VALUE('userName')), CHR(9), "")
        password = REPLACE(TRIM(GET-VALUE('password')), CHR(9), "").

procedure output-header:
    output-content-type("text/text").
    wRequestPost = REQUEST_METHOD.
end.

run output-header.    


if userName = ''  or password = '' then do: 
    {&out} 
    chr(123) + '"id":"' + "" + 
    '","password":"' + "" + 
    '","nombre":"' + "" + 
    '","error":"' + "Debe ingresar un nombre de usuario y una contraseña"  + '"}'.
    return no-apply.
end.


FIND FIRST Users WHERE Users.mail      = userName
                   AND (Users.password = password or 
                        Users.password = encode(password)) NO-LOCK NO-ERROR.
IF AVAIL Users THEN DO: 
    IF Users.fechaAlta = ? THEN DO:
        {&out} 
        chr(123) + 
        '"username":"' + "" + 
        '","password":"' + "" + 
        '","nombre":"' + "" + 
        '","rol":"' + "" +
        '","ruta":"' + "" + 
        '","valido":"' + "false" + 
        '","error":"' + "TU CUENTA NO ESTA ACTIVA. Por favor, verificá tu bandeja de entrada de correo electrónico.
        Si no encuentras un correo de activación allí, revisa tu carpeta de correo no deseado.
        Si aún no encuentras el correo de activación, por favor comunicate con nuestro
        equipo de soporte al siguiente número: xxxxxxxx"  + '"}'. 
        RETURN NO-APPLY.
    END.
    IF Users.codigoRol = 1
        THEN ASSIGN ruta = '/turnero/view/administracion/turnos/cargaturnos.html?p-fecha=' + string(today, "99/99/9999"). 
        ELSE ASSIGN ruta = '/turnero/view/inicio.html'. 
    
    {&out} 
    chr(123) + 
    '"username":"' + Users.mail + 
    '","password":"' + ENCODE(Users.password) + 
    '","nombre":"' + Users.apellido  + " " + Users.nombre + 
    '","rol":"' + ENCODE(STRING(Users.codigoRol)) + 
    '","ruta":"' + ruta + 
    '","valido":"' + "true" + 
    '","error":"' + ""  + '"}'.
END.
ELSE DO:
    {&out} 
    chr(123) + 
    '"username":"' + "" + 
    '","password":"' + "" + 
    '","nombre":"' + "" + 
    '","rol":"' + "" +
    '","ruta":"' + "" + 
    '","valido":"' + "false" + 
    '","error":"' + "Usuario o Contraseña Incorrecta"  + '"}'.    

    RETURN NO-APPLY.
END.


return no-apply.
 

