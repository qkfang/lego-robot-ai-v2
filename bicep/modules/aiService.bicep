param location string = resourceGroup().location
param speechServiceName string
param translatorServiceName string

resource speechService 'Microsoft.CognitiveServices/accounts@2021-04-30' = {
  name: speechServiceName
  location: location
  kind: 'SpeechServices'
  sku: {
    name: 'S0'
  }
  properties: {
    apiProperties: {
      qnaRuntimeEndpoint: 'https://{speechServiceName}.api.cognitive.microsoft.com'
    }
  }
}

resource translatorService 'Microsoft.CognitiveServices/accounts@2021-04-30' = {
  name: translatorServiceName
  location: location
  kind: 'TextTranslation'
  sku: {
    name: 'S1'
  }
  properties: {
    apiProperties: {
      qnaRuntimeEndpoint: 'https://{translatorServiceName}.api.cognitive.microsoft.com'
    }
  }
}

output speechServiceEndpoint string = speechService.properties.endpoint
output translatorServiceEndpoint string = translatorService.properties.endpoint
