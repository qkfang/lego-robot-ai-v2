param location string = resourceGroup().location
param projectName string = 'legoaibot'
param environment string = 'dev'
param mongoDbUserName string = 'dev'
param mongoDbPassword string = 'psw'

var rgName = 'rg-${projectName}'
var subIdShared_Search = '519f48c0-e1f2-4724-92e8-0741c9645315' // biz5/9 
var subIdShared_Asp = '1b4c524f-bf60-425c-893e-1c969ef3c7c1' // core7
var subIdShared_MongoDb = 'd1a91831-8178-4e66-8d95-3268758d4d33' // core2


/* *************************************************************** */
/* Logging and instrumentation */
/* *************************************************************** */

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: '${projectName}-${environment}-loganalytics'
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${projectName}-${environment}-appinsights'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
  }
}


resource keyVault 'Microsoft.KeyVault/vaults@2024-04-01-preview' = {
  name: '${projectName}-${environment}-kv'
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    accessPolicies: []
  }
}



// deploy azure ai search
module aiSearch 'modules/aiSearch.bicep' = {
  name: 'aiSearch'
  scope: resourceGroup(subIdShared_Search, rgName)
  params: {
    location: location
    environment: environment
    projectName: projectName
    logicAppPrincipalId: logicApp.outputs.principalId
  }
}

// deploy azure openai service
module openAi 'modules/openAi.bicep' = {
  name: 'openAi'
  params: {
    location: 'eastus2'
    environment: environment
    projectName: projectName
    logicAppPrincipalId: logicApp.outputs.principalId
  }
}


// deploy storage account
resource storageAccount 'Microsoft.Storage/storageAccounts@2021-04-01' = {
  name: '${projectName}${environment}sa'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
    allowBlobPublicAccess: true
  }
}


// Define a list of container names
var containerNames = [
  'legoaibot-flldoc'
  'legoaibot-ffl2024'
  'legoaibot-sp3doc'
  'legoaibot-sp3api'
  'legoaibot-sp3code'
  'legoaibot-sp3snippet'
]

// Loop through the list to create the containers
resource containers 'Microsoft.Storage/storageAccounts/blobServices/containers@2021-04-01' = [for name in containerNames: {
  name: '${storageAccount.name}/default/${name}'
  properties: {
    publicAccess: 'None'
  }
}]

resource containersBrickImg 'Microsoft.Storage/storageAccounts/blobServices/containers@2021-04-01' = {
  name: '${storageAccount.name}/default/legoaibot-brickimg'
  properties: {
    publicAccess: 'Blob'
  }
}


// resource legoaibot_images 'Microsoft.Storage/storageAccounts/blobServices/containers@2021-04-01' = {
//   name: '${storageAccount.name}/default/legoaibot-images'
//   properties: {
//     publicAccess: 'None'
//   }
// }


// deploy azure logic app
module logicApp 'modules/logicApp.bicep' = {
  name: 'logicApp'
  scope: resourceGroup(subIdShared_Asp, rgName)
  params: {
    location: location
    environment: environment
    projectName: projectName
    storageAccountConnectionString: 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};EndpointSuffix=core.windows.net;AccountKey=${listKeys(storageAccount.id, '2021-04-01').keys[0].value}'
    appInsightsId: appInsights.id
  }
}


// Assign Contributor role to Logic App for AI Search, OpenAI, and Storage Account
resource logicAppContributorRoleAssignment 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name: guid(subscription().id, logicApp.name, 'ba92f5b4-2d11-453d-a403-e96b0029c9fe') // Contributor role ID
  scope: storageAccount
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'ba92f5b4-2d11-453d-a403-e96b0029c9fe') // Contributor role ID
    principalId: logicApp.outputs.principalId
  }
}


param cosmosDatabaseName string = 'mobile'
module cosmodDb 'modules/cosmosdb.bicep' = {
  name: 'sql'
  params: {
    location: 'eastus2'
    accountName: '${projectName}-${environment}-cosmos'
    databaseName: cosmosDatabaseName
  }
}


module aiService 'modules/aiService.bicep' = {
  name: 'aiService'
  params: {
    location: location
    speechServiceName: '${projectName}-${environment}-speech'
    translatorServiceName: '${projectName}-${environment}-trans'
  }
}


// deploy APIM instance with legoaibot API
module apim 'modules/apim.bicep' = {
  name: 'apim'
  params: {
    location: location
    environment: environment
    projectName: projectName
  }
}



/* *************************************************************** */
/* App Plan Hosting - Azure App Service Plan */
/* *************************************************************** */
resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: '${projectName}-${environment}-linux-asp'
  location: location
  sku: {
    name: 'B1'
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}


/* *************************************************************** */
/* Front-end Web App Hosting - Azure App Service */
/* *************************************************************** */

resource appServiceWeb 'Microsoft.Web/sites@2022-03-01' = {
  name: '${projectName}-${environment}-web'
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|20-lts'
      appCommandLine: 'pm2 serve /home/site/wwwroot --no-daemon --spa'
      alwaysOn: true
    }
  }
}

