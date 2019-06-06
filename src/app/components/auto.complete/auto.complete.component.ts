import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output, SimpleChanges,
    ViewChild
} from '@angular/core';
import {FormControl, FormGroup, NgModel, Validators} from "@angular/forms";

declare var $: any;
@Component({
    selector: 'app-auto-complete',
    templateUrl: './auto.complete.component.html',
    styleUrls: ['./auto.complete.component.less'],
    preserveWhitespaces: false
})
export class AutoCompleteComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() myNgModel; // : '=',
    @Output() myNgModelChange = new EventEmitter<any>();
    @Input() onNgClass; // : '='
    @Input() form; // : '='
    @Input() options = {
        list: [],
        prefix: '',
        itemKey: '',
        inputClass: '',
        placeholder: '',
        required: false,
        inputName: '',
    }; // : '='
    @ViewChild('inputElement', {static: false}) inputElement: ElementRef<HTMLInputElement>;
    @ViewChild('listElement', {static: false}) listElement: ElementRef<HTMLDivElement>;
    @ViewChild('myControl', {static: true}) myControl: NgModel;

    public focused;
    public value;
    public errorStateNotSelected;
    constructor() {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes.myNgModel || !changes.myNgModel.currentValue) {
            this.value = '';
        }
        console.log('changes.form', changes.form);
        // if (changes.options) {
        //     this.options = changes.options.currentValue;
        // }
    }

    ngAfterViewInit() {
        const input = $(this.inputElement.nativeElement);
        let inputOffset = input.offset();
        let scrollTop = $(window).scrollTop();
        let inputHeight = input.outerHeight();
        let inputWidth = input[0].clientWidth;
        const inputList = this.options.inputName + '_list';
        const list = $(this.listElement.nativeElement);
        input.on('focus', () => {
            this.focused = true;
        });
        input.on('input', () => {
            this.focused = false;
        });
        const shadowWidth = 4;
        list.css('position', 'fixed');
        list.css('top', inputOffset.top - scrollTop + inputHeight);
        list.css('left', inputOffset.left);
        list.css('width', inputWidth);
        list.css('font-style', 'normal');
        list.css('z-index', '999');
        list.css('box-shadow', '0px 0px ' + shadowWidth + 'px #6f6f6f');
        list.css('color', '#000');
        list.css('border-radius', '2px');
        list.css('background', '#fff');
        list.css('padding', '0');
        list.css('max-height', '300px');
        list.css('overflow', 'auto');
        list.hide();

        let elementClicked = false;
        let keyboardInput = false;
        let currentSelectedItem = 0;
        input.on('click', (e) => {
            setListCss();
            if (isScrolledIntoView(input[0])) {
                list.css('top', inputOffset.top - scrollTop + inputHeight);
            } else {
                list.css('top', inputOffset.top - scrollTop - list.height());
            }
            list.show();
            currentSelectedItem = 0;
            list.find('div').css('background', '#fff');
            e.preventDefault();
        });
        list.on('click', () => {
            list.hide();
        });
        $(this.inputElement.nativeElement).on('click', () => {
            elementClicked = true;
        });
        $(window).on('click', (e) => {
            if (!elementClicked && !keyboardInput && !e.target.closest('#mlkeyboard')) {
                list.hide();
                currentSelectedItem = 0;
                list.find('div').css('background', '#fff');
            }
            elementClicked = false;
            keyboardInput = false;
        });
        // input.closest('form').on('keypress', (e) => {
        //     if (e.keyCode == 13 && currentSelectedItem) {
        //         e.preventDefault();
        //         e.stopPropagation();
        //         var l = list.find('div');
        //         var ele = l[currentSelectedItem - 1];
        //         angular.element(ele).triggerHandler('click');
        //         list.hide();
        //         currentSelectedItem = 0;
        //     } else {
        //
        //     }
        // });
        input.on('keydown', (e) => {
            setListCss();
            if (e.keyCode === 8) {
                list.show();
            }
            if ((e.keyCode === 40 || e.keyCode === 98 || e.keyCode === 38 || e.keyCode === 104)) {
                list.show();
                const l = list.find('div');
                if ((e.keyCode === 40 || e.keyCode === 98) && currentSelectedItem < l.length) { // key down
                    currentSelectedItem++;
                }
                if ((e.keyCode === 38 || e.keyCode === 104) && currentSelectedItem > 0) { // key up
                    currentSelectedItem--;
                }
                // console.log("currentSelectedItem", currentSelectedItem)
                l.css('background', '#fff');
                const ele = l[currentSelectedItem - 1];
                if (ele) {
                    if (list.offset().top + list.height() < $(ele).height() + $(ele).offset().top) {
                        console.log('list', list);
                        list.scrollTop(list.scrollTop() + ele.clientHeight);
                    } else if (list.offset().top > $(ele).offset().top) {
                        console.log('list', list);
                        list.scrollTop(list.scrollTop() - ele.clientHeight);
                    }
                    $(ele).css('background', '#eee');
                }
            }
        });
        input.on('input', (e) => {
            setListCss();
        });

        $('*').on('resize scroll', (e) => {
            if (e.target !== list[0]) {
                list.hide();
                setListCss();
            }
        });
        $(window).on('resize scroll', (e) => {
            list.hide();
            // if(e.target !== list[0]) {
            //     list.hide();
            //     setListCss();
            // }
        });

        function setListCss() {
            // list.find('div').css('padding','4% 4%');
            scrollTop = $(window).scrollTop();
            inputOffset = input.offset();
            inputHeight = input.outerHeight();
            inputWidth = input.outerWidth();
            list.css('top', inputOffset.top + inputHeight - scrollTop);
            list.css('left', inputOffset.left);
            list.css('width', inputWidth);
            list.find('div').css('border', 'none');
            list.find('div').css('padding', '.5em');
            list.find('div').css('white-space', 'pre');
            list.find('div').on('mouseover', function(e) {
                e.preventDefault();
                $(this).css('background', '#eee');
            });
            list.find('div').on('mouseleave', function(e) {
                $(this).css('background', '#fff');
            });
            // console.log(this)
        }
        function isScrolledIntoView(el) {
            const rect = el.getBoundingClientRect();
            const elemTop = rect.top;
            const elemBottom = rect.bottom + list.height();

            // Only completely visible elements return true:
            const isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
            // Partially visible elements return true:
            // isVisible = elemTop < window.innerHeight && elemBottom >= 0;
            return isVisible;
        }

    }

    listFilter(your_collection): any[] {
        if (!your_collection || !your_collection.length) {
            return [];
        }
        your_collection.sort((a, b) => {
            a = (this.options.itemKey ? a[this.options.itemKey] : a);
            b = (this.options.itemKey ? b[this.options.itemKey] : b);
            // desc
            // if (a > b) {
            //     return -1;
            // }
            // if (b > a) {
            //     return 1;
            // }

            // asc
            if (a > b) {
                return 1;
            }
            if (b > a) {
                return -1;
            }
            return 0;
        });
        return your_collection.filter(
            (s) => {
                if (!this.value || this.focused) {
                    return true;
                }
                // console.log("(this.currentPrefix + s).toLowerCase()", (this.currentPrefix + s).toLowerCase())
                // console.log("this.value.toLowerCase()", this.value.toLowerCase())
                // console.log("(this.currentPrefix + s).toLowerCase().includes(this.value.toLowerCase())", (this.currentPrefix + s).toLowerCase().includes(this.value.toLowerCase()))
                // return (this.currentPrefix + s).toLowerCase().includes(this.value.toLowerCase()) && (this.currentPrefix + s).toLowerCase() !== this.value.toLowerCase();
                return ((this.options.prefix ? this.options.prefix.trim() + ' ' : '') + (this.options.itemKey ? s[this.options.itemKey] : s)).toLowerCase().includes(this.value.toLowerCase())
                    && ((this.options.prefix ? this.options.prefix.trim() + ' ' : '') + (this.options.itemKey ? s[this.options.itemKey] : s)).toLowerCase() !== this.value.toLowerCase();
            });
    }
    fetchListId(item) {
        if (!item) {
            item = '';
        }
        const map = this.options.list.map((o) => { return ((this.options.prefix ? this.options.prefix.trim() + ' ' : '') + (this.options.itemKey ? o[this.options.itemKey] : o)).toLowerCase(); } );
        const index = map.indexOf(item.toLowerCase());
        if (index > -1) {
            this.myNgModel = this.options.list[index];
            this.myNgModelChange.emit(this.options.list[index]);
            this.errorStateNotSelected = false;
        } else {
            this.myNgModel = '';
            // this.myNgModelChange.emit('')
            this.errorStateNotSelected = true;
        }
    }
    ngOnInit() {
        if (this.form) {
            this.form.addControl(this.myControl);
            // if (this.options.required) {
                // if (this.onNgClass) {
                //     this.onNgClass = {error: form.submitted && myControl.invalid && myControl.errors && myControl.errors.required};
                // } else {
                //     this.onNgClass = {'error': this.form.submitted && this.myControl.invalid && this.myControl.errors && this.myControl.errors.required};
                // }
            // }
        }
        // console.log('this.options.inputName', this.options.inputName);
        // console.log('this.form', this.form);

        this.focused = false;
        if (this.options.prefix && this.myNgModel) {
            this.value = (this.options.prefix.trim() + ' ' + this.myNgModel);
        }
        if (this.value) {
            this.fetchListId(this.value);
        }
    }

}
