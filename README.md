# Recordings explorer for Jitsi

Jitsi server allows recording of meetings. However it does not contain
way to list or download them. Recordings are only saved on disk.

This service helps to provide access for an authenticated user to browse and download
recorded meetings using web interface.

# How to run locally

## For development

Requirements: `make`, `npm`, `node`, `htpasswd`. Recent versions should work fine.

- Prepare configs:
  - create users using `htpasswd` in `web/.htpasswd`
  - prepare config in `.env` files for both web and backend:
    - copy `backend/env.example` to `backend/.env.development` and edit
    - copy `web/env.example` to `web/.env.development` and edit
- `make dev`

## For production

Requirements: `docker`, `make`. Optional: `certbot`, `nginx`.

- create users with `htpasswd` in `web/.htpasswd`
- prepare configs:
  - copy `env.example` to `.env` in `backend/` and `web/`, and edit
- `make build`
- `make start`
- set up nginx or any other reverse proxy and https certs (Let's Encrypt is a
recommended way).

## Known limitations

Currently Jibri has an [issue #283](https://github.com/jitsi/jibri/issues/283) that
results in no information is saved on the particpants list in the recording metainfo.

Because of Jibri does not leave no metainfo on recordings, there is no way to
separate access. So any authorized user can access any recording. This is a
direct result of a bug #283. This may be an issue in a multitenant Jitsi set up.

## General requirements

- Be able to run as a separate container in a conteinerized Jitsi setup
- Be able to access a recordings dir ($HOME/.jitsi-meet-cfg/jibri/recordings).

## Stack

ReactJS frontend. See `./web/README.md`.

Node backend. See `./backend/README.md`. Authentication with username and
password using htpasswd file is used.

# API Docs

REST-like API. Endpoints are listed below.

## POST /auth

Authorizes user.

Parameters (JSON):
```JSON
{ "auth": {
    "username": "",
    "password": "",
} }
```

## GET /user

Probe for the client to determine the session state.

Response: 
- If no session: `HTTP 401 Unauthorized`
- If the session exists: `{ "user": "username" }`

## GET /download/{recordings\_id} 
[**requires auth**]

Loads a meeting video. Supports content range.

Response: video binary data.

## GET /recordings 
[**requires auth**]

Lists available recordings.

Response. Array of records with the following fields:
- id: string - record id
- date: string - date in [JS compatible format](https://stackoverflow.com/a/15952652)
- room: string - meeting "room" name

Example:
```json
[{ 
  "id": "13", 
  "date": "2021-04-12T15:38:00.000Z", 
  "room": "Alice and Bob meeting"
}]
```

# Author

Copyright (C) 2021 by [Shamil Gumirov](https://shamil.gumirov.org). All rights reserved.

# License

See LICENSE.md
