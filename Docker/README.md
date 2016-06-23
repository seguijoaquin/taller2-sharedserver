# Virtualizacion del shared server en un container de Docker

  Aqui contamos con dos opciones:
  
  Correr la imagen descargandola del repositorio o teniendo experiencia y conocimientos de Docker, buildearla a partir del docker file.



## Run

Correr el archivo:

`$ ./runSharedServerDocker.sh`

Esto hara que se corra el servidor en un container que matchea el puerto 5000 del container al puerto 5000 del host.

Para correrlo manualmente se puede utilizar el siguiente comando:

Para mostrar la terminal:

`$ docker run -i -w /home/taller2-sharedserver/localconfig -p 5000:5000 -t diegofk26/shared-server-docker sh ./runlocally.sh`

No mostrar la terminal:

`$ docker run -i -w /home/taller2-sharedserver/localconfig -p 5000:5000 -d --name sharedlocal diegofk26/shared-server-docker sh ./runlocally.sh`

Cambiar en -p 5000:5000 a -p PUERTO_DEL_HOST:5000


## Build

Imagen a utilizar:

diegofk26/shared-server-docker

Para buildear la imagen correr el script build.sh:

`$ sh ./build.sh`

o utilizar:

`$ docker build -t shared-server-docker .`

la imagen creada tendra el nombre de shared-server-docker
