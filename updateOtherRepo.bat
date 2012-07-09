@ECHO OFF
SET /P msg=Enter the update message for this change: 
svn commit -m"%msg%"
C:
cd C:\wamp\www\drupal7\sites\all\modules\shivanode
svn update

echo Done!
set /p msg=Press Enter to Close!