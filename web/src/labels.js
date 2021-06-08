
const labelsByLang = {
  ru: {
    empty: "Нет видеозаписей",
    login: "Логин в список видеозаписей сервиса Meet.Gumirov.com",
    logout: "Завершить сеанс",
    username: "Пользователь",
    passwd: "Пароль",
    signin: "Войти",
    recordings: "Записи звонков",
    openVideo: "Открыть",
    meetingName: "Название встречи",
    date: "Дата (новые вверху)",
    files: "Записи",
    filter: "Фильтровать: ",
    after: "Начиная с:",
    before: "Заканчивая:",
  },
  en: {
    empty: "No records exist of found",
    login: "Log in to see a list of Jitsi meeting recordings",
    logout: "End session",
    username: "User",
    passwd: "Password",
    signin: "Sign in",
    recordings: "Meeting recordings",
    openVideo: "Open",
    meetingName: "Meeting name",
    date: "Date (newer first)",
    files: "Recordings",
    filter: "Filter: ",
    after: "Since:",
    before: "Until:",
  },
};

module.exports = labelsByLang[process.env.REACT_APP_LANG];
