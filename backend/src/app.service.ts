import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  postUser(): string {
    // const user = await User.postUser();
    return "abc";
  }
}
