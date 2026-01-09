# Code to backup docker images to Docker Hub
## List all docker images
```bash
docker images


REPOSITORY                     TAG             IMAGE ID       CREATED       SIZE
mcr.microsoft.com/playwright   v1.40.0-focal   e05d5c146063   2 years ago   2.76GB
e2e-runner                     latest          96abe269739f   10 days ago   4.63GB
project-e2e-runner             latest          838bbf322f9e   10 days ago   4.63GB
project-frontend               latest          9b9c1bef4615   10 days ago   1.4GB
project-backend                latest          eb50e9019b9f   10 days ago   775MB
project-app                    latest          44d56b741df5   10 days ago   755MB
```

## List all containers (running + stopped)
```bash
docker ps -a


CONTAINER ID   IMAGE              COMMAND                  CREATED       STATUS                     PORTS     NAMES
df149b2b48b3   project-backend    "sh -c 'python init_…"   9 days ago    Exited (137) 9 days ago              finnish-backend
edeae69e7cf8   project-frontend   "docker-entrypoint.s…"   10 days ago   Exited (0) 9 days ago                finnish-frontend
f6bbc2d95ee8   project-app        "sh -c 'python init_…"   10 days ago   Exited (137) 10 days ago             project-app-1
```

## Check disk usage by Docker
```bash
docker system df


TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          6         3         28.35GB   25.7GB (90%)
Containers      3         0         786.4kB   786.4kB (100%)
Local Volumes   14        2         1.483GB   1.104GB (74%)
Build Cache     215       0         18.75GB   18.75GB
```

## Tag and Push Images to Docker Hub

### Tag and push the development and QA images as 'dev'

```bash
docker tag mcr.microsoft.com/playwright:v1.40.0-focal kaiquanmah0/aidevtools-w4-finnish-learner-playwright:dev
docker tag e2e-runner:latest kaiquanmah0/aidevtools-w4-finnish-learner-e2e-runner:dev
docker tag project-e2e-runner:latest kaiquanmah0/aidevtools-w4-finnish-learner-project-e2e-runner:dev

docker push kaiquanmah0/aidevtools-w4-finnish-learner-playwright:dev
docker push kaiquanmah0/aidevtools-w4-finnish-learner-e2e-runner:dev
docker push kaiquanmah0/aidevtools-w4-finnish-learner-project-e2e-runner:dev
```


### Tag and push the production images as 'prod'
```bash
docker tag project-frontend:latest kaiquanmah0/aidevtools-w4-finnish-learner-project-frontend:prod
docker tag project-backend:latest kaiquanmah0/aidevtools-w4-finnish-learner-project-backend:prod
docker tag project-app:latest kaiquanmah0/aidevtools-w4-finnish-learner-project-app:prod


docker push kaiquanmah0/aidevtools-w4-finnish-learner-project-frontend:prod
docker push kaiquanmah0/aidevtools-w4-finnish-learner-project-backend:prod
docker push kaiquanmah0/aidevtools-w4-finnish-learner-project-app:prod
```


## Clean up / prune unused docker containers

* `docker system prune` safety features
  * wont delete tagged images or volumes by default
  * prompts for confirmation

```bash
docker system prune


WARNING! This will remove:
  - all stopped containers
  - all networks not used by at least one container
  - all dangling images
  - unused build cache

Are you sure you want to continue? [y/N] y

Deleted Containers:
df149b2b48b38c3d5f3909d746226cfbda3b2ef38934f3394b4821ccc45301cf
edeae69e7cf80758fedfb37023bf8ce93d96d4838862b5e7f5b5689535dccaf6
f6bbc2d95ee8dcfd006f1c9c1022ce62a534b591500a81bc7c3fe26b73a69a08

Deleted Networks:
1-dimensional-data-modeling_pg-network
project_default
1-dimensional-data-modeling_default

Deleted build cache objects:
79pftwi98dw4401m4dl054upi
ky3i0lvle19t2826qoif6zn4i
...
eni5r9u4rowdq6e0sigq92c9f

Total reclaimed space: 18.75GB
```


* Check disk usage by Docker again
```bash
docker system df


TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          6         0         13.35GB   13.35GB (100%)
Containers      0         0         0B        0B
Local Volumes   14        0         1.483GB   1.483GB (100%)
Build Cache     21        0         0B        0B
```


* Remove ALL unused images (not just dangling) + everything above
  * This deletes any image not associated with a running/stopped container.
  * Good if you only want to keep images actively in use.
  * ALSO prompts for notification
```bash
docker system prune -a


WARNING! This will remove:
  - all stopped containers
  - all networks not used by at least one container
  - all images without at least one container associated to them
  - all build cache

Are you sure you want to continue? [y/N] y


Deleted Images:
untagged: project-e2e-runner:latest
untagged: kaiquanmah0/aidevtools-w4-finnish-learner-playwright:dev
untagged: project-backend:latest
untagged: project-frontend:latest
untagged: mcr.microsoft.com/playwright:v1.40.0-focal
untagged: kaiquanmah0/aidevtools-w4-finnish-learner-e2e-runner:dev
untagged: kaiquanmah0/aidevtools-w4-finnish-learner-project-app:prod
untagged: kaiquanmah0/aidevtools-w4-finnish-learner-project-backend:prod
deleted: sha256:eb5...7386
untagged: kaiquanmah0/aidevtools-w4-finnish-learner-project-e2e-runner:dev
untagged: kaiquanmah0/aidevtools-w4-finnish-learner-project-frontend:prod
untagged: e2e-runner:latest
untagged: project-app:latest

Deleted build cache objects:
rbrmk9m9dyz88z0ru7p77epya
...
ivveb6r7prg28ghzsf2wxnwgr

Total reclaimed space: 7.385GB
```


* Check disk usage by Docker again
```bash
docker system df


TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          0         0         0B        0B
Containers      0         0         0B        0B
Local Volumes   14        0         1.483GB   1.483GB (100%)
Build Cache     0         0         0B        0B
```


* Cleanup database/volume files, i.e. persistent data
```bash
# command 1 - remove anonymous local volumes not used by at least one container
docker volume prune

WARNING! This will remove anonymous local volumes not used by at least one container.
Are you sure you want to continue? [y/N] y
Deleted Volumes:
7a7837179958ca71ee68bfd6d6f6ed488a6f02e9e4557cbd438ff955c7aca4ce
...
14ffcd7efc68b20070eb505b92ae4fa105572ec54d596c2f4d9e0fae0a0a030c

Total reclaimed space: 1.245GB




# command 2 - remove all local volumes
docker volume rm $(docker volume ls -q)
1-dimensional-data-modeling_pgadmin-data
1-dimensional-data-modeling_postgres-data
project_app_data
```


* Check disk usage by Docker again
```bash
docker system df
TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          0         0         0B        0B
Containers      0         0         0B        0B
Local Volumes   0         0         0B        0B
Build Cache     0         0         0B        0B
```


