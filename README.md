# Kubernetes Deployment – Image Upload Web Application

## Application Overview

This is a simple full-stack application deployed in a Kubernetes environment. It allows users to **upload image files** through a web interface built in **Vue 3**, which are then stored on a persistent volume and displayed in a **gallery**. The backend is a **Node.js** server using **Express**, which handles image upload, file serving, and listing.

### Features:
- Upload image files via a modal dialog
- Store files on a persistent volume
- View uploaded images as a responsive gallery
- Application dynamically fetches image list from backend
- Basic readiness and liveness health checks for both backend and frontend

---

 Deployment Instructions

1. Make sure your Kubernetes cluster is running:
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
- Frontend URL: http://localhost:30380
- Backend API: http://localhost:30080
```

---
## How to Test the Application
1. Open your browser and go to: http://localhost:30380

2. Click the "Add Image" button in the UI.

3. Select an image file and click Upload.

4. The image should appear in the gallery after a short delay.

Alternatively, test the backend directly via Postman or curl:

```bash

# List uploaded images
curl http://localhost:30080/api/images

# Upload image
curl -F "image=@path/to/your/file.jpg" http://localhost:30080/upload

```
To delete all resources after testing:
```bash
kubectl delete -f k8s/
# or specific pod
kubectl delete deployment kuber-fe 
```
---
## ⚙️ Kubernetes Components Overview
| Component                 | Description                                                           |
| ------------------------- | --------------------------------------------------------------------- |
| **Namespace**             | Isolated environment named `kuber`                                    |
| **ConfigMap**             | Provides upload directory and allowed file types to backend           |
| **Secret**                | Stores a dummy authentication token (example only)                    |
| **PersistentVolume**      | Allocated host storage for uploaded images                            |
| **PersistentVolumeClaim** | Requests specific storage from the PV                                 |
| **InitContainer**         | Prepares the upload directory before the backend starts               |
| **Deployment (BE)**       | Runs the Node.js image upload API with volume mount and health probes |
| **Deployment (FE)**       | Vue.js frontend served using Nginx                                    |
| **Service (BE)**          | NodePort service exposing backend at port `30080`                     |
| **Service (FE)**          | NodePort service exposing frontend at port `30081`                    |

