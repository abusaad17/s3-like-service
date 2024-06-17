# API Documentation for Remote Access Project

API from the gateway will be authenticated using the certificate and private key.

# Gateway API

## Device configuration URL

🔐 Certificate Required

This repository will be maintained separately and will provide the configurations, it can be a JSON object or just a key value pair

- **Type:** GET
- **URL:** /v1/api/configurations?key={key}
- **Response:**
- `200`:
  ```json
  {
    "url": "https://example.inveron.com",
    "type": "production"
  }
  ```

## Enable Remote Gateway

### Description

This REST API is to enable remote access. This will be consumed by the web app in the Gateway.

Note: The device hardwareId will be read from the certificate and the request body and will be processed if matched otherwise will return 500

🔐 Certificate Required

### Endpoint

- **Type:** POST
- **Request Body:**
- **URL:** /v1/api/remote-access

  - `hardwareId` (string)
  - `description` (string)
  - `tags` (array of strings) optional
  - `emailIds` (array of strings) optional

- **Response:**
  - `201`:
    ```json
    {
      "message": "Remote access enabled successfully",
      "edgeId": "string",
      "authToken": "string"
    }
    ```
  - `409`:
    ```json
    {
      "error": "Already enabled",
      "message": "Remote access had been already enabled for this device"
    }
    ```
  - `400`:
    ```json
    {
      "error": "Invalid Input",
      "message": "Error ocurred while provisioning "
    }
    ```
  - `403`:
    ```json
    {
      "error": "Forbidden: Expired Certificate",
      "message": "Your device certificate has been expired"
    }
    ```
  - `401`:
    ```json
    {
      "error": "Unauthorized",
      "message": "You do not have the permission to enable the remote access"
    }
    ```
  - `500`:
    ```json
    {
      "error": "Something went wrong",
      "message": "Something went wrong, please try again"
    }
    ```

## Periodic Health Check

### Description

This API brings a lot of information about the gateway, this API will be invoked from the gateway on periodic basis(interval will be decided later)

🔐 Certificate Required

### Endpoint

- **Type:** GET
- **URL:** /v1/api/health-check
- **Response:**
  - `200`:
    ```json
    {
      "message": true
    }
    ```
  - `403`:
    ```json
    {
      "error": "Forbidden: Expired Certificate",
      "message": "Your device certificate has been expired"
    }
    ```
  - `401`:
    ```json
    {
      "error": "Unauthorized",
      "message": "You do not have the permission to enable the remote access"
    }
    ```
  - `500`:
    ```json
    {
      "error": "Something went wrong",
      "message": "Something went wrong, please try again"
    }
    ```

## Disable Remote Access

### Description

This REST api is to delete the edge created in ngrok, if multiple users are accessing the tunnel, we can forcefully delete the tunnel

🔐 Certificate Required

### Endpoint

- **Type:** DELETE
- **URL:** /v1/api/remote-access/{hardwareId}
- **Response:**
  - `200`:
    ```json
    {
      "result": true
    }
    ```
  - `403`:
    ```json
    {
      "error": "Forbidden: Expired Certificate",
      "message": "Your device certificate has been expired"
    }
    ```
  - `401`:
    ```json
    {
      "error": "Unauthorized",
      "message": "You do not have the permission to enable the remote access"
    }
    ```
  - `500`:
    ```json
    {
      "error": "Something went wrong",
      "message": "Something went wrong, please try again"
    }
    ```

## Edit/Update Edge

### Description

This API is used to edit/update details of an edge device.

\*Certificate Required

### Endpoint

- **Type:** PUT
- **URL:** /v1/api/remote-access/{hardwareId}
- **Request Body:**
  - `description` (string)
  - `tags` (array of strings) optional
  - `emailIds` (array of strings) optional
- **Response:**
  - `200`:
    ```json
    {
      "edgeInfo": {
        "created_at": "2024-02-16T19:35:32Z",
        "description": "acme https edge",
        "hostports": ["example.com:443"],
        "id": "edghts_2cSjz2XRGVbxhRvpCPZ5SMCyxS0",
        "metadata": "{\"environment\": \"staging\"}",
        "mutual_tls": null,
        "routes": [],
        "tls_termination": null,
        "uri": "https://api.ngrok.com/edges/https/edghts_2cSjz2XRGVbxhRvpCPZ5SMCyxS0"
      },
      "deviceInfo": {
        "hardwareId": "4tYwhjipl67812",
        "metadata": ["staging", "Germany", "something else"],
        "status": "Active",
        "description": "acme https edge",
        "emails": ["aminul@xngen.info", "joerg@mx.com"],
        "created_at": "2024-02-16T19:35:32Z",
        "updated_at": "2024-02-16T19:35:32Z"
      }
    }
    ```
  - `400`: Invalid input
  - `401`: Unauthorized
  - `500`: Oops! Something went wrong. Please try again later.

