import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

icons = {
    'Оздоровительный массаж': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s-2 4-2 7c0 3 2 5 2 5s2-2 2-5c0-3-2-7-2-7z"/><path d="M12 15s4 1 6-2c2-3 3-5 3-5s-2 3-5 4c-3 1-4-1-4-1z"/><path d="M12 15s-4 1-6-2c-2-3-3-5-3-5s2 3 5 4c3 1 4-1 4-1z"/></svg>',
    'Иглоукалывание': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M8 6h8M10 10h4M17 4l-2 16M5 4l2 16"/></svg>',
    'ЛФК': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2"/><path d="M12 7v6M8 11h8M12 13l-4 8M12 13l4 8"/></svg>',
    'Массаж лица': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10z"/><path d="M8 14c1.5 1.5 6.5 1.5 8 0M9 9h.01M15 9h.01"/></svg>',
    'Миофасциальный массаж': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 00-2-2v0a2 2 0 00-2 2v0M14 10V4a2 2 0 00-2-2v0a2 2 0 00-2 2v0M10 10.5V5a2 2 0 00-2-2v0a2 2 0 00-2 2v0M6 12v-1a2 2 0 00-2-2v0a2 2 0 00-2 2v0M18 11a4 4 0 014 4v2a8 8 0 01-8 8h-2c-2.8 0-4.5-.86-5.8-2L2 15l4.8-1.4a2 2 0 012.5 1.5l1.7 5.1"/></svg>',
    'Расслабляющий массаж': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="17" rx="7" ry="3"/><ellipse cx="12" cy="13" rx="5" ry="2"/><path d="M12 11c-1.5 0-3-.5-3-1.5s1.5-1.5 3-1.5 3 .5 3 1.5-1.5 1.5-3 1.5z"/><path d="M12 8C9 5 9 2 9 2s3 0 6 3-3 3-3 3z"/></svg>',
    'Реабилитация': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 7.65L12 21.42l8.42-8.42a5.4 5.4 0 000-7.65z"/><path d="M3 12h3l3-4 4 8 3-4h5"/></svg>',
    'Спортивный массаж': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 5h12M6 19h12M4 9h16v6H4zM2 10h2v4H2zM20 10h2v4h-2z"/></svg>',
    'Юмейхо-терапия': '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a5 5 0 010 10 5 5 0 000 10"/><circle cx="12" cy="7" r="1"/><circle cx="12" cy="17" r="1"/></svg>'
}

def replacer(match):
    title = match.group(1)
    icon = icons.get(title, icons['Оздоровительный массаж'])
    return f'<div class="card__icon" aria-hidden="true">\n                {icon}\n              </div>\n              <h3 class="card__title">{title}</h3>'

new_content = re.sub(r'<div class="card__icon"[^>]*>.*?</div>\s*<h3 class="card__title">(.*?)</h3>', replacer, content, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
