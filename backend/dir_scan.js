const { statSync, readdirSync } = require('fs');

const dateAndRoomRegexp = /(.*)_(\d+(-\d+){5})(\....)/;
const datePattern = /^(\d{4})-(\d{2})-(\d{2})-(\d{1,2})-(\d{2})-(\d{2})$/;
/**
 * @returns null or array of objects with fields:
 * * date - meeting date
 * * name - room/meeting name
 * * fullFileName - full path to file name
 * * size - size of recording in bytes
 */
const parseDateAndRoom = (base, dir) => {
  const path = base+"/"+dir;
  const res = readdirSync(path, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.match(dateAndRoomRegexp))
    .map(entry => entry.name.match(dateAndRoomRegexp));
  if (res && res.length > 0 && res[0].length > 2) {
    const [, year, month, day, rawHour, min, sec] = datePattern.exec(res[0][2]);
    const parsedDate = new Date(`${year}-${month}-${day}T${('0'+rawHour).slice(-2)}:${min}:${sec}+02:00`);
    const fullFileName = res[0][0];
    const result = {
      date: parsedDate.toJSON(),
      name: res[0][1] + "",
      fullFileName: dir+"/"+fullFileName,
      size: statSync(path + '/' + fullFileName).size,
      fileName: fullFileName.replace(/^.*[\\\/]/, ''),
      dir: dir,
    };
    console.log("parseDate("+path+"): result: "+JSON.stringify(result));
    return result;
  }
  return null;
};

module.exports = {
  /**
   * Returns array of:
   * [{
   *   id: dir name,
   *   date: string,
   *   room: string,
   *   size: number,
   *   filename: string, //for example, 'abc.mp4'. for download
   * }]
   */
  readAll: (arr, dir) => {
    arr.length = 0; //clear array according to:
    // https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript

    arr.push.apply(arr,
      readdirSync(dir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => parseDateAndRoom(dir, dirent.name))
      .filter(parseResult => parseResult !== null)
      .map(res => ({
        id: res.dir + "/" + res.fileName,
        room: res.name,
        date: res.date,
        size: res.size,
        fileName: res.fileName,
      }
      )));
    return arr;
  },
  findPathIgnoreCase: (path, dirs) => {
    const p = path.toUpperCase();
    for (d of dirs) {
      if (d.id.toUpperCase() === p) return d.id;
    }
    return path;
  },
};
