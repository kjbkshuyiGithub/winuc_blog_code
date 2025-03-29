# 打包部署脚本
# 作用：将当前项目代码打包为tar格式，便于在服务器上部署
# 使用方法：在PowerShell中运行 .\pack-deploy.ps1

# 配置变量
$projectName = "team-blog"
$outputDir = "./deploy"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$packageName = "$projectName-$timestamp.tar.gz"
$packagePath = Join-Path $outputDir $packageName

# 要包含的文件夹和文件
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

# 要排除的文件和文件夹
$excludeDirs = @(
    "node_modules",
    ".next",
    "deploy",
    ".git",
    ".vscode",
    "*.log"
)

# 显示欢迎信息
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "             代码打包部署脚本                      " -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "正在准备打包项目: $projectName" -ForegroundColor Green

# 创建输出目录
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    Write-Host "已创建输出目录: $outputDir" -ForegroundColor Yellow
}

# 检查是否有未提交的更改
$hasChanges = git status --porcelain
if ($hasChanges) {
    Write-Host "警告: 存在未提交的更改:" -ForegroundColor Yellow
    Write-Host $hasChanges -ForegroundColor Yellow
    $confirmation = Read-Host "是否继续打包? (Y/N)"
    if ($confirmation -ne "Y" -and $confirmation -ne "y") {
        Write-Host "打包操作已取消" -ForegroundColor Red
        exit
    }
}

# 获取当前git分支和最近commit信息
$currentBranch = git branch --show-current
$lastCommit = git log -1 --pretty=format:"%h - %s (%cr) <%an>"

Write-Host "当前分支: $currentBranch" -ForegroundColor Cyan
Write-Host "最近提交: $lastCommit" -ForegroundColor Cyan

# 创建临时目录
$tempDir = Join-Path $outputDir "temp_$timestamp"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

try {
    # 复制需要的文件到临时目录
    foreach ($item in $includeDirs) {
        $source = $item
        $destination = Join-Path $tempDir $item
        
        if (Test-Path $source) {
            if ((Get-Item $source) -is [System.IO.DirectoryInfo]) {
                # 复制目录
                Copy-Item -Path $source -Destination $destination -Recurse -Force -Exclude $excludeDirs
                Write-Host "已复制目录: $item" -ForegroundColor Green
            } else {
                # 复制文件
                $destinationDir = Split-Path $destination
                if (!(Test-Path $destinationDir)) {
                    New-Item -ItemType Directory -Path $destinationDir -Force | Out-Null
                }
                Copy-Item -Path $source -Destination $destination -Force
                Write-Host "已复制文件: $item" -ForegroundColor Green
            }
        } else {
            Write-Host "警告: 未找到 $item" -ForegroundColor Yellow
        }
    }

    # 创建版本信息文件
    $versionInfo = @"
项目名称: $projectName
打包时间: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Git分支: $currentBranch
Git提交: $lastCommit
"@
    
    Set-Content -Path (Join-Path $tempDir "version-info.txt") -Value $versionInfo
    Write-Host "已创建版本信息文件" -ForegroundColor Green

    # 检查是否有tar命令
    $hasTar = $null -ne (Get-Command "tar" -ErrorAction SilentlyContinue)
    
    if ($hasTar) {
        # 使用系统tar命令打包
        Write-Host "正在打包文件..." -ForegroundColor Cyan
        Set-Location $tempDir
        tar -czf $packagePath *
    } else {
        # 使用PowerShell压缩
        Write-Host "未找到tar命令，使用PowerShell压缩..." -ForegroundColor Yellow
        $tempZip = "$outputDir\$projectName-$timestamp.zip"
        Compress-Archive -Path "$tempDir\*" -DestinationPath $tempZip -Force
        Write-Host "已创建ZIP包：$tempZip" -ForegroundColor Green
        Write-Host "注意：由于未找到tar命令，已创建ZIP格式而非tar.gz格式" -ForegroundColor Yellow
        $packagePath = $tempZip
    }

    Write-Host "打包完成！" -ForegroundColor Green
    Write-Host "包路径: $packagePath" -ForegroundColor Cyan
    
    # 提示用户是否要生成部署指南
    $generateGuide = Read-Host "是否生成部署指南? (Y/N)"
    if ($generateGuide -eq "Y" -or $generateGuide -eq "y") {
        $deployGuide = @"
# 部署指南

## 项目信息
- 项目名称: $projectName
- 打包时间: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
- Git分支: $currentBranch
- Git提交: $lastCommit

## 部署步骤

1. 将 $packageName 上传到服务器

2. 在服务器上解压文件:
   ```
   mkdir -p /var/www/$projectName
   tar -xzf $packageName -C /var/www/$projectName
   cd /var/www/$projectName
   ```

3. 安装依赖:
   ```
   npm install --production
   ```

4. 创建环境配置:
   ```
   cp .env.example .env
   # 编辑.env文件设置正确的环境变量
   nano .env
   ```

5. 构建项目:
   ```
   npm run build
   ```

6. 启动应用:
   ```
   # 使用PM2管理进程
   pm2 start npm --name "$projectName" -- start
   
   # 或者直接启动
   npm start
   ```

7. 配置Nginx反向代理(如需):
   ```
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade \$http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host \$host;
           proxy_cache_bypass \$http_upgrade;
       }
   }
   ```
"@
        
        $guideFilePath = Join-Path $outputDir "deploy-guide-$timestamp.md"
        Set-Content -Path $guideFilePath -Value $deployGuide
        Write-Host "部署指南已生成: $guideFilePath" -ForegroundColor Green
    }
    
    # 打开包所在目录
    $openFolder = Read-Host "是否打开包所在目录? (Y/N)"
    if ($openFolder -eq "Y" -or $openFolder -eq "y") {
        Invoke-Item $outputDir
    }
    
} catch {
    Write-Host "错误: 打包过程中发生错误" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
} finally {
    # 清理临时目录
    if (Test-Path $tempDir) {
        Remove-Item -Path $tempDir -Recurse -Force
        Write-Host "已清理临时目录" -ForegroundColor DarkGray
    }
}

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "             打包过程完成                          " -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan 