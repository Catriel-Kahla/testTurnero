{src/web2/wrap-cgi.i}

DEF VAR wRequestPost    AS CHAR                 NO-UNDO.
DEF VAR username        AS CHAR                 NO-UNDO. 
DEF VAR password        AS CHAR                 NO-UNDO.
DEF VAR nombreRol       AS CHAR                 NO-UNDO.
DEF VAR transac         AS LOG INITIAL FALSE    NO-UNDO.

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
    
    FIND FIRST Roles WHERE Roles.codigoRol = Users.codigoRol NO-LOCK NO-ERROR.
    IF AVAIL Roles THEN DO: 
        ASSIGN nombreRol = Roles.nombreRol
               transac   = TRUE.
    END.
    ELSE ASSIGN transac = FALSE.
END. 
ELSE ASSIGN transac = FALSE.

IF transac THEN DO: 
    {&out}   
    chr(123) +  
    '"nombreRol":"' + CAPS(nombreRol) +  
    '","error":"' + "" + '"}'.
END.
ELSE DO: 
    {&out}   
    chr(123) +   
    '"nombreRol":"' + "" +   
    '","error":"' +  "ERROR! - Transacción Incompleta"  + '"}'.
END.