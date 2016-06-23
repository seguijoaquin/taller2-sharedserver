# Change Log

## [v1.0.2](https://github.com/seguijoaquin/taller2-sharedserver/tree/v1.0.2) (2016-06-23)
[Full Changelog](https://github.com/seguijoaquin/taller2-sharedserver/compare/v1.0.1...v1.0.2)

**Implemented enhancements:**

- Listar intereses de un usuario al consultar por ID via web [\#51](https://github.com/seguijoaquin/taller2-sharedserver/issues/51)

**Fixed bugs:**

- Alta de un interes con categoria nula produce crash [\#60](https://github.com/seguijoaquin/taller2-sharedserver/issues/60)
- No se modifican los intereses cuando se modifica a un usuario [\#59](https://github.com/seguijoaquin/taller2-sharedserver/issues/59)
- Implementar dropdown button de categorias para el alta de intereses [\#53](https://github.com/seguijoaquin/taller2-sharedserver/issues/53)
- Listar intereses disponibles al querer dar de alta un usuario via web [\#52](https://github.com/seguijoaquin/taller2-sharedserver/issues/52)
- Error al listar usuarios sin intereses [\#50](https://github.com/seguijoaquin/taller2-sharedserver/issues/50)
- Se espera un campo AGE y se obtiene un campo EDAD [\#49](https://github.com/seguijoaquin/taller2-sharedserver/issues/49)
- Error al actualizar una foto via web [\#48](https://github.com/seguijoaquin/taller2-sharedserver/issues/48)
- Error al dar de alta un usuario via web [\#47](https://github.com/seguijoaquin/taller2-sharedserver/issues/47)
- Al correr las pruebas en docker crashea [\#45](https://github.com/seguijoaquin/taller2-sharedserver/issues/45)
- Crash al dar de alta un interes [\#44](https://github.com/seguijoaquin/taller2-sharedserver/issues/44)
- Error al listar usuarios [\#43](https://github.com/seguijoaquin/taller2-sharedserver/issues/43)
- Actualizar foto de usuario no funciona [\#36](https://github.com/seguijoaquin/taller2-sharedserver/issues/36)
- Los usuarios se repiten [\#28](https://github.com/seguijoaquin/taller2-sharedserver/issues/28)
- Mostrar los intereses de cada usuario al listar usuarios [\#26](https://github.com/seguijoaquin/taller2-sharedserver/issues/26)

**Closed issues:**

- Normalizar alta de intereses a minuscula [\#61](https://github.com/seguijoaquin/taller2-sharedserver/issues/61)
- Servicio para obtener lista de categorías [\#58](https://github.com/seguijoaquin/taller2-sharedserver/issues/58)
- Buscar un usuario por ID [\#40](https://github.com/seguijoaquin/taller2-sharedserver/issues/40)
- Listar intereses por interfaz web [\#39](https://github.com/seguijoaquin/taller2-sharedserver/issues/39)
- Listar usuarios por interfaz web [\#37](https://github.com/seguijoaquin/taller2-sharedserver/issues/37)
- Incluir un template de bootstrap para la pagina de inicio [\#35](https://github.com/seguijoaquin/taller2-sharedserver/issues/35)
- Boton Enviar para dar de alta un usuario [\#34](https://github.com/seguijoaquin/taller2-sharedserver/issues/34)
- Linkear los botones de index con cada una de las paginas html [\#33](https://github.com/seguijoaquin/taller2-sharedserver/issues/33)
- Implementar cliente web con bootstrap [\#16](https://github.com/seguijoaquin/taller2-sharedserver/issues/16)
- Setear las tablas de las base de datos local \(usando Docker\) para las pruebas [\#12](https://github.com/seguijoaquin/taller2-sharedserver/issues/12)

## [v1.0.1](https://github.com/seguijoaquin/taller2-sharedserver/tree/v1.0.1) (2016-06-05)
[Full Changelog](https://github.com/seguijoaquin/taller2-sharedserver/compare/v1.0.0...v1.0.1)

**Implemented enhancements:**

- Refactorizar db\_handler con returns [\#29](https://github.com/seguijoaquin/taller2-sharedserver/issues/29)
- Agregar funcionalidad para manejar la edad [\#27](https://github.com/seguijoaquin/taller2-sharedserver/issues/27)
- Modificar modulo de constantes e incluirlo en db\_handler [\#25](https://github.com/seguijoaquin/taller2-sharedserver/issues/25)
- Refactor db\_handler con manejo de errores mas prolijo y merge con master [\#24](https://github.com/seguijoaquin/taller2-sharedserver/issues/24)
- Verificar que los intereses de un usuario existan [\#23](https://github.com/seguijoaquin/taller2-sharedserver/issues/23)
- Unificar reporte de errores en modulo users.js [\#22](https://github.com/seguijoaquin/taller2-sharedserver/issues/22)
- Unificar el reporte de errores [\#20](https://github.com/seguijoaquin/taller2-sharedserver/issues/20)
- Implementar alta de intereses [\#19](https://github.com/seguijoaquin/taller2-sharedserver/issues/19)
- Implementar listado de intereses [\#18](https://github.com/seguijoaquin/taller2-sharedserver/issues/18)
- Actualizar Readme [\#17](https://github.com/seguijoaquin/taller2-sharedserver/issues/17)
- Merge branch feature\_modularizar\_DB [\#14](https://github.com/seguijoaquin/taller2-sharedserver/issues/14)
- Abstraer el llamado de funciones callbacks al procesar un request a la base de datos [\#11](https://github.com/seguijoaquin/taller2-sharedserver/issues/11)
- Modularizar el manejo de archivos JSON [\#10](https://github.com/seguijoaquin/taller2-sharedserver/issues/10)
- Modularizar las llamadas a la base de datos [\#9](https://github.com/seguijoaquin/taller2-sharedserver/issues/9)
- Validar unicidad de usuarios por email ante un alta [\#3](https://github.com/seguijoaquin/taller2-sharedserver/issues/3)

**Fixed bugs:**

- getUser con usuario inexistente devuelve 200 [\#32](https://github.com/seguijoaquin/taller2-sharedserver/issues/32)
- El alta de un usuario devuelve un status code 200 [\#30](https://github.com/seguijoaquin/taller2-sharedserver/issues/30)
- Listar intereses no devuelve los campos category y value [\#21](https://github.com/seguijoaquin/taller2-sharedserver/issues/21)
- Modificación de la estructura de la DB para facilitar consultas [\#7](https://github.com/seguijoaquin/taller2-sharedserver/issues/7)

**Closed issues:**

- Funcionalidad para actulizar la foto de perfil de un usuario [\#15](https://github.com/seguijoaquin/taller2-sharedserver/issues/15)
- Crear un Docker con el shared y una base de postgre local para hacer las pruebas. [\#8](https://github.com/seguijoaquin/taller2-sharedserver/issues/8)

## [v1.0.0](https://github.com/seguijoaquin/taller2-sharedserver/tree/v1.0.0) (2016-04-28)
**Implemented enhancements:**

- Unificar la conexión a la DB en un módulo aparte [\#5](https://github.com/seguijoaquin/taller2-sharedserver/issues/5)
- Validar que la tabla de la DB se encuentre creada ante un alta de usuario [\#4](https://github.com/seguijoaquin/taller2-sharedserver/issues/4)
- Implementación de api Rest [\#1](https://github.com/seguijoaquin/taller2-sharedserver/issues/1)

**Fixed bugs:**

- Crash cuando se consulta por un usuario inexistente [\#2](https://github.com/seguijoaquin/taller2-sharedserver/issues/2)



\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*