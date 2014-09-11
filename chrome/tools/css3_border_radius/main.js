var master_dir = false;
var master_radius = 0;

var is_master_radius = new Array();
is_master_radius['tl'] = true;
is_master_radius['tr'] = true;
is_master_radius['br'] = true;
is_master_radius['bl'] = true;

var options = new Array();
options['css3']   = true;
options['webkit'] = true;
options['gecko']  = true; 



function update_input_class(dir) {
    value = $('input_' + dir).value;
    
    if (value.length === 0 || value.length === 1) {
        $('input_' + dir).className = 'chars_1';
    } else if (value.length == 2) {
        $('input_' + dir).className = 'chars_2';
    } else if (value.length == 3) {
        $('input_' + dir).className = 'chars_3';
    } else if (value.length == 4) {
        $('input_' + dir).className = 'chars_4';
    } else {
        $('input_' + dir).className = '';
    }
}

function update_options() {
    options['css3']   = $('opt_css3').checked;
    options['webkit'] = $('opt_webkit').checked;
    options['gecko']  = $('opt_gecko').checked;
}

function generate_code(option, master, tl_radius, tr_radius, br_radius, bl_radius) {
    var radii = [tl_radius, tr_radius, br_radius, bl_radius];
    
    var code_short = '';
    var code_tl = '';
    var code_tr = '';
    var code_br = '';
    var code_bl = '';
    
    if (option == 'css3') {
        var declaration_short = 'border-radius: ';
        var declaration_tl    = 'border-top-left-radius: ';
        var declaration_tr    = 'border-top-right-radius: ';
        var declaration_br    = 'border-bottom-right-radius: ';
        var declaration_bl    = 'border-bottom-left-radius: ';
    } else if (option == 'webkit') {
        var declaration_short = '-webkit-border-radius: ';
        var declaration_tl    = '-webkit-border-top-left-radius: ';
        var declaration_tr    = '-webkit-border-top-right-radius: ';
        var declaration_br    = '-webkit-border-bottom-right-radius: ';
        var declaration_bl    = '-webkit-border-bottom-left-radius: ';
    } else if (option == 'gecko') {
        var declaration_short = '-moz-border-radius: ';
        var declaration_tl    = '-moz-border-radius-topleft: ';
        var declaration_tr    = '-moz-border-radius-topright: ';
        var declaration_br    = '-moz-border-radius-bottomright: ';
        var declaration_bl    = '-moz-border-radius-bottomleft: ';
    }
    
    if (tl_radius || tr_radius || bl_radius || br_radius) {
        if (radii.uniq().length === 1) {
            master_radius = radii.uniq().reduce();
            
            if (master_radius != 0) code_short += declaration_short + master_radius + "px;\n";
        } else if (radii.uniq().length == 2) {
            var non_master_radius = radii.without(master_radius);
            var non_master_radius_count = non_master_radius.size();
            non_master_radius = non_master_radius.uniq().reduce();
            
            if (non_master_radius_count === 1) {
                if (master_radius != 0) code_short += declaration_short + master_radius + (master_radius == 0 ? '' : "px") + ";\n";
                
                if (tl_radius && tl_radius != master_radius) code_tl += declaration_tl + tl_radius + (tl_radius == 0 ? '' : "px") + ";\n";
                if (tr_radius && tr_radius != master_radius) code_tr += declaration_tr + tr_radius + (tr_radius == 0 ? '' : "px") + ";\n";
                if (br_radius && br_radius != master_radius) code_br += declaration_br + br_radius + (br_radius == 0 ? '' : "px") + ";\n";
                if (bl_radius && bl_radius != master_radius) code_bl += declaration_bl + bl_radius + (bl_radius == 0 ? '' : "px") + ";\n";
            } else if (non_master_radius_count == 2) {
                if (non_master_radius == 0) {
                    if (tl_radius && tl_radius != 0) code_tl += declaration_tl + master_radius + (master_radius == 0 ? '' : "px") + ";\n";
                    if (tr_radius && tr_radius != 0) code_tr += declaration_tr + master_radius + (master_radius == 0 ? '' : "px") + ";\n";
                    if (br_radius && br_radius != 0) code_br += declaration_br + master_radius + (master_radius == 0 ? '' : "px") + ";\n";
                    if (bl_radius && bl_radius != 0) code_bl += declaration_bl + master_radius + (master_radius == 0 ? '' : "px") + ";\n";
                } else {
                    if (master_radius != 0) code_short += declaration_short + master_radius + (master_radius == 0 ? '' : "px") + ";\n";
                    
                    if (tl_radius && tl_radius != master_radius) code_tl += declaration_tl + tl_radius + (tl_radius == 0 ? '' : "px") + ";\n";
                    if (tr_radius && tr_radius != master_radius) code_tr += declaration_tr + tr_radius + (tr_radius == 0 ? '' : "px") + ";\n";
                    if (br_radius && br_radius != master_radius) code_br += declaration_br + br_radius + (br_radius == 0 ? '' : "px") + ";\n";
                    if (bl_radius && bl_radius != master_radius) code_bl += declaration_bl + bl_radius + (bl_radius == 0 ? '' : "px") + ";\n";
                }
            } else if (non_master_radius_count == 3) {
                if (non_master_radius == 0) {
                    if (tl_radius != 0) code_tl += declaration_tl + tl_radius + (tl_radius == 0 ? '' : "px") + ";\n";
                    if (tr_radius != 0) code_tr += declaration_tr + tr_radius + (tr_radius == 0 ? '' : "px") + ";\n";
                    if (br_radius != 0) code_br += declaration_br + br_radius + (br_radius == 0 ? '' : "px") + ";\n";
                    if (bl_radius != 0) code_bl += declaration_bl + bl_radius + (bl_radius == 0 ? '' : "px") + ";\n";
                } else {
                    if (non_master_radius != 0) code_short += declaration_short + non_master_radius + (non_master_radius == 0 ? '' : "px") + ";\n";
                    
                    if (tl_radius && tl_radius != non_master_radius) code_tl += declaration_tl + tl_radius + (tl_radius == 0 ? '' : "px") + ";\n";
                    if (tr_radius && tr_radius != non_master_radius) code_tr += declaration_tr + tr_radius + (tr_radius == 0 ? '' : "px") + ";\n";
                    if (br_radius && br_radius != non_master_radius) code_br += declaration_br + br_radius + (br_radius == 0 ? '' : "px") + ";\n";
                    if (bl_radius && bl_radius != non_master_radius) code_bl += declaration_bl + bl_radius + (bl_radius == 0 ? '' : "px") + ";\n";
                }
            }
        } else if (radii.compact().uniq().length == 3 || radii.compact().uniq().length == 4) {
            if (tl_radius && tl_radius != 0) code_tl += declaration_tl + tl_radius + (tl_radius == 0 ? '' : "px") + ";\n";
            if (tr_radius && tr_radius != 0) code_tr += declaration_tr + tr_radius + (tr_radius == 0 ? '' : "px") + ";\n";
            if (br_radius && br_radius != 0) code_br += declaration_br + br_radius + (br_radius == 0 ? '' : "px") + ";\n";
            if (bl_radius && bl_radius != 0) code_bl += declaration_bl + bl_radius + (bl_radius == 0 ? '' : "px") + ";\n";
        }
    }
    
    return code_short + code_tl + code_tr + code_br + code_bl;
}

