# Version 3

- Removal of setOption method on the control
- getTile is now getBlobByKey
- openTilesDataBase is now an export function to get whole idb database
- New control option alwaysDownload, if false, the control will not redownload tiles already in the db (and the savetile\* event do not fire)

# Version 4

- Changed arguments of getStoredTilesAsJson: send an object with tilesize instead of the full layer
