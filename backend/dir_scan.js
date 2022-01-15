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
const parseDateAndRoom = (path) => {
  const res = readdirSync(path, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.match(dateAndRoomRegexp))
    .map(entry => entry.name.match(dateAndRoomRegexp));
  if (res && res.length > 0 && res[0].length > 2) {
    const [, year, month, day, rawHour, min, sec] = datePattern.exec(res[0][2]);
    const parsedDate = new Date(`${year}-${month}-${day}T${('0'+rawHour).slice(-2)}:${min}:${sec}+02:00`);
    const fullFileName = res[0][0];
    return {
      date: parsedDate.toJSON(),
      name: res[0][1] + "",
      fullFileName: fullFileName,
      size: statSync(path + '/' + fullFileName).size,
    };
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

    arr.push.apply(arr, readdirSync(dir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => parseDateAndRoom(dir + '/' + dirent.name))
      .filter(parseResult => parseResult !== null)
      .map(res => ({
        id: dir+"/"+res.fullFileName,
        room: res.name,
        date: res.date,
        size: res.size,
        fileName: res.fullFileName.replace(/^.*[\\\/]/, ''),
      }
      )));
    return arr;
  },
  findPath: (path, dirs) => {
    const p = path.toUpperCase();
    for (d of dirs) {
      if (d.id.toUpperCase() === p) return d.id;
    }
    return path;
  },
};
