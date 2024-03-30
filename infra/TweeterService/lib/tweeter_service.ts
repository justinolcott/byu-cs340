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
  }
}