import { AuthenticateResponse, GetUserRequest, GetUserResponse, LoginRequest, RegisterRequest, User } from 'tweeter-shared';
import { ClientCommunicator } from "./ClientCommunicator";
import { LoadMoreFollowsRequest } from 'tweeter-shared';
import { LoadMoreFollowsResponse } from 'tweeter-shared';
import { LoadMoreStatusesRequest, LoadMoreStatusesResponse } from 'tweeter-shared';
import { PostStatusRequest, PostStatusResponse } from 'tweeter-shared';
import { LogoutRequest, LogoutResponse } from 'tweeter-shared';
import { FollowRequest, FollowResponse } from 'tweeter-shared';
import { UnfollowRequest, UnfollowResponse } from 'tweeter-shared';
import { GetIsFollowerStatusRequest, GetIsFollowerStatusResponse } from 'tweeter-shared';
import { GetFolloweesCountRequest, GetFolloweesCountResponse } from 'tweeter-shared';
import { GetFollowersCountRequest, GetFollowersCountResponse } from 'tweeter-shared';

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

  async logout(request: LogoutRequest): Promise<LogoutResponse> {
    const endpoint = "service/logout";
    return await this.clientCommunicator.doPost<LogoutRequest, LogoutResponse>(request, endpoint);
  }

  async follow(request: FollowRequest): Promise<FollowResponse> {
    const endpoint = "service/follow";
    return await this.clientCommunicator.doPost<FollowRequest, FollowResponse>(request, endpoint);
  }

  async unfollow(request: UnfollowRequest): Promise<UnfollowResponse> {
    const endpoint = "service/unfollow";
    return await this.clientCommunicator.doPost<UnfollowRequest, UnfollowResponse>(request, endpoint);
  }

  async getIsFollowerStatus(request: GetIsFollowerStatusRequest): Promise<GetIsFollowerStatusResponse> {
    const endpoint = "service/getIsFollowerStatus";
    return await this.clientCommunicator.doPost<GetIsFollowerStatusRequest, GetIsFollowerStatusResponse>(request, endpoint);
  }

  async getFolloweesCount(request: GetFolloweesCountRequest): Promise<GetFolloweesCountResponse> {
    const endpoint = "service/getFolloweesCount";
    return await this.clientCommunicator.doPost<GetFolloweesCountRequest, GetFolloweesCountResponse>(request, endpoint);
  }

  async getFollowersCount(request: GetFollowersCountRequest): Promise<GetFollowersCountResponse> {
    const endpoint = "service/getFollowersCount";
    return await this.clientCommunicator.doPost<GetFollowersCountRequest, GetFollowersCountResponse>(request, endpoint);
  }
}