cd ../efolio
echo "Committing e-folio:"
msg=$@
git commit -a -m "$msg" 
git push
cd ../shiva