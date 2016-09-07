function number_format(number, decimals, decPoint, thousandsSep){
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '')
    var n = !isFinite(+number) ? 0 : +number
    var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
    var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
    var dec = (typeof decPoint === 'undefined') ? '.' : decPoint
    var s = ''

    var toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec)
        return '' + (Math.round(n * k) / k)
                .toFixed(prec)
    }

    // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
    }

    return s.join(dec)
}

function color_code(value, minValue, maxValue, tag, r1, g1, b1, r2, g2, b2, isFractive) {
    if(!value) {
        value = 0;
    }
    if(value) {
        var alpha = (value - minValue) / (maxValue - minValue);
        var r = Math.round(r1 + (r2 - r1)*alpha);
        var g = Math.round(g1 + (g2 - g1)*alpha);
        var b = Math.round(b1 + (b2 - b1)*alpha);
        return "<" + tag + " style='background-color: rgba(" + r + ", " + g + ", " + b + ", 1);'>" + nf_by_digits(value, minValue, maxValue, isFractive) + "</" + tag + ">";
    } else {
        return "<" + tag + ">" + nf_by_digits(value, minValue, maxValue, isFractive) + "</" + tag + ">";
    }
}

function nf_by_digits(value, minValue, maxValue, isFractive) {
    if(value) {
        if ((maxValue > 100000) || (minValue > 1000 && maxValue > 10000)) {
            return number_format((value/1000), 0, ".", " ") + "k";
        } else if(minValue > 100) {
            return number_format(value, 0, ".", " ");
        } else if(isFractive) {
            return number_format(value, 2, ".", " ");
        } else {
            return number_format(value, 0, ".", " ");
        }
    } else {
        return "";
    }
}