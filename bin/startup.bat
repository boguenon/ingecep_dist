rem set JAVA_OPTS=-Xmx128m -Xms64m -XX:+UseParNewGC -XX:+UseConcMarkSweepGC
set IGC_HOME=c:\app_final\mplix
set CLASSPATH=%IGC_HOME%/bin/mplix-3.0.0.jar;c:/Program Files (x86)/Java/jdk1.6.0_45/lib/tools.jar
set PATH=c:\Program Files (x86)\Java\jdk1.6.0_45\bin\;%PATH%

rem start %IGC_HOME%\pgsql\bin\postgres -D %IGC_HOME%/pgsql/data > %IGC_HOME%/logs/pgsql.log
java -Dapproot=%IGC_HOME% %JAVA_OPTS% -classpath "%CLASSPATH%" com/mplix/rpc/igcServer