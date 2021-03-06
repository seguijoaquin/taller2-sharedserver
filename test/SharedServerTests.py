import json
import requests
import unittest



#Precondiciones:
# La base de datos no debe contener ningun usuario.
# Se debe cumplir el api rest correspondiente.
# El server debe correr en el puerto 5000
# El server debe correr de forma local.

class TestAltaBajaYModificacionDeUsuarios(unittest.TestCase):


    port = 5000
    URI = 'http://localhost:'+ str(port);


    #----------------------------------------------------------------------------------------------------
    #-----------------------------------------  INTERESTS -----------------------------------------------
    #----------------------------------------------------------------------------------------------------




    #----------------------------------------------------------------------------------------------------
    #-----------------------------------------   USERS --------------------------------------------------
    #----------------------------------------------------------------------------------------------------

    def test_elAltaDeUnUsuarioConCamposCorrectosDeberiaDarStatusCode201(self):
        user ={
            "user":{
                "name":"Diego",
                "alias":"diego3",
                "email":"usuarioasd@usuario.com",
                "photo_profile":"< base_64 >",
                "interests":[
                    {
                        "category":"music/band",
                        "value":"michael jackson"
                    },
                    {
                        "category":"music/band",
                        "value":"pearl jam"
                    },
                    {
                        "category":"outdoors",
                        "value":"running"
                    }
                ],
                "location":{
                "latitude":-121.45356,
                "longitude":46.51119
                }
            }
        }

        head = {'content-type': 'application/json'}
        request = requests.post('http://localhost:'+ str(self.port) +'/users',data = json.dumps(user), headers = head)
        self.assertEqual(request.status_code, 201)


    def test_delete(self):

        request = requests.delete('http://localhost:'+str(self.port)+'/users/5')
        self.assertEqual(request.status_code,200)

    def test_getUsuarios(self):
        request = requests.get(self.URI + '/users')
        self.assertEqual(request.status_code,200)



if __name__ == '__main__':
    unittest.main()
