const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

secret = "IlovebeingaPokemon"

data = {
  id: 5
}

var token = jwt.sign(data,secret)
console.log(token);

var decoded = jwt.verify(token,"123");

console.log('decoded',decoded);

// var message = "Hello world my name is lance";
//
// var encryptedMessage = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`encryptedMessage: ${encryptedMessage}`);
//
// // var secret = "An awesome secret message";
// var secret = "";
//
// function myHash(data) {return SHA256(JSON.stringify(data) + secret).toString();}
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: myHash(data)
// }
//
// token.data.id = 5;
//
//
// var resultHash = myHash(token.data);
// token.hash = SHA256(JSON.stringify(data)).toString();;
//
// console.log("Token hash:" + token.hash);
// console.log("Rslt. hash:" + resultHash);
//
// if(resultHash == token.hash){
//   console.log("Data was not changed");
// }else{
//   console.log("// WARNING: DATA WAS CHANGED");
// }
