Some useful commands for Docker. Quick and messy for now

```
docker build -t slack-kitchen-duty-bot-v2 .
```

```
docker run -p 3000:3000 slack-kitchen-duty-bot-v2
```

```
docker-machine create dev2 --driver virtualbox --virtualbox-disk-size "5000" --virtualbox-cpu-count 2 --virtualbox-memory "4112"
```

```
docker-machine ls
```

```
ngrok http 3000
```

```
heroku container:push web -a slack-kitchen-duty-app
```

```
heroku container:release web -a slack-kitchen-duty-app
```