import { Injectable } from '@nestjs/common';

@Injectable()
export class BatchService {
  getHello(): string {
    return 'Nestar Batch is running!';
  }

  public async batchRollBack(): Promise<void>{
    console.log("batchRollBack")
  }

    public async batchTopProperties(): Promise<void>{
    console.log("batchTopProperties")
  }

    public async batchTopAgents(): Promise<void>{
    console.log("batchTopAgents")
  }
}
