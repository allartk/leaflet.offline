import { getStorageInfo, removeTile, truncate } from 'leaflet.offline';
import { urlTemplate, wmtsUrlTemplate } from './const';

const layerSelector = document.getElementById('selectlayer');

function createLayerOpts() {
  const xyzOpt = document.createElement('option');
  xyzOpt.value = urlTemplate;
  xyzOpt.text = 'osm';
  const wmtsOpt = document.createElement('option');
  wmtsOpt.value = wmtsUrlTemplate;
  wmtsOpt.text = 'wmts api layer';
  layerSelector.add(xyzOpt);
  layerSelector.add(wmtsOpt);
  layerSelector.value = urlTemplate;
}

const createTable = (url) =>
  getStorageInfo(url).then((r) => {
    document.getElementById('storage').innerHTML = r.length;
    const list = document.getElementById('tileinforows');
    list.innerHTML = '';
    for (let i = 0; i < r.length; i += 1) {
      const tileInfo = r[i];
      list.insertAdjacentHTML(
        'beforeend',
        `<tr>
                <td>${i}</td>
                <td class="text-truncate">${tileInfo.url}</td>
                <td class="text-truncate">${r[i].key}</td>
                <td>${tileInfo.blob.size}</td>
          </tr>`
      );
    }
  });

createLayerOpts();
createTable(layerSelector.value);

document
  .getElementById('remove_tiles')
  .addEventListener('click', () =>
    truncate().then(() => createTable(layerSelector.value))
  );

document
  .getElementById('remove_old_tiles')
  .addEventListener('click', async () => {
    const tiles = await getStorageInfo(urlTemplate);
    const minCreatedAt = new Date().setDate(-30);
    await Promise.all(
      tiles.map((tile) =>
        tile.createdAt < minCreatedAt ? removeTile(tile.key) : Promise.resolve()
      )
    );
    createTable(layerSelector.value);
  });

layerSelector.addEventListener('change', (e) => {
  createTable(e.target.value);
});
