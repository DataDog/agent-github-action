# Datadog Agent Action

Starts a Datadog agent in a docker container to be used for GitHub Actions CI tests.

## Usage
```yaml
name: Test Code
on: [push]
jobs:
  test:
    steps:
      - uses: datadog-agent
        with:
            apiKey: ${{ secrets.DD_API_KEY }}
      - uses: actions/checkout@v2
      - run: make tests
```

## Inputs

The action has the following options:

| Name | Description | Required | Default |
| ---- | ----------- | -------- | ------- |
| `apiKey` | The API key for the Datadog site. | True | |
| `containerName` | The name for the docker container that runs the agent. | True | `datadog-agent` |
| `imageName` | The docker registry and image to pull. It has to be one of [`datadog/agent` (Docker), `gcr.io/datadoghq/agent` (GCR), `public.ecr.aws/datadog/agent` (ECR)] | True | `datadog/agent` |
| `site` | The Datadog site to send data to. | True | `datadoghq.com` |