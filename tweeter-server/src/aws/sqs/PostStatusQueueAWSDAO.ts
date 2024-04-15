import { SQSPostStatusDAO } from "../../dao/DAOInterfaces";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

export class PostStatusQueueAWSDAO implements SQSPostStatusDAO {
  readonly queueUrl: string = "https://sqs.us-east-1.amazonaws.com/691482752617/TweeterServiceStack-TweeterServicePostStatusQueue7F7C3A4B-kzLV6FM1HUMV";
  readonly sqs = new SQSClient({ region: "us-east-1" });
  
  async sendPost(message: string): Promise<void> {
    await this.sqs.send(
      new SendMessageCommand({
        QueueUrl: this.queueUrl,
        MessageBody: message,
      })
    );
  }
}