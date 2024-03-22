import { TweeterRequest } from 'tweeter-shared';
import { TweeterResponse } from 'tweeter-shared';

export class ClientCommunicator {
  private SERVER_URL: string;
  constructor(SERVER_URL: string) {
    this.SERVER_URL = SERVER_URL;
  }



  async doPost<T extends TweeterRequest, RES extends TweeterResponse>(req: T, endpoint: string): Promise<RES> {
    const url = this.SERVER_URL + endpoint;
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    };

    try {
      const resp: Response = await fetch(url, request);
      if (resp.ok) {
        const response: RES = await resp.json();
        return response;
      } else {
        const error = await resp.json();
        throw new Error(error.errorMessage);
      }
    } catch (error) {
      throw new Error(
        "Client Communicator: Error in doPost:\n @ endpoint: " + endpoint + "\n" + (error as Error).message
      );
    }
  }
}