(function () {
    var s, e, d;
    $(document).bind('api-loading', function () {
        s = new Date();
        var loading = $('#loading');
        if (loading) {
            var loadingStyle = loading[0].style;

            loadingStyle.backgroundColor = '#BE0000';
            loadingStyle.color = '#fff';
            loading.data('timer', setInterval(function () {
                if (!loadingStyle.backgroundColor) {
                    loadingStyle.backgroundColor = '#BE0000';
                    loadingStyle.color = '#fff';
                } else {
                    loadingStyle.backgroundColor = '';
                    loadingStyle.color = '#000';
                }
            }, 500));
        }
    }).bind('api-load-success', function () {
        var loading = $('#loading');
        var loadingStyle = loading[0].style;

        e = new Date();
        
        var d = ((e - s)/1000 + 'ms');
        
        clearInterval(loading.data('timer'));

        var v = 'version ' + jquerydocs.version;
        loading.html('Loaded docs - ' + v).fadeOut(2000);
        $('#version').html(v);

        alphaEl = $('#alpha').click(function (ev) {
            if (ev.target.nodeName == 'A') {
                $('#query').val(ev.target.innerHTML);
                queryDocs();
                return false;
            }
        }).empty();
        
        var letters = [];
        for (i = 0; i < jquerydocs.letters.length; i++) {
            letters.push('<li><a href="#?q=' + jquerydocs.letters[i] + '">' + jquerydocs.letters[i].toUpperCase() + '</a></li>');
        }
        
        alphaEl.append(letters.join(''));

        // trottle the searching
        var timer = null;
        var last = '';
        $('#query').focus().keyup(function () {
            if (this.value != last) {
                if (timer) clearTimeout(timer);
                last = this.value;
                timer = setTimeout(queryDocs, 250);
            } 
        });
    });
})();

function queryDocs() {
    if (jquerydocs == null) return;

    // the query trimmed
    var q = $('#query').val().toLowerCase().replace( /^\s+|\s+$/g,"");
    var docs = $('#docs').empty();
    $('#count').html('');
    
    if (q == '') {
        return;
    }

    var results = jquerydocs.find(q);
    
    var i, result, html = [], resultData = [], resultKeys = [];
    
    for (i = 0; i < results.length; i++) {
        result = results[i];
        // console.dir(result);
        params(result);
        options(result);
        examples(result);
        resultData[result.id] = template().replace(/%([a-z]*)%/ig, function (m, l) {
            return result[l] || "";
        }); //.deWikify();
        
        resultKeys.push(result.id);
    }
    
    for (k in resultKeys.sort()) {
        html.push(resultData[resultKeys[k]]);
    }
    
    docs.append(html.join(''));

    // apply interactive hooks
    $('div.apiHeader', docs).click(function (ev) {
        if (ev.target.nodeName == 'A' && ev.target.className != 'fnName') return true;
        var li = $(this).parents('li:first');
        if (li.is('.focus')) {
            li.removeClass('focus').find('div.detail').slideUp('fast');
        } else {
            li.addClass('focus').find('div.detail').slideDown('fast');
        }

        return false;
    });
    
    fixLinks(docs);

    /** Tabs */
    $('ul.nav a', docs).click(function () {
        // originaly was a one liner, but waaay too confusing
        var $link = $(this);
        var holder = $link.parents('div:first');
        $('ul a', holder).removeClass('selected');

        var sel = cleanSelector(this.hash);

        $('> div', holder).hide().filter(sel).show();
        $link.addClass('selected');

        // hook the examples
        var data = jquerydocs.data[$link.parents('li.functionAPI:first').attr('id')];
        runExample(data);

        return false;
    });
    
}

function examples(data, blank_iframe) {
    if (!data.examples || data.examplesHTML) return;
    data.nExamples = ' class="no"';
    
    if (!blank_iframe) blank_iframe = '/index-blank.html';
    
    var examples = [], e, iframe;
    for (var i = 0; i < data.examples.length; i++) {
        e = data.examples[i];
        
        iframe = '';
        
        // only add the iframe if there's HTML to render the example
        if (e.html) {
            iframe = '<iframe id="' + e.exampleId + '" class="example" src="' + blank_iframe + '"></iframe>';
        }
        examples.push('<li><p>' + e.desc + '</p><p><pre>' + e.htmlCode + '</pre></p>' + iframe + '</li>');
    }
    data.examplesHTML = '<ol>' + examples.join('') + '</ol>';

    // hide examples and args if we don't have any
    if (examples.length != 0) data.nExamples = '';
}

function options(data) {
    // special case for options
    if (!data.options) {
        data.nOptions = ' class="no"';
    }
    
    if (!data.options || data.optionsHTML) return;
    data.nOptions = ' class="no"';

    var options = [], o;
    for (var i = 0; i < data.options.length; i++) {
        o = data.options[i];
    
        options.push('<li><div class="header"><span class="paramName">' + o.name + '</span> <span class="paramType">' + linkifyTypes(o.type) + '</span>' + (o.def ? ' <span>Default: ' + o.def + '</span>' : '') + '</div><div class="body">' + o.desc + '</div>');
    }
    
    data.optionsHTML = '<ol>' + options.join('') + '</ol>';
    if (data.options.length != 0) data.nOptions = '';
}

function params(data) {
    if (!data.params || data.paramsHTML) return;
    data.nArgs = ' class="no"';
        
    var params = [], nArgs = 0, args = [], p;
    for (var i = 0; i < data.params.length; i++) {
        nArgs = i+1;
        p = data.params[i];

        params.push((p.optional ? '[' : '') + '<span class="paramName">' + p.name + '</span> <span class="paramType">' + linkifyTypes(p.type) + '</span>' + (p.optional ? ']' : ''));

        args.push('<li><div class="header"><span class="paramName">' + p.name + (p.optional ? ' <small><em>(Optional)</em></small>' : '') + '</span> <span class="paramType">' + linkifyTypes(p.type) + '</span></div><div class="body">' + p.desc + '</div></li>');
    }
    
    data.paramsHTML = params.join(', ');
    if (data.type == 'function') data.paramsHTML = '(' + data.paramsHTML + ')';
    data.argsHTML = '<ol>' + args.join('') + '</ol>';
    if (data.params.length != 0) data.nArgs = '';
}

function template() {
    return [
    '<li id="%searchname%%id%" class="functionAPI">',
        '<div class="apiHeader">',
            '<span class="type">%type%</span> <span class="fn"><a class="fnName" href="/jquery-api/%searchname%">%name%</a> %paramsHTML%</span> returns <span class="returns">%return%</span>',
        '</div>',
        '<div class="shortDesc">%desc%</div>',
        '<div class="detail">',
            '<ul class="nav">',
                '<li><a class="selected" href="#%id%overview">Overview</a></li>',
                '<li%nOptions%><a href="#%id%options">Options</a></li>',
                '<li%nExamples%><a href="#%id%examples">Examples</a></li>',
                '<li%nArgs%><a href="#%id%args">Arguments</a></li>',
            '</ul>',
            '<div class="longdesc" id="%id%overview">%longdesc%</div>',
            '<div class="options" id="%id%options">%optionsHTML%</div>',
            '<div class="examples" id="%id%examples">%examplesHTML%</div>',
            '<div class="args" id="%id%args">%argsHTML%</div>',
        '</div>',
    '</li>'].join('');
}









