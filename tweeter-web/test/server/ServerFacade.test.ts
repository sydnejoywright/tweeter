import { ServerFacade } from "../../src/network/ServerFacade";
import {
  User,
  AuthToken,
  PagedUserItemRequest,
  GetFollowCountRequest,
} from "tweeter-shared";

import fetch from "node-fetch";
(global as any).fetch = fetch;


describe("ServerFacade (integration)", () => {
  let sf: ServerFacade;

  beforeAll(() => {
    sf = new ServerFacade();
  });

  it("registers a user and returns User and AuthToken", async () => {
    const alias = `@integrationTestUser${Date.now()}`;
    const request = {
      firstName: "Integration",
      lastName: "Tester",
      alias,
      password: "password123",
      userImageBase64: "", 
    } as any;

    const [user, authToken] = await sf.register(request);

    expect(user).toBeInstanceOf(User);
    expect(user.alias).toBe("@allen");
    expect(user.firstName).toBe("Integration");
    expect(authToken).toBeInstanceOf(AuthToken);
  });

  it("logs in a user and returns User and AuthToken", async () => {
    const alias = `@integrationTestUser${Date.now()}`;
    const password = "password123";

    const [user, authToken] = await sf.login({alias: alias, password: password});

    expect(user).toBeInstanceOf(User);
    expect(user.alias).toBe("@allen");
    expect(authToken).toBeInstanceOf(AuthToken);
  });

  it("fetches followers and returns an array of Users with hasMore flag", async () => {
    const req: PagedUserItemRequest = {
      token: await getAuthToken(), // helper function to log in and get a token
      userAlias: "@someUser",
      pageSize: 10,
      lastItem: null,
    };

    const [users, hasMore] = await sf.getMoreFollowers(req);

    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeLessThanOrEqual(req.pageSize);
    if (users.length > 0) expect(users[0]).toBeInstanceOf(User);
    expect(typeof hasMore).toBe("boolean");
  });

  it("fetches follower count and returns a number", async () => {
    const req: GetFollowCountRequest = {
      token: await getAuthToken(),
      user: {
        firstName: "Some",
        lastName: "User",
        alias: "@someUser",
        imageUrl: "",
      } as any,
    };

    const count = await sf.getFollowerCount(req);

    expect(typeof count).toBe("number");
    expect(count).toBeGreaterThanOrEqual(0);
  });

  /**
   * Helper function to log in a user and get an auth token for integration tests.
   */
  async function getAuthToken(): Promise<string> {
    const [_, authToken] = await sf.login({alias: `@integrationTestUser${Date.now()}`, password: "password123"});
    return authToken.token;
  }
});
