import { SQSUpdateFeedDAO } from "../../dao/DAOInterfaces";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export class UpdateFeedQueueAWSDAO implements SQSUpdateFeedDAO {
  readonly queueUrl: string = "https://sqs.us-east-1.amazonaws.com/691482752617/TweeterServiceStack-TweeterServiceUpdateFeedQueue713252B1-XnnuvwLvj8L1";
  readonly sqs = new SQSClient({ region: "us-east-1" });

  async sendMessage(message: string): Promise<void> {
    await this.sqs.send(
      new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: message,
      })
    );
  }
}