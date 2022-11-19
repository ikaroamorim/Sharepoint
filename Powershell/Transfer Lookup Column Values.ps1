<#

   This script run through the list items getting values from a lookup field and saving them in a text or another lookup field according to parameters 

#>

$siteAddress = "https://server-quarto/sites/TeamSite"
$listName = "Documents"
$originLookupColumn = "TestColumn"
$destinationLookupColumn = "DestinoLookup"
$destinationTextColumn = $null

$web = Get-SPWeb $siteAddress
$list = $web.Lists[$listName]
$items = $list.Items

#If the destination field is Lookup
try {
    if ( $null -ne $destinationLookupColumn) {
        $items | ForEach-Object {
            $_[$destinationLookupColumn] = $_[$originLookupColumn]
            $_.Update()
        }
    }
}
catch {
    Write-Error $_
}

#If the destination field is Text
try {
    if ( $null -ne $destinationTextColumn) {
        $items | ForEach-Object {
            $_["ID"]
            $lookup = New-Object Microsoft.SharePoint.SPFieldLookupValue($_[$originLookupColumn])
            $lookup.LookupValue
            $_[$destinationTextColumn] = $lookup.LookupValue
            $_.Update()
        }
    }
}
catch {
    Write-Error $_
}
