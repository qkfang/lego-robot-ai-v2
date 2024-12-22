param location string = resourceGroup().location
param projectName string = 'legoaibot'
param environment string = 'dev'

// deploy azure ai search
module aiSearch 'modules/aiSearch.bicep' = {
  name: 'aiSearch'
  params: {
    location: location
    environment: environment
    projectName: projectName
  }
}

// deploy azure openai service
module openAi 'modules/openAi.bicep' = {
  name: 'openAi'
  params: {
    location: location
    environment: environment
    projectName: projectName
  }
}
