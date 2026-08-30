// コピー用テキストの生成とクリップボード操作。各ケースページから読み込む。
window.CST = (function () {
  var COLUMNS = [
    ['id', 'ケース'],
    ['prefersDark', 'prefers-color-scheme: dark'],
    ['probeA', 'probe A'],
    ['uaDarkening', 'UA の algorithmic darkening'],
    ['probeB', 'probe B'],
    ['effectiveScheme', '実効カラースキーム'],
    ['bodyBackgroundColor', 'body background-color'],
    ['bodyColor', 'body color'],
    ['visual', '目視']
  ];

  function cell(value) {
    if (value === null || value === undefined || value === '') return '未記録';
    return String(value).replace(/\|/g, '\\|');
  }

  function toMarkdown(record) {
    var lines = [];
    lines.push('| ' + COLUMNS.map(function (c) { return c[1]; }).join(' | ') + ' |');
    lines.push('| ' + COLUMNS.map(function () { return '---'; }).join(' | ') + ' |');
    lines.push('| ' + COLUMNS.map(function (c) { return cell(record[c[0]]); }).join(' | ') + ' |');
    lines.push('');
    lines.push('userAgent: `' + record.userAgent + '`');
    return lines.join('\n');
  }

  function toJson(record) {
    return JSON.stringify(record, null, 2);
  }

  // クリップボード API は WebView では権限が拒否されることがあるため、
  // 失敗時は選択済みの textarea を出して手動コピーに切り替える。
  function copy(text, container) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.rows = 8;
      ta.style.width = '100%';
      container.innerHTML = '';
      container.appendChild(document.createTextNode('コピーに失敗しました。以下を手動で選択してください。'));
      container.appendChild(ta);
      ta.focus();
      ta.select();
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        container.textContent = 'コピーしました。';
      }, fallback);
    } else {
      fallback();
    }
  }

  function button(label, onClick) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.addEventListener('click', onClick);
    return b;
  }

  return {
    COLUMNS: COLUMNS,
    toMarkdown: toMarkdown,
    toJson: toJson,
    copy: copy,
    button: button
  };
})();
