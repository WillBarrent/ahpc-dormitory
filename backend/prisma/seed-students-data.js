/**
 * Данные студентов для заполнения.
 * Формат групп: {курс}{номер}{аббревиатура}
 *
 * ПО — Программное Обеспечение
 * ТМ — Техническое Моделирование
 * ЭС — Электрические Системы
 * ЭТ — Электротехника
 * ПД — Право и Документоведение
 * Б  — Бухгалтерия
 *
 * Комнаты (из seed.js):
 *   2 эт.: 203(3 места), 204(2), 205(2), 206(2), 207(4), 208(4), 209(2), 210(2), 211(2), 212(5)
 *   3 эт.: 304(4), 305(4), 306(4), 307(4)
 *   4 эт.: 402(4), 403(4), 404(4), 405(4), 406(4), 407(4), 408(4), 409(4)
 *   5 эт.: 502(4), 503(4), 504(4), 505(4), 506(4), 507(4), 508(4), 509(4)
 */

const STUDENTS = [
  { fullName: 'Амангельдиев Айбек Серикович',   course: 1, group: '101ПО', phone: '+7 701 123 45 01', roomNumber: 203, bedNumber: 1 },
  { fullName: 'Бакирова Алия Маратовна',         course: 1, group: '102ПО', phone: '+7 701 123 45 02', roomNumber: 203, bedNumber: 2 },
  { fullName: 'Дауренбеков Ержан Кайратович',    course: 1, group: '103ПО', phone: '+7 701 123 45 03', roomNumber: 203, bedNumber: 3 },
  { fullName: 'Есенова Динара Нурлановна',       course: 2, group: '201ПО', phone: '+7 701 123 45 04', roomNumber: 204, bedNumber: 1 },
  { fullName: 'Жумабаев Руслан Бахытович',       course: 2, group: '201ТМ', phone: '+7 701 123 45 05', roomNumber: 204, bedNumber: 2 },
  { fullName: 'Закирова Айнура Рустамовна',      course: 2, group: '202ТМ', phone: '+7 701 123 45 06', roomNumber: 205, bedNumber: 1 },
  { fullName: 'Ибраев Самат Канатович',          course: 2, group: '201ЭС', phone: '+7 701 123 45 07', roomNumber: 205, bedNumber: 2 },
  { fullName: 'Каримова Мадина Бауржановна',     course: 1, group: '101ЭС', phone: '+7 701 123 45 08', roomNumber: 206, bedNumber: 1 },
  { fullName: 'Лукпанов Асхат Талгатович',       course: 1, group: '102ЭС', phone: '+7 701 123 45 09', roomNumber: 206, bedNumber: 2 },
  { fullName: 'Мустафин Данияр Еркинович',       course: 2, group: '203ЭС', phone: '+7 701 123 45 10', roomNumber: 207, bedNumber: 1 },
  { fullName: 'Нурпеисова Асель Сериковна',      course: 2, group: '201ЭТ', phone: '+7 701 123 45 11', roomNumber: 207, bedNumber: 2 },
  { fullName: 'Омарбеков Ерасыл Аскарович',      course: 2, group: '202ЭТ', phone: '+7 701 123 45 12', roomNumber: 207, bedNumber: 3 },
  { fullName: 'Рахметова Камила Армановна',      course: 3, group: '301ЭТ', phone: '+7 701 123 45 13', roomNumber: 207, bedNumber: 4 },
  { fullName: 'Сагинтаев Айдар Муратович',       course: 2, group: '201ПД', phone: '+7 701 123 45 14', roomNumber: 208, bedNumber: 1 },
  { fullName: 'Тастанбекова Айдана Ержановна',   course: 2, group: '202ПД', phone: '+7 701 123 45 15', roomNumber: 208, bedNumber: 2 },
  { fullName: 'Умирзаков Нурсултан Бекжанович',  course: 3, group: '301ПД', phone: '+7 701 123 45 16', roomNumber: 208, bedNumber: 3 },
  { fullName: 'Хасенова Дильназ Кайратовна',     course: 3, group: '302ПД', phone: '+7 701 123 45 17', roomNumber: 208, bedNumber: 4 },
  { fullName: 'Шарипова Анжелика Владимировна',  course: 1, group: '103Б',  phone: '+7 701 123 45 18', roomNumber: 209, bedNumber: 1 },
  { fullName: 'Ахметова Жансая Ермековна',       course: 2, group: '201Б',  phone: '+7 701 123 45 19', roomNumber: 209, bedNumber: 2 },
  { fullName: 'Искакова Томирис Батырхановна',   course: 2, group: '202Б',  phone: '+7 701 123 45 20', roomNumber: 210, bedNumber: 1 },
]

export default STUDENTS
