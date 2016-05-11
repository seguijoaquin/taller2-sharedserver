FROM ubuntu:14.04

RUN apt-get -y update;\
sudo apt-get install -y wget;\
sudo apt-get install -y git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev python-software-properties libffi-dev;\
wget -O- https://toolbelt.heroku.com/install-ubuntu.sh | sh;\
sudo apt-get install -y postgresql postgresql-contrib;\
sudo /etc/init.d/postgresql start;\
cd home;\
git clone https://github.com/seguijoaquin/taller2-sharedserver.git;\
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -;\
sudo apt-get install -y nodejs;\

sudo apt-get install -y npm;\

cd home/taller2-sharedserver/;\

cd /home/taller2-sharedserver/localconfig;\

sh ./configure.sh;\
