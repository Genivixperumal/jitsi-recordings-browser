# Jitsi recordings browser backend

In production check the domain name in .env (used for CORS and session cookie).
Put the service behind nginx for https.

Nodejs based. Dockerized. Quickstart: `make build start`. See Makefile for more details.

Authentication: user/password, list: .htpasswd (path is configurable, see
.env.default for example).

Logs: `make logs`

I18n: see .env.example for locale-specific settings. Also labels.js must contain labels in
language needed. Date picker uses locale.

Author: Copyright (C) 2021 by [Shamil Gumirov](shamil.gumirov.org).

License: See ../LICENSE.md.

