This is a chatserver app.Its a node js app using mongodb for persistent data. I would like to this on kubernetes cluster.
For kubernetes setup i have included dynamical nfs provisioning but can do without.

1). deploy the storage-class

2). deploy the nfs-deployment

3). deploy the pvc

#the above steps needs nfs to be running

4). deploy mongodb deployment
#after the deployment run the kubectl get pod to see if they are all running then:
  - Kubectl exec -ti mongo-0 -- mongo
  - rs.initiate()
  - var cfg = rs.conf()
  - cfg.members[0].host="mongo-0.mongo:27017"
  - rs.reconfig(cfg)
  - rs.ad("mongo-1.mongo:27017")
  - rs.ad("mongo-2.mongo:27017")
  - rs.status()
  - you should see the dns names of the mongo pods ie. mongo-0.mongo,mongo-1.mongo,mongo-2.mongo

5). create the web image from the dockerfile and use it in the web yaml

6). deploy the web yaml with the image created in step 5

7). deploy web service

8). then access the app from browse......no loadbalance provision.....the idea is to send data and have it stored on mongodb

you are welcome to change it however as long as it can save the data to the database. ofcourse commments would go a long way in understanding the change

LETS CODE!!!
