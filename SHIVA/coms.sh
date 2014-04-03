echo "Committing SHIVA" $@
msg=$@
git commit -a -m "$msg" 
git push