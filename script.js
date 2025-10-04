(function() {
  function createRow(index) {
    const tr = document.createElement('tr');
    const num = document.createElement('td');
    num.className = 'num';
    num.textContent = index + 1;

    const desc = document.createElement('td');
    desc.className = 'desc';
    desc.contentEditable = true;
    desc.dataset.placeholder = 'Type item description here…';

    const marks = document.createElement('td');
    marks.className = 'marks';

    const groups = ['bosy-kg','bosy-dpkg','eosy-kg','eosy-dpkg'];
    groups.forEach((g) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.dataset.group = g;
      label.appendChild(input);
      marks.appendChild(label);
    });

    tr.appendChild(num);
    tr.appendChild(desc);
    tr.appendChild(marks);
    return tr;
  }

  function populateTables() {
    document.querySelectorAll('table.checklist').forEach((table) => {
      const tbody = table.querySelector('tbody');
      const count = parseInt(table.dataset.items, 10) || 10;
      for (let i = 0; i < count; i++) {
        tbody.appendChild(createRow(i));
      }
    });
  }

  function recalcTotals() {
    const domains = ['gross-motor','fine-motor','self-help','expressive','cognitive','receptive','socio-emotional'];
    domains.forEach((domain) => {
      const table = document.querySelector(`table.checklist[data-domain="${domain}"]`);
      if (!table) return;
      const inputs = Array.from(table.querySelectorAll('input[type="checkbox"]'));
      const bosyKg = inputs.filter(i => i.dataset.group === 'bosy-kg' && i.checked).length;
      const eosyKg = inputs.filter(i => i.dataset.group === 'eosy-kg' && i.checked).length;
      const tBosy = document.querySelector(`[data-total="${domain}-bosy"]`);
      const tEosy = document.querySelector(`[data-total="${domain}-eosy"]`);
      if (tBosy) tBosy.textContent = String(bosyKg);
      if (tEosy) tEosy.textContent = String(eosyKg);
    });
  }

  function enforceSinglePerSide(e) {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;
    const td = target.closest('td.marks');
    if (!td) return;
    const group = target.dataset.group;
    if (!group) return;

    // ensure only one of KG/DPKG is chosen for BOSY and EOSY per row
    const siblings = Array.from(td.querySelectorAll('input[type="checkbox"]'));
    if (group.startsWith('bosy')) {
      siblings.filter(i => i.dataset.group && i.dataset.group.startsWith('bosy') && i !== target)
        .forEach(i => i.checked = false);
    }
    if (group.startsWith('eosy')) {
      siblings.filter(i => i.dataset.group && i.dataset.group.startsWith('eosy') && i !== target)
        .forEach(i => i.checked = false);
    }
    recalcTotals();
  }

  function clearAll() {
    document.querySelectorAll('input[type="checkbox"]').forEach((i) => i.checked = false);
    recalcTotals();
  }

  function wire() {
    populateTables();
    document.body.addEventListener('change', enforceSinglePerSide);
    document.getElementById('btn-clear')?.addEventListener('click', clearAll);
    document.getElementById('btn-print')?.addEventListener('click', () => window.print());
  }

  document.addEventListener('DOMContentLoaded', wire);
})();
