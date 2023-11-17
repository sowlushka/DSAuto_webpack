import { stringSolution1 } from "./task1";
import { stringSolution2 } from "./task2";
import { stringSolution3 } from "./task3";
import { stringSolution4 } from "./task4";
import { stringSolution5 } from "./task5";
import { trim } from "./task6";
import { stringSolution7 } from "./task7";
import { stringSolution8, stringSolution8_2 } from "./task8";
import { stringSolution9 } from "./task9";

export const tasks=[
    {
        id: 1,
        task: "Спросите у пользователя телефонный номер и выведете его в нормализованном виде.",
        inputText: "Введите номер телефона:",
        inputType: "tel",
        solution: stringSolution1
    },
    {
        id: 2,
        task: "Пользователь вводит строку. Нужно сформировать и вывести массив из всех чисел в этой строке.",
        inputText: "Введите текст с числами:",
        solution: stringSolution2
    },
    {
        id: 3,
        task: "Подсчитайте количество строчных и прописных букв в строке. Считается, что в строке могут быть только английские буквы и пробелы.",
        solution: stringSolution3
    },
    {
        id: 4,
        task: "Выведете самое длинное слово в предложении (слова разбиты пробелами).",
        inputText: "Напишите предложение:",
        solution: stringSolution4
    },
    {
        id:5,
        task:"Пользователь вводит слово. Если оно является перевёртышем выведете true иначе false. Слово-перевёртыш - это слово, которое одинаково читается с начала и с конца. Слова могут быть как на английском, так и на русском.",
        inputText:"Введите слово:",
        solution: stringSolution5
    },
    {
        id:6,
        task:"Удалите лишние пробелы из строки. Пробелы лишние если они в начале или в конце строки, а также если между словами больше одного пробела. Считается, что строка состоит только из букв и пробелов.",
        inputText: "Напишите предложение:",
        solution: trim
    },
    {
        id: 7,
        task:"Дана строка, сделайте букву каждого слова прописной (большой).",
        inputText: "Напишите предложение",
        solution: stringSolution7
    },
    {
        id: 8,
        task:'На вход подаётся строка вида "12+23=35". Выведете на экран <font color="red">true</font> если выражение верно или <font color="red">false</font> если выражение не верно.',
        inputText:"Введите математическое тождество: ",
        solution: stringSolution8_2
    },
    {
        id:9,
        task:'На вход подаётся строка вида "12+23-4*5/10+11". Выведете на экран результат выражения. Приоритет знаков и скобок ИМЕЕТ значение.',
        inputText: "Введите математическое выражение: ",
        solution: stringSolution9
    }
];

