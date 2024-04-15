import { SQSEvent } from "aws-lambda";
import { StatusService } from "../model/service/StatusService";
import { Status, User } from "tweeter-shared";


export const handler = async (event: SQSEvent): Promise<void> => {
  console.log("EVENT:");
  console.log(event);
  /** body
   * {"status":{"_post":"hello","_user":{"_firstName":"mainfirstName","_lastName":"mainlastName","_alias":"mainalias","_imageUrl":"https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"},"_timestamp":1713199155574,"_segments":[{"_text":"hello","_startPostion":0,"_endPosition":5,"_type":"Text"}]},"followers":["alias4599","alias46","alias460","alias4600","alias4601","alias4602","alias4603","alias4604","alias4605","alias4606","alias4607","alias4608","alias4609","alias461","alias4610","alias4611","alias4612","alias4613","alias4614","alias4615","alias4616","alias4617","alias4618","alias4619","alias462","alias4620","alias4621","alias4622","alias4623","alias4624","alias4625","alias4626","alias4627","alias4628","alias4629","alias463","alias4630","alias4631","alias4632","alias4633","alias4634","alias4635","alias4636","alias4637","alias4638","alias4639","alias464","alias4640","alias4641","alias4642","alias4643","alias4644","alias4645","alias4646","alias4647","alias4648","alias4649","alias465","alias4650","alias4651","alias4652","alias4653","alias4654","alias4655","alias4656","alias4657","alias4658","alias4659","alias466","alias4660","alias4661","alias4662","alias4663","alias4664","alias4665","alias4666","alias4667","alias4668","alias4669","alias467","alias4670","alias4671","alias4672","alias4673","alias4674","alias4675","alias4676","alias4677","alias4678","alias4679","alias468","alias4680","alias4681","alias4682","alias4683","alias4684","alias4685","alias4686","alias4687","alias4688"]}
   */
  try {
    const message = JSON.parse(event.Records[0].body);
    const newStatus = new Status(
      message.status._post,
      new User(
        message.status._user._firstName,
        message.status._user._lastName,
        message.status._user._alias,
        message.status._user._imageUrl,
      
      ),
      message.status._timestamp,
    );
    const followers = message.followers;
    await new StatusService().updateFeeds(newStatus, followers);
  }
  catch (e) {
    throw new Error(`400: ${e}`);
  }
};

  
