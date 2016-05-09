function cb_handler(req, res, next) {
  var my_req = req
  var my_res = res
  var my_next = next
  /*
   * Al querer armar la funcion de callback a llamar, no estamos conectados
   * a la base de datos, por lo que no tenemos el cliente seteado todavía
   * ni la funcion done
  */
  var my_client = undefined
  var my_done = undefined

  /*
   * Se llama inmediatamente despues de que se hace un connect con la DB
  */
  function set_ClientDone(client,done) {
    my_client = client
    my_done = done
  }

  function launch() {
    console.log('launching...')
    my_next(my_req, my_res, my_client, my_done)
  }

  return {
    req: my_req
    res: my_res
    next: my_next
    client: my_client
    done: my_done
    set_ClientDone: set_ClientDone
    launch: launch
  }
}

module.exports = cb_handler;
