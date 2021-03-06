# Treasure_Hunt
An online Treasure hunt game based on questions and clues. Capable of conducting multiple contests at same time.

## FrontEnd
Please find the React frontend for this app in the [link](https://github.com/Benin-Tom-Jose/treasure-hunt-frontend)

## Stack
* NodeJs,ExpresJs
* Google Oauth
* MongoDb
* Docker
* Jenkins
* AWS

## Local Deployment

1. git clone https://github.com/sebin-vincent/Treasure_Hunt.git

2. cd Treasure_Hunt

3. Install npm

4. Run <b>Unit Test</b>
```
npm run test:unit
```

5. Run <b>Integration Test</b>
```
npm run test:integration
```

6. Generate RSA256 public_key/private_key pairs for JWT token generation and verification
```
openssl genrsa -out ./private.key 4096
openssl rsa -in private.key -pubout -outform PEM -out public.key
```
Refer link [jwt-private-public-key-generation](https://docs.mia-platform.eu/docs/runtime_suite/client-credentials/jwt-private-public-key-generation)


7. create file env.list with arguments (ex: NODE_ENV,dbUser,dbPassword) like below
```
NODE_ENV=development
dbUser=<dbUserName>
dbPassword=<dbPassword>
```

8. Build docker image
```
docker build -t treaure_hunt_image
```

9. Run docker container
```
docker run --env-file .\env.list -d --name treasure_hunt -p 8081:8081 treasure-hunt
```

10. To stop and remove container
```
docker rm -f treasure-hunt
```



                                    
                                     
                                     
                                     


