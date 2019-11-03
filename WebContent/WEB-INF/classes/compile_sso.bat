set JDK_HOME=c:\Program Files (x86)\Java\jdk1.6.0_45\
set JAVA_HOME=%JDK_HOME%
set PATH=%JDK_HOME%bin;%PATH%

javac -classpath ../../../bin/mplix-3.0.0.jar;"C:/Program Files/Apache Software Foundation/Tomcat 5.5/common/lib/servlet-api.jar" com/mplix/sso/example/*.java