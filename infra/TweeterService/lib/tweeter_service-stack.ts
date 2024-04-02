import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as tweeter_service from '../lib/tweeter_service';
import * as tweeter_dynamo from './tweeter_dynamo';
// import * as tweeter_s3 from './tweeter_s3';

export class TweeterServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new tweeter_service.TweeterService(this, 'TweeterService');
    // new tweeter_dynamo.TweeterDynamo(this, 'TweeterDynamo');
    // new tweeter_s3.TweeterS3(this, 'TweeterS3');

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'TweeterServiceQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}