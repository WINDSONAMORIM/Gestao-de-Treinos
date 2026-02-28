import "dotenv/config";
import { z } from "zod/v4";
import Fastify from "fastify";
import {
    jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";

const app = Fastify({
  logger: true,
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
("");

await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Gestão de Treinos API",
      description: "SAP - Sistema de Avaliação de Performance",
      version: "1.0.0",
    },
    servers: [{
        description: "localhost",
        url: "http://localhost:8080",
    }],
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
});

app.withTypeProvider<ZodTypeProvider>().route({
  method: "GET",
  url: "/",
  schema: {
    description: "Endpoint de teste",
    tags: ["Test"],
    response: {
      200: z.object({
        message: z.string(),
      }),
    },
  },
  handler: () => {
    return { message: "Hello World!" };
  },
});

try {
  await app.listen({ port: Number(process.env.PORT) ?? 8080 });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
