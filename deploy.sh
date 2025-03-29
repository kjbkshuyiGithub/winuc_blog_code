#!/bin/bash
# 博客项目部署脚本
# 用法: ./deploy.sh [环境名称]

# 设置颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # 无颜色

# 默认环境
ENV=${1:-"production"}
echo -e "${BLUE}===== 开始部署到 ${ENV} 环境 =====${NC}"

# 项目名称和部署路径
PROJECT_NAME="team-blog"
DEPLOY_PATH="/var/www/$PROJECT_NAME"
LOG_FILE="./deploy-$(date +%Y%m%d%H%M%S).log"

# 记录日志函数
log() {
  echo -e "$1" | tee -a $LOG_FILE
}

# 步骤函数 - 带有计时和状态
step() {
  local step_name=$1
  local cmd=$2
  
  log "\n${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} 开始: $step_name..."
  local start_time=$(date +%s)
  
  # 执行命令并捕获输出
  local output
  if output=$(eval "$cmd" 2>&1); then
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    log "${GREEN}✓ 完成:${NC} $step_name (耗时: ${duration}s)"
    log "  $output" 
  else
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    log "${RED}✗ 失败:${NC} $step_name (耗时: ${duration}s)"
    log "${RED}错误:${NC}\n$output"
    return 1
  fi
}

# 检查目录是否存在
if [ ! -d "$DEPLOY_PATH" ]; then
  log "${YELLOW}部署目录不存在，将创建:${NC} $DEPLOY_PATH"
  step "创建部署目录" "mkdir -p $DEPLOY_PATH"
fi

# 进入部署目录
cd $DEPLOY_PATH || { log "${RED}无法进入部署目录${NC}"; exit 1; }
log "${BLUE}当前工作目录:${NC} $(pwd)"

# 备份当前版本（如果存在）
if [ -d "current" ]; then
  BACKUP_DIR="backup_$(date +%Y%m%d%H%M%S)"
  step "备份当前版本" "cp -r current $BACKUP_DIR"
  log "${GREEN}当前版本已备份到:${NC} $BACKUP_DIR"
fi

# 检查是否有tar包作为参数
TAR_FILE=$2
if [ -n "$TAR_FILE" ] && [ -f "$TAR_FILE" ]; then
  log "${BLUE}发现部署包:${NC} $TAR_FILE"
  
  # 创建新的部署目录
  RELEASE_DIR="release_$(date +%Y%m%d%H%M%S)"
  step "创建发布目录" "mkdir -p $RELEASE_DIR"
  
  # 解压tar包
  step "解压部署包" "tar -xzf $TAR_FILE -C $RELEASE_DIR"
  
  # 安装依赖
  cd $RELEASE_DIR || { log "${RED}无法进入发布目录${NC}"; exit 1; }
  step "安装依赖" "npm install --production"
  
  # 检查环境文件
  if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
      step "创建环境配置" "cp .env.example .env"
      log "${YELLOW}警告:${NC} 已从示例创建.env文件，请检查并配置正确的环境变量"
    else
      log "${RED}错误:${NC} 未找到环境配置文件"
      exit 1
    fi
  fi
  
  # 构建项目
  step "构建项目" "npm run build"
  
  # 更新当前版本链接
  cd $DEPLOY_PATH || { log "${RED}无法返回部署目录${NC}"; exit 1; }
  if [ -L "current" ]; then
    step "更新版本链接" "rm current && ln -s $RELEASE_DIR current"
  else
    step "创建版本链接" "ln -s $RELEASE_DIR current"
  fi
  
  # 重启应用
  cd $DEPLOY_PATH/current || { log "${RED}无法进入当前版本目录${NC}"; exit 1; }
  if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "$PROJECT_NAME"; then
      step "重启应用(PM2)" "pm2 restart $PROJECT_NAME"
    else
      step "启动应用(PM2)" "pm2 start npm --name \"$PROJECT_NAME\" -- start"
    fi
  else
    log "${YELLOW}警告:${NC} 未找到PM2，请手动启动应用"
    log "  建议使用: npm start"
  fi
  
  # 部署完成
  log "\n${GREEN}=====================================${NC}"
  log "${GREEN}✓ 部署完成!${NC}"
  log "${GREEN}=====================================${NC}"
  log "部署日志: $LOG_FILE"
  log "部署路径: $DEPLOY_PATH/current"
  
else
  # 如果没有提供tar包，克隆git仓库
  log "${YELLOW}未提供部署包，将从Git仓库部署${NC}"
  
  # 设置Git仓库地址
  GIT_REPO=${GIT_REPO:-"git仓库地址"}
  GIT_BRANCH=${GIT_BRANCH:-"main"}
  
  # 创建新的部署目录
  RELEASE_DIR="release_$(date +%Y%m%d%H%M%S)"
  step "创建发布目录" "mkdir -p $RELEASE_DIR"
  
  # 克隆代码
  step "克隆代码" "git clone --depth 1 -b $GIT_BRANCH $GIT_REPO $RELEASE_DIR"
  
  # 继续安装和部署流程
  cd $RELEASE_DIR || { log "${RED}无法进入发布目录${NC}"; exit 1; }
  step "安装依赖" "npm install --production"
  
  # 检查环境文件
  if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
      step "创建环境配置" "cp .env.example .env"
      log "${YELLOW}警告:${NC} 已从示例创建.env文件，请检查并配置正确的环境变量"
    else
      log "${RED}错误:${NC} 未找到环境配置文件"
      exit 1
    fi
  fi
  
  # 构建项目
  step "构建项目" "npm run build"
  
  # 更新当前版本链接
  cd $DEPLOY_PATH || { log "${RED}无法返回部署目录${NC}"; exit 1; }
  if [ -L "current" ]; then
    step "更新版本链接" "rm current && ln -s $RELEASE_DIR current"
  else
    step "创建版本链接" "ln -s $RELEASE_DIR current"
  fi
  
  # 重启应用
  cd $DEPLOY_PATH/current || { log "${RED}无法进入当前版本目录${NC}"; exit 1; }
  if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "$PROJECT_NAME"; then
      step "重启应用(PM2)" "pm2 restart $PROJECT_NAME"
    else
      step "启动应用(PM2)" "pm2 start npm --name \"$PROJECT_NAME\" -- start"
    fi
  else
    log "${YELLOW}警告:${NC} 未找到PM2，请手动启动应用"
    log "  建议使用: npm start"
  fi
  
  # 部署完成
  log "\n${GREEN}=====================================${NC}"
  log "${GREEN}✓ 部署完成!${NC}"
  log "${GREEN}=====================================${NC}"
  log "部署日志: $LOG_FILE"
  log "部署路径: $DEPLOY_PATH/current"
fi

# 清理操作
# 保留最新的5个备份，删除旧的
if [ -d "$DEPLOY_PATH" ]; then
  BACKUP_COUNT=$(ls -1d backup_* 2>/dev/null | wc -l)
  if [ "$BACKUP_COUNT" -gt 5 ]; then
    EXCESS=$((BACKUP_COUNT - 5))
    log "${BLUE}清理旧备份，保留最新5个...${NC}"
    ls -1td backup_* | tail -n $EXCESS | xargs rm -rf
    log "${GREEN}已清理${NC} $EXCESS 个旧备份目录"
  fi
fi 