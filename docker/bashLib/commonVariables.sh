#!/usr/bin/env bash

DOCKER_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd -P )"
PRJ_DIR="$( cd "${DOCKER_DIR}/.." && pwd -P )"
REL_DIR="${PWD##${PRJ_DIR}}"

PRJ_NAME="$( cd "${PRJ_DIR}" && echo ${PWD##*/} )"

HOST_USER_NAME="$(whoami)"
export HOST_USER_ID="$(id -u "${HOST_USER_NAME}")"
export HOST_GROUP_ID="$(id -g "${HOST_USER_NAME}")"

if [[ -n "${CI_PIPELINE_ID}" ]]; then
    # We detect that the script is running inside a CI pipeline, so we become verbose and non-interactive
    DEBUG_OUTPUT_FILE=${DEBUG_OUTPUT_FILE:-/dev/stdout}
    TERMINAL_MODE="t"
else
    DEBUG_OUTPUT_FILE=${DEBUG_OUTPUT_FILE:-/dev/null}
    TERMINAL_MODE=${TERMINAL_MODE:-it}
fi

if [ ${TERMINAL_MODE} = "t" ]; then
    DOCKER_RUN_TERMINAL_MODE="-T"
else
    DOCKER_RUN_TERMINAL_MODE=""
fi

RANDOM_SUFFIX="$(openssl rand -base64 64 | tr -dc 'a-z0-9_' | fold -w 32 | head -n 1;)"