function update_textarea() {
    var tl_radius = $('input_tl').value.strip();
    var tr_radius = $('input_tr').value.strip();
    var br_radius = $('input_br').value.strip();
    var bl_radius = $('input_bl').value.strip();
    
    master_radius = master_radius.strip();
    
    var code = '';
    if (options['webkit']) code += generate_code('webkit', master_radius, tl_radius, tr_radius, br_radius, bl_radius);
    if (options['gecko'])  code += generate_code('gecko',  master_radius, tl_radius, tr_radius, br_radius, bl_radius);
    if (options['css3'])   code += generate_code('css3',   master_radius, tl_radius, tr_radius, br_radius, bl_radius);
    
    $('code').value = code.strip();
}

function apply_radii() {
    var tl_radius = $('input_tl').value > 125 ? 125 : (! $('input_tl').value ? 0 : $('input_tl').value.strip());
    var tr_radius = $('input_tr').value > 125 ? 125 : (! $('input_tr').value ? 0 : $('input_tr').value.strip());
    var br_radius = $('input_br').value > 125 ? 125 : (! $('input_br').value ? 0 : $('input_br').value.strip());
    var bl_radius = $('input_bl').value > 125 ? 125 : (! $('input_bl').value ? 0 : $('input_bl').value.strip());
    
    if ($('surface').style.borderTopLeftRadius != 'undefined') {
        $('surface').style.borderTopLeftRadius = tl_radius + 'px';
        $('surface').style.borderTopRightRadius = tr_radius + 'px';
        $('surface').style.borderBottomRightRadius = br_radius + 'px';
        $('surface').style.borderBottomLeftRadius = bl_radius + 'px';
    }
    
    if ($('surface').style.WebkitBorderTopLeftRadius != 'undefined') {
        $('surface').style.WebkitBorderTopLeftRadius = tl_radius + 'px';
        $('surface').style.WebkitBorderTopRightRadius = tr_radius + 'px';
        $('surface').style.WebkitBorderBottomRightRadius = br_radius + 'px';
        $('surface').style.WebkitBorderBottomLeftRadius = bl_radius + 'px';
    }
    
    if ($('surface').style.MozBorderRadiusTopright != 'undefined') {
        $('surface').style.MozBorderRadiusTopleft = tl_radius + 'px';
        $('surface').style.MozBorderRadiusTopright = tr_radius + 'px';
        $('surface').style.MozBorderRadiusBottomright = br_radius + 'px';
        $('surface').style.MozBorderRadiusBottomleft = bl_radius + 'px';
    }
}

