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
            
            return this; // для каскада
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
<hr>
## Каррирование
```JS
Function.prototype.curry = function() {
  
  var toArray = function(list) {
	  return [].map.call(list, function(arg) { return arg });
  };
  
  // closure ...
  var args = toArray(arguments);
  var fn = this;
  
  return function() {
    return fn.apply(fn, args.concat(toArray(arguments)));
  }
};

var sum = function(a,b) { 
	return a + b 
};

var sum10 = sum.curry(10);
var sum2000 = sum.curry(2000);
sum10(2); // 12
sum2000(17); // 2017
```
<b>Идея:</b> создание новой функции на основе прежней и с ее предопределенными аргументами.
<hr>
## Композиция
```js
function compose() {
	
	var fns = []
		.map.call(arguments, function(fn){ 
			return fn 
		})
	;
	
	return function(v) {
		
		fns.forEach(function(fn) {
			v = fn(v);
		});
		
		return v;
	}
}
// use
var add5 = function(v) {
	return v + 5;
}

var div3 = function(v) {
	return v / 3;
}

debugger
var common = compose(add5, div3);
common(2); // 2.3333333333333335
```
<b>Идея:</b> объединение несколько функций в одну.
<hr>

## Простая реализация Promise
```js
var MyPromise = (function(asyncFn) {
	
	var callbacks = [];
	asyncFn.call(this, function(data){
		callbacks.forEach(function(callback) {
			data = callback(data);
		});
	});
	
	return {
		then: function(fn) {		
			callbacks.push(fn);			
			return this;
		}
	};
});

MyPromise(function(resolve) {

	setTimeout(function() {
		
		var data = { 
			key: 'value'
		};
		
		resolve(data);
		
	}, 2000);
	
}).then(function(data) {
	data['key2'] = 'value-2';
	return data;
}).then(function(data) {
	console.log(data);
})
;
```
<b>Идея:</b> асинхронный возврат функции, возможный благодаря замыканию.
<hr>

## Простая реализация js-шаблонищатора
```HTML
<template id="template">
	Hello, {{ name }}!
</template>

<div id="place"></div>

<script src="script.js"></script>
```

```js
var MyRender = (function(){
	return {
		render: function(template, data) {
		
			var parts = template.split(/\{\{.+\}\}/g);	
			var matches = template.match(/\{\{.*\}\}/g);
			
			var html = '';
			var prop;
			parts.forEach(function(part, i) {
				
				html += part;
				if (i !== parts.length - 1) {
									
					prop = matches[i]
						.replace(/\{\{/g, '')
						.replace(/\}\}/g, '')
						.trim()
						;
						
					html += data[prop];
				}
			});
			
			return html;
		}
	};
}());

place.innerHTML = MyRender.render(template.content.textContent, {
	name: 'User'
});
```
<b>Идея:</b> рендеринг html по заданному шаблону.
<hr>
