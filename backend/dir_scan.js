const { readdirSync } = require('fs');

const dateAndRoomRegexp = /(.*)_(\d+(-\d+){5})(\....)/;
const datePattern = /^(\d{4})-(\d{2})-(\d{2})-(\d{1,2})-(\d{2})-(\d{2})$/;
/**
 *  @returns null or { date: .., name: .. }
 */
const parseDateAndRoom = (path) => {
  const res = readdirSync(path, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.match(dateAndRoomRegexp))
    .map(entry => entry.name.match(dateAndRoomRegexp));
  if (res && res.length > 0 && res[0].length > 2) {
    const [, year, month, day, rawHour, min, sec] = datePattern.exec(res[0][2]);
    const parsedDate = new Date(`${year}-${month}-${day}T${('0'+rawHour).slice(-2)}:${min}:${sec}+02:00`);

    return {
      date: parsedDate.toJSON(),
      name: res[0][1] + "",
      fullFileName: path+"/"+res[0][0],
    };
  }
  return null;
};

/**
 * Returns array:
 * [{
 *   id: dir name,
 *   date: string,
 *   room: string
 * }]
 */
module.exports = {
  readAll: (arr, dir) => {
    arr.length = 0; //clear array according to:
    // https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript

    arr.push.apply(arr, readdirSync(dir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => parseDateAndRoom(dir + '/' + dirent.name))
      .filter(parseResult => parseResult !== null)
      .map(res => ({
        id: res.fullFileName,
        room: res.name,
        date: res.date,
      }
      )));
    return arr;
  }
};
