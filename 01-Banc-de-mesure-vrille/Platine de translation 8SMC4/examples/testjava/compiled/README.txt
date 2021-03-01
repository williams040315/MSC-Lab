Eng.

How to work with example on Windows.

For run:
1. Put files libjximc.jar, libjximc.dll, libximc.dll, bindy.dll, xiwrapper.dll, keyfile.sqlite next to testjava.jar
2. Type in command line:
 java -classpath libjximc.jar -classpath testjava.jar ru.ximc.TestJava
 
For modify:
1. Unpack jar:
 jar xvf testjava.jar ru META-INF
2. Modyfy sources
3. Build example:
 javac -classpath libjximc.jar -Xlint ru/ximc/TestJava.java
 jar cmf META-INF\MANIFEST.MF testjava.jar ru

Rus.

Как работать с примером на Windows.
 
Для запуска примера:
1. Поместите файлы libjximc.jar, libjximc.dll, libximc.dll, bindy.dll, xiwrapper.dll, keyfile.sqlite рядом с testjava.jar
2. Для запуска наберите в командной строке: 
 java -classpath libjximc.jar -classpath testjava.jar ru.ximc.TestJava
 
Для модификации примера:
1. Распакуйте jar командой:
 jar xvf testjava.jar ru META-INF
2. Модифицируйте исходные коды
3. Соберите пример:
 javac -classpath libjximc.jar -Xlint ru/ximc/TestJava.java
 jar cmf MANIFEST.MF testjava.jar ru