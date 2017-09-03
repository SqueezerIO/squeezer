#### Step 1 - Installing Azure Command Line interface

```
$ npm install -g azure-cli
```

#### Step 2 - Creating a Service Principal

```shell
$ azure login # or $ azure login -u user@domain.tld
$ azure ad sp create -n sp-name -p sp-password
```

This will create a new Service Principal and output the keys, copy the output for
use in your script. Note: you can retrieve the keys later by running
`$ azure ad sp list` in your terminal.

The important fields are marked below (the other required field is the password
that was provided when creating the service principal)

```shell
+ Creating application sp-name
+ Creating service principal for application **56894bd4-0fde-41d8-a0d7-5bsslccety2**
data:    Object Id:               weewrerer-e329-4e9b-98c6-7878787
data:    Display Name:            sp-name
data:    Service Principal Names:
data:                             **56894bd4-0fde-41d8-a0d7-5bsslccety2**
data:                             https://sp-name
info:    ad sp create command OK
```

Next, you'll need to assign a role to the service principal that was just
created. You can get a list of available roles by running `$ azure role list`

_In this example we are creating the service principal as a Contributor at the
subscription level. A contributor role looks like this in the list_
```
data:    Name             : Contributor
data:    Actions          : 0=*
data:    NotActions       : 0=Microsoft.Authorization/*/Delete, 1=Microsoft.Authorization/*/Write
data:    IsCustom         : false
```

This will associate the service principal to your current subscription. Use the
service principal that was returned in the `create` step for the `--spn` option.

```shell
$ azure role assignment create --spn 56894bd4-0fde-41d8-a0d7-5bsslccety2 -o Contributor
info:    Executing command role assignment create
+ Finding role with specified name
data:    RoleAssignmentId     : /subscriptions/abcdefgh-1234-4cc9-89b5-12345678/providers/Microsoft.Authorization/roleAssignments/987654-ea85-40a5-80c2-abcdferghtt
data:    RoleDefinitionName   : Contributor
data:    RoleDefinitionId     : jhfskjf-6180-42a0-ab88-5656eiu677e23e
data:    Scope                : /subscriptions/abcdefgh-1234-4cc9-89b5-12345678
data:    Display Name         : sp-name
data:    SignInName           :
data:    ObjectId             : weewrerer-e329-4e9b-98c6-7878787
data:    ObjectType           : ServicePrincipal
data:
+
info:    role assignment create command OK
```

The service principal can now be used to log in.
```shell
$ azure login -u 56894bd4-0fde-41d8-a0d7-5bsslccety2 -p P@ssw0rd --tenant <a guid OR your domain(contosocorp.com)> --service-principal
info:    Executing command login
info:    Added subscription TestSubscription
+
info:    login command OK
```


#### Step 3 - Adding credentials to the Squeezer project

```
$ sqz config --setting azure_username --value <USERNAME or CLIENT_ID> 
$ sqz config --setting azure_password --value <PASSWORD OR SECRET> 
$ sqz config --setting azure_tenant --value <a guid OR your domain(contosocorp.com)>
$ sqz config --setting azure_location --value <azure region (eastus)>
```
