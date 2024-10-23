import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { MessageRequest, MessageResponse } from './proto/hero';

@Controller()
export class AppController {
  @GrpcMethod('ExampleService', 'MessageToMessage')
  findOne(
    data: MessageRequest,
    metadata: any,
    call: any,
    callback: any,
  ): MessageResponse {
    console.log('MessageToMessage');
    return { message: 'Hello ' + data.message };
  }
}
