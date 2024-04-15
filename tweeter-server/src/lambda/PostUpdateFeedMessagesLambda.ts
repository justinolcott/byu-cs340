import { SQSEvent } from "aws-lambda";
import { StatusService } from "../model/service/StatusService";
import { Status, User } from "tweeter-shared";

export const handler = async (event: SQSEvent): Promise<void> => {
  console.log("EVENT:");
  console.log(event);
  /**
   * Records: [
    {
      messageId: 'a141b78c-ed39-41c5-a296-069fb1342451',
      receiptHandle: 'AQEBNgdismtSD8pFSI27X/h6Vwdxah6JdUmVGjLwP4iYiL7a+728rcpeMdwCZdVGEPEBWZdOWLyZ2a3V6u7IZl87ujSwBeLNQjRkALsfCCi5gUwZUBPttJwI0oH3wGFpRib6Exe88giu+CpUT7FocCiInosF3vez0ZVKkN2G/fddNwYC+5Rh45vPBTYRWd7YIQn96PRfeF1a7raEaWIdj+nXqmSlP5GTRMLWLMQOdUjGimoYx/urSvkYIh4BYBOmZjz3Jf/pYPgkDVxxE5gcz3bgY/I+FcjbvYDGphpjoLvOlldn0oystzw3Or5wAHpxUyhFdF+226+6qBRnzWQTjzIyOV3CtxLgXLFpG/P4MigKZE9HuEadmYfQw+EkMGb5hVcE0VzBICiSFk4KaHYS0WNHGDW8gxPHtMSpne6e28QeD9f5lN8AZrdqWreCEHxvd7aoQZeUbNx9k5QwJOz8dasufg==',
      body: '{"_post":"hello at 10:51 AM","_user":{"_firstName":"mainfirstName","_lastName":"mainlastName","_alias":"mainalias","_imageUrl":"https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"},"_timestamp":1713199869573,"_segments":[{"_text":"hello at 10:51 AM","_startPostion":0,"_endPosition":17,"_type":"Text"}]}',
      attributes: [Object],
      messageAttributes: {},
      md5OfBody: 'fb4a0291c4ef4b855d1b5dd4971cf10c',
      eventSource: 'aws:sqs',
      eventSourceARN: 'arn:aws:sqs:us-east-1:691482752617:TweeterServiceStack-TweeterServicePostStatusQueue7F7C3A4B-kzLV6FM1HUMV',
      awsRegion: 'us-east-1'
    }
  ]
}
   */
  try {
    const message = JSON.parse(event.Records[0].body);
    const newStatus: Status = new Status(
      message._post,
      new User(
        message._user._firstName,
        message._user._lastName,
        message._user._alias,
        message._user._imageUrl,
      
      ),
      message._timestamp,
    );
    await new StatusService().postUpdateFeedMessages(newStatus);
  }
  catch (e) {
    throw new Error(`400: ${e}`);
  }
};