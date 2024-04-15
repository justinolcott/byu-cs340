import { Buffer } from "buffer";
import { User, AuthToken, FakeData } from "tweeter-shared";
import { Factory } from "../../dao/DAOInterfaces";
// import { compareSync, hashSync } from "bcrypt";
import { compareSync, hashSync } from "bcryptjs";


export class UserService {
  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
      const storedHash = await Factory.instance().createUserTableDAO().getHash(alias);
      if (storedHash === null) {
        throw new Error("Invalid alias or password");
      }

      const isValid = await compareSync(password, storedHash);
      if (!isValid) {
        throw new Error("Invalid alias or password");
      }

      let user = await Factory.instance().createUserTableDAO().getUser(alias);
      if (user === null) {
        throw new Error("Invalid alias or password");
      }

      const authToken = AuthToken.Generate();
      const success = await Factory.instance().createAuthTokenTableDAO().putAuthToken(authToken, alias);
      if (!success) {
        throw new Error("Error with AuthToken.");
      }

      return [user, authToken];
  };

  public async logout(authToken: AuthToken): Promise<void> {
    await Factory.instance().createAuthTokenTableDAO().deleteAuthToken(authToken.token);
  };

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageString: string
  ): Promise<[User, AuthToken]> {
    const url = await Factory.instance().createProfileImageDAO().putImage(alias, userImageString);
    const user = new User(
      firstName,
      lastName,
      alias,
      url
    );
    const hash:string = await hashSync(password, 10);

    // Does the alias already exist?
    const existingUser = await Factory.instance().createUserTableDAO().getUser(alias);
    if (existingUser !== null) {
      throw new Error("Alias already exists");
    }

    Factory.instance().createUserTableDAO().putUser(
      user,
      hash,
      0,
      0
    );

    if (user === null) {
      throw new Error("Invalid registration");
    }

    const authToken = AuthToken.Generate();
    const success = await Factory.instance().createAuthTokenTableDAO().putAuthToken(authToken, alias);
    if (!success) {
      throw new Error("Error with AuthToken.");
    }
    
    return [user, authToken];
  };


  public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    if (!AuthToken.isValid(authToken)) {
      throw new Error("Invalid AuthToken");
    }

    await Factory.instance().createAuthTokenTableDAO().updateAuthToken(authToken);
    return await Factory.instance().createUserTableDAO().getUser(alias);
  };
}