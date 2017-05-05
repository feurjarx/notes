```TS
class TotalizerView {

    static EVENT_UPDATE = 'totalizer.update';

    static CLASSNAME_START = '.start';
    static CLASSNAME_DASH = '.dash';
    static CLASSNAME_COUNT = '.count';
    static CLASSNAME_TOTAL = '.total';

    static make(...args) {
        return new TotalizerView(...args);
    };

    static publish(...args) {
        $(document).trigger(this.EVENT_UPDATE, args);
    }

    private $totalizer: JQuery;

    private fillTotalizer() {
        const $count = $('<span>', {
            'class': TotalizerView.CLASSNAME_COUNT.slice(1)
        });

        const $total = $('<span>', {
            'class': TotalizerView.CLASSNAME_TOTAL.slice(1)
        });

        const $start = $('<span>', {
            'class': `${TotalizerView.CLASSNAME_START.slice(1)} hidden`,
            text: 1
        });

        const $dash = $('<span>', {
            'class': `${TotalizerView.CLASSNAME_DASH.slice(1)} hidden`,
            text: ' - '
        });

        this.$totalizer.html($('<div>', {
            html: [
                $start,
                $dash,
                $count,
                ' of ',
                $total
            ]
        }));
    }

    constructor(selector: string, total = 0, autoSubscribed = true) {
        this.$totalizer = $(selector);

        this.fillTotalizer();

        this.setStart(0);
        this.setCount(0);
        this.setTotal(total);

        if (autoSubscribed) {
            this.subscribe(TotalizerView.EVENT_UPDATE);
        }
    }

    private toggleDash(visible) {
        this.$dash.toggleClass('hidden', !visible);
    }

    private toggleStart(visible) {
        this.$start.toggleClass('hidden', !visible);
    }

    subscribe(eventName: string) {
        $(document).on(eventName, this.onTotalizerUpdate);
    }

    private get $start() {
        return this.$totalizer.find(TotalizerView.CLASSNAME_START);
    };

    private getStart() {
        this.$start.text();
    };

    private setStart(start) {

        this.toggleStart(Boolean(start));
        this.toggleDash(Boolean(start));

        this.$start.text(start);
    };

    private get $dash() {
        return this.$totalizer.find(TotalizerView.CLASSNAME_DASH);
    };

    private get $count() {
        return this.$totalizer.find(TotalizerView.CLASSNAME_COUNT);
    };

    private getCount() {
        this.$count.text();
    };

    private setCount(count) {
        this.$count.text(count);
    };

    private get $total() {
        return this.$totalizer.find(TotalizerView.CLASSNAME_TOTAL);
    };

    private getTotal() {
        this.$total.text();
    };

    private setTotal(total) {
        this.$total.text(total);
    };

    private onTotalizerUpdate = (event, start, count, total = this.getTotal()) => {
        this.setStart(start);
        this.setCount(count);
        this.setTotal(total);
    };

}
```

# use case 
```TS
TotalizerView.make('.totalizer-block');
...
TotalizerView.publish(start, offset, total);
```

```HTML
<div class="totalizer-block"></div>
```
