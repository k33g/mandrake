#!/usr/bin/env bash
mkdir $1
cd $1
git init
mkdir -p src/{main,test}/{java,resources,scala}
mkdir lib project target

# .ensime
cat > .ensime << EOF
EOF

# build.sbt
cat > build.sbt << EOF
name := "$1"

version := "1.0"

scalaVersion := "2.12.2"

libraryDependencies += "io.vertx" %% "vertx-web-scala" % "3.4.1"
libraryDependencies += "io.vertx" %% "vertx-web-client-scala" % "3.4.1"
libraryDependencies += "io.vertx" %% "vertx-service-discovery-scala" % "3.4.1"
libraryDependencies += "io.vertx" %% "vertx-service-discovery-backend-redis-scala" % "3.4.1"

packageArchetype.java_application
EOF

# project/plugins.sbt
cat > project/plugins.sbt << EOF
logLevel := Level.Warn

addSbtPlugin("io.spray" % "sbt-revolver" % "0.8.0")
addSbtPlugin("com.typesafe.sbt" % "sbt-native-packager" % "0.8.0")
EOF

# build.properties
cat > project/build.properties << EOF
sbt.version = 0.13.15
EOF

# .gitignore
cat > .gitignore << EOF
.idea/
.vertx/
.clever.json
/out/
*.class
*.log
dump.rdb
/target/
/project/target/*
/project/project/*
EOF

# NOTES.md
cat > NOTES.md << EOF
- run ENSIME in atom: cmd-shift-P ENSIME: Start
- run with revolver: sbt ~re-start
- updates (dependencies): sbt ensimeConfig
EOF

# Hello.scala
cat > src/main/scala/Hello.scala << EOF
import io.vertx.core.json.JsonObject
import io.vertx.scala.core.Vertx
import io.vertx.scala.ext.web.Router
import io.vertx.scala.servicediscovery.types.HttpEndpoint
import io.vertx.scala.servicediscovery.{ServiceDiscovery, ServiceDiscoveryOptions}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.util.{Failure, Success}

object Hello {

  def main(args: Array[String]): Unit = {
    val vertx = Vertx.vertx()
    val server = vertx.createHttpServer()
    val router = Router.router(vertx)

    val httpPort = sys.env.get("PORT") match {
      case None => 8080
      case Some(port) => port.toInt
    }

    router.route("/api/hi").handler(context => {
      context
        .response()
        .putHeader("content-type", "application/json;charset=UTF-8")
        .end(new JsonObject().put("message", "Hi 🐼").encodePrettily())
    })

    router.route("/").handler(context => {
      context
        .response()
        .putHeader("content-type", "text/html;charset=UTF-8")
        .end("<h1>Hello 🌍</h1>")
    })

    println(s"🌍 Listening on $httpPort - Enjoy 😄")
    server.requestHandler(router.accept _).listen(httpPort)

  }
}
EOF

#sbt ensimeConfig
