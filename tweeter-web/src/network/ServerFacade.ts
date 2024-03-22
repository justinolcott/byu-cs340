import { AuthenticateResponse, GetUserRequest, GetUserResponse, LoginRequest, RegisterRequest, User } from 'tweeter-shared';
import { ClientCommunicator } from "./ClientCommunicator";
import { LoadMoreFollowsRequest } from 'tweeter-shared';
import { LoadMoreFollowsResponse } from 'tweeter-shared';
import { LoadMoreStatusesRequest, LoadMoreStatusesResponse } from 'tweeter-shared';
import { PostStatusRequest, PostStatusResponse } from 'tweeter-shared';


export class ServerFacade {
  private SERVER_URL: string = "https://bcd7nyx1si.execute-api.us-east-1.amazonaws.com/prod/";
  private clientCommunicator: ClientCommunicator = new ClientCommunicator(this.SERVER_URL);

  async login(request: LoginRequest): Promise<AuthenticateResponse> {
    const endpoint = "service/login";
    return await this.clientCommunicator.doPost<LoginRequest, AuthenticateResponse>(request, endpoint);
  }

  async register(request: RegisterRequest): Promise<AuthenticateResponse> {
    const endpoint = "service/register";
    return await this.clientCommunicator.doPost<RegisterRequest, AuthenticateResponse>(request, endpoint);
  }

  async getUser(request: GetUserRequest): Promise<GetUserResponse> {
    const endpoint = "service/getUser";
    return await this.clientCommunicator.doPost<GetUserRequest, GetUserResponse>(request, endpoint);
  }

  async loadMoreFollowers(request: LoadMoreFollowsRequest): Promise<LoadMoreFollowsResponse> {
    const endpoint = "service/loadMoreFollowers";
    return await this.clientCommunicator.doPost<LoadMoreFollowsRequest, LoadMoreFollowsResponse>(request, endpoint);
  }

  async loadMoreFollowees(request: LoadMoreFollowsRequest): Promise<LoadMoreFollowsResponse> {
    const endpoint = "service/loadMoreFollowees";
    return await this.clientCommunicator.doPost<LoadMoreFollowsRequest, LoadMoreFollowsResponse>(request, endpoint);
  }

  async loadMoreStoryItems(request: LoadMoreStatusesRequest): Promise<LoadMoreStatusesResponse> {
    const endpoint = "service/loadMoreStoryItems";
    return await this.clientCommunicator.doPost<LoadMoreStatusesRequest, LoadMoreStatusesResponse>(request, endpoint);
  }

  async loadMoreFeedItems(request: LoadMoreStatusesRequest): Promise<LoadMoreStatusesResponse> {
    const endpoint = "service/loadMoreFeedItems";
    return await this.clientCommunicator.doPost<LoadMoreStatusesRequest, LoadMoreStatusesResponse>(request, endpoint);
  }

  async postStatus(request: PostStatusRequest): Promise<PostStatusResponse> {
    const endpoint = "service/postStatus";
    return await this.clientCommunicator.doPost<PostStatusRequest, PostStatusResponse>(request, endpoint);
  }
}