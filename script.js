// Set year in footer
document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('issueForm');
const status = document.getElementById('formStatus');
const steps = document.querySelectorAll('.step');

const RECIPIENT = 'musicfolder.app@gmail.com';

// Map fieldset position → step index
const fieldsetByStep = Array.from(form.querySelectorAll('fieldset'));

// Update active step based on which fieldset the focused field belongs to
function updateActiveStep(activeFieldset) {
  const idx = fieldsetByStep.indexOf(activeFieldset);
  if (idx === -1) return;
  steps.forEach((s, i) => s.classList.toggle('active', i === idx));
}

form.addEventListener('focusin', (e) => {
  const fs = e.target.closest('fieldset');
  if (fs) updateActiveStep(fs);
});

// Let the step buttons scroll to the matching fieldset
steps.forEach((step, i) => {
  step.addEventListener('click', () => {
    const fs = fieldsetByStep[i];
    if (fs) {
      fs.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const firstField = fs.querySelector('input, select, textarea');
      if (firstField) setTimeout(() => firstField.focus({ preventScroll: true }), 400);
    }
  });
  step.style.cursor = 'pointer';
});

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

form.addEventListener('submit', (e) => {
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

  // Email subject: prefix with type for filtering
  const subject = `[${type}] ${title}`;

  // Build the body
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
  lines.push('Please attach any screenshots or recordings before sending.');

  const body = lines.join('\n');

  const mailto = `mailto:${RECIPIENT}`
    + `?subject=${encodeURIComponent(subject)}`
    + `&body=${encodeURIComponent(body)}`;

  // iOS Mail has a ~2000 char mailto limit
  if (mailto.length > 1900) {
    status.className = 'form-status error';
    status.innerHTML = 'Your report is quite long — please trim some details, or email <a href="mailto:musicfolder.app@gmail.com" style="color:inherit;text-decoration:underline">musicfolder.app@gmail.com</a> directly.';
    return;
  }

  window.location.href = mailto;

  status.className = 'form-status success';
  status.innerHTML = '✓ Your email app should now be open with your report ready to send. Just attach any screenshots and tap Send.';
  status.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
