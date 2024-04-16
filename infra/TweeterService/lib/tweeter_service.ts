import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as s3 from "aws-cdk-lib/aws-s3";
// import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import path = require("path");
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as sqs from "aws-cdk-lib/aws-sqs";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";

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
      timeout: cdk.Duration.seconds(60),
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
        {
          // [Login Error] string match
          selectionPattern: "\\[Login Error\\].*",
          statusCode: "400",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
          responseTemplates: {
            "application/json": "$input.json('$')",
          },
          
        },
        {
          // 500 error
          selectionPattern: "/^5\\d{2}$/",
          statusCode: "500",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        }
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
      {
        statusCode: "400",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
        responseModels: {
        "application/json": responseModel,
        },
      },
      {
        statusCode: "500",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
        responseModels: {
        "application/json": responseModel,
        },
      }
      ],
    });

    // REGISTER
    const registerLambda = new NodejsFunction(this, "RegisterHandler", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: lambda_dir + "RegisterLambda.ts",
      handler: "handler",
      // increase timeout
      timeout: cdk.Duration.seconds(60),
    });

    const register = service.addResource("register", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const registerIntegration = new apigateway.LambdaIntegration(registerLambda, {
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
        {
          // [Register Error] string match
          selectionPattern: "\\[Register Error\\].*",
          statusCode: "400",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        },
        {
          // 500 error
          selectionPattern: "/^5\\d{2}$/",
          statusCode: "500",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
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
      },
      {
        statusCode: "400",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      {
        statusCode: "500",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      }
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
      integrationResponses: [
        {
          statusCode: "200",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },

        },
        {
          // [GetUser Error] string match
          selectionPattern: "\\[GetUser Error\\].*",
          statusCode: "400",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        },
        {
          // 500 error
          selectionPattern: "/^5\\d{2}$/",
          statusCode: "500",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        }
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
      },
      {
        statusCode: "400",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      {
        statusCode: "500",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      }
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
        {
          // [LoadMoreFollowers Error] string match
          selectionPattern: "\\[LoadMoreFollowers Error\\].*",
          statusCode: "400",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        },
        {
          // 500 error
          selectionPattern: "/^5\\d{2}$/",
          statusCode: "500",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        }
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
      {
        statusCode: "400",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      {
        statusCode: "500",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      }
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
        {
          // [LoadMoreFollowees Error] string match
          selectionPattern: "\\[LoadMoreFollowees Error\\].*",
          statusCode: "400",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        },
        {
          // 500 error
          selectionPattern: "/^5\\d{2}$/",
          statusCode: "500",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        }
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
      {
        statusCode: "400",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      {
        statusCode: "500",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      }
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
        {
          // [LoadMoreFeedItems Error] string match
          selectionPattern: "\\[LoadMoreFeedItems Error\\].*",
          statusCode: "400",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        },
        {
          // 500 error
          selectionPattern: "/^5\\d{2}$/",
          statusCode: "500",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        }
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
      {
        statusCode: "400",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      {
        statusCode: "500",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      }
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
        {
          // [LoadMoreStoryItems Error] string match
          selectionPattern: "\\[LoadMoreStoryItems Error\\].*",
          statusCode: "400",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        },
        {
          // 500 error
          selectionPattern: "/^5\\d{2}$/",
          statusCode: "500",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        }
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
      {
        statusCode: "400",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      {
        statusCode: "500",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      }
      ],
    });

    
    // POST STATUS
    const postStatusLambda = new NodejsFunction(this, "PostStatusHandler", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: lambda_dir + "PostStatusLambda.ts",
      handler: "handler",
      timeout: cdk.Duration.seconds(60),
    });

    const postStatus = service.addResource("postStatus", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const postStatusIntegration = new apigateway.LambdaIntegration(postStatusLambda, {
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
        {
          // [PostStatus Error] string match
          selectionPattern: "\\[PostStatus Error\\].*",
          statusCode: "400",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        },
        {
          // 500 error
          selectionPattern: "/^5\\d{2}$/",
          statusCode: "500",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        }
      ],
    });


    postStatus.addMethod("POST", postStatusIntegration, {
      methodResponses: [
      {
        statusCode: "200",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      {
        statusCode: "400",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      {
        statusCode: "500",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      }
      ],
    });

    // LOGOUT
    const logoutLambda = new NodejsFunction(this, "LogoutHandler", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: lambda_dir + "LogoutLambda.ts",
      handler: "handler",
    });

    const logout = service.addResource("logout", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const logoutIntegration = new apigateway.LambdaIntegration(logoutLambda, {
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
        {
          // [Logout Error] string match
          selectionPattern: "\\[Logout Error\\].*",
          statusCode: "400",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        },
        {
          // 500 error
          selectionPattern: "/^5\\d{2}$/",
          statusCode: "500",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        }
      ],
    });

    logout.addMethod("POST", logoutIntegration, {
      methodResponses: [
      {
        statusCode: "200",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      {
        statusCode: "400",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      {
        statusCode: "500",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      }
      ],
    });

    // FOLLOW
    const followLambda = new NodejsFunction(this, "FollowHandler", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: lambda_dir + "FollowLambda.ts",
      handler: "handler",
    });

    const follow = service.addResource("follow", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const followIntegration = new apigateway.LambdaIntegration(followLambda, {
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
        {
          // [Follow Error] string match
          selectionPattern: "\\[Follow Error\\].*",
          statusCode: "400",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        },
        {
          // 500 error
          selectionPattern: "/^5\\d{2}$/",
          statusCode: "500",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        }
      ],
    });

    follow.addMethod("POST", followIntegration, {
      methodResponses: [
      {
        statusCode: "200",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      {
        statusCode: "400",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      {
        statusCode: "500",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      }
      ],
    });

    // UNFOLLOW
    const unfollowLambda = new NodejsFunction(this, "UnfollowHandler", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: lambda_dir + "UnFollowLambda.ts",
      handler: "handler",
    });

    const unfollow = service.addResource("unfollow", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const unfollowIntegration = new apigateway.LambdaIntegration(unfollowLambda, {
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
        {
          // [Unfollow Error] string match
          selectionPattern: "\\[Unfollow Error\\].*",
          statusCode: "400",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        },
        {
          // 500 error
          selectionPattern: "/^5\\d{2}$/",
          statusCode: "500",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        }
      ],
    });

    unfollow.addMethod("POST", unfollowIntegration, {
      methodResponses: [
      {
        statusCode: "200",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      {
        statusCode: "400",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      {
        statusCode: "500",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      }
      ],
    });

    // GetIsFollowerStatus
    const getIsFollowerStatusLambda = new NodejsFunction(this, "GetIsFollowerStatusHandler", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: lambda_dir + "GetIsFollowerStatusLambda.ts",
      handler: "handler",
    });

    const getIsFollowerStatus = service.addResource("getIsFollowerStatus", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const getIsFollowerStatusIntegration = new apigateway.LambdaIntegration(getIsFollowerStatusLambda, {
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
        {
          // [GetIsFollowerStatus Error] string match
          selectionPattern: "\\[GetIsFollowerStatus Error\\].*",
          statusCode: "400",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        },
        {
          // 500 error
          selectionPattern: "/^5\\d{2}$/",
          statusCode: "500",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        }
      ],
    });

    getIsFollowerStatus.addMethod("POST", getIsFollowerStatusIntegration, {
      methodResponses: [
      {
        statusCode: "200",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      {
        statusCode: "400",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      {
        statusCode: "500",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      }
      ],
    });

    // GetFollowersCount
    const getFollowersCountLambda = new NodejsFunction(this, "GetFollowersCountHandler", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: lambda_dir + "GetFollowersCountLambda.ts",
      handler: "handler",
    });

    const getFollowersCount = service.addResource("getFollowersCount", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const getFollowersCountIntegration = new apigateway.LambdaIntegration(getFollowersCountLambda, {
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
        {
          // [GetFollowersCount Error] string match
          selectionPattern: "\\[GetFollowersCount Error\\].*",
          statusCode: "400",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        },
        {
          // 500 error
          selectionPattern: "/^5\\d{2}$/",
          statusCode: "500",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        }
      ],
    });

    getFollowersCount.addMethod("POST", getFollowersCountIntegration, {
      methodResponses: [
      {
        statusCode: "200",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      {
        statusCode: "400",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      {
        statusCode: "500",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      }
      ],
    });

    // GetFolloweesCount
    const getFolloweesCountLambda = new NodejsFunction(this, "GetFolloweesCountHandler", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: lambda_dir + "GetFolloweesCountLambda.ts",
      handler: "handler",
    });

    const getFolloweesCount = service.addResource("getFolloweesCount", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const getFolloweesCountIntegration = new apigateway.LambdaIntegration(getFolloweesCountLambda, {
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
        {
          selectionPattern: "\\[GetFolloweesCount Error\\].*",
          statusCode: "400",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        },
        {
          selectionPattern: "/^5\\d{2}$/",
          statusCode: "500",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        }
      ],
    });

    getFolloweesCount.addMethod("POST", getFolloweesCountIntegration, {
      methodResponses: [
      {
        statusCode: "200",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      {
        statusCode: "400",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      {
        statusCode: "500",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      }
      ],
    });

    // PostUpdateFeedMessagesLambda
    const postUpdateFeedMessagesLambda = new NodejsFunction(this, "PostUpdateFeedMessagesHandler", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: lambda_dir + "PostUpdateFeedMessagesLambda.ts",
      handler: "handler",
      timeout: cdk.Duration.seconds(180),
    });

    const postUpdateFeedMessages = service.addResource("postUpdateFeedMessages", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const postUpdateFeedMessagesIntegration = new apigateway.LambdaIntegration(postUpdateFeedMessagesLambda, {
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
        {
          selectionPattern: "\\[PostUpdateFeedMessages Error\\].*",
          statusCode: "400",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        },
        {
          selectionPattern: "/^5\\d{2}$/",
          statusCode: "500",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        }
      ],
    });

    postUpdateFeedMessages.addMethod("POST", postUpdateFeedMessagesIntegration, {
      methodResponses: [
      {
        statusCode: "200",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      {
        statusCode: "400",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      {
        statusCode: "500",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      }
      ],
    });

    // UpdateFeedsLambda
    const updateFeedsLambda = new NodejsFunction(this, "UpdateFeedsHandler", {
      runtime: lambda.Runtime.NODEJS_20_X,
      entry: lambda_dir + "UpdateFeedsLambda.ts",
      handler: "handler",
      timeout: cdk.Duration.seconds(180),
    });

    const updateFeeds = service.addResource("updateFeeds", {
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const updateFeedsIntegration = new apigateway.LambdaIntegration(updateFeedsLambda, {
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
        {
          selectionPattern: "\\[UpdateFeeds Error\\].*",
          statusCode: "400",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        },
        {
          selectionPattern: "/^5\\d{2}$/",
          statusCode: "500",
          responseParameters: {
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods': "'*'",
            'method.response.header.Access-Control-Allow-Headers': "'*'",
          },
        }
      ],
    });

    updateFeeds.addMethod("POST", updateFeedsIntegration, {
      methodResponses: [
      {
        statusCode: "200",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      {
        statusCode: "400",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      },
      {
        statusCode: "500",
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true,
          'method.response.header.Access-Control-Allow-Headers': true,
        },
      }
      ],
    });

    const userProfileImagesBucket = new cdk.aws_s3.Bucket(this, "ImagesBucket340", {
      bucketName: "tweeter-user-profile-images-bucket-cs340-v1",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      publicReadAccess: true,
      // objectOwnership: s3.ObjectOwnership.OBJECT_WRITER,
      // accessControl: s3.BucketAccessControl.PUBLIC_READ,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
    });

    

    // userProfileImagesBucket.grantReadWrite(registerLambda);
    // Give the Lambda access to put objects in the s3 bucket
    userProfileImagesBucket.grantReadWrite(registerLambda);
    userProfileImagesBucket.grantPublicAccess();
    userProfileImagesBucket.grantPut(registerLambda);
    userProfileImagesBucket.grantPutAcl(registerLambda);


    const userTable = new dynamodb.TableV2(this, "UserTable", {
      partitionKey: { name: "alias", type: dynamodb.AttributeType.STRING },
      tableName: "UserTable",
      billing: dynamodb.Billing.provisioned(
        {
          readCapacity: dynamodb.Capacity.fixed(1),
          writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 100 }),
          // writeCapacity: dynamodb.Capacity.fixed(100),
        }
      ),
    });

    // i want to delete the table whenever I redeploy the stack
    const feedTable = new dynamodb.TableV2(this, "FeedTable", {
      partitionKey: { name: "receiverAlias", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "timestamp", type: dynamodb.AttributeType.NUMBER },
      tableName: "FeedTable",
      billing: dynamodb.Billing.provisioned(
        {
          readCapacity: dynamodb.Capacity.fixed(1),
          writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 100 }),
        }
      ),
      
    });

    const storyTable = new dynamodb.TableV2(this, "StoryTable", {
      partitionKey: { name: "senderAlias", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "timestamp", type: dynamodb.AttributeType.NUMBER },
      tableName: "StoryTable",
      billing: dynamodb.Billing.provisioned(
        {
          readCapacity: dynamodb.Capacity.fixed(1),
          writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 1 }),
        }
      )
    });

   

    /*
Create a table named “follows”.
Partition Key: a string named “follower_handle”. This attribute stores the Twitter handle of the user who is following another user.
Sort Key: a string named “followee_handle”. This attribute stores the Twitter handle of the user who is being followed.
This Primary Key lets you query the table by “follower_handle” and sort the results by “followee_handle”.
Under 'Table Settings' click 'Customize settings'.
Adjust read & write capacities by turning autoscaling off for each and entering in the desired provisioned capacity units.  These control how fast Dynamo can read/write data to/from your table (you may need to re-adjust these for the project).
Under 'Secondary indexes' click 'create global index'.
Index Partition Key: a string named “followee_handle. This is the same “followee_handle” attribute you created in the previous step.
Index Sort Key: a string named “follower_handle”. This is the same “follower_handle” attribute you created in the previous step.
This Primary Key lets you query the index by “followee_handle” and sort the results by “follower_handle”.
Set the index name to “follows_index”.
For “Projected attributes”, keep the “All” setting.
Click 'Create table' at the bottom of the page.
    */

    const followsTable = new dynamodb.TableV2(this, "FollowersTable", {
      partitionKey: { name: "followerAlias", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "followeeAlias", type: dynamodb.AttributeType.STRING },
      tableName: "FollowersTable",
      globalSecondaryIndexes: [
        {
          indexName: "FollowsIndex",
          partitionKey: { name: "followeeAlias", type: dynamodb.AttributeType.STRING },
          sortKey: { name: "followerAlias", type: dynamodb.AttributeType.STRING },
        },
      ],
      billing: dynamodb.Billing.provisioned(
        {
          readCapacity: dynamodb.Capacity.fixed(1),
          writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 100 }),
        }
      )
    });

    const authTokenTable = new dynamodb.TableV2(this, "AuthTokenTable", {
      partitionKey: { name: "token", type: dynamodb.AttributeType.STRING },
      tableName: "AuthTokenTable",
      billing: dynamodb.Billing.provisioned(
        {
          readCapacity: dynamodb.Capacity.fixed(1),
          writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 1 }),
        }
      )
    });

   // "errorMessage": "400: AccessDeniedException: User: arn:aws:sts::691482752617:assumed-role/TweeterServiceStack-TweeterServiceGetFollowersCount-AyN4Z5pX8AUK/TweeterServiceStack-TweeterServiceGetFollowersCoun-1wfI1Snr71Er is not authorized to perform: dynamodb:Query on resource: arn:aws:dynamodb:us-east-1:691482752617:table/FollowersTable/index/FollowsIndex because no identity-based policy allows the dynamodb:Query action",

    const policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["dynamodb:PutItem",
                "dynamodb:GetItem",
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:BatchGetItem",
                "dynamodb:BatchWriteItem",
                "dynamodb:DescribeTable",
                "dynamodb:GetRecords",
                "s3:PutObject",
                "sqd:SendMessage",
                "sqs:ReceiveMessage",
              ],
      resources: [userTable.tableArn,
                  feedTable.tableArn,
                  storyTable.tableArn,
                  followsTable.tableArn,
                  `${followsTable.tableArn}/index/FollowsIndex`,
                  authTokenTable.tableArn,
                  userProfileImagesBucket.bucketArn],
    });

    loginLambda.addToRolePolicy(policy);
    registerLambda.addToRolePolicy(policy);
    getUserLambda.addToRolePolicy(policy);
    loadMoreFollowersLambda.addToRolePolicy(policy);
    loadMoreFolloweesLambda.addToRolePolicy(policy);
    loadMoreFeedItemsLambda.addToRolePolicy(policy);
    loadMoreStoryItemsLambda.addToRolePolicy(policy);
    postStatusLambda.addToRolePolicy(policy);
    logoutLambda.addToRolePolicy(policy);
    followLambda.addToRolePolicy(policy);
    unfollowLambda.addToRolePolicy(policy);
    getIsFollowerStatusLambda.addToRolePolicy(policy);
    getFollowersCountLambda.addToRolePolicy(policy);
    getFolloweesCountLambda.addToRolePolicy(policy);
    postUpdateFeedMessagesLambda.addToRolePolicy(policy);
    updateFeedsLambda.addToRolePolicy(policy);


    // Create a SQS Post Status Queue and give post status lambda permission to send messages to it and postUpdateFeedMessagesLambda permission to receive messages from it
    const postStatusQueue = new sqs.Queue(this, "PostStatusQueue", {
      visibilityTimeout: cdk.Duration.seconds(300),
    });
    postStatusQueue.grantSendMessages(postStatusLambda);
    postStatusQueue.grantConsumeMessages(postUpdateFeedMessagesLambda);

    // Create a SQS Update Feed Queue and give postUpdateFeedMessagesLambda permission to send messages to it and updateFeedLambda permission to receive messages from it
    const updateFeedQueue = new sqs.Queue(this, "UpdateFeedQueue", {
      visibilityTimeout: cdk.Duration.seconds(300),
    });
    updateFeedQueue.grantSendMessages(postUpdateFeedMessagesLambda);
    updateFeedQueue.grantConsumeMessages(updateFeedsLambda);

    // Make the postUpdateFeedMessagesLambda trigger on messages from the postStatusQueue
    postUpdateFeedMessagesLambda.addEventSource(new SqsEventSource(postStatusQueue, {
      batchSize: 1,
    }));

    // Make the updateFeedsLambda trigger on messages from the updateFeedQueue
    updateFeedsLambda.addEventSource(new SqsEventSource(updateFeedQueue, {
      batchSize: 1,
    }));
  }
}