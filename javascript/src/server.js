import { join } from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import * as reflection from "grpc-reflection";

const path = "proto/example.proto";
const port = 50051;

const packageDefinition = protoLoader.loadSync(path);

const grpcObj = grpc.loadPackageDefinition(packageDefinition, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const service = grpcObj.examplePackage.ExampleService.service;

async function main() {
  const server = new grpc.Server();

  server.addService(service, {
    MessageToMessage: (call, callback) => {
      const { request } = call;
      const { message } = request;
      console.log("Received message", message);
      callback(null, { message: "Pong" });
    },
    MessageToStream: async (call) => {
      const { request } = call;
      const { message } = request;
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Received message", message);
      call.write({ message: "Ping" });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      call.write({ message: "Pong" });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      call.write({ message: "Hakuna" });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      call.write({ message: "Matata" });

      call.end();
    },

    StreamToMessage: (call, callback) => {
      const data = [];
      call.on("data", (response) => {
        console.log("Received message", response.message);
        data.push(response.message);
      });
      call.on("end", () => {
        callback(null, { message: data.join(", ") });
      });
    },
  });
  reflection.enableReflection(server);

  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(`Server running at port ${port}`);
    }
  );
}

main().catch(console.error);
