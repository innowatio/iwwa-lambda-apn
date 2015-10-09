[![Build Status](https://travis-ci.org/innowatio/iwwa-lambda-apn.svg?branch=master)](https://travis-ci.org/innowatio/iwwa-lambda-apn)
[![Coverage Status](https://coveralls.io/repos/innowatio/iwwa-lambda-apn/badge.svg?branch=master&service=github)](https://coveralls.io/github/innowatio/iwwa-lambda-apn?branch=master)
[![Dependency Status](https://david-dm.org/innowatio/iwwa-lambda-apn.svg)](https://david-dm.org/innowatio/iwwa-lambda-apn)
[![devDependency Status](https://david-dm.org/innowatio/iwwa-lambda-apn/dev-status.svg)](https://david-dm.org/innowatio/iwwa-lambda-apn#info=devDependencies)

# iwwa-lambda-apn

Sends APN notifications.

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

- `APN_CERTIFICATE` (base64 of the APN certificate)
- `APN_KEY` (base64 of the APN key)
- `MONGODB_URL`

NOTE: since the project uses `lambda-deploy`, in the build environment (Travis)
we need to define the above variables with their name prefixed by
`__FUNC_CONFIG__`.
