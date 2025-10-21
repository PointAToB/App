# Used to revert ejected prebuild of expo back to expoGo.

function deleteFolder {
  param (
    [string]$path
  )

  if (Test-Path $path) { Remove-Item -Recurse -Force $path }
}

#deleteFolder -path './ios'
#deleteFolder -path './android'
deleteFolder -path './.expo'
deleteFolder -path './.expo-shared'
deleteFolder -path './node_modules'

npm install