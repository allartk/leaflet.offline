import './style.css';
import { getStorageInfo, removeTile, truncate } from 'leaflet.offline';

export const urlTemplate = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
export const wmtsUrlTemplate =
  'https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0?service=WMTS&request=GetTile&version=1.0.0&tilematrixset=EPSG:3857&layer={layer}&tilematrix={z}&tilerow={y}&tilecol={x}&format=image%2Fpng';

const layerSelector = document.getElementById(
  'selectlayer',
) as HTMLSelectElement;

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

const createTable = (url: string) =>
  getStorageInfo(url).then((r) => {
    document.getElementById('storage')!.innerHTML = r.length.toString();
    const list = document.getElementById(
      'tileinforows',
    ) as HTMLTableSectionElement;
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
          </tr>`,
      );
    }
  });

createLayerOpts();
createTable(layerSelector.value);

const rmButton = document.getElementById('remove_tiles') as HTMLButtonElement;
rmButton.addEventListener('click', () =>
  truncate().then(() => createTable(layerSelector.value)),
);

const rmOldButton = document.getElementById(
  'remove_old_tiles',
) as HTMLButtonElement;
rmOldButton.addEventListener('click', async () => {
  const tiles = await getStorageInfo(urlTemplate);
  const minCreatedAt = new Date().setDate(-30);
  await Promise.all(
    tiles.map((tile) =>
      tile.createdAt < minCreatedAt ? removeTile(tile.key) : Promise.resolve(),
    ),
  );
  createTable(layerSelector.value);
});

layerSelector.addEventListener('change', (e) => {
  // @ts-ignore
  createTable(e.target.value);
});
