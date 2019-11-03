rem set JAVA_OPTS=-Xmx128m -Xms64m -XX:+UseParNewGC -XX:+UseConcMarkSweepGC
set IGC_HOME=c:\app_final\mplix
set CLASSPATH=%IGC_HOME%/bin/mplix-3.0.0.jar;%IGC_HOME%/lib/json-lib-2.2.3-jdk15.jar;%IGC_HOME%/lib/commons-lang-2.6.jar;%IGC_HOME%/lib/commons-logging-1.1.1.jar;%IGC_HOME%/lib/json_simple-1.1.jar;%IGC_HOME%/lib/ezmorph-1.0.6.jar;%IGC_HOME%/lib/commons-collections-3.2.jar;%IGC_HOME%/lib/commons-beanutils-1.8.2.jar
set PATH=c:\Program Files (x86)\Java\jdk1.6.0_34\bin\;%PATH%

java -Dapproot=%IGC_HOME% %JAVA_OPTS% -classpath %CLASSPATH% com/mplix/rpc/igcServer stop