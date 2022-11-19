<#

This script run through the list items adding the specific role if the field match the desired value.
It also Create a log file.

#>

$SiteUrl = "https://xxxxxxx.sharepoint.com/sites/FinApp/"
$ListName = "Carga de Dados"
$Group = "Visitantes"
$Role = "ReadOnly"
$outfile = "C:\LogScript.txt"
$logs  = @()

Connect-PnPOnline -Url $SiteUrl -UseWebLogin
$list = Get-PnPList -Identity $ListName  

Get-PnPListItem -List $list -PageSize 100 -ScriptBlock {
    Param($items)
    
    $items | Where-Object { $_.FieldValues["Document Type"].LookupValue -eq "Publico" } | ForEach-Object {
        try {
            Set-PnPListItemPermission -List $list -Identity $_.Id -Group $Group  -AddRole $Role 
            $logs += "Success ID $($_.Id)"
        }
        catch {
            $logs += "Object Fail: $($_.Id)"
            $logs.Add($_.ErrorDetails)
        }
    }

    if ($logs.Length -gt 0) {
        Get-Date >> $outfile
        $logs >> $outfile
        Write-Host "Creating File"
        $logs.Clear()
    }
}


