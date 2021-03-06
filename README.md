# Datadog Agent Action

Starts a Datadog Agent and gracefully shuts it down before the job finishes.

The Datadog Agent will be available at `localhost:8125/udp` for metrics collection and `localhost:8126/tcp` for APM traces collection.

## Usage
```yaml
name: Test Code
on: [push]
jobs:
  test:
    steps:
      - uses: datadog/agent-github-action@v1.3
        with:
            api_key: ${{ secrets.DD_API_KEY }}
      - uses: actions/checkout@v2
      - run: make tests
```

## Inputs

The action has the following options:

| Name | Description | Required | Default |
| ---- | ----------- | -------- | ------- |
| `api_key` | The API key for the Datadog site. | True | |
| `container_name` | The name for the docker container that runs the agent. | True | `datadog-agent` |
| `image_name` | The docker registry and image to pull. It has to be one of [`datadog/agent` (Docker), `gcr.io/datadoghq/agent` (GCR), `public.ecr.aws/datadog/agent` (ECR)] | True | `gcr.io/datadoghq/agent` |
| `datadog_site` | The Datadog site to send data to. | True | `datadoghq.com` |
| `extra_env` | A comma separated list of environment variables to pass to the Datadog agent. (e.g. `DD_APM_MAX_EPS=500`) | False | |
| `max_retries` | The maximum number of times the action will poll the agent to see if it is ready | True | 10 |
| `initial_wait_time` | The initial wait time in seconds between polls to see if the agent is ready | True | 5 |
