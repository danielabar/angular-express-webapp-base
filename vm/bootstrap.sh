#!/bin/sh

apt-get update

#add repository for oracle java
add-apt-repository --yes ppa:webupd8team/java

mkdir /var/log/provision

# Configure repositories
if [ ! -f /var/log/provision/reposetup ];
  then
  #add repository for elasticsearch
  wget -O - http://packages.elasticsearch.org/GPG-KEY-elasticsearch | apt-key add -
  echo 'deb http://packages.elasticsearch.org/elasticsearch/1.2/debian stable main' >> /etc/apt/sources.list

  #queue up some answers for java stuff
  echo debconf shared/accepted-oracle-license-v1-1 select true | debconf-set-selections
  echo debconf shared/accepted-oracle-license-v1-1 seen true | debconf-set-selections

  apt-get update > /dev/null

  touch /var/log/provision/reposetup
fi

# Install PostgreSQL
if [ ! -f /var/log/provision/postgressetup ];
  then
  apt-get install -y postgresql postgresql-client
  touch /var/log/provision/postgressetup

  # Allow remote connections
  cp /vagrant/data/postgres/*.conf /etc/postgresql/9.3/main

  # Create the dev and test databases
  sudo -u postgres createdb myappdb
  sudo -u postgres createdb myappdbtest

  # Populate the databases
  sudo -u postgres psql myappdb < /vagrant/data/postgres/world.sql
  sudo -u postgres psql myappdbtest < /vagrant/data/postgres/world.sql

  # Restart PostgreSQL server for config changes to take effect
  /etc/init.d/postgresql restart
fi

#Configure elasticsearch
if [ ! -f /var/log/provision/elasticsearchsetup ];
  then
  apt-get install -y oracle-java7-installer oracle-java7-set-default elasticsearch
  update-rc.d elasticsearch defaults 95 10
  /etc/init.d/elasticsearch start
fi

#Download, install and configure redis
if [ ! -f /var/log/provision/redissetup ];
then
  #modify redis config
  curl -sO http://download.redis.io/redis-stable.tar.gz
  tar xzf redis-stable.tar.gz
  cd redis-stable
  make
  cp src/redis-server /usr/local/bin
  cp src/redis-cli /usr/local/bin
  mkdir /etc/redis
  mkdir /var/redis
  cp utils/redis_init_script /etc/init.d/redis_6379
  cp /vagrant/data/redis/redis.conf /etc/redis/6379.conf
  mkdir /var/redis/6379
  cd -
  update-rc.d redis_6379 defaults
  service redis_6379 start
  touch /var/log/provision/redissetup
fi

echo "All done! While in this directory, use $ vagrant ssh to access the machine, or $ vagrant halt to shut it down."
