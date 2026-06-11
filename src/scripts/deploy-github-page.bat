@echo off
chcp 65001 >nul

REM 获取脚本所在目录
set "SCRIPT_DIR=%~dp0"
REM 项目根目录（脚本在 src/scripts 下，往上两级）
set "PROJECT_ROOT=%SCRIPT_DIR%..\..\"
REM .deploy 目录
set "DEPLOY_DIR=%PROJECT_ROOT%.deploy"
REM dist 目录
set "DIST_DIR=%PROJECT_ROOT%dist"

echo [1/4] 清空 .deploy 目录...
if not exist "%DEPLOY_DIR%" mkdir "%DEPLOY_DIR%"
cd /d "%DEPLOY_DIR%"
REM 删除目录下所有文件和子目录（保留 .git）
for /f "delims=" %%i in ('dir /b /a-d ^| findstr /v /i "^\.git$"') do del /f /q "%%i" 2>nul
for /f "delims=" %%i in ('dir /b /ad ^| findstr /v /i "^\.git$"') do rd /s /q "%%i" 2>nul

echo [2/4] 复制 dist 文件到 .deploy...
xcopy /e /y /q "%DIST_DIR%\*" "%DEPLOY_DIR%\"

echo [3/4] Git add 并 commit...
cd /d "%DEPLOY_DIR%"
git add -A

REM 获取当前时间 yyyy-MM-dd HH:mm:ss
for /f "tokens=2 delims==" %%i in ('wmic os get localdatetime /value') do set "dt=%%i"
set "TIMESTAMP=%dt:~0,4%-%dt:~4,2%-%dt:~6,2% %dt:~8,2%:%dt:~10,2%:%dt:~12,2%"

git commit -m "build:%TIMESTAMP%"

echo [4/4] 强制推送到 origin...
git push origin HEAD --force

echo 部署完成！