resource appServiceWebSettings 'Microsoft.Web/sites/config@2022-03-01' = {
  parent: appServiceWeb
  name: 'appsettings'
  kind: 'string'
  properties: {
    APPINSIGHTS_INSTRUMENTATIONKEY: appInsights.properties.InstrumentationKey
    // API_ENDPOINT: 'https://${backendApiContainerApp.properties.configuration.ingress.fqdn}'
  }
}



/* *************************************************************** */
/* Registry for Back-end API Image - Azure Container Registry */
/* *************************************************************** */
resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-01-01-preview' = {
  name: '${projectName}${environment}acr'
  location: location
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: true
  }
}

/* *************************************************************** */
/* Container environment - Azure Container App Environment  */
/* *************************************************************** */
resource containerAppEnvironment 'Microsoft.App/managedEnvironments@2023-05-01' = {
  name: '${projectName}-${environment}-cae'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalytics.properties.customerId
        sharedKey: logAnalytics.listKeys().primarySharedKey
      }
    }
    workloadProfiles: [
      {
        name: 'Warm'
        minimumCount: 1
        maximumCount: 10
        workloadProfileType: 'D4'
      }
    ]
    infrastructureResourceGroup: 'ME_${resourceGroup().name}'
  }
}

/* *************************************************************** */
/* Back-end API App Application - Azure Container App */
/* deploys default hello world */
/* *************************************************************** */
resource backendApiContainerApp 'Microsoft.App/containerApps@2024-10-02-preview' = {
  name: '${projectName}-${environment}-api'
  location: location
  properties: {
    environmentId: containerAppEnvironment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 80
        allowInsecure: false
        traffic: [
          {
            latestRevision: true
            weight: 100
          }
        ]   
        corsPolicy: {
          allowCredentials: false
          allowedHeaders: [
            '*'
          ]
          allowedOrigins: [
            '*'
          ]
        }
      }
      registries: [
        {
          server: containerRegistry.properties.loginServer
          username: containerRegistry.name
          passwordSecretRef: 'container-registry-password'
        }
      ]
      secrets: [
        {
          name: 'container-registry-password'
          value: containerRegistry.listCredentials().passwords[0].value
        }
      ]
    }
    template: {
      containers: [
        {
          name: '${projectName}-${environment}-api'
          image: '${containerRegistry.name}.azurecr.io/legoaibot-api:v6'
          resources: {
            cpu: 1
            memory: '2Gi'
          }         
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
    }
  }
}



resource backendApiContainerAppRT 'Microsoft.App/containerApps@2024-10-02-preview' = {
  name: '${projectName}-${environment}-api-rt'
  location: location
  properties: {
    environmentId: containerAppEnvironment.id
    configuration: {
      ingress: {
        external: true
        targetPort: 80
        allowInsecure: false
        traffic: [
          {
            latestRevision: true
            weight: 100
          }
        ]   
        corsPolicy: {
          allowCredentials: false
          allowedHeaders: [
            '*'
          ]
          allowedOrigins: [
            '*'
          ]
        }
      }
      registries: [
        {
          server: containerRegistry.properties.loginServer
          username: containerRegistry.name
          passwordSecretRef: 'container-registry-password'
        }
      ]
      secrets: [
        {
          name: 'container-registry-password'
          value: containerRegistry.listCredentials().passwords[0].value
        }
      ]
    }
    template: {
      containers: [
        {
          name: '${projectName}-${environment}-api-rt'
          image: '${containerRegistry.name}.azurecr.io/legoaibot-api-rt:v8'
          resources: {
            cpu: 1
            memory: '2Gi'
          }         
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 1
      }
    }
  }
}


resource formRecognizer 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: '${projectName}-${environment}-form'
  location: location
  kind: 'FormRecognizer'
  properties: {
    customSubDomainName: '${projectName}-${environment}-form'
    publicNetworkAccess: 'Enabled'
  }
  sku: {
    name: 'S0'
  }
}

resource computerVision 'Microsoft.CognitiveServices/accounts@2023-05-01' = {
  name: '${projectName}-${environment}-cv'
  location: location
  kind: 'ComputerVision'
  properties: {
    customSubDomainName: '${projectName}-${environment}-cv'
    publicNetworkAccess: 'Enabled'
  }
  sku: {
    name: 'S1'
  }
}

// deploy azure logic app
module mongodb 'modules/mongodb.bicep' = {
  name: 'mongodb'
  scope: resourceGroup(subIdShared_MongoDb, rgName)
  params: {
    location: location
    environment: environment
    projectName: projectName
    mongoDbUserName: mongoDbUserName
    mongoDbPassword: mongoDbPassword
  }
}


module mongodbru 'modules/mongodbru.bicep' = {
  name: 'mongodbru'
  scope: resourceGroup(subIdShared_MongoDb, rgName)
  params: {
    location: location
    environment: environment
    projectName: projectName
  }
}
