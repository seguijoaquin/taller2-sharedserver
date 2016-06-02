
# Estructura de la base de datos

- *Motor de base de datos:* PostgreSQL
- *Cliente heroku:* pg


##Tablas a utilizar
-------------------

###Tabla users

Almacenará información relevante a los usuarios. Posee un campo id que identifica a cada usuario y es único.
Almacenara nombre, email, alias, sexo, edad, ubicacion (latitud y longitud) y una foto de perfil. Sus columnas son:


- name
- email
- alias
- sex
- edad
- latitude
- longitude

**Creacion de la tabla users**

Conectarse al ciente pg de heroku:

`heroku pg:psql`

Crear la tabla:

`CREATE TABLE users (
	id_user SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	alias TEXT,
	email TEXT NOT NULL,
	sex TEXT NOT NULL,
	edad INTEGER NOT NULL,
	latitude REAL,
	longitude REAL,
	photo_profile TEXT
	);
`

--------------------------------------------------------------------------------

###Tabla pictures

Almacenará fotos de los usuarios, distintas de la foto de perfil, y una referencia al id_usuario de la tabla users.


**Creacion de la tabla pictures**

Conectarse al ciente pg de heroku:

`heroku pg:psql`

Crear la tabla:

`CREATE TABLE pictures (
	id_picture SERIAL PRIMARY KEY,
	id_user INTEGER NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
	pic TEXT
	);
`

--------------------------------------------------------------------------------

###Tabla interests

Almacenará información correspondiente a los intereses existentes.
Posee una referencia a la columna *category* de la tabla *categories*, y una columa *value* que representa un valor para esa categoria referenciada.
La combinación de una categoría y un valor son únicas. Es decir, no existen dos categorías con el mismo valor en la tabla.

**Creacion de la tabla interests**

Conectarse al ciente pg de heroku:

`heroku pg:psql`

Crear la tabla:

`CREATE TABLE interests (
	id_interest SERIAL PRIMARY KEY,
	category TEXT NOT NULL REFERENCES categories(category) ON DELETE CASCADE,
	value TEXT,
	UNIQUE (category, value)
	);
`

--------------------------------------------------------------------------------

###Tabla users_interests

Almacenará información correspondiente a los intereses de cada usuario.
Posee una referencia al campo *id_user* de la tabla *users*, y una referencia al campo *id_interest* de la tabla *interests*.
Pueden existir muchas filas de la tabla para un mismo usuario, lo que representaría que un mismo usuario puede tener muchos intereses distintos.

**Creacion de la tabla users_interests**

Conectarse al ciente pg de heroku:

`heroku pg:psql`

Crear la tabla:

`CREATE TABLE users_interests (
	id_usr_int SERIAL PRIMARY KEY,
	id_user INTEGER NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
	id_interest INTEGER NOT NULL REFERENCES interests(id_interest) ON DELETE CASCADE
	);
`

--------------------------------------------------------------------------------

###Tabla categories

Almacenará información correspondiente a las categorías de cada interés.
Cualquier interés que quiera crearse deberá tener una categoría existente en esta tabla.

**Creacion de la tabla categories**

Conectarse al ciente pg de heroku:

`heroku pg:psql`

Crear la tabla:

`CREATE TABLE categories (
	id_category SERIAL PRIMARY KEY,
	category TEXT UNIQUE NOT NULL
	);
`
