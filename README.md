[![Build Status](https://travis-ci.org/innowatio/iwwa-lambda-apn.svg?branch=master)](https://travis-ci.org/innowatio/iwwa-lambda-apn)
[![Coverage Status](https://coveralls.io/repos/innowatio/iwwa-lambda-apn/badge.svg?branch=master&service=github)](https://coveralls.io/github/innowatio/iwwa-lambda-apn?branch=master)
[![Dependency Status](https://david-dm.org/innowatio/iwwa-lambda-apn.svg)](https://david-dm.org/innowatio/iwwa-lambda-apn)
[![devDependency Status](https://david-dm.org/innowatio/iwwa-lambda-apn/dev-status.svg)](https://david-dm.org/innowatio/iwwa-lambda-apn#info=devDependencies)

# iwwa-lambda-apn

Sends APN notifications.

## How to obtain certificates

* Get a push certificate through Apple Developer Portal, and download it. It'll
  be in the `.cer` format.

* Import it in Mac OSX Keychain app, and then re-export it in `.p12` format. A
  password to protect the exported certificate is requested.

* Convert the `.p12` file to to `.pem` by running:
  ```sh
    openssl pkcs12 -in input.p12 -out ouput.pem -nodes -clcerts
  ```
  You'll be prompted to enter the password you set in the step above.

* To obtain the value of the `APN_CERTIFICATE` configuration parameter, copy the
  lines in the `.pem` file from line `-----BEGIN CERTIFICATE-----` (included) to
  line `-----END CERTIFICATE-----` (included). Then convert all of it, including
  new-line characters to base64. Use the obtained string as value.

* To obtain the value of the `APN_KEY` configuration parameter, copy the lines
  in the `.pem` file from line `-----BEGIN RSA PRIVATE KEY-----` (included) to
  line `-----END RSA PRIVATE KEY-----` (included). Then convert all of it,
  including new-line characters to base64. Use the obtained string as value.

## Deployment

### Continuous deployment

Since the project uses TravisCI and
[`lambda-deploy`](https://github.com/innowatio/lambda-deploy/) for continuous
deployment, the following environment variables need to be set:

- `AWS_SECRET_ACCESS_KEY`
- `AWS_ACCESS_KEY_ID`
- `AWS_DEFAULT_REGION`
- `S3_BUCKET`
- `LAMBDA_NAME`
- `LAMBDA_ROLE_ARN`

WARNING: the value of those variables must be kept secret. Do not set them in
the `.travis.yml` config file, only in the Travis project's settings (where they
are kept secret).

### Configuration

The following environment variables are needed to configure the function:

- `APN_CERTIFICATE`
- `APN_KEY`
- `MONGODB_URL`
- `TRANSMISSION_WAIT_TIME`: optional, the time to wait for the transmission of
  the push notification to the APN service

NOTE: since the project uses `lambda-deploy`, in the build environment (Travis)
we need to define the above variables with their name prefixed by
`__FUNC_CONFIG__`.
