export default {
	props: {
		size: String,
		resize: String,
		readonly: Boolean,
		autofocus: Boolean,
		icon: String,
		disabled: Boolean,
		name: String,
		autosize: {
			type: [Boolean, Object],
			default: false
		},
		autoComplete: {
			type: String,
			default: 'off'
		},
		form: String,
		maxlength: Number,
		minlength: Number,
		max: {},
		min: {},
		step: {},
		validateEvent: {
			type: Boolean,
			default: true
		},
		onIconClick: Function,
		symbol: {
			type: String,
			default: '￥'
		},
		decimals: {
			type: Number
			//   default: 2
		},
		comma: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		value: {
			immediate: true,
			handler(value) {
				const newVal = +value;
				if (isNaN(newVal)) return;
				this.trueValue = newVal;
				this.$emit('input', this.trueValue);
			}
		}
	},
	computed: {
		validating() {
			return this.$parent.validateState === 'validating';
		},
		textareaStyle() {
			return merge({}, this.textareaCalcStyle, {
				resize: this.resize
			});
		}
	},
	methods: {
		handleBlur(event) {
			this.$emit('blur', event);
			if (this.validateEvent) {
				this.dispatch('ElFormItem', 'el.form.blur', [this.currentValue]);
			}
		},
		inputSelect() {
			this.$refs.input.select();
		},
		handleFocus(event) {
			this.$emit('focus', event);
		},
		handleInput(event) {
			const value = event.target.value;
			this.$emit('input', value);
			this.setCurrentValue(value);
			this.$emit('change', value);
		},
		handleIconClick(event) {
			if (this.onIconClick) {
				this.onIconClick(event);
			}
			this.$emit('click', event);
		},
		setCurrentValue(value) {
			if (value === this.currentValue) return;
			this.currentValue = value;
			if (this.validateEvent) {
				this.dispatch('ElFormItem', 'el.form.change', [value]);
			}
		},
		setformat(number) {
			if (this.comma) {
				const digitsRE = /(\d{3})(?=\d)/g;
				let decimals = this.decimals;
				if (!this.decimals && this.decimals !== 0) {
					var index = (number + '').indexOf('.');
					var l = (number + '').length;
					decimals = index > -1 ? l - index - 1 : 0;
				}
				const stringified = number.toFixed(this.decimals);
				const int = stringified.slice(0, -1 - this.decimals);
				const i = int.length % 3;
				const head = i > 0 ?
					(int.slice(0, i) + (int.length > 3 ? ',' : '')) :
					'';
				const float = this.decimals || this.decimals === 0 ?
					stringified.slice(-1 - this.decimals) :
					'';
				const sign = this.innerValue < 0 ? '-' : '';
				this.innerValue = sign + this.symbol + head +
					int.slice(i).replace(digitsRE, '$1,') +
					float;

			} else if (!this.comma) {
				this.innerValue = isNaN(number) ? '' : (this.decimals || this.decimals === 0) ? this.symbol + number.toFixed(this.decimals) : this.symbol + number;
			}
		},
		handleFilterFocus(event) {
			this.innerValue = this.trueValue;
			this.$emit('focus', event);
		},
		handleFilterBlur($event) {
			this.trueValue = +$event.target.value.replace(/[^\d.]/g, '');
			this.setformat(this.trueValue);
			this.$emit('blur', $event);
			if (this.validateEvent) {
				this.dispatch('ElFormItem', 'el.form.blur', [this.trueValue]);
			}
			this.$emit('input', this.trueValue);
		}
	},

	created() {
		this.$on('inputSelect', this.inputSelect);
	}

}