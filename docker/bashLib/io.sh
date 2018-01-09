#!/usr/bin/env bash

########################################################################################################################
# Colors                                                                                                               #
########################################################################################################################
bold=$(tput bold)
underline=$(tput sgr 0 1)
reset=$(tput sgr0)

purple=$(tput setaf 171)
red=$(tput setaf 1)
green=$(tput setaf 76)
tan=$(tput setaf 3)
blue=$(tput setaf 38)

########################################################################################################################
# Headers and Logging                                                                                                  #
########################################################################################################################
e_header() {
    printf "\n${bold}${purple}==========  %s  ==========${reset}\n" "$@"
}

e_arrow() {
    printf "➜ $@\n"
}

e_color() {
    local  __color=$1
    printf "${!__color}%s${reset}" "$2"
}

e_color_ln() {
    local  __color=$1
    printf "${!__color}%s${reset}\n" "$2"
}

e_bold_color() {
    local  __color=$1
    printf "${bold}${!__color}%s${reset}" "$2"
}

e_bold_color_ln() {
    local  __color=$1
    printf "${bold}${!__color}%s${reset}\n" "$2"
}

e_success() {
    printf "${green}✔ %s${reset}\n" "$@"
}

e_error() {
    printf "${red}✖ %s${reset}\n" "$@"
    return 1
}

e_warning() {
    printf "${tan}➜ %s${reset}\n" "$@"
}

e_underline() {
    printf "${underline}${bold}%s${reset}\n" "$@"
}

e_bold() {
    printf "${bold}%s${reset}\n" "$@"
}

e_note() {
    printf "${underline}${bold}${blue}Note:${reset}  ${blue}%s${reset}\n" "$@"
}

########################################################################################################################
# User interaction                                                                                                     #
########################################################################################################################
seek_confirmation() {
    printf "\n${bold}$2${reset}"
    read -p " (y/n) " -n 1
    printf "\n"

    local  __resultvar=$1
    eval $__resultvar="'${REPLY}'"
}

seek_confirmation_head() {
    printf "\n${underline}${bold}$@${reset}"
    read -p "${underline}${bold} (y/n)${reset} " -n 1
    printf "\n"

    local  __resultvar=$1
    eval $__resultvar="'${REPLY}'"
}

########################################################################################################################
# Environment checks                                                                                                   #
########################################################################################################################
command_exists() {
    command -v $1 >/dev/null 2>&1
}

is_os() {
    local __input="$(echo $1 | tr "[:upper:]" "[:lower:]")"
    local __uname="$(uname | tr "[:upper:]" "[:lower:]")"
    local __ostype="$(echo "${OSTYPE}" | tr "[:upper:]" "[:lower:]")"
    test "${__ostype}" == "${__input}" -o "${__uname}" == "${__input}";
}

check_that_user_gitconfig_exists() {
    if [ ! -f "${HOME}/.gitconfig" ]
    then
        e_bold_color_ln "red" "Do you need to configure your GIT settings:"                                            ;
        e_color_ln      "red" "    git config --global user.name \"Darth Vader\""                                      ;
        e_color_ln      "red" "    git config --global user.email \"darth_vader@adsmurai.com.com\""                    ;
        exit 1                                                                                                         ;
    else
        $(exit 0)                                                                                                      ;
    fi
}

ensure_file_existence() {
    local __filename=$1

    if [ ! -f "${__filename}" ]
    then
        touch "${__filename}"                                                                                          ;
    fi
}

########################################################################################################################
# Docker operations                                                                                                    #
########################################################################################################################

create_docker_network() {
    local __network_name=$1
    local __network_mask=$2
    local __subnet_option=""

    if [ -z "${__network_mask}" ];
    then
        __subnet_option="";
    else
        __subnet_option="--subnet=${__network_mask}";
    fi

    e_color blue "Creating network ${__network_name} "                                                              && \
    docker network create                                                                                              \
        --driver bridge                                                                                                \
        ${__subnet_option}                                                                                             \
        "${__network_name}"                                                                                            \
    &> ${DEBUG_OUTPUT_FILE} && e_success || e_error                                                                    ;
}

ensure_docker_network_existence() {
    local __network_name=$1
    local __network_mask=$2

    local __network_existence="$(docker network ls -q -f "name=^"${__network_name}"$")"

    if [ -z "${__network_existence}" ];
    then
        create_docker_network "${__network_name}" "${__network_mask}"                                                  ;
    else
        $(exit 0)                                                                                                      ;
    fi
}

create_docker_volume() {
    local __volume_name=$1

    e_color blue "Creating ${__volume_name} data volume "                                                           && \
    docker volume create "${__volume_name}" &> ${DEBUG_OUTPUT_FILE} && e_success || e_error                            ;
}

ensure_docker_volume_existence() {
    local __volume_name=$1

    local __volume_existence="$(docker volume ls -q -f "name=^"${__volume_name}"$")"

    if [ -z "${__volume_existence}" ];
    then
        create_docker_volume "${__volume_name}"                                                                        ;
    else
        $(exit 0)                                                                                                      ;
    fi
}

########################################################################################################################
# Magic Bash operations                                                                                                #
########################################################################################################################

scall() {
    # Save environment
    local _saved_variables=`typeset -px`
    local _random_suffix="${RANDOM_SUFFIX}"
    local bash_lib_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd -P )"

    # This strange command will execute the passed command
    "$@"
    local _process_status=$?

    # Restore environment
    eval "${_saved_variables}"
    source "${bash_lib_dir}/commonVariables.sh"
    RANDOM_SUFFIX="${_random_suffix}"

    return ${_process_status}
}
