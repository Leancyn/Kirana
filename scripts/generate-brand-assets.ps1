Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root "assets\images"

function New-RoundRectPath {
  param(
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height,
    [float]$Radius
  )

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = $Radius * 2
  $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
  $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
  $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

function Enable-Quality {
  param([System.Drawing.Graphics]$Graphics)
  $Graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $Graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $Graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $Graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
}

function Save-Png {
  param(
    [System.Drawing.Bitmap]$Bitmap,
    [string]$Path
  )
  $Bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $Bitmap.Dispose()
}

function Draw-BrandMark {
  param(
    [System.Drawing.Graphics]$Graphics,
    [int]$Size,
    [bool]$Transparent = $false,
    [bool]$Monochrome = $false
  )

  $teal = [System.Drawing.Color]::FromArgb(31, 111, 104)
  $tealDark = [System.Drawing.Color]::FromArgb(26, 83, 78)
  $cream = [System.Drawing.Color]::FromArgb(249, 250, 247)
  $amber = [System.Drawing.Color]::FromArgb(217, 119, 6)
  $ink = [System.Drawing.Color]::FromArgb(31, 41, 51)

  if (-not $Transparent) {
    $rect = New-Object System.Drawing.Rectangle 0, 0, $Size, $Size
    $bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $teal, $tealDark, 45
    $Graphics.FillRectangle($bgBrush, $rect)
    $bgBrush.Dispose()
  }

  $scale = $Size / 1024.0
  $cx = $Size / 2
  $cy = $Size / 2

  $cardBrush = if ($Monochrome) {
    New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
  } else {
    New-Object System.Drawing.SolidBrush $cream
  }
  $softBrush = if ($Monochrome) {
    New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
  } else {
    New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(232, 242, 239))
  }
  $accentBrush = if ($Monochrome) {
    New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
  } else {
    New-Object System.Drawing.SolidBrush $amber
  }
  $inkBrush = if ($Monochrome) {
    New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::Transparent)
  } else {
    New-Object System.Drawing.SolidBrush $ink
  }
  $tealBrush = if ($Monochrome) {
    New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::Transparent)
  } else {
    New-Object System.Drawing.SolidBrush $teal
  }

  $card = New-RoundRectPath ($cx - 260 * $scale) ($cy - 250 * $scale) (520 * $scale) (500 * $scale) (140 * $scale)
  $Graphics.FillPath($cardBrush, $card)
  $card.Dispose()

  $coinRect = New-Object System.Drawing.RectangleF (($cx + 74 * $scale), ($cy - 184 * $scale), (172 * $scale), (172 * $scale))
  $Graphics.FillEllipse($softBrush, $coinRect)
  $innerCoin = New-Object System.Drawing.RectangleF (($cx + 114 * $scale), ($cy - 144 * $scale), (92 * $scale), (92 * $scale))
  $Graphics.FillEllipse($accentBrush, $innerCoin)

  $stemPen = New-Object System.Drawing.Pen $teal, (48 * $scale)
  $stemPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $stemPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
  if ($Monochrome) {
    $stemPen.Color = [System.Drawing.Color]::White
  }
  $Graphics.DrawLine($stemPen, ($cx - 154 * $scale), ($cy + 150 * $scale), ($cx - 154 * $scale), ($cy - 150 * $scale))
  $Graphics.DrawLine($stemPen, ($cx - 132 * $scale), ($cy + 6 * $scale), ($cx + 94 * $scale), ($cy - 156 * $scale))
  $Graphics.DrawLine($stemPen, ($cx - 118 * $scale), ($cy + 22 * $scale), ($cx + 116 * $scale), ($cy + 160 * $scale))
  $stemPen.Dispose()

  $leaf = New-Object System.Drawing.Drawing2D.GraphicsPath
  $leaf.AddBezier(($cx + 40 * $scale), ($cy + 70 * $scale), ($cx + 140 * $scale), ($cy + 10 * $scale), ($cx + 228 * $scale), ($cy + 70 * $scale), ($cx + 228 * $scale), ($cy + 174 * $scale))
  $leaf.AddBezier(($cx + 228 * $scale), ($cy + 174 * $scale), ($cx + 118 * $scale), ($cy + 170 * $scale), ($cx + 66 * $scale), ($cy + 116 * $scale), ($cx + 40 * $scale), ($cy + 70 * $scale))
  $leaf.CloseFigure()
  $Graphics.FillPath($accentBrush, $leaf)
  $leaf.Dispose()

  $shineBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(80, 255, 255, 255))
  if (-not $Monochrome) {
    $shine = New-RoundRectPath (180 * $scale) (150 * $scale) (210 * $scale) (56 * $scale) (28 * $scale)
    $Graphics.FillPath($shineBrush, $shine)
    $shine.Dispose()
  }

  $cardBrush.Dispose()
  $softBrush.Dispose()
  $accentBrush.Dispose()
  $inkBrush.Dispose()
  $tealBrush.Dispose()
  $shineBrush.Dispose()
}

function New-Icon {
  param([int]$Size, [string]$Path)
  $bitmap = New-Object System.Drawing.Bitmap $Size, $Size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  Enable-Quality $graphics
  Draw-BrandMark $graphics $Size $false $false
  $graphics.Dispose()
  Save-Png $bitmap $Path
}

function New-Foreground {
  param([int]$Size, [string]$Path, [bool]$Monochrome = $false)
  $bitmap = New-Object System.Drawing.Bitmap $Size, $Size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  Enable-Quality $graphics
  $graphics.Clear([System.Drawing.Color]::Transparent)
  Draw-BrandMark $graphics $Size $true $Monochrome
  $graphics.Dispose()
  Save-Png $bitmap $Path
}

function New-Background {
  param([int]$Size, [string]$Path)
  $bitmap = New-Object System.Drawing.Bitmap $Size, $Size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  Enable-Quality $graphics
  $rect = New-Object System.Drawing.Rectangle 0, 0, $Size, $Size
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, ([System.Drawing.Color]::FromArgb(31, 111, 104)), ([System.Drawing.Color]::FromArgb(26, 83, 78)), 45
  $graphics.FillRectangle($brush, $rect)
  $brush.Dispose()
  $graphics.Dispose()
  Save-Png $bitmap $Path
}

New-Icon 1024 (Join-Path $outDir "icon.png")
New-Icon 64 (Join-Path $outDir "favicon.png")
New-Foreground 1024 (Join-Path $outDir "android-icon-foreground.png") $false
New-Background 1024 (Join-Path $outDir "android-icon-background.png")
New-Foreground 1024 (Join-Path $outDir "android-icon-monochrome.png") $true
New-Foreground 1024 (Join-Path $outDir "splash-icon.png") $false

Write-Host "Kirana brand assets generated in $outDir"
