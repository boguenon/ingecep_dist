
export IGC_HOME=/home/mplix
export CLASSPATH=$IGC_HOME/bin/mplix-3.0.0.jar:$CLASSPATH
export PATH=/usr/bin/jdk1.6.0_45/bin/:$PATH

java -Dapproot=$IGC_HOME $JAVA_OPTS -classpath $CLASSPATH com/mplix/rpc/igcMigService