# Kubernetes - File Processor App

## Application Overview

This is a simple full-stack application deployed in a Kubernetes environment.

### Features:
- Upload `.txt`, `.csv`, or `.json` files via a web interface.
- Process each file in the backend (counting lines, words, transforming data).
- Save the output to a shared `output/` directory.

The backend is built with **Node.js + Express**, the frontend with **Vue 3**, and the system runs in Kubernetes with a persistent volume for file storage.

---

 Deployment Instructions

1. Prerequisites
- Running Kubernetes cluster (Minikube or Docker Desktop).
- `kubectl` configured and connected to the cluster.

```bash
kubectl cluster-info
```
2. Clone the repository and navigate to the root directory.
3. Build and push your Docker images (if not using local images)
4. Apply all Kubernetes configuration files (run command in app root):
``` bash
kubectl create namespace kuber  # only if not created by YAML
kubectl apply -f k8s/
```

5. Wait for all pods to be in Running state:
``` bash
kubectl get pods -n kuber
```
6. Access the application in your browser at:
``` bash
- Frontend URL: http://localhost:30390
- Backend API: http://localhost:30091
```

---
## How to Test the Application
1. Open your browser and go to: http://localhost:30390

2. Click the "Upload file" and select  a .txt, .csv, or .json file. in the UI.

3. Upload - the file is uploaded to persistent volume (input/)

4. Process – the file is processed by the backend and stored in persistent volume (output/).

5. Result is saved in `output/` and visible in the interface

Alternatively, test the backend directly via Postman or curl:

```bash

# Upload file
curl -F "file=@input.txt" http://localhost:30091/upload

# Get processed files list
curl http://localhost:30091/processed

```
To delete all resources after testing:
```bash
kubectl delete -f k8s/
# or specific pod
kubectl delete deployment kuber-fe 
```
---
## ⚙️ Kubernetes Components Overview
| Component                 | Description                                          |
| ------------------------- | ---------------------------------------------------- |
| **Namespace**             | `exam-elfo`                                          |
| **ConfigMap**             | App config (upload dir, allowed file types)          |
| **Secret**                | DockerHub secret token (regcred)                     |
| **PersistentVolume**      | Host path to store uploaded and output files         |
| **PersistentVolumeClaim** | Requests shared volume for pods                      |
| **Deployment (FE)**       | Vue frontend with health checks                      |
| **Deployment (BE)**       | Node.js processor with InitContainer for volume prep |
| **Services**              | NodePort access for frontend and backend             |
| **Ingress** (optional)    | Can be added for domain-based routing                |