# Portal API

## Edge Devices List

### Description

This API is used to retrieve a list of edge devices.

### Endpoint

- **Type:** GET
- **URL:** /v1/api/edges/
- **Params:** start={int}&size={int}&allDevice=true&search={hardwareId,metadata,description}&sort=created_at&sortOrder=asc
- **Headers:**
  ```json
  {
    "Authorization": "JWT Token"
  }
  ```
- **Response:**
  - `200`:
    ```json
    {
      "data": [
        {
          "id": "ObjectId(yui276791jjj)",
          "hardwareId": "4tYwhjipl67812",
          "metadata": ["staging", "Germany", "something else"],
          "status": "Active",
          "description": "acme https edge",
          "emails": ["aminul@xngen.info", "joerg@mx.com"],
          "created_at": "2024-02-16T19:35:32Z",
          "updated_at": "2024-02-16T19:35:32Z",
          "access": true
        }
      ],
      "start": 0,
      "size": 20,
      "allDevice": 67,
      "myDevice": 10
    }
    ```
  - `400`: Invalid input
  - `401`: Unauthorized
  - `500`: Oops! Something went wrong. Please try again later.

## Edge Device Details

### Description

This API is used to retrieve details of a specific edge device.

### Endpoint

- **Type:** GET
- **URL Parameter:**
  - `hardwareId` (string)
- **Headers:**
  ```json
  {
    "Authorization": "JWT Token"
  }
  ```
- **Response:**
  - `200`:
    ```json
    {
      "edgeInfo": {
        "created_at": "2024-02-16T19:35:32Z",
        "description": "acme https edge",
        "hostports": ["example.com:443"],
        "id": "edghts_2cSjz2XRGVbxhRvpCPZ5SMCyxS0",
        "metadata": "{\"environment\": \"staging\"}",
        "mutual_tls": null,
        "routes": [],
        "tls_termination": null,
        "uri": "https://api.ngrok.com/edges/https/edghts_2cSjz2XRGVbxhRvpCPZ5SMCyxS0"
      },
      "deviceInfo": {
        "hardwareId": "4tYwhjipl67812",
        "metadata": ["staging", "Germany", "something else"],
        "status": "Active",
        "description": "acme https edge",
        "emails": ["aminul@xngen.info", "joerg@mx.com"],
        "created_at": "2024-02-16T19:35:32Z",
        "updated_at": "2024-02-16T19:35:32Z"
      }
    }
    ```
  - `400`: Invalid input
  - `401`: Unauthorized
  - `500`: Oops! Something went wrong. Please try again later.

# CLI

## Configuration Update

Configuration update will be used to update the configuration in the key vault and will apply all the configuration in all the edges. There are four level of security involved

1. Manual Switch: The configuration update is by default switched off in the azure key vault, in order to use this API someone having the access must manually turn it on
2. JWT Token: User needs to access and pass a valid JWT token
3. API Key: This API is protected via API key
4. One Time Password: An one time password will be emailed to the user

### Endpoint

- **Type:** PUT
- **URL:** /v1/api/configuration/
- **Request Body:**
  - `configuration`: (object)
  - `hardwareId`: Array of strings (optional, by default updated all)
- **Response:**

  - `200`:

    ```json
      {
        "result": "Configuration updated",
        "edgeEffectedCount": {int}
      }

    ```

  - `400`: Invalid input
  - `401`: Unauthorized
  - `500`: Oops! Something went wrong. Please try again later.

## Create KeyStore Configuration

This API is used to create new key value pair in the keyvault

### Endpoint

- **Type:** POST
- **Request Body:**
- **Headers:**
  ```json
  {
    "Authorization": "JWT Token",
    "API_Key": "API_KEY"
  }
  ```
  ```json
  {
    "key": "value"
  }
  ```
- **Response:**
  - `201`:
    ```json
    {
      "result": "Key value pair has been created successfully"
    }
    ```
  - `400`: Invalid input
  - `409`: Already exist
  - `401`: Unauthorized
  - `500`: Oops! Something went wrong. Please try again later.
