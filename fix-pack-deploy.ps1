# Simple Deployment Packaging Script
# Purpose: Create ZIP package for deployment
# Usage: PowerShell .\fix-pack-deploy.ps1

# Configuration
$projectName = "team-blog"
$outputDir = "./deploy"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$zipName = "$projectName-$timestamp.zip"
$zipPath = Join-Path $outputDir $zipName

# Directories and files to include
$includeDirs = @(
    "public",
    "src",
    "prisma",
    "next.config.js",
    "package.json",
    "package-lock.json",
    "postcss.config.js",
    "tailwind.config.js",
    "tsconfig.json",
    ".env.example"
)

# Directories and files to exclude
$excludeDirs = @(
    "node_modules",
    ".next",
    "deploy",
    ".git",
    ".vscode",
    "*.log"
)

# Welcome message
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "          DEPLOYMENT PACKAGING SCRIPT              " -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Preparing to package project: $projectName" -ForegroundColor Green

# Create output directory if it doesn't exist
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    Write-Host "Created output directory: $outputDir" -ForegroundColor Yellow
}

# Create temporary directory
$tempDir = Join-Path $outputDir "temp_$timestamp"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

try {
    # Copy files to temporary directory
    foreach ($item in $includeDirs) {
        $source = $item
        $destination = Join-Path $tempDir $item
        
        if (Test-Path $source) {
            if ((Get-Item $source) -is [System.IO.DirectoryInfo]) {
                # Copy directory
                Copy-Item -Path $source -Destination $destination -Recurse -Force -Exclude $excludeDirs
                Write-Host "Copied directory: $item" -ForegroundColor Green
            } else {
                # Copy file
                $destinationDir = Split-Path $destination
                if (!(Test-Path $destinationDir)) {
                    New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
                }
                Copy-Item -Path $source -Destination $destination -Force
                Write-Host "Copied file: $item" -ForegroundColor Green
            }
        } else {
            Write-Host "Warning: $item not found" -ForegroundColor Yellow
        }
    }

    # Create ZIP package
    Write-Host "Creating package..." -ForegroundColor Cyan
    Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -Force
    Write-Host "Created ZIP package: $zipPath" -ForegroundColor Green

    Write-Host "Packaging completed successfully!" -ForegroundColor Green
    Write-Host "Package path: $zipPath" -ForegroundColor Cyan
    
    # Prompt to open folder
    $openFolder = Read-Host "Open package directory? (Y/N)"
    if ($openFolder -eq "Y" -or $openFolder -eq "y") {
        Invoke-Item $outputDir
    }
    
} catch {
    Write-Host "Error: An error occurred during packaging" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
} finally {
    # Clean up temporary directory
    if (Test-Path $tempDir) {
        Remove-Item -Path $tempDir -Recurse -Force
        Write-Host "Temporary directory cleaned up" -ForegroundColor DarkGray
    }
}

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "          PACKAGING PROCESS COMPLETED              " -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan 