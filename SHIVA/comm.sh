cd ../mapscholar
echo "Committing MapScholar:"
msg=$@
git commit -a -m "$msg" 
git push
cd ../shiva