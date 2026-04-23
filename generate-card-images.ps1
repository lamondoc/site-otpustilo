# Генерирует локальные JPG для карточек и фона секции «Услуги» (без интернета).
# Запуск из корня проекта: powershell -ExecutionPolicy Bypass -File tools\generate-card-images.ps1

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$imgDir = Join-Path $root "images"
New-Item -ItemType Directory -Force -Path $imgDir | Out-Null

Add-Type -AssemblyName System.Drawing

function New-CardJpeg([string]$path, [Drawing.Color]$c1, [Drawing.Color]$c2, [Drawing.Color]$accent) {
  $w, $h = 800, 520
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = "HighQuality"
  $r1 = [Drawing.Rectangle]::new(0, 0, $w, $h)
  $br = New-Object Drawing.Drawing2D.LinearGradientBrush $r1, $c1, $c2, 45.0
  $g.FillRectangle($br, $r1)
  $br.Dispose()
  $pathGr = New-Object Drawing.Drawing2D.GraphicsPath
  $pathGr.AddEllipse([int](-$w * 0.2), [int](-$h * 0.15), [int]($w * 1.4), [int]($h * 0.9))
  $pthBr = New-Object Drawing.Drawing2D.PathGradientBrush $pathGr
  $pthBr.CenterColor = [Drawing.Color]::FromArgb(40, $accent.R, $accent.G, $accent.B)
  $pthBr.SurroundColors = @([Drawing.Color]::FromArgb(0, 15, 20, 18))
  $g.FillPath($pthBr, $pathGr)
  $pthBr.Dispose(); $pathGr.Dispose()
  $orb = New-Object Drawing.Drawing2D.GraphicsPath
  $cx = [int]($w * 0.72); $cy = [int]($h * 0.28)
  $orb.AddEllipse($cx - 140, $cy - 100, 280, 200)
  $ob = New-Object Drawing.Drawing2D.PathGradientBrush $orb
  $ob.CenterColor = [Drawing.Color]::FromArgb(55, 255, 248, 235)
  $ob.SurroundColors = @([Drawing.Color]::FromArgb(0, 30, 40, 36))
  $g.FillPath($ob, $orb)
  $ob.Dispose(); $orb.Dispose()
  $bmp.Save($path, [Drawing.Imaging.ImageFormat]::Jpeg)
  $g.Dispose(); $bmp.Dispose()
}

$cWarm1 = [Drawing.Color]::FromArgb(255, 35, 42, 38)
$cWarm2 = [Drawing.Color]::FromArgb(255, 18, 24, 21)
$cCool1 = [Drawing.Color]::FromArgb(255, 28, 38, 34)
$cCool2 = [Drawing.Color]::FromArgb(255, 14, 22, 19)
$accentGold = [Drawing.Color]::FromArgb(255, 196, 165, 116)

New-CardJpeg (Join-Path $imgDir "card-massage.jpg") $cWarm1 $cWarm2 $accentGold
New-CardJpeg (Join-Path $imgDir "card-acupuncture.jpg") $cCool1 $cCool2 ([Drawing.Color]::FromArgb(255, 180, 200, 190))
New-CardJpeg (Join-Path $imgDir "card-lfk.jpg") $cWarm2 $cCool1 ([Drawing.Color]::FromArgb(255, 140, 170, 155))
New-CardJpeg (Join-Path $imgDir "card-face.jpg") ([Drawing.Color]::FromArgb(255, 42, 38, 40)) ([Drawing.Color]::FromArgb(255, 22, 20, 24)) ([Drawing.Color]::FromArgb(255, 220, 200, 185))

$wb, $hb = 1920, 1080
$bg = New-Object System.Drawing.Bitmap $wb, $hb
$gg = [System.Drawing.Graphics]::FromImage($bg)
$rr = [Drawing.Rectangle]::new(0, 0, $wb, $hb)
$bgb = New-Object Drawing.Drawing2D.LinearGradientBrush $rr, ([Drawing.Color]::FromArgb(255, 20, 28, 24)), ([Drawing.Color]::FromArgb(255, 10, 14, 12)), 90.0
$gg.FillRectangle($bgb, $rr)
$bgb.Dispose()
$orb2 = New-Object Drawing.Drawing2D.GraphicsPath
$orb2.AddEllipse([int]($wb * 0.25 - 200), -120, 900, 480)
$o2 = New-Object Drawing.Drawing2D.PathGradientBrush $orb2
$o2.CenterColor = [Drawing.Color]::FromArgb(45, 196, 165, 116)
$o2.SurroundColors = @([Drawing.Color]::FromArgb(0, 15, 20, 18))
$gg.FillPath($o2, $orb2)
$o2.Dispose(); $orb2.Dispose()
$bg.Save((Join-Path $imgDir "services-bg.jpg"), [Drawing.Imaging.ImageFormat]::Jpeg)
$gg.Dispose(); $bg.Dispose()

Write-Host "Готово:" (Get-ChildItem $imgDir -Filter "*.jpg" | ForEach-Object { $_.Name })
