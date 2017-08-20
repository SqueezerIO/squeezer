'use strict';

/**
 * Class that manages the Azure ARM template boilerplate
 */
class AzureARMBase {
  constructor(sqz, microservice) {
    this.sqz = sqz;

    this.microservice = microservice;
  }

  compile() {
    this.stub = {
      $schema        : 'https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#',
      contentVersion : '1.0.0.0',
      parameters     : {},
      variables      : {},
      resources      : [],
      outputs        : {}
    };

    return this.stub;
  }

  addDeploymentStorageAccount() {
    this.stub.parameters.deploymentStorageAccountType = {
      type          : 'string',
      defaultValue  : 'Standard_LRS',
      allowedValues : [
        'Standard_LRS',
        'Standard_GRS',
        'Standard_ZRS',
        'Premium_LRS'
      ],
      metadata      : {
        description : 'Storage Account type'
      }
    };

    this.stub.variables.deploymentStorageAccountName = `[concat(uniquestring(resourceGroup().id), 'squeezer${this.sqz.vars.stage}')]`;

    this.stub.resources.push({
      type       : 'Microsoft.Storage/storageAccounts',
      name       : "[variables('deploymentStorageAccountName')]",
      apiVersion : '2016-01-01',
      location   : '[resourceGroup().location]',
      sku        : {
        name : "[parameters('deploymentStorageAccountType')]"
      },
      kind       : 'Storage',
      properties : {}
    });

    this.stub.outputs.deploymentStorageAccountName = {
      type  : 'string',
      value : "[variables('deploymentStorageAccountName')]"
    };

    return this.stub;
  }
}

module.exports = AzureARMBase;
