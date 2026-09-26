param(
	[Parameter(Mandatory = $true)]
	[string]$InputPath,

	[Parameter(Mandatory = $true)]
	[string]$OutputPath
)

$ErrorActionPreference = "Stop"

function Clean-Cell([object]$Value) {
	if ($null -eq $Value) {
		return ""
	}

	return ([string]$Value -replace "\p{Cf}", "" -replace "[\r\n]+", " " -replace "\s{2,}", " ").Trim()
}

function Convert-Time([string]$Time) {
	$cleaned = Clean-Cell $Time
	if ([string]::IsNullOrWhiteSpace($cleaned)) {
		return ""
	}

	$convertedSlots = foreach ($slot in ($cleaned -split ",")) {
		$trimmedSlot = $slot.Trim()
		if ($trimmedSlot -match "^(\d{1,2})(?::(\d{2}))?\s*([ap])?\s*-\s*(\d{1,2})(?::(\d{2}))?\s*([ap])?$" ) {
			$startHour = [int]$Matches[1]
			$startMinute = if ($Matches[2]) { [int]$Matches[2] } else { 0 }
			$startPeriod = $Matches[3]
			$endHour = [int]$Matches[4]
			$endMinute = if ($Matches[5]) { [int]$Matches[5] } else { 0 }
			$endPeriod = $Matches[6]

			# If only one side has an AM/PM marker, apply it to both endpoints.
			if (-not $startPeriod) { $startPeriod = $endPeriod }
			if (-not $endPeriod) { $endPeriod = $startPeriod }

			if ($startPeriod -eq "p" -and $startHour -lt 12) { $startHour += 12 }
			if ($startPeriod -eq "a" -and $startHour -eq 12) { $startHour = 0 }
			if ($endPeriod -eq "p" -and $endHour -lt 12) { $endHour += 12 }
			if ($endPeriod -eq "a" -and $endHour -eq 12) { $endHour = 0 }

			"{0:D2}:{1:D2}-{2:D2}:{3:D2}" -f $startHour, $startMinute, $endHour, $endMinute
		} else {
			$trimmedSlot
		}
	}

	return $convertedSlots -join ","
}

$rows = @(Import-Csv -LiteralPath $InputPath -Encoding UTF8)
if ($rows.Count -eq 0) {
	throw "The input CSV contains no tutor rows."
}

$blurbHeader = $rows[0].PSObject.Properties.Name |
	Where-Object { $_ -like "Let's get to know you!*" } |
	Select-Object -First 1

$facebookHeader = $rows[0].PSObject.Properties.Name |
	Where-Object { $_ -like "Facebook Profile Name*" } |
	Select-Object -First 1

$converted = foreach ($row in $rows) {
	[ordered]@{
		"First Name" = Clean-Cell $row."First Name"
		"Last Name" = Clean-Cell $row."Last Name"
		"IMSA Email (name1@imsa.edu)" = (Clean-Cell $row."IMSA Email").ToLowerInvariant()
		"IMSA ID (12xxxx)" = Clean-Cell $row."IMSA ID #"
		"Hall" = Clean-Cell $row.Hall
		"Wing" = (Clean-Cell $row.Wing).ToUpperInvariant()
		"Facebook Name (First and Last name exactly how it appears on facebook)" = Clean-Cell $row.$facebookHeader
		"Short Blurb about yourself (400 characters max)" = Clean-Cell $row.$blurbHeader
		"Upload an image of yourself. Ideally, this is the same image as your Facebook profile photo so that students can easily contact you." = Clean-Cell $row."Pic upload"
		"Physics Courses" = Clean-Cell $row.Physics
		"Chemistry Courses" = Clean-Cell $row.Chemistry
		"Biology Courses" = Clean-Cell $row.Biology
		"Other Science Courses" = Clean-Cell $row."Other Courses"
		"Core Math Courses" = Clean-Cell $row."Core Math"
		"Non-Core Math Courses" = Clean-Cell $row."Other Math"
		"Computer Science Courses" = Clean-Cell $row."Computer Science"
		"World Language Courses" = Clean-Cell $row.Language
		"Sunday availability:" = Convert-Time $row.Sunday
		"Monday availability:" = Convert-Time $row.Monday
		"Tuesday availability:" = Convert-Time $row.Tuesday
		"Wednesday availability:" = Convert-Time $row.Wednesday
		"Thursday availability:" = Convert-Time $row.Thursday
		"Friday availability:" = ""
		"Saturday availability:" = ""
	}
}

$csvText = $converted | ForEach-Object { [pscustomobject]$_ } | ConvertTo-Csv -NoTypeInformation
$resolvedOutput = [System.IO.Path]::GetFullPath($OutputPath)
$utf8WithoutBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllLines($resolvedOutput, $csvText, $utf8WithoutBom)

Write-Output "Converted $($converted.Count) tutor rows to $resolvedOutput"
