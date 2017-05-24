FROM ubuntu:16.04

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    apt-transport-https \
    curl \
    ntpd -gq \
    xz-utils \
    unzip \
    bzip2 \
    wget \
    && rm -rf /var/lib/apt/lists/*

RUN service ntp start

ENV NPM_CONFIG_LOGLEVEL info

#==========
# JAVA
#==========
apt-get install -y default-jre

#==========
# NodeJS
#==========
ENV NODE_VERSION 6.10.3
RUN curl -SLO https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz \
  && tar -xJf node-v$NODE_VERSION-linux-x64.tar.xz -C /usr/local --strip-components=1 \
  && rm node-v$NODE_VERSION-linux-x64.tar.xz \
  && ln -s /usr/local/bin/node /usr/local/bin/nodejs
