#Para buildear la imagen correr el script build.sh:

$sh ./build.sh


#o utilizar:


$docker build -t shared-server-docker .


# Si no nos anda el puerto pq se bloqueo hacer

docker-machine restart

# Para correr la imagen usar el script runShared... cambiarle la imagen si es descargada del repo

# IMPORTANTE!!!!!!!! : Luego de correr el shared esperar unos segundos a que haga el npm install esto lleva su tiempo, despues probarlo.