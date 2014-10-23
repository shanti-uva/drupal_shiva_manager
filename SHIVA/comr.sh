cd ../reading
echo "Committing Reading" $@
msg=$@
git commit -a -m "$msg" 
git push
cd ../SHIVA