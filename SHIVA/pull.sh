echo "Pulling from SHIVA"
git fetch --all
git reset --hard origin/master
echo "Pulling from MapScholar"
cd ../mapscholar
git fetch --all
git reset --hard origin/master
echo "Pulling from Qmedia"
cd ../qmedia
git fetch --all
git reset --hard origin/master
cd ../shiva