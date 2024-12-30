param location string
param projectName string
param environment string

/* *************************************************************** */
/* Azure Cosmos DB for MongoDB vCore */
/* *************************************************************** */
resource CosmosDbAccount 'Microsoft.DocumentDB/databaseAccounts@2022-05-15' = {
  name: '${projectName}-${environment}-mongo-ru'
  kind: 'MongoDB'
  location: location
  properties: {
    locations: [
      {
        locationName: 'East US 2'
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    databaseAccountOfferType: 'Standard'
    isVirtualNetworkFilterEnabled: false
    apiProperties: {
      serverVersion: '6.0'
    }
  }  
  identity: {
    type: 'SystemAssigned'
  }
}

// Database
resource database 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases@2022-05-15-preview' = {
  name: 'legoaibot'
  parent: CosmosDbAccount
  properties: {
    resource: {
      id: 'legoaibot'
    }
  }
}

// Container
resource container 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases/collections@2022-05-15-preview' = {
  name: 'legowebchat'
  parent: database
  properties: {
    resource: {
      id: 'legowebchat'
      indexes: [
        {
          key: {
            keys: [
              '_id'
            ]
          }
        }
      ]
    }
    options: {
      autoscaleSettings: {
        maxThroughput: 1000
      }
    }
  }
}
