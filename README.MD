# Notes
### Js-note: Property Advantage in Jquery
```js
// Property code style
Object.defineProperty(window, 'more_actions_text', {
    get: function () {
        return $('#more-actions-btn').text();
    },
    set: function (v) {
        $('#more-actions-btn').text(v);
    }
});

/* Property code style (Arrow style)

 Object.defineProperty(window, 'more_actions_text', {
    get: () => $('#more-actions-btn').text(),
    set: (v) => $('#more-actions-btn').text(v)
 });
 */

more_actions_text = 1;

// Simple style througth jQuery
$('#more-actions-btn').text(1)
```

### PHP-note: use mongo cursor
```PHP
$alertCollection = MongoRecordPeer::collection('alert');

$cursor = $alertCollection->find([
    'callout_id' => [
        '$in' => $expiredOpportunitiesIds
    ]
]);

foreach ($cursor as $alertDocument) {
    $alertCollection->remove(['_id' => $alertDocument['_id']]);
    
    $removedCounter++;
}

// or short case ...

$alertCollection->remove([
    'callout_id' => [
        '$in' => $expiredOpportunitiesIds
    ]
], [
    'multiple' => true
])
```
### Jquery+Bootstrap note: Bootstrap highlighting of jQuery element
```js
/**
 * @param arg
 * @returns {jQuery}
 */
$.fn.highlightElement = function (arg) {

    $(this).off('focusin');

    var opts;

    if (arguments.length == 2
        &&
        typeof arguments[0] === 'string'
        &&
        typeof +arguments[1] === 'number'
    ) {

        opts = {
            type: arguments[0],
            delay: +arguments[1]
        }

    } else {

        switch (true) {
            case typeof arg === 'string':

                opts = { type: arg };
                break;

            case typeof +arg === 'number' && !isNaN(+arg):

                opts = { delay: arg };
                break;

            default:

                opts = arg || {};
        }
    }

    var glyphiconClassByTypeMap = {
            success: 'glyphicon-ok',
            warning: 'glyphicon-warning-sign',
            error: 'glyphicon-remove'
        };

    opts = $.extend({}, {

        type: 'error',
        $parent: $(this).parent(),
        feedback: true

    }, opts);

    $(this).next('.form-control-feedback').remove();
    opts.$parent
        .removeClass('has-feedback')
        .removeClass('has-error')
        .removeClass('has-warning')
        .removeClass('has-success')
    ;

    if (['error', 'warning', 'success'].indexOf(opts.type) !== -1) {

        if (opts.feedback) {
            opts.$parent
                .addClass('has-' + opts.type)
                .addClass('has-feedback')
                .append($('<span>', {
                    class: 'form-control-feedback glyphicon ' + glyphiconClassByTypeMap[opts.type]
                }));

            if (opts.type === 'error') {
                $(this).focus();
            }

        } else {

            opts.$parent.addClass('has-' + opts.type);
        }

        var timerId, hide = function () {

            if (opts.feedback) {
                opts.$parent
                    .removeClass('has-feedback')
                    .removeClass('has-' + opts.type)
                    .find('span.form-control-feedback').remove();

            } else {

                opts.$parent.removeClass('has-' + opts.type)
            }

            $(this).off('focusin');
        };

        hide = hide.bind(this);

        if (opts.delay) {

            timerId = setTimeout(hide, +opts.delay);
        }

        $(this).focusin(function () {

            if (timerId) {
                clearTimeout(timerId);
            }

            hide();
        });

    }

    return $(this);
};

```
### TWIG-note: Show/Hide text througth bootstrap collapse (symfony example)
```PHP
// MyTwigExtension.php

public function viewMore($text, $options = [])
{
    $options['text'] = strip_tags($text);
    return $this
        ->container->get('twig')
        ->render('@AppBundles/MyTwigExtensions/textCollapse.twig', $options);
}
```

