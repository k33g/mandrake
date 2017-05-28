#!/usr/bin/env bash
mkdir $1
cd $1

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
cat > src/main/scala/$2.scala << EOF
import io.vertx.core.json.JsonObject
import io.vertx.scala.core.Vertx
import io.vertx.scala.ext.web.Router
import io.vertx.scala.ext.web.client.WebClient
//import io.vertx.scala.servicediscovery.types.HttpEndpoint
import io.vertx.scala.servicediscovery.{ServiceDiscovery, ServiceDiscoveryOptions}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.util.{Failure, Success}

object $2 {

  val vertx = Vertx.vertx()

  def main(args: Array[String]): Unit = {
    val server = vertx.createHttpServer()
    val router = Router.router(vertx)
    val httpPort = sys.env.get("PORT").getOrElse("8080").toInt

    // Settings for the Redis backend
    val redisHost = sys.env.get("REDIS_HOST").getOrElse("127.0.0.1")
    val redisPort = sys.env.get("REDIS_PORT").getOrElse("6379").toInt
    val redisAuth = sys.env.get("REDIS_PASSWORD").getOrElse(null)
    val redisRecordsKey = sys.env.get("REDIS_RECORDS_KEY").getOrElse("scala-records")

    val discoveryService = ServiceDiscovery.create(vertx, ServiceDiscoveryOptions()
      .setBackendConfiguration(
        new JsonObject()
          .put("host", redisHost)
          .put("port", redisPort)
          .put("auth", redisAuth)
          .put("key", redisRecordsKey)
      )
    )

    // search service by name
    // is it better to search the client each time?
    discoveryService.getRecordFuture(new JsonObject().put("name", "$3")).onComplete{
      case Success(result) => {
        val reference = discoveryService.getReference(result)
        val client = reference.getAs(classOf[WebClient])

        router.get("/add").handler(context => {
          client.get("/api/add/40/2").sendFuture().onComplete{
            case Success(result) => {
              println(result.body())
              context
                .response()
                .putHeader("content-type", "application/json;charset=UTF-8")
                .end(result.body())
            }
            case Failure(cause) => {
              println(cause)
              context
                .response()
                .putHeader("content-type", "application/json;charset=UTF-8")
                .end(new JsonObject().put("error", cause).encodePrettily())
            }
          }


        })

        router.get("/multiply").handler(context => {
          client.get("/api/multiply/2/21").sendFuture().onComplete{
            case Success(result) => {
              println(result.body())
              context
                .response()
                .putHeader("content-type", "application/json;charset=UTF-8")
                .end(result.body())
            }
            case Failure(cause) => {
              println(cause)
              context
                .response()
                .putHeader("content-type", "application/json;charset=UTF-8")
                .end(new JsonObject().put("error", cause).encodePrettily())
            }
          }
        })

      }
      case Failure(cause) => {
        println(cause)
      }
    }

    // home page
    router.get("/").handler(context => {
      context
        .response()
        .putHeader("content-type", "text/html;charset=UTF-8")
        .end("<h1>Hello $2 🌍</h1>")
    })

    println(s"🌍 Listening on $httpPort  - Enjoy 😄")
    server.requestHandler(router.accept _).listen(httpPort)
  }
}
EOF

#sbt ensimeConfig
