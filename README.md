# Installation Guide

To get started with this project, follow these steps:


### 1. Clone the repository:

             git clone [your-repo-url]


### 2. Navigate into the project directory:
             
             cd [your-repo-directory]

### 3. Install dependencies:

             npm install
### 4. Start the development server:

             npm run start:dev


# API Documentation

Access the Swagger documentation at: http://localhost:8001/api

### Usage Steps


#### 1. Register a New User:
 -> Open the Swagger documentation.
 -> Navigate to the registration endpoint.
 -> Register using a unique username and password.

#### 2. Login:
-> Navigate to the login endpoint in the Swagger documentation.
-> Login with the registered credentials to receive an access token.

#### 3. Authenticate:
-> Copy the access token from the login response.
-> Paste the access token into the Swagger UI (usually at the top right corner) to authenticate your session.

#### 4. Create a Bucket:
-> Use the authenticated session to navigate to the bucket creation endpoint.
-> Provide a name and description to create a new bucket.


### 5. Manage Files in the Bucket:
-> With the bucketId obtained from the bucket creation, you can insert and delete files within the bucket using the respective endpoints.

### 6. Delete Buckets and Files:
-> Buckets and files can be deleted using their respective endpoints, ensuring complete control over your storage.

# Features

### User Registration & Authentication:
-> Secure registration and login system.
-> Token-based authentication for secure access.


### Bucket Management:

-> Create, update, and delete buckets.
-> Detailed descriptions for each bucket.


### File Management:

-> Insert and delete files within any bucket.
-> Easy file manipulation through API endpoints.


### Security
-> Comprehensive authentication and authorization ensure that only authenticated users can manage buckets and files.
-> Token-based authentication secures all API endpoints.

# Conclusion
This project offers a robust solution for bucket and file management with a secure authentication system. The user-friendly Swagger documentation makes API interaction straightforward and efficient. Enjoy seamless integration and management of your data!
