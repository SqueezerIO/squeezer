### Azure Resource Manager templates

Azure Resource Manager enables you to work with the resources in your solution as a group. You can deploy, update, or delete all the resources for your solution in a single, coordinated operation. You use a template for deployment and that template can work for different environments such as testing, staging, and production. Resource Manager provides security, auditing, and tagging features to help you manage your resources after deployment.

[More details](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview)

`PROJECT_DIR/armTemplates/azuredeploy.json` :

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "functionAppName": {
      "type": "string",
      "metadata": {
        "description": "The name of the function app that you wish to create."
      }
    },
    "storageAccountType": {
      "type": "string",
      "defaultValue": "Standard_LRS",
      "allowedValues": [
        "Standard_LRS",
        "Standard_GRS",
        "Standard_ZRS",
        "Premium_LRS"
      ],
      "metadata": {
        "description": "Storage Account type"
      }
    }
  },
  "variables": {
    "functionAppName": "[parameters('functionAppName')]",
    "hostingPlanName": "[parameters('functionAppName')]",
    "insightsName": "[concat(parameters('functionAppName'), '-insights')]",
    "storageAccountName": "[concat(uniquestring(resourceGroup().id), 'azfunctions')]",
    "storageAccountid": "[concat(resourceGroup().id,'/providers/','Microsoft.Storage/storageAccounts/', variables('storageAccountName'))]"
  },
  "resources": [
    {
      "type": "microsoft.insights/components",
      "kind": "Node.JS",
      "name": "[variables('insightsName')]",
      "apiVersion": "2014-04-01",
      "location": "eastus",
      "properties": {
        "ApplicationId": "[variables('insightsName')]"
      }
    },
    {
      "type": "Microsoft.Storage/storageAccounts",
      "name": "[variables('storageAccountName')]",
      "apiVersion": "2015-06-15",
      "location": "[resourceGroup().location]",
      "properties": {
        "accountType": "[parameters('storageAccountType')]"
      }
    },
    {
      "type": "Microsoft.Web/serverfarms",
      "apiVersion": "2015-04-01",
      "name": "[variables('hostingPlanName')]",
      "location": "[resourceGroup().location]",
      "properties": {
        "name": "[variables('hostingPlanName')]",
        "computeMode": "Dynamic",
        "sku": "Dynamic"
      }
    },
    {
      "apiVersion": "2015-08-01",
      "type": "Microsoft.Web/sites",
      "name": "[variables('functionAppName')]",
      "location": "[resourceGroup().location]",
      "kind": "functionapp",
      "dependsOn": [
        "[resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName'))]",
        "[resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName'))]",
        "[resourceId('Microsoft.insights/components', variables('insightsName'))]"
      ],
      "properties": {
        "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName'))]",
        "siteConfig": {
          "appSettings": [
            {
              "name": "APPINSIGHTS_INSTRUMENTATIONKEY",
              "value": "[reference(variables('insightsName')).InstrumentationKey]"
            },
            {
              "name": "AzureWebJobsDashboard",
              "value": "[concat('DefaultEndpointsProtocol=https;AccountName=', variables('storageAccountName'), ';AccountKey=', listKeys(variables('storageAccountid'),'2015-05-01-preview').key1)]"
            },
            {
              "name": "AzureWebJobsStorage",
              "value": "[concat('DefaultEndpointsProtocol=https;AccountName=', variables('storageAccountName'), ';AccountKey=', listKeys(variables('storageAccountid'),'2015-05-01-preview').key1)]"
            },
            {
              "name": "FUNCTIONS_EXTENSION_VERSION",
              "value": "~1"
            },
            {
              "name": "WEBSITE_CONTENTAZUREFILECONNECTIONSTRING",
              "value": "[concat('DefaultEndpointsProtocol=https;AccountName=', variables('storageAccountName'), ';AccountKey=', listKeys(variables('storageAccountid'),'2015-05-01-preview').key1)]"
            },
            {
              "name": "WEBSITE_CONTENTSHARE",
              "value": "[toLower(variables('functionAppName'))]"
            },
            {
              "name": "WEBSITE_NODE_DEFAULT_VERSION",
              "value": "6.5.0"
            },
            {
              "name": "STORAGE_ACCOUNT_NAME",
              "value": "[variables('storageAccountName')]"
            }
          ]
        }
      },
      "resources": [
        {
          "apiVersion": "2015-04-01",
          "name": "web",
          "type": "config",
          "dependsOn": [
            "[resourceId('Microsoft.Web/Sites', variables('functionAppName'))]"
          ],
          "properties": {
            "cors": {
              "allowedOrigins": [
                "*"
              ],
              "allowedHeaders": [
                "*"
              ],
              "exposedHeaders": [
                "*"
              ]
            }
          }
        }
      ]
    }
  ]
}
```
