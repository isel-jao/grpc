import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const path = "proto/example.proto";
const port = 50051;

const packageDefinition = protoLoader.loadSync(path);

const grpcObj = grpc.loadPackageDefinition(packageDefinition);

async function main() {
  const client = new grpcObj.examplePackage.ExampleService(
    `localhost:${port}`,
    grpc.credentials.createInsecure()
  );
  const deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + 5);
  client.waitForReady(deadline, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Client ready");
  });

  //   message to message example
  //   client.MessageToMessage({ message: "Ping" }, (err, response) => {
  //     if (err) {
  //       console.error(err);
  //       return;
  //     }
  //     console.log("Response", response);
  //   });

  // message to stream example
  //   const stream = client.MessageToStream({ message: "Ping" });
  //   stream.on("data", (response) => {
  //     console.log("Stream", response);
  //   });
  //   stream.on("end", () => {
  //     console.log("Stream end");
  //   });

  // stream to message example
  //   const stream2 = client.StreamToMessage((err, response) => {
  //     if (err) {
  //       console.error(err);
  //       return;
  //     }
  //     console.log("Response", response);
  //   });
  //   await new Promise((resolve) => setTimeout(resolve, 2000));
  //   stream2.write({ message: "Ping" });
  //   await new Promise((resolve) => setTimeout(resolve, 2000));
  //   stream2.write({ message: "Pong" });
  //   await new Promise((resolve) => setTimeout(resolve, 2000));
  //   stream2.write({ message: "Hakuna" });
  //   await new Promise((resolve) => setTimeout(resolve, 2000));
  //   stream2.write({ message: "Matata" });
  //   stream2.end();
}

main().catch(console.error);
