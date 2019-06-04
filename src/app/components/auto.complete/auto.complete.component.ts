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

declare var $: any;
@Component({
    selector: 'app-auto-complete',
    templateUrl: './auto.complete.component.html',
    styleUrls: ['./auto.complete.component.less']
})
export class AutoCompleteComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() list: any[]; // : '=',
    @Input() myNgModel; // : '=',
    @Output() myNgModelChange = new EventEmitter<any>();
    @Input() prefix; // : '@',
    @Input() placeholder; // : '@',
    @Input() inputName; // : '@',
    @Input() onNgClass; // : '='
    @Input() class; // : '='
    @Input() itemKey; // : '='
    @ViewChild('inputElement', {static: false}) inputElement: ElementRef<HTMLInputElement>;
    @ViewChild('listElement', {static: false}) listElement: ElementRef<HTMLDivElement>;

    public currentPrefix = '';
    public focused;
    public value;
    public errorStateNotSelected;
    constructor() {

    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!changes.myNgModel || !changes.myNgModel.currentValue) {
            this.value = '';
        }
    }

    ngAfterViewInit() {
        if (!this.list) {
            this.list = [];
        }
        if (!this.prefix) {
            this.prefix = '';
        }
        if (!this.itemKey) {
            this.itemKey = '';
        }
        this.currentPrefix = this.prefix;
        this.focused = false;
        if (this.currentPrefix) {
            this.currentPrefix = this.currentPrefix + ' ';
        } else {
            this.currentPrefix = '';
        }
        if (this.currentPrefix && this.myNgModel) {
            this.value = (this.currentPrefix + this.myNgModel);
        }
        if (this.value) {
            this.fetchListId(this.value);
        }
        const input = $(this.inputElement.nativeElement);
        let inputOffset = input.offset();
        let scrollTop = $(window).scrollTop();
        let inputHeight = input.outerHeight();
        let inputWidth = input[0].clientWidth;
        const inputList = this.inputName + '_list';
        const list = $(this.listElement.nativeElement);
        input.on('focus', () => {
            this.focused = true;
        })
        input.on('input', () => {
            this.focused = false;
        })
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
        })
        list.on('click', () => {
            list.hide();
        })
        $(this.inputElement.nativeElement).on('click', () => {
            elementClicked = true;
        })
        $(window).on('click', (e) => {
            if (!elementClicked && !keyboardInput && !e.target.closest('#mlkeyboard')) {
                list.hide();
                currentSelectedItem = 0;
                list.find('div').css('background', '#fff');
            }
            elementClicked = false;
            keyboardInput = false;
        })
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
            if (e.keyCode == 8) {
                list.show();
            }
            if ((e.keyCode == 40 || e.keyCode == 98 || e.keyCode == 38 || e.keyCode == 104)) {
                list.show();
                var l = list.find('div');
                if ((e.keyCode == 40 || e.keyCode == 98) && currentSelectedItem < l.length) { // key down
                    currentSelectedItem++;
                }
                if ((e.keyCode == 38 || e.keyCode == 104) && currentSelectedItem > 0) { // key up
                    currentSelectedItem--;
                }
                // console.log("currentSelectedItem", currentSelectedItem)
                l.css('background', '#fff');
                var ele = l[currentSelectedItem - 1];
                if (ele) {
                    if (list.offset().top + list.height() < $(ele).height() + $(ele).offset().top) {
                        console.log("list", list)
                        list.scrollTop(list.scrollTop() + ele.clientHeight)
                    } else if (list.offset().top > $(ele).offset().top) {
                        console.log("list", list)
                        list.scrollTop(list.scrollTop() - ele.clientHeight)
                    }
                    $(ele).css('background', '#eee');
                }
            }
        })
        input.on('input', (e) => {
            setListCss();
        });

        $("*").on('resize scroll', (e) => {
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
            list.find('div').on('mouseover', function (e) {
                e.preventDefault();
                $(this).css('background', '#eee');
            });
            list.find('div').on('mouseleave', function () {
                $(this).css('background', '#fff');
            });
            // console.log(this)
        }
        function isScrolledIntoView(el) {
            var rect = el.getBoundingClientRect();
            var elemTop = rect.top;
            var elemBottom = rect.bottom + list.height();

            // Only completely visible elements return true:
            var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
            // Partially visible elements return true:
            //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
            return isVisible;
        }

    }

    // listFilter(size) {
    //     return (s) => {
    //         if (!size || this.focused) {
    //             return true;
    //         }
    //         return (this.currentPrefix + s).toLowerCase().includes(size.toLowerCase()) && (this.currentPrefix + s).toLowerCase() !== size.toLowerCase();
    //     };
    // }

    listFilter(your_collection): any[] {
        if (!your_collection || !your_collection.length) {
            return [];
        }
        your_collection.sort((a, b) => {
            var a = (this.itemKey ? a[this.itemKey] : a);
            var b = (this.itemKey ? b[this.itemKey] : b);
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
        })
        return your_collection.filter(
            (s) => {
                if (!this.value || this.focused) {
                    return true;
                }
                // console.log("(this.currentPrefix + s).toLowerCase()", (this.currentPrefix + s).toLowerCase())
                // console.log("this.value.toLowerCase()", this.value.toLowerCase())
                // console.log("(this.currentPrefix + s).toLowerCase().includes(this.value.toLowerCase())", (this.currentPrefix + s).toLowerCase().includes(this.value.toLowerCase()))
                // return (this.currentPrefix + s).toLowerCase().includes(this.value.toLowerCase()) && (this.currentPrefix + s).toLowerCase() !== this.value.toLowerCase();
                return (this.currentPrefix + (this.itemKey ? s[this.itemKey] : s)).toLowerCase().includes(this.value.toLowerCase()) && (this.currentPrefix + (this.itemKey ? s[this.itemKey] : s)).toLowerCase() !== this.value.toLowerCase();
            });
    }
    fetchListId(item) {
        if (!item) {
            item = '';
        }
        const map = this.list.map((o) => { return (this.currentPrefix + (this.itemKey ? o[this.itemKey] : o)).toLowerCase(); } );
        const index = map.indexOf(item.toLowerCase());
        if (index > -1) {
            this.myNgModel = this.list[index];
            this.myNgModelChange.emit(this.list[index]);
            this.errorStateNotSelected = false;
        } else {
            this.myNgModel = '';
            // this.myNgModelChange.emit('')
            this.errorStateNotSelected = true;
        }
    }
    ngOnInit() {
    }

}
