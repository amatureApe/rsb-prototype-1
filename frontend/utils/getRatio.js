const getRatio = (a, b, tolerance) => {

    /*where a is the first number, b is the second number,  and tolerance is a percentage 
    of allowable error expressed as a decimal. 753,4466,.08 = 1:6, 753,4466,.05 = 14:83,*/

    if (a > b) {
        var bg = a;
        var sm = b;
    } else {
        var bg = b;
        var sm = a;
    }
    for (var i = 1; i < 1000000; i++) {
        var d = sm / i;
        var res = bg / d;
        var howClose = Math.abs(res - res.toFixed(0));
        if (howClose < tolerance) {
            if (a > b) {
                return res.toFixed(0) + ':' + i;
            } else {
                return i + ':' + res.toFixed(0);
            }
        }
    }
}

export default getRatio