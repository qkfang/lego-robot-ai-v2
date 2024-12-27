param accountName string
param databaseName string

@description('Location for the Cosmos DB account.')
param location string = resourceGroup().location

param tags object = {}

@allowed(['GlobalDocumentDB', 'MongoDB', 'Parse'])
@description('Sets the kind of account.')
param kind string = 'GlobalDocumentDB'

@description('Enables serverless for this account. Defaults to false.')
param enableServerless bool = true

@description('Enables NoSQL vector search for this account. Defaults to false.')
param enableNoSQLVectorSearch bool = false

@description('Disables key-based authentication. Defaults to false.')
param disableKeyBasedAuth bool = false

param containers array = [
  {
    name: 'fields'
    id: 'fields'
    partitionKey: '/id'
    indexKey: 'id'
  }
  {
    name: 'games'
    id: 'games'
    partitionKey: '/id'
    indexKey: 'id'
  }
]

resource account 'Microsoft.DocumentDB/databaseAccounts@2024-05-15' = {
  name: accountName
  location: location
  kind: kind
  tags: tags
  properties: {
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
    }
    databaseAccountOfferType: 'Standard'
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    publicNetworkAccess: 'Enabled'
    enableAutomaticFailover: false
    enableMultipleWriteLocations: false
    apiProperties: (kind == 'MongoDB')
      ? {
          serverVersion: '7.0'
        }
      : {}
    disableLocalAuth: false
    capabilities: union(
      (enableServerless)
        ? [
            {
              name: 'EnableServerless'
            }
          ]
        : [],
      (kind == 'MongoDB')
        ? [
            {
              name: 'EnableMongo'
            }
          ]
        : [],
      (enableNoSQLVectorSearch)
        ? [
            {
              name: 'EnableNoSQLVectorSearch'
            }
          ]
        : []
    )
  }
}

resource database 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2022-05-15' = {
  parent: account
  name: databaseName
  properties: {
    resource: { id: databaseName }
  }

  resource list 'containers' = [for container in containers: {
    name: container.name
    properties: {
      resource: {
        id: container.id
        partitionKey: { paths: [ container.partitionKey ] }
      }
      options: {}
    }
  }]
}


module databaseAccess './database-access.bicep' = {
  name: '${deployment().name}-database-access'
  params: {
    databaseAccountName: accountName
    principalIds:  [
      // containerApps.outputs.identityPrincipalId
      'a15af93d-4279-4c48-9dfa-513346e54671' // me
    ]
  }
}




resource databaseChat 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2022-05-15' = {
  name: 'chat'
  parent: account
  properties: {
    resource: {
      id: 'chat'
    }
  }
}

resource historyContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2022-05-15' = {
  name: 'history'
  parent: databaseChat
  properties: {
    resource: {
      id: 'history'
      partitionKey: {
        paths: [
          '/userId'
        ]
        kind: 'Hash'
      }
    }
  }
}

resource configContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2022-05-15' = {
  name: 'config'
  parent: databaseChat
  properties: {
    resource: {
      id: 'config'
      partitionKey: {
        paths: [
          '/userId'
        ]
        kind: 'Hash'
      }
    }
  }
}


output name string = account.name
output endpoint string = account.properties.documentEndpoint
output key string = listKeys(account.id, '2024-05-15').primaryMasterKey
