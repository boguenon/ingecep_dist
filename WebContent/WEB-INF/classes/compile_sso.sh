#!/bin/sh
export JDK_HOME=/usr/lib/jvm/java-1.7.0-openjdk
export JAVA_HOME=$JDK_HOME
export PATH=$JDK_HOME/bin:$PATH

javac -classpath ../../../bin/mplix-3.0.0.jar com/mplix/sso/example/*.java