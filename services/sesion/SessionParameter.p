{src/web2/wrap-cgi.i}

DEF VAR wRequestPost        AS CHAR             NO-UNDO.
DEF VAR userName            AS CHAR             NO-UNDO.
DEF VAR password            AS CHAR             NO-UNDO.
DEF VAR valido              AS LOG INIT FALSE   NO-UNDO.
DEF VAR nombrePais          AS CHAR             NO-UNDO.
DEF VAR nombreCalle         AS CHAR             NO-UNDO.
DEF VAR nombreCivil         AS CHAR             NO-UNDO.
DEF VAR nombreDocumento     AS CHAR             NO-UNDO.
DEF VAR nombreContribuyente AS CHAR             NO-UNDO.
DEF VAR fechaNacimiento     AS CHAR             NO-UNDO.
DEF VAR ciudad              AS CHAR             NO-UNDO.
DEF VAR position            AS INT              NO-UNDO. 
DEF VAR resultado           AS CHAR             NO-UNDO.
DEF VAR celular             AS CHAR             NO-UNDO. 
DEF VAR telefono            AS CHAR             NO-UNDO. 
       


assign userName = replace(trim(get-value('username')), chr(9), "")
       password = replace(trim(get-value('password')), chr(9), "").

procedure output-header:
    output-content-type("text/text").
    wRequestPost = REQUEST_METHOD.
end.

run output-header.

FIND FIRST Users where Users.mail  = userName
                        AND (Users.password = password or 
                             ENCODE(Users.password) = password) NO-LOCK NO-ERROR.
IF AVAIL Users THEN DO:
    {&out} 
    chr(123) + 
    '"username":"' + Users.mail + 
    '","nombre":"' + Users.apellido + " " + Users.nombres. 

    FIND FIRST DatosPersonales WHERE DatosPersonales.tipDoc = Users.tipoDocumento 
                                 AND DatosPersonales.nroDoc = Users.numeroDocumento NO-LOCK NO-ERROR. 
    IF AVAIL DatosPersonales 
        THEN {&out} '","locationpage":"' + "tramite.html".
        ELSE {&out} '","locationpage":"' + "inicioIndividuo.html". 

    {&out}
    '","valido":"' + "true" + 
    '","error":"' + ""  + '"}'.
    RETURN NO-APPLY.
END.
ELSE DO:
    {&out} 
    chr(123) + 
    '"username":"' + "" + 
    '","nombre":"' + "" + 
    '","valido":"' + "false" + 
    '","error":"' + "Sesion Cerrada"  + '"}'.
    RETURN NO-APPLY.
END.