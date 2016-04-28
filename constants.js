module.exports = Object.freeze({


    POSTGRE_URL_DB: "postgres://tqezweoinbznuw:8DX2r1Jt6SuzmPlqyRoEUwSQKr@ec2-54-221-249-201.compute-1.amazonaws.com:5432/d1h0hefo2t4jcr",

    //----------------------------- METADATA ---------------------------------------
    METADATA_VERSION : "0.1",

    //----------------------------- ERRORES ---------------------------------------

    ERROR_MSG_PG_CONNECT: "[ERROR: No se pudo realizar la conexion a la base de datos]",

    ERROR_MSG_DB_TABLA_INEXISTENTE: "[ERROR: La tabla consultada es inexistente.]",

    CODE_TABLA_INEXISTENTE: '42P01',

    ERROR_MSG_INVALID_USER: "[ERROR: El usuario es invalido]",



    // ---------------------------- QUERYS ----------------------------------------

    QUERY_LISTADO_USUARIOS: "SELECT * FROM usuarios",

    QUERY_ALTA_USUARIO: "INSERT INTO usuarios (name,mail,alias,latitude,longitude) values($1,$2,$3,$4,$5) RETURNING id",

    QUERY_CONSULTA_PERFIL_USUARIO: "SELECT * FROM usuarios WHERE id = ($1)",

    QUERY_MODIFICACION_PERFIL_USUARIO: "UPDATE usuarios SET name = ($1), mail = ($2), alias = ($3), latitude = ($4), longitude = ($5) WHERE id = ($6)",

    QUERY_BAJA_DE_USUARIO: "DELETE FROM usuarios WHERE id = ($1)",


    //----------------------------- DIRECTORIOS DEL SERVER - USERS -----------------------------

    DIR_LISTADO_USUARIOS: '/',

    DIR_ALTA_USUARIOS:'/',

    DIR_CONSULTA_PERFIL_USUARIO:'/[0-9]+',

    DIR_MODIFICACION_PERFIL_USUARIOS:'/[0-9]+',

    DIR_ACTUALIZA_FOTO_PERFIL: '/[0-9]+/photo',

    DIR_BAJA_DE_USUARIOS:'/[0-9]+',


});
