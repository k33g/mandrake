import io.vertx.core.AbstractVerticle;
import io.vertx.core.http.HttpServer;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;
import io.vertx.ext.web.handler.BodyHandler;

import java.util.Optional;

public class WebApp extends AbstractVerticle {
  public void start() {
    Integer httpPort = Integer.parseInt(Optional.ofNullable(System.getenv("PORT")).orElse("9090"));

    HttpServer server = vertx.createHttpServer();
    Router router = Router.router(vertx);
    router.route().handler(BodyHandler.create());

    router.get("/api/yo").handler(context -> {
      context.response().putHeader("content-type", "text/html;charset=UTF-8").end("<h1>YO! 😛</h1>");
    });

    router.get("/api/hi/:name").handler(context -> {
      String name = context.request().getParam("name");

      context.response()
        .putHeader("content-type", "application/json;charset=UTF-8")
        .end(
          new JsonObject().put("message", "👋 Hi "+ name).toString()
        );
    });

    /* To test your API, try this in the browser console:

        fetch("/api/ping",{
          method: "POST",
          body: JSON.stringify({name: "bob morane"})
        })
        .then(function(res){ return res.json(); })
        .then(function(data){ console.log(JSON.stringify(data)) })
     */

    router.post("/api/ping").handler(context -> {

      // before, you should test that context is not null
      String name = Optional.ofNullable(context.getBodyAsJson().getString("name")).orElse("John Doe");
      context.response()
        .putHeader("content-type", "application/json;charset=UTF-8")
        .end(
          new JsonObject().put("message", "🏓 pong "+ name).toString()
        );
    });

    // serve static assets, see /resources/webroot directory
    router.route("/*").handler(StaticHandler.create());

    server.requestHandler(router::accept).listen(httpPort, result -> {
      System.out.println("🌍 Listening on " + httpPort);
    });

  }
}





