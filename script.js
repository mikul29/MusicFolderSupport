// Set year in footer
document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('issueForm');
const status = document.getElementById('formStatus');

// Clear invalid styling when user fixes the field
form.addEventListener('input', (e) => {
  if (e.target.matches('input, select, textarea')) {
    if (e.target.validity.valid) {
      e.target.classList.remove('invalid');
    }
  }
});

form.addEventListener('change', (e) => {
  if (e.target.matches('input[type="radio"]')) {
    e.target.classList.remove('invalid');
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.className = 'form-status';
  status.textContent = '';

  // Validate required fields
  let firstInvalid = null;
  form.querySelectorAll('[required]').forEach((field) => {
    // For radios, only flag once
    if (field.type === 'radio') {
      const group = form.querySelectorAll(`[name="${field.name}"]`);
      const anyChecked = Array.from(group).some(r => r.checked);
      if (!anyChecked && !firstInvalid) {
        firstInvalid = field;
      }
      return;
    }
    if (!field.validity.valid) {
      field.classList.add('invalid');
      if (!firstInvalid) firstInvalid = field;
    } else {
      field.classList.remove('invalid');
    }
  });

  if (firstInvalid) {
    firstInvalid.focus();
    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    status.className = 'form-status error';
    status.textContent = 'Please fill in the required fields before submitting.';
    return;
  }

  // Pull values
  const get = (id) => (document.getElementById(id)?.value || '').trim();
  const getRadio = (name) => {
    const picked = form.querySelector(`[name="${name}"]:checked`);
    return picked ? picked.value : '';
  };

  const name        = get('name');
  const email       = get('email');
  const type        = getRadio('type');
  const title       = get('title');
  const description = get('description');
  const frequency   = get('frequency');
  const stepsField  = get('steps');
  const device      = get('device');
  const ios         = get('ios');
  const appVersion  = get('appVersion');

  // Build a clean, readable message body that arrives in your inbox
  const lines = [];
  lines.push('━━━ MUSIC FOLDER SUPPORT REQUEST ━━━');
  lines.push('');
  lines.push('— Reporter —');
  if (name) lines.push(`Name: ${name}`);
  lines.push(`Email: ${email}`);
  lines.push('');
  lines.push('— The Issue —');
  lines.push(`Type: ${type}`);
  lines.push(`Summary: ${title}`);
  if (frequency) lines.push(`Frequency: ${frequency}`);
  lines.push('');
  lines.push('Description:');
  lines.push(description);
  lines.push('');

  if (stepsField) {
    lines.push('Steps to reproduce:');
    lines.push(stepsField);
    lines.push('');
  }

  if (device || ios || appVersion) {
    lines.push('— Setup —');
    if (device)     lines.push(`Device: ${device}`);
    if (ios)        lines.push(`iOS version: ${ios}`);
    if (appVersion) lines.push(`App version: ${appVersion}`);
    lines.push('');
  }

  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('Sent from the Music Folder support portal.');

  // Submit to Web3Forms
  const submitBtn = form.querySelector('.submit-btn');
  const btnText = submitBtn?.querySelector('span');
  const originalText = btnText?.textContent;
  if (submitBtn) submitBtn.disabled = true;
  if (btnText) btnText.textContent = 'Sending…';

  try {
    const formData = new FormData(form);

    // Override the subject and message with our nicely-formatted versions
    formData.set('subject', `[${type}] ${title}`);
    formData.set('message', lines.join('\n'));
    // Set replyto so the inbox lets you reply to the user directly
    if (email) formData.set('replyto', email);

    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });
    const data = await res.json();

    if (res.ok && data.success) {
      form.reset();
      status.className = 'form-status success';
      status.innerHTML = '✓ Report sent. Thanks — I\'ll be in touch soon.';
      if (btnText) btnText.textContent = 'Sent ✓';
      setTimeout(() => {
        if (btnText && originalText) btnText.textContent = originalText;
        if (submitBtn) submitBtn.disabled = false;
      }, 4000);
    } else {
      status.className = 'form-status error';
      status.innerHTML = (data.message || 'Something went wrong.') + ' Please try emailing <a href="mailto:musicfolder.app@gmail.com" style="color:inherit;text-decoration:underline">musicfolder.app@gmail.com</a> directly.';
      if (btnText && originalText) btnText.textContent = originalText;
      if (submitBtn) submitBtn.disabled = false;
    }
  } catch (err) {
    status.className = 'form-status error';
    status.innerHTML = 'Network error. Please check your connection or email <a href="mailto:musicfolder.app@gmail.com" style="color:inherit;text-decoration:underline">musicfolder.app@gmail.com</a> directly.';
    if (btnText && originalText) btnText.textContent = originalText;
    if (submitBtn) submitBtn.disabled = false;
  }

  status.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
