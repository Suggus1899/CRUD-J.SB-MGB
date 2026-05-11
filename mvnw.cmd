@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF)
@REM Maven Wrapper startup batch script
@REM ----------------------------------------------------------------------------
@IF "%__MVNW_ARG0_NAME__%"=="" (SET __MVNW_ARG0_NAME__=%~nx0)
@SET DP0=%~dp0
@SET MAVEN_PROJECTBASEDIR=%MAVEN_BASEDIR%
@IF NOT "%MAVEN_PROJECTBASEDIR%"=="" GOTO init

@SET MAVEN_PROJECTBASEDIR=%DP0%
:init
@SET MVNW_USERNAME=%USERNAME%
@SET MVNW_HOME=%USERPROFILE%\.m2\wrapper
@SET MVNW_JAR=%MVNW_HOME%\maven-wrapper.jar

@IF EXIST "%MVNW_JAR%" GOTO runWrapper

@SET MVNW_DOWNLOAD_URL=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar
@ECHO Downloading Maven Wrapper from: %MVNW_DOWNLOAD_URL%
@IF NOT EXIST "%MVNW_HOME%" MKDIR "%MVNW_HOME%"
@PowerShell -Command "& { (New-Object Net.WebClient).DownloadFile('%MVNW_DOWNLOAD_URL%', '%MVNW_JAR%') }"

:runWrapper
@SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain
@java -classpath "%MVNW_JAR%" "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" %WRAPPER_LAUNCHER% %MAVEN_CONFIG% %*
