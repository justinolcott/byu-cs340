import { AuthToken } from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";
import "isomorphic-fetch";

describe('ServerFacade', () => {
  let serverFacade: ServerFacade;

  beforeEach(() => {
    serverFacade = new ServerFacade();
  });

  it('Register', async () => {
    const response = await serverFacade.register(
      {
        firstName: 'firstName',
        lastName: 'lastName',
        alias: 'alias',
        password: 'password',
        userImageString: "randomString"
      }
    );

    console.log(response);

    expect(response.success).toBeTruthy();
    expect(response.user).toBeDefined();
    expect(response.token).toBeDefined();

    const expected_response = `{
      "success": true,
      "user": {
          "firstName": "Allen",
          "lastName": "Anderson",
          "alias": "@allen",
          "imageUrl": "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
      },
      "token": {
          "token": "3c79236c-c3b4-4b7b-878f-be500f6d17fd",
          "timestamp": 1711387162654
      },
      "message": null
  }`;
    expect(response.user.alias).toEqual('@allen');
    expect(response.user.firstName).toEqual('Allen');
    expect(response.user.lastName).toEqual('Anderson');
    expect(response.user.imageUrl).toEqual('https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png');

  });

  it('GetFollowers', async () => {
    const request = {
      authToken : {
        token: 'token',
        timestamp: 0
      },
      user: {
        firstName: 'Allen',
        lastName: 'Anderson',
        alias: '@allen',
        imageUrl: "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
      },
      pageSize: 10,
      lastItem: null
    };
    const response = await serverFacade.loadMoreFollowees(request);

    expect(response.success).toBeTruthy();
    expect(response.users).toBeDefined();
    expect(response.hasMorePages).toBeDefined();
    expect(response.users.length).toBeGreaterThan(0);

    let lastItem = response.users[response.users.length - 1];
    const request2 = {
      authToken : {
        token: 'token',
        timestamp: 0
      },
      user: {
        firstName: 'Allen',
        lastName: 'Anderson',
        alias: '@allen',
        imageUrl: "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
      },
      pageSize: 10,
      lastItem: lastItem
    };
    const response2 = await serverFacade.loadMoreFollowees(request2);

    expect(response2.success).toBeTruthy();
    expect(response2.users).toBeDefined();
    expect(response2.hasMorePages).toBeDefined();
    expect(response2.users.length).toBeGreaterThan(0);
  });

  it('GetCount', async () => {
    const request = {
      authToken : {
        token: 'token',
        timestamp: 0
      },
      user: {
        firstName: 'Allen',
        lastName: 'Anderson',
        alias: '@allen',
        imageUrl: "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"
      }
    };

    const response = await serverFacade.getFollowersCount(request);
    expect(response.success).toBeTruthy();
    expect(response.followersCount).toEqual(20);

    const response2 = await serverFacade.getFolloweesCount(request);
    expect(response2.success).toBeTruthy();
    expect(response2.followeesCount).toEqual(10);

    const request2 = {
      authToken : {
        token: 'token',
        timestamp: 0
      },
      user: {
        firstName: 'Amy',
        lastName: 'Ames',
        alias: '@amy',
        imageUrl: "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/daisy_duck.png"
      }
    };

    const response3 = await serverFacade.getFollowersCount(request2);
    expect(response3.success).toBeTruthy();
    expect(response3.followersCount).toEqual(21);

    const response4 = await serverFacade.getFolloweesCount(request2);
    expect(response4.success).toBeTruthy();
    expect(response4.followeesCount).toEqual(11);
  });

});