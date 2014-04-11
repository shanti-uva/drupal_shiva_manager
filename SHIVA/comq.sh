cd ../qmedia
echo "Committing QMedia" $@
msg=$@
git commit -a -m "$msg" 
git push
cd ../SHIVA