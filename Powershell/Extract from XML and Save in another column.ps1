<#

   This script run through the list items getting values from a field containing encoded XML values
and saving these items in another field without changing the modified date


#>

$SiteUrl = "https://xxxxxxx.sharepoint.com/sites/FinApp/"
$ListRef = "Lists/List%20Name"



$global:counter = 0;

Connect-PnPOnline -Url $SiteUrl -UseWebLogin
$List = Get-PnPList $ListRef


Write-Host "Start Time"
Get-Date

$ListItems = Get-PnPListItem -List $ListRef -PageSize 10 -Fields "Title", "Repeater01" -ScriptBlock {
   Param($items)
   $items.Context.ExecuteQuery();
   $global:counter += $items.Count;

   ## Iterate through list items 
   forEach ($item in $items) {
       ## Convert field value to XML
       $repeater01XML = [xml]$item["Repeater01"]

       ## Changes the values without changing modified date.
       Set-PnPListItem -List $ListRef -Id $item.Id -Values @{
           "Destinatination Column"       = if ( $repeater01XML.RepeaterData.Items.Item.OriginValue.'#text'.length -gt 1) { 
               [System.Web.HttpUtility]::HtmlDecode([String]::Join(";", $repeater01XML.RepeaterData.Items.Item.OriginValue.'#text'))
           }
           elseif ( $repeater01XML.RepeaterData.Items.Item.OriginValue.'#text'.length -eq 1 ) { 
               [System.Web.HttpUtility]::HtmlDecode($repeater01XML.RepeaterData.Items.Item.OriginValue.'#text')
           }; 
       } -UpdateType "SystemUpdate" 
   }

   ## Showing Progress Bar
   Write-Progress -PercentComplete ($global:Counter / ($List.ItemCount) * 100) -Activity "Getting List Items of '$($List.Title)'" -Status "Processing Items $global:Counter to $($List.ItemCount)";

}

Get-Date