```TWIG
{# textCollapse.twig #}
{% set limit = limit is defined and limit ? limit : 150 %}

{% set show_link_text = show_link_text is defined and show_link_text ? show_link_text : ' Show more...' %}
{% set hide_link_text = hide_link_text is defined and hide_link_text ? hide_link_text : ' Hide' %}

{% set container_class = container_class is defined and container_class ? (' ' ~ container_class) %}

<div class="show-more-box{{ container_class }}">

    <span class="text-justify">

        <span class="initial-text">{{ text|slice(0, limit)|raw }}</span>{% spaceless %}

            {% if text|length > limit %}

                {% set id = 'collapse-' ~ random(1000) %}

                <span class="secondary-text collapse-{{ id }} collapse text-justify" id="{{ id }}">{{ text|slice(limit)|raw }}</span>
                <span class="collapse-{{ id }} in">&nbsp;...</span>

                <i>
                    <a data-toggle="collapse" href="javascript: void(0)" data-target=".collapse-{{ id }}"
                       onclick="this.text = document.getElementById('{{ id }}').classList.contains('in') ? '{{ show_link_text }}' : '{{ hide_link_text }}'"
                    >{{ show_link_text }}</a>
                </i>

            {% endif %}

        {% endspaceless %}

    </span>
</div>

```
#### Call example: 
```TWIG
{{ object.text|viewMore|raw }}
{# OR #}
{{ object.text|viewMore({limit: 70})|raw }}
{# OR without twig extension use #}
{% include '@AppBundles/MyTwigExtensions/textCollapse.twig' with {text: object.text } %}
```

### JS-note: Use private and public fields/methods
```TS
Object.defineProperty(this, 'factory', {
    get: () => {
        let privateField = 2;
        let privateFn = () => -1;
        return {
            pubField: 3,
            pubFn: function() {
                debugger
                return this.pubField + privateField;
            }
        };
    }
});
```
 
### JS-note (ES2016): student API (http://studentgo.ru/)
```JS
let studList = [];
$.post('http://studentgo.ru/search', {q: 'Яковенко' }).done((data) => {

    $(data).find('.student').each((_, studentBlock) => {

        let $studentBlock = $(studentBlock);
        let studentData = {
            studentId: $studentBlock.data('student-id'),
            studentName: $studentBlock.data('student-name')
        };

        $.post('http://studentgo.ru/student', studentData).done((data) => {

            let $studentDetailsBlock = $(data);
            let studentDetails = {
                fullname: $studentDetailsBlock.find('.name-student').html().replace(/\<br\>/g, ' '),
                group: {
                    id: $studentDetailsBlock.find('.groupName > a').data('group-id'),
                    name: $studentDetailsBlock.find('.groupName > a').data('group-name')
                },
                urls: $studentDetailsBlock.find('.social > a').map((_, link) => link.href ).toArray()
            };
            
            studList.push(studentDetails);
        });
    });
});
...
console.dir(studList);
```
### PHP-cache through closure
```php
// AppCacheService.php
namespace App\Services;

class AppCacheService
{
    /**
     * Minutes
     * @var int
     */
    private $cacheTtl = 1;

    /**
     * @var \Illuminate\Cache\Repository
     */
    private $cacheRepository;

    /**
     * AppCacheService constructor.
     */
    public function __construct()
    {
        $this->cacheRepository = \Cache::store(env('CACHE_DRIVER'));
    }

    /**
     * @param $key
     * @param \Closure|null $handler
     * @param null $ttl
     * @return mixed|null
     */
    public function get($key, \Closure $handler = null, $ttl = null)
    {
        if ($this->cacheRepository->has($key)) {

            $result = json_decode($this->cacheRepository->get($key));

        } else {

            if ($handler) {

                $result = $handler();
                $this->set($key, $result, $ttl);

            } else {

                $result = null;
            }
        }

        return $result;
    }

    /**
     * @param $key
     * @param $value
     * @param null $ttl
     */
    public function set($key, $value, $ttl = null)
    {
        $this->cacheRepository->add($key, json_encode($value), $ttl ? $ttl : $this->cacheTtl);
    }

    /**
     * @param $key
     */
    public function remove($key)
    {
        $this->cacheRepository->forget($key);
    }
}

// without cache (MyController.php)
// any handling with big data 
...
$objA = 1;
$objB = 2;

// use case (MyController.php)
list($objA, $objB) = $cache->get('my.cache.key', function() {
    // any handling with big data 
    ...
    $objA = 1;
    $objB = 2;

    return [$objA, $objB];
});

```
