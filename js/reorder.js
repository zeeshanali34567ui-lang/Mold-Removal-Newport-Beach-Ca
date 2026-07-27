const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const s4Match = content.match(/(<!-- ===.*?SECTION 4: ABOUT PREVIEW[\s\S]*?)(?=<!-- ===.*?SECTION 5)/);
const s5Match = content.match(/(<!-- ===.*?SECTION 5: OUR PROCESS[\s\S]*?)(?=<!-- ===.*?SECTION 6)/);
const s6Match = content.match(/(<!-- ===.*?SECTION 6: FEATURED SERVICES[\s\S]*?)(?=<!-- ===.*?SECTION 7)/);

if(s4Match && s5Match && s6Match) {
  let before = content.substring(0, s4Match.index);
  let after = content.substring(s6Match.index + s6Match[0].length);
  
  let s4 = s4Match[0];
  let s5 = s5Match[0];
  let s6 = s6Match[0];
  
  // Clean up any incorrect background classes to restore the intended alternating pattern
  s4 = s4.replace(/class="section section--white"/g, 'class="section section--muted"');
  s6 = s6.replace(/class="section section--muted"/g, 'class="section section--white"');
  s5 = s5.replace(/class="section section--white"/g, 'class="section section--muted"');
  
  // Make sure SECTION 6 (now white) is followed by SECTION 5 (now muted)
  // Reorder them: s4 -> s6 -> s5
  let newContent = before + s4 + s6 + s5 + after;
  fs.writeFileSync('index.html', newContent);
  console.log('Sections reordered successfully');
} else {
  console.log('Could not find all sections');
}
