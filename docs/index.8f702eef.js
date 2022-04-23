const inputField=document.getElementById("input"),outputField=document.getElementById("output");function tpl(t,...e){return function(n){let u=t.slice();if(e.forEach(((t,e)=>{u[e]=u[e]+n[t]})),void 0!==n.debug){const t="object"==typeof n.debug&&n.debug.length>0?n.debug.join("\n"):n.debug;u.push(`<br />DEBUG:<br /><pre>${t}</pre>`)}return u.join("")}}const extractDurationPartsRegex=/^(?<days>\d+d(ay(s)?)?)?(((?<hours>\d{1,})[h:]?(?<minutes>\d{1,}(m(in)?)?)?)|((?<frachours>\d*)[\.,](?<hourdecimals>\d*[1-9]+)?0*))?$/i;function convertDurationObjectToMinutes(t){const{days:e,hours:n,minutes:u,frachours:r,hourdecimals:o}=t;return 1440*parseInt(e||"0",10)+60*parseInt(n||r||"0",10)+parseInt(u||"0",10)+60*parseFloat(`0.${o}`||"0.0")}function extractDurationMinutes(t){return function(e){return function(n){const u=t.exec(n);return null==u||void 0===u.groups?0:e(u.groups)}}}const getMinutes=extractDurationMinutes(extractDurationPartsRegex)(convertDurationObjectToMinutes);function minutesToDurations(t){return{days:Math.trunc(t/1440),hours:Math.trunc(t%1440/60),minutes:Math.trunc(t%60)}}function doesRegexMatch(t){return function(e){const n=t.exec(e);return!!(n&&n.length>0)}}const template=tpl`is equivalent to ${"days"} days, ${"hours"} hours and ${"minutes"} minutes`;function renderToHtml(t){return e=>t.innerHTML=e}const display=renderToHtml(outputField),updateDisplay=t=>e=>n=>t(e(n)),updateOutputField=updateDisplay(display)(template);inputField.addEventListener("keyup",(t=>{const e=inputField.value;updateOutputField(minutesToDurations(getMinutes(e)))}));