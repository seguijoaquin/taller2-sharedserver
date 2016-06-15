module.exports = Object.freeze({


    POSTGRE_URL_DB: "postgres://tqezweoinbznuw:8DX2r1Jt6SuzmPlqyRoEUwSQKr@ec2-54-221-249-201.compute-1.amazonaws.com:5432/d1h0hefo2t4jcr",

    //----------------------------- METADATA ---------------------------------------
    METADATA_VERSION : "0.1",

    //----------------------------- ERRORES ---------------------------------------

    ERROR_MSG_PG_CONNECT: "[ERROR: No se pudo realizar la conexion a la base de datos]",

    ERROR_MSG_INVALID_USER: "[ERROR: El usuario es invalido]",

    ERROR_EMAIL_ALREADY_EXISTS: "[ERROR: El email ya se encuentra registrado]",

    ERROR_SAVE_USER: "[ERROR: No se pudo guardar el usuario]",

    USER_NOT_FOUND: "[ERROR: No se encuentra el usuario]",

    // ---------------------------- STATUS ----------------------------------------

    STATUS_SUCCESS: 200,

    STATUS_ERROR: 500,

    STATUS_NOT_FOUND: 404,

    STATUS_CREATED: 201,

    // ---------------------------- QUERYS ----------------------------------------

    QUERY_ADD_USER: "INSERT INTO users (name,email,alias,sex,edad,latitude,longitude,photo_profile) values($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id_user",

    QUERY_GET_INTERESTS: "SELECT * FROM interests",

    QUERY_CREATE_INTEREST: "INSERT INTO interests (category,value) values ($1,$2) RETURNING id_interest",

    QUERY_SELECT_EMAILS: "SELECT * FROM users WHERE email=($1)",

    QUERY_GET_USERS: "SELECT * FROM (users LEFT JOIN users_interests ON (users.id_user=users_interests.id_user)) LEFT JOIN interests ON (users_interests.id_interest=interests.id_interest) ORDER BY users.id_user",

    QUERY_UPDATE_USERS: "UPDATE users SET name=($1),email=($2),alias=($3),sex=($4), edad=($5),latitude=($6),longitude=($7) WHERE id_user=($8)",

    QUERY_GET_ONE_USER: "SELECT * FROM (users LEFT JOIN users_interests ON (users.id_user=users_interests.id_user)) LEFT JOIN interests ON (users_interests.id_interest=interests.id_interest) WHERE users.id_user = ($1)",

    QUERY_DELETE_USER: "DELETE FROM users WHERE id_user=($1)",

    QUERY_UPDATE_PHOTO_PROFILE: "UPDATE users SET photo_profile=($1) WHERE id_user=($2)",

    QUERY_SAVE_ONE_INTEREST: "INSERT INTO users_interests (id_user,id_interest) values ($1,$2)",

    QUERY_SELECT_ONE_INTEREST: "SELECT * FROM interests WHERE category=($1) AND value=($2)",

    QUERY_GET_CATEGORIES: "SELECT * FROM categories WHERE category=($1)",



    //----------------------------- DIRECTORIOS DEL SERVER - USERS -----------------------------

    DIR_LISTADO_USUARIOS: '/',

    DIR_ALTA_USUARIOS:'/',

    DIR_CONSULTA_PERFIL_USUARIO:'/[0-9]+',

    DIR_MODIFICACION_PERFIL_USUARIOS:'/[0-9]+',

    DIR_ACTUALIZA_FOTO_PERFIL: '/[0-9]+/photo',

    DIR_BAJA_DE_USUARIOS:'/[0-9]+',


});
