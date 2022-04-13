// Đối tượng `Validator`
function Validator(options) {

    function getParent(element, selector) {
        while(element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    var formElement = document.querySelector(options.form);

    var selectorRules = {};

    function validate(inputElement, rule) {
        var errorMessage;
        var msg = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);

        var rules = selectorRules[rule.selector];

        for (var i = 0; i < rules.length; ++i) {

            switch(inputElement.type) {
                case 'checkbox':
                case 'radio':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    )
                    break;

                default:
                    errorMessage = rules[i](inputElement.value);
            }
            


            if (errorMessage) {
                break;
            }
        }
        if (errorMessage) {
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
            msg.innerText = errorMessage;
        } else {
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
            msg.innerHTML = '';
        }

        return !errorMessage;
    }

    if (formElement) {

        formElement.onsubmit = function(e) {
            e.preventDefault();
            var isFormValid = true;
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });
            

            if (isFormValid) {
                if(typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]:not([type="checkbox"])');
                    var formValues = Array.from(enableInputs).reduce(function(values, input) {
                        values[input.name] = input.value;
                        return values;   
                    }, {});
                    options.onSubmit(formValues);
                }
            }
        }

        options.rules.forEach(function (rule) {

            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }
            var inputElement = formElement.querySelector(rule.selector);

            if (inputElement) {
                inputElement.onblur = function () {

                    if (rule.selector != '#checkbox') {
                        validate(inputElement, rule);
                    }
                    
                }
                inputElement.oninput = function() {
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
                    var msg = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                    msg.innerText = '';
                }
            }
        })
    }
}

//Định nghĩa rules

Validator.isRequired = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            if(!value === 'null') {
                value = value.trim();
            }
            return value ? undefined : message || 'Vui lòng nhập trường này';
        }
    }

}

Validator.isEmail = function (selector, message) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Trường này phải là email';
        }
    }
}

Validator.minLength = function (selector, min, message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} kí tự`;
        }
    }
}
