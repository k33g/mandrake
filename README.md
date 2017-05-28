# :tophat: Mandrake

Mandrake is an application generator for Clever-Cloud:

- it helps you with providing walking skeletons of web applications or addon
- and with creating and pushing your application on Clever-Cloud for the first-time
- when you'll feel confident, you'll be able to add your own templates of creation

> WIP

Currently, Mandrake doesn't run on Windows (but WIP)

## prerequisites

You have to install the Clever-Cloud CLI: https://www.clever-cloud.com/doc/clever-tools/getting_started/

## Install

- `git clone` this repository
- `cd mandrake`
- `npm install`
- `npm link`

*Tips*: to remove the link: `open /usr/local/bin/` and remove the link

## Use

### Vert-x discoverable microservice

I want to create a microservices architecture with Vert.x, Scala and Redis.

I'm going to create:

- a redis Clever-Cloud addon, because I use the [Redis Vert.x Discovery Backend](http://vertx.io/docs/vertx-service-discovery-backend-redis/java/)
- a Vert.x microservice
- a Vert.x web application to call the microservice

#### Initialization

So, first, create a directory (and go inside), and launch **mandrake**:

```shell
mkdir microservices-demo
cd microservices-demo
mandrake
```

The first time you run **mandrake** in an empty directory, **mandrake** copies the default templates in the current directory...

![01](documentation/01.png)

... And **mandrake** creates a small database to keep project informations

![02](documentation/02.png)

#### Redis Addon

Select the `addon-redis-small` (**mandrake** will create and deploy a "small" redis database on Clever-Cloud)

![03](documentation/03.png)

Explain:
- where you want to deploy the redis database
- type the name of your organization on Clever-Cloud
- give a name to your addon and type `enter`

![04](documentation/04.png)

#### Microservice application

Run **mandrake** again, and choose the `app-discoverable-ms-vertx-scala-m` item (**mandrake** will create and deploy a scala application on an sized "M" instance on Clever-Cloud)

<img src="/documentation/05.png" alt="05" style="width: 50%; height: 50%;"/>



## Create a template

> WIP

### Application template

>> WIP

### Addon template

>> WIP

### Command template

>> WIP

## Roadmap

> WIP
