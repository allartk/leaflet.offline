import { getStorageInfo, truncate } from 'leaflet.offline';
import { urlTemplate } from './const';


const createTable = () => getStorageInfo(urlTemplate)
  .then((r) => {
    document.getElementById('storage').innerHTML = r.length;
    const list = document.getElementById('tileinforows');
    list.innerHTML = '';
    for (let i = 0; i < r.length; i += 1) {
      const tileInfo = r[i];
      list.insertAdjacentHTML(
        'beforeend',
        `<tr>
                <td>${i}</td>
                <td><span class="d-inline-block text-truncate">${tileInfo.url}</span></td>
                <td><span class="d-inline-block text-truncate">${r[i].key}</span></td>
                <td>${tileInfo.blob.size}</td>
          </tr>`,
      );
    }
  });
createTable();

document.getElementById('remove_tiles').addEventListener(
  'click',
  () => truncate().then(() => createTable()),
);
