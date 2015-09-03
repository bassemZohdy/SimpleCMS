# SimpleCMS
SimpleCMS is Demo of using NodeJs Restify, Yeoman, grunt, Angularjs 

this is init version so there is no code clean done on it yet :D

#Using Dockerfile:
I'm using dockerfile as there was many issues for installing ENV of this application so, now you just need to get Docker file only and follow below steps:
+ copy Dockerfile in empty folder
+ run : docker build -t simple-cms . {it will take some time}
+ then run : docker run -i -t -p 9000:9000 simple-cms {this will open terminal on the docker container of my image}
  + nohup mongod &  {wait for mongod to start it is taking some time you cant tail -f nohup.out}
  + cd /SimpleCMS/RestService/
  + node index.js &
  + cd /SimpleCMS/WebApp/
  + grunt serve &
  + from browser http://localhost:9000

#Building Application without Docker
Steps to run application:
+ install mongod and start it in default port
+ install node,npm,bower
+ run rest service from RestService:
  + npm update
  + node index.js
+ run web application from WebApp
  + npm update
  + bower update
  + install grunt-cli if not have
  + grunt serve
