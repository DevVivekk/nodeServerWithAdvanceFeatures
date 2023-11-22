// Example interceptor
let request = [];
const interceptor = ((req, res, next) => {
    // Perform some tasks before the route handler is called
    const time = new Date().getHours()+new Date().getMinutes();
    console.log('Interceptor: got a request at', time);
    request.push(time);
    // Modify the request or response if needed and add a custom property;
    req.intercept = `LATEST REQUEST WAS MADE AT = ${request[request.length-1]} `;

    // Call the next middleware
    next();
  });

  module.exports = {interceptorfile:{
    interceptor,request
  }}