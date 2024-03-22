import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as tweeter_service from '../lib/tweeter_service';

export class TweeterServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new tweeter_service.TweeterService(this, 'TweeterService');

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'TweeterServiceQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}