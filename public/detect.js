(function () {
  var rows = [];

  function add(label, value) {
    rows.push([label, value]);
  }

  add('matchMedia("(prefers-color-scheme: dark)")', String(window.matchMedia('(prefers-color-scheme: dark)').matches));
  add('matchMedia("(prefers-color-scheme: light)")', String(window.matchMedia('(prefers-color-scheme: light)').matches));

  // Auto Dark Theme の検出。
  // background-color: canvas / color-scheme: light の要素の計算値が白でなければ、
  // UA による自動ダーク化が適用されている。
  // https://developer.chrome.com/blog/auto-dark-theme
  var probe = document.createElement('div');
  probe.style.cssText = 'background-color: canvas; color-scheme: light; position: absolute; visibility: hidden;';
  document.body.appendChild(probe);
  var probeBg = window.getComputedStyle(probe).backgroundColor;
  document.body.removeChild(probe);

  add('probe background-color', probeBg);
  add('自動ダーク化', probeBg === 'rgb(255, 255, 255)' ? '適用なし' : '適用あり');

  var bodyStyle = window.getComputedStyle(document.body);
  add('body background-color', bodyStyle.backgroundColor);
  add('body color', bodyStyle.color);
  add('navigator.userAgent', navigator.userAgent);

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

  document.getElementById('result').appendChild(table);
})();
