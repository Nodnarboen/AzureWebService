$resourceGroupName=$args[0]
$webappname=$args[1]
$location="Central US"

# Create a resource group.
#New-AzResourceGroup -Name $resourceGroupName -Location $location

# Create an App Service plan in `Free` tier.
New-AzAppServicePlan -Name $webappname -Location $location `
-ResourceGroupName $resourceGroupName -Tier Free

# Create a web app.
New-AzWebApp -Name $webappname -Location $location -AppServicePlan $webappname `
-ResourceGroupName $resourceGroupName

# Get publishing profile for the web app
$xml = [xml](Get-AzWebAppPublishingProfile -Name $webappname `
-ResourceGroupName $resourceGroupName `
-OutputFile null)

$CurrentDir = Get-Location
$CurrentDirPath = Join-Path -Path $CurrentDir -ChildPath  "/"  
$FilePath = $CurrentDirPath + "weather-express-app.zip"
Publish-AzWebapp -ResourceGroupName  $resourceGroupName -Name $webappname -ArchivePath $FilePath
