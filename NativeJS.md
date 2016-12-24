## Замыкание
### Пример 1 - изоляция переменных
```JS
var obj = (function () {
    var privateValue = 1;

    return {
        get val() {
            return privateValue;
        },
        set val(v) {
            privateValue = v;
        }
    }
}());
```
### Пример 2 - доступ к параметрам
```JS
var calculator = function(param1, param2) {
    return {
        get sum() {
            return param1 + param2;
        },
        get diff() {
            return param1 - param2;
        },
        set param1(v) {
            param1 = v;
        }
    }
};
```
<b>Идея</b>: 
Возвращаемая функция имеет доступ к внутренним переменным и параметрам
<hr>
## Модули
```JS

var module = (function () {

    var counter = 0; // initial
    var value = 0;

    var journal = [];
    var audit = function(up) {
        journal.push({
            created_at: new Date().getTime(),
            type: (up ? 'up' : 'down') + ' value.',
            attempt: counter
        });
    };

    var record2string = function (record) {
        return 'created at ' + record.created_at
            + '. ' + record.type
            + ' (attempt #' + record.attempt + ').'
        ;
    };

    // возврат привилегированных функций
    return {

        getRecordByAttempt: function (attempt) {
            var result;
            attempt--;

            if (journal[attempt]) {
                result = record2string(journal[attempt]);
            } else {
                result = '404';
            }

            return result;
        },

        get journal() {
            return journal.map(record2string).join('\n');
        },
        get attempts() {
            return counter;
        },
        get currentValue () {
            return value;
        },
        up: function () {
            value++;
            counter++;
            audit(true);
            
            return this;
        },
        down: function () {
            value--;
            counter++;
            audit();

            return this;
        }
    };

}());

```
<b>Идея:</b>
Сокрытие состояний и реализации предоставляемого интерфейса, тем самым сглаживается недостаток JS - глобальность переменных.
Модули основаны на функциях и замыканиях.
