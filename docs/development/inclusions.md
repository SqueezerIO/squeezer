### Inclusions

#### Why the use of `inclusions` are required ?

Well , even if Squeezer tries to simulates as best it can the trivial projects by sharing one component
to other it needs some help on getting the standard initial purpose for a microservice by 
 being separated from all other things in the project. Everything happens at the microservice folder level , that's checksuming,
compiling, and testing.

Usually when you want to include some files or directories from outside of your current
microservice's directory . 

Example :

**<font color="red">WRONG</font> usage :**

`MICROSERVICE_DIR/handler.js`

```javascript
'use strict';

const http      = require('../../../lib/http');
```

This will cause **2** issues :
  - it may cause compilation errors as the compiling process happens in the `PROJECT_DIR/.build` directory and your path routing will be different 
  - checksuming, the feature which is responsible for compiling and deploying only the microservices where code changed it will be affected because 
  the checksums are calculated only at the microservice folder level


**<font color="green">CORRECT</font> usage :**

`sqz.config.yml` 

```yaml
inclusions:
  - src: lib/http
    dest: lib/http
    packaging: false
#  - src: data.xml
#    dest: data.xml
#    packaging: true    
```

```javascript
'use strict';

const http = require('inclusions/lib/http');
```


On this example your directory `PROJECT_DIR/lib/http` will be linked to your
`MICROSERVICE_DIR/src/inclusions/lib/http` and packaged accordingly to the option `packaging` if `false` the inclusion will be used
only for compiling the source code and if `true`  it means that it will be included in the microservice's *.zip package for later usage 
on the cloud environment.

#### Do I need to add the inclusions manually ?

No. Squeezer handles inclusions automatically for you, just add them to `sqz.config.yml`  


### Conclusion

`Inclusions` feature should be used every time when you want to interact with a resource that is not
stored inside of your microservice's folder 
