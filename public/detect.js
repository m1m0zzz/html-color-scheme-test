(function () {
  var WHITE = 'rgb(255, 255, 255)';

  function probe(colorScheme) {
    var el = document.createElement('div');
    el.style.cssText = 'background-color: canvas; position: absolute; visibility: hidden;';
    if (colorScheme) {
      el.style.colorScheme = colorScheme;
    }
    document.body.appendChild(el);
    var bg = window.getComputedStyle(el).backgroundColor;
    document.body.removeChild(el);
    return bg;
  }

  // probe A: color-scheme: light を自前で指定した要素。
  // Chromium は force dark 適用時、`only light` を持つ要素以外の color-scheme を
  // dark に強制する。したがって `light`（only なし）の要素が白でなくなれば、
  // UA 側で algorithmic darkening が有効になっていると判断できる。
  // ページ側が only light でオプトアウトしていても、この値は変わらない。
  // https://developer.chrome.com/blog/auto-dark-theme
  var probeA = probe('light');

  // probe B: color-scheme を指定せず、ルート要素からの継承に任せた要素。
  // このページに対して最終的にどちらのカラースキームが適用されたかを示す。
  // ページ自身が dark を宣言している場合も dark になるため、
  // 「ダーク化された」ではなく「実効カラースキーム」として読む。
  var probeB = probe(null);

  var bodyStyle = window.getComputedStyle(document.body);

  var id = location.pathname.split('/').pop().replace(/\.html$/, '');

  var record = {
    id: id,
    title: document.title,
    prefersDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
    prefersLight: window.matchMedia('(prefers-color-scheme: light)').matches,
    probeA: probeA,
    uaDarkening: probeA === WHITE ? '無効' : '有効',
    probeB: probeB,
    effectiveScheme: probeB === WHITE ? 'light' : 'dark',
    bodyBackgroundColor: bodyStyle.backgroundColor,
    bodyColor: bodyStyle.color,
    userAgent: navigator.userAgent,
    visual: null,
    measuredAt: new Date().toISOString()
  };

  var result = document.getElementById('result');

  var rows = [
    ['matchMedia("(prefers-color-scheme: dark)")', String(record.prefersDark)],
    ['matchMedia("(prefers-color-scheme: light)")', String(record.prefersLight)],
    ['probe A: color-scheme: light の canvas', record.probeA],
    ['UA の algorithmic darkening', record.uaDarkening],
    ['probe B: 継承した canvas', record.probeB],
    ['このページの実効カラースキーム', record.effectiveScheme],
    ['body background-color', record.bodyBackgroundColor],
    ['body color', record.bodyColor],
    ['navigator.userAgent', record.userAgent]
  ];

  var table = document.createElement('table');
  rows.forEach(function (row) {
    var tr = document.createElement('tr');
    var th = document.createElement('th');
    th.textContent = row[0];
    var td = document.createElement('td');
    td.textContent = row[1];
    tr.appendChild(th);
    tr.appendChild(td);
    table.appendChild(tr);
  });
  result.appendChild(table);

  // 目視の記録。計算値と実際の描画が食い違う可能性があるため、
  // 測定値とは別に人間の判断を残す。
  var fieldset = document.createElement('fieldset');
  var legend = document.createElement('legend');
  legend.textContent = '目視';
  fieldset.appendChild(legend);

  ['ライト', 'ダーク', '判別不能'].forEach(function (value) {
    var label = document.createElement('label');
    var input = document.createElement('input');
    input.type = 'radio';
    input.name = 'visual';
    input.value = value;
    input.checked = record.visual === value;
    input.addEventListener('change', function () {
      record.visual = value;
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(' ' + value));
    fieldset.appendChild(label);
  });
  result.appendChild(fieldset);

  var status = document.createElement('p');

  var actions = document.createElement('p');
  actions.appendChild(window.CST.button('Markdown をコピー', function () {
    window.CST.copy(window.CST.toMarkdown(record), status);
  }));
  actions.appendChild(document.createTextNode(' '));
  actions.appendChild(window.CST.button('JSON をコピー', function () {
    window.CST.copy(window.CST.toJson(record), status);
  }));
  result.appendChild(actions);
  result.appendChild(status);
})();
