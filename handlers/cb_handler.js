/*
 * Con este modulo se pretende abstraer el llamado de funciones a la DB
 * Se crea una variable cb_handler que contendra la funcion especifica
 * que se quiere lanzar
 */
function cb_handler(req, res, param, next) {
  var my_req = req;
  var my_res = res;
  var my_next = next;
  var my_param = param;
  /*
   * Al querer armar la funcion de callback a llamar, no estamos conectados
   * a la base de datos, por lo que no tenemos el cliente seteado todavía
   * ni la funcion done
  */
  var my_client = undefined;
  var my_done = undefined;

  /*
   * Se llama inmediatamente despues de que se hace un connect con la DB
   * Se necesita tener seteado a un cliente antes de hacer una query
   * Pero solo se puede setear despues de haber hecho un connect
   * Lo mismo con la funcion done(); que finaliza la conexion con la DB
  */
  function set_ClientDone(client,done) {
    my_client = client;
    my_done = done;
  }

  /*
   * Una vez recibida la funcion que realizara la query en la DB
   * se lanza desde el cb_handler, invocando a launch()
   * como si fuese una funcion anonima
   */
  function launch() {
    my_next(my_req, my_res, my_param, my_client, my_done);
  }

  return {
    req: my_req,
    res: my_res,
    param: my_param,
    next: my_next,
    client: my_client,
    done: my_done,
    set_ClientDone: set_ClientDone,
    launch: launch
  }
}

module.exports = cb_handler;