function observe_input_value(dir, value) {
    if (! master_dir) {
        master_dir = dir;
        master_radius = $('input_' + master_dir).value;
    }
    
    if (dir == master_dir) {
        master_radius = $('input_' + master_dir).value;
        
        if (master_dir != 'tl' && is_master_radius['tl']) $('input_tl').value = master_radius;
        if (master_dir != 'tr' && is_master_radius['tr']) $('input_tr').value = master_radius;
        if (master_dir != 'br' && is_master_radius['br']) $('input_br').value = master_radius;
        if (master_dir != 'bl' && is_master_radius['bl']) $('input_bl').value = master_radius;
        
    } else if (value != master_radius) {
        is_master_radius[dir] = false;
    }
    
    update_input_class('tl');
    update_input_class('tr');
    update_input_class('br');
    update_input_class('bl');
    
    update_textarea();
    apply_radii();
}

function observe_input_keydown(e, dir) {
    var code = e.charCode ? e.charCode : e.keyCode;
    
    var increment = e.shiftKey ? 10 : 1;
    
    if (code == Event.KEY_UP) {
        $('input_' + dir).value = parseInt($('input_' + dir).value) + increment;
    } else if (code == Event.KEY_DOWN) {
        if ((parseInt($('input_' + dir).value) - increment) >= 0) {
            $('input_' + dir).value = parseInt($('input_' + dir).value) - increment;
        } else {
            $('input_' + dir).value = 0;
        }
    }
}

function observe_input_keypress(e) {
    var code = e.charCode ? e.charCode : e.keyCode;
    
    if (! e.shiftKey && ! e.ctrlKey && ! e.altKey && ! e.metaKey && code != 46 && (code > 31 && (code < 48 || code > 57))) return false;
    return true;
}

function observe_option(opt, checked) {
    update_options();
    if (master_radius) update_textarea();
}

function focus_textarea() {
    $('code').activate();
    setTimeout("$('code').activate()", 100);
}

new Form.Element.Observer('input_tl', 0.15, function (el, value) { observe_input_value('tl', value) });
new Form.Element.Observer('input_tr', 0.15, function (el, value) { observe_input_value('tr', value) });
new Form.Element.Observer('input_bl', 0.15, function (el, value) { observe_input_value('bl', value) });
new Form.Element.Observer('input_br', 0.15, function (el, value) { observe_input_value('br', value) });

$('input_tl').observe('keydown', function (e) { observe_input_keydown(e, 'tl') });
$('input_tr').observe('keydown', function (e) { observe_input_keydown(e, 'tr') });
$('input_bl').observe('keydown', function (e) { observe_input_keydown(e, 'bl') });
$('input_br').observe('keydown', function (e) { observe_input_keydown(e, 'br') });

$('input_tl').observe('click', function (e) { $('input_tl').activate() });
$('input_tr').observe('click', function (e) { $('input_tr').activate() });
$('input_bl').observe('click', function (e) { $('input_bl').activate() });
$('input_br').observe('click', function (e) { $('input_br').activate() });

new Form.Element.Observer('opt_css3',   0.15, function (el) { observe_option('css3',   el.checked) });
new Form.Element.Observer('opt_webkit', 0.15, function (el) { observe_option('webkit', el.checked) });
new Form.Element.Observer('opt_gecko',  0.15, function (el) { observe_option('gecko',  el.checked) }); 