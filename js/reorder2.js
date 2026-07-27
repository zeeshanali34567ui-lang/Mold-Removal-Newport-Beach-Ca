const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

// Match each section exactly by its starting comment and the following </section>
const getSection = (name) => {
  const regex = new RegExp(`(<!-- ===.*?SECTION \\d: ${name}[\\s\\S]*?</section>)`);
  const match = content.match(regex);
  return match ? match[1] : null;
};

let s4 = getSection('ABOUT PREVIEW');
let s5 = getSection('OUR PROCESS');
let s6 = getSection('FEATURED SERVICES');

if(s4 && s5 && s6) {
  // Remove all 3 sections from the original content
  content = content.replace(s4, '###S4###');
  content = content.replace(s5, '###S5###');
  content = content.replace(s6, '###S6###');
  
  // They might have overlapping replacements if my previous PS script duplicated something?
  // Let's just strip everything between SECTION 4 comment and SECTION 7 comment
  const startS4 = content.indexOf('<!-- ==='); // wait, let's find the exact string
}
