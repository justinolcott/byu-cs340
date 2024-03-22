import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
// import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import path = require("path");

// const lambda_dir = "../../tweeter-server/dist/lambda";
const lambda_dir = "../../tweeter-server/src/lambda/";

export class TweeterService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);   

    // API
    const api = new apigateway.RestApi(this, "TweeterServiceAPI", {
      restApiName: "Tweeter Service",
      description: "This service is for the Tweeter application.",
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const service = api.root.addResource("service", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const responseModel = new apigateway.Model(this, "ResponseModel", {
      restApi: api,
      modelName: "ResponseModel",
      contentType: "application/json",
      schema: {},
    });

    // LOGIN
    const loginLambda = new NodejsFunction(this, "LoginHandler", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: lambda_dir + "LoginLambda.ts",
      handler: "handler",
    });

    const login = service.addResource("login", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const loginIntegration = new apigateway.LambdaIntegration(loginLambda, {
      proxy: false,
      // requestTemplates: {
      //   "application/json": '{ "statusCode": "200" }',
      // },
      integrationResponses: [
        {
          statusCode: "200",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
          responseTemplates: {
            "application/json": "$input.json('$')",
          },
        },
      ],
    });

    login.addMethod("POST", loginIntegration, {
      methodResponses: [
      {
        statusCode: "200",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
        responseModels: {
        "application/json": responseModel,
        },
      },
      ],
    });

    // REGISTER
    const registerLambda = new NodejsFunction(this, "RegisterHandler", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: lambda_dir + "RegisterLambda.ts",
      handler: "handler",
    });

    const register = service.addResource("register", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const registerIntegration = new apigateway.LambdaIntegration(registerLambda, {
      proxy: false,
      // requestTemplates: {
      //   "application/json": '{ "statusCode": "200" }',
      // },
      integrationResponses: [
        {
          statusCode: "200",

          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
          // responseTemplates: {
          //   "application/json": "$input.json('$')",
          // },
        },

        {
          selectionPattern: "4\\d{2}",
          statusCode: "400",
          // responseTemplates: {
          //   "application/json": "$input.json('$')",
          // },
        }
      ],
    });

    register.addMethod("POST", registerIntegration, {
      methodResponses: [
      {
        statusCode: "200",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
        // responseModels: {
        // "application/json": responseModel,
        // },

      },
      ],
    });

    // GET USER
    const getUserLambda = new NodejsFunction(this, "GetUserHandler", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: lambda_dir + "GetUserLambda.ts",
      handler: "handler",
    });

    const getUser = service.addResource("getUser", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const getUserIntegration = new apigateway.LambdaIntegration(getUserLambda, {
      proxy: false,
      // requestTemplates: {
      //   "application/json": '{ "statusCode": "200" }',
      // },
      integrationResponses: [
        {
          statusCode: "200",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },

        },
      ],
    });

    getUser.addMethod("POST", getUserIntegration, {
      methodResponses: [
      {
        statusCode: "200",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
        // responseModels: {
        // "application/json": responseModel,
        // },
      },
      ],
    });

    // LOAD MORE FOLLOWERS
    const loadMoreFollowersLambda = new NodejsFunction(this, "LoadMoreFollowersHandler", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: lambda_dir + "LoadMoreFollowersLambda.ts",
      handler: "handler",
    });

    const loadMoreFollowers = service.addResource("loadMoreFollowers", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const loadMoreFollowersIntegration = new apigateway.LambdaIntegration(loadMoreFollowersLambda, {
      proxy: false,
      integrationResponses: [
        {
          statusCode: "200",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },

        },
      ],
    });

    loadMoreFollowers.addMethod("POST", loadMoreFollowersIntegration, {
      methodResponses: [
      {
        statusCode: "200",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      ],
    });

    // LOAD MORE FOLLOWEES
    const loadMoreFolloweesLambda = new NodejsFunction(this, "LoadMoreFolloweesHandler", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: lambda_dir + "LoadMoreFolloweesLambda.ts",
      handler: "handler",
    });

    const loadMoreFollowees = service.addResource("loadMoreFollowees", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const loadMoreFolloweesIntegration = new apigateway.LambdaIntegration(loadMoreFolloweesLambda, {
      proxy: false,
      integrationResponses: [
        {
          statusCode: "200",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },

        },
      ],
    });

    loadMoreFollowees.addMethod("POST", loadMoreFolloweesIntegration, {
      methodResponses: [
      {
        statusCode: "200",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      ],
    });

    // LOAD MORE FEED ITEMS
    const loadMoreFeedItemsLambda = new NodejsFunction(this, "LoadMoreFeedItemsHandler", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: lambda_dir + "LoadMoreFeedItemsLambda.ts",
      handler: "handler",
    });

    const loadMoreFeedItems = service.addResource("loadMoreFeedItems", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const loadMoreFeedItemsIntegration = new apigateway.LambdaIntegration(loadMoreFeedItemsLambda, {
      proxy: false,
      integrationResponses: [
        {
          statusCode: "200",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },

        },
      ],
    });

    loadMoreFeedItems.addMethod("POST", loadMoreFeedItemsIntegration, {
      methodResponses: [
      {
        statusCode: "200",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      ],
    });

    // LOAD MORE STORY ITEMS
    const loadMoreStoryItemsLambda = new NodejsFunction(this, "LoadMoreStoryItemsHandler", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: lambda_dir + "LoadMoreStoryItemsLambda.ts",
      handler: "handler",
    });

    const loadMoreStoryItems = service.addResource("loadMoreStoryItems", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const loadMoreStoryItemsIntegration = new apigateway.LambdaIntegration(loadMoreStoryItemsLambda, {
      proxy: false,
      integrationResponses: [
        {
          statusCode: "200",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },

        },
      ],
    });

    loadMoreStoryItems.addMethod("POST", loadMoreStoryItemsIntegration, {
      methodResponses: [
      {
        statusCode: "200",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      ],
    });

    


  }
}