Add-Type -AssemblyName System.Drawing

$files = @("about-me-photo-1.jpg", "about-me-photo-2.jpg")
$targetW = 297 * 3
$targetH = 436 * 3

foreach ($file in $files) {
    $path = Join-Path "c:\cursor-project\images" $file
    if (Test-Path $path) {
        try {
            $img = [System.Drawing.Image]::FromFile($path)
            $srcW = $img.Width
            $srcH = $img.Height
            $targetRatio = $targetW / $targetH
            $srcRatio = $srcW / $srcH

            if ($srcRatio -gt $targetRatio) {
                # Source is wider, crop width
                $cropH = $srcH
                $cropW = [int]($srcH * $targetRatio)
                $x = [int](($srcW - $cropW) / 2)
                $y = 0
            } else {
                # Source is taller, crop height
                $cropW = $srcW
                $cropH = [int]($srcW / $targetRatio)
                $x = 0
                $y = [int](($srcH - $cropH) / 2)
            }

            $bmp = New-Object System.Drawing.Bitmap($targetW, $targetH)
            $g = [System.Drawing.Graphics]::FromImage($bmp)
            $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $g.DrawImage($img,
                (New-Object System.Drawing.Rectangle(0, 0, $targetW, $targetH)),
                (New-Object System.Drawing.Rectangle($x, $y, $cropW, $cropH)),
                [System.Drawing.GraphicsUnit]::Pixel)
            
            $g.Dispose()
            $img.Dispose()
            
            # Save with high quality
            $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
            $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 100)
            $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
            
            $bmp.Save($path, $jpegCodec, $encoderParams)
            $bmp.Dispose()
            Write-Host "Successfully cropped and resized $file with high quality"
        } catch {
            Write-Host "Error processing $file : $_"
        }
    } else {
        Write-Host "File $file not found, skipping."
    }
}