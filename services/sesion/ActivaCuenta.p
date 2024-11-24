{src/web2/wrap-cgi.i}

DEF VAR wRequestPost    AS CHAR             NO-UNDO.
DEF VAR w-email         AS CHAR             NO-UNDO.
DEF VAR w-password      AS CHAR             NO-UNDO.
DEF VAR todoOk          AS LOG INIT FALSE   NO-UNDO.

DEF BUFFER bf FOR Users.
 
ASSIGN  w-email     = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(GET-VALUE("p-userName"), '"', '') , "\", "/"), CHR(9),""), CHR(10)," "), "'", ""))
        w-password  = TRIM(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(GET-VALUE("p-password"), '"', '') , "\", "/"), CHR(9),""), CHR(10)," "), "'", "")).

procedure output-header:
    output-content-type("text/text").
    wRequestPost = REQUEST_METHOD.
end.

run output-header.    
ASSIGN todoOk = FALSE.
DO TRANSACTION:
    FIND FIRST bf WHERE bf.mail = w-email
                    AND bf.password = w-password EXCLUSIVE-LOCK NO-ERROR. 
    IF NOT AVAIL bf THEN LEAVE.
    
    ASSIGN bf.fechaAlta = TODAY
           todoOk       = TRUE. 
    
END.
RELEASE bf.

IF todoOk THEN DO:
    {&out} 
    chr(123) + 
    '"username":"' + w-email + 
    '","valido":"' + STRING(todoOk) + 
    '","error":"' + ""  + '"}'.
END.
ELSE DO:
    {&out} 
    chr(123) + 
    '"username":"' + w-email + 
    '","valido":"' + STRING(todoOk) + 
    '","error":"' + "Se produjo un error. Vuelva aintentarlo más tarde. Si el problema persiste comuniquese con Soporte"  + '"}'.
END.
return no-apply.
 

