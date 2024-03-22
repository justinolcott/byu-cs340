import { handler } from './lambda/LoadMoreFeedItemsLambda';


const raw_input = {"authToken":{"_token":"23971388-9ac8-4061-b12f-513f50cf359f","_timestamp":1711083980922},"user":{"_firstName":"Allen","_lastName":"Anderson","_alias":"@allen","_imageUrl":"https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png"},"pageSize":10,"lastItem":{"_post":"Post 0 9\n        My friend @frank likes this website: http://byu.edu. Do you? \n        Or do you prefer this one: http://cs.byu.edu?","_user":{"_firstName":"Elizabeth","_lastName":"Engle","_alias":"@elizabeth","_imageUrl":"https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/daisy_duck.png"},"_timestamp":270000000000,"_segments":[{"_text":"Post 0 9","_startPostion":0,"_endPosition":7,"_type":"Text"},{"_text":"\n","_startPostion":8,"_endPosition":9,"_type":"Newline"},{"_text":"        My friend ","_startPostion":9,"_endPosition":26,"_type":"Text"},{"_text":"@frank","_startPostion":27,"_endPosition":33,"_type":"Alias"},{"_text":" likes this website: ","_startPostion":33,"_endPosition":53,"_type":"Text"},{"_text":"http://byu.edu","_startPostion":54,"_endPosition":68,"_type":"URL"},{"_text":". Do you? ","_startPostion":68,"_endPosition":77,"_type":"Text"},{"_text":"\n","_startPostion":78,"_endPosition":79,"_type":"Newline"},{"_text":"        Or do you prefer this one: ","_startPostion":79,"_endPosition":113,"_type":"Text"},{"_text":"http://cs.byu.edu","_startPostion":114,"_endPosition":131,"_type":"URL"},{"_text":"?","_startPostion":131,"_endPosition":132,"_type":"Text"}]}}
const input = JSON.parse(JSON.stringify(raw_input));
console.log(input.lastItem._user);

const output = handler(input);


// I want to test LoadMoreFeedItemsLambda.ts
console.log("Starting");
output.then((response) => {
  console.log(response);
}).catch((error) => {
  console.log(error);
}
);
