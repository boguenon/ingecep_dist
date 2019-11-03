#!/bin/sh
#export JAVA_OPTS=-Xmx128m -Xms64m -XX:+UseParNewGC -XX:+UseConcMarkSweepGC
export IGC_HOME=/app/mplix
export CLASSPATH=$IGC_HOME/bin/mplix-3.0.0.jar:/usr/lib/jvm/java-1.7.0-openjdk/lib/tools.jar

nohup java -Dapproot=$IGC_HOME $JAVA_OPTS -classpath "$CLASSPATH" com/mplix/rpc/igcServer 2> /var/log/mplix_err.log > /var/log/mplix.log &